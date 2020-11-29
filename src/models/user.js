const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const task = require("./task");
//User model with name,email,password and age as properties
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error(" This is not a valid Email ID!! ");
        }
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 7,
      validate(value) {
        if (validator.contains(value.toLowerCase(), "password")) {
          throw new Error(
            " A weak password. A password with numbers and letters is preferred"
          );
        }
      },
    },
    age: {
      type: Number,
      default: 0,
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
    avatar: {
      type: Buffer,
    },
  },
  {
    timestamps: true,
  }
);
// a virtual relationship between user and task model
userSchema.virtual("tasks", {
  ref: "Tasks",
  localField: "_id",
  foreignField: "owner",
});

//hiding user's password and tokens generated
userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.tokens;
  delete userObject.avatar;
  return userObject;
};

//generating user token
//userSchema.methods is used since this function is specific to
//single user
userSchema.methods.generateTokens = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, "secretMessage"); //using jsonwebtoken
  user.tokens = user.tokens.concat({ token }); //add the token generated with the user in database
  await user.save(); //save changes to database
  return token;
};

//user credentials check function
//statics is for general purpose
userSchema.statics.findCredentials = async (email, password) => {
  const user = await User.findOne({ email }); //find the user with given mail
  if (!user) {
    throw new Error("Unable to login");
  }
  const isMatch = await bcrypt.compare(password, user.password); //compare the plain text password with hashed password in database
  if (!isMatch) {
    throw new Error(" Unable to login");
  }
  return user;
};

//function to save the hashed password in db
userSchema.pre("save", async function (next) {
  const user = this; //we are gonna make use of the this operator to use the current object
  if (user.isModified("password")) {
    //if and only if password is changed, hash the password again.
    user.password = await bcrypt.hash(user.password, 8);
  }
  next(); //next is used to tell the server that the operations have been performed
});

//function to delete the tasks whenever a user is deleted
userSchema.pre("remove", async function (next) {
  const user = this;
  await task.deleteMany({ owner: user._id });
  next();
});

const User = mongoose.model("Users", userSchema);

module.exports = User;

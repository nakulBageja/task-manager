const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");


//User model with name,email,password and age as properties
const userSchema = new mongoose.Schema( {
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 3
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error(" This is not a valid Email ID!! ");
      }
    }
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
    }
  },
  age: {
    type: Number,
    default: 0
  }
})

userSchema.pre('save', async function(next){

  const user = this; //we are gonna make use of the this operator to use the current object
  if(user.isModified('password')){ //if and only if password is changed, hash the password again.
    user.password = await bcrypt.hash(user.password,8);
  }
  next(); //next is used to tell the server that the operations have been performed
})


const User = mongoose.model("Users",userSchema);

module.exports = User;

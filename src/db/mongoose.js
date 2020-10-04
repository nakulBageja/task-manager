const mongoose = require("mongoose");
const validator = require("validator");
mongoose.connect("mongodb://127.0.0.1:27017/task-manager-api", {
  useNewUrlParser: true,
  useCreateIndex: true
});

const User = mongoose.model("Users", {
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
      console.log("asdad");
      if (validator.contains(value.toLowerCase(), "password")) {
        throw new Error(
          " A weak password. A password with numbers and letters is preferred"
        );
      }
    }
  },
  age: {
    type: Number
  }
});

// const newUser = new User({
//   name: "Nakul",
//   email: "nbageja@gmail.com",
//   password: "qwerty123",
//   age: 21
// });

// newUser
//   .save()
//   .then(() => {
//     console.log(newUser);
//   })
//   .catch(error => {
//     console.log(error);
//   });

const Tasks = mongoose.model("Tasks", {
  description: {
    type: String,
    trim: true,
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  }
});

const newTask = new Tasks({
  description: "Getting toothpaste"
});

newTask
  .save()
  .then(() => {
    console.log(newTask);
  })
  .catch(error => {
    console.log(error);
  });

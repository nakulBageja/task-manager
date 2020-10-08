const mongoose = require("mongoose");
const validator = require("validator");
//User model with name,email,password and age as properties
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
});

module.exports = User;

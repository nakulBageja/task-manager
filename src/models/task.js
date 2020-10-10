const mongoose = require("mongoose");
//task model made using mongoose
const task = mongoose.model("Tasks", {
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

module.exports = task;

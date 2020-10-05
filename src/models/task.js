const mongoose = require("mongoose");

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

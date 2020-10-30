const express = require("express");
const task = require("../models/task");
const router = new express.Router();
//Use the express.Router class to create modular, mountable route handlers.
// A Router instance is a complete middleware and routing system

/** CREATING TASK */
router.post("/task", async (req, res) => {
  try {
    const newTask = new task(req.body);
    await newTask.save();
    res.status(201).send(newTask);
  } catch (error) {
    res.status(400).send(error);
  }
});

/** SEARCHING FOR TASK  */
router.get("/task", async (req, res) => {
  try {
    const fetchedTasks = await task.find({});
    if (!fetchedTasks || fetchedTasks.length == 0) {
      return res.status(204).send("No Data Found");
    }
    res.send(fetchedTasks);
  } catch (error) {
    res.status(500).send(error);
  }
});
router.get("/task/:description", async (req, res) => {
  try {
    const description = req.params.description;
    const fetchedTask = await task.findOne({ description: description });
    if (!fetchedTask) {
      return res.status(204).send("No Data Found");
    }
    res.send(fetchedTask);
  } catch (error) {
    res.status(500).send(error);
  }
});

/** UPDATING TASKS */

//doing updation operation on tasks taking description as id to identify the task
router.patch("/task/:description", async (req, res) => {
  const operationPerformed = Object.keys(req.body);
  const allowedOperation = ["description", "completed"];
  const operationValidation = operationPerformed.every(operation =>
    allowedOperation.includes(operation)
  );
  if (!operationValidation) {
    res.status(404).send({ error: "Invalid Update" });
  }
  try {
    const updatedTask = await task.findOneAndUpdate(
      { description: req.params.description },
      req.body,
      { runValidators: true, new: true }
    );
    if (!updatedTask) {
      return res.status(204).send({ message: "No task found" });
    }
    res.status(200).send(updatedTask);
  } catch (error) {
    res.status(400).send();
  }
});

/** DELETING TASKS */

router.delete("/task/:description", async (req, res) => {
  try {
    const taskDeleted = await task.findOneAndDelete({
      description: req.params.description
    });
    if (!taskDeleted) {
      res.status(404).send({ message: "No task found" });
    }
    res.status(200).send(taskDeleted);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Server error" });
  }
});

module.exports = router;

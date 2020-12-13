const express = require("express");
const task = require("../models/task");
const auth = require("../middlewares/auth");
const router = new express.Router();
//Use the express.Router class to create modular, mountable route handlers.
// A Router instance is a complete middleware and routing system

/**
 In each route we are passing the auth middleware to authenticate the user which is using the application
 */

/** CREATING TASK */
router.post("/task", auth, async (req, res) => {
  try {
    const newTask = new task({
      ...req.body,
      owner: req.user._id,
    });
    await newTask.save();
    res.status(201).send(newTask);
  } catch (error) {
    res.status(400).send(error);
  }
});

/** SEARCHING FOR TASK  */

/**
  FILTERING DATA USING "MATCH AND OPTIONS " PROPERTY OF POPULATE

  (PAGINATION)
  limit - defines how many tasks will be dislayed at once on the page
  skip - defines how many tasks are to be skipped from start

  (FILTERING USING COMPLETED VALUE)

  (SORTING DATA)
 */
router.get("/task", auth, async (req, res) => {
  const match = {};
  const sort = {};
  if (req.query.completed) {
    match.completed = req.query.completed === "true";
  }

  if (req.query.sortBy) {
    const parts = req.query.sortBy.split(":");
    sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
  }

  try {
    const user = await req.user
      .populate({
        path: "tasks",
        match,
        options: {
          limit: parseInt(req.query.limit),
          skip: parseInt(req.query.skip),
          sort,
        },
      })
      .execPopulate(); //finding all the tasks related to that user
    const fetchedTasks = user.tasks;
    res.render("tasksHome", {
      tasks: fetchedTasks,
      title: "Your Tasks",
      name: "Nakul Bageja",
    });
    //res.status(200).send(fetchedTasks);
  } catch (error) {
    res.status(500).send(error);
  }
});
router.get("/task/:description", auth, async (req, res) => {
  try {
    const description = req.params.description;
    const fetchedTask = await task.findOne({
      description: description,
      owner: req.user._id,
    });
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
router.patch("/task/:description", auth, async (req, res) => {
  console.log(req.body);
  const operationPerformed = Object.keys(req.body);
  console.log(operationPerformed);
  const allowedOperation = ["description", "completed"];
  const operationValidation = operationPerformed.every((operation) =>
    allowedOperation.includes(operation)
  );
  if (!operationValidation) {
    res.status(404).send({ error: "Invalid Update" });
  }
  try {
    const fetchedTask = await task.findOne({
      description: req.params.description,
      owner: req.user._id,
    });
    if (!fetchedTask) {
      return res.status(204).send({ message: "No task found" });
    }
    operationPerformed.forEach(
      (operation) => (fetchedTask[operation] = req.body[operation])
    );
    await fetchedTask.save();
    res.status(200).send(fetchedTask);
  } catch (error) {
    console.log(error);
    res.status(400).send();
  }
});

/** DELETING TASKS */

router.delete("/task/:description", auth, async (req, res) => {
  try {
    const taskDeleted = await task.findOne({
      description: req.params.description,
      owner: req.user._id,
    });
    if (!taskDeleted) {
      res.status(404).send({ message: "No task found" });
    }
    taskDeleted.remove();
    res.status(200).send(taskDeleted);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Server error" });
  }
});

module.exports = router;

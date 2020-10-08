const express = require("express");
require("./db/mongoose"); // Connecting to the database
const users = require("./models/user");
const task = require("./models/task");

const app = express(); //creates a new express application
const port = process.env.PORT || 3000;

app.use(express.json());
//this method configure the middleware used by the routes
//express.json() helps to recognize the incoming req object as JSON object

/** SEARCHING FOR USER AND TASK */

app.get("/user", async (req, res) => {
  try {
    const fetchedUsers = await users.find({}); //awaiting all the users present and storing it
    if (!fetchedUsers || fetchedUsers.length == 0) {
      //if no user is found then return 204 status
      return res.status(204).send("No Data Found"); //this step is important as mongoose will not give an error
    } //if the query ran perfectly
    res.send(fetchedUsers); //if users found send to application
  } catch (error) {
    res.status(500).send(error); //if any error occured in database return status 500
  }
});
app.get("/user/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const fetchedUser = await users.findOne({ email: email }); // finding a user by email id
    //if no user is found then return 204 status this step is important as mongoose will not give an error if the query ran perfectly
    if (!fetchedUser) {
      return res.status(204).send("No Data Found");
    }
    res.send(fetchedUser); //if user found send to application
  } catch (error) {
    res.status(500).send(error); //if any error occured in database return status 500
  }
});

app.get("/task", async (req, res) => {
  try {
    const fetchedTasks = await users.find({});
    if (!fetchedTasks || fetchedTasks.length == 0) {
      return res.status(204).send("No Data Found");
    }
    res.send(fetchedTasks);
  } catch (error) {
    res.status(500).send(error);
  }
});
app.get("/task/:description", async (req, res) => {
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

/** CREATING USER AND TASK */

app.post("/user", async (req, res) => {
  try {
    const newUser = new users(req.body); //creating a new object of user model and sending sent by client
    await newUser.save(); //saving the object in database
    res.status(201).send(newUser); //returning back to the client
  } catch (error) {
    res.status(400).send(error);
  }
});

app.post("/task", async (req, res) => {
  try {
    const newTask = new task(req.body);
    await newTask.save();
    res.status(201).send(newTask);
  } catch (error) {
    res.status(400).send(error);
  }
});

/** UPDATING USER AND TASKS */

app.patch("/user/:email", async (req, res) => {
  const operationPerformed = Object.keys(req.body); //creating an array of updation requested by client
  const allowedOperation = ["name", "email", "age", "password"]; //an array of updation allowed
  const operationValidation = operationPerformed.every(
    //check if client is not trying to update any non-authorized/non-existing field
    operation => allowedOperation.includes(operation)
  );
  if (!operationValidation) {
    //if client is trying to update non-authorized/non-existing field then return 404 status
    res.status(404).send({ error: "Invalid Update" });
  }
  try {
    const updatedUser = await users.findOneAndUpdate(
      { email: req.params.email }, //find the user whose values are to be updated using email
      req.body,
      { runValidators: true, new: true } //run validation of the model and return a modified object
    );
    if (!updatedUser) {
      return res.status(204).send({ message: "No user found" }); //if user with that email doesn't exist then return no content found
    }
    res.status(200).send(updatedUser); //send updated user to client
  } catch (error) {
    res.status(400).send();
  }
});

//doing updation operation on tasks taking description as id to identify the task
app.patch("/task/:description", async (req, res) => {
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
      return res.status(204).send({ message: "No user found" });
    }
    res.status(200).send(updatedTask);
  } catch (error) {
    res.status(400).send();
  }
});

/** If a no url matched then send a 404 */

app.post("/*", (req, res) => {
  res.status(400).send({ error: "BAD REQUEST" });
});
app.get("/*", (req, res) => {
  res.status(400).send({ error: "BAD REQUEST" });
});

app.listen(port, () => {
  console.log("Server running on " + port);
});

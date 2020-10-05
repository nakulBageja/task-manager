const express = require("express");
require("./db/mongoose"); // Connecting to the database
const user = require("./models/user");
const task = require("./models/task");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.post("/user", (req, res) => {
  const newUser = new user(req.body);
  newUser
    .save()
    .then(() => {
      res.status(201).send(newUser);
    })
    .catch(error => {
      res.status(400).send(error);
    });
});
app.post("/task", (req, res) => {
  const newTask = new task(req.body);
  newTask
    .save()
    .then(() => {
      res.status(201).send(newTask);
    })
    .catch(error => {
      res.status(400).send(error);
    });
});
app.post("/*", (req, res) => {
  res.status(400).send("BAD REQUEST");
});

app.listen(port, () => {
  console.log("Server running on " + port);
});

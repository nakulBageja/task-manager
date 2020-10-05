const express = require("express");
require("./db/mongoose"); // Connecting to the database
const user = require("./models/user");
const task = require("./models/task");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

/** SEARCHING FOR USER AND TASK */

app.get("/user", (req, res) => {
  user
    .find({})
    .then(user => {
      if (!user || user.length == 0) {
        return res.status(204).send("No Data Found");
      }
      res.send(user);
    })
    .catch(error => {
      res.status(500).send(error);
    });
});
app.get("/user/:email", (req, res) => {
  const email = req.params.email;
  user
    .findOne({ email: email })
    .then(user => {
      if (!user) {
        return res.status(204).send("No Data Found");
      }
      res.send(user);
    })
    .catch(error => {
      res.status(500).send(error);
    });
});

app.get("/task", (req, res) => {
  task
    .find({})
    .then(task => {
      if (!task || task.length == 0) {
        return res.status(204).send("No Data Found");
      }
      res.send(task);
    })
    .catch(error => {
      res.status(500).send(error);
    });
});
app.get("/task/:description", (req, res) => {
  const description = req.params.description;
  task
    .findOne({ description: description })
    .then(task => {
      if (!task) {
        return res.status(204).send("No Data Found");
      }
      res.send(task);
    })
    .catch(error => {
      res.status(500).send(error);
    });
});

/** CREATING USER AND TASK */

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

/** If a no url matched then send a 404 */

app.post("/*", (req, res) => {
  res.status(400).send("BAD REQUEST");
});
app.get("/*", (req, res) => {
  res.status(400).send("BAD REQUEST");
});

app.listen(port, () => {
  console.log("Server running on " + port);
});

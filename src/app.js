const express = require("express");
require("./db/mongoose");
// Connecting to the database
const userRouter = require("./routers/users");
const taskRouter = require("./routers/tasks");

const app = express();
//creates a new express application

app.use(express.json());
//this method configure the middleware used by the routes
//express.json() helps to recognize the incoming req object as JSON object

app.use(userRouter);
//loading the router module
app.use(taskRouter);
//now app will be able to handle requests

/** If a no url matched then send a 404 */

app.post("/*", (req, res) => {
  res.status(400).send({ error: "BAD REQUEST" });
});
app.get("/*", (req, res) => {
  res.status(400).send({ error: "BAD REQUEST" });
});

module.exports = app;

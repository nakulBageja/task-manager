const express = require("express");
const path = require("path");
const hbs = require("hbs");
const cors = require("cors");
require("./db/mongoose");

const app = express();
// Connecting to the database
const userRouter = require("./routers/users");
const taskRouter = require("./routers/tasks");

app.use(cors()); //allowing cross-origin resource sharing

app.use(express.json());
//this method configure the middleware used by the routes
//express.json() helps to recognize the incoming req object as JSON object

app.get("", (req, res) => {});
app.get("/signUp", (req, res) => {});
app.get("/task", (req, res) => {});

app.use(userRouter);
//loading the router module
app.use(taskRouter);
//now app will be able to handle requests

/** If a no url matched then send a 404 */
app.get("*", (req, res) => {
  res.render("404", {
    title: "404",
    message: "Page not found",
    name: "Nakul Bageja",
  });
});

module.exports = app;

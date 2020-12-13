const express = require("express");
const path = require("path");
const hbs = require("hbs");
const cors = require("cors");
require("./db/mongoose");

const app = express();
// Connecting to the database
const userRouter = require("./routers/users");
const taskRouter = require("./routers/tasks");

//viewsPath
const pathToPublic = path.join(__dirname, "../public");
const viewPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");
app.use(express.static(pathToPublic)); //For displaying static pages

//using handlebars for displaying dynamic pages
//Partials are used for reusing the components
app.set("view engine", "hbs");
app.set("views", viewPath); //(2)
hbs.registerPartials(partialsPath);

app.use(cors()); //allowing cross-origin resource sharing

app.use(express.json());
//this method configure the middleware used by the routes
//express.json() helps to recognize the incoming req object as JSON object

app.get("", (req, res) => {
  res.render("index", {
    //render is used for rendering views and sending them values dynamically
    title: "LOGIN IN",
    name: "Nakul Bageja",
  });
});
app.get("/signUp", (req, res) => {
  res.render("signUp", {
    //render is used for rendering views and sending them values dynamically
    title: "SIGN UP",
    name: "Nakul Bageja",
  });
});

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

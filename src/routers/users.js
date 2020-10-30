const express = require("express");
const users = require("../models/user");
const bcrypt = require('bcrypt');
const router = new express.Router();
//Use the express.Router class to create modular, mountable route handlers.
//A Router instance is a complete middleware and routing system

/** CREATING USER */

router.post("/user", async (req, res) => {
  try {
    console.log(req.body.password);
    req.body.password = await bcrypt.hash(req.body.password,8);
    console.log(req.body.password);
    const newUser = new users(req.body);
     //creating a new object of user model and sending sent by client
    await newUser.save(); 
    //saving the object in database
    res.status(201).send(newUser); 
    //returning back to the client
  } catch (error) {
    res.status(400).send(error);
  }
});

/** SEARCHING FOR USER  */

router.get("/user", async (req, res) => {
  try {
    const fetchedUsers = await users.find({}); 
    //awaiting all the users present and storing it
    if (!fetchedUsers || fetchedUsers.length == 0) {
      //if no user is found then return 204 status
      return res.status(204).send("No Data Found"); 
      //this step is important as mongoose will not give an error
    } //if the query ran perfectly
    res.send(fetchedUsers); 
    //if users found send to routerlication
  } catch (error) {
    res.status(500).send(error); 
    //if any error occured in database return status 500
  }
});
router.get("/user/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const fetchedUser = await users.findOne({ email: email }); 
    // finding a user by email id
    //if no user is found then return 204 status this step is important as mongoose will not give an error if the query ran perfectly
    if (!fetchedUser) {
      return res.status(204).send("No Data Found");
    }
    res.send(fetchedUser); 
    //if user found send to routerlication
  } catch (error) {
    res.status(500).send(error); 
    //if any error occured in database return status 500
  }
});

/** UPDATING USER */

router.patch("/user/:email", async (req, res) => {
  const operationPerformed = Object.keys(req.body); //creating an array of updation requested by client
  const allowedOperation = ["name", "email", "age", "password"]; 
  //an array of updation allowed
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
      { email: req.params.email }, 
      //find the user whose values are to be updated using email
      req.body,
      { runValidators: true, new: true } 
      //run validation of the model and return a modified object
    );
    if (!updatedUser) {
      return res.status(204).send({ message: "No user found" }); 
      //if user with that email doesn't exist then return no content found
    }
    res.status(200).send(updatedUser); 
    //send updated user to client
  } catch (error) {
    res.status(400).send();
  }
});

/** DELETING USER */

router.delete("/user/:email", async (req, res) => {
  try {
    const user = await users.findOneAndDelete({ email: req.params.email });
    if (!user) {
      res.status(404).send({ message: "No user found" });
    }
    res.status(200).send(user);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Server error" });
  }
});

module.exports = router;
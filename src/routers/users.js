const express = require("express");
const upload = require("../middlewares/upload");
const User = require("../models/user");
const auth = require("../middlewares/auth");
const sharp = require("sharp");

const router = new express.Router();
//Use the express.Router class to create modular, mountable route handlers.
//A Router instance is a complete middleware and routing system

/** CREATING USER */

router.post("/user", async (req, res) => {
  try {
    const newUser = new User(req.body);
    //creating a new object of user model and sending sent by client
    await newUser.save();
    //saving the object in database
    const token = await newUser.generateTokens(); //generating token when signedUp
    res.status(201).send({ newUser, token });
    //returning back to the client
  } catch (error) {
    res.status(400).send(error);
  }
});
//user login route
router.post("/user/login", async (req, res) => {
  try {
    const user = await User.findCredentials(req.body.email, req.body.password);
    const token = await user.generateTokens(); //generating token when signedUp
    res.send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
});
//user logout route
router.post("/user/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token != req.token;
    });
    await req.user.save();
    res.status(200).send("Logged Out");
  } catch (error) {
    res.status(500).send(error);
  }
});

//user logoutAll platforms route
router.post("/user/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.status(200).send("Logged Out");
  } catch (error) {
    res.status(500).send(error);
  }
});

/** SEARCHING FOR USER  */

//finding the user profile
router.get("/user/me", auth, async (req, res) => {
  res.status(200).send(req.user);
});

/** UPDATING USER */

router.patch("/user/me", auth, async (req, res) => {
  const operationPerformed = Object.keys(req.body);
  //creating an array of updation requested by client
  const allowedOperation = ["name", "email", "age", "password"];
  //an array of updation allowed
  const operationValidation = operationPerformed.every(
    (operation) => allowedOperation.includes(operation) //check if client is not trying to update any non-authorized/non-existing field
  );
  if (!operationValidation) {
    //if client is trying to update non-authorized/non-exiesting field then return 404 status
    res.status(404).send({ error: "Invalid Update" });
  }
  try {
    const updatedUser = req.user; //user whose value is to be updated
    operationPerformed.forEach(
      (operation) => (updatedUser[operation] = req.body[operation]) //update the user's field
    );
    await updatedUser.save(); // save updated user to database
    res.status(200).send(updatedUser);
    //send updated user to client
  } catch (error) {
    res.status(400).send(error);
  }
});

/** DELETING USER */

router.delete("/user/me", auth, async (req, res) => {
  try {
    req.user.remove();
    //remove the user from database
    res.status(200).send(req.user);
  } catch (error) {
    res.status(500).send({ error: "Server error" });
  }
});

/** ADDING AVATAR */

router.post(
  "/user/me/avatar",
  auth,
  upload.single("avatar"), //multer middleware
  async (req, res) => {
    const buffer = await sharp(req.file.buffer)
      .resize({ width: 250, height: 450 })
      .png()
      .toBuffer();
    req.user.avatar = buffer; //storing the buffer of the file in the database
    await req.user.save();
    res.status(200).send({ message: "Profile picture uploaded" });
  },
  (error, req, res, next) => {
    //by writing this way we can tackle errors in any route handlers
    res.status(400).send({ error: error.message });
  }
);

/** DELETING AVATAR */

router.delete("/user/me/avatar", auth, async (req, res) => {
  try {
    if (req.user.avatar == undefined) {
      throw new Error("No profile uploaded");
    }
    req.user.avatar = undefined;
    await req.user.save();
    res.send();
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

/** FETCHING AVATAR */

router.get("/user/:id/avatar", async (req, res) => {
  try {
    const user = await User.findById(req.params.id); //finding user
    if (!user || !user.avatar) {
      throw new Error("no user found");
    }
    res.set("Content-Type", "image/jpg"); //setting the headers for viewing of image
    res.send(user.avatar);
  } catch (error) {
    res.status(404).send(error);
  }
});

module.exports = router;

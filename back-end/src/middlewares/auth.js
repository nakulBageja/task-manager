//This file contains the middleware function for authentication
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", ""); // fetching the token passed through header and removing the 'bearer ' string
    const decode = jwt.verify(token, process.env.JWT_SECRET); // decode the string by passing the secret message passed when token was generated
    const user = await User.findOne({ _id: decode._id, "tokens.token": token }); //find the user with that corresponding id and token
    if (!user) {
      throw new Error("no user");
    }
    req.token = token;
    req.user = user; // add the user to req property if found
    next(); // move controls to the next middleware
  } catch (e) {
    res.status(401).send({ error: "Please authenticate." });
  }
};

module.exports = auth;

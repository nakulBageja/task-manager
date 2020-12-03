const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/user");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const userOneID = new mongoose.Types.ObjectId();

const userOne = {
  _id: userOneID,
  name: "nakul",
  password: "Nakul@10",
  email: "xyz@gmail.com",
  tokens: [
    {
      token: jwt.sign({ _id: userOneID }, process.env.JWT_SECRET),
    },
  ],
};
//deleting all the records from the database before testing
//and creating a record before hand to test login
beforeEach(async () => {
  await User.deleteMany();
  await new User(userOne).save();
});

test("Trying the user creation", async () => {
  await request(app)
    .post("/user")
    .send({
      name: "zyz",
      password: "Nakul@10",
      email: "zyz@gmail.com",
    })
    .expect(201);
});

test("Trying login", async () => {
  await request(app).post("/user/login").send(userOne).expect(200);
});

test("Trying to break login", async () => {
  await request(app)
    .post("/user/login")
    .send({
      email: "sada@gmail.com",
      password: "noPassword",
    })
    .expect(400);
});

test("Testing authentication", async () => {
  await request(app)
    .get("/user/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
});
//delete user
test("Test Deleting user", async () => {
  await request(app)
    .delete("/user/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
});

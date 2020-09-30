//CRUD - create read update delete

// const MongoDb = require("mongodb"); //npm module
// const MongoClient = MongoDb.MongoClient;
// const ObjectId = MongoDb.ObjectID;

const { MongoClient, ObjectID } = require("mongodb"); //ES6 method || destructuring

const connectionUrl = "mongodb://127.0.0.1:27017";
const databaseName = "task-manager";

//Connecting to the database

MongoClient.connect(
  connectionUrl,
  { useNewUrlParser: true }, //to remove the warning add (useUnifiedTopology: true) along side useNewUrlParser
  (error, client) => {
    if (error) {
      return console.log("ERROR OCCURED");
    }
    console.log("CONNECTED TO DATABASE");

    const db = client.db(databaseName);
    //Inserting first doc into the database

    //Inserting one data at a time
    // db.collection("users").insertOne(
    //   {
    //     name: "Nakul",
    //     age: 21
    //   },
    //   (error, result) => {
    //     if (error) {
    //       return console.log("Error during insertion");
    //     }
    //     console.log(result.ops);
    //   }
    // );

    //Inserting more than one
    // db.collection("task").insertMany(
    //   [
    //     {
    //       task: "Do laundary",
    //       Status: "Incomplete"
    //     },
    //     {
    //       task: "Watch Udemy Course",
    //       Status: "Completed"
    //     },
    //     {
    //       task: "Take a bath",
    //       Status: "Incomplete"
    //     }
    //   ],
    //   (error, result) => {
    //     if (error) {
    //       return console.log("Error during insertion");
    //     }
    //     console.log(result.ops);
    //   }
    // );

    //Finding a document in collection using findOne or findMany
    // db.collection("users").findOne(
    //   {
    //     //if you want to search according to ID
    //     //Then this is the method to since ID is not string but binary
    //     _id: new ObjectID("5f74788dadf4c23c84314de7")
    //   },
    //   (error, user) => {
    //     if (error) {
    //       return console.log("ERROR");
    //     }
    //     console.log(user);
    //   }
    // );

    //Finding all the tasks whose status is incomplete from tasks collection
    //Using find function
    db.collection("task")
      .find({ Status: "Incomplete" })
      .count((error, count) => {
        console.log(count);
      });
  }
);

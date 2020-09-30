//CRUD - create read update delete

const MongoDb = require("mongodb"); //npm module
const MongoClient = MongoDb.MongoClient;

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
    db.collection("users").insertOne({
      name: "Nakul",
      age: 21
    });
  }
);

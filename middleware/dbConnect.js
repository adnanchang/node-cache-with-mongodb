/**
 * This file contains the connection code to a MongoDB instance
 * and also any and all config that needs to be applied for that
 * connection
 */

const mongoose = require("mongoose");

// Variables for connecting to the Database
const DB_PORT = 27017;
const DB_NAME = "fashionCloud";
const DB_URL = "localhost";

// Setup connection to the database
mongoose.connect(`mongodb://${DB_URL}:${DB_PORT}/${DB_NAME}`, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

let db = mongoose.connection;

// Check connection
db.once("open", () => {
  console.log(`Connected to MongoDB: ${DB_NAME}`);
});

// Check for errors
db.on("error", (err) => {
  console.log(err);
});

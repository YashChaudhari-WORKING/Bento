require("dotenv").config();
const mongoose = require("mongoose");

mongoose
  .connect(process.env.MongoURL)
  .then(() => console.log("Connected to MongoDB!"))
  .catch((error) => console.error("Connection error:", error));

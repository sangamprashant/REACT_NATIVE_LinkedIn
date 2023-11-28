require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const cors = require("cors")

const app = express();
const port = 8000;

// Middleware
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// MongoDB Connection (replace 'your_database_url' with your actual MongoDB URL)
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: process.env.MONGO_DB
});
const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

require("./models/user");
require("./models/post");
app.use(require("./router/user"));
app.use(require("./router/post"));

// Your additional routes and logic go here

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

const express = require("express");
const mongoose = require("mongoose");
const User = require("./db/Users");
const app = express();
var cors = require("cors");

app.use(cors());
try {
  mongoose.connect("mongodb://127.0.0.1:27017/e-comm", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const db = mongoose.connection;

  db.on("error", (error) => {
    console.error("MongoDB connection error:", error);
  });

  db.once("open", () => {
    console.log("Connected to MongoDB");
  });

  app.listen(5000, () => {
    console.log("Server Running");
  });
} catch (error) {
  console.error("Error connecting to MongoDB:", error);
}

app.use(express.json());
app.post("/register", (req, res) => {
  User.create(req.body)
    .then((user) => res.json(user))
    .catch((err) => res.json(err));
});

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
    .then((user) => {
      // Exclude the password field from the response
      const { password, ...userWithoutPassword } = user.toObject();
      res.json(userWithoutPassword);
    })
    .catch((err) => res.json(err));
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email and password
    const user = await User.findOne({ email, password }).select("-password");

    if (user) {
      // User found, send the user details (excluding password) as response
      res.json(user);
    } else {
      // User not found or incorrect credentials
      res.status(401).json({ error: "Invalid credentials" });
    }
  } catch (error) {
    // Handle other errors
    console.error("Login failed:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const express = require("express");
const mongoose = require("mongoose");
const User = require("./db/Users");
const Product = require("./db/Product");
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

app.post("/add-product", async (req, res) => {
  try {
    // Assuming Product.create returns a Promise
    const result = await Product.create(req.body);
    res.send(result); // Send the result back to the client
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/products", async (req, resp) => {
  try {
    const products = await Product.find();

    if (products.length > 0) {
      resp.json(products); // Use resp.json() to send the array as JSON
    } else {
      resp.send("No data available");
    }
  } catch (error) {
    console.error("Error fetching products:", error);
    resp.status(500).send("Internal Server Error");
  }
});

app.delete("/product/:id", async (req, resp) => {
  const result = await Product.deleteOne({ _id: req.params.id });
  resp.send(result);
});

app.get("/product/:id", async (req, resp) => {
  const productId = req.params.id; // Retrieve the product ID from the request parameters
  try {
    const result = await Product.findOne({ _id: productId });
    if (result) {
      resp.json(result); // Use resp.json() to send the result as JSON
    } else {
      resp.send("No data available");
    }
  } catch (error) {
    resp.status(500).send("Internal Server Error");
  }
});

app.put("/product/:id", async (req, resp) => {
  try {
    const result = await Product.updateOne(
      { _id: req.params.id },
      { $set: req.body }
    );
    resp.send(result);
  } catch (error) {
    resp.status(500).send("Internal Server Error");
  }
});

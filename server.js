const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path"); // Import path for serving static files

require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Serve static files from the 'assets/ProductPhoto' directory
app.use("/images", express.static(path.join(__dirname, "./assets/ProductPhoto")));

const uri = process.env.MONGODB_URI;

mongoose
  .connect(uri)
  .then(() => {
    const db = mongoose.connection.db;
    console.log("Connected to database:", db.databaseName);
  })
  .catch((error) => console.error("Database connection error:", error));

const productsRouter = require("./routes/products");
const usersRouter = require("./routes/users");
const orderRoutes = require("./routes/orders");

app.use("/products", productsRouter);
app.use("/users", usersRouter);
app.use("/orders", orderRoutes); // Use the orders routes

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

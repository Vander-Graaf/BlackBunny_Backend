const path = require("path"); // Make sure to require 'path' at the top
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = process.env.MONGODB_URI;

mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    const db = mongoose.connection.db;
    console.log("Connected to database:", db.databaseName); // Logs the connected database name
  })
  .catch((error) => console.error("Database connection error:", error));

const productsRouter = require("./routes/products");
const usersRouter = require("./routes/users");

app.use("/products", productsRouter);
app.use("/users", usersRouter);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

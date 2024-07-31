const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path"); // Make sure to require 'path' at the top

require("dotenv").config();

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://Vander:Qq9JsBUOi7WKeM72@store.z3zyqyw.mongodb.net/";

mongoose
  .connect(uri)
  .then(() => {
    console.log("MongoDB database connection established successfully");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

const productsRouter = require("./routes/products");
const usersRouter = require("./routes/users");

app.use("/products", productsRouter);
app.use("/users", usersRouter);

if (process.env.NODE_ENV === "production" || process.env.NODE_ENV === "staging") {
  app.use(express.static(path.join(__dirname, "client", "build"))); // Use 'path.join' for better cross-platform compatibility

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

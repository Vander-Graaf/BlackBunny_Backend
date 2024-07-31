const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

require("dotenv").config();

const app = express();

const port = 5000;
const allowedOrigins = ["https://blackbunny.onrender.com"];

app.use(
  cors({
    origin: (origin, callback) => {
      if (allowedOrigins.includes(origin) || !origin) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);
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

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

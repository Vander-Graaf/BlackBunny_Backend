//server.js

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path"); // Import path for serving static files

require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

//const allowedOrigins = process.env.DEVELOPMENT
//  ? ["http://localhost:5173"]
//  : ["https://blackbunny-46eb.onrender.com"];
//
app.use(express.json());

app.use(
  cors({
    origin: ["https://blackbunny-46eb.onrender.com"], // Укажите нужные домены
    credentials: true,
  })
);

const fs = require("fs");
const uploadDir = "/data/upload";

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log("Папка создана:", uploadDir);
}
// Serve static files from the 'assets/ProductPhoto' directory
app.use("/images", express.static(uploadDir));

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

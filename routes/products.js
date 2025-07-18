const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const product = require("../models/product.model");

const router = express.Router();

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../assets/disk");
    // Ensure the directory exists
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// Route to get all products
router.route("/").get((req, res) => {
  product
    .find()
    .then((products) => res.json(products))
    .catch((err) => {
      console.error("Error fetching products:", err);
      res.status(500).json("Error fetching products");
    });
});

// Route to add a new product
router.route("/add").post(upload.single("image"), (req, res) => {
  const { productname, description, price } = req.body;
  const image = req.file ? req.file.filename : "";

  const newProduct = new product({ productname, description, price, image });

  newProduct
    .save()
    .then(() => res.json("Product added!"))
    .catch((err) => {
      console.error("Error adding product:", err);
      res.status(500).json("Error adding product");
    });
});

// Route to get a single product by ID
router.route("/:id").get((req, res) => {
  product
    .findById(req.params.id)
    .then((product) => {
      if (product) {
        res.json(product);
      } else {
        res.status(404).json("Product not found");
      }
    })
    .catch((err) => {
      console.error("Error fetching product:", err);
      res.status(500).json("Error fetching product");
    });
});

// Route to delete a product by ID
router.route("/:id").delete(async (req, res) => {
  try {
    const productToDelete = await product.findById(req.params.id);
    if (!productToDelete) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Delete the product from the database
    await product.findByIdAndDelete(req.params.id);

    // Delete the product image file if it exists
    if (productToDelete.image) {
      const filePath = path.join(__dirname, "../assets/disk", productToDelete.image);
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error("Error deleting file:", err);
        }
      });
    }

    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error("Error deleting product:", err);
    res.status(500).json({ message: "Error deleting product" });
  }
});

// Route for admin login
router.route("/admin/login").post((req, res) => {
  const { password } = req.body;
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
  if (password === ADMIN_PASSWORD) {
    res.json({ authenticated: true });
  } else {
    res.status(401).json({ authenticated: false });
  }
});

router.route("/:id").put(upload.single("image"), async (req, res) => {
  const { productname, description, price } = req.body;
  const newImage = req.file ? req.file.filename : req.body.image;

  try {
    // Find the existing product
    const existingProduct = await product.findById(req.params.id);
    if (!existingProduct) {
      return res.status(404).json("Product not found");
    }

    // If there's a new image and it's different from the existing one, handle deletion
    if (req.file && existingProduct.image && newImage !== existingProduct.image) {
      const oldFilePath = path.join(__dirname, "../assets/disk", existingProduct.image);
      fs.access(oldFilePath, fs.constants.F_OK, (err) => {
        if (!err) {
          fs.unlink(oldFilePath, (err) => {
            if (err) {
              console.error("Error deleting old image:", err);
            } else {
              console.log(`Old image ${existingProduct.image} deleted successfully`);
            }
          });
        } else {
          console.log(`Old image ${existingProduct.image} not found`);
        }
      });
    }

    // Update the product with the new image or retain the old one if no new image is provided
    const updatedProduct = await product.findByIdAndUpdate(
      req.params.id,
      { productname, description, price, image: newImage },
      { new: true }
    );

    res.json(updatedProduct);
  } catch (err) {
    console.error("Error updating product:", err);
    res.status(500).json("Error updating product");
  }
});

module.exports = router;

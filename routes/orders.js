const express = require("express");
const router = express.Router();
const Order = require("../models/order.model"); // Ensure this points to your Order model

// Route to get all orders
router.route("/").get((req, res) => {
  Order.find()
    .then((orders) => res.json(orders))
    .catch((err) => {
      console.error("Error fetching orders:", err);
      res.status(500).json("Error fetching orders");
    });
});

// Route to add a new order
router.post("/", (req, res) => {
  console.log("Request body:", req.body); // Log request body for debugging

  const { totalPrice, customerName, address, phone } = req.body;

  // Validate required fields
  if (!totalPrice || !customerName || !address || !phone) {
    return res.status(400).json("All fields are required");
  }

  const newOrder = new Order({ totalPrice, customerName, address, phone });

  newOrder
    .save()
    .then(() => res.json("Order placed!"))
    .catch((err) => {
      console.error("Error placing order:", err);
      res.status(500).json({ error: "Error placing order", details: err.message });
    });
});

// Route to delete an order by ID
router.route("/:id").delete(async (req, res) => {
  try {
    const orderToDelete = await Order.findById(req.params.id);
    if (!orderToDelete) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Delete the order from the database
    await Order.findByIdAndDelete(req.params.id);

    res.json({ message: "Order deleted successfully" });
  } catch (err) {
    console.error("Error deleting order:", err);
    res.status(500).json({ message: "Error deleting order" });
  }
});

// Route to update an existing order
router.route("/:id").put(async (req, res) => {
  const { totalPrice, name, address, phone } = req.body;

  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { totalPrice, name, address, phone },
      { new: true }
    );

    if (updatedOrder) {
      res.json(updatedOrder);
    } else {
      res.status(404).json("Order not found");
    }
  } catch (err) {
    console.error("Error updating order:", err);
    res.status(500).json("Error updating order");
  }
});

module.exports = router;

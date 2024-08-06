// routes/orders.js
const express = require("express");
const router = express.Router();
const Order = require("../models/order.model");

// Function to generate a 6-digit order code
const generateOrderCode = () => {
  return ("000000" + Math.floor(Math.random() * 1000000)).slice(-6);
};

// Route to get all orders
router.get("/", (req, res) => {
  Order.find()
    .then((orders) => res.json(orders))
    .catch((err) => {
      console.error("Error fetching orders:", err);
      res.status(500).json("Error fetching orders");
    });
});

// Route to add a new order
router.post("/", (req, res) => {
  const { totalPrice, customerName, address, phone, products } = req.body;

  if (!totalPrice || !customerName || !address || !phone || !products) {
    return res.status(400).json("All fields are required");
  }

  const newOrder = new Order({
    totalPrice,
    customerName,
    address,
    phone,
    products,
    orderCode: generateOrderCode(), // Use the function here
  });

  newOrder
    .save()
    .then(() => res.json({ message: "Order placed!", orderCode: newOrder.orderCode }))
    .catch((err) => {
      console.error("Error placing order:", err);
      res.status(500).json({ error: "Error placing order", details: err.message });
    });
});

// Route to get a specific order by orderCode
router.get("/:orderCode", async (req, res) => {
  try {
    const order = await Order.findOne({ orderCode: req.params.orderCode });
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json(order);
  } catch (err) {
    console.error("Error fetching order:", err);
    res.status(500).json({ message: "Error fetching order" });
  }
});

// Route to update an order status
router.patch("/:orderCode", async (req, res) => {
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ message: "Status is required" });
  }

  try {
    const order = await Order.findOneAndUpdate(
      { orderCode: req.params.orderCode },
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (err) {
    console.error("Error updating order status:", err);
    res.status(500).json({ message: "Error updating order status" });
  }
});

// Route to delete an order by orderCode
router.delete("/:orderCode", async (req, res) => {
  try {
    const result = await Order.findOneAndDelete({ orderCode: req.params.orderCode });
    if (!result) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json({ message: "Order deleted" });
  } catch (err) {
    console.error("Error deleting order:", err);
    res.status(500).json({ message: "Error deleting order" });
  }
});

module.exports = router;

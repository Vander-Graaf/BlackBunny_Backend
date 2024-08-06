const express = require("express");
const router = express.Router();
const Order = require("../models/order.model"); // Ensure this points to your Order model

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
const generateOrderCode = () => {
  // Generate a 6-digit random number
  return Math.floor(100000 + Math.random() * 900000).toString();
};

router.post("/", (req, res) => {
  const { totalPrice, customerName, address, phone, products } = req.body;

  // Validate required fields
  if (!totalPrice || !customerName || !address || !phone || !products) {
    return res.status(400).json("All fields are required");
  }

  const newOrder = new Order({
    totalPrice,
    customerName,
    address,
    phone,
    products,
    orderCode: generateOrderCode(), // Add the generated order code
  });

  newOrder
    .save()
    .then(() => res.json({ message: "Order placed!", orderCode: newOrder.orderCode })) // Return orderCode in response
    .catch((err) => {
      console.error("Error placing order:", err);
      res.status(500).json({ error: "Error placing order", details: err.message });
    });
});

// Route to get a specific order by orderCode
router.get("/:orderCode", async (req, res) => {
  try {
    const order = await Order.findOne({ orderCode: req.params.orderCode }); // Find by orderCode
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json(order);
  } catch (err) {
    console.error("Error fetching order:", err);
    res.status(500).json({ message: "Error fetching order" });
  }
});

module.exports = router;

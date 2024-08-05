const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  totalPrice: { type: Number, required: true },
  customerName: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;

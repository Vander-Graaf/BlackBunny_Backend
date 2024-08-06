const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  products: [
    {
      _id: mongoose.Schema.Types.ObjectId,
      productname: String,
      price: Number,
      quantity: Number,
      image: String,
    },
  ],
  orderCode: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now, // Automatically set to the current date and time
  },
});

const Order = mongoose.model("Order", OrderSchema);

module.exports = Order;

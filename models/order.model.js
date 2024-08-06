// models/order.model.js
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  totalPrice: Number,
  customerName: String,
  address: String,
  phone: String,
  products: [
    {
      productname: String,
      price: Number,
      quantity: Number,
      image: String,
      _id: mongoose.Schema.Types.ObjectId,
    },
  ],
  orderCode: String,
  status: {
    type: String,
    enum: ["Ожидание", "выполнен", "отклонен"],
    default: "Ожидание",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Order", orderSchema);

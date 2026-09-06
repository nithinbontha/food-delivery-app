const mongoose = require('mongoose');

// User Authentication Blueprint
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
}, { timestamps: true });

// Food Items Inventory Blueprint
const foodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true }
});

// Checkout Order Management Blueprint
const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: Array,
  amount: { type: Number, required: true },
  status: { type: String, default: "Processing" }
}, { timestamps: true });

module.exports = {
  User: mongoose.model('User', userSchema),
  Food: mongoose.model('Food', foodSchema),
  Order: mongoose.model('Order', orderSchema)
};

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { User, Food, Order } = require('./models');

const app = express();
app.use(express.json());
app.use(cors());

// Localhost connection or fallback mock database cluster URL
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/foodApp";

mongoose.connect(MONGO_URI)
  .then(() => console.log("Database Node successfully mapped."))
  .catch(err => console.error("Database connection fault:", err));

// Database seeding engine to ensure you have food items out-of-the-box
async function seedDatabase() {
  const count = await Food.countDocuments();
  if (count === 0) {
    await Food.insertMany([
      { name: "Margherita Pizza", description: "Classic cheese and tomato pizza", price: 12.99, category: "Pizza" },
      { name: "Crispy Chicken Burger", description: "Fried chicken breast with lettuce & mayo", price: 8.99, category: "Burgers" },
      { name: "Caesar Salad", description: "Fresh romaine lettuce with Caesar dressing", price: 7.49, category: "Salads" }
    ]);
    console.log("Database successfully seeded with demo items.");
  }
}
seedDatabase();

// API Endpoints
app.get('/api/food/list', async (req, res) => {
  try {
    const list = await Food.find({});
    res.json({ success: true, data: list });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/order/place', async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    await newOrder.save();
    res.json({ success: true, message: "Order stored securely!", orderId: newOrder._id });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Active API Channel running on port: ${PORT}`));

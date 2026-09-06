const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Crash-proof In-Memory Product Database (Swiggy/Zomato/Zepto Style)
const itemsDatabase = [
  { id: "1", name: "Hyderabadi Chicken Biryani", description: "Authentic slow-cooked basmati rice with spiced chicken and saffron.", price: 14.49, category: "Biryani", eta: "25 mins" },
  { id: "2", name: "Paneer Butter Masala", description: "Soft cottage cheese cubes cooked in a rich tomato butter gravy.", price: 11.99, category: "North Indian", eta: "30 mins" },
  { id: "3", name: "Crispy Peri-Peri Burger", description: "Fried spicy chicken breast, layered lettuce, peri-peri glaze.", price: 8.49, category: "Fast Food", eta: "15 mins" },
  { id: "4", name: "Farmhouse Loaded Pizza", description: "Double cheese base topped with crisp capsicum, mushrooms, and onions.", price: 13.99, category: "Fast Food", eta: "20 mins" },
  { id: "5", name: "Fresh Hass Avocados (Pack of 2)", description: "Perfectly ripe, creamy, ready-to-eat imported fresh avocados.", price: 4.99, category: "Zepto Groceries", eta: "9 mins" },
  { id: "6", name: "Organic Whole Milk (1L)", description: "Pasteurized, farm-fresh whole milk sourced locally.", price: 2.29, category: "Zepto Groceries", eta: "7 mins" },
  { id: "7", name: "Chocolate Fudge Brownie", description: "Rich cocoa fudge cake covered in warm chocolate ganache.", price: 4.99, category: "Desserts", eta: "12 mins" }
];

// Memory bank to securely retain submitted checkout entries
let activeOrders = [];

// API Endpoints
app.get('/api/food/list', (req, res) => {
  res.json({ success: true, data: itemsDatabase });
});

app.post('/api/order/place', (req, res) => {
  const newOrder = {
    id: "ORD_" + Date.now(),
    items: req.body.items,
    amount: req.body.amount,
    status: "Order Placed",
    timestamp: new Date()
  };
  activeOrders.push(newOrder);
  console.log(`📦 [Server Info] New order registered successfully: ${newOrder.id}`);
  res.json({ success: true, message: "Order placed successfully!", orderId: newOrder.id });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log("=========================================");
  console.log(`🚀 CRASH-PROOF BACKEND IS RUNNING LIVE`);
  console.log(`📡 URL Connection Endpoint: http://localhost:${PORT}`);
  console.log("=========================================");
});

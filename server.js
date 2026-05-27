const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// In-memory "Databases"
const users = []; 
const orders = [];
const products = [
    { id: 1, name: "High-Performance Laptop", price: "$1,200", image: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=300&q=80" },
    { id: 2, name: "Mechanical Keyboard", price: "$150", image: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=300&q=80" },
    { id: 3, name: "Wireless Headphones", price: "$200", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&q=80" }
];

// Register Endpoint
app.post('/api/register', (req, res) => {
    const { username, password, role } = req.body;
    if (users.find(u => u.username === username)) {
        return res.status(400).json({ message: "User already exists" });
    }
    users.push({ username, password, role });
    res.json({ message: "Registration successful!" });
});

// Login Endpoint
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        res.json({ message: "Login successful", role: user.role, username: user.username });
    } else {
        res.status(401).json({ message: "Invalid credentials" });
    }
});

// Fetch Products
app.get('/api/products', (req, res) => {
    res.json(products);
});

// Place an Order (Purchaser)
app.post('/api/orders', (req, res) => {
    const { purchaser, productId } = req.body;
    const product = products.find(p => p.id === productId);
    
    const newOrder = {
        orderId: Math.floor(Math.random() * 10000),
        purchaser,
        productName: product.name,
        price: product.price,
        status: "Pending Notification to Seller",
        date: new Date().toLocaleTimeString()
    };
    
    orders.push(newOrder);
    res.json({ message: "Order placed successfully!", order: newOrder });
});

// Fetch Orders (Seller)
app.get('/api/orders', (req, res) => {
    res.json(orders);
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
require("dotenv").config();
const path = require("path");

const authRoutes = require("./routes/authRoutes"); // Import your authRoutes

const app = express();
app.use(cors());
app.use(express.json());

// Connect to the database
connectDB();

// Serve static files from the "uploads" folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/auth", authRoutes); // Use the authRoutes for `/api/auth` endpoint

// Test route for protected API
const authMiddleware = require("./middleware/authMiddleware");
app.get("/api/protected", authMiddleware, (req, res) => {
  res.json({ message: `Welcome user ${req.user.id}` });
});

// Catalog and Orders Routes
const catalogRoutes = require("./routes/catalogRoutes");
app.use("/api/catalog", catalogRoutes);

const orderRoutes = require("./routes/orderRoutes");
app.use("/api/orders", orderRoutes);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "client/build")));

// Catch-all route to serve React's index.html for unmatched routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client/build", "index.html"));
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes"); // Import your authRoutes

const app = express();
app.use(cors());
app.use(express.json());

// Connect to the database
connectDB();

// Routes
app.use("/api/auth", authRoutes); // Use the authRoutes for `/api/auth` endpoint

// Test route for protected API
const authMiddleware = require("./middleware/authMiddleware");
app.get("/api/protected", authMiddleware, (req, res) => {
  res.json({ message: `Welcome user ${req.user.id}` });
});

// Default route
app.get("/", (req, res) => {
  res.send("Backend is running!!!");
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

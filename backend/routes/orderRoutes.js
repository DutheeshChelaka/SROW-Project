const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// Get customer-specific orders
router.get("/customer", authMiddleware, async (req, res) => {
  try {
    // Fetch orders for the logged-in user
    const orders = await Order.find({ user: req.user.id }).sort({
      createdAt: -1,
    });
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching customer orders:", error);
    res
      .status(500)
      .json({ message: "Error fetching orders. Please try again." });
  }
});

// Create a new order
// Create a new order
// Create a new order
router.post("/", authMiddleware, async (req, res) => {
  try {
    const {
      user,
      items,
      totalLKR,
      totalJPY,
      selectedCurrency,
      userDetails,
      paymentMethod,
    } = req.body;

    console.log("📥 Received Order Data:", JSON.stringify(req.body, null, 2));

    // Validate required fields
    if (
      !user ||
      !items ||
      (!totalLKR && !totalJPY) || // Ensure at least one total is present
      !selectedCurrency ||
      !userDetails ||
      !paymentMethod
    ) {
      console.error("❌ Missing required fields:", req.body);
      return res
        .status(400)
        .json({ message: "Missing required fields", receivedData: req.body });
    }

    // Store selectedCurrency to ensure correct currency display
    const order = new Order({
      user,
      items: items.map((item) => ({
        productId: item.productId,
        name: item.name,
        size: item.size,
        quantity: item.quantity,
        priceLKR: item.priceLKR ?? 0,
        priceJPY: item.priceJPY ?? 0,
      })),
      totalLKR: totalLKR ?? 0,
      totalJPY: totalJPY ?? 0,
      selectedCurrency, // ✅ Ensure currency is stored
      userDetails,
      paymentMethod,
    });

    // Save to database
    const savedOrder = await order.save();
    res
      .status(201)
      .json({ message: "✅ Order placed successfully", order: savedOrder });
  } catch (error) {
    console.error("❌ Error creating order:", error);
    res.status(500).json({ message: "Error creating order", error });
  }
});

// Get all orders for the logged-in user
// Get all orders for Admin
router.get("/", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    // Fetch all orders with user details
    const orders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    // Adjust total based on selectedCurrency
    const updatedOrders = orders.map((order) => ({
      ...order._doc,
      displayTotal:
        order.selectedCurrency === "JPY"
          ? order.totalJPY ?? 0 // Display JPY total if selected
          : order.totalLKR ?? 0, // Otherwise, show LKR
    }));

    res.status(200).json(updatedOrders);
  } catch (error) {
    console.error("❌ Error fetching orders:", error);
    res.status(500).json({ message: "Error fetching orders", error });
  }
});

// Get all orders for admin
router.get("/admin", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email") // Populate user details
      .sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders for admin:", error);
    res.status(500).json({ message: "Error fetching orders", error });
  }
});

// Update order status (admin only)
router.put("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: "Error updating order status" });
  }
});

// Delete an order (admin only)
router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ message: "Error deleting order", error });
  }
});

// Get order details for a specific order (admin only)
router.get("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name email") // Populate user details
      .populate("items.productId", "name price"); // Populate product details

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error("Error fetching order details:", error);
    res.status(500).json({ message: "Error fetching order details", error });
  }
});

// Get all customer-specific orders (customer view)
router.get("/customer", authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching customer orders:", error);
    res
      .status(500)
      .json({ message: "Error fetching orders. Please try again." });
  }
});

module.exports = router;

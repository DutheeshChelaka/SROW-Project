const jwt = require("jsonwebtoken");
const User = require("../models/User"); // Ensure User model is imported

const authMiddleware = async (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader) {
    return res.status(401).json({ message: "Authorization header is missing" });
  }

  const token = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : authHeader;

  if (!token) {
    return res
      .status(401)
      .json({ message: "No token provided, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded.id) {
      console.error("❌ Decoded token does not contain user ID!");
      return res
        .status(401)
        .json({ message: "Invalid token: No user ID found" });
    }

    // ✅ Fetch user from the database to get the role
    const user = await User.findById(decoded.id).select("role");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = { id: decoded.id, role: user.role }; // ✅ Store ID & Role
    console.log("✅ Authenticated User ID:", req.user.id);
    console.log("✅ User Role:", req.user.role);

    next();
  } catch (err) {
    console.error("Token verification failed:", err.message);
    res.status(401).json({ message: "Token is not valid" });
  }
};

module.exports = authMiddleware;

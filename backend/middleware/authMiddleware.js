const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader) {
    return res.status(401).json({ message: "Authorization header is missing" });
  }

  // Check for Bearer token format
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : authHeader;

  if (!token) {
    return res
      .status(401)
      .json({ message: "No token provided, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Decode and verify token
    req.user = decoded; // Attach user data to the request object
    next(); // Pass control to the next middleware
  } catch (err) {
    console.error("Token verification failed:", err.message); // Optional logging
    res.status(401).json({ message: "Token is not valid" });
  }
};

module.exports = authMiddleware;

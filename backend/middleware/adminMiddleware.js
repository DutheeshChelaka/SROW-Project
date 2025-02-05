const adminMiddleware = (req, res, next) => {
  console.log("🔎 Checking Admin Middleware for User:", req.user);

  if (!req.user || req.user.role !== "admin") {
    console.error("❌ Access denied: Admins only");
    return res.status(403).json({ message: "Access denied: Admins only" });
  }

  console.log("✅ Admin access granted");
  next();
};

module.exports = adminMiddleware;

const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
//payload
// @route   POST /api/auth/signup
router.post(
  "/signup",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ message: "User already exists" });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const verificationToken = jwt.sign({ email }, process.env.JWT_SECRET, {
        expiresIn: "1h", // Token valid for 1 hour
      });

      user = new User({
        name,
        email,
        password: hashedPassword,
        verificationToken,
      });

      await user.save();

      // Send verification email
      const verificationLink = `${process.env.CLIENT_URL}/verify-email?token=${verificationToken}`;

      const emailHTML = `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
    <div style="text-align: center;">
      <img src="https://srow.store/logo/Logo.png" alt="Company Logo" style="max-width: 150px; margin-bottom: 20px;">
    </div>
    <h2 style="color: #1A1A2E; text-align: center;">Welcome to Our SROW Clothing!</h2>
    <p style="font-size: 16px; color: #333;">
      Hi <strong>${name}</strong>, <br><br>
      Thank you for signing up! Please verify your email address to activate your account.
    </p>
    <div style="text-align: center; margin: 20px 0;">
      <a href="${verificationLink}" 
         style="background-color:rgb(105, 69, 233); color: #fff; text-decoration: none; padding: 12px 20px; border-radius: 5px; font-size: 16px; font-weight: bold;">
        Verify Email
      </a>
    </div>
    <p style="font-size: 14px; color: #666;">
      If you did not create this account, please ignore this email.
    </p>
    <hr style="border: 0; height: 1px; background: #ddd; margin: 20px 0;">
    <p style="text-align: center; font-size: 12px; color: #888;">
      &copy; ${new Date().getFullYear()} SROW | All Rights Reserved
    </p>
  </div>
`;

      await transporter.sendMail({
        from: `"SROW" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Confirm Your Email Address",
        html: emailHTML,
      });

      res
        .status(201)
        .json({ message: "Signup successful! Please verify your email." });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

router.get("/verify-email", async (req, res) => {
  const { token } = req.query;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token
    const user = await User.findOne({ email: decoded.email });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token." });
    }

    user.isVerified = true; // Mark email as verified
    user.verificationToken = null; // Clear the token
    await user.save();

    res.status(200).json({ message: "Email verified successfully!" });
  } catch (error) {
    console.error("Error verifying email:", error);
    res.status(500).json({ message: "Error verifying email", error });
  }
});

// Track failed login attempts
const loginAttempts = new Map(); // { email: { count, lastAttempt } }

// Middleware to check login attempts (rate limiting)
const checkLoginAttempts = (req, res, next) => {
  const { email } = req.body;
  const userAttempts = loginAttempts.get(email) || {
    count: 0,
    lastAttempt: null,
  };

  if (userAttempts.count >= 5) {
    const timeSinceLastAttempt = Date.now() - userAttempts.lastAttempt;
    if (timeSinceLastAttempt < 15 * 60 * 1000) {
      // 15-minute lockout
      return res
        .status(429)
        .json({ message: "Too many failed attempts. Try again later." });
    } else {
      loginAttempts.set(email, { count: 0, lastAttempt: null }); // Reset after cooldown
    }
  }
  next();
};

// @route   POST /api/auth/login
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  checkLoginAttempts,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("❌ Validation Error:", errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) {
        console.log("❌ Login failed - Email not registered:", email);
        return res.status(400).json({ message: "Invalid email or password." });
      }

      if (!user.isVerified) {
        console.log("⚠ Login failed - Email not verified:", email);
        return res
          .status(403)
          .json({ message: "Please verify your email before logging in." });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        console.log("❌ Login failed - Incorrect password:", email);

        // Track failed attempts
        const userAttempts = loginAttempts.get(email) || {
          count: 0,
          lastAttempt: null,
        };
        loginAttempts.set(email, {
          count: userAttempts.count + 1,
          lastAttempt: Date.now(),
        });

        return res.status(400).json({ message: "Invalid email or password." });
      }

      // Reset login attempts on success
      loginAttempts.delete(email);

      console.log("✅ Login successful:", email);

      const payload = {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "24h",
      });

      res.json({ token, message: "Logged in successfully" });
    } catch (err) {
      console.error("🚨 Server Error:", err.message);
      res
        .status(500)
        .json({ message: "Server error. Please try again later." });
    }
  }
);

// Email transporter configuration
const transporter = nodemailer.createTransport({
  service: "Gmail", // Or your email service
  auth: {
    user: process.env.EMAIL_USER, // Your email
    pass: process.env.EMAIL_PASS, // Your email password
  },
});

// @route   POST /api/auth/forgot-password
// @desc    Send reset password link
router.post(
  "/forgot-password",
  [body("email").isEmail().withMessage("Valid email is required")],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Generate a reset token
      const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "15m", // Token valid for 15 minutes
      });

      // Send reset link via email
      const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

      const emailHTML = `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background: #f9f9f9;">
    <div style="text-align: center; padding: 20px 0;">
      <img src="https://srow.store/logo/Logo.png" alt="SROW Logo" style="max-width: 150px; margin-bottom: 20px;">
    </div>
    
    <h2 style="color: #1A1A2E; text-align: center;">Password Reset Request</h2>
    
    <p style="font-size: 16px; color: #333; text-align: center;">
      Hi, <br>
      We received a request to reset your password. Click the button below to reset it.
    </p>
    
    <div style="text-align: center; margin: 20px;">
      <a href="${resetLink}" 
         style="background-color: #E94560; color: #fff; text-decoration: none; padding: 12px 20px; 
                border-radius: 5px; font-size: 16px; font-weight: bold; display: inline-block;">
        Reset Password
      </a>
    </div>

    <p style="font-size: 14px; color: #666; text-align: center;">
      If you did not request this, please ignore this email. Your password will remain the same.
    </p>
    
    <hr style="border: 0; height: 1px; background: #ddd; margin: 20px 0;">
    
    <p style="text-align: center; font-size: 12px; color: #888;">
      &copy; ${new Date().getFullYear()} SROW | All Rights Reserved
    </p>
  </div>
`;

      await transporter.sendMail({
        from: `"SROW Support" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Reset Your Password",
        html: emailHTML,
      });

      res.status(200).json({ message: "Reset link sent to your email" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// @route   POST /api/auth/reset-password/:token
// @desc    Reset password
router.post(
  "/reset-password/:token",
  [
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { token } = req.params;
    const { password } = req.body;

    try {
      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find the user
      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Hash the new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Update the password in the database
      user.password = hashedPassword;
      await user.save();

      res.status(200).json({ message: "Password reset successful" });
    } catch (err) {
      console.error(err);
      if (err.name === "TokenExpiredError") {
        return res.status(400).json({ message: "Token has expired" });
      }
      res.status(500).json({ message: "Server error" });
    }
  }
);

module.exports = router;

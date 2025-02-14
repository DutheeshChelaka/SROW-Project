import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles_pages/signup.css";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const { signup } = useContext(AuthContext);

  const validate = (name, value) => {
    switch (name) {
      case "name":
        if (!value.trim()) return "⚠️ Name is required.";
        if (value.length < 3) return "⚠️ Name must be at least 3 characters.";
        return "";
      case "email":
        if (!value) return "⚠️ Email is required.";
        if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value))
          return "⚠️ Invalid email format.";
        return "";
      case "password":
        if (!value) return "⚠️ Password is required.";
        if (value.length < 6)
          return "⚠️ Password must be at least 6 characters.";
        if (!/[A-Z]/.test(value))
          return "⚠️ Password must contain at least one uppercase letter.";
        if (!/\d/.test(value))
          return "⚠️ Password must contain at least one number.";
        return "";
      default:
        return "";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let validationErrors = {};
    Object.keys(formData).forEach((key) => {
      const error = validate(key, formData[key]);
      if (error) validationErrors[key] = error;
    });

    if (Object.keys(validationErrors).length > 0) {
      Object.values(validationErrors).forEach((error) => toast.error(error));
      return;
    }

    setLoading(true);
    try {
      const response = await signup(
        formData.name,
        formData.email,
        formData.password
      );

      // ✅ Show success toast from backend response
      toast.success(
        response.message ||
          "🎉 Signup successful! Please check your email for verification."
      );

      // ✅ Clear form fields after successful signup
      setFormData({ name: "", email: "", password: "" });
    } catch (err) {
      if (err.response) {
        // ✅ Handle different error messages
        if (err.response.status === 400) {
          toast.error(
            err.response.data.message ||
              "⚠️ User already exists. Please log in."
          );
        } else {
          toast.error(
            err.response.data.message || "❌ Signup failed. Please try again."
          );
        }
      } else {
        toast.error("🚨 Network error. Please check your connection.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="signup-header">
        <img src="/logo/Logo.png" alt="SROW Logo" className="signup-logo" />
        <h1 className="signup-title">SROW</h1>
      </div>

      <div className="signup-form-container">
        <h2>Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-container">
            <input
              name="name"
              type="text"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-container">
            <input
              name="email"
              type="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-container">
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>

        <div className="login-link">
          <p>
            Already have an account? <Link to="/login">Log in here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;

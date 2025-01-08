import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import "../styles_pages/login.css";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { login, user } = useContext(AuthContext); // Access user details
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(formData.email, formData.password); // Log the user in
    } catch (err) {
      console.error(err);
      alert("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  // Redirect based on the role after the user state updates
  useEffect(() => {
    if (user) {
      if (user.role === "admin") {
        navigate("/admin"); // Redirect to admin dashboard
      } else {
        navigate("/profile"); // Redirect to user profile
      }
    }
  }, [user, navigate]); // Listen for changes in `user`

  return (
    <div className="login-container">
      <div className="login-header">
        <img src="logo/Logo.png" alt="SROW Logo" className="login-logo" />
        <h1 className="login-title">SROW</h1>
      </div>
      <div className="login-form-container">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Logging In..." : "Login"}
          </button>
        </form>
        <div className="login-links">
          <p>
            <Link to="/forgot-password" className="forgot-password-link">
              Forgot Password?
            </Link>
          </p>
          <p>
            Don't have an account? <Link to="/signup">Sign up here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

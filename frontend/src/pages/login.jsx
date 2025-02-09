import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import "../styles_pages/login.css";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { login, user } = useContext(AuthContext); // Access user details
  const navigate = useNavigate();

  // Validation function
  const validate = (name, value) => {
    let error = "";
    switch (name) {
      case "email":
        if (!value) {
          error = "Email is required.";
        } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value)) {
          error = "Invalid email format.";
        }
        break;
      case "password":
        if (!value) {
          error = "Password is required.";
        }
        break;
      default:
        break;
    }
    return error;
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Real-time validation
    const error = validate(name, value);
    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      if (error) {
        newErrors[name] = error;
      } else {
        delete newErrors[name]; // Remove error if valid
      }
      return newErrors;
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(formData.email, formData.password);
    } catch (err) {
      console.error("❌ Login Error:", err.response?.data || err.message);

      // Check if the error response exists
      if (err.response && err.response.data) {
        const errorMessage = err.response.data.message;

        // Handle different error cases
        if (errorMessage === "Invalid email or password.") {
          setErrors({
            email: "Invalid email or password.",
            password: "Invalid email or password.",
          });
        } else if (
          errorMessage === "Please verify your email before logging in."
        ) {
          setErrors({ email: "Please verify your email before logging in." });
        } else if (
          errorMessage === "Too many failed attempts. Try again later."
        ) {
          setErrors({ email: "Too many failed attempts. Try again later." });
        } else {
          setErrors({ email: "Something went wrong. Please try again later." });
        }
      } else {
        setErrors({ email: "Network error. Please check your connection." });
      }

      setFormData({ ...formData, password: "" }); // Clear password field for security
    } finally {
      setLoading(false);
    }
  };

  // Redirect after login
  useEffect(() => {
    if (user) {
      if (user.role === "admin") {
        navigate("/admin"); // Redirect to admin dashboard
      } else {
        navigate("/profile"); // Redirect to user profile
      }
    }
  }, [user, navigate]); // Listen for user changes

  return (
    <div className="login-container">
      <div className="login-header">
        <img src="/logo/Logo.png" alt="SROW Logo" className="login-logo" />
        <h1 className="login-title">SROW</h1>
      </div>
      <div className="login-form-container">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-container">
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            {errors.email && <p className="error-message">{errors.email}</p>}
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
            {errors.password && (
              <p className="error-message">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || Object.keys(errors).length > 0}
          >
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

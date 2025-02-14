import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles_pages/login.css";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { login, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const validate = (name, value) => {
    let error = "";
    switch (name) {
      case "email":
        if (!value) error = "⚠️ Email is required.";
        else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value))
          error = "⚠️ Invalid email format.";
        break;
      case "password":
        if (!value) error = "⚠️ Password is required.";
        break;
      default:
        break;
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    const error = validate(name, value);
    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      if (error) newErrors[name] = error;
      else delete newErrors[name];
      return newErrors;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await login(formData.email, formData.password);

      if (response && response.message) {
        toast.success(response.message); // ✅ Show backend success message immediately
      } else {
        toast.success("✅ Login successful! Redirecting...");
      }

      setFormData({ email: "", password: "" });

      setTimeout(() => {
        navigate(user?.role === "admin" ? "/admin" : "/profile"); // ✅ Redirect after toast
      }, 2000);
    } catch (err) {
      console.error("❌ Login Error:", err);

      let errorMessage = "❌ Something went wrong. Please try again.";

      if (err.message) {
        errorMessage = err.message;
      }

      if (err.message === "Invalid email or password.") {
        setErrors({
          email: "⚠️ Invalid email or password.",
          password: "⚠️ Invalid email or password.",
        });
      } else if (
        err.message === "Please verify your email before logging in."
      ) {
        setErrors({ email: "⚠️ Please verify your email before logging in." });
      } else if (err.message === "Too many failed attempts. Try again later.") {
        setErrors({ email: "⚠️ Too many failed attempts. Try again later." });
      } else if (
        err.message === "🚨 Network error. Please check your connection."
      ) {
        setErrors({ email: "🚨 Network error. Please check your connection." });
      } else {
        setErrors({ email: "❌ Login failed. Please try again." });
      }

      toast.error(errorMessage);
      setFormData({ ...formData, password: "" });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (user) {
      toast.success("✅ Redirecting to dashboard...");
      setTimeout(() => {
        navigate(user.role === "admin" ? "/admin" : "/profile");
      }, 2000); // ✅ Delay navigation to let toast appear
    }
  }, [user, navigate]);

  return (
    <div className="login-container">
      <ToastContainer position="top-right" autoClose={3000} />

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
          <div className="signup-link">
            <p>
              Don't have an account? <Link to="/signup">Sign up here</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

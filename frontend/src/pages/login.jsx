import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
        if (!value) error = "Email is required.";
        else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value))
          error = "Invalid email format.";
        break;
      case "password":
        if (!value) error = "Password is required.";
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
        toast.success(response.message);
      } else {
        toast.success("Login successful! Redirecting...");
      }
      setFormData({ email: "", password: "" });
      setTimeout(() => {
        navigate(user?.role === "admin" ? "/admin" : "/profile");
      }, 2000);
    } catch (err) {
      console.error("Login Error:", err);
      let errorMessage = "Something went wrong. Please try again.";
      if (err.message) errorMessage = err.message;

      if (err.message === "Invalid email or password.") {
        setErrors({ email: "Invalid email or password.", password: "Invalid email or password." });
      } else if (err.message === "Please verify your email before logging in.") {
        setErrors({ email: "Please verify your email before logging in." });
      } else {
        setErrors({ email: "Login failed. Please try again." });
      }

      toast.error(errorMessage);
      setFormData({ ...formData, password: "" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      toast.success("Redirecting to dashboard...");
      setTimeout(() => {
        navigate(user.role === "admin" ? "/admin" : "/profile");
      }, 2000);
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-brand-surface flex items-center justify-center px-4 py-12">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link to="/home">
            <h1 className="font-heading text-4xl font-semibold tracking-[0.08em] text-brand-black">
              SROW
            </h1>
          </Link>
        </div>

        {/* Form Card */}
        <div className="bg-white p-8 sm:p-10">
          <h2 className="font-heading text-2xl font-semibold text-brand-text text-center mb-8">
            Welcome Back
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block font-body text-xs font-semibold tracking-[0.15em] uppercase text-brand-text mb-2">
                Email
              </label>
              <input
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full border border-brand-border px-4 py-3 font-body text-sm text-brand-text
                           placeholder-brand-muted focus:outline-none focus:border-brand-black transition-colors"
              />
              {errors.email && (
                <p className="mt-1.5 font-body text-xs text-red-500">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block font-body text-xs font-semibold tracking-[0.15em] uppercase text-brand-text mb-2">
                Password
              </label>
              <input
                name="password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full border border-brand-border px-4 py-3 font-body text-sm text-brand-text
                           placeholder-brand-muted focus:outline-none focus:border-brand-black transition-colors"
              />
              {errors.password && (
                <p className="mt-1.5 font-body text-xs text-red-500">{errors.password}</p>
              )}
            </div>

            <div className="text-right">
              <Link
                to="/forgot-password"
                className="font-body text-xs text-brand-muted hover:text-brand-text transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading || Object.keys(errors).length > 0}
              className={`w-full py-3.5 text-sm font-body font-semibold tracking-[0.15em] uppercase transition-all duration-300 ${
                loading || Object.keys(errors).length > 0
                  ? "bg-neutral-300 text-neutral-500 cursor-not-allowed"
                  : "bg-brand-black text-white hover:bg-neutral-800"
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing In...
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="font-body text-sm text-brand-muted">
              Don't have an account?{" "}
              <Link to="/signup" className="text-brand-text font-medium hover:text-brand-accent transition-colors">
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
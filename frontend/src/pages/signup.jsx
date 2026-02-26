import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Signup = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { signup } = useContext(AuthContext);

  const validate = (name, value) => {
    switch (name) {
      case "name":
        if (!value.trim()) return "Name is required.";
        if (value.length < 3) return "Name must be at least 3 characters.";
        return "";
      case "email":
        if (!value) return "Email is required.";
        if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value)) return "Invalid email format.";
        return "";
      case "password":
        if (!value) return "Password is required.";
        if (value.length < 6) return "Password must be at least 6 characters.";
        if (!/[A-Z]/.test(value)) return "Must contain at least one uppercase letter.";
        if (!/\d/.test(value)) return "Must contain at least one number.";
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
      const response = await signup(formData.name, formData.email, formData.password);
      toast.success(response.message || "Signup successful! Please check your email for verification.");
      setFormData({ name: "", email: "", password: "" });
    } catch (err) {
      if (err.response) {
        toast.error(err.response.data.message || "Signup failed. Please try again.");
      } else {
        toast.error("Network error. Please check your connection.");
      }
    } finally {
      setLoading(false);
    }
  };

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
            Create Account
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block font-body text-xs font-semibold tracking-[0.15em] uppercase text-brand-text mb-2">
                Full Name
              </label>
              <input
                name="name"
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full border border-brand-border px-4 py-3 font-body text-sm text-brand-text
                           placeholder-brand-muted focus:outline-none focus:border-brand-black transition-colors"
              />
            </div>

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
            </div>

            <div>
              <label className="block font-body text-xs font-semibold tracking-[0.15em] uppercase text-brand-text mb-2">
                Password
              </label>
              <input
                name="password"
                type="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full border border-brand-border px-4 py-3 font-body text-sm text-brand-text
                           placeholder-brand-muted focus:outline-none focus:border-brand-black transition-colors"
              />
              <p className="mt-1.5 font-body text-[11px] text-brand-muted">
                Min 6 characters, one uppercase letter, one number
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3.5 text-sm font-body font-semibold tracking-[0.15em] uppercase transition-all duration-300 ${
                loading
                  ? "bg-neutral-300 text-neutral-500 cursor-not-allowed"
                  : "bg-brand-black text-white hover:bg-neutral-800"
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating Account...
                </span>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="font-body text-sm text-brand-muted">
              Already have an account?{" "}
              <Link to="/login" className="text-brand-text font-medium hover:text-brand-accent transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
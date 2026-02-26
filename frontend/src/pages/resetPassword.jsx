import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import API_URL from "../config/api";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const validatePassword = (password) => {
    if (password.length < 6) return "Password must be at least 6 characters.";
    if (!/[A-Z]/.test(password)) return "Must include at least one uppercase letter.";
    if (!/\d/.test(password)) return "Must include at least one number.";
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return "Must include at least one special character.";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const passwordError = validatePassword(password);
    if (passwordError) { toast.error(passwordError); return; }
    if (password !== confirmPassword) { toast.error("Passwords do not match."); return; }

    setLoading(true);
    try {
      await axios.post(`${API_URL}/api/auth/reset-password/${token}`, { password });
      toast.success("Password reset successfully!");
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      console.error(err);
      toast.error("Error resetting password. The token might have expired.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-surface flex items-center justify-center px-4 py-12">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link to="/home">
            <h1 className="font-heading text-4xl font-semibold tracking-[0.08em] text-brand-black">SROW</h1>
          </Link>
        </div>

        <div className="bg-white p-8 sm:p-10">
          <h2 className="font-heading text-2xl font-semibold text-brand-text text-center mb-3">
            Reset Password
          </h2>
          <p className="font-body text-sm text-brand-muted text-center mb-8">
            Enter a strong new password below.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block font-body text-xs font-semibold tracking-[0.15em] uppercase text-brand-text mb-2">
                New Password
              </label>
              <input
                type="password"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full border border-brand-border px-4 py-3 font-body text-sm text-brand-text
                           placeholder-brand-muted focus:outline-none focus:border-brand-black transition-colors"
              />
              <p className="mt-1.5 font-body text-[11px] text-brand-muted">
                Min 6 chars, one uppercase, one number, one special character
              </p>
            </div>

            <div>
              <label className="block font-body text-xs font-semibold tracking-[0.15em] uppercase text-brand-text mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full border border-brand-border px-4 py-3 font-body text-sm text-brand-text
                           placeholder-brand-muted focus:outline-none focus:border-brand-black transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !password || !confirmPassword}
              className={`w-full py-3.5 text-sm font-body font-semibold tracking-[0.15em] uppercase transition-all duration-300 ${
                loading || !password || !confirmPassword
                  ? "bg-neutral-300 text-neutral-500 cursor-not-allowed"
                  : "bg-brand-black text-white hover:bg-neutral-800"
              }`}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>

          <div className="mt-8 text-center">
            <Link to="/login" className="font-body text-sm text-brand-muted hover:text-brand-text transition-colors">
              ← Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
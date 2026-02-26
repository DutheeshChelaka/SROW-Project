import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import API_URL from "../config/api";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/api/auth/forgot-password`, { email });
      setMessage(res.data.message);
      setIsError(false);
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      console.error(err);
      setMessage("Error sending reset email. Please try again.");
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-surface flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link to="/home">
            <h1 className="font-heading text-4xl font-semibold tracking-[0.08em] text-brand-black">SROW</h1>
          </Link>
        </div>

        <div className="bg-white p-8 sm:p-10">
          <h2 className="font-heading text-2xl font-semibold text-brand-text text-center mb-3">
            Forgot Password
          </h2>
          <p className="font-body text-sm text-brand-muted text-center mb-8">
            Enter your email and we'll send you a reset link.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block font-body text-xs font-semibold tracking-[0.15em] uppercase text-brand-text mb-2">
                Email
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border border-brand-border px-4 py-3 font-body text-sm text-brand-text
                           placeholder-brand-muted focus:outline-none focus:border-brand-black transition-colors"
              />
            </div>

            {message && (
              <p className={`font-body text-sm text-center ${isError ? "text-red-500" : "text-green-600"}`}>
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3.5 text-sm font-body font-semibold tracking-[0.15em] uppercase transition-all duration-300 ${
                loading ? "bg-neutral-300 text-neutral-500 cursor-not-allowed" : "bg-brand-black text-white hover:bg-neutral-800"
              }`}
            >
              {loading ? "Sending..." : "Send Reset Link"}
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

export default ForgotPassword;
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "../styles_pages/resetPassword.css";

const ResetPassword = () => {
  const { token } = useParams(); // Get reset token from URL
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // ✅ Confirm Password
  const [loading, setLoading] = useState(false);

  // ✅ Password Validation Function
  const validatePassword = (password) => {
    if (password.length < 6)
      return "⚠️ Password must be at least 6 characters.";
    if (!/[A-Z]/.test(password))
      return "⚠️ Must include at least one uppercase letter.";
    if (!/\d/.test(password)) return "⚠️ Must include at least one number.";
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password))
      return "⚠️ Must include at least one special character.";
    return ""; // ✅ No errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Client-side password validation
    const passwordError = validatePassword(password);
    if (passwordError) {
      toast.error(passwordError);
      return;
    }

    if (password !== confirmPassword) {
      toast.error("❌ Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        `http://localhost:5000/api/auth/reset-password/${token}`,
        { password }
      );

      toast.success("✅ Password reset successfully!");
      setTimeout(() => navigate("/login"), 3000); // Redirect after success
    } catch (err) {
      console.error(err);
      toast.error("❌ Error resetting password. The token might have expired.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-password-container">
      <ToastContainer position="top-right" autoClose={3000} />

      <h2>Reset Password</h2>
      <p>Enter a strong new password below.</p>

      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          disabled={loading || !password || !confirmPassword}
        >
          {loading ? "Resetting Password..." : "Reset Password"}
        </button>
      </form>

      <button onClick={() => navigate("/login")} className="back-to-login">
        Back to Login
      </button>
    </div>
  );
};

export default ResetPassword;

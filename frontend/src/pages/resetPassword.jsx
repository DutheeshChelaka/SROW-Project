import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

import "../styles_pages/resetPassword.css";

const ResetPassword = () => {
  const { token } = useParams(); // Get the reset token from the URL
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(
        `http://localhost:5000/api/auth/reset-password/${token}`,
        { password }
      );
      setMessage(res.data.message);
      setTimeout(() => navigate("/login"), 3000); // Redirect to login after success
    } catch (err) {
      console.error(err);
      setMessage("Error resetting password. The token might have expired.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-password-container">
      <h2>Reset Password</h2>
      <p>Enter your new password below.</p>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Resetting Password..." : "Reset Password"}
        </button>
      </form>
      {message && <p className="message">{message}</p>}
      <button onClick={() => navigate("/login")} className="back-to-login">
        Back to Login
      </button>
    </div>
  );
};

export default ResetPassword;

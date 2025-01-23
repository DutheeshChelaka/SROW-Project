import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "../styles_pages/verifyEmail.css";

const VerifyEmail = () => {
  const [statusMessage, setStatusMessage] = useState("Verifying your email...");
  const [verificationStatus, setVerificationStatus] = useState("loading"); // loading, success, error
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const verifyEmail = async () => {
      const token = new URLSearchParams(location.search).get("token");
      if (!token) {
        setStatusMessage("Invalid verification link.");
        setVerificationStatus("error");
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:5000/api/auth/verify-email?token=${token}`
        );
        setStatusMessage(response.data.message);
        setVerificationStatus("success");
      } catch (error) {
        console.error("Error verifying email:", error);
        setStatusMessage(
          error.response?.data?.message || "Email verification failed."
        );
        setVerificationStatus("error");
      }
    };

    verifyEmail();
  }, [location]);

  const handleRedirect = () => {
    if (verificationStatus === "success") {
      navigate("/login");
    } else {
      navigate("/signup");
    }
  };

  return (
    <div className="verify-email-container">
      <div className="verify-email-content">
        <h1>Email Verification</h1>
        <p>{statusMessage}</p>
        <button onClick={handleRedirect}>
          {verificationStatus === "success" ? "Go to Login" : "Go to Signup"}
        </button>
      </div>
    </div>
  );
};

export default VerifyEmail;

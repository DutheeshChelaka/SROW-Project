import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import axios from "axios";
import API_URL from "../config/api";

const VerifyEmail = () => {
  const [statusMessage, setStatusMessage] = useState("Verifying your email...");
  const [verificationStatus, setVerificationStatus] = useState("loading");
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
        const response = await axios.get(`${API_URL}/api/auth/verify-email?token=${token}`);
        setStatusMessage(response.data.message);
        setVerificationStatus("success");
      } catch (error) {
        console.error("Error verifying email:", error);
        setStatusMessage(error.response?.data?.message || "Email verification failed.");
        setVerificationStatus("error");
      }
    };
    verifyEmail();
  }, [location]);

  return (
    <div className="min-h-screen bg-brand-surface flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link to="/home">
            <h1 className="font-heading text-4xl font-semibold tracking-[0.08em] text-brand-black">SROW</h1>
          </Link>
        </div>

        <div className="bg-white p-8 sm:p-10 text-center">
          {verificationStatus === "loading" ? (
            <div className="py-8">
              <div className="w-10 h-10 border-2 border-brand-border border-t-brand-black rounded-full animate-spin mx-auto mb-6" />
              <p className="font-body text-sm text-brand-muted">{statusMessage}</p>
            </div>
          ) : verificationStatus === "success" ? (
            <div className="py-4">
              <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
              <h2 className="font-heading text-2xl font-semibold text-brand-text mb-3">Email Verified</h2>
              <p className="font-body text-sm text-brand-muted mb-8">{statusMessage}</p>
              <button onClick={() => navigate("/login")} className="btn-primary">
                Go to Sign In
              </button>
            </div>
          ) : (
            <div className="py-4">
              <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="font-heading text-2xl font-semibold text-brand-text mb-3">Verification Failed</h2>
              <p className="font-body text-sm text-brand-muted mb-8">{statusMessage}</p>
              <button onClick={() => navigate("/signup")} className="btn-outline">
                Go to Sign Up
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("cart");
    navigate("/login");
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-6 py-10">

        {/* Page Header */}
        <div className="mb-10">
          <p className="text-[11px] font-body font-semibold tracking-[0.3em] uppercase text-brand-muted mb-2">
            Account
          </p>
          <h1 className="font-heading text-3xl sm:text-4xl font-medium text-brand-black">
            My Profile
          </h1>
        </div>

        {user ? (
          <div>
            {/* Profile Card */}
            <div className="bg-brand-surface p-8 mb-8">
              <div className="flex items-center gap-5 mb-6">
                <div className="w-16 h-16 rounded-full bg-brand-black flex items-center justify-center text-white font-heading text-2xl font-semibold">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="font-body text-lg font-semibold text-brand-text">{user.name}</h2>
                  <p className="font-body text-sm text-brand-muted">{user.email}</p>
                </div>
              </div>

              <div className="h-px bg-brand-border mb-6" />

              <div className="space-y-3">
                <div className="flex justify-between font-body text-sm">
                  <span className="text-brand-muted">Name</span>
                  <span className="text-brand-text font-medium">{user.name}</span>
                </div>
                <div className="flex justify-between font-body text-sm">
                  <span className="text-brand-muted">Email</span>
                  <span className="text-brand-text font-medium">{user.email}</span>
                </div>
                <div className="flex justify-between font-body text-sm">
                  <span className="text-brand-muted">Role</span>
                  <span className="text-brand-text font-medium capitalize">{user.role || "Customer"}</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-3 mb-8">
              <button
                onClick={() => navigate("/orderHistory")}
                className="w-full flex items-center justify-between p-4 border border-brand-border hover:border-brand-black transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-brand-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                  </svg>
                  <span className="font-body text-sm font-medium text-brand-text">Order History</span>
                </div>
                <svg className="w-4 h-4 text-brand-muted group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>

              <button
                onClick={() => navigate("/cart")}
                className="w-full flex items-center justify-between p-4 border border-brand-border hover:border-brand-black transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-brand-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                  </svg>
                  <span className="font-body text-sm font-medium text-brand-text">My Cart</span>
                </div>
                <svg className="w-4 h-4 text-brand-muted group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="w-full btn-outline text-center"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="font-body text-sm text-brand-muted mb-6">No user data available. Please log in.</p>
            <button onClick={() => navigate("/login")} className="btn-primary">
              Sign In
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
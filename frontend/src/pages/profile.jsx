import React from "react";
import { useAuth } from "../context/AuthContext";
import "../styles_pages/profile.css";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user } = useAuth(); // Retrieve user data from context
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove the authentication token
    localStorage.removeItem("cart"); // Clear cart data
    navigate("/login"); // Redirect to the login page
    window.location.reload(); // Refresh the page
  };

  return (
    <div className="profile-container">
      <h1 className="profile-title">My Profile</h1>
      {user ? (
        <div className="profile-details">
          <div className="profile-card">
            <img
              src="profile.png"
              alt="User Avatar"
              className="profile-avatar"
            />
            <div className="profile-info">
              <p>
                <strong>Name:</strong> {user.name}
              </p>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <button className="logout-button" onClick={handleLogout}>
                Logout
              </button>
              <button
                onClick={() => navigate("/orderHistory")}
                className="nav-link"
              >
                Order History
              </button>
            </div>
          </div>
        </div>
      ) : (
        <p className="no-user-message">
          No user data available. Please log in.
        </p>
      )}
    </div>
  );
};

export default Profile;

import React from "react";
import { useAuth } from "../context/AuthContext";
import "../styles_pages/profile.css";

const Profile = () => {
  const { user, logout } = useAuth();

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
              <button className="logout-button" onClick={logout}>
                Logout
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

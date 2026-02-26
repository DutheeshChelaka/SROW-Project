import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode"; // Correct import

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // ✅ Define setLoading properly

  const login = async (email, password) => {
    try {
      const res = await axios.post("http://localhost:8000/api/auth/login", {
        email,
        password,
      });

      const token = res.data.token;
      localStorage.setItem("token", token);

      const decoded = jwtDecode(token);
      setUser(decoded);

      return { message: res.data.message, token }; // ✅ Return success message immediately
    } catch (error) {
      if (error.response) {
        throw new Error(
          error.response.data.message || "❌ Login failed. Please try again."
        );
      } else {
        throw new Error("🚨 Network error. Please check your connection.");
      }
    }
  };

  // Ensure user ID is persisted on page reload
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        console.log("📢 FULL Decoded Token:", decoded); // ✅ Debugging

        const userId = decoded.id || decoded._id; // ✅ Check for "id" first

        if (!userId) {
          console.error("❌ No user ID found in decoded token!");
        } else {
          localStorage.setItem("userId", userId);
          console.log("✅ User ID set from token:", userId);
        }

        setUser(decoded);
      } catch (error) {
        console.error("❌ Error decoding token", error);
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
      }
    }
    setLoading(false); // ✅ Now setLoading is defined and used correctly
  }, []);

  const signup = async (name, email, password) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/auth/signup",
        {
          name,
          email,
          password,
        }
      );

      return response.data; // ✅ Ensure this returns the backend response
    } catch (error) {
      if (error.response) {
        throw error.response.data; // ✅ Throw structured error from backend
      } else {
        throw new Error("🚨 Network error. Please check your connection.");
      }
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId"); // ✅ Ensure userId is also removed
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

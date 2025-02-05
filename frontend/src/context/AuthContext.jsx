import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode"; // Correct import

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // ✅ Define setLoading properly

  const login = async (email, password) => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      const token = res.data.token;
      localStorage.setItem("token", token); // ✅ Store token

      // Decode token to extract user details
      const decoded = jwtDecode(token);
      console.log("🔑 Decoded User:", decoded); // Debugging

      if (!decoded.id && !decoded._id) {
        console.error("❌ Decoded token does not contain user ID");
      } else {
        const userId = decoded.id || decoded._id;
        localStorage.setItem("userId", userId); // ✅ Store user ID explicitly
        console.log("✅ User ID stored in localStorage:", userId);
      }

      setUser(decoded);
    } catch (error) {
      console.error("❌ Login failed:", error);
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
    await axios.post("http://localhost:5000/api/auth/signup", {
      name,
      email,
      password,
    });
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

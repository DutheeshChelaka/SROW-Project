import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import "../styles_pages/signup.css";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const { signup } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signup(formData.name, formData.email, formData.password);
      alert("Signup successful! Please log in.");
      navigate("/login");
    } catch (err) {
      console.error(err);
      alert("Signup failed");
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-header">
        <img src="logo/Logo.png" alt="SROW Logo" className="signup-logo" />
        <h1 className="signup-title">SROW</h1>
      </div>
      <div className="signup-form-container">
        <h2>Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <input
            name="name"
            type="text"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit">Sign Up</button>
        </form>
        <div className="login-link">
          <p>
            Already have an account? <Link to="/login">Log in here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;

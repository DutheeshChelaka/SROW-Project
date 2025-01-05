import React, { useState } from "react";
import "./Header.css";

const Header = () => {
  const [selectedCountry, setSelectedCountry] = useState("Sri Lanka");
  const [currency, setCurrency] = useState("LKR");

  const handleCountryChange = (country) => {
    setSelectedCountry(country);
    setCurrency(country === "Sri Lanka" ? "LKR" : "CNY");
  };

  return (
    <header className="header">
      {/* Top Bar */}
      <div className="top-bar">
        <div className="currency-selector">
          <img
            src={`flags/${
              selectedCountry === "Sri Lanka" ? "slflag.png" : "cnflag.jpg"
            }`}
            alt={`${selectedCountry} Flag`}
            className="flag-icon"
          />
          <select
            className="country-dropdown"
            value={selectedCountry}
            onChange={(e) => handleCountryChange(e.target.value)}
          >
            <option value="Sri Lanka">Sri Lanka</option>
            <option value="China">China</option>
          </select>
          <span className="currency">{currency}</span>
        </div>

        {/* Logo */}
        <div className="logo-container">
          <img src="logo/Logo.png" alt="SROW Logo" className="logo-image" />
        </div>

        {/* Navigation Icons */}
        <div className="nav-icons">
          <a href="#" className="icon">
            <i className="fas fa-question-circle"></i> {/* Help Icon */}
          </a>
          <a href="#" className="icon">
            <i className="fas fa-search"></i> {/* Search Icon */}
          </a>
          <a href="#" className="icon">
            <i className="fas fa-user"></i> {/* User Icon */}
          </a>
          <a href="#" className="icon">
            <i className="fas fa-shopping-cart"></i> {/* Cart Icon */}
          </a>
        </div>
      </div>

      {/* Divider Line */}
      <div className="divider"></div>

      {/* Main Navigation */}
      <nav className="nav-bar">
        <ul className="nav-links">
          <li className="nav-item">
            <a href="#">What's New</a>
            <div className="dropdown">
              <a href="#new-arrivals">
                <b>New Arrivals</b>
              </a>
              <a href="#">Women's</a>
              <a href="#">Men's</a>
            </div>
          </li>
          <li className="nav-item">
            <a href="#">Women</a>
            <div className="dropdown">
              <a href="#new-arrivals">
                <b>New Arrivals</b>
              </a>
              <a href="#">Shoes</a>
              <a href="#">Tops</a>
              <a href="#">Leggings</a>
              <a href="#">Pants</a>
              <a href="#">Shorts</a>
              <a href="#">Skirts</a>
              <a href="#">Capris</a>
              <a href="#">Hoodies</a>
              <a href="#">Wraps</a>
            </div>
          </li>
          <li className="nav-item">
            <a href="#">Men</a>
            <div className="dropdown">
              <a href="#new-arrivals">
                <b>New Arrivals</b>
              </a>
              <a href="#">Shirts</a>
              <a href="#">T-Shirts</a>
              <a href="#">Bottoms</a>
              <a href="#">Pants</a>
              <a href="#">Jackets</a>
              <a href="#">Hoodies</a>
            </div>
          </li>
          <li className="nav-item">
            <a href="#">Kids & Baby</a>
            <div className="dropdown">
              <a href="#new-arrivals">
                <b>New Arrivals</b>
              </a>
              <a href="#">Boys</a>
              <a href="#">Girls</a>
            </div>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;

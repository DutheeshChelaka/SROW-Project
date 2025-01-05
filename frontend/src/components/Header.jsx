import React from "react";
import "./Header.css";

const Header = () => {
  return (
    <header className="header">
      {/* Top Bar */}
      <div className="top-bar">
        <div className="currency-selector">
          <span role="img" aria-label="flag">
            <img
              src="flags/slflag.png"
              alt="Sri Lankan Flag"
              style={{ width: "20px", height: "auto", marginRight: "5px" }}
            />
          </span>{" "}
          LKR
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="nav-bar">
        <div className="logo">SROW</div>
        <ul className="nav-links">
          <li>
            <a href="#">What's New</a>
          </li>
          <li>
            <a href="#">Women</a>
          </li>
          <li>
            <a href="#">Men</a>
          </li>
          <li>
            <a href="#">Kids & Baby</a>
          </li>
        </ul>
        <div className="nav-icons">
          <a href="#">
            <span>?</span>
          </a>
          <a href="#">
            <span>🔍</span>
          </a>
          <a href="#">
            <span>👤</span>
          </a>
          <a href="#">
            <span>🛒</span>
          </a>
        </div>
      </nav>
    </header>
  );
};

export default Header;

import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

import "./Header.css";

const Header = () => {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState({});
  const [selectedCountry, setSelectedCountry] = useState("Sri Lanka");
  const [currency, setCurrency] = useState("LKR");
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = useState(false); // State to manage search curtain
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [searchResults, setSearchResults] = useState([]); // State for search results
  const [loading, setLoading] = useState(false); // State for loading spinner

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/catalog/categories"
      );
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchSubcategories = async (categoryId) => {
    if (subcategories[categoryId]) return; // Avoid duplicate fetches
    try {
      const response = await axios.get(
        `http://localhost:5000/api/catalog/subcategories/${categoryId}`
      );
      setSubcategories((prev) => ({
        ...prev,
        [categoryId]: response.data,
      }));
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    }
  };

  const handleCountryChange = (country) => {
    setSelectedCountry(country);
    setCurrency(country === "Sri Lanka" ? "LKR" : "CNY");
  };

  const handleProfileClick = () => {
    if (user) {
      navigate("/profile"); // Redirect to profile if logged in
    } else {
      navigate("/login"); // Redirect to login/signup if not logged in
    }
  };

  const handleSubcategoryClick = (subcategoryId) => {
    navigate(`/products/${subcategoryId}`); // Redirect to the products page
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      alert("Please enter a search term.");
      return;
    }

    try {
      setLoading(true); // Show loading spinner
      const response = await axios.get(
        `http://localhost:5000/api/catalog/products/search?query=${searchQuery}`
      );
      setSearchResults(response.data); // Set search results
    } catch (error) {
      console.error("Error fetching search results:", error);
      alert("Error fetching search results. Please try again.");
    } finally {
      setLoading(false); // Hide loading spinner
    }
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
          <Link to="/home">
            <img src="logo/Logo.png" alt="SROW Logo" className="logo-image" />
          </Link>
        </div>

        {/* Navigation Icons */}
        <div className="nav-icons">
          <button className="search-icon" onClick={() => setIsSearchOpen(true)}>
            <i className="ri-search-line"></i>
          </button>
          <button className="user-icon" onClick={handleProfileClick}>
            <i className="ri-user-line"></i>
          </button>
          <button className="cart-icon" onClick={() => navigate("/cart")}>
            <i className="ri-shopping-cart-line"></i>
          </button>
        </div>
      </div>

      {/* Divider Line */}
      <div className="divider"></div>

      {/* Main Navigation */}
      <nav className="nav-bar">
        <ul className="nav-links">
          {categories.map((category) => (
            <li
              key={category._id}
              className="nav-item"
              onMouseEnter={() => fetchSubcategories(category._id)}
            >
              <span>{category.name}</span>
              <div className="dropdown">
                {subcategories[category._id]?.map((sub) => (
                  <button
                    key={sub._id}
                    onClick={() => handleSubcategoryClick(sub._id)}
                    style={{
                      cursor: "pointer",
                      background: "none",
                      border: "none",
                      color: "inherit",
                      textAlign: "left",
                      width: "100%",
                    }}
                  >
                    {sub.name}
                  </button>
                ))}
              </div>
            </li>
          ))}
        </ul>
      </nav>

      {/* Search Curtain */}
      <div className={`search-curtain ${isSearchOpen ? "open" : ""}`}>
        <button className="back-arrow" onClick={() => setIsSearchOpen(false)}>
          <i className="ri-arrow-left-line"></i>
        </button>
        <input
          type="text"
          className="search-input"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button className="search-button" onClick={handleSearch}>
          Search
        </button>

        {/* Display Search Results */}
        {loading ? (
          <p>Loading...</p>
        ) : searchResults.length > 0 ? (
          <div className="search-results">
            {searchResults.map((product) => (
              <div
                key={product._id}
                className="search-result-item"
                onClick={() => navigate(`/products/details/${product._id}`)}
              >
                <img
                  src={`http://localhost:5000/${product.images[0]}`}
                  alt={product.name}
                  className="search-result-image"
                />
                <div>
                  <p className="search-result-name">{product.name}</p>
                  <p className="search-result-price">
                    LKR {product.price.toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No results found</p>
        )}
      </div>
    </header>
  );
};

export default Header;

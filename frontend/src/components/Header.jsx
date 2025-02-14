import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { CurrencyContext } from "../context/CurrencyContext";
import axios from "axios";
import "./Header.css";
import SearchResults from "./searchResults";

const Header = () => {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState({});
  const { currency, changeCurrency } = useContext(CurrencyContext);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchActive, setSearchActive] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [debounceTimeout, setDebounceTimeout] = useState(null);

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
    if (subcategories[categoryId]) return;
    try {
      const response = await axios.get(
        `http://localhost:5000/api/catalog/subcategories/${categoryId}`
      );
      setSubcategories((prev) => ({ ...prev, [categoryId]: response.data }));
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    }
  };

  const handleSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:5000/api/catalog/products/search?query=${query}`
      );
      setSearchResults(response.data);
    } catch (error) {
      console.error("Error fetching search results:", error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (debounceTimeout) clearTimeout(debounceTimeout);
    setDebounceTimeout(setTimeout(() => handleSearch(value), 500));
  };

  const closeSearch = (e) => {
    if (e.target.classList.contains("search-overlay")) {
      setIsSearchOpen(false);
    }
  };

  return (
    <header className="header">
      {/* Top Bar */}
      <div className="top-bar">
        <div className="currency-selector">
          <img
            src={`flags/${currency === "LKR" ? "slflag.png" : "japanflag.png"}`}
            alt="Flag"
            className="flag-icon"
          />
          <select
            className="country-dropdown"
            value={currency}
            onChange={(e) => changeCurrency(e.target.value)}
          >
            <option value="LKR">Sri Lanka (LKR)</option>
            <option value="JPY">Japan (¥ JPY)</option>
          </select>
        </div>

        <div className="logo-container">
          <Link to="/home">
            <img src="logo/Logo.png" alt="SROW Logo" className="logo-image" />
          </Link>
        </div>

        <div className="nav-icons">
          <button onClick={() => setIsSearchOpen(true)}>
            <i className="ri-search-line"></i>
          </button>
          <button onClick={() => navigate(user ? "/profile" : "/login")}>
            <i className="ri-user-line"></i>
          </button>
          <button onClick={() => navigate("/cart")}>
            <i className="ri-shopping-cart-line"></i>
          </button>
          <button
            className="mobile-menu-icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <i className="ri-menu-line"></i>
          </button>
        </div>
      </div>

      {/* Desktop Navbar - Hidden on Mobile */}
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
                    onClick={() => navigate(`/products/${sub._id}`)}
                  >
                    {sub.name}
                  </button>
                ))}
              </div>
            </li>
          ))}
        </ul>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`menu-overlay ${mobileMenuOpen ? "open" : ""}`}
        onClick={() => setMobileMenuOpen(false)}
      ></div>
      <div className={`mobile-menu ${mobileMenuOpen ? "open" : ""}`}>
        <button className="close-menu" onClick={() => setMobileMenuOpen(false)}>
          ✖
        </button>
        <h2>Categories</h2>
        <ul className="mobile-nav-links">
          {categories.map((category) => (
            <li key={category._id} className="mobile-nav-item">
              <button onClick={() => fetchSubcategories(category._id)}>
                {category.name}
              </button>
              <ul className="mobile-subcategories">
                {subcategories[category._id]?.map((sub) => (
                  <li key={sub._id}>
                    <button onClick={() => navigate(`/products/${sub._id}`)}>
                      {sub.name}
                    </button>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>

      {/* Search Overlay */}
      {isSearchOpen && (
        <div className="search-overlay" onClick={closeSearch}>
          {searchActive && <SearchResults setSearchActive={setSearchActive} />}
          <div className="search-container">
            <button
              className="close-search"
              onClick={() => setIsSearchOpen(false)}
            >
              ✖
            </button>
            <input
              type="text"
              placeholder="Search for products..."
              value={searchQuery}
              onChange={handleInputChange}
            />
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
                    />
                    <div>
                      <p className="search-result-name">{product.name}</p>
                      <p className="search-result-price">
                        {currency}{" "}
                        {currency === "LKR"
                          ? product.priceLKR
                          : product.priceJPY}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No results found</p>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;

import React, { useEffect, useState, useContext, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { CurrencyContext } from "../context/CurrencyContext";
import axios from "axios";
import API_URL from "../config/api";


const Header = () => {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState({});
  const { currency, changeCurrency } = useContext(CurrencyContext);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [debounceTimeout, setDebounceTimeout] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const searchInputRef = useRef(null);

  // Track scroll for header shadow
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Auto-focus search input
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current.focus(), 100);
    }
  }, [isSearchOpen]);

  // Lock body scroll when menu/search open
  useEffect(() => {
    if (mobileMenuOpen || isSearchOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileMenuOpen, isSearchOpen]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/catalog/categories`);
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchSubcategories = async (categoryId) => {
    if (subcategories[categoryId]) return;
    try {
      const response = await axios.get(
        `${API_URL}/api/catalog/subcategories/${categoryId}`
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
        `${API_URL}/api/catalog/products/search?query=${query}`
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

  const handleSearchResultClick = (productId) => {
    setIsSearchOpen(false);
    setSearchQuery("");
    setSearchResults([]);
    navigate(`/products/details/${productId}`);
  };

  const handleMobileSubcategoryClick = (subId) => {
    setMobileMenuOpen(false);
    navigate(`/products/${subId}`);
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 bg-white transition-shadow duration-300 ${
        scrolled ? "shadow-sm" : ""
      }`}
    >
      {/* Announcement Bar */}
      <div className="bg-brand-black text-white text-center py-2">
        <p className="text-[11px] tracking-[0.15em] uppercase font-body font-light">
          Free shipping on orders over LKR 10,000
        </p>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">

          {/* Left: Hamburger (mobile) + Currency */}
          <div className="flex items-center gap-3 w-1/3">
            <button
              className="lg:hidden p-1"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <svg className="w-6 h-6 text-brand-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <div className="hidden sm:flex items-center gap-2">
              <img
                src={`/flags/${currency === "LKR" ? "slflag.png" : "japanflag.png"}`}
                alt="Flag"
                className="w-5 h-auto rounded-sm"
              />
              <select
                className="bg-transparent text-xs font-body text-brand-muted cursor-pointer focus:outline-none appearance-none pr-4"
                value={currency}
                onChange={(e) => changeCurrency(e.target.value)}
              >
                <option value="LKR">LKR</option>
                <option value="JPY">JPY</option>
              </select>
            </div>
          </div>

          {/* Center: Logo */}
          <div className="flex-shrink-0 w-1/3 flex justify-center">
            <Link to="/home" className="block">
              <h1 className="font-heading text-3xl sm:text-4xl font-semibold tracking-[0.08em] text-brand-black">
                SROW
              </h1>
            </Link>
          </div>

          {/* Right: Icons */}
          <div className="flex items-center justify-end gap-1 sm:gap-4 w-1/3">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 hover:opacity-60 transition-opacity"
              aria-label="Search"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </button>

            <button
              onClick={() => navigate(user ? "/profile" : "/login")}
              className="p-2 hover:opacity-60 transition-opacity"
              aria-label="Account"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </button>

            <button
              onClick={() => navigate("/cart")}
              className="p-2 hover:opacity-60 transition-opacity relative"
              aria-label="Cart"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden lg:block border-t border-brand-border">
        <div className="max-w-7xl mx-auto px-6">
          <ul className="flex items-center justify-center gap-10 h-12">
            {categories.map((category) => (
              <li
                key={category._id}
                className="relative group"
                onMouseEnter={() => {
                  fetchSubcategories(category._id);
                  setActiveCategory(category._id);
                }}
                onMouseLeave={() => setActiveCategory(null)}
              >
                <span className="text-xs font-body font-medium tracking-[0.15em] uppercase text-brand-text 
                                 cursor-pointer hover:text-brand-muted transition-colors duration-200
                                 py-4 inline-block border-b-[1.5px] border-transparent 
                                 group-hover:border-brand-black">
                  {category.name}
                </span>

                {activeCategory === category._id && subcategories[category._id] && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 pt-0 z-50 animate-fade-in">
                    <div className="bg-white border border-brand-border shadow-lg min-w-[200px] py-3">
                      {subcategories[category._id].map((sub) => (
                        <button
                          key={sub._id}
                          onClick={() => navigate(`/products/${sub._id}`)}
                          className="block w-full text-left px-6 py-2.5 text-sm font-body text-brand-text
                                     hover:bg-brand-surface transition-colors duration-150"
                        >
                          {sub.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* ===== MOBILE MENU ===== */}
      <div
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 lg:hidden ${
          mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMobileMenuOpen(false)}
      />

      <div
        className={`fixed top-0 left-0 h-full w-[300px] bg-white z-50 transform transition-transform duration-300 ease-out lg:hidden ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-brand-border">
          <span className="font-heading text-xl font-semibold tracking-wide">SROW</span>
          <button onClick={() => setMobileMenuOpen(false)} className="p-1" aria-label="Close menu">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-4 border-b border-brand-border flex items-center gap-3">
          <img
            src={`/flags/${currency === "LKR" ? "slflag.png" : "japanflag.png"}`}
            alt="Flag"
            className="w-5 h-auto rounded-sm"
          />
          <select
            className="bg-transparent text-sm font-body text-brand-text cursor-pointer focus:outline-none"
            value={currency}
            onChange={(e) => changeCurrency(e.target.value)}
          >
            <option value="LKR">Sri Lanka (LKR)</option>
            <option value="JPY">Japan (¥ JPY)</option>
          </select>
        </div>

        <div className="overflow-y-auto h-[calc(100%-140px)] px-6 py-4">
          <p className="text-[10px] font-body font-semibold tracking-[0.2em] uppercase text-brand-muted mb-4">
            Categories
          </p>
          <ul className="space-y-1">
            {categories.map((category) => (
              <li key={category._id}>
                <button
                  onClick={() => fetchSubcategories(category._id)}
                  className="w-full text-left py-3 text-sm font-body font-medium text-brand-text 
                             border-b border-brand-border/50 flex items-center justify-between
                             hover:text-brand-accent transition-colors"
                >
                  {category.name}
                  <svg className="w-4 h-4 text-brand-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </button>

                {subcategories[category._id] && (
                  <ul className="pl-4 pb-2">
                    {subcategories[category._id].map((sub) => (
                      <li key={sub._id}>
                        <button
                          onClick={() => handleMobileSubcategoryClick(sub._id)}
                          className="w-full text-left py-2.5 text-sm font-body text-brand-muted
                                     hover:text-brand-text transition-colors"
                        >
                          {sub.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>

          <div className="mt-8 pt-6 border-t border-brand-border space-y-3">
            <button
              onClick={() => { setMobileMenuOpen(false); navigate(user ? "/profile" : "/login"); }}
              className="block w-full text-left text-sm font-body text-brand-text py-2"
            >
              {user ? "My Account" : "Sign In"}
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); navigate("/orderHistory"); }}
              className="block w-full text-left text-sm font-body text-brand-text py-2"
            >
              Order History
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); navigate("/about"); }}
              className="block w-full text-left text-sm font-body text-brand-text py-2"
            >
              About
            </button>
          </div>
        </div>
      </div>

      {/* ===== SEARCH OVERLAY ===== */}
      <div
        className={`fixed inset-0 z-50 transition-opacity duration-300 ${
          isSearchOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className="absolute inset-0 bg-black/50"
          onClick={() => { setIsSearchOpen(false); setSearchQuery(""); setSearchResults([]); }}
        />

        <div className={`relative bg-white w-full max-w-2xl mx-auto mt-0 sm:mt-20 transform transition-transform duration-300 ${
          isSearchOpen ? "translate-y-0" : "-translate-y-8"
        }`}>
          <div className="flex items-center border-b border-brand-border px-6 py-4">
            <svg className="w-5 h-5 text-brand-muted mr-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search for products..."
              value={searchQuery}
              onChange={handleInputChange}
              className="flex-1 text-base font-body text-brand-text placeholder-brand-muted focus:outline-none bg-transparent"
            />
            <button
              onClick={() => { setIsSearchOpen(false); setSearchQuery(""); setSearchResults([]); }}
              className="ml-4 p-1 hover:opacity-60 transition-opacity"
              aria-label="Close search"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="max-h-[60vh] overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-6 h-6 border-2 border-brand-border border-t-brand-black rounded-full animate-spin" />
              </div>
            ) : searchResults.length > 0 ? (
              <div>
                <p className="px-6 pt-4 pb-2 text-[10px] font-body font-semibold tracking-[0.2em] uppercase text-brand-muted">
                  {searchResults.length} Result{searchResults.length > 1 ? "s" : ""}
                </p>
                {searchResults.map((product) => (
                  <button
                    key={product._id}
                    onClick={() => handleSearchResultClick(product._id)}
                    className="flex items-center gap-4 w-full px-6 py-3 hover:bg-brand-surface transition-colors text-left"
                  >
                    <img
                      src={`${API_URL}/${product.images[0]}`}
                      alt={product.name}
                      className="w-14 h-14 object-cover bg-brand-surface"
                    />
                    <div>
                      <p className="text-sm font-body font-medium text-brand-text">{product.name}</p>
                      <p className="text-sm font-body text-brand-muted mt-0.5">
                        {currency} {currency === "LKR" ? product.priceLKR : product.priceJPY}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            ) : searchQuery.trim() ? (
              <div className="text-center py-12">
                <p className="text-sm font-body text-brand-muted">No results found for "{searchQuery}"</p>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-sm font-body text-brand-muted">Start typing to search...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
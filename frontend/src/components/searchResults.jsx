import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./searchResults.css";

const SearchResults = ({ setSearchActive, setIsSearchOpen }) => {
  // Accept setIsSearchOpen
  const location = useLocation();
  const navigate = useNavigate();
  const { results = [], query } = location.state || {};

  // Function to close search and navigate
  const handleProductClick = (productId) => {
    if (setSearchActive) setSearchActive(false); // Close the search UI
    if (setIsSearchOpen) setIsSearchOpen(false); // Close the overlay
    setTimeout(() => navigate(`/products/details/${productId}`), 100); // Ensure smooth navigation
  };

  return (
    <div className="search-results-container">
      <h1>Search Results for "{query}"</h1>

      {results.length > 0 ? (
        <div className="results-grid">
          {results.map((product) => (
            <div
              key={product._id}
              className="result-card"
              onClick={() => handleProductClick(product._id)}
            >
              <img
                src={`http://localhost:8000/${product.images?.[0] || ""}`} // Prevent errors if no image
                alt={product.name}
                className="result-image"
              />
              <h3>{product.name}</h3>
              <p>LKR {product.price?.toFixed(2) || "N/A"}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No results found.</p>
      )}
    </div>
  );
};

export default SearchResults;

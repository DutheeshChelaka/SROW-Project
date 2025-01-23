import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./searchResults.css";

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { results = [], query } = location.state || {};

  return (
    <div className="search-results-container">
      <h1>Search Results for "{query}"</h1>
      {results.length > 0 ? (
        <div className="results-grid">
          {results.map((product) => (
            <div
              key={product._id}
              className="result-card"
              onClick={() => navigate(`/products/details/${product._id}`)}
            >
              <img
                src={`http://localhost:5000/${product.images[0]}`}
                alt={product.name}
                className="result-image"
              />
              <h3>{product.name}</h3>
              <p>LKR {product.price.toFixed(2)}</p>
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

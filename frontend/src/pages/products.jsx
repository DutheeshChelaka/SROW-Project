import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "../styles_pages/products.css";
import { CurrencyContext } from "../context/CurrencyContext"; // Import Currency Context

const Products = () => {
  const { subcategoryId } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { currency, exchangeRate } = useContext(CurrencyContext); // Get currency & rate
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:5000/api/catalog/products?subcategory=${subcategoryId}`
        );
        setProducts(response.data);
        setError("");
      } catch (error) {
        setError("Error fetching products. Please try again.");
        console.error("❌ Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [subcategoryId]);

  return (
    <div className="products-container">
      {loading ? (
        <p className="loading-text">Loading products...</p>
      ) : error ? (
        <p className="error-text">{error}</p>
      ) : products.length === 0 ? (
        <p className="no-products-text">No products found in this category.</p>
      ) : (
        <div className="products-grid">
          {products.map((product) => {
            const imageUrl = product.images?.[0]
              ? `http://localhost:5000/${product.images[0]}`
              : "path_to_default_image.jpg"; // Fallback image URL
            const priceLKR = product.priceLKR ?? 0; // Ensure valid price
            const priceJPY = product.priceJPY ?? 0; // Ensure valid price

            // Fixing the JPY Price Issue
            const priceToUse = currency === "LKR" ? priceLKR : priceJPY;

            // If JPY, do NOT apply exchangeRate conversion
            const convertedPrice =
              currency === "JPY"
                ? priceToUse.toFixed(2) // JPY should not be converted
                : (priceToUse * exchangeRate).toFixed(2); // Convert only for LKR

            const currencySymbol = currency === "LKR" ? "LKR" : "¥";

            return (
              <div
                key={product._id}
                className="product-card"
                onClick={() => navigate(`/products/details/${product._id}`)}
              >
                <div className="product-image-container">
                  <img
                    src={imageUrl}
                    alt={product.name}
                    className="product-image"
                  />
                </div>
                <h3 className="product-name">{product.name}</h3>
                <p className="product-description">{product.description}</p>
                <p className="product-price">
                  {currencySymbol} {convertedPrice}
                </p>
                <button className="add-to-cart-btn">Add to Cart</button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Products;

import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "../styles_pages/products.css";

const Products = () => {
  const { subcategoryId } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
        console.error("Error fetching products:", error);
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
      ) : (
        <div className="products-grid">
          {products.map((product) => {
            const imageUrl = `http://localhost:5000/${product.images[0]}`;
            return (
              <div
                key={product._id}
                className="product-card"
                onClick={() => navigate(`/products/details/${product._id}`)}
              >
                <img
                  src={imageUrl}
                  alt={product.name}
                  className="product-image"
                />
                <h3 className="product-name">{product.name}</h3>
                <p className="product-description">{product.description}</p>
                <p className="product-price">LKR {product.price.toFixed(2)}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Products;

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../styles_pages/productDetails.css";

const ProductDetails = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedSize, setSelectedSize] = useState("");

  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:5000/api/catalog/products/${productId}`
        );
        setProduct(response.data);
        setError("");
      } catch (err) {
        console.error("Error fetching product details:", err);
        setError("Error fetching product details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [productId]);

  const addToCart = () => {
    if (!selectedSize) {
      alert("Please select a size!");
      return;
    }

    const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
    const existingItem = cartItems.find(
      (item) => item.id === product._id && item.size === selectedSize
    );

    if (existingItem) {
      existingItem.quantity += 1; // Increment quantity if already in cart
    } else {
      cartItems.push({
        id: product._id,
        name: product.name,
        price: product.price,
        size: selectedSize,
        image: `http://localhost:5000/${product.images[0]}`,
        quantity: 1,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cartItems));
    alert("Product added to cart!");
  };

  if (loading) {
    return <p>Loading product details...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!product) {
    return <p>No product details available.</p>;
  }

  return (
    <div className="product-details-container">
      <div className="product-details-card">
        <img
          src={`http://localhost:5000/${product.images[0]}`}
          alt={product.name}
          className="product-details-image"
        />
        <div className="product-details-info">
          <h2 className="product-details-title">{product.name}</h2>
          <p className="product-details-price">Price: LKR {product.price}</p>
          <p className="product-details-description">{product.description}</p>
          <div className="product-size-selector">
            <label htmlFor="size">Select Size:</label>
            <select
              id="size"
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
            >
              <option value="">Select</option>
              {product.sizes.map((size, index) => (
                <option key={index} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
          <button className="add-to-cart-btn" onClick={addToCart}>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;

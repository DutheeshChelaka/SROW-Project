import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../styles_pages/productDetails.css";
import { CurrencyContext } from "../context/CurrencyContext"; // Import Currency Context
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // Import carousel styles

const ProductDetails = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1); // Add state for quantity

  const { currency } = useContext(CurrencyContext); // Get selected currency

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
      existingItem.quantity += quantity;
    } else {
      cartItems.push({
        id: product._id,
        name: product.name,
        priceLKR: product.priceLKR,
        priceJPY: product.priceJPY,
        size: selectedSize,
        images: product.images || [], // Store the full images array
        quantity: quantity,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cartItems));
    alert("Product added to cart!");
  };

  if (loading) return <p>Loading product details...</p>;
  if (error) return <p>{error}</p>;
  if (!product) return <p>No product details available.</p>;

  const price = currency === "LKR" ? product.priceLKR : product.priceJPY; // Use correct price
  const currencySymbol = currency === "LKR" ? "LKR" : "¥"; // Set symbol

  return (
    <div className="product-details-container">
      <div className="product-details-card">
        {/* Carousel for multiple images */}
        <div className="image-carousel-container">
          <Carousel
            showArrows={true} // Show arrows for navigation
            autoPlay={true} // Automatically start sliding
            infiniteLoop={true} // Loop through images
            dynamicHeight={true} // Adjust carousel height based on the current image
            interval={5000} // 5 seconds for auto-slide
            showThumbs={false} // Hide thumbnails
            centerMode={true} // Center the active image
            transitionTime={500} // Slide transition speed in ms
          >
            {product.images?.map((image, index) => (
              <div key={index}>
                <img
                  src={`http://localhost:5000/${image}`}
                  alt={`${product.name} - ${index + 1}`}
                  className="product-details-image"
                />
              </div>
            ))}
          </Carousel>
        </div>

        <div className="product-details-info">
          <h2 className="product-details-title">{product.name}</h2>
          <p className="product-details-price">
            Price: {currencySymbol} {price?.toFixed(2) || "N/A"}
          </p>
          <p className="product-details-description">{product.description}</p>

          {/* Size Selector */}
          <div className="product-size-selector">
            <label htmlFor="size">Select Size:</label>
            <select
              id="size"
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
            >
              <option value="">Select</option>
              {product.sizes?.map((size, index) => (
                <option key={index} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>

          {/* Quantity Selector */}
          <div className="product-quantity-selector">
            <label htmlFor="quantity">Quantity:</label>
            <input
              type="number"
              id="quantity"
              value={quantity}
              min="1"
              onChange={(e) => setQuantity(Number(e.target.value))}
            />
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

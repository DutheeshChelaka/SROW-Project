import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles_pages/home.css";
import { CurrencyContext } from "../context/CurrencyContext";

const HomePage = () => {
  const [productsByCategory, setProductsByCategory] = useState({});
  const [loading, setLoading] = useState(true); // ✅ Add loading state
  const navigate = useNavigate();
  const { currency } = useContext(CurrencyContext);
  const productsRef = useRef(null);

  useEffect(() => {
    const fetchCategoriesAndProducts = async () => {
      try {
        const categoriesResponse = await axios.get(
          "http://localhost:5000/api/catalog/categories"
        );
        const categories = categoriesResponse.data;

        console.log("Fetched categories:", categories);

        const categoryProducts = await Promise.all(
          categories.map(async (category) => {
            try {
              const productsResponse = await axios.get(
                `http://localhost:5000/api/catalog/products-by-category/${category._id}`
              );
              return { [category.name]: productsResponse.data };
            } catch (error) {
              console.error(
                `Error fetching products for ${category.name}:`,
                error
              );
              return { [category.name]: [] };
            }
          })
        );

        setProductsByCategory(Object.assign({}, ...categoryProducts));
      } catch (error) {
        console.error("Error fetching categories and products:", error);
      } finally {
        setLoading(false); // ✅ Stop loading after fetching
      }
    };

    fetchCategoriesAndProducts();
  }, []);

  // ✅ Function to smoothly scroll to the products section
  const scrollToProducts = () => {
    if (productsRef.current) {
      productsRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <div className="home-container">
      {/* 🚀 Hero Section */}
      <header className="home-header">
        <h1>Discover the Best in Fashion</h1>
        <p>Luxury, style, and comfort – all in one place.</p>
        <button className="shop-now-btn" onClick={scrollToProducts}>
          Shop Now
        </button>
      </header>

      {/* 🌟 Features Section */}
      <section className="home-features">
        {["feature1.jpg", "feature2.jpg", "feature3.jpg"].map((img, index) => (
          <div key={index} className="feature">
            <img src={`/images/${img}`} alt={`Feature ${index + 1}`} />
            <h3>
              {["Premium Quality", "Express Shipping", "24/7 Support"][index]}
            </h3>
            <p>
              {
                [
                  "Handpicked items made from the finest materials.",
                  "Swift and reliable delivery to your doorstep.",
                  "We're here to help you anytime, anywhere.",
                ][index]
              }
            </p>
          </div>
        ))}
      </section>

      {/* 🔥 Products by Category */}
      <section className="home-products" ref={productsRef}>
        <h2>Shop by Category</h2>

        {loading ? (
          <div className="loading-spinner"></div> // ✅ Stylish Loading Indicator
        ) : Object.keys(productsByCategory).length > 0 ? (
          Object.entries(productsByCategory).map(([categoryName, products]) => (
            <div key={categoryName} className="category-section">
              <h3>{categoryName}</h3>
              <div className="products-grid">
                {products.length > 0 ? (
                  products.map((product) => (
                    <div
                      className="product-card"
                      key={product._id}
                      onClick={() =>
                        navigate(`/products/details/${product._id}`)
                      }
                    >
                      <img
                        src={`http://localhost:5000/${product.images[0]}`}
                        alt={product.name}
                        loading="lazy" // ✅ Optimize Image Loading
                      />
                      <h3>{product.name}</h3>
                      <p>
                        {currency}{" "}
                        {currency === "LKR"
                          ? product.priceLKR
                          : product.priceJPY}
                      </p>
                      <button className="add-to-cart-btn">View Details</button>
                    </div>
                  ))
                ) : (
                  <p>No products available in this category.</p>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="no-products">No products available.</p>
        )}
      </section>
    </div>
  );
};

export default HomePage;

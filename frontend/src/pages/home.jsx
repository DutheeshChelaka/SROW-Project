import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles_pages/home.css";
import { CurrencyContext } from "../context/CurrencyContext";

const HomePage = () => {
  const [productsByCategory, setProductsByCategory] = useState({});
  const navigate = useNavigate();
  const { currency } = useContext(CurrencyContext);
  const productsRef = useRef(null);

  useEffect(() => {
    const fetchCategoriesAndProducts = async () => {
      try {
        // Fetch categories
        const categoriesResponse = await axios.get(
          "http://localhost:5000/api/catalog/categories"
        );
        const categories = categoriesResponse.data;
        console.log("Fetched categories:", categories);

        const categoryProducts = {};

        // For each category, fetch products
        for (const category of categories) {
          try {
            const productsResponse = await axios.get(
              `http://localhost:5000/api/catalog/products-by-category/${category._id}`
            );
            console.log(
              `Products for category "${category.name}":`,
              productsResponse.data
            );
            // Save products under the category name
            categoryProducts[category.name] = productsResponse.data;
          } catch (error) {
            console.error(
              `Error fetching products for category ${category.name}:`,
              error
            );
            categoryProducts[category.name] = [];
          }
        }

        setProductsByCategory(categoryProducts);
      } catch (error) {
        console.error("Error fetching categories and products:", error);
      }
    };

    fetchCategoriesAndProducts();
  }, []);

  // Function to scroll smoothly to the products section
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
        <p>Luxury, style, and comfort – all in one place</p>
        <button className="shop-now-btn" onClick={scrollToProducts}>
          Shop Now
        </button>
      </header>

      {/* 🌟 Features Section */}
      <section className="home-features">
        <div className="feature">
          <img src="/images/feature1.jpg" alt="Quality Products" />
          <h3>Premium Quality</h3>
          <p>Handpicked items made from the finest materials.</p>
        </div>
        <div className="feature">
          <img src="/images/feature2.jpg" alt="Fast Delivery" />
          <h3>Express Shipping</h3>
          <p>Swift and reliable delivery to your doorstep.</p>
        </div>
        <div className="feature">
          <img src="/images/feature3.jpg" alt="24/7 Support" />
          <h3>24/7 Support</h3>
          <p>We're here to help you anytime, anywhere.</p>
        </div>
      </section>

      {/* 🔥 Products by Category */}
      <section className="home-products" ref={productsRef}>
        <h2>Shop by Category</h2>
        {Object.keys(productsByCategory).length > 0 ? (
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

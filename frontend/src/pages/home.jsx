import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { CurrencyContext } from "../context/CurrencyContext";
import API_URL from "../config/api";


const HomePage = () => {
  const [productsByCategory, setProductsByCategory] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { currency } = useContext(CurrencyContext);
  const productsRef = useRef(null);

  useEffect(() => {
    const fetchCategoriesAndProducts = async () => {
      try {
        const categoriesResponse = await axios.get(
          `${API_URL}/api/catalog/categories`
        );
        const categories = categoriesResponse.data;

        const categoryProducts = await Promise.all(
          categories.map(async (category) => {
            try {
              const productsResponse = await axios.get(
                `${API_URL}/api/catalog/products-by-category/${category._id}`
              );
              return { [category.name]: productsResponse.data };
            } catch (error) {
              console.error(`Error fetching products for ${category.name}:`, error);
              return { [category.name]: [] };
            }
          })
        );

        setProductsByCategory(Object.assign({}, ...categoryProducts));
      } catch (error) {
        console.error("Error fetching categories and products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoriesAndProducts();
  }, []);

  const scrollToProducts = () => {
    if (productsRef.current) {
      productsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="bg-white">

      {/* ===== HERO SECTION ===== */}
      <section className="relative bg-brand-surface overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-24 sm:py-32 lg:py-40 text-center">
          <p className="text-[11px] font-body font-semibold tracking-[0.3em] uppercase text-brand-muted mb-6 animate-fade-in">
            New Season Collection
          </p>
          <h1 className="font-heading text-5xl sm:text-6xl lg:text-7xl font-medium text-brand-black leading-tight mb-6 animate-slide-up">
            Discover the Best
            <br />
            <span className="italic">in Fashion</span>
          </h1>
          <p className="font-body text-base sm:text-lg text-brand-muted max-w-md mx-auto mb-10 animate-slide-up">
            Luxury, style, and comfort — all in one place.
          </p>
          <button
            onClick={scrollToProducts}
            className="btn-primary animate-slide-up"
          >
            Shop Now
          </button>
        </div>

        {/* Decorative bottom border */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-brand-border" />
      </section>

      {/* ===== FEATURES SECTION ===== */}
      <section className="border-b border-brand-border">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-brand-border">
            {[
              {
                title: "Premium Quality",
                desc: "Handpicked items made from the finest materials.",
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
                  </svg>
                ),
              },
              {
                title: "Express Shipping",
                desc: "Swift and reliable delivery to your doorstep.",
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                  </svg>
                ),
              },
              {
                title: "24/7 Support",
                desc: "We're here to help you anytime, anywhere.",
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
                  </svg>
                ),
              },
            ].map((feature, index) => (
              <div key={index} className="px-8 py-10 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-brand-surface text-brand-text mb-4">
                  {feature.icon}
                </div>
                <h3 className="font-heading text-xl font-semibold text-brand-text mb-2">
                  {feature.title}
                </h3>
                <p className="font-body text-sm text-brand-muted leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PRODUCTS BY CATEGORY ===== */}
      <section ref={productsRef} className="py-16 sm:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-[11px] font-body font-semibold tracking-[0.3em] uppercase text-brand-muted mb-3">
              Curated For You
            </p>
            <h2 className="font-heading text-4xl sm:text-5xl font-medium text-brand-black">
              Shop by Category
            </h2>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-2 border-brand-border border-t-brand-black rounded-full animate-spin" />
            </div>
          ) : Object.keys(productsByCategory).length > 0 ? (
            Object.entries(productsByCategory).map(([categoryName, products]) => (
              <div key={categoryName} className="mb-16 last:mb-0">
                {/* Category Title */}
                <div className="flex items-center gap-4 mb-8">
                  <h3 className="font-heading text-2xl sm:text-3xl font-medium text-brand-text">
                    {categoryName}
                  </h3>
                  <div className="flex-1 h-px bg-brand-border" />
                </div>

                {/* Product Grid */}
                {products.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                    {products.map((product) => (
                      <div
                        key={product._id}
                        className="group cursor-pointer"
                        onClick={() => navigate(`/products/details/${product._id}`)}
                      >
                        {/* Product Image */}
                        <div className="aspect-[3/4] overflow-hidden bg-brand-surface mb-3">
                          <img
                            src={`${API_URL}/${product.images[0]}`}
                            alt={product.name}
                            loading="lazy"
                            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                          />
                        </div>

                        {/* Product Info */}
                        <h4 className="font-body text-sm font-medium text-brand-text mb-1 group-hover:text-brand-accent transition-colors">
                          {product.name}
                        </h4>
                        <p className="font-body text-sm text-brand-muted">
                          {currency}{" "}
                          {currency === "LKR" ? product.priceLKR : product.priceJPY}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm font-body text-brand-muted text-center py-8">
                    No products available in this category.
                  </p>
                )}
              </div>
            ))
          ) : (
            <p className="text-center font-body text-brand-muted py-16">
              No products available.
            </p>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
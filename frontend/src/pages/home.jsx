import React, { useState, useEffect, useContext, useRef, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { CurrencyContext } from "../context/CurrencyContext";
import API_URL from "../config/api";

const HomePage = () => {
  const [productsByCategory, setProductsByCategory] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [imageErrors, setImageErrors] = useState({});
  const navigate = useNavigate();
  const { currency } = useContext(CurrencyContext); // Removed formatPrice dependency
  const productsRef = useRef(null);
  const heroRef = useRef(null);

  // Helper function to format price (since formatPrice might not exist in context)
  const formatPrice = useCallback((product) => {
    try {
      if (!product) return `${currency} 0`;
      
      const price = currency === "LKR" ? product.priceLKR : product.priceJPY;
      
      // Format with thousand separators
      if (currency === "LKR") {
        return `LKR ${Number(price).toLocaleString('en-LK')}`;
      } else {
        return `¥ ${Number(price).toLocaleString('ja-JP')}`;
      }
    } catch (error) {
      console.error("Error formatting price:", error);
      return `${currency} ${product?.priceLKR || product?.priceJPY || 0}`;
    }
  }, [currency]);

  // Fetch categories and products
  useEffect(() => {
    const fetchCategoriesAndProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const categoriesResponse = await axios.get(
          `${API_URL}/api/catalog/categories`
        );
        const categories = categoriesResponse.data;

        // Fetch products for each category with better error handling
        const categoryProducts = await Promise.all(
          categories.map(async (category) => {
            try {
              const productsResponse = await axios.get(
                `${API_URL}/api/catalog/products-by-category/${category._id}?limit=8`
              );
              return { [category.name]: productsResponse.data };
            } catch (error) {
              console.error(`Error fetching products for ${category.name}:`, error);
              return { [category.name]: [] };
            }
          })
        );

        const mergedProducts = Object.assign({}, ...categoryProducts);
        setProductsByCategory(mergedProducts);
      } catch (error) {
        console.error("Error fetching categories and products:", error);
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategoriesAndProducts();
  }, []);

  const scrollToProducts = useCallback(() => {
    if (productsRef.current) {
      productsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  const handleProductClick = useCallback((productId) => {
    navigate(`/products/details/${productId}`);
  }, [navigate]);

  const handleImageError = useCallback((productId) => {
    setImageErrors(prev => ({ ...prev, [productId]: true }));
  }, []);

  const handleMouseEnter = useCallback((productId) => {
    setHoveredProduct(productId);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoveredProduct(null);
  }, []);

  // Get image URL with fallback
  const getImageUrl = useCallback((product) => {
    try {
      if (!product?.images?.[0] || imageErrors[product._id]) {
        return '/api/placeholder/400/500'; // Make sure to have a placeholder image
      }
      return `${API_URL}/${product.images[0]}`;
    } catch (error) {
      return '/api/placeholder/400/500';
    }
  }, [imageErrors]);

  // Memoized features data
  const features = useMemo(() => [
    {
      title: "Premium Quality",
      desc: "Handpicked items made from the finest materials.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
        </svg>
      ),
      gradient: "from-amber-500 to-orange-500",
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
      gradient: "from-blue-500 to-cyan-500",
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
      gradient: "from-purple-500 to-pink-500",
    },
  ], []);

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="text-lg font-body text-brand-muted mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-3 bg-brand-black text-white rounded-full font-body text-sm font-medium hover:bg-brand-accent transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* ===== HERO SECTION ===== */}
      <section 
        ref={heroRef}
        className="relative bg-gradient-to-r from-brand-black to-gray-900 overflow-hidden"
      >
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white opacity-5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white opacity-5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-24 sm:py-32 lg:py-40 text-center">
          <p className="text-[11px] font-body font-semibold tracking-[0.3em] uppercase text-white/70 mb-6 animate-fade-in">
            New Season Collection
          </p>
          <h1 className="font-heading text-5xl sm:text-6xl lg:text-7xl font-medium text-white leading-tight mb-6 animate-slide-up">
            Discover the Best
            <br />
            <span className="italic bg-gradient-to-r from-yellow-200 to-pink-200 bg-clip-text text-transparent">
              in Fashion
            </span>
          </h1>
          <p className="font-body text-base sm:text-lg text-white/80 max-w-md mx-auto mb-10 animate-slide-up">
            Luxury, style, and comfort — all in one place. Experience the finest collection curated just for you.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up">
            <button
              onClick={scrollToProducts}
              className="group relative px-8 py-4 bg-white text-brand-black rounded-full font-body text-sm font-medium hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              Shop Now
            </button>
            
            <button
              onClick={() => navigate('/collections')}
              className="px-8 py-4 border-2 border-white/30 text-white rounded-full font-body text-sm font-medium hover:bg-white/10 hover:border-white/50 transition-all duration-300"
            >
              View Collections
            </button>
          </div>
        </div>
      </section>

      {/* ===== FEATURES SECTION ===== */}
      <section className="border-b border-brand-border bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-brand-border">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="group px-8 py-10 text-center hover:bg-gray-50 transition-all duration-300 cursor-default"
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${feature.gradient} text-white mb-4 transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
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
      <section ref={productsRef} className="py-16 sm:py-20 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          {/* Section Header */}
          <div className="text-center mb-14">
            <p className="text-[11px] font-body font-semibold tracking-[0.3em] uppercase text-brand-muted mb-3">
              Curated For You
            </p>
            <h2 className="font-heading text-4xl sm:text-5xl font-medium text-brand-black mb-4">
              Shop by Category
            </h2>
            <p className="font-body text-brand-muted max-w-2xl mx-auto">
              Explore our carefully curated collection of premium products, 
              handpicked to bring you the best in fashion and style.
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-brand-border border-t-brand-black rounded-full animate-spin"></div>
              </div>
            </div>
          ) : Object.keys(productsByCategory).length > 0 ? (
            Object.entries(productsByCategory).map(([categoryName, products]) => (
              <div key={categoryName} className="mb-20 last:mb-0">
                {/* Category Header */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <h3 className="font-heading text-2xl sm:text-3xl font-medium text-brand-text">
                      {categoryName}
                    </h3>
                    <span className="px-3 py-1 bg-gray-100 text-brand-muted rounded-full text-xs font-body">
                      {products.length} items
                    </span>
                  </div>
                  
                  {products.length > 0 && (
                    <button
                      onClick={() => navigate(`/category/${categoryName}`)}
                      className="group flex items-center gap-2 text-sm font-body text-brand-muted hover:text-brand-accent transition-colors"
                    >
                      View All
                      <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  )}
                </div>

                {/* Product Grid */}
                {products.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
                    {products.map((product) => (
                      <div
                        key={product._id}
                        className="group cursor-pointer"
                        onClick={() => handleProductClick(product._id)}
                        onMouseEnter={() => handleMouseEnter(product._id)}
                        onMouseLeave={handleMouseLeave}
                      >
                        {/* Product Image Container */}
                        <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 mb-3 rounded-lg shadow-sm group-hover:shadow-xl transition-all duration-500">
                          {/* Main Image */}
                          <img
                            src={getImageUrl(product)}
                            alt={product.name || 'Product image'}
                            loading="lazy"
                            onError={() => handleImageError(product._id)}
                            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                          />
                          
                          {/* Hover Overlay */}
                          <div className={`absolute inset-0 bg-black/40 flex items-center justify-center gap-2 transition-opacity duration-300 ${hoveredProduct === product._id ? 'opacity-100' : 'opacity-0'}`}>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                // Add to cart functionality
                                console.log('Add to cart:', product._id);
                              }}
                              className="p-3 bg-white rounded-full hover:bg-brand-accent hover:text-white transition-colors transform hover:scale-110"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                              </svg>
                            </button>
                          </div>
                        </div>

                        {/* Product Info */}
                        <div>
                          <h4 className="font-body text-sm font-medium text-brand-text mb-1 group-hover:text-brand-accent transition-colors line-clamp-2">
                            {product.name || 'Product Name'}
                          </h4>

                          {/* Price */}
                          <p className="font-body text-sm font-semibold text-brand-accent">
                            {formatPrice(product)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <p className="text-sm font-body text-brand-muted">
                      No products available in this category.
                    </p>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-16">
              <svg className="w-16 h-16 text-brand-muted mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <p className="font-body text-brand-muted">
                No products available at the moment.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
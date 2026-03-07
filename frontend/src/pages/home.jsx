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
  const [scrollY, setScrollY] = useState(0);
  const navigate = useNavigate();
  const { currency } = useContext(CurrencyContext);
  const productsRef = useRef(null);

  // Parallax scroll tracking
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const formatPrice = useCallback((product) => {
    if (!product) return `${currency} 0`;
    const price = currency === "LKR" ? product.priceLKR : product.priceJPY;
    return currency === "LKR"
      ? `LKR ${Number(price).toLocaleString("en-LK")}`
      : `¥ ${Number(price).toLocaleString("ja-JP")}`;
  }, [currency]);

  useEffect(() => {
    const fetchCategoriesAndProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const catRes = await axios.get(`${API_URL}/api/catalog/categories`);
        const categoryProducts = await Promise.all(
          catRes.data.map(async (category) => {
            try {
              const prodRes = await axios.get(`${API_URL}/api/catalog/products-by-category/${category._id}?limit=8`);
              return { [category.name]: prodRes.data };
            } catch { return { [category.name]: [] }; }
          })
        );
        setProductsByCategory(Object.assign({}, ...categoryProducts));
      } catch (err) {
        console.error("Error:", err);
        setError("Failed to load products. Please try again.");
      } finally { setLoading(false); }
    };
    fetchCategoriesAndProducts();
  }, []);

  const scrollToProducts = useCallback(() => {
    productsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const getImageUrl = useCallback((product) => {
    if (!product?.images?.[0] || imageErrors[product._id]) return null;
    return `${API_URL}/${product.images[0]}`;
  }, [imageErrors]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <svg className="w-16 h-16 text-neutral-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
          <p className="font-body text-brand-muted mb-6">{error}</p>
          <button onClick={() => window.location.reload()} className="btn-primary">Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">

      {/* ═══════════════════════════════════════════
          HERO SECTION — Full-screen cinematic
      ═══════════════════════════════════════════ */}
      <section className="relative min-h-[85vh] sm:min-h-[90vh] bg-brand-black overflow-hidden flex items-center">
        {/* Parallax background layers */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-black via-neutral-900 to-brand-black" />
          <div
            className="absolute -top-20 -right-20 w-[500px] h-[500px] border border-white/[0.03] rounded-full"
            style={{ transform: `translateY(${scrollY * 0.1}px)` }}
          />
          <div
            className="absolute -top-10 -right-10 w-[500px] h-[500px] border border-white/[0.03] rounded-full"
            style={{ transform: `translateY(${scrollY * 0.15}px)` }}
          />
          <div
            className="absolute -bottom-32 -left-32 w-[600px] h-[600px] border border-white/[0.03] rounded-full"
            style={{ transform: `translateY(${scrollY * -0.08}px)` }}
          />
          <div
            className="absolute -bottom-20 -left-20 w-[600px] h-[600px] border border-white/[0.03] rounded-full"
            style={{ transform: `translateY(${scrollY * -0.12}px)` }}
          />
          {/* Accent glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-brand-accent/5 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <div className="max-w-3xl">
            {/* Eyebrow */}
            <div className="flex items-center gap-3 mb-8 animate-fade-in">
              <div className="w-8 h-px bg-brand-accent" />
              <p className="text-[11px] font-body font-semibold tracking-[0.3em] uppercase text-brand-accent">
                New Season 2025
              </p>
            </div>

            {/* Main Heading */}
            <h1 className="font-heading text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-medium text-white leading-[0.95] mb-8 animate-slide-up">
              Redefine
              <br />
              Your <span className="italic text-brand-accent">Style</span>
            </h1>

            {/* Subtitle */}
            <p className="font-body text-base sm:text-lg text-neutral-400 max-w-md mb-12 leading-relaxed animate-slide-up">
              Curated fashion for the modern individual. Premium quality, timeless design, delivered to your door.
            </p>

            {/* CTA Row */}
            <div className="flex flex-wrap items-center gap-4 animate-slide-up">
              <button
                onClick={scrollToProducts}
                className="group px-8 py-4 bg-white text-brand-black font-body text-sm font-semibold tracking-[0.1em] uppercase
                           hover:bg-brand-accent hover:text-white transition-all duration-300"
              >
                <span className="flex items-center gap-2">
                  Shop Now
                  <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </button>
              <button
                onClick={() => navigate("/about")}
                className="px-8 py-4 border border-white/20 text-white font-body text-sm font-medium tracking-[0.1em] uppercase
                           hover:border-white/50 hover:bg-white/5 transition-all duration-300"
              >
                Our Story
              </button>
            </div>

            {/* Stats Row */}
            <div className="flex items-center gap-8 sm:gap-12 mt-16 pt-8 border-t border-white/10 animate-fade-in">
              {[
                { number: "2.5K+", label: "Happy Customers" },
                { number: "500+", label: "Products" },
                { number: "4.9", label: "Average Rating" },
              ].map((stat, i) => (
                <div key={i}>
                  <p className="font-heading text-2xl sm:text-3xl font-semibold text-white">{stat.number}</p>
                  <p className="font-body text-[11px] text-neutral-500 tracking-wider uppercase mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <span className="font-body text-[10px] text-neutral-600 tracking-widest uppercase">Scroll</span>
          <svg className="w-4 h-4 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          MARQUEE TRUST BAR
      ═══════════════════════════════════════════ */}
      <section className="border-b border-brand-border py-5 overflow-hidden bg-brand-surface">
        <div className="flex items-center justify-center gap-12 sm:gap-20">
          {[
            { icon: "M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z", text: "Premium Quality" },
            { icon: "M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25m-2.25 0V6.75", text: "Free Shipping" },
            { icon: "M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z", text: "Secure Checkout" },
            { icon: "M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.745 3.745 0 011.043 3.296A3.745 3.745 0 0121 12z", text: "Authentic Products" },
            { icon: "M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3", text: "Easy Returns" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2 flex-shrink-0">
              <svg className="w-4 h-4 text-brand-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
              </svg>
              <span className="font-body text-[11px] font-medium tracking-[0.1em] uppercase text-brand-muted whitespace-nowrap">
                {item.text}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          PRODUCTS BY CATEGORY
      ═══════════════════════════════════════════ */}
      <section ref={productsRef} className="py-20 sm:py-24 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-8 h-px bg-brand-accent" />
              <p className="text-[11px] font-body font-semibold tracking-[0.3em] uppercase text-brand-accent">
                Curated For You
              </p>
              <div className="w-8 h-px bg-brand-accent" />
            </div>
            <h2 className="font-heading text-4xl sm:text-5xl font-medium text-brand-black mb-4">
              Shop by Category
            </h2>
            <p className="font-body text-sm text-brand-muted max-w-lg mx-auto">
              Explore our carefully curated collection of premium products, handpicked for quality and style.
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-24">
              <div className="w-12 h-12 border-2 border-brand-border border-t-brand-black rounded-full animate-spin" />
            </div>
          ) : Object.keys(productsByCategory).length > 0 ? (
            Object.entries(productsByCategory).map(([categoryName, products]) => (
              <div key={categoryName} className="mb-20 last:mb-0">
                {/* Category Header */}
                <div className="flex items-end justify-between mb-8 pb-4 border-b border-brand-border">
                  <div>
                    <h3 className="font-heading text-2xl sm:text-3xl font-medium text-brand-black">
                      {categoryName}
                    </h3>
                    <p className="font-body text-xs text-brand-muted mt-1">
                      {products.length} product{products.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                  {products.length > 0 && (
                    <button
                      onClick={() => navigate(`/category/${categoryName}`)}
                      className="group flex items-center gap-1.5 font-body text-xs font-medium tracking-[0.1em] uppercase text-brand-muted hover:text-brand-black transition-colors"
                    >
                      View All
                      <svg className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                      </svg>
                    </button>
                  )}
                </div>

                {/* Product Grid */}
                {products.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 sm:gap-x-6 gap-y-10">
                    {products.map((product) => (
                      <div
                        key={product._id}
                        className="group cursor-pointer"
                        onClick={() => navigate(`/products/details/${product._id}`)}
                        onMouseEnter={() => setHoveredProduct(product._id)}
                        onMouseLeave={() => setHoveredProduct(null)}
                      >
                        {/* Image */}
                        <div className="relative aspect-[3/4] overflow-hidden bg-brand-surface mb-3">
                          {getImageUrl(product) ? (
                            <img
                              src={getImageUrl(product)}
                              alt={product.name}
                              loading="lazy"
                              onError={() => setImageErrors((p) => ({ ...p, [product._id]: true }))}
                              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <svg className="w-10 h-10 text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a2.25 2.25 0 002.25-2.25V5.25a2.25 2.25 0 00-2.25-2.25H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
                              </svg>
                            </div>
                          )}

                          {/* Quick action overlay */}
                          <div className={`absolute inset-0 bg-black/20 flex items-end justify-center pb-4 transition-opacity duration-300 ${
                            hoveredProduct === product._id ? "opacity-100" : "opacity-0"
                          }`}>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/products/details/${product._id}`);
                              }}
                              className="px-6 py-2.5 bg-white text-brand-black font-body text-xs font-semibold tracking-[0.1em] uppercase
                                         hover:bg-brand-black hover:text-white transition-all duration-200"
                            >
                              Quick View
                            </button>
                          </div>
                        </div>

                        {/* Info */}
                        <h4 className="font-body text-sm font-medium text-brand-text group-hover:text-brand-accent transition-colors line-clamp-1">
                          {product.name}
                        </h4>
                        <p className="font-body text-sm text-brand-muted mt-0.5">
                          {formatPrice(product)}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 bg-brand-surface">
                    <p className="font-body text-sm text-brand-muted">No products in this category yet.</p>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-24">
              <svg className="w-16 h-16 text-brand-border mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
              </svg>
              <h3 className="font-heading text-xl font-medium text-brand-text mb-2">No products yet</h3>
              <p className="font-body text-sm text-brand-muted">Check back soon for new arrivals.</p>
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          CTA BANNER
      ═══════════════════════════════════════════ */}
      <section className="bg-brand-black py-20 sm:py-24 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 border border-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-72 h-72 border border-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <p className="text-[11px] font-body font-semibold tracking-[0.3em] uppercase text-brand-accent mb-4">
            Stay Connected
          </p>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-medium text-white mb-4">
            Join the SROW Community
          </h2>
          <p className="font-body text-sm text-neutral-400 mb-10 max-w-md mx-auto">
            Subscribe for exclusive drops, early access to new collections, and members-only offers.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 bg-transparent border border-white/20 px-5 py-3.5 text-sm text-white placeholder-neutral-500
                         focus:outline-none focus:border-brand-accent font-body transition-colors"
            />
            <button className="px-8 py-3.5 bg-white text-brand-black font-body text-sm font-semibold tracking-[0.1em] uppercase
                               hover:bg-brand-accent hover:text-white transition-all duration-300 whitespace-nowrap">
              Subscribe
            </button>
          </div>

          <p className="font-body text-[11px] text-neutral-600 mt-4">
            No spam, ever. Unsubscribe anytime.
          </p>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
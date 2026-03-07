import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { CurrencyContext } from "../context/CurrencyContext";
import API_URL from "../config/api";

const Products = () => {
  const { subcategoryId } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [imageErrors, setImageErrors] = useState({});
  const { currency, exchangeRate } = useContext(CurrencyContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${API_URL}/api/catalog/products?subcategory=${subcategoryId}`
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

  const getPrice = (product) => {
    const priceLKR = product.priceLKR ?? 0;
    const priceJPY = product.priceJPY ?? 0;
    const price = currency === "LKR" ? priceLKR : priceJPY;
    const converted = currency === "JPY" ? price.toFixed(2) : (price * exchangeRate).toFixed(2);
    return `${currency === "LKR" ? "LKR" : "¥"} ${Number(converted).toLocaleString()}`;
  };

  const getImageUrl = (product) => {
    if (!product?.images?.[0] || imageErrors[product._id]) return null;
    return `${API_URL}/${product.images[0]}`;
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* Back + Header */}
        <div className="mb-10">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 font-body text-sm text-brand-muted hover:text-brand-black transition-colors mb-4"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Back
          </button>

          <div className="flex items-end justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-6 h-px bg-brand-accent" />
                <p className="text-[11px] font-body font-semibold tracking-[0.3em] uppercase text-brand-accent">
                  Collection
                </p>
              </div>
              <h1 className="font-heading text-3xl sm:text-4xl font-medium text-brand-black">
                Products
              </h1>
            </div>
            {!loading && products.length > 0 && (
              <p className="font-body text-xs text-brand-muted tracking-wider">
                {products.length} item{products.length !== 1 ? "s" : ""}
              </p>
            )}
          </div>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-3">
            <div className="w-10 h-10 border-2 border-brand-border border-t-brand-black rounded-full animate-spin" />
            <p className="font-body text-xs text-brand-muted">Loading products...</p>
          </div>

        ) : error ? (
          <div className="text-center py-32">
            <svg className="w-12 h-12 text-neutral-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
            <p className="font-body text-sm text-brand-muted mb-4">{error}</p>
            <button onClick={() => window.location.reload()} className="btn-outline">Try Again</button>
          </div>

        ) : products.length === 0 ? (
          <div className="text-center py-32">
            <svg className="w-16 h-16 text-brand-border mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
            </svg>
            <h3 className="font-heading text-xl font-medium text-brand-text mb-2">No products found</h3>
            <p className="font-body text-sm text-brand-muted mb-6">Check back later for new arrivals.</p>
            <button onClick={() => navigate("/home")} className="btn-primary">Browse Categories</button>
          </div>

        ) : (
          /* ═══ Product Grid ═══ */
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 sm:gap-x-6 gap-y-10 sm:gap-y-14">
            {products.map((product) => {
              const imageUrl = getImageUrl(product);

              return (
                <div
                  key={product._id}
                  className="group cursor-pointer"
                  onClick={() => navigate(`/products/details/${product._id}`)}
                  onMouseEnter={() => setHoveredProduct(product._id)}
                  onMouseLeave={() => setHoveredProduct(null)}
                >
                  {/* Image Container */}
                  <div className="relative aspect-[3/4] overflow-hidden bg-brand-surface mb-4">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={product.name}
                        loading="lazy"
                        onError={() => setImageErrors((p) => ({ ...p, [product._id]: true }))}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-10 h-10 text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                            d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a2.25 2.25 0 002.25-2.25V5.25a2.25 2.25 0 00-2.25-2.25H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
                        </svg>
                      </div>
                    )}

                    {/* Hover Overlay — Quick View */}
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

                    {/* Size chips (show on hover) */}
                    {product.sizes && product.sizes.length > 0 && (
                      <div className={`absolute top-3 left-3 flex flex-wrap gap-1 transition-opacity duration-300 ${
                        hoveredProduct === product._id ? "opacity-100" : "opacity-0"
                      }`}>
                        {product.sizes.slice(0, 4).map((size, i) => (
                          <span key={i} className="px-2 py-0.5 bg-white/90 text-[10px] font-body font-medium text-brand-black">
                            {size}
                          </span>
                        ))}
                        {product.sizes.length > 4 && (
                          <span className="px-2 py-0.5 bg-white/90 text-[10px] font-body font-medium text-brand-muted">
                            +{product.sizes.length - 4}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div>
                    <h3 className="font-body text-sm font-medium text-brand-text group-hover:text-brand-accent transition-colors line-clamp-1 mb-1">
                      {product.name}
                    </h3>
                    <p className="font-body text-sm text-brand-muted">
                      {getPrice(product)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
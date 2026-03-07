import React, { useState, useEffect, useContext, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { CurrencyContext } from "../context/CurrencyContext";
import API_URL from "../config/api";

const ProductDetails = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);
  const [sizeError, setSizeError] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const [showDetails, setShowDetails] = useState(false);
  const [showShipping, setShowShipping] = useState(false);
  const imageRef = useRef(null);
  const { currency } = useContext(CurrencyContext);

  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_URL}/api/catalog/products/${productId}`);
        setProduct(response.data);
        setError("");
      } catch (err) {
        console.error("Error fetching product details:", err);
        setError("Error fetching product details.");
      } finally {
        setLoading(false);
      }
    };
    fetchProductDetails();
    window.scrollTo(0, 0);
  }, [productId]);

  const handleMouseMove = (e) => {
    if (!imageRef.current) return;
    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x, y });
  };

  const addToCart = () => {
    if (!selectedSize) {
      setSizeError(true);
      return;
    }
    setSizeError(false);

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
        images: product.images || [],
        quantity,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cartItems));
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2500);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-brand-border border-t-brand-black rounded-full animate-spin" />
          <p className="font-body text-xs text-brand-muted">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <svg className="w-12 h-12 text-neutral-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
          <p className="font-body text-sm text-brand-muted mb-4">{error || "Product not found."}</p>
          <button onClick={() => navigate(-1)} className="btn-outline">Go Back</button>
        </div>
      </div>
    );
  }

  const price = currency === "LKR" ? product.priceLKR : product.priceJPY;
  const currencySymbol = currency === "LKR" ? "LKR" : "¥";
  const formattedPrice = `${currencySymbol} ${Number(price).toLocaleString()}`;
  const totalPrice = `${currencySymbol} ${(Number(price) * quantity).toLocaleString()}`;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 font-body text-xs text-brand-muted">
          <button onClick={() => navigate("/home")} className="hover:text-brand-black transition-colors">Home</button>
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
          <button onClick={() => navigate(-1)} className="hover:text-brand-black transition-colors">Products</button>
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
          <span className="text-brand-text font-medium truncate max-w-[200px]">{product.name}</span>
        </nav>

        {/* ═══ Main Layout ═══ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

          {/* ── LEFT: Image Gallery (7 cols) ── */}
          <div className="lg:col-span-7">
            <div className="flex flex-col-reverse lg:flex-row gap-4">

              {/* Vertical Thumbnails (desktop) */}
              {product.images?.length > 1 && (
                <div className="hidden lg:flex flex-col gap-2 w-20 flex-shrink-0">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`w-20 h-24 overflow-hidden bg-brand-surface border-2 transition-all duration-200 ${
                        selectedImageIndex === index
                          ? "border-brand-black"
                          : "border-transparent hover:border-neutral-300"
                      }`}
                    >
                      <img src={`${API_URL}/${image}`} alt={`View ${index + 1}`}
                        className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Main Image */}
              <div className="flex-1">
                <div
                  ref={imageRef}
                  className="relative aspect-[3/4] overflow-hidden bg-brand-surface cursor-zoom-in"
                  onMouseEnter={() => setIsZoomed(true)}
                  onMouseLeave={() => setIsZoomed(false)}
                  onMouseMove={handleMouseMove}
                >
                  <img
                    src={`${API_URL}/${product.images?.[selectedImageIndex]}`}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-300"
                    style={isZoomed ? {
                      transform: "scale(2)",
                      transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                    } : {}}
                  />

                  {/* Image counter */}
                  <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 font-body text-[11px] font-medium text-brand-text">
                    {selectedImageIndex + 1} / {product.images?.length || 1}
                  </div>
                </div>

                {/* Horizontal Thumbnails (mobile) */}
                {product.images?.length > 1 && (
                  <div className="flex lg:hidden gap-2 mt-3 overflow-x-auto pb-2">
                    {product.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`flex-shrink-0 w-16 h-20 overflow-hidden bg-brand-surface border-2 transition-all ${
                          selectedImageIndex === index
                            ? "border-brand-black"
                            : "border-transparent"
                        }`}
                      >
                        <img src={`${API_URL}/${image}`} alt={`View ${index + 1}`}
                          className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── RIGHT: Product Info (5 cols) ── */}
          <div className="lg:col-span-5 lg:py-2">
            {/* Title */}
            <h1 className="font-heading text-3xl sm:text-4xl font-medium text-brand-black leading-tight mb-3">
              {product.name}
            </h1>

            {/* Price */}
            <p className="font-body text-2xl font-medium text-brand-black mb-6">
              {formattedPrice}
            </p>

            {/* Short description */}
            <p className="font-body text-sm text-brand-muted leading-relaxed mb-8">
              {product.description}
            </p>

            <div className="h-px bg-brand-border mb-8" />

            {/* Size Selector */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <label className="font-body text-xs font-semibold tracking-[0.15em] uppercase text-brand-text">
                  Size
                </label>
                <button className="font-body text-[11px] text-brand-muted underline hover:text-brand-text transition-colors">
                  Size Guide
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes?.map((size, index) => (
                  <button
                    key={index}
                    onClick={() => { setSelectedSize(size); setSizeError(false); }}
                    className={`min-w-[52px] h-12 px-4 border text-sm font-body font-medium transition-all duration-200 ${
                      selectedSize === size
                        ? "border-brand-black bg-brand-black text-white"
                        : sizeError
                          ? "border-red-300 text-brand-text hover:border-brand-black"
                          : "border-brand-border text-brand-text hover:border-brand-black"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
              {sizeError && (
                <p className="mt-2 font-body text-xs text-red-500 flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                  </svg>
                  Please select a size
                </p>
              )}
            </div>

            {/* Quantity */}
            <div className="mb-8">
              <label className="block font-body text-xs font-semibold tracking-[0.15em] uppercase text-brand-text mb-3">
                Quantity
              </label>
              <div className="inline-flex items-center border border-brand-border">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-12 flex items-center justify-center text-brand-text hover:bg-brand-surface transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 12h-15" />
                  </svg>
                </button>
                <span className="w-14 h-12 flex items-center justify-center font-body text-sm font-medium text-brand-text border-x border-brand-border">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-12 h-12 flex items-center justify-center text-brand-text hover:bg-brand-surface transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                </button>
              </div>
              {quantity > 1 && (
                <p className="mt-2 font-body text-xs text-brand-muted">
                  Total: {totalPrice}
                </p>
              )}
            </div>

            {/* Add to Cart + Buy Now */}
            <div className="flex flex-col gap-3 mb-8">
              <button
                onClick={addToCart}
                className={`w-full py-4 text-sm font-body font-semibold tracking-[0.15em] uppercase transition-all duration-300 flex items-center justify-center gap-2 ${
                  addedToCart
                    ? "bg-green-600 text-white"
                    : "bg-brand-black text-white hover:bg-neutral-800 active:scale-[0.98]"
                }`}
              >
                {addedToCart ? (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    Added to Cart
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                    </svg>
                    Add to Cart — {formattedPrice}
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  addToCart();
                  if (selectedSize) navigate("/checkout");
                }}
                className="w-full py-4 text-sm font-body font-medium tracking-[0.15em] uppercase border-2 border-brand-black text-brand-black
                           hover:bg-brand-black hover:text-white transition-all duration-300"
              >
                Buy Now
              </button>
            </div>

            {/* Accordion: Product Details */}
            <div className="border-t border-brand-border">
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="w-full flex items-center justify-between py-5 group"
              >
                <span className="font-body text-sm font-medium text-brand-text">Product Details</span>
                <svg className={`w-4 h-4 text-brand-muted transition-transform duration-200 ${showDetails ? "rotate-180" : ""}`}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </button>
              {showDetails && (
                <div className="pb-5 font-body text-sm text-brand-muted leading-relaxed space-y-2">
                  <p>{product.description}</p>
                  {product.sizes && (
                    <p>Available sizes: {product.sizes.join(", ")}</p>
                  )}
                </div>
              )}
            </div>

            {/* Accordion: Shipping & Returns */}
            <div className="border-t border-brand-border">
              <button
                onClick={() => setShowShipping(!showShipping)}
                className="w-full flex items-center justify-between py-5 group"
              >
                <span className="font-body text-sm font-medium text-brand-text">Shipping & Returns</span>
                <svg className={`w-4 h-4 text-brand-muted transition-transform duration-200 ${showShipping ? "rotate-180" : ""}`}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </button>
              {showShipping && (
                <div className="pb-5 font-body text-sm text-brand-muted leading-relaxed space-y-3">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-brand-accent flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25m-2.25 0V6.75" />
                    </svg>
                    <div>
                      <p className="text-brand-text font-medium">Free Shipping</p>
                      <p>On orders over LKR 10,000. Standard delivery 3-5 business days.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-brand-accent flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                    </svg>
                    <div>
                      <p className="text-brand-text font-medium">Easy Returns</p>
                      <p>Return within 14 days for a full refund. Items must be unworn with tags attached.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-brand-accent flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                    </svg>
                    <div>
                      <p className="text-brand-text font-medium">Secure Payment</p>
                      <p>All transactions encrypted with 256-bit SSL. Stripe powered.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-brand-border" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { CurrencyContext } from "../context/CurrencyContext";
import API_URL from "../config/api";

const ProductDetails = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);

  const { currency } = useContext(CurrencyContext);

  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${API_URL}/api/catalog/products/${productId}`
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
        images: product.images || [],
        quantity: quantity,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cartItems));
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand-border border-t-brand-black rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="font-body text-brand-muted mb-4">{error}</p>
          <button onClick={() => window.location.reload()} className="btn-outline">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="font-body text-brand-muted">No product details available.</p>
      </div>
    );
  }

  const price = currency === "LKR" ? product.priceLKR : product.priceJPY;
  const currencySymbol = currency === "LKR" ? "LKR" : "¥";

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Breadcrumb */}
        <nav className="mb-8">
          <p className="font-body text-xs text-brand-muted">
            <span className="hover:text-brand-text cursor-pointer transition-colors"
              onClick={() => window.history.back()}>
              ← Back to products
            </span>
          </p>
        </nav>

        {/* Product Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">

          {/* LEFT: Images */}
          <div>
            {/* Main Image */}
            <div className="aspect-[3/4] overflow-hidden bg-brand-surface mb-4">
              <img
                src={`${API_URL}/${product.images?.[selectedImageIndex]}`}
                alt={`${product.name}`}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Thumbnail Strip */}
            {product.images?.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-24 overflow-hidden bg-brand-surface border-2 transition-colors ${
                      selectedImageIndex === index
                        ? "border-brand-black"
                        : "border-transparent hover:border-brand-border"
                    }`}
                  >
                    <img
                      src={`${API_URL}/${image}`}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: Product Info */}
          <div className="lg:py-4">
            {/* Title & Price */}
            <h1 className="font-heading text-3xl sm:text-4xl font-medium text-brand-black mb-4">
              {product.name}
            </h1>
            <p className="font-body text-xl text-brand-text mb-6">
              {currencySymbol} {price?.toFixed(2) || "N/A"}
            </p>

            {/* Divider */}
            <div className="h-px bg-brand-border mb-6" />

            {/* Description */}
            <p className="font-body text-sm text-brand-muted leading-relaxed mb-8">
              {product.description}
            </p>

            {/* Size Selector */}
            <div className="mb-6">
              <label className="block font-body text-xs font-semibold tracking-[0.15em] uppercase text-brand-text mb-3">
                Size
              </label>
              <div className="flex flex-wrap gap-2">
                {product.sizes?.map((size, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedSize(size)}
                    className={`min-w-[48px] h-12 px-4 border text-sm font-body font-medium transition-all duration-200 ${
                      selectedSize === size
                        ? "border-brand-black bg-brand-black text-white"
                        : "border-brand-border text-brand-text hover:border-brand-black"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
              {!selectedSize && (
                <p className="mt-2 text-xs font-body text-brand-muted">Please select a size</p>
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
                <span className="w-16 h-12 flex items-center justify-center font-body text-sm font-medium text-brand-text border-x border-brand-border">
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
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={addToCart}
              className={`w-full py-4 text-sm font-body font-semibold tracking-[0.15em] uppercase transition-all duration-300 ${
                addedToCart
                  ? "bg-green-600 text-white"
                  : "bg-brand-black text-white hover:bg-neutral-800"
              }`}
            >
              {addedToCart ? "✓ Added to Cart" : "Add to Cart"}
            </button>

            {/* Extra Info */}
            <div className="mt-8 space-y-4 border-t border-brand-border pt-8">
              {[
                { icon: "M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12", text: "Free shipping on orders over LKR 10,000" },
                { icon: "M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99", text: "Easy returns within 14 days" },
                { icon: "M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z", text: "Secure checkout with Stripe" },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-brand-muted flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
                  </svg>
                  <p className="font-body text-sm text-brand-muted">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
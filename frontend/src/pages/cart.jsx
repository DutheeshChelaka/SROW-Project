import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CurrencyContext } from "../context/CurrencyContext";
import API_URL from "../config/api";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [updatingItem, setUpdatingItem] = useState(null);
  const { currency } = useContext(CurrencyContext);
  const navigate = useNavigate();

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(storedCart);
  }, []);

  const updateQuantity = (id, size, quantity) => {
    if (quantity < 1) return;
    setUpdatingItem(`${id}-${size}`);
    
    // Simulate update delay for better UX
    setTimeout(() => {
      const updatedCart = cartItems.map((item) =>
        item.id === id && item.size === size ? { ...item, quantity } : item
      );
      setCartItems(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      setUpdatingItem(null);
    }, 300);
  };

  const removeItem = (id, size) => {
    if (window.confirm("Are you sure you want to remove this item?")) {
      const updatedCart = cartItems.filter(
        (item) => !(item.id === id && item.size === size)
      );
      setCartItems(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    }
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      const itemPrice = currency === "LKR" ? item.priceLKR ?? 0 : item.priceJPY ?? 0;
      return total + itemPrice * item.quantity;
    }, 0);
  };

  const calculateShipping = () => {
    const subtotal = calculateSubtotal();
    // Free shipping over LKR 10000 or JPY equivalent
    const freeShippingThreshold = currency === "LKR" ? 10000 : 8000;
    return subtotal > freeShippingThreshold ? 0 : (currency === "LKR" ? 500 : 400);
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.1; // 10% tax
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateShipping() + calculateTax();
  };

  const applyCoupon = () => {
    if (couponCode.toUpperCase() === "SAVE10") {
      setCouponApplied(true);
      alert("Coupon applied successfully! 10% discount will be applied at checkout.");
    } else {
      alert("Invalid coupon code");
    }
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty. Add some items before proceeding to checkout.");
      return;
    }
    navigate("/checkout");
  };

  const currencySymbol = currency === "LKR" ? "LKR" : "¥";

  // Empty Cart State
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center max-w-md mx-auto">
            {/* Animated Empty Cart Icon */}
            <div className="relative mb-8">
              <div className="w-32 h-32 mx-auto bg-gray-100 rounded-full flex items-center justify-center animate-pulse">
                <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-brand-accent rounded-full flex items-center justify-center text-white text-sm font-bold animate-bounce">
                0
              </div>
            </div>
            
            <h2 className="font-heading text-3xl font-medium text-brand-black mb-3">
              Your cart is empty
            </h2>
            <p className="font-body text-gray-500 mb-8 leading-relaxed">
              Looks like you haven't added anything to your cart yet. 
              Explore our collection and find something special!
            </p>
            
            <div className="space-y-4">
              <button 
                onClick={() => navigate("/home")} 
                className="w-full btn-primary py-4 text-base"
              >
                Start Shopping
              </button>
              
              <button 
                onClick={() => navigate("/collections")} 
                className="w-full px-6 py-4 border-2 border-gray-200 text-gray-700 rounded-full font-body text-sm font-medium hover:border-brand-black hover:bg-gray-50 transition-all duration-300"
              >
                Browse Collections
              </button>
            </div>

            {/* Popular Categories */}
            <div className="mt-12">
              <p className="text-xs font-body text-gray-400 mb-4">POPULAR CATEGORIES</p>
              <div className="flex flex-wrap justify-center gap-2">
                {["Men", "Women", "Accessories", "Sale"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => navigate(`/category/${cat.toLowerCase()}`)}
                    className="px-4 py-2 bg-gray-100 text-gray-600 rounded-full text-xs font-body hover:bg-brand-accent hover:text-white transition-colors"
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Page Header with Cart Count */}
        <div className="mb-8 sm:mb-12">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] sm:text-[11px] font-body font-semibold tracking-[0.3em] uppercase text-gray-400 mb-2">
                Your Bag
              </p>
              <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-medium text-brand-black">
                Shopping Cart
              </h1>
            </div>
            <div className="bg-brand-black text-white w-12 h-12 rounded-full flex items-center justify-center">
              <span className="font-body font-semibold text-lg">{cartItems.length}</span>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-6 h-1 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-brand-accent transition-all duration-500"
              style={{ width: `${Math.min((calculateSubtotal() / 10000) * 100, 100)}%` }}
            />
          </div>
          <p className="text-right text-xs font-body text-gray-500 mt-2">
            {calculateSubtotal() > 10000 
              ? "🎉 You qualify for free shipping!" 
              : `Add ${currencySymbol} ${(10000 - calculateSubtotal()).toFixed(2)} more for free shipping`}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* LEFT: Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {/* Column Headers */}
            <div className="hidden sm:grid grid-cols-[100px_1fr_120px_120px] gap-4 pb-4 border-b border-gray-200">
              <p className="text-[10px] font-body font-semibold tracking-[0.2em] uppercase text-gray-400">Product</p>
              <p className="text-[10px] font-body font-semibold tracking-[0.2em] uppercase text-gray-400">Details</p>
              <p className="text-[10px] font-body font-semibold tracking-[0.2em] uppercase text-gray-400 text-center">Quantity</p>
              <p className="text-[10px] font-body font-semibold tracking-[0.2em] uppercase text-gray-400 text-right">Total</p>
            </div>

            {/* Cart Items */}
            {cartItems.map((item, index) => {
              const itemPrice = currency === "LKR" ? item.priceLKR ?? 0 : item.priceJPY ?? 0;
              const isUpdating = updatingItem === `${item.id}-${item.size}`;

              return (
                <div 
                  key={index} 
                  className={`relative grid grid-cols-[100px_1fr] sm:grid-cols-[100px_1fr_120px_120px] gap-4 py-6 border-b border-gray-200 hover:bg-white/50 transition-colors group ${
                    isUpdating ? 'opacity-50' : ''
                  }`}
                >
                  {/* Loading Overlay */}
                  {isUpdating && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/50">
                      <div className="w-6 h-6 border-2 border-brand-accent border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}

                  {/* Product Image */}
                  <div className="relative overflow-hidden rounded-lg bg-gray-100 aspect-[3/4]">
                    <img
                      src={`${API_URL}/${item.images?.[0] || ""}`}
                      alt={item.name}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                    />
                    <button
                      onClick={() => removeItem(item.id, item.size)}
                      className="absolute top-2 right-2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 hover:text-white"
                      title="Remove item"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  {/* Product Details */}
                  <div className="space-y-2">
                    <h3 className="font-body text-sm font-medium text-brand-black line-clamp-2">
                      {item.name}
                    </h3>
                    <p className="font-body text-sm text-gray-500">
                      Size: <span className="font-medium text-brand-black">{item.size}</span>
                    </p>
                    <p className="font-body text-sm text-gray-500 sm:hidden">
                      {currencySymbol} {itemPrice.toFixed(2)} each
                    </p>
                    <p className="font-body text-sm font-medium text-brand-accent sm:hidden">
                      Total: {currencySymbol} {(itemPrice * item.quantity).toFixed(2)}
                    </p>
                  </div>

                  {/* Desktop Price */}
                  <p className="hidden sm:block font-body text-sm text-gray-500 text-center self-center">
                    {currencySymbol} {itemPrice.toFixed(2)}
                  </p>

                  {/* Quantity Controls */}
                  <div className="flex items-center justify-center self-center">
                    <div className="inline-flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white">
                      <button
                        onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                      >
                        −
                      </button>
                      <span className="w-12 h-10 flex items-center justify-center font-body text-sm font-medium text-brand-black border-x border-gray-200 bg-gray-50">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                        className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors text-lg"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Desktop Total */}
                  <p className="hidden sm:block font-body text-base font-semibold text-brand-black text-right self-center">
                    {currencySymbol} {(itemPrice * item.quantity).toFixed(2)}
                  </p>
                </div>
              );
            })}

            {/* Continue Shopping Link */}
            <button
              onClick={() => navigate("/home")}
              className="inline-flex items-center gap-2 mt-4 font-body text-sm text-gray-500 hover:text-brand-accent transition-colors group"
            >
              <svg className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              Continue Shopping
            </button>
          </div>

          {/* RIGHT: Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-40">
              <h2 className="font-heading text-xl font-semibold text-brand-black mb-6">
                Order Summary
              </h2>

              {/* Coupon Code */}
              <div className="mb-6">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-200 rounded-lg font-body text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent"
                  />
                  <button
                    onClick={applyCoupon}
                    disabled={!couponCode}
                    className="px-4 py-3 bg-gray-100 text-gray-600 rounded-lg font-body text-sm font-medium hover:bg-brand-accent hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Apply
                  </button>
                </div>
                {couponApplied && (
                  <p className="mt-2 text-xs text-green-600 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    10% discount applied!
                  </p>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between font-body text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="text-brand-black font-medium">
                    {currencySymbol} {calculateSubtotal().toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between font-body text-sm">
                  <span className="text-gray-500">Shipping</span>
                  <span className="text-brand-black font-medium">
                    {calculateShipping() === 0 ? (
                      <span className="text-green-600">Free</span>
                    ) : (
                      `${currencySymbol} ${calculateShipping().toFixed(2)}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between font-body text-sm">
                  <span className="text-gray-500">Estimated Tax</span>
                  <span className="text-brand-black font-medium">
                    {currencySymbol} {calculateTax().toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-6" />

              {/* Total */}
              <div className="flex justify-between mb-8">
                <span className="font-body text-base font-semibold text-brand-black">Total</span>
                <span className="font-body text-xl font-bold text-brand-accent">
                  {currencySymbol} {calculateTotal().toFixed(2)}
                </span>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                className="w-full bg-brand-black text-white py-4 rounded-lg font-body text-sm font-semibold tracking-[0.15em] uppercase hover:bg-brand-accent transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg"
              >
                Proceed to Checkout
              </button>

              {/* Trust Badges */}
              <div className="mt-6 space-y-3">
                <div className="flex items-center justify-center gap-6 text-gray-400">
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4v-6h16v6z"/>
                  </svg>
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
                  </svg>
                </div>
                <p className="text-center font-body text-xs text-gray-400">
                  Secure SSL encrypted checkout
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CurrencyContext } from "../context/CurrencyContext";
import API_URL from "../config/api";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const { currency } = useContext(CurrencyContext);
  const navigate = useNavigate();

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(storedCart);
  }, []);

  const updateQuantity = (id, size, quantity) => {
    if (quantity < 1) return;
    const updatedCart = cartItems.map((item) =>
      item.id === id && item.size === size ? { ...item, quantity } : item
    );
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const removeItem = (id, size) => {
    const updatedCart = cartItems.filter(
      (item) => !(item.id === id && item.size === size)
    );
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const itemPrice = currency === "LKR" ? item.priceLKR ?? 0 : item.priceJPY ?? 0;
      return total + itemPrice * item.quantity;
    }, 0);
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty. Add some items before proceeding to checkout.");
      return;
    }
    navigate("/checkout");
  };

  const currencySymbol = currency === "LKR" ? "LKR" : "¥";

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* Page Header */}
        <div className="mb-10">
          <p className="text-[11px] font-body font-semibold tracking-[0.3em] uppercase text-brand-muted mb-2">
            Your Bag
          </p>
          <h1 className="font-heading text-3xl sm:text-4xl font-medium text-brand-black">
            Shopping Cart
          </h1>
        </div>

        {cartItems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-16">

            {/* LEFT: Cart Items */}
            <div className="lg:col-span-2">
              {/* Column Headers (desktop) */}
              <div className="hidden sm:grid grid-cols-[1fr_auto_auto] gap-8 pb-4 border-b border-brand-border mb-0">
                <p className="text-[10px] font-body font-semibold tracking-[0.2em] uppercase text-brand-muted">Product</p>
                <p className="text-[10px] font-body font-semibold tracking-[0.2em] uppercase text-brand-muted w-32 text-center">Quantity</p>
                <p className="text-[10px] font-body font-semibold tracking-[0.2em] uppercase text-brand-muted w-24 text-right">Total</p>
              </div>

              {/* Items */}
              {cartItems.map((item, index) => {
                const itemPrice = currency === "LKR" ? item.priceLKR ?? 0 : item.priceJPY ?? 0;

                return (
                  <div key={index} className="grid grid-cols-[80px_1fr] sm:grid-cols-[80px_1fr_auto_auto] gap-4 sm:gap-8 py-6 border-b border-brand-border items-center">

                    {/* Image */}
                    <div className="w-20 h-24 bg-brand-surface overflow-hidden flex-shrink-0">
                      <img
                        src={`${API_URL}/${item.images?.[0] || ""}`}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="min-w-0">
                      <h3 className="font-body text-sm font-medium text-brand-text mb-1 truncate">
                        {item.name}
                      </h3>
                      <p className="font-body text-sm text-brand-muted mb-1">
                        Size: {item.size}
                      </p>
                      <p className="font-body text-sm text-brand-muted mb-3 sm:mb-0">
                        {currencySymbol} {itemPrice.toFixed(2)}
                      </p>

                      {/* Mobile: Quantity + Remove */}
                      <div className="flex items-center gap-4 sm:hidden">
                        <div className="inline-flex items-center border border-brand-border">
                          <button
                            onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                            className="w-9 h-9 flex items-center justify-center text-brand-text hover:bg-brand-surface transition-colors text-sm"
                          >
                            −
                          </button>
                          <span className="w-10 h-9 flex items-center justify-center font-body text-xs font-medium text-brand-text border-x border-brand-border">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                            className="w-9 h-9 flex items-center justify-center text-brand-text hover:bg-brand-surface transition-colors text-sm"
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(item.id, item.size)}
                          className="font-body text-xs text-brand-muted underline hover:text-brand-text transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    </div>

                    {/* Desktop: Quantity */}
                    <div className="hidden sm:flex items-center w-32 justify-center">
                      <div className="inline-flex items-center border border-brand-border">
                        <button
                          onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                          className="w-9 h-9 flex items-center justify-center text-brand-text hover:bg-brand-surface transition-colors text-sm"
                        >
                          −
                        </button>
                        <span className="w-10 h-9 flex items-center justify-center font-body text-xs font-medium text-brand-text border-x border-brand-border">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                          className="w-9 h-9 flex items-center justify-center text-brand-text hover:bg-brand-surface transition-colors text-sm"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Desktop: Total + Remove */}
                    <div className="hidden sm:flex flex-col items-end w-24">
                      <p className="font-body text-sm font-medium text-brand-text mb-2">
                        {currencySymbol} {(itemPrice * item.quantity).toFixed(2)}
                      </p>
                      <button
                        onClick={() => removeItem(item.id, item.size)}
                        className="font-body text-xs text-brand-muted underline hover:text-brand-text transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })}

              {/* Continue Shopping */}
              <button
                onClick={() => navigate("/home")}
                className="mt-6 font-body text-sm text-brand-muted hover:text-brand-text transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
                Continue Shopping
              </button>
            </div>

            {/* RIGHT: Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-brand-surface p-8 sticky top-40">
                <h2 className="font-heading text-xl font-semibold text-brand-text mb-6">
                  Order Summary
                </h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between font-body text-sm">
                    <span className="text-brand-muted">Subtotal ({cartItems.length} item{cartItems.length > 1 ? "s" : ""})</span>
                    <span className="text-brand-text">{currencySymbol} {calculateTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-body text-sm">
                    <span className="text-brand-muted">Shipping</span>
                    <span className="text-brand-text">Calculated at checkout</span>
                  </div>
                </div>

                <div className="h-px bg-brand-border mb-6" />

                <div className="flex justify-between mb-8">
                  <span className="font-body text-base font-semibold text-brand-text">Total</span>
                  <span className="font-body text-base font-semibold text-brand-text">
                    {currencySymbol} {calculateTotal().toFixed(2)}
                  </span>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full btn-primary text-center"
                >
                  Proceed to Checkout
                </button>

                {/* Trust Badges */}
                <div className="mt-6 flex items-center justify-center gap-2 text-brand-muted">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                  <p className="font-body text-xs">Secure checkout</p>
                </div>
              </div>
            </div>
          </div>

        ) : (
          /* Empty Cart State */
          <div className="text-center py-24">
            <svg className="w-20 h-20 text-brand-border mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
            <h2 className="font-heading text-2xl font-medium text-brand-text mb-3">Your cart is empty</h2>
            <p className="font-body text-sm text-brand-muted mb-8">Looks like you haven't added anything yet.</p>
            <button onClick={() => navigate("/home")} className="btn-primary">
              Start Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
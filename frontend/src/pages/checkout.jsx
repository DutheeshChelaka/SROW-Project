import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useAuth } from "../context/AuthContext";
import { CurrencyContext } from "../context/CurrencyContext";
import axios from "axios";
import API_URL from "../config/api";

const stripePromise = loadStripe(
  "pk_test_51Q3m8rJZW6okBw3PP5TFLjkcEbnUWebpDhdhiTU5kbfSIdqzvApmztcsNfDgPJ34aWHGzqczsmZTkRkPLDjzg0cn00PAegmYD1"
);

/* ===== CONFIRMATION MODAL ===== */
const OrderConfirmationModal = ({ isOpen, onConfirm, onCancel, orderDetails }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
        onClick={onCancel} 
      />

      {/* Modal */}
      <div className="relative bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl animate-slide-up">
        <div className="p-8">
          {/* Header with Icon */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="font-heading text-2xl font-semibold text-brand-black">
              Confirm Your Order
            </h2>
            <p className="font-body text-sm text-gray-500 mt-2">
              Please review your order details before confirming
            </p>
          </div>

          {/* Delivery Details */}
          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <p className="text-[10px] font-body font-semibold tracking-[0.2em] uppercase text-gray-400 mb-4">
              DELIVERY DETAILS
            </p>
            <div className="space-y-3 font-body text-sm">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <div>
                  <p className="text-gray-500">Name</p>
                  <p className="text-brand-black font-medium">{orderDetails.name}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div>
                  <p className="text-gray-500">Address</p>
                  <p className="text-brand-black font-medium">{orderDetails.address}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.054-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                </svg>
                <div>
                  <p className="text-gray-500">Contact</p>
                  <p className="text-brand-black font-medium">{orderDetails.contact}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="mb-6">
            <p className="text-[10px] font-body font-semibold tracking-[0.2em] uppercase text-gray-400 mb-4">
              ORDER ITEMS ({orderDetails.items.length})
            </p>
            <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
              {orderDetails.items.map((item, index) => (
                <div key={index} className="flex items-center gap-3 group">
                  <div className="w-16 h-20 bg-gray-100 overflow-hidden flex-shrink-0 rounded-lg">
                    <img
                      src={`${API_URL}/${item.images?.[0] || ""}`}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-body text-sm font-medium text-brand-black truncate">{item.name}</p>
                    <p className="font-body text-xs text-gray-500">
                      Size: {item.size} · Qty: {item.quantity}
                    </p>
                  </div>
                  <p className="font-body text-sm font-semibold text-brand-accent">
                    {orderDetails.currency}{" "}
                    {((orderDetails.currency === "LKR" ? item.priceLKR : item.priceJPY) * item.quantity).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="bg-brand-black text-white rounded-xl p-6 mb-8">
            <div className="flex justify-between items-center">
              <span className="font-body text-sm uppercase tracking-wider">Total Amount</span>
              <span className="font-heading text-2xl font-bold">
                {orderDetails.currency} {orderDetails.totalPrice.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onCancel}
              className="flex-1 px-6 py-4 border-2 border-gray-200 text-gray-700 rounded-xl font-body text-sm font-medium hover:border-gray-400 hover:bg-gray-50 transition-all duration-300"
            >
              Go Back
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-6 py-4 bg-brand-accent text-white rounded-xl font-body text-sm font-semibold hover:bg-brand-accent/90 transition-all duration-300 transform hover:scale-105"
            >
              Confirm Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ===== CHECKOUT FORM ===== */
const CheckoutForm = ({ totalPrice, formData, cartItems, currency, user }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const validateForm = () => {
    const errors = {};
    if (!formData.name?.trim()) errors.name = "Name is required";
    if (!formData.address?.trim()) errors.address = "Address is required";
    if (!formData.contact?.trim()) errors.contact = "Contact number is required";
    else if (!/^[\d\s\+\-\(\)]{10,}$/.test(formData.contact)) {
      errors.contact = "Please enter a valid phone number";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) {
      setError("Please fill in all required fields correctly");
      return;
    }
    setError("");
    setShowConfirmation(true);
  };

  const handleConfirmOrder = async () => {
    setLoading(true);
    try {
      if (formData.paymentMethod === "Card") {
        await processCardPayment();
      } else {
        await processCashOnDelivery();
      }
    } catch (error) {
      console.error("Error processing order:", error);
      setError(error.message || "Failed to process order. Please try again.");
    } finally {
      setLoading(false);
      setShowConfirmation(false);
    }
  };

  const processCardPayment = async () => {
    if (!stripe || !elements) throw new Error("Stripe has not been initialized");

    const amountToCharge = currency === "LKR"
      ? Math.round(totalPrice * 100)
      : Math.round(totalPrice);

    const minAmount = currency === "LKR" ? 50 * 100 : 50;
    if (amountToCharge < minAmount) {
      throw new Error(`Amount too small. Minimum charge is ${currency} ${minAmount / (currency === "LKR" ? 100 : 1)}`);
    }

    setLoading(true);
    try {
      const { data } = await axios.post(`${API_URL}/api/stripe/create-payment-intent`, {
        amount: amountToCharge,
        currency: currency.toLowerCase(),
      });

      if (!data.clientSecret) throw new Error("Failed to get client secret from Stripe.");

      const cardElement = elements.getElement(CardElement);
      const { error, paymentIntent } = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: formData.name,
            email: user?.email || "guest@example.com",
            phone: formData.contact,
            address: {
              line1: formData.address,
              postal_code: formData.postalCode?.trim() || "10000",
              country: currency === "JPY" ? "JP" : "LK",
            },
          },
        },
      });

      if (error) throw new Error(error.message);
      if (paymentIntent.status === "succeeded") await saveOrder("card");
    } finally {
      setLoading(false);
    }
  };

  const processCashOnDelivery = async () => {
    await saveOrder("cash-on-delivery");
  };

  const saveOrder = async (paymentMethod) => {
    const userId = user?._id || localStorage.getItem("userId");
    if (!userId) {
      navigate("/login", { state: { from: "/checkout" } });
      throw new Error("Please log in to complete your order");
    }

    const order = {
      user: userId,
      items: cartItems.map((item) => ({
        productId: item.id || item.productId,
        name: item.name,
        size: item.size,
        quantity: item.quantity,
        priceLKR: item.priceLKR ?? 0,
        priceJPY: item.priceJPY ?? 0,
        image: item.images?.[0] || "",
      })),
      totalLKR: currency === "LKR" ? totalPrice : 0,
      totalJPY: currency === "JPY" ? totalPrice : 0,
      selectedCurrency: currency,
      userDetails: {
        name: formData.name,
        email: user?.email || "guest@example.com",
        phone: formData.contact,
        address: formData.address,
      },
      paymentMethod,
      orderDate: new Date().toISOString(),
    };

    await axios.post(`${API_URL}/api/orders`, order, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });

    localStorage.removeItem("cart");
    
    // Show success message before redirecting
    setTimeout(() => {
      navigate("/orderHistory", { 
        state: { orderSuccess: true, orderTotal: totalPrice } 
      });
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 font-body text-sm flex items-center gap-3">
          <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </div>
      )}

      {/* Card Payment Section */}
      {formData.paymentMethod === "Card" && (
        <div className="bg-gray-50 rounded-xl p-6">
          <label className="block font-body text-xs font-semibold tracking-[0.15em] uppercase text-gray-500 mb-4">
            Card Details
          </label>
          <div className="bg-white border border-gray-200 rounded-xl p-4 focus-within:ring-2 focus-within:ring-brand-accent focus-within:border-transparent transition-all">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: "15px",
                    fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
                    color: "#1A1A1A",
                    "::placeholder": { color: "#9CA3AF" },
                  },
                  invalid: { color: "#DC2626" },
                },
              }}
            />
          </div>
          <p className="mt-2 text-xs text-gray-500 flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Your payment information is encrypted and secure
          </p>
        </div>
      )}

      {/* Place Order Button */}
      <button
        onClick={handlePlaceOrder}
        disabled={loading || (formData.paymentMethod === "Card" && !stripe)}
        className={`w-full py-5 text-sm font-body font-semibold tracking-[0.15em] uppercase rounded-xl transition-all duration-300 ${
          loading
            ? "bg-gray-400 text-white cursor-not-allowed"
            : "bg-gradient-to-r from-brand-black to-gray-800 text-white hover:shadow-lg hover:-translate-y-0.5"
        }`}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-3">
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Processing...
          </span>
        ) : (
          "Place Order"
        )}
      </button>

      {/* Order Confirmation Modal */}
      <OrderConfirmationModal
        isOpen={showConfirmation}
        onConfirm={handleConfirmOrder}
        onCancel={() => setShowConfirmation(false)}
        orderDetails={{ ...formData, items: cartItems, currency, totalPrice }}
      />
    </div>
  );
};

/* ===== MAIN CHECKOUT PAGE ===== */
const Checkout = () => {
  const { user } = useAuth();
  const { currency } = useContext(CurrencyContext);
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    address: "",
    contact: "",
    paymentMethod: "COD",
  });

  const currencySymbol = currency === "LKR" ? "LKR" : "¥";

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (cart.length === 0) {
      navigate("/home");
      return;
    }
    
    const total = cart.reduce((acc, item) => {
      const itemPrice = currency === "LKR" ? item.priceLKR ?? 0 : item.priceJPY ?? 0;
      return acc + itemPrice * item.quantity;
    }, 0);
    
    setCartItems(cart);
    setTotalPrice(total);
  }, [currency, navigate]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Show loading or redirect if cart is empty
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand-border border-t-brand-black rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise}>
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">

          {/* Page Header with Progress */}
          <div className="mb-8 sm:mb-12">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-[10px] sm:text-[11px] font-body font-semibold tracking-[0.3em] uppercase text-gray-400 mb-2">
                  Secure Checkout
                </p>
                <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-medium text-brand-black">
                  Complete Your Order
                </h1>
              </div>
              <div className="hidden sm:block">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-brand-accent text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                  <div className="w-16 h-0.5 bg-gray-200"></div>
                  <div className="w-8 h-8 bg-brand-black text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                </div>
              </div>
            </div>
            
            {/* Security Badge */}
            <div className="flex items-center gap-2 text-sm text-gray-500 bg-white/50 px-4 py-2 rounded-full inline-flex">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-5m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span className="font-body text-xs">SSL Secure Checkout</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">

            {/* LEFT: Form */}
            <div className="lg:col-span-2 space-y-8">

              {/* Customer Details Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
                <h2 className="font-heading text-xl font-semibold text-brand-black mb-6 flex items-center gap-2">
                  <span className="w-8 h-8 bg-brand-accent text-white rounded-full flex items-center justify-center text-sm">1</span>
                  Delivery Information
                </h2>
                
                <div className="space-y-5">
                  <div>
                    <label className="block font-body text-xs font-semibold tracking-[0.15em] uppercase text-gray-500 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full border border-gray-200 px-4 py-3.5 rounded-xl font-body text-sm text-brand-black
                               placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent
                               transition-all"
                    />
                  </div>
                  
                  <div>
                    <label className="block font-body text-xs font-semibold tracking-[0.15em] uppercase text-gray-500 mb-2">
                      Delivery Address
                    </label>
                    <textarea
                      name="address"
                      placeholder="Enter your complete delivery address"
                      value={formData.address}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full border border-gray-200 px-4 py-3.5 rounded-xl font-body text-sm text-brand-black
                               placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent
                               transition-all resize-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block font-body text-xs font-semibold tracking-[0.15em] uppercase text-gray-500 mb-2">
                      Contact Number
                    </label>
                    <input
                      type="tel"
                      name="contact"
                      placeholder="Enter your phone number"
                      value={formData.contact}
                      onChange={handleInputChange}
                      className="w-full border border-gray-200 px-4 py-3.5 rounded-xl font-body text-sm text-brand-black
                               placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent
                               transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
                <h2 className="font-heading text-xl font-semibold text-brand-black mb-6 flex items-center gap-2">
                  <span className="w-8 h-8 bg-brand-accent text-white rounded-full flex items-center justify-center text-sm">2</span>
                  Payment Method
                </h2>
                
                <div className="space-y-3">
                  {[
                    { 
                      value: "COD", 
                      label: "Cash on Delivery", 
                      desc: "Pay when you receive your order",
                      icon: "M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" 
                    },
                    { 
                      value: "Card", 
                      label: "Credit / Debit Card", 
                      desc: "Pay securely with your card",
                      icon: "M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" 
                    },
                  ].map((method) => (
                    <label
                      key={method.value}
                      className={`relative flex items-start gap-4 p-5 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                        formData.paymentMethod === method.value
                          ? "border-brand-accent bg-brand-accent/5"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.value}
                        checked={formData.paymentMethod === method.value}
                        onChange={handleInputChange}
                        className="sr-only"
                      />
                      <div className={`w-5 h-5 mt-0.5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        formData.paymentMethod === method.value
                          ? "border-brand-accent"
                          : "border-gray-300"
                      }`}>
                        {formData.paymentMethod === method.value && (
                          <div className="w-2.5 h-2.5 rounded-full bg-brand-accent" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={method.icon} />
                          </svg>
                          <span className="font-body text-sm font-semibold text-brand-black">{method.label}</span>
                        </div>
                        <p className="font-body text-xs text-gray-500 ml-7">{method.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Checkout Form */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
                <CheckoutForm
                  totalPrice={totalPrice}
                  formData={formData}
                  cartItems={cartItems}
                  currency={currency}
                  user={user}
                />
              </div>
            </div>

            {/* RIGHT: Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-40">
                <h2 className="font-heading text-xl font-semibold text-brand-black mb-6 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Order Summary
                </h2>

                {/* Cart Items */}
                <div className="space-y-4 max-h-96 overflow-y-auto pr-2 mb-6">
                  {cartItems.map((item, index) => (
                    <div key={index} className="flex items-center gap-3 group">
                      <div className="w-16 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={`${API_URL}/${item.images?.[0] || ""}`}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-body text-sm font-medium text-brand-black truncate">{item.name}</p>
                        <p className="font-body text-xs text-gray-500">
                          {item.size} · Qty {item.quantity}
                        </p>
                      </div>
                      <p className="font-body text-sm font-semibold text-brand-accent">
                        {currencySymbol}{" "}
                        {((currency === "LKR" ? item.priceLKR : item.priceJPY) * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-4" />

                {/* Price Breakdown */}
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between font-body text-sm">
                    <span className="text-gray-500">Subtotal</span>
                    <span className="text-brand-black font-medium">
                      {currencySymbol} {totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between font-body text-sm">
                    <span className="text-gray-500">Shipping</span>
                    <span className="text-green-600 font-medium">Free</span>
                  </div>
                  <div className="flex justify-between font-body text-sm">
                    <span className="text-gray-500">Estimated Tax</span>
                    <span className="text-brand-black font-medium">
                      {currencySymbol} {(totalPrice * 0.1).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-4" />

                {/* Total */}
                <div className="flex justify-between items-center mb-6">
                  <span className="font-body text-base font-semibold text-brand-black">Total</span>
                  <span className="font-heading text-xl font-bold text-brand-accent">
                    {currencySymbol} {(totalPrice * 1.1).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>

                {/* Trust Badges */}
                <div className="pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-center gap-4 text-gray-400">
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
                  <p className="text-center font-body text-xs text-gray-400 mt-3">
                    Secure SSL encrypted checkout
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Elements>
  );
};

export default Checkout;
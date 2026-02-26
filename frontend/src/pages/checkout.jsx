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
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onCancel} />

      {/* Modal */}
      <div className="relative bg-white w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          <h2 className="font-heading text-2xl font-semibold text-brand-text mb-6">
            Confirm Your Order
          </h2>

          {/* Delivery Details */}
          <div className="mb-6">
            <p className="text-[10px] font-body font-semibold tracking-[0.2em] uppercase text-brand-muted mb-3">
              Delivery Details
            </p>
            <div className="space-y-2 font-body text-sm">
              <div className="flex justify-between">
                <span className="text-brand-muted">Name</span>
                <span className="text-brand-text font-medium">{orderDetails.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-brand-muted">Address</span>
                <span className="text-brand-text font-medium text-right max-w-[200px]">{orderDetails.address}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-brand-muted">Contact</span>
                <span className="text-brand-text font-medium">{orderDetails.contact}</span>
              </div>
            </div>
          </div>

          <div className="h-px bg-brand-border mb-6" />

          {/* Order Items */}
          <div className="mb-6">
            <p className="text-[10px] font-body font-semibold tracking-[0.2em] uppercase text-brand-muted mb-3">
              Items
            </p>
            <div className="space-y-3">
              {orderDetails.items.map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-12 h-14 bg-brand-surface overflow-hidden flex-shrink-0">
                    <img
                      src={`${API_URL}/${item.images?.[0] || ""}`}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-body text-sm font-medium text-brand-text truncate">{item.name}</p>
                    <p className="font-body text-xs text-brand-muted">
                      Size: {item.size} · Qty: {item.quantity}
                    </p>
                  </div>
                  <p className="font-body text-sm text-brand-text flex-shrink-0">
                    {orderDetails.currency}{" "}
                    {(orderDetails.currency === "LKR" ? item.priceLKR : item.priceJPY) * item.quantity}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="h-px bg-brand-border mb-6" />

          {/* Total */}
          <div className="flex justify-between mb-8">
            <span className="font-body text-base font-semibold text-brand-text">Total</span>
            <span className="font-body text-base font-semibold text-brand-text">
              {orderDetails.currency} {orderDetails.totalPrice}
            </span>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 btn-outline text-center"
            >
              Go Back
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 btn-primary text-center"
            >
              Confirm Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ===== CHECKOUT FORM (Stripe + Place Order) ===== */
const CheckoutForm = ({ totalPrice, formData, cartItems, currency, user }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handlePlaceOrder = async () => {
    if (!formData.name || !formData.address || !formData.contact) {
      setError("Please fill in all required fields");
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
  };

  const processCashOnDelivery = async () => {
    await saveOrder("cash-on-delivery");
  };

  const saveOrder = async (paymentMethod) => {
    const userId = user?._id || localStorage.getItem("userId");
    if (!userId) {
      navigate("/login");
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
    };

    await axios.post(`${API_URL}/api/orders`, order, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });

    localStorage.removeItem("cart");
    navigate("/orderHistory");
  };

  return (
    <div>
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 font-body text-sm">
          {error}
        </div>
      )}

      {formData.paymentMethod === "Card" && (
        <div className="mb-6">
          <label className="block font-body text-xs font-semibold tracking-[0.15em] uppercase text-brand-text mb-3">
            Card Details
          </label>
          <div className="border border-brand-border p-4 bg-white">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: "15px",
                    fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
                    color: "#1A1A1A",
                    "::placeholder": { color: "#737373" },
                  },
                  invalid: { color: "#DC2626" },
                },
              }}
            />
          </div>
        </div>
      )}

      <button
        onClick={handlePlaceOrder}
        disabled={loading || (formData.paymentMethod === "Card" && !stripe)}
        className={`w-full py-4 text-sm font-body font-semibold tracking-[0.15em] uppercase transition-all duration-300 ${
          loading
            ? "bg-neutral-400 text-white cursor-not-allowed"
            : "bg-brand-black text-white hover:bg-neutral-800"
        }`}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Processing...
          </span>
        ) : (
          "Place Order"
        )}
      </button>

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
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    contact: "",
    paymentMethod: "COD",
  });

  const currencySymbol = currency === "LKR" ? "LKR" : "¥";

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const total = cart.reduce((acc, item) => {
      const itemPrice = currency === "LKR" ? item.priceLKR ?? 0 : item.priceJPY ?? 0;
      return acc + itemPrice * item.quantity;
    }, 0);
    setCartItems(cart);
    setTotalPrice(total);
  }, [currency]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Elements stripe={stripePromise}>
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-6 py-10">

          {/* Page Header */}
          <div className="mb-10">
            <p className="text-[11px] font-body font-semibold tracking-[0.3em] uppercase text-brand-muted mb-2">
              Secure Checkout
            </p>
            <h1 className="font-heading text-3xl sm:text-4xl font-medium text-brand-black">
              Checkout
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-16">

            {/* LEFT: Form */}
            <div className="lg:col-span-2 space-y-8">

              {/* Customer Details */}
              <div>
                <h2 className="font-heading text-xl font-semibold text-brand-text mb-5">
                  Delivery Information
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block font-body text-xs font-semibold tracking-[0.15em] uppercase text-brand-text mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full border border-brand-border px-4 py-3 font-body text-sm text-brand-text
                                 placeholder-brand-muted focus:outline-none focus:border-brand-black transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block font-body text-xs font-semibold tracking-[0.15em] uppercase text-brand-text mb-2">
                      Address
                    </label>
                    <textarea
                      name="address"
                      placeholder="Enter your delivery address"
                      value={formData.address}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full border border-brand-border px-4 py-3 font-body text-sm text-brand-text
                                 placeholder-brand-muted focus:outline-none focus:border-brand-black transition-colors resize-none"
                    />
                  </div>
                  <div>
                    <label className="block font-body text-xs font-semibold tracking-[0.15em] uppercase text-brand-text mb-2">
                      Contact Number
                    </label>
                    <input
                      type="text"
                      name="contact"
                      placeholder="Enter your phone number"
                      value={formData.contact}
                      onChange={handleInputChange}
                      className="w-full border border-brand-border px-4 py-3 font-body text-sm text-brand-text
                                 placeholder-brand-muted focus:outline-none focus:border-brand-black transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div className="h-px bg-brand-border" />

              {/* Payment Method */}
              <div>
                <h2 className="font-heading text-xl font-semibold text-brand-text mb-5">
                  Payment Method
                </h2>
                <div className="space-y-3">
                  {[
                    { value: "COD", label: "Cash on Delivery", icon: "M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" },
                    { value: "Card", label: "Credit / Debit Card", icon: "M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" },
                  ].map((method) => (
                    <label
                      key={method.value}
                      className={`flex items-center gap-4 p-4 border cursor-pointer transition-all duration-200 ${
                        formData.paymentMethod === method.value
                          ? "border-brand-black bg-brand-surface"
                          : "border-brand-border hover:border-neutral-400"
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
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        formData.paymentMethod === method.value
                          ? "border-brand-black"
                          : "border-brand-border"
                      }`}>
                        {formData.paymentMethod === method.value && (
                          <div className="w-2.5 h-2.5 rounded-full bg-brand-black" />
                        )}
                      </div>
                      <svg className="w-5 h-5 text-brand-muted flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={method.icon} />
                      </svg>
                      <span className="font-body text-sm font-medium text-brand-text">{method.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="h-px bg-brand-border" />

              {/* Stripe / Place Order */}
              <CheckoutForm
                totalPrice={totalPrice}
                formData={formData}
                cartItems={cartItems}
                currency={currency}
                user={user}
              />
            </div>

            {/* RIGHT: Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-brand-surface p-8 sticky top-40">
                <h2 className="font-heading text-xl font-semibold text-brand-text mb-6">
                  Order Summary
                </h2>

                {/* Cart Items */}
                <div className="space-y-4 mb-6">
                  {cartItems.map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-14 h-16 bg-white overflow-hidden flex-shrink-0">
                        <img
                          src={`${API_URL}/${item.images?.[0] || ""}`}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-body text-sm font-medium text-brand-text truncate">{item.name}</p>
                        <p className="font-body text-xs text-brand-muted">
                          {item.size} · Qty {item.quantity}
                        </p>
                      </div>
                      <p className="font-body text-sm text-brand-text flex-shrink-0">
                        {currencySymbol}{" "}
                        {((currency === "LKR" ? item.priceLKR : item.priceJPY) * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="h-px bg-brand-border mb-4" />

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between font-body text-sm">
                    <span className="text-brand-muted">Subtotal</span>
                    <span className="text-brand-text">{currencySymbol} {totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-body text-sm">
                    <span className="text-brand-muted">Shipping</span>
                    <span className="text-brand-text">Free</span>
                  </div>
                </div>

                <div className="h-px bg-brand-border mb-4" />

                <div className="flex justify-between">
                  <span className="font-body text-base font-semibold text-brand-text">Total</span>
                  <span className="font-body text-base font-semibold text-brand-text">
                    {currencySymbol} {totalPrice.toFixed(2)}
                  </span>
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
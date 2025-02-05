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
import "../styles_pages/checkout.css";

const stripePromise = loadStripe(
  "pk_test_51QoqFgDIa8vzXOS4lk85Y8OR0nGVVc1WuRrxKULfijDxgfzxIYelETFlxWKeOKcLFhb9ZG2bJ4zbUdbFcHlFRlbV00hFBe9JQ6"
);

const OrderConfirmationModal = ({
  isOpen,
  onConfirm,
  onCancel,
  orderDetails,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Confirm Your Order</h2>

        <div className="confirmation-section">
          <h3>Delivery Details</h3>
          <div className="detail-row">
            <span className="detail-label">Name:</span>
            <span className="detail-value">{orderDetails.name}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Address:</span>
            <span className="detail-value">{orderDetails.address}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Contact:</span>
            <span className="detail-value">{orderDetails.contact}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Payment Method:</span>
            <span className="detail-value">{orderDetails.paymentMethod}</span>
          </div>
        </div>

        <div className="confirmation-section">
          <h3>Order Summary</h3>
          <div className="order-items">
            {orderDetails.items.map((item, index) => (
              <div key={index} className="order-item">
                <img
                  src={`http://localhost:5000/${item.images?.[0] || ""}`}
                  alt={item.name}
                  className="item-thumbnail"
                />

                <div className="item-details">
                  <p className="item-name">{item.name}</p>
                  <p className="item-size">Size: {item.size}</p>
                  <p className="item-quantity">Quantity: {item.quantity}</p>
                  <p className="item-price">
                    {orderDetails.currency}{" "}
                    {orderDetails.currency === "LKR"
                      ? item.priceLKR
                      : item.priceJPY}{" "}
                    × {item.quantity}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="order-total">
            <h4>Total Amount</h4>
            <p className="total-amount">
              {orderDetails.currency} {orderDetails.totalPrice}
            </p>
          </div>
        </div>

        <div className="modal-actions">
          <button className="confirm-button" onClick={onConfirm}>
            Confirm Order
          </button>
          <button className="cancel-button" onClick={onCancel}>
            Review Changes
          </button>
        </div>
      </div>
    </div>
  );
};

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
    if (!stripe || !elements) {
      throw new Error("Stripe has not been initialized");
    }

    const amountToCharge =
      currency === "LKR"
        ? Math.round(totalPrice * 100)
        : Math.round(totalPrice);

    const minAmount = currency === "LKR" ? 50 * 100 : 50;

    if (amountToCharge < minAmount) {
      throw new Error(
        `Amount too small. Minimum charge is ${currency} ${
          minAmount / (currency === "LKR" ? 100 : 1)
        }`
      );
    }

    const { data } = await axios.post(
      "http://localhost:5000/api/stripe/create-payment-intent",
      {
        amount: amountToCharge,
        currency: currency.toLowerCase(),
      }
    );

    const cardElement = elements.getElement(CardElement);
    const { error, paymentIntent } = await stripe.confirmCardPayment(
      data.clientSecret,
      {
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
      }
    );

    if (error) {
      throw new Error(error.message);
    }

    if (paymentIntent.status === "succeeded") {
      await saveOrder("card");
    }
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

    const response = await axios.post(
      "http://localhost:5000/api/orders",
      order,
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    );

    localStorage.removeItem("cart");
    navigate("/orderHistory");
  };

  return (
    <div className="checkout-form-container">
      {error && <div className="error-message">{error}</div>}

      {formData.paymentMethod === "Card" && (
        <div className="card-details-section">
          <h3>Card Details</h3>
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#424770",
                  "::placeholder": {
                    color: "#aab7c4",
                  },
                },
                invalid: {
                  color: "#9e2146",
                },
              },
            }}
          />
        </div>
      )}

      <button
        className="place-order-button"
        onClick={handlePlaceOrder}
        disabled={loading || (formData.paymentMethod === "Card" && !stripe)}
      >
        {loading ? "Processing..." : "Place Order"}
      </button>

      <OrderConfirmationModal
        isOpen={showConfirmation}
        onConfirm={handleConfirmOrder}
        onCancel={() => setShowConfirmation(false)}
        orderDetails={{
          ...formData,
          items: cartItems,
          currency,
          totalPrice,
        }}
      />
    </div>
  );
};

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

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    const total = cart.reduce((acc, item) => {
      const itemPrice =
        currency === "LKR" ? item.priceLKR ?? 0 : item.priceJPY ?? 0;

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
      <div className="checkout-container">
        <h1>Checkout</h1>

        {/* ✅ Cart Summary Section */}
        <div className="cart-summary">
          <h2>🛒 Review Your Cart</h2>
          <ul className="cart-items">
            {cartItems.length === 0 ? (
              <p>No items in cart.</p>
            ) : (
              cartItems.map((item, index) => (
                <li key={index} className="cart-item">
                  <img
                    src={`http://localhost:5000/${item.images?.[0] || ""}`}
                    alt={item.name}
                    className="cart-item-image"
                  />
                  <div className="cart-item-details">
                    <p>
                      <strong>{item.name}</strong> ({item.size})
                    </p>
                    <p>Quantity: {item.quantity}</p>
                    <p>
                      Price: {currency}{" "}
                      {currency === "LKR" ? item.priceLKR : item.priceJPY}
                    </p>
                  </div>
                </li>
              ))
            )}
          </ul>
          <h3>
            Total: {totalPrice} {currency}
          </h3>
        </div>

        {/* ✅ Customer Details & Payment Section */}
        <div className="checkout-form">
          <h2>Customer Details</h2>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleInputChange}
          />
          <textarea
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleInputChange}
          ></textarea>
          <input
            type="text"
            name="contact"
            placeholder="Contact Number"
            value={formData.contact}
            onChange={handleInputChange}
          />
          <h2>Payment Method</h2>
          <select
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleInputChange}
          >
            <option value="COD">Cash on Delivery</option>
            <option value="Card">Card Payment</option>
          </select>
        </div>

        {/* ✅ Checkout Form Component */}
        <CheckoutForm
          totalPrice={totalPrice}
          formData={formData}
          cartItems={cartItems}
          currency={currency}
          user={user}
        />
      </div>
    </Elements>
  );
};

export default Checkout;

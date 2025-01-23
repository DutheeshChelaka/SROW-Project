import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import axios from "axios";
import "../styles_pages/checkout.css";

const stripePromise = loadStripe("your-publishable-key");

const CheckoutForm = ({ totalPrice, formData, cartItems }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePlaceOrder = async () => {
    if (!formData.name || !formData.address || !formData.contact) {
      setError("All fields are required.");
      return;
    }

    if (formData.paymentMethod === "Card") {
      if (!stripe || !elements) {
        return;
      }
      setLoading(true);

      try {
        const { data } = await axios.post(
          "http://localhost:5000/api/stripe/create-payment-intent",
          {
            amount: totalPrice * 100, // Convert to cents
            currency: "LKR",
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
                email: "test@example.com", // Replace with actual customer email
                phone: formData.contact,
              },
            },
          }
        );

        if (error) {
          console.error("Error confirming card payment:", error);
          setError("Payment failed. Please try again.");
          setLoading(false);
          return;
        }

        if (paymentIntent.status === "succeeded") {
          await placeOrder("card");
        }
      } catch (error) {
        console.error("Error processing payment:", error);
        setError("Error processing payment. Please try again.");
      } finally {
        setLoading(false);
      }
    } else {
      await placeOrder("cash-on-delivery");
    }
  };

  const placeOrder = async (paymentMethod) => {
    const order = {
      items: cartItems.map((item) => ({
        productId: item.id,
        name: item.name,
        size: item.size,
        quantity: item.quantity,
        price: item.price,
      })),
      total: totalPrice,
      userDetails: {
        name: formData.name,
        email: "test@example.com", // Replace with actual customer email
        phone: formData.contact,
        address: formData.address,
      },
      paymentMethod,
    };

    try {
      const response = await axios.post(
        "http://localhost:5000/api/orders",
        order,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      console.log("Order placed:", response.data);
      localStorage.removeItem("cart");
      navigate("/orderHistory");
    } catch (error) {
      console.error("Error placing order:", error);
      setError("Error placing order. Please try again.");
    }
  };

  return (
    <div>
      {error && <p className="error-text">{error}</p>}
      {formData.paymentMethod === "Card" && (
        <div className="card-details-container">
          <h3>Card Details</h3>
          <CardElement
            options={{
              style: {
                base: {
                  iconColor: "#c4f0ff",
                  color: "#000",
                  fontWeight: "400",
                  fontSize: "16px",
                  fontFamily: "Arial, sans-serif",
                  "::placeholder": { color: "#aab7c4" },
                },
                invalid: { color: "#fa755a" },
              },
            }}
          />
        </div>
      )}
      <button
        className="place-order-btn"
        onClick={handlePlaceOrder}
        disabled={loading || (formData.paymentMethod === "Card" && !stripe)}
      >
        {loading ? "Processing..." : "Place Order"}
      </button>
    </div>
  );
};

const Checkout = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    contact: "",
    paymentMethod: "COD", // Default to Cash on Delivery
  });

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(cart);
    const total = cart.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    setTotalPrice(total);
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Elements stripe={stripePromise}>
      <div className="checkout-container">
        <h1>Checkout</h1>
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
        <div className="checkout-summary">
          <h2>Order Summary</h2>
          {cartItems.map((item) => (
            <div key={item.id} className="checkout-item">
              <p>{item.name}</p>
              <p>Qty: {item.quantity}</p>
              <p>Price: LKR {item.price.toFixed(2)}</p>
            </div>
          ))}
          <h3>Total: LKR {totalPrice.toFixed(2)}</h3>
        </div>
        <CheckoutForm
          totalPrice={totalPrice}
          formData={formData}
          cartItems={cartItems}
        />
      </div>
    </Elements>
  );
};

export default Checkout;

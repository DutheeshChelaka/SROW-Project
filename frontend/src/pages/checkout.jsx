import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Import axios to send the order to the backend
import "../styles_pages/checkout.css";

const Checkout = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    contact: "",
    paymentMethod: "COD", // Default to Cash on Delivery
  });
  const [error, setError] = useState("");

  const navigate = useNavigate();

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

  const handlePlaceOrder = async () => {
    if (!formData.name || !formData.address || !formData.contact) {
      setError("All fields are required.");
      return;
    }

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
      paymentMethod:
        formData.paymentMethod === "COD" ? "cash-on-delivery" : "credit-card",
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
    <div className="checkout-container">
      <h1>Checkout</h1>
      <div className="checkout-form">
        <h2>Customer Details</h2>
        {error && <p className="error-text">{error}</p>}
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
      <button className="place-order-btn" onClick={handlePlaceOrder}>
        Place Order
      </button>
    </div>
  );
};

export default Checkout;

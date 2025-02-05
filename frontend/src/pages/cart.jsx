import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CurrencyContext } from "../context/CurrencyContext"; // Import Currency Context
import "../styles_pages/cart.css";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const { currency } = useContext(CurrencyContext); // Get currency context
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
      const itemPrice =
        currency === "LKR"
          ? item.priceLKR ?? 0 // Ensure we use priceLKR if available
          : item.priceJPY ?? 0; // Ensure we use priceJPY if available

      return total + itemPrice * item.quantity;
    }, 0);
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert(
        "Your cart is empty. Add some items before proceeding to checkout."
      );
      return;
    }
    navigate("/checkout");
  };

  return (
    <div className="cart-container">
      <h1>Shopping Cart</h1>
      {cartItems.length > 0 ? (
        <div className="cart-items">
          {cartItems.map((item, index) => {
            const itemPrice =
              currency === "LKR"
                ? item.priceLKR ?? 0 // Ensure price is never undefined
                : item.priceJPY ?? 0;

            const currencySymbol = currency === "LKR" ? "LKR" : "¥";

            return (
              <div className="cart-item" key={index}>
                <img
                  src={`http://localhost:5000/${item.images?.[0] || ""}`}
                  alt={item.name}
                  className="cart-item-image"
                />
                <div className="cart-item-details">
                  <h2>{item.name}</h2>
                  <p>
                    Price: {currencySymbol} {itemPrice.toFixed(2)}
                  </p>
                  <p>Size: {item.size}</p>
                  <div className="cart-item-quantity">
                    <button
                      className="quantity-btn"
                      onClick={() =>
                        updateQuantity(item.id, item.size, item.quantity - 1)
                      }
                    >
                      -
                    </button>
                    <span className="quantity-display">{item.quantity}</span>
                    <button
                      className="quantity-btn"
                      onClick={() =>
                        updateQuantity(item.id, item.size, item.quantity + 1)
                      }
                    >
                      +
                    </button>
                  </div>
                  <button
                    className="remove-item-btn"
                    onClick={() => removeItem(item.id, item.size)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
          <div className="cart-total">
            <h2>
              Total: {currency === "LKR" ? "LKR" : "¥"}{" "}
              {calculateTotal().toFixed(2)}
            </h2>
            <button className="checkout-btn" onClick={handleCheckout}>
              Proceed to Checkout
            </button>
          </div>
        </div>
      ) : (
        <p>Your cart is empty.</p>
      )}
    </div>
  );
};

export default Cart;

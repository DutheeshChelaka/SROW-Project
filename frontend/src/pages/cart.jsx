import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles_pages/cart.css";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
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
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
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
          {cartItems.map((item, index) => (
            <div className="cart-item" key={index}>
              <img
                src={item.image}
                alt={item.name}
                className="cart-item-image"
              />
              <div className="cart-item-details">
                <h2>{item.name}</h2>
                <p>Price: LKR {item.price.toFixed(2)}</p>
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
          ))}
          <div className="cart-total">
            <h2>Total: LKR {calculateTotal().toFixed(2)}</h2>
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

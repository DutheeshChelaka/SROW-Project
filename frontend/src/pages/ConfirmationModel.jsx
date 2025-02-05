import React from "react";
import "../styles_pages/ConfirmationModel.css"; // Create a CSS file for styling the modal

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  totalPrice,
  formData,
  cartItems,
  currency,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Confirm Your Order</h3>
        <p>
          <strong>Name:</strong> {formData.name}
        </p>
        <p>
          <strong>Address:</strong> {formData.address}
        </p>
        <p>
          <strong>Contact:</strong> {formData.contact}
        </p>
        <p>
          <strong>Payment Method:</strong> {formData.paymentMethod}
        </p>

        <h4>Order Summary</h4>
        <ul>
          {cartItems.map((item, index) => (
            <li key={index}>
              <img src={item.image} alt={item.name} style={{ width: "50px" }} />
              {item.name} - {item.size} - {item.quantity}x - {currency}{" "}
              {currency === "LKR" ? item.priceLKR : item.priceJPY}
            </li>
          ))}
        </ul>

        <h3>
          Total: {totalPrice} {currency}
        </h3>

        <button onClick={onConfirm}>Confirm & Place Order</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default ConfirmationModal;

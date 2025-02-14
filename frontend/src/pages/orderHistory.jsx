import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { CurrencyContext } from "../context/CurrencyContext";
import "../styles_pages/orderHistory.css";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);

  const { currency } = useContext(CurrencyContext);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "http://localhost:5000/api/orders/customer",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        console.log("✅ Fetched Orders for User:", response.data);
        setOrders(response.data || []);
        setError("");
      } catch (err) {
        console.error(
          "❌ Error fetching orders:",
          err.response?.data || err.message
        );
        setError("Error fetching orders. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="order-history-container">
      <h1 className="order-history-title">🛍️ Order History</h1>

      {loading ? (
        <p className="loading-text">Loading your orders...</p>
      ) : error ? (
        <p className="error-text">{error}</p>
      ) : orders.length > 0 ? (
        <div className="orders-wrapper">
          <div className="orders-list">
            {orders.map((order) => {
              const orderTotal =
                currency === "LKR" ? order.totalLKR || 0 : order.totalJPY || 0;
              const currencySymbol = currency === "LKR" ? "LKR" : "¥";

              return (
                <div key={order._id} className="order-card">
                  <h3 className="order-id">
                    📦 Order ID: {order._id.slice(0, 8)}...
                  </h3>
                  <p className="order-date">
                    📅 {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                  <p className="order-total">
                    💰 {currencySymbol} {orderTotal.toFixed(2)}
                  </p>
                  <p className={`order-status ${order.status.toLowerCase()}`}>
                    🟢 Status: {order.status}
                  </p>
                  <p className="order-payment-method">
                    💳 {order.paymentMethod}
                  </p>
                  <button
                    className="view-details-btn"
                    onClick={() => setSelectedOrder(order)}
                  >
                    View Details
                  </button>
                </div>
              );
            })}
          </div>

          {selectedOrder && (
            <div
              className="order-details-overlay"
              onClick={() => setSelectedOrder(null)}
            >
              <div
                className="order-details-modal"
                onClick={(e) => e.stopPropagation()}
              >
                <h2>Order Details</h2>
                <p>
                  <strong>👤 Name:</strong>{" "}
                  {selectedOrder.userDetails?.name || "N/A"}
                </p>
                <p>
                  <strong>📧 Email:</strong>{" "}
                  {selectedOrder.userDetails?.email || "N/A"}
                </p>
                <p>
                  <strong>📞 Phone:</strong>{" "}
                  {selectedOrder.userDetails?.phone || "N/A"}
                </p>
                <p>
                  <strong>🏠 Address:</strong>{" "}
                  {selectedOrder.userDetails?.address || "N/A"}
                </p>
                <h3>🛒 Ordered Products:</h3>
                <ul>
                  {selectedOrder.items.map((item, index) => {
                    const itemPrice =
                      currency === "LKR"
                        ? item.priceLKR || 0
                        : item.priceJPY || 0;
                    return (
                      <li key={index} className="order-product-item">
                        <p>
                          <strong>📌 Product:</strong> {item.name || "Unknown"}
                        </p>
                        <p>
                          <strong>📏 Size:</strong> {item.size || "N/A"}
                        </p>
                        <p>
                          <strong>🔢 Quantity:</strong> {item.quantity || 1}
                        </p>
                        <p>
                          <strong>💰 Price:</strong> {currency}{" "}
                          {itemPrice.toFixed(2)}
                        </p>
                      </li>
                    );
                  })}
                </ul>
                <button
                  className="close-modal-btn"
                  onClick={() => setSelectedOrder(null)}
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <p className="empty-orders">❌ You have no orders yet.</p>
      )}
    </div>
  );
};

export default OrderHistory;

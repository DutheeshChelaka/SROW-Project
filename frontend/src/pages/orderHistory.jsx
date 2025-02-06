import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { CurrencyContext } from "../context/CurrencyContext"; // Import Currency Context
import "../styles_pages/orderHistory.css";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);

  const { currency } = useContext(CurrencyContext); // Get selected currency from context

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
        setOrders(response.data || []); // Ensure we always set an array
        setError("");
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Error fetching orders. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="order-history-container">
      <h1 className="order-history-title">Orders History</h1>

      {loading ? (
        <p>Loading your orders...</p>
      ) : error ? (
        <p className="error-text">{error}</p>
      ) : orders.length > 0 ? (
        <div className="orders-wrapper">
          <div className="orders-list">
            {orders.map((order) => {
              const orderTotal =
                currency === "LKR"
                  ? order.totalLKR || 0 // Default to 0 if missing
                  : order.totalJPY || 0;
              const currencySymbol = currency === "LKR" ? "LKR" : "¥";

              return (
                <div key={order._id} className="order-card">
                  <h3 className="order-id">
                    Order ID: {order._id.slice(0, 8)}...
                  </h3>
                  <p className="order-date">
                    Date: {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                  <p className="order-total">
                    Total: {currencySymbol} {orderTotal.toFixed(2)}
                  </p>
                  <p className="order-status">Status: {order.status}</p>
                  <p className="order-payment-method">
                    Payment Method: {order.paymentMethod}
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
            <div className="order-details">
              <h2>Order Details</h2>
              <p>
                <strong>Customer Name:</strong>{" "}
                {selectedOrder.userDetails?.name || "N/A"}
              </p>
              <p>
                <strong>Email:</strong>{" "}
                {selectedOrder.userDetails?.email || "N/A"}
              </p>
              <p>
                <strong>Phone:</strong>{" "}
                {selectedOrder.userDetails?.phone || "N/A"}
              </p>
              <p>
                <strong>Address:</strong>{" "}
                {selectedOrder.userDetails?.address || "N/A"}
              </p>
              <p>
                <strong>Payment Method:</strong>{" "}
                {selectedOrder.paymentMethod || "N/A"}
              </p>
              <h3>Ordered Products:</h3>
              <ul>
                {selectedOrder.items.map((item, index) => {
                  const itemPrice =
                    currency === "LKR"
                      ? item.priceLKR || 0 // Handle missing values
                      : item.priceJPY || 0;
                  const currencySymbol = currency === "LKR" ? "LKR" : "¥";

                  return (
                    <li key={index} className="order-product-item">
                      <p>
                        <strong>Product Name:</strong> {item.name || "Unknown"}
                      </p>
                      <p>
                        <strong>Size:</strong> {item.size || "N/A"}
                      </p>
                      <p>
                        <strong>Quantity:</strong> {item.quantity || 1}
                      </p>
                      <p>
                        <strong>Price:</strong> {currencySymbol}{" "}
                        {itemPrice.toFixed(2)}
                      </p>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      ) : (
        <p>You have no orders yet.</p>
      )}
    </div>
  );
};

export default OrderHistory;

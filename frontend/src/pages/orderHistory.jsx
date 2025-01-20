import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles_pages/orderHistory.css";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "http://localhost:5000/api/orders/customer",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`, // Include token
            },
          }
        );
        setOrders(response.data); // Set the orders for the logged-in user
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
            {orders.map((order) => (
              <div key={order._id} className="order-card">
                <h3 className="order-id">
                  Order ID: {order._id.slice(0, 8)}...
                </h3>
                <p className="order-date">
                  Date: {new Date(order.createdAt).toLocaleDateString()}
                </p>
                <p className="order-total">
                  Total: LKR {order.total.toFixed(2)}
                </p>
                <p className="order-status">Status: {order.status}</p>
                <button
                  className="view-details-btn"
                  onClick={() => setSelectedOrder(order)}
                >
                  View Details
                </button>
              </div>
            ))}
          </div>

          {selectedOrder && (
            <div className="order-details">
              <h2>Order Details</h2>
              <p>
                <strong>Customer Name:</strong> {selectedOrder.userDetails.name}
              </p>
              <p>
                <strong>Email:</strong> {selectedOrder.userDetails.email}
              </p>
              <p>
                <strong>Phone:</strong> {selectedOrder.userDetails.phone}
              </p>
              <p>
                <strong>Address:</strong> {selectedOrder.userDetails.address}
              </p>
              <h3>Ordered Products:</h3>
              <ul>
                {selectedOrder.items.map((item, index) => (
                  <li key={index} className="order-product-item">
                    <p>
                      <strong>Product Name:</strong> {item.name}
                    </p>
                    <p>
                      <strong>Size:</strong> {item.size || "N/A"}
                    </p>
                    <p>
                      <strong>Quantity:</strong> {item.quantity}
                    </p>
                    <p>
                      <strong>Price:</strong> LKR {item.price.toFixed(2)}
                    </p>
                  </li>
                ))}
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

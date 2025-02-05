import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../styles_pages/manageOrders.css";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const statuses = ["Pending", "Packing", "On the way", "Delivered"];
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:5000/api/orders", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setOrders(response.data);
        setError("");
      } catch (err) {
        console.error("❌ Error fetching orders:", err);
        setError("Error fetching orders. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await axios.put(
        `http://localhost:5000/api/orders/${orderId}`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
      alert(`Order status updated to "${newStatus}"`);
    } catch (error) {
      console.error("❌ Error updating order status:", error);
      alert("Error updating order status. Please try again.");
    }
  };

  const deleteOrder = async (orderId) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      try {
        await axios.delete(`http://localhost:5000/api/orders/${orderId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setOrders((prevOrders) =>
          prevOrders.filter((order) => order._id !== orderId)
        );
        alert("✅ Order deleted successfully!");
      } catch (error) {
        console.error("❌ Error deleting order:", error);
        alert("Error deleting the order. Please try again.");
      }
    }
  };

  const viewOrderDetails = (orderId) => {
    navigate(`/admin/orders/${orderId}`);
  };

  return (
    <div className="admin-orders-page">
      <h1 className="page-title">Manage Orders</h1>

      {loading ? (
        <p className="loading-text">Loading orders...</p>
      ) : error ? (
        <p className="error-text">{error}</p>
      ) : (
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Total</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {
              const currencySymbol =
                order.selectedCurrency === "JPY" ? "¥" : "LKR";
              const totalAmount = order.displayTotal.toFixed(2); // Ensure proper formatting

              return (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{order.userDetails?.name || "Anonymous"}</td>
                  <td>
                    {currencySymbol} {totalAmount}
                  </td>{" "}
                  {/* ✅ Correct currency & total */}
                  <td>
                    <select
                      className="status-dropdown"
                      value={order.status}
                      onChange={(e) =>
                        updateOrderStatus(order._id, e.target.value)
                      }
                    >
                      {statuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <button
                      className="btn view-details-btn"
                      onClick={() => viewOrderDetails(order._id)}
                    >
                      View Details
                    </button>
                    <button
                      className="btn delete-order-btn"
                      onClick={() => deleteOrder(order._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminOrders;

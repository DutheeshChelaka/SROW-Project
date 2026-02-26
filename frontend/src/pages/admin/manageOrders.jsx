import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API_URL from "../../config/api";
import AdminLayout from "../../components/admin/AdminLayout";

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
        const response = await axios.get(`${API_URL}/api/orders`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setOrders(response.data);
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

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await axios.put(
        `${API_URL}/api/orders/${orderId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setOrders((prev) =>
        prev.map((order) => order._id === orderId ? { ...order, status: newStatus } : order)
      );
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Error updating order status.");
    }
  };

  const deleteOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;
    try {
      await axios.delete(`${API_URL}/api/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setOrders((prev) => prev.filter((order) => order._id !== orderId));
    } catch (error) {
      console.error("Error deleting order:", error);
      alert("Error deleting the order.");
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Delivered": return "bg-green-50 text-green-700 border-green-200";
      case "On the way": return "bg-blue-50 text-blue-700 border-blue-200";
      case "Packing": return "bg-purple-50 text-purple-700 border-purple-200";
      default: return "bg-amber-50 text-amber-700 border-amber-200";
    }
  };

  return (
    <AdminLayout>
      <div>
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-heading text-2xl font-semibold text-brand-black">Manage Orders</h1>
          <span className="font-body text-sm text-brand-muted">{orders.length} order{orders.length !== 1 ? "s" : ""}</span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-brand-border border-t-brand-black rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="font-body text-sm text-red-500">{error}</p>
          </div>
        ) : orders.length > 0 ? (
          <>
            {/* Desktop Table */}
            <div className="hidden lg:block bg-white border border-brand-border overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-brand-border bg-brand-surface">
                    <th className="text-left px-6 py-3 text-[10px] font-body font-semibold tracking-[0.15em] uppercase text-brand-muted">Order ID</th>
                    <th className="text-left px-6 py-3 text-[10px] font-body font-semibold tracking-[0.15em] uppercase text-brand-muted">Customer</th>
                    <th className="text-left px-6 py-3 text-[10px] font-body font-semibold tracking-[0.15em] uppercase text-brand-muted">Total</th>
                    <th className="text-left px-6 py-3 text-[10px] font-body font-semibold tracking-[0.15em] uppercase text-brand-muted">Payment</th>
                    <th className="text-left px-6 py-3 text-[10px] font-body font-semibold tracking-[0.15em] uppercase text-brand-muted">Status</th>
                    <th className="text-right px-6 py-3 text-[10px] font-body font-semibold tracking-[0.15em] uppercase text-brand-muted">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => {
                    const currencySymbol = order.selectedCurrency === "JPY" ? "¥" : "LKR";
                    const totalAmount = order.selectedCurrency === "JPY" ? order.totalJPY || 0 : order.totalLKR || 0;

                    return (
                      <tr key={order._id} className="border-b border-brand-border last:border-0 hover:bg-brand-surface/50 transition-colors">
                        <td className="px-6 py-4 font-body text-sm text-brand-text font-mono">
                          #{order._id.slice(-8).toUpperCase()}
                        </td>
                        <td className="px-6 py-4 font-body text-sm text-brand-text">
                          {order.userDetails?.name || "Anonymous"}
                        </td>
                        <td className="px-6 py-4 font-body text-sm font-medium text-brand-text">
                          {currencySymbol} {totalAmount.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 font-body text-sm text-brand-muted capitalize">
                          {order.paymentMethod === "cash-on-delivery" ? "COD" : "Card"}
                        </td>
                        <td className="px-6 py-4">
                          <select
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                            className={`text-xs font-body font-medium px-3 py-1.5 border rounded-full cursor-pointer focus:outline-none ${getStatusStyle(order.status)}`}
                          >
                            {statuses.map((status) => (
                              <option key={status} value={status}>{status}</option>
                            ))}
                          </select>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-3">
                            <button
                              onClick={() => navigate(`/admin/orders/${order._id}`)}
                              className="font-body text-xs font-medium text-brand-text underline hover:text-brand-accent transition-colors"
                            >
                              Details
                            </button>
                            <button
                              onClick={() => deleteOrder(order._id)}
                              className="font-body text-xs text-red-500 hover:text-red-600 transition-colors"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden space-y-4">
              {orders.map((order) => {
                const currencySymbol = order.selectedCurrency === "JPY" ? "¥" : "LKR";
                const totalAmount = order.selectedCurrency === "JPY" ? order.totalJPY || 0 : order.totalLKR || 0;

                return (
                  <div key={order._id} className="bg-white border border-brand-border p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-body text-xs text-brand-muted mb-1">#{order._id.slice(-8).toUpperCase()}</p>
                        <p className="font-body text-sm font-medium text-brand-text">
                          {order.userDetails?.name || "Anonymous"}
                        </p>
                      </div>
                      <span className={`text-xs font-body font-medium px-3 py-1 border rounded-full ${getStatusStyle(order.status)}`}>
                        {order.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <p className="font-body text-sm font-semibold text-brand-text">
                        {currencySymbol} {totalAmount.toFixed(2)}
                      </p>
                      <p className="font-body text-xs text-brand-muted capitalize">
                        {order.paymentMethod === "cash-on-delivery" ? "COD" : "Card"}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-brand-border">
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                        className="text-xs font-body border border-brand-border px-3 py-1.5 focus:outline-none bg-white"
                      >
                        {statuses.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                      <div className="flex gap-3">
                        <button
                          onClick={() => navigate(`/admin/orders/${order._id}`)}
                          className="font-body text-xs font-medium text-brand-text underline"
                        >
                          Details
                        </button>
                        <button
                          onClick={() => deleteOrder(order._id)}
                          className="font-body text-xs text-red-500"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <p className="font-body text-sm text-brand-muted">No orders yet.</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminOrders;
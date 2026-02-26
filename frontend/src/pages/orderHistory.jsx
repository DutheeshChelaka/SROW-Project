import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { CurrencyContext } from "../context/CurrencyContext";
import API_URL from "../config/api";

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
        const response = await axios.get(`${API_URL}/api/orders/customer`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setOrders(response.data || []);
        setError("");
      } catch (err) {
        console.error("Error fetching orders:", err.response?.data || err.message);
        setError("Error fetching orders. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return "bg-green-50 text-green-700 border-green-200";
      case "accepted":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "pending":
      default:
        return "bg-amber-50 text-amber-700 border-amber-200";
    }
  };

  const currencySymbol = currency === "LKR" ? "LKR" : "¥";

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 py-10">

        {/* Page Header */}
        <div className="mb-10">
          <p className="text-[11px] font-body font-semibold tracking-[0.3em] uppercase text-brand-muted mb-2">
            Account
          </p>
          <h1 className="font-heading text-3xl sm:text-4xl font-medium text-brand-black">
            Order History
          </h1>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-32">
            <div className="w-8 h-8 border-2 border-brand-border border-t-brand-black rounded-full animate-spin" />
          </div>

        ) : error ? (
          <div className="text-center py-32">
            <p className="font-body text-brand-muted">{error}</p>
          </div>

        ) : orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map((order) => {
              const orderTotal = currency === "LKR" ? order.totalLKR || 0 : order.totalJPY || 0;

              return (
                <div
                  key={order._id}
                  className="border border-brand-border p-6 hover:border-neutral-400 transition-colors"
                >
                  {/* Order Header */}
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                    <div>
                      <p className="font-body text-xs text-brand-muted mb-1">
                        Order #{order._id.slice(-8).toUpperCase()}
                      </p>
                      <p className="font-body text-sm text-brand-text">
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          year: "numeric", month: "long", day: "numeric"
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 text-xs font-body font-medium border rounded-full ${getStatusStyle(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>

                  {/* Order Items Preview */}
                  <div className="flex items-center gap-2 mb-4">
                    {order.items.slice(0, 3).map((item, i) => (
                      <div key={i} className="w-12 h-14 bg-brand-surface overflow-hidden">
                        <img
                          src={`${API_URL}/${item.images?.[0] || ""}`}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          onError={(e) => { e.target.style.display = "none"; }}
                        />
                      </div>
                    ))}
                    {order.items.length > 3 && (
                      <div className="w-12 h-14 bg-brand-surface flex items-center justify-center">
                        <span className="font-body text-xs text-brand-muted">+{order.items.length - 3}</span>
                      </div>
                    )}
                  </div>

                  {/* Order Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-brand-border">
                    <div className="flex items-center gap-4">
                      <p className="font-body text-sm font-semibold text-brand-text">
                        {currencySymbol} {orderTotal.toFixed(2)}
                      </p>
                      <span className="font-body text-xs text-brand-muted capitalize">
                        {order.paymentMethod === "cash-on-delivery" ? "Cash on Delivery" : "Card"}
                      </span>
                    </div>
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="font-body text-xs font-medium text-brand-text underline hover:text-brand-accent transition-colors"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

        ) : (
          <div className="text-center py-24">
            <svg className="w-16 h-16 text-brand-border mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
            <h2 className="font-heading text-2xl font-medium text-brand-text mb-2">No orders yet</h2>
            <p className="font-body text-sm text-brand-muted">Your order history will appear here.</p>
          </div>
        )}

        {/* ===== ORDER DETAILS MODAL ===== */}
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={() => setSelectedOrder(null)}>
            <div className="absolute inset-0 bg-black/50" />
            <div className="relative bg-white w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="p-8">
                {/* Modal Header */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-heading text-xl font-semibold text-brand-text">
                    Order #{selectedOrder._id.slice(-8).toUpperCase()}
                  </h2>
                  <button onClick={() => setSelectedOrder(null)} className="p-1 hover:opacity-60 transition-opacity">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Status */}
                <span className={`inline-block px-3 py-1 text-xs font-body font-medium border rounded-full mb-6 ${getStatusStyle(selectedOrder.status)}`}>
                  {selectedOrder.status}
                </span>

                {/* Customer Info */}
                <div className="mb-6">
                  <p className="text-[10px] font-body font-semibold tracking-[0.2em] uppercase text-brand-muted mb-3">
                    Delivery Details
                  </p>
                  <div className="space-y-2 font-body text-sm">
                    <div className="flex justify-between">
                      <span className="text-brand-muted">Name</span>
                      <span className="text-brand-text">{selectedOrder.userDetails?.name || "N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-brand-muted">Email</span>
                      <span className="text-brand-text">{selectedOrder.userDetails?.email || "N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-brand-muted">Phone</span>
                      <span className="text-brand-text">{selectedOrder.userDetails?.phone || "N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-brand-muted">Address</span>
                      <span className="text-brand-text text-right max-w-[200px]">{selectedOrder.userDetails?.address || "N/A"}</span>
                    </div>
                  </div>
                </div>

                <div className="h-px bg-brand-border mb-6" />

                {/* Items */}
                <div className="mb-6">
                  <p className="text-[10px] font-body font-semibold tracking-[0.2em] uppercase text-brand-muted mb-3">
                    Items Ordered
                  </p>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item, index) => {
                      const itemPrice = currency === "LKR" ? item.priceLKR || 0 : item.priceJPY || 0;
                      return (
                        <div key={index} className="flex items-center justify-between py-2 border-b border-brand-border/50 last:border-0">
                          <div>
                            <p className="font-body text-sm font-medium text-brand-text">{item.name || "Unknown"}</p>
                            <p className="font-body text-xs text-brand-muted">
                              Size: {item.size || "N/A"} · Qty: {item.quantity || 1}
                            </p>
                          </div>
                          <p className="font-body text-sm text-brand-text">
                            {currencySymbol} {(itemPrice * (item.quantity || 1)).toFixed(2)}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="h-px bg-brand-border mb-4" />

                {/* Total */}
                <div className="flex justify-between mb-6">
                  <span className="font-body text-base font-semibold text-brand-text">Total</span>
                  <span className="font-body text-base font-semibold text-brand-text">
                    {currencySymbol} {(currency === "LKR" ? selectedOrder.totalLKR || 0 : selectedOrder.totalJPY || 0).toFixed(2)}
                  </span>
                </div>

                <button
                  onClick={() => setSelectedOrder(null)}
                  className="w-full btn-outline text-center"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;
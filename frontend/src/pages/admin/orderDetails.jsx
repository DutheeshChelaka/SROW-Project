import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import API_URL from "../../config/api";
import AdminLayout from "../../components/admin/AdminLayout";

const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrderDetails = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_URL}/api/orders/${orderId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setOrder(response.data);
      } catch (err) {
        console.error("Error fetching order details:", err);
        setError("Error fetching order details.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrderDetails();
  }, [orderId]);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-brand-border border-t-brand-black rounded-full animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  if (error || !order) {
    return (
      <AdminLayout>
        <div className="text-center py-20">
          <p className="font-body text-sm text-red-500">{error || "No order details available."}</p>
        </div>
      </AdminLayout>
    );
  }

  const currencySymbol = order.selectedCurrency === "JPY" ? "¥" : "LKR";
  const totalAmount = order.selectedCurrency === "JPY" ? order.totalJPY ?? 0 : order.totalLKR ?? 0;

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
        {/* Back + Title */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/admin/orders")}
            className="font-body text-sm text-brand-muted hover:text-brand-text transition-colors mb-4 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Back to Orders
          </button>
          <div className="flex items-center gap-4">
            <h1 className="font-heading text-2xl font-semibold text-brand-black">
              Order #{order._id.slice(-8).toUpperCase()}
            </h1>
            <span className={`text-xs font-body font-medium px-3 py-1 border rounded-full ${getStatusStyle(order.status)}`}>
              {order.status}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Customer Info */}
          <div className="bg-white border border-brand-border p-6">
            <h2 className="text-[10px] font-body font-semibold tracking-[0.2em] uppercase text-brand-muted mb-4">
              Customer Details
            </h2>
            <div className="space-y-3 font-body text-sm">
              <div>
                <p className="text-brand-muted text-xs mb-0.5">Name</p>
                <p className="text-brand-text font-medium">{order.userDetails?.name || "N/A"}</p>
              </div>
              <div>
                <p className="text-brand-muted text-xs mb-0.5">Email</p>
                <p className="text-brand-text font-medium">{order.userDetails?.email || "N/A"}</p>
              </div>
              <div>
                <p className="text-brand-muted text-xs mb-0.5">Phone</p>
                <p className="text-brand-text font-medium">{order.userDetails?.phone || "N/A"}</p>
              </div>
              <div>
                <p className="text-brand-muted text-xs mb-0.5">Address</p>
                <p className="text-brand-text font-medium">{order.userDetails?.address || "N/A"}</p>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white border border-brand-border p-6">
            <h2 className="text-[10px] font-body font-semibold tracking-[0.2em] uppercase text-brand-muted mb-4">
              Order Summary
            </h2>
            <div className="space-y-3 font-body text-sm">
              <div className="flex justify-between">
                <span className="text-brand-muted">Status</span>
                <span className="text-brand-text font-medium">{order.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-brand-muted">Payment</span>
                <span className="text-brand-text font-medium capitalize">
                  {order.paymentMethod === "cash-on-delivery" ? "Cash on Delivery" : "Card"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-brand-muted">Currency</span>
                <span className="text-brand-text font-medium">{order.selectedCurrency}</span>
              </div>
              <div className="h-px bg-brand-border my-2" />
              <div className="flex justify-between">
                <span className="text-brand-text font-semibold">Total</span>
                <span className="text-brand-text font-semibold">{currencySymbol} {totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Order Date */}
          <div className="bg-white border border-brand-border p-6">
            <h2 className="text-[10px] font-body font-semibold tracking-[0.2em] uppercase text-brand-muted mb-4">
              Timeline
            </h2>
            <div className="font-body text-sm">
              <p className="text-brand-muted text-xs mb-0.5">Order Placed</p>
              <p className="text-brand-text font-medium">
                {new Date(order.createdAt).toLocaleDateString("en-US", {
                  year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit"
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white border border-brand-border mt-6">
          <div className="px-6 py-4 border-b border-brand-border">
            <h2 className="text-[10px] font-body font-semibold tracking-[0.2em] uppercase text-brand-muted">
              Items Ordered ({order.items.length})
            </h2>
          </div>
          <ul>
            {order.items.map((item, index) => {
              const itemPrice = order.selectedCurrency === "JPY" ? item.priceJPY ?? 0 : item.priceLKR ?? 0;
              return (
                <li key={index} className="flex items-center justify-between px-6 py-4 border-b border-brand-border last:border-0">
                  <div>
                    <p className="font-body text-sm font-medium text-brand-text">
                      {item.productId?.name || item.name || "Unnamed Product"}
                    </p>
                    <p className="font-body text-xs text-brand-muted mt-0.5">
                      Size: {item.size || "N/A"} · Qty: {item.quantity}
                    </p>
                  </div>
                  <p className="font-body text-sm font-medium text-brand-text">
                    {currencySymbol} {(itemPrice * item.quantity).toFixed(2)}
                  </p>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </AdminLayout>
  );
};

export default OrderDetails;
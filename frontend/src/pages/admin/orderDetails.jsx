import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../../styles_pages/orderDetails.css";

const OrderDetails = () => {
  const { orderId } = useParams(); // Extract the order ID from the URL
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrderDetails = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:5000/api/orders/${orderId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setOrder(response.data);
      } catch (err) {
        console.error("❌ Error fetching order details:", err);
        setError("Error fetching order details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  if (loading) return <p>Loading order details...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!order) return <p>No order details available.</p>;

  // ✅ Get the correct currency & total
  const currencySymbol = order.selectedCurrency === "JPY" ? "¥" : "LKR";
  const totalAmount =
    order.selectedCurrency === "JPY"
      ? order.totalJPY ?? 0
      : order.totalLKR ?? 0;

  return (
    <div className="order-details-container">
      <h1>Order Details</h1>
      <h2>Order ID: {order._id}</h2>
      <div className="order-summary">
        <p>
          <strong>Customer Name:</strong> {order.userDetails?.name || "N/A"}
        </p>
        <p>
          <strong>Email:</strong> {order.userDetails?.email || "N/A"}
        </p>
        <p>
          <strong>Address:</strong> {order.userDetails?.address || "N/A"}
        </p>
        <p>
          <strong>Total Amount:</strong> {currencySymbol}{" "}
          {totalAmount.toFixed(2)}
        </p>
        <p>
          <strong>Status:</strong> {order.status}
        </p>
      </div>
      <h3>Order Items</h3>
      <ul className="order-items-list">
        {order.items.map((item, index) => {
          // ✅ Get correct item price based on selectedCurrency
          const itemPrice =
            order.selectedCurrency === "JPY"
              ? item.priceJPY ?? 0
              : item.priceLKR ?? 0;

          return (
            <li key={index} className="order-item">
              <div className="item-details">
                <div>
                  <p>
                    <strong>
                      {item.productId?.name || item.name || "Unnamed Product"}
                    </strong>
                  </p>
                  <p>Size: {item.size || "N/A"}</p>
                  <p>
                    Quantity: {item.quantity} x {currencySymbol}{" "}
                    {itemPrice.toFixed(2)}
                  </p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default OrderDetails;

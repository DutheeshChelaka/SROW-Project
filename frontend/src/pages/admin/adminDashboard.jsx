import React from "react";
import { Link } from "react-router-dom";
import "../../styles_pages/adminDashboard.css"; // Create this CSS file for styling

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <div className="dashboard-links">
        <Link to="/admin/categories" className="dashboard-link">
          Manage Categories
        </Link>
        <Link to="/admin/subcategories" className="dashboard-link">
          Manage Subcategories
        </Link>
        <Link to="/admin/products" className="dashboard-link">
          Manage Products
        </Link>
        <Link to="/admin/orders" className="dashboard-link">
          Manage Orders
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;

import React from "react";
import { Link } from "react-router-dom";

const AdminSidebar = () => {
  return (
    <nav className="admin-sidebar">
      <ul>
        <li>
          <Link to="/admin">Dashboard</Link>
        </li>
        <li>
          <Link to="/admin/categories">Manage Categories</Link>
        </li>
        <li>
          <Link to="/admin/subcategories">Manage Subcategories</Link>
        </li>
        <li>
          <Link to="/admin/products">Manage Products</Link>
        </li>
      </ul>
    </nav>
  );
};

export default AdminSidebar;

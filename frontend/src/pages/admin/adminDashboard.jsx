import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import API_URL from "../../config/api";
import AdminLayout from "../../components/admin/AdminLayout";

const AdminDashboard = () => {
  const [stats, setStats] = useState({ categories: 0, products: 0, orders: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [catRes, prodRes, orderRes] = await Promise.all([
          axios.get(`${API_URL}/api/catalog/categories`),
          axios.get(`${API_URL}/api/catalog/products`),
          axios.get(`${API_URL}/api/orders`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }),
        ]);
        setStats({
          categories: catRes.data.length,
          products: prodRes.data.length,
          orders: orderRes.data.length,
        });
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    };
    fetchStats();
  }, []);

  const cards = [
    { label: "Categories", count: stats.categories, path: "/admin/categories", icon: "M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z M6 6h.008v.008H6V6z" },
    { label: "Products", count: stats.products, path: "/admin/products", icon: "M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" },
    { label: "Orders", count: stats.orders, path: "/admin/orders", icon: "M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" },
  ];

  return (
    <AdminLayout>
      <div>
        <h1 className="font-heading text-2xl font-semibold text-brand-black mb-8">Dashboard</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {cards.map((card) => (
            <Link
              key={card.path}
              to={card.path}
              className="bg-white border border-brand-border p-6 hover:border-brand-black transition-colors group"
            >
              <div className="flex items-center justify-between mb-4">
                <svg className="w-6 h-6 text-brand-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={card.icon} />
                </svg>
                <svg className="w-4 h-4 text-brand-muted group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </div>
              <p className="font-heading text-3xl font-semibold text-brand-black mb-1">{card.count}</p>
              <p className="font-body text-sm text-brand-muted">{card.label}</p>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <h2 className="font-heading text-lg font-semibold text-brand-black mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { label: "Add New Product", path: "/admin/products" },
            { label: "Manage Categories", path: "/admin/categories" },
            { label: "View All Orders", path: "/admin/orders" },
            { label: "Manage Subcategories", path: "/admin/subcategories" },
          ].map((action) => (
            <Link
              key={action.path}
              to={action.path}
              className="flex items-center justify-between bg-white border border-brand-border px-5 py-4 hover:border-brand-black transition-colors group"
            >
              <span className="font-body text-sm font-medium text-brand-text">{action.label}</span>
              <svg className="w-4 h-4 text-brand-muted group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </Link>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
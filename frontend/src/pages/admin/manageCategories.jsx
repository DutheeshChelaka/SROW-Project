import React, { useState, useEffect } from "react";
import axios from "axios";
import API_URL from "../../config/api";
import AdminLayout from "../../components/admin/AdminLayout";

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/catalog/categories`);
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;
    try {
      await axios.post(
        `${API_URL}/api/catalog/categories`,
        { name: newCategory },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setNewCategory("");
      fetchCategories();
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  const handleDeleteCategory = async (id, name) => {
    if (!window.confirm(`Delete category "${name}"? This cannot be undone.`)) return;
    try {
      await axios.delete(`${API_URL}/api/catalog/categories/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      fetchCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  return (
    <AdminLayout>
      <div>
        <h1 className="font-heading text-2xl font-semibold text-brand-black mb-8">Manage Categories</h1>

        {/* Add Category */}
        <div className="bg-white border border-brand-border p-6 mb-8">
          <h2 className="font-body text-sm font-semibold text-brand-text mb-4">Add New Category</h2>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Category name"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddCategory()}
              className="flex-1 border border-brand-border px-4 py-2.5 font-body text-sm text-brand-text
                         placeholder-brand-muted focus:outline-none focus:border-brand-black transition-colors"
            />
            <button onClick={handleAddCategory} className="btn-primary">
              Add
            </button>
          </div>
        </div>

        {/* Categories List */}
        <div className="bg-white border border-brand-border">
          <div className="px-6 py-4 border-b border-brand-border">
            <h2 className="font-body text-sm font-semibold text-brand-text">
              All Categories ({categories.length})
            </h2>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-6 h-6 border-2 border-brand-border border-t-brand-black rounded-full animate-spin" />
            </div>
          ) : categories.length > 0 ? (
            <ul>
              {categories.map((category) => (
                <li
                  key={category._id}
                  className="flex items-center justify-between px-6 py-4 border-b border-brand-border last:border-0 hover:bg-brand-surface transition-colors"
                >
                  <span className="font-body text-sm text-brand-text">{category.name}</span>
                  <button
                    onClick={() => handleDeleteCategory(category._id, category.name)}
                    className="font-body text-xs text-red-500 hover:text-red-600 transition-colors"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-6 py-8 text-center font-body text-sm text-brand-muted">
              No categories yet. Add one above.
            </p>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default ManageCategories;
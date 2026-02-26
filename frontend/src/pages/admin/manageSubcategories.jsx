import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import API_URL from "../../config/api";
import AdminLayout from "../../components/admin/AdminLayout";

const ManageSubcategories = () => {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [newSubcategory, setNewSubcategory] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/api/catalog/categories`);
      setCategories(response.data);
      if (response.data.length > 0) {
        setSelectedCategory(response.data[0]._id);
        fetchSubcategories(response.data[0]._id);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  }, []);

  const fetchSubcategories = async (categoryId) => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/catalog/subcategories/${categoryId}`);
      setSubcategories(response.data);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    fetchSubcategories(categoryId);
  };

  const handleAddSubcategory = async () => {
    if (!newSubcategory.trim()) return;
    try {
      await axios.post(
        `${API_URL}/api/catalog/subcategories`,
        { name: newSubcategory, categoryId: selectedCategory },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setNewSubcategory("");
      fetchSubcategories(selectedCategory);
    } catch (error) {
      console.error("Error adding subcategory:", error);
    }
  };

  const handleDeleteSubcategory = async (id, name) => {
    if (!window.confirm(`Delete subcategory "${name}"?`)) return;
    try {
      await axios.delete(`${API_URL}/api/catalog/subcategories/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      fetchSubcategories(selectedCategory);
    } catch (error) {
      console.error("Error deleting subcategory:", error);
    }
  };

  return (
    <AdminLayout>
      <div>
        <h1 className="font-heading text-2xl font-semibold text-brand-black mb-8">Manage Subcategories</h1>

        {/* Category Selector */}
        <div className="bg-white border border-brand-border p-6 mb-6">
          <label className="block font-body text-xs font-semibold tracking-[0.15em] uppercase text-brand-text mb-2">
            Select Category
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="w-full sm:w-64 border border-brand-border px-4 py-2.5 font-body text-sm text-brand-text
                       focus:outline-none focus:border-brand-black transition-colors bg-white"
          >
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Add Subcategory */}
        <div className="bg-white border border-brand-border p-6 mb-8">
          <h2 className="font-body text-sm font-semibold text-brand-text mb-4">Add New Subcategory</h2>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Subcategory name"
              value={newSubcategory}
              onChange={(e) => setNewSubcategory(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddSubcategory()}
              className="flex-1 border border-brand-border px-4 py-2.5 font-body text-sm text-brand-text
                         placeholder-brand-muted focus:outline-none focus:border-brand-black transition-colors"
            />
            <button onClick={handleAddSubcategory} className="btn-primary">
              Add
            </button>
          </div>
        </div>

        {/* Subcategories List */}
        <div className="bg-white border border-brand-border">
          <div className="px-6 py-4 border-b border-brand-border">
            <h2 className="font-body text-sm font-semibold text-brand-text">
              Subcategories ({subcategories.length})
            </h2>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-6 h-6 border-2 border-brand-border border-t-brand-black rounded-full animate-spin" />
            </div>
          ) : subcategories.length > 0 ? (
            <ul>
              {subcategories.map((sub) => (
                <li
                  key={sub._id}
                  className="flex items-center justify-between px-6 py-4 border-b border-brand-border last:border-0 hover:bg-brand-surface transition-colors"
                >
                  <span className="font-body text-sm text-brand-text">{sub.name}</span>
                  <button
                    onClick={() => handleDeleteSubcategory(sub._id, sub.name)}
                    className="font-body text-xs text-red-500 hover:text-red-600 transition-colors"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-6 py-8 text-center font-body text-sm text-brand-muted">
              No subcategories for this category.
            </p>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default ManageSubcategories;
import React, { useState, useEffect } from "react";
import axios from "axios";
import API_URL from "../../config/api";
import AdminLayout from "../../components/admin/AdminLayout";

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: "", priceLKR: "", priceJPY: "", description: "",
    categoryId: "", subcategoryId: "", images: [], sizes: "",
  });
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [editingProductId, setEditingProductId] = useState(null);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/catalog/categories`);
      setCategories(res.data);
    } catch (err) { setError("Error fetching categories."); }
  };

  const fetchSubcategories = async (categoryId) => {
    if (!categoryId) return;
    try {
      const res = await axios.get(`${API_URL}/api/catalog/subcategories/${categoryId}`);
      setSubcategories(res.data);
    } catch (err) { setError("Error fetching subcategories."); }
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/catalog/products`);
      setProducts(res.data);
    } catch (err) { setError("Error fetching products."); }
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("priceLKR", form.priceLKR);
      formData.append("priceJPY", form.priceJPY);
      formData.append("description", form.description);
      formData.append("categoryId", form.categoryId);
      formData.append("subcategoryId", form.subcategoryId);
      formData.append("sizes", JSON.stringify(form.sizes.split(",").map((s) => s.trim())));
      for (let i = 0; i < form.images.length; i++) {
        formData.append("images", form.images[i]);
      }

      if (editingProductId) {
        await axios.put(`${API_URL}/api/catalog/products/${editingProductId}`, formData, {
          headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
      } else {
        await axios.post(`${API_URL}/api/catalog/products`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      resetForm();
      fetchProducts();
    } catch (err) {
      setError("Error saving product.");
      console.error("Save Product Error:", err);
    }
  };

  const handleEdit = (product) => {
    setForm({
      name: product.name, priceLKR: product.priceLKR, priceJPY: product.priceJPY,
      description: product.description, categoryId: product.categoryId,
      subcategoryId: product.subcategoryId, sizes: product.sizes.join(", "), images: [],
    });
    setEditingProductId(product._id);
    fetchSubcategories(product.categoryId);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await axios.delete(`${API_URL}/api/catalog/products/${productId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setProducts(products.filter((p) => p._id !== productId));
    } catch (error) {
      console.error("Delete Product Error:", error);
      alert("Failed to delete product");
    }
  };

  const resetForm = () => {
    setForm({ name: "", priceLKR: "", priceJPY: "", description: "", categoryId: "", subcategoryId: "", sizes: "", images: [] });
    setEditingProductId(null);
    setSubcategories([]);
    setShowForm(false);
    setError("");
  };

  const inputClass = "w-full border border-brand-border px-4 py-2.5 font-body text-sm text-brand-text placeholder-brand-muted focus:outline-none focus:border-brand-black transition-colors";
  const labelClass = "block font-body text-xs font-semibold tracking-[0.15em] uppercase text-brand-text mb-2";

  return (
    <AdminLayout>
      <div>
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-heading text-2xl font-semibold text-brand-black">
            {editingProductId ? "Edit Product" : "Manage Products"}
          </h1>
          {!showForm && (
            <button onClick={() => setShowForm(true)} className="btn-primary">
              + Add Product
            </button>
          )}
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 font-body text-sm">
            {error}
          </div>
        )}

        {/* Product Form */}
        {showForm && (
          <div className="bg-white border border-brand-border p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-body text-sm font-semibold text-brand-text">
                {editingProductId ? "Update Product" : "New Product"}
              </h2>
              <button onClick={resetForm} className="font-body text-xs text-brand-muted hover:text-brand-text transition-colors">
                Cancel
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className={labelClass}>Product Name</label>
                <input type="text" placeholder="e.g. Classic White Tee" value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} />
              </div>

              <div>
                <label className={labelClass}>Price (LKR)</label>
                <input type="number" placeholder="0.00" value={form.priceLKR}
                  onChange={(e) => setForm({ ...form, priceLKR: e.target.value })} className={inputClass} />
              </div>

              <div>
                <label className={labelClass}>Price (JPY)</label>
                <input type="number" placeholder="0.00" value={form.priceJPY}
                  onChange={(e) => setForm({ ...form, priceJPY: e.target.value })} className={inputClass} />
              </div>

              <div>
                <label className={labelClass}>Category</label>
                <select value={form.categoryId || ""}
                  onChange={(e) => { setForm({ ...form, categoryId: e.target.value, subcategoryId: "" }); fetchSubcategories(e.target.value); }}
                  className={`${inputClass} bg-white`}>
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelClass}>Subcategory</label>
                <select value={form.subcategoryId || ""}
                  onChange={(e) => setForm({ ...form, subcategoryId: e.target.value })}
                  disabled={!form.categoryId}
                  className={`${inputClass} bg-white ${!form.categoryId ? "opacity-50 cursor-not-allowed" : ""}`}>
                  <option value="">Select Subcategory</option>
                  {subcategories.map((sub) => (
                    <option key={sub._id} value={sub._id}>{sub.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelClass}>Sizes (comma separated)</label>
                <input type="text" placeholder="S, M, L, XL" value={form.sizes}
                  onChange={(e) => setForm({ ...form, sizes: e.target.value })} className={inputClass} />
              </div>

              <div>
                <label className={labelClass}>Images</label>
                <input type="file" multiple
                  onChange={(e) => setForm({ ...form, images: Array.from(e.target.files) })}
                  className="w-full font-body text-sm text-brand-muted file:mr-4 file:py-2 file:px-4 file:border file:border-brand-border file:text-xs file:font-body file:font-medium file:bg-white file:text-brand-text hover:file:bg-brand-surface file:cursor-pointer file:transition-colors" />
                {form.images.length > 0 && (
                  <p className="mt-1 font-body text-xs text-brand-muted">{form.images.length} file{form.images.length > 1 ? "s" : ""} selected</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className={labelClass}>Description</label>
                <textarea placeholder="Product description..." value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3} className={`${inputClass} resize-none`} />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button type="button" onClick={handleSubmit} className="btn-primary">
                {editingProductId ? "Update Product" : "Add Product"}
              </button>
              {editingProductId && (
                <button type="button" onClick={resetForm} className="btn-outline">
                  Cancel Edit
                </button>
              )}
            </div>
          </div>
        )}

        {/* Products List */}
        <div className="bg-white border border-brand-border">
          <div className="px-6 py-4 border-b border-brand-border">
            <h2 className="font-body text-sm font-semibold text-brand-text">
              All Products ({products.length})
            </h2>
          </div>

          {products.length > 0 ? (
            <div className="divide-y divide-brand-border">
              {products.map((product) => (
                <div key={product._id} className="flex items-center gap-4 px-6 py-4 hover:bg-brand-surface/50 transition-colors">
                  {/* Thumbnail */}
                  <div className="flex gap-2 flex-shrink-0">
                    {product.images.slice(0, 2).map((image, index) => (
                      <div key={index} className="w-14 h-16 bg-brand-surface overflow-hidden">
                        <img src={`${API_URL}/${image}`} alt={`${product.name}`}
                          className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-body text-sm font-medium text-brand-text truncate">{product.name}</h3>
                    <p className="font-body text-xs text-brand-muted mt-0.5 truncate">{product.description}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="font-body text-xs font-medium text-brand-text">
                        LKR {product.priceLKR?.toFixed(2)}
                      </span>
                      <span className="font-body text-xs text-brand-muted">
                        / JPY {product.priceJPY?.toFixed(2)}
                      </span>
                      {product.sizes && (
                        <span className="font-body text-xs text-brand-muted">
                          · {product.sizes.join(", ")}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <button onClick={() => handleEdit(product)}
                      className="font-body text-xs font-medium text-brand-text underline hover:text-brand-accent transition-colors">
                      Edit
                    </button>
                    <button onClick={() => handleDeleteProduct(product._id)}
                      className="font-body text-xs text-red-500 hover:text-red-600 transition-colors">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="px-6 py-12 text-center font-body text-sm text-brand-muted">
              No products yet. Click "+ Add Product" to get started.
            </p>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default ManageProducts;
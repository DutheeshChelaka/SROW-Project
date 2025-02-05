import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../styles_pages/manageProducts.css";

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    priceLKR: "",
    priceJPY: "",
    description: "",
    categoryId: "",
    subcategoryId: "",
    images: [],
    sizes: "",
  });
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [editingProductId, setEditingProductId] = useState(null); // Track editing state
  const [error, setError] = useState("");

  // Fetch all categories
  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/catalog/categories"
      );
      setCategories(res.data);
    } catch (err) {
      setError("Error fetching categories.");
      console.error("Fetch Categories Error:", err);
    }
  };

  const fetchSubcategories = async (categoryId) => {
    if (!categoryId) return;
    try {
      const res = await axios.get(
        `http://localhost:5000/api/catalog/subcategories/${categoryId}`
      );
      setSubcategories(res.data);
    } catch (err) {
      setError("Error fetching subcategories.");
      console.error("Fetch Subcategories Error:", err);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/catalog/products");
      setProducts(res.data);
    } catch (err) {
      setError("Error fetching products.");
      console.error("Fetch Products Error:", err);
    }
  };

  // Handle form submission (Create or Update)
  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("priceLKR", form.priceLKR);
      formData.append("priceJPY", form.priceJPY);
      formData.append("description", form.description);
      formData.append("categoryId", form.categoryId);
      formData.append("subcategoryId", form.subcategoryId);
      formData.append(
        "sizes",
        JSON.stringify(form.sizes.split(",").map((size) => size.trim()))
      );

      // Append all selected images to formData
      for (let i = 0; i < form.images.length; i++) {
        formData.append("images", form.images[i]);
      }

      if (editingProductId) {
        // Update product
        await axios.put(
          `http://localhost:5000/api/catalog/products/${editingProductId}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${localStorage.getItem("token")}`, // Add your token here
            },
          }
        );

        setProducts(
          products.map((product) =>
            product._id === editingProductId ? { ...product, ...form } : product
          )
        );
        setEditingProductId(null);
      } else {
        // Create new product
        const res = await axios.post(
          "http://localhost:5000/api/catalog/products",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        setProducts([...products, res.data.product]);
      }

      resetForm();
    } catch (err) {
      setError("Error saving product.");
      console.error("Save Product Error:", err);
    }
  };

  // Load product details into form for editing
  const handleEdit = (product) => {
    setForm({
      name: product.name,
      priceLKR: product.priceLKR,
      priceJPY: product.priceJPY,
      description: product.description,
      categoryId: product.categoryId,
      subcategoryId: product.subcategoryId,
      sizes: product.sizes.join(", "),
      images: [],
    });

    setEditingProductId(product._id);
    fetchSubcategories(product.categoryId);
  };

  // Delete a product
  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token"); // Ensure token is stored
      if (!token) {
        console.error("No token found. User might not be logged in.");
        return;
      }

      await axios.delete(
        `http://localhost:5000/api/catalog/products/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Send the token
          },
        }
      );

      setProducts(products.filter((product) => product._id !== productId));
    } catch (error) {
      console.error("❌ Delete Product Error:", error.response?.data || error);
      alert(error.response?.data?.message || "Failed to delete product");
    }
  };

  // Reset form
  const resetForm = () => {
    setForm({
      name: "",
      priceLKR: "",
      priceJPY: "",
      description: "",
      categoryId: "",
      subcategoryId: "",
      sizes: "",
      images: [],
    });
    setEditingProductId(null);
    setSubcategories([]);
  };

  return (
    <div className="manage-products-container">
      <h1>{editingProductId ? "Edit Product" : "Manage Products"}</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Product Form */}
      <form className="product-form">
        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Available Sizes (comma-separated, e.g., S,M,L)"
          value={form.sizes}
          onChange={(e) => setForm({ ...form, sizes: e.target.value })}
        />
        <input
          type="number"
          placeholder="Price in LKR"
          value={form.priceLKR}
          onChange={(e) => setForm({ ...form, priceLKR: e.target.value })}
        />
        <input
          type="number"
          placeholder="Price in JPY"
          value={form.priceJPY}
          onChange={(e) => setForm({ ...form, priceJPY: e.target.value })}
        />
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        {/* Category Selection */}
        <select
          value={form.categoryId || ""}
          onChange={(e) => {
            setForm({ ...form, categoryId: e.target.value, subcategoryId: "" });
            fetchSubcategories(e.target.value);
          }}
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>

        {/* Subcategory Selection */}
        <select
          value={form.subcategoryId || ""}
          onChange={(e) => setForm({ ...form, subcategoryId: e.target.value })}
          disabled={!form.categoryId}
        >
          <option value="">Select Subcategory</option>
          {subcategories.map((sub) => (
            <option key={sub._id} value={sub._id}>
              {sub.name}
            </option>
          ))}
        </select>

        <input
          type="file"
          multiple
          onChange={(e) =>
            setForm({ ...form, images: Array.from(e.target.files) })
          }
        />
        <button type="button" onClick={handleSubmit}>
          {editingProductId ? "Update Product" : "Add Product"}
        </button>
        {editingProductId && (
          <button type="button" onClick={resetForm}>
            Cancel Edit
          </button>
        )}
      </form>

      {/* Product List */}
      <div className="product-list">
        <h2>Products</h2>
        {products.map((product) => (
          <div className="product-card" key={product._id}>
            <div className="product-images">
              {product.images.slice(0, 3).map((image, index) => (
                <img
                  key={index}
                  src={`http://localhost:5000/${image}`}
                  alt={`${product.name} - ${index + 1}`}
                  className="product-image"
                />
              ))}
              {product.images.length > 3 && (
                <p>+ {product.images.length - 3} more images</p>
              )}
            </div>
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <p>
              LKR {product.priceLKR.toFixed(2)} / JPY{" "}
              {product.priceJPY.toFixed(2)}
            </p>
            <button onClick={() => handleEdit(product)} className="edit-button">
              Edit
            </button>
            <button onClick={() => handleDeleteProduct(product._id)}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageProducts;

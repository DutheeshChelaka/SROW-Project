import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../styles_pages/manageProducts.css";

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    categoryId: "",
    subcategoryId: "",
    images: [],
  });
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [error, setError] = useState("");

  // Fetch all categories
  const fetchCategories = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/catalog/categories"
      );
      setCategories(res.data);
    } catch (err) {
      setError("Error fetching categories. Please try again.");
    }
  };

  // Fetch subcategories based on category
  const fetchSubcategories = async (categoryId) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/catalog/subcategories/${categoryId}`
      );
      setSubcategories(res.data);
    } catch (err) {
      setError("Error fetching subcategories. Please try again.");
    }
  };

  // Fetch all products
  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/catalog/products");
      setProducts(res.data);
    } catch (err) {
      setError("Error fetching products. Please try again.");
    }
  };

  // Create a new product
  const handleCreateProduct = async () => {
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("price", form.price);
      formData.append("description", form.description);
      formData.append("categoryId", form.categoryId);
      formData.append("subcategoryId", form.subcategoryId);

      // Append sizes as a JSON string
      if (form.sizes) {
        formData.append(
          "sizes",
          JSON.stringify(form.sizes.split(",").map((size) => size.trim()))
        );
      }

      // Append images
      for (let i = 0; i < form.images.length; i++) {
        formData.append("images", form.images[i]);
      }

      const res = await axios.post(
        "http://localhost:5000/api/catalog/products",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // Add the new product to the products list
      setProducts([...products, res.data.product]);

      // Reset the form after successful creation
      setForm({
        name: "",
        price: "",
        description: "",
        categoryId: "",
        subcategoryId: "",
        sizes: "", // Reset sizes field
        images: [],
      });
    } catch (err) {
      setError("Error creating product. Please try again.");
      console.error(err);
    }
  };

  // Delete a product
  const handleDeleteProduct = async (productId) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/catalog/products/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setProducts(products.filter((product) => product._id !== productId));
    } catch (error) {
      setError("Error deleting product. Please try again.");
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  return (
    <div className="manage-products-container">
      <h1>Manage Products</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Product Creation Form */}
      <form className="product-form">
        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Available Sizes (comma-separated, e.g., S,M,L,XL)"
          value={form.sizes}
          onChange={(e) => setForm({ ...form, sizes: e.target.value })}
        />
        <input
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
        />
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <select
          value={form.categoryId}
          onChange={(e) => {
            setForm({ ...form, categoryId: e.target.value });
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
        <select
          value={form.subcategoryId}
          onChange={(e) => setForm({ ...form, subcategoryId: e.target.value })}
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
        <button type="button" onClick={handleCreateProduct}>
          Add Product
        </button>
      </form>

      {/* Product List */}
      <div className="product-list">
        <h2>Products</h2>
        {products.length > 0 ? (
          products.map((product) => (
            <div className="product-card" key={product._id}>
              <img
                src={`http://localhost:5000/${product.images[0]}`}
                alt={product.name}
                className="product-image"
              />
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <p>LKR {product.price.toFixed(2)}</p>
              <button
                className="delete-product-btn"
                onClick={() => handleDeleteProduct(product._id)}
              >
                Delete
              </button>
            </div>
          ))
        ) : (
          <p>No products found.</p>
        )}
      </div>
    </div>
  );
};

export default ManageProducts;

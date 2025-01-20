import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../styles_pages/manageSubcategories.css";

const ManageSubcategories = () => {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [newSubcategory, setNewSubcategory] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/catalog/categories"
      );
      setCategories(response.data);
      if (response.data.length > 0) {
        setSelectedCategory(response.data[0]._id);
        fetchSubcategories(response.data[0]._id);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchSubcategories = async (categoryId) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/catalog/subcategories/${categoryId}`
      );
      setSubcategories(response.data);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    }
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    fetchSubcategories(categoryId);
  };

  const handleAddSubcategory = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/catalog/subcategories",
        { name: newSubcategory, categoryId: selectedCategory },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setNewSubcategory("");
      fetchSubcategories(selectedCategory);
    } catch (error) {
      console.error("Error adding subcategory:", error);
    }
  };

  const handleDeleteSubcategory = async (id) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/catalog/subcategories/${id}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      fetchSubcategories(selectedCategory);
    } catch (error) {
      console.error("Error deleting subcategory:", error);
    }
  };

  return (
    <div className="manage-subcategories">
      <h1>Manage Subcategories</h1>

      <div>
        <label>Select Category: </label>
        <select
          value={selectedCategory}
          onChange={(e) => handleCategoryChange(e.target.value)}
        >
          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <input
          type="text"
          placeholder="New Subcategory Name"
          value={newSubcategory}
          onChange={(e) => setNewSubcategory(e.target.value)}
        />
        <button onClick={handleAddSubcategory}>Add Subcategory</button>
      </div>

      <ul>
        {subcategories.map((subcategory) => (
          <li key={subcategory._id}>
            {subcategory.name}
            <button onClick={() => handleDeleteSubcategory(subcategory._id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageSubcategories;

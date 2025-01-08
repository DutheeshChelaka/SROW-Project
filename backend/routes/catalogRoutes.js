const express = require("express");
const router = express.Router();
const Category = require("../models/Category");
const Subcategory = require("../models/Subcategory");
const Product = require("../models/Product");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

console.log("authMiddleware:", authMiddleware); // Should log the function
console.log("adminMiddleware:", adminMiddleware); // Should log the function

// Categories
router.post(
  "/categories",
  [authMiddleware, adminMiddleware],
  async (req, res) => {
    const { name } = req.body;
    try {
      const category = new Category({ name });
      await category.save();
      res.status(201).json({ message: "Category created", category });
    } catch (error) {
      res.status(500).json({ message: "Error creating category", error });
    }
  }
);

router.get("/categories", async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: "Error fetching categories", error });
  }
});

// Subcategories
router.post(
  "/subcategories",
  [authMiddleware, adminMiddleware],
  async (req, res) => {
    const { name, categoryId } = req.body;
    try {
      const subcategory = new Subcategory({ name, category: categoryId });
      await subcategory.save();
      res.status(201).json({ message: "Subcategory created", subcategory });
    } catch (error) {
      res.status(500).json({ message: "Error creating subcategory", error });
    }
  }
);

router.get("/subcategories/:categoryId", async (req, res) => {
  try {
    const subcategories = await Subcategory.find({
      category: req.params.categoryId,
    });
    res.status(200).json(subcategories);
  } catch (error) {
    res.status(500).json({ message: "Error fetching subcategories", error });
  }
});

// Products
router.post(
  "/products",
  [authMiddleware, adminMiddleware],
  async (req, res) => {
    const { name, price, description, categoryId, subcategoryId, imageUrl } =
      req.body;
    try {
      const product = new Product({
        name,
        price,
        description,
        category: categoryId,
        subcategory: subcategoryId,
        imageUrl,
      });
      await product.save();
      res.status(201).json({ message: "Product created", product });
    } catch (error) {
      res.status(500).json({ message: "Error creating product", error });
    }
  }
);

router.get("/products", async (req, res) => {
  try {
    const products = await Product.find()
      .populate("category")
      .populate("subcategory");
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error });
  }
});

module.exports = router;

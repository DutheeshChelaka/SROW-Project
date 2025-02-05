const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  priceLKR: {
    type: Number,
    required: true,
  },
  priceJPY: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  subcategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subcategory",
  },
  sizes: {
    type: [String],
    required: true,
  },
  images: [String], // Array of image paths
});

module.exports = mongoose.model("Product", productSchema);

const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: { type: String, required: true },
        size: { type: String, required: false },
        quantity: { type: Number, required: true },
        priceLKR: { type: Number, required: false }, // Price in LKR
        priceJPY: { type: Number, required: false }, // Price in JPY
      },
    ],
    totalLKR: { type: Number, required: false }, // Total in LKR
    totalJPY: { type: Number, required: false }, // Total in JPY
    selectedCurrency: { type: String, enum: ["LKR", "JPY"], required: true }, // Store the selected currency
    userDetails: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: ["cash-on-delivery", "credit-card", "card"], // ✅ Now supports "card"
    },
    status: { type: String, default: "Pending" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);

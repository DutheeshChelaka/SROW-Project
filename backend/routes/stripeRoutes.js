const express = require("express");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY); // Ensure your secret key is correctly set

router.post("/create-payment-intent", async (req, res) => {
  try {
    const { amount, currency } = req.body;

    if (!amount || !currency) {
      return res
        .status(400)
        .json({ message: "Amount and currency are required" });
    }

    console.log("💳 Creating Stripe Payment Intent:", { amount, currency });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount), // Ensure it's an integer (Stripe requires it in cents)
      currency: currency.toLowerCase(), // Ensure lowercase (e.g., "jpy", "lkr")
      payment_method_types: ["card"],
    });

    console.log("✅ Stripe Payment Intent Created:", paymentIntent);

    res.json({
      clientSecret: paymentIntent.client_secret,
      id: paymentIntent.id,
    });
  } catch (error) {
    console.error("❌ Error creating payment intent:", error);
    res.status(500).json({ message: "Error processing payment", error });
  }
});

module.exports = router;

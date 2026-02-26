const express = require("express");
const axios = require("axios");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const response = await axios.get("https://ipapi.co/json/");
    res.json({
      country_code: response.data.country_code,
    });
  } catch (error) {
    console.error("Geo fetch failed:", error.message);
    res.status(500).json({ message: "Geo fetch failed" });
  }
});

module.exports = router;
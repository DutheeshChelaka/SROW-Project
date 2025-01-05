const express = require("express");
const connectDB = require("./config/db");
const app = express();
const cors = require("cors");
require("dotenv").config();

connectDB();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend is running!!!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

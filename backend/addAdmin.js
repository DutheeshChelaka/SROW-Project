const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const User = require("./models/User"); // Adjust the path to your User model

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("2824981", salt);

    const admin = new User({
      name: "dutheesh",
      email: "dutheeshwork@gmail.com",
      password: hashedPassword,
      role: "admin",
      isVerified: true, // Ensure the admin is marked as verified
    });

    await admin.save();
    console.log("Admin user added successfully!");
    mongoose.disconnect();
  } catch (error) {
    console.error("Error adding admin user:", error);
  }
})();

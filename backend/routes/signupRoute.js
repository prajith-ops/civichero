const express = require("express");
const router = express.Router();
const axios = require("axios");
const User = require("../model/UserData"); // adjust to your actual User model

// ✅ Signup with Captcha verification
router.post("/", async (req, res) => {
  const { name, email, password, token } = req.body;

  if (!token) {
    return res.status(400).json({ message: "Captcha verification required." });
  }

  try {
    // Verify captcha
    const captchaVerify = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET}&response=${token}`
    );

    if (!captchaVerify.data.success) {
      return res.status(400).json({ message: "Captcha verification failed." });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered." });
    }

    // Create new user
    const newUser = new User({ name, email, password }); // Hash password if needed
    await newUser.save();

    res.json({ message: "Signup successful!" });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Server error during signup." });
  }
});

module.exports = router;

const express = require("express");
const { signup, login } = require("../controllers/controller");
const { authMiddleware } = require("../middleware/Middleware");
const Issue = require("../model/ReportData");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);

// ✅ New route to get current user info & issues
router.get("/me", authMiddleware, async (req, res) => {
  try {
    // Fetch issues reported by this user
    const issues = await Issue.find({ reporter: req.user.id }).lean();

    // Optional: calculate points
    const points = issues.length * 10; // example: 10 points per issue

    res.json({ 
      name: req.user.name, 
      email: req.user.email, 
      issues, 
      points 
    });
  } catch (err) {
    console.error("Error fetching user data:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;

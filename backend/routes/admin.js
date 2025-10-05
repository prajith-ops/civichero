const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { authMiddleware } = require("../middleware/Middleware");
const Admin = require("../model/AdminData");
const Issue = require("../model/ReportData");
const User = require("../model/UserData");
const Violation = require("../model/ReportViolation");
const sendEmail = require("../utils/sendEmail");

const router = express.Router();

/* ===============================
   🔹 ADMIN LOGIN
================================ */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: admin._id, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token, role: "admin", email: admin.email });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ===============================
   🔹 DASHBOARD STATS
================================ */
router.get("/stats", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Access denied" });

    const total = await Issue.countDocuments();
    const resolved = await Issue.countDocuments({ status: "Resolved" });
    const pending = await Issue.countDocuments({ status: "Pending" });
    const inProgress = await Issue.countDocuments({ status: "In Progress" });
    const reported = await Issue.countDocuments({ status: "Reported" });

    const monthlyAgg = await Issue.aggregate([
      { $group: { _id: { $month: "$createdAt" }, count: { $sum: 1 } } },
    ]);

    const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const monthly = {};
    monthNames.forEach((m) => (monthly[m] = 0));
    monthlyAgg.forEach((item) => { monthly[monthNames[item._id - 1]] = item.count; });

    res.json({ total, resolved, pending, inProgress, reported, monthly });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching stats" });
  }
});

/* ===============================
   🔹 ISSUES MANAGEMENT
================================ */
router.get("/issues", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Access denied" });
    const issues = await Issue.find().populate("reporter", "name email").sort({ createdAt: -1 });
    res.json(issues);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching issues" });
  }
});

router.put("/issues/:id", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Access denied" });
    const { status } = req.body;
    const issue = await Issue.findById(req.params.id);
    if (!issue) return res.status(404).json({ message: "Issue not found" });

    issue.status = status;
    await issue.save();

    // Send email if resolved
    if (status === "Resolved" && issue.userEmail) {
      await sendEmail(
        issue.userEmail,
        "Your Report Has Been Resolved ✅",
        `Hello, your report titled "${issue.title}" has been marked as resolved.`,
        `<p>Hello,</p><p>Your report titled "<b>${issue.title}</b>" has been marked as <b>Resolved</b>.</p><p>Thank you for using CivicHero!</p>`
      );
    }

    res.json(issue);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating issue" });
  }
});

/* ===============================
   🔹 VIOLATIONS MANAGEMENT
================================ */
router.get("/violations", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Access denied" });
    const violations = await Violation.find()
      .populate("reportedBy", "name email")
      .sort({ createdAt: -1 });
    res.json(violations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching violations" });
  }
});

router.put("/violations/:id", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Access denied" });
    const { status } = req.body;
    const violation = await Violation.findById(req.params.id);
    if (!violation) return res.status(404).json({ message: "Violation not found" });

    violation.status = status;
    await violation.save();

    // Send email if resolved
    if (status === "Resolved" && violation.userEmail) {
      await sendEmail(
        violation.userEmail,
        "Your Report Has Been Resolved ✅",
        `Hello, your report titled "${violation.title}" has been marked as resolved.`,
        `<p>Hello,</p><p>Your report titled "<b>${violation.title}</b>" has been marked as <b>Resolved</b>.</p><p>Thank you for using CivicHero!</p>`
      );
    }

    res.json(violation);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating violation" });
  }
});

/* ===============================
   🔹 TOP REPORTERS
================================ */
router.get("/top-reporters", authMiddleware, async (req, res) => {
  try {
    const topUsers = await Issue.aggregate([
      { $group: { _id: "$reporter", reports: { $sum: 1 } } },
      { $sort: { reports: -1 } },
      { $limit: 5 },
    ]);

    const populated = await User.find({ _id: { $in: topUsers.map(u => u._id) } });

    const data = topUsers
      .map(u => {
        const user = populated.find(p => p._id.toString() === u._id.toString());
        if (!user) return null;
        return { id: user._id, name: user.name, email: user.email, reports: u.reports };
      })
      .filter(Boolean);

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching top reporters" });
  }
});

/* ===============================
   🔹 USER MANAGEMENT
================================ */
router.get("/users", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Access denied" });
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching users" });
  }
});

router.put("/users/:id/block", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Access denied" });
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.blocked = !user.blocked;
    await user.save();

    res.json({ message: `User ${user.blocked ? "blocked" : "unblocked"}`, blocked: user.blocked });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error blocking/unblocking user" });
  }
});

router.delete("/users/:id", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Access denied" });
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting user" });
  }
});

router.put("/users/:id", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Access denied" });
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating user" });
  }
});

/* ===============================
   🔹 EXPORT ROUTER
================================ */
module.exports = router;

// const express = require("express");
// const multer = require("multer");
// const Violation = require("../model/ReportViolation");

// const router = express.Router();

// // Multer setup
// const upload = multer({ dest: "uploads/" });

// // POST: Report violation
// router.post("/report", upload.single("evidence"), async (req, res) => {
//   try {
//     const newViolation = new Violation({
//       type: req.body.type,
//       description: req.body.description,
//       location: req.body.location,
//       reportedBy: req.body.userId || null, 
//       evidence: req.file ? req.file.path : null
//     });

//     await newViolation.save();
//     res.status(201).json({ message: "Violation reported successfully", violation: newViolation });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // GET: Fetch all violations
// router.get("/", async (req, res) => {
//   try {
//     const violations = await Violation.find().sort({ createdAt: -1 });
//     res.json(violations);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// module.exports = router;











const express = require("express");
const multer = require("multer");
const path = require("path");
const Violation = require("../model/ReportViolation");
const User = require("../model/UserData");
const { authMiddleware } = require("../middleware/Middleware");
const sendEmail = require("../utils/sendEmail");

const router = express.Router();

// Multer setup for evidence uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

/**
 * 🚨 POST: Report a violation
 */
router.post("/report", authMiddleware, upload.single("evidence"), async (req, res) => {
  try {
    const { type, description, location, lat, lng } = req.body;

    if (!type || !description) {
      return res.status(400).json({ message: "Type and description are required" });
    }

    const newViolation = new Violation({
      type,
      description,
      location,
      lat: lat ? Number(lat) : undefined,
      lng: lng ? Number(lng) : undefined,
      reportedBy: req.user.id,
      evidence: req.file ? req.file.filename : null,
    });

    await newViolation.save();

    await User.findByIdAndUpdate(req.user.id, { $push: { violations: newViolation._id } });

    const user = await User.findById(req.user.id);
    if (user?.email) {
      await sendEmail(
        user.email,
        "CivicHero – Violation Report Submitted",
        `Your violation report "${type}" has been submitted successfully.`,
        `
          <h3>Hello ${user.name || "Citizen"}!</h3>
          <p>Your violation report has been received:</p>
          <ul>
            <li><strong>Type:</strong> ${type}</li>
            <li><strong>Description:</strong> ${description}</li>
            <li><strong>Location:</strong> ${location || "Not specified"}</li>
          </ul>
          <p>We'll notify you once it is reviewed. 💚</p>
        `
      );
    }

    res.status(201).json({ message: "Violation reported successfully", violation: newViolation });
  } catch (err) {
    console.error("Error reporting violation:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

/**
 * 📄 GET: Fetch all violations
 */
router.get("/", authMiddleware, async (req, res) => {
  try {
    const violations = await Violation.find()
      .populate("reportedBy", "name email")
      .sort({ createdAt: -1 })
      .lean();

    res.json(violations);
  } catch (err) {
    console.error("Error fetching violations:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

/**
 * 📄 GET: Fetch violations reported by the logged-in user
 */
router.get("/user", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const violations = await Violation.find({ reportedBy: userId })
      .sort({ createdAt: -1 })
      .lean();

    // Example points: 5 points per Resolved violation
    const points = violations.filter(v => v.status === "Resolved").length * 5;

    res.json({ success: true, violations, points });
  } catch (err) {
    console.error("Error fetching user violations:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;

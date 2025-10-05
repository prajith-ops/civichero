// const express = require("express");
// const router = express.Router();
// const multer = require("multer");
// const path = require("path");
// const Issue = require("../model/ReportData"); // make sure this matches your Issue model path
// const { authMiddleware } = require("../middleware/Middleware");

// // Multer storage for file uploads
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/");
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(null, uniqueSuffix + path.extname(file.originalname));
//   },
// });
// const upload = multer({ storage });

// /**
//  * ➕ Create a new issue
//  */
// router.post("/", authMiddleware, upload.single("file"), async (req, res) => {
//   try {
//     const { title, description, location, urgency, status, lat, lng } = req.body;

//     if (!lat || !lng) {
//       return res.status(400).json({ message: "Latitude and Longitude are required" });
//     }

//     const newIssue = new Issue({
//       title,
//       description,
//       location,
//       lat: Number(lat),
//       lng: Number(lng),
//       urgency: urgency || "Medium",
//       status: status || "Reported",
//       reporter: req.user.id,
//       file: req.file ? req.file.filename : undefined,
//     });

//     await newIssue.save();
//     res.status(201).json(newIssue);
//   } catch (err) {
//     console.error("Error creating issue:", err);
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// });

// /**
//  * 📄 Get all issues
//  */
// router.get("/", authMiddleware, async (req, res) => {
//   try {
//     // Use lean() to avoid Mongoose document issues
//     const issues = await Issue.find().populate("reporter", "name email").lean();

//     // Ensure lat/lng are numbers
//     const formattedIssues = issues.map(i => ({
//       ...i,
//       lat: Number(i.lat),
//       lng: Number(i.lng),
//     }));

//     res.json(formattedIssues);
//   } catch (err) {
//     console.error("Error fetching reports:", err);
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// });

// /**
//  * 🔍 Get a single issue by ID
//  */
// router.get("/:id", authMiddleware, async (req, res) => {
//   try {
//     const issue = await Issue.findById(req.params.id).populate("reporter", "name email").lean();
//     if (!issue) return res.status(404).json({ message: "Issue not found" });

//     issue.lat = Number(issue.lat);
//     issue.lng = Number(issue.lng);

//     res.json(issue);
//   } catch (err) {
//     console.error("Error fetching issue:", err);
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// });

// /**
//  * ✏️ Update an issue by ID
//  */
// router.put("/:id", authMiddleware, upload.single("file"), async (req, res) => {
//   try {
//     const { title, description, location, urgency, status, lat, lng } = req.body;

//     const updateData = {
//       title,
//       description,
//       location,
//       urgency,
//       status,
//       ...(lat && lng ? { lat: Number(lat), lng: Number(lng) } : {}),
//     };

//     if (req.file) updateData.file = req.file.filename;

//     const updatedIssue = await Issue.findByIdAndUpdate(req.params.id, updateData, { new: true }).lean();

//     if (!updatedIssue) return res.status(404).json({ message: "Issue not found" });

//     res.json(updatedIssue);
//   } catch (err) {
//     console.error("Error updating issue:", err);
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// });

// /**
//  * 🗑️ Delete an issue by ID
//  */
// router.delete("/:id", authMiddleware, async (req, res) => {
//   try {
//     const deletedIssue = await Issue.findByIdAndDelete(req.params.id);
//     if (!deletedIssue) return res.status(404).json({ message: "Issue not found" });

//     res.json({ message: "Issue deleted successfully" });
//   } catch (err) {
//     console.error("Error deleting issue:", err);
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// });

// module.exports = router;















const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const Issue = require("../model/ReportData");
const User = require("../model/UserData");
const { authMiddleware } = require("../middleware/Middleware");
const sendEmail = require("../utils/sendEmail");

// Multer storage setup
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
 * ➕ Create a new issue (mapped to user)
 */
router.post("/", authMiddleware, upload.single("file"), async (req, res) => {
  try {
    const { title, description, location, urgency, status, lat, lng } = req.body;

    if (!lat || !lng) {
      return res.status(400).json({ message: "Latitude and Longitude are required" });
    }

    const newIssue = new Issue({
      title,
      description,
      location,
      lat: Number(lat),
      lng: Number(lng),
      urgency: urgency || "Medium",
      status: status || "Reported",
      reporter: req.user.id,
      file: req.file ? req.file.filename : undefined,
    });

    await newIssue.save();

    await User.findByIdAndUpdate(req.user.id, {
      $push: { reportedIssues: newIssue._id },
    });

    // Send email on issue creation
    const user = await User.findById(req.user.id);
    if (user?.email) {
      await sendEmail(
        user.email,
        "CivicHero – Report Submitted Successfully",
        `Your report "${title}" has been submitted successfully.`,
        `
          <h3>Thank you for reporting, ${user.name || "Citizen"}!</h3>
          <p>We have received your issue:</p>
          <ul>
            <li><strong>Title:</strong> ${title}</li>
            <li><strong>Urgency:</strong> ${urgency}</li>
            <li><strong>Location:</strong> ${location || "Not specified"}</li>
          </ul>
          <p>We'll update you when it's reviewed. 💚</p>
        `
      );
    }

    res.status(201).json(newIssue);
  } catch (err) {
    console.error("Error creating issue:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

/**
 * 📄 Get all issues (with reporter details)
 */
router.get("/", authMiddleware, async (req, res) => {
  try {
    const issues = await Issue.find().populate("reporter", "name email").lean();
    res.json(issues.map(i => ({ ...i, lat: Number(i.lat), lng: Number(i.lng) })));
  } catch (err) {
    console.error("Error fetching reports:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

/**
 * 📄 Get issues for logged-in user
 */
router.get("/user", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const issues = await Issue.find({ reporter: userId }).sort({ createdAt: -1 }).lean();

    // Example points calculation: 10 points per Resolved issue
    const points = issues.filter(i => i.status === "Resolved").length * 10;

    res.json({ success: true, issues, points });
  } catch (err) {
    console.error("Error fetching user issues:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

/**
 * 🔍 Get a single issue by ID
 */
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id)
      .populate("reporter", "name email")
      .lean();

    if (!issue) return res.status(404).json({ message: "Issue not found" });

    issue.lat = Number(issue.lat);
    issue.lng = Number(issue.lng);

    res.json(issue);
  } catch (err) {
    console.error("Error fetching issue:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

/**
 * ✏️ Update an issue by ID
 * ✅ Sends email if status changed to Resolved
 */
router.put("/:id", authMiddleware, upload.single("file"), async (req, res) => {
  try {
    const { title, description, location, urgency, status, lat, lng } = req.body;

    // Fetch old issue first
    const oldIssue = await Issue.findById(req.params.id).populate("reporter", "name email");
    if (!oldIssue) return res.status(404).json({ message: "Issue not found" });

    const updateData = {
      title: title || oldIssue.title,
      description: description || oldIssue.description,
      location: location || oldIssue.location,
      urgency: urgency || oldIssue.urgency,
      status: status || oldIssue.status,
      ...(lat && lng ? { lat: Number(lat), lng: Number(lng) } : {}),
    };

    if (req.file) updateData.file = req.file.filename;

    const updatedIssue = await Issue.findByIdAndUpdate(req.params.id, updateData, { new: true })
      .populate("reporter", "name email");

    // Send email if status changed to Resolved
    if (oldIssue.status !== "Resolved" && updatedIssue.status === "Resolved") {
      const user = updatedIssue.reporter;
      if (user?.email) {
        await sendEmail(
          user.email,
          "CivicHero – Issue Resolved",
          `Your reported issue "${updatedIssue.title}" has been resolved!`,
          `
            <h3>Hello ${user.name || "Citizen"}!</h3>
            <p>Your reported issue has been resolved:</p>
            <ul>
              <li><strong>Title:</strong> ${updatedIssue.title}</li>
              <li><strong>Description:</strong> ${updatedIssue.description}</li>
              <li><strong>Location:</strong> ${updatedIssue.location || "Not specified"}</li>
            </ul>
            <p>Thank you for helping make the community better! 💚</p>
          `
        );
      }
    }

    res.json(updatedIssue);
  } catch (err) {
    console.error("Error updating issue:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

/**
 * 🗑️ Delete an issue by ID
 */
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const deletedIssue = await Issue.findByIdAndDelete(req.params.id);
    if (!deletedIssue) return res.status(404).json({ message: "Issue not found" });

    await User.findByIdAndUpdate(req.user.id, { $pull: { reportedIssues: deletedIssue._id } });

    res.json({ message: "Issue deleted successfully" });
  } catch (err) {
    console.error("Error deleting issue:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;

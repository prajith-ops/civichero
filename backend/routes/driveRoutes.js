const express = require("express");
const router = express.Router();
const Drive = require("../model/Drive");
const { authMiddleware } = require("../middleware/Middleware");

// ✅ Get all upcoming drives (sorted by date)
router.get("/", async (req, res) => {
  try {
    const today = new Date();
    const drives = await Drive.find({ date: { $gte: today } })
      .sort({ date: 1 })
      .populate("participants", "name email");
    res.json({ events: drives });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Get drives joined by the logged-in user
router.get("/joined", authMiddleware, async (req, res) => {
  try {
    const drives = await Drive.find({ participants: req.user.id })
      .sort({ date: 1 })
      .populate("participants", "name email");
    res.json({ joinedDrives: drives });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Create a new drive
router.post("/create", authMiddleware, async (req, res) => {
  try {
    const { title, description, date, points, tag, type, image } = req.body;

    if (!title || !description || !date) {
      return res
        .status(400)
        .json({ message: "Title, description, and date are required" });
    }

    const newDrive = new Drive({
      title,
      description,
      date,
      points: points || 10,
      tag: tag || "community",
      type: type || "upcoming",
      image: image || "https://source.unsplash.com/600x400/?community",
      participants: [], // initially empty
      createdBy: req.user.id,
    });

    await newDrive.save();
    res.status(201).json({ message: "Drive created", drive: newDrive });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Join a drive
router.post("/join/:id", authMiddleware, async (req, res) => {
  try {
    const drive = await Drive.findById(req.params.id);
    if (!drive) return res.status(404).json({ message: "Drive not found" });

    // Prevent joining if already joined
    if (drive.participants.includes(req.user.id))
      return res.status(400).json({ message: "Already joined" });

    // Optional: prevent joining past drives
    if (new Date(drive.date) < new Date())
      return res.status(400).json({ message: "Cannot join past drive" });

    drive.participants.push(req.user.id);
    await drive.save();

    res.json({ message: "Joined drive successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Leave a drive
router.post("/leave/:id", authMiddleware, async (req, res) => {
  try {
    const drive = await Drive.findById(req.params.id);
    if (!drive) return res.status(404).json({ message: "Drive not found" });

    drive.participants = drive.participants.filter(
      (p) => p.toString() !== req.user.id
    );
    await drive.save();

    res.json({ message: "Left drive successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

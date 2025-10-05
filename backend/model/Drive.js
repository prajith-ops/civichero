const mongoose = require("mongoose");

const driveSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    points: { type: Number, default: 10 },
    tag: { type: String, default: "community" },
    type: { type: String, enum: ["upcoming", "past"], default: "upcoming" },
    image: {
      type: String,
      default: "https://source.unsplash.com/600x400/?community",
    },
    participants: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User" } // Stores user IDs
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Drive", driveSchema);

// // models/User.js
// const mongoose = require("mongoose");

// const userSchema = new mongoose.Schema(
//   {
//     name: { type: String, required: true },
//     email: { type: String, required: true, unique: true },
//     password: { type: String, required: true },
//     role: { type: String, enum: ["user", "admin"], default: "user" }, // existing field

//     // New fields for Community Drives & Rewards
//     points: { type: Number, default: 0 }, // reward points
//     joinedDrives: [{ type: mongoose.Schema.Types.ObjectId, ref: "Drive" }], // drives user joined
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("User", userSchema);

















// models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" }, // existing field

    // 🏆 Community Drives & Rewards
    points: { type: Number, default: 0 }, // reward points
    joinedDrives: [{ type: mongoose.Schema.Types.ObjectId, ref: "Drive" }], // drives user joined

    // 🧾 Linking user with their reports & violations
    reportedIssues: [{ type: mongoose.Schema.Types.ObjectId, ref: "Issue" }], // issues submitted by user
    violations: [{ type: mongoose.Schema.Types.ObjectId, ref: "Violation" }], // violations reported or received
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);

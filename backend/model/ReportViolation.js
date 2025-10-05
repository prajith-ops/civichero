// const mongoose = require("mongoose");

// const violationSchema = new mongoose.Schema({
//   type: { type: String, required: true },
//   description: { type: String, required: true },
//   location: { type: String },         // human-readable address
//   lat: { type: Number },              // latitude for map
//   lng: { type: Number },              // longitude for map
//   evidence: { type: String },         // uploaded file path
//   reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//   status: { type: String, enum: ["Pending", "In Progress", "Resolved"], default: "Pending" },
//   createdAt: { type: Date, default: Date.now }
// });

// module.exports = mongoose.model("Violation", violationSchema);








// models/ReportViolation.js
const mongoose = require("mongoose");

const violationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String, // human-readable address
      trim: true,
    },
    lat: {
      type: Number, // latitude for map
    },
    lng: {
      type: Number, // longitude for map
    },
    evidence: {
      type: String, // uploaded filename (not full path)
    },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // ensures every violation is linked to a user
    },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Resolved"],
      default: "Pending",
    },
  },
  { timestamps: true } // replaces manual createdAt
);

// ✅ Cascade cleanup: remove violation reference from user's record on delete
violationSchema.post("findOneAndDelete", async function (doc) {
  if (doc && doc.reportedBy) {
    const User = mongoose.model("User");
    await User.findByIdAndUpdate(doc.reportedBy, {
      $pull: { violations: doc._id },
    });
  }
});

module.exports = mongoose.model("Violation", violationSchema);

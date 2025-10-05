// // models/Issue.js
// const mongoose = require("mongoose");

// const issueSchema = new mongoose.Schema(
//   {
//     title: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     description: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     location: {
//       type: String, // Human-readable address
//       required: false,
//       trim: true,
//     },
//     lat: {
//       type: Number,
//       required: true,
//     },
//     lng: {
//       type: Number,
//       required: true,
//     },
//     urgency: {
//       type: String,
//       enum: ["Low", "Medium", "High"],
//       default: "Medium",
//     },
//     file: {
//       type: String, // filename of uploaded image
//     },
//     status: {
//       type: String,
//       enum: ["Pending", "In Progress", "Resolved", "Reported"],
//       default: "Reported",
//     },
//     reporter: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//   },
//   {
//     timestamps: true, // adds createdAt & updatedAt automatically
//   }
// );

// module.exports = mongoose.model("Issue", issueSchema);















// models/Issue.js
const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema(
  {
    title: {
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
      type: String, // Human-readable address
      trim: true,
    },
    lat: {
      type: Number,
      required: true,
    },
    lng: {
      type: Number,
      required: true,
    },
    urgency: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },
    file: {
      type: String, // Uploaded image filename
    },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Resolved", "Reported"],
      default: "Reported",
    },

    // 🔗 User reference (who reported the issue)
    reporter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // 🕒 Optional: track resolution details (future use)
    resolvedAt: {
      type: Date,
    },
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // could be an admin
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt automatically
  }
);

// ✅ Optional: cascade removal or syncing logic in middleware
// When an issue is deleted, remove it from the user's reportedIssues array
issueSchema.post("findOneAndDelete", async function (doc) {
  if (doc && doc.reporter) {
    const User = mongoose.model("User");
    await User.findByIdAndUpdate(doc.reporter, {
      $pull: { reportedIssues: doc._id },
    });
  }
});

module.exports = mongoose.model("Issue", issueSchema);

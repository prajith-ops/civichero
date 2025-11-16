// 🌿 Load environment variables
const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./db/connection");

// ✅ Import routes
const authRoutes = require("./routes/UserRoutes");
const signupRoute = require("./routes/signupRoute");
const reportRoutes = require("./routes/reportRoutes");
const violationRoutes = require("./routes/violationRoutes");
const adminRoutes = require("./routes/admin");
const driveRoutes = require("./routes/driveRoutes");

// ✅ Connect to MongoDB
connectDB();

const app = express();

// ✅ Core Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Mount all backend API routes
app.use("/api/auth", authRoutes);
app.use("/api/signup", signupRoute);
app.use("/api/issues", reportRoutes);
app.use("/api/violations", violationRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/drives", driveRoutes);

// ---------------------------------------------
// 🚀 Serve Frontend (React/Vite Build)
// ---------------------------------------------
// Make sure frontend build folder is inside backend/dist
const frontendPath = path.join(__dirname, "dist");

// Serve static assets first
app.use(express.static(frontendPath));

// Express v5: Catch-all route (NO "*")
app.use((req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

// ---------------------------------------------

// ✅ Global error handler
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong on the server."
  });
});

// ✅ Start the server
const PORT = process.env.PORT || 4900;
app.listen(PORT, () => {
  console.log(`🚀 Server running at: http://localhost:${PORT}`);
});

/*
--------------------------------------------
✅ Notes:

1. Make sure your .env file has:
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password

2. Admin email route is at:
   POST http://localhost:4900/api/admin/send-email
   Body: { reportId: "<id>", reportType: "issue" | "violation" }

3. Frontend (Admin Dashboard) should call the send-email endpoint
   right after updating a report status to "Resolved".

4. Ensure both Issue and Violation schemas have a field:
   userEmail: { type: String, required: true }

5. Uploaded files can be accessed at:
   http://localhost:4900/uploads/<filename>

--------------------------------------------
*/

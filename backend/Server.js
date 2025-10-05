// 🌿 Load environment variables
const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./db/connection");

// ✅ Import routes
const authRoutes = require("./routes/UserRoutes"); // Login/Logout
const signupRoute = require("./routes/signupRoute"); // Signup with captcha
const reportRoutes = require("./routes/reportRoutes"); // Issue reporting
const violationRoutes = require("./routes/violationRoutes"); // Rule violations
const adminRoutes = require("./routes/admin"); // Admin management
const driveRoutes = require("./routes/driveRoutes"); // Community drives

// ✅ Connect to MongoDB
connectDB();

const app = express();

// ✅ Core Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Serve uploaded files (images, proofs, etc.)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Mount all API routes
app.use("/api/auth", authRoutes); // 🔐 Authentication (login/logout)
app.use("/api/signup", signupRoute); // 🧩 Registration with Captcha
app.use("/api/issues", reportRoutes); // 🧾 Issue reports
app.use("/api/violations", violationRoutes); // ⚖️ Law/Rule violations
app.use("/api/admin", adminRoutes); // 🛠️ Admin management
app.use("/api/drives", driveRoutes); // 🌱 Community drive routes

// ✅ Health check route
app.get("/", (req, res) => {
  res.send("🌍 CivicHero Backend is running successfully!");
});

// ✅ Global error handler
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err.stack);
  res
    .status(500)
    .json({ success: false, message: "Something went wrong on the server." });
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

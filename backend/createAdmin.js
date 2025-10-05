// createAdmin.js
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Admin = require("./model/AdminData"); // <-- change here

// Connect MongoDB
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch((err) => console.error(err));

const createAdmin = async () => {
  const email = "admin@civichero.com";
  const password = "admin123"; // change if you want
  const name = "Admin";

  const existingAdmin = await Admin.findOne({ email }); // <-- change here
  if (existingAdmin) {
    console.log("Admin already exists");
    return process.exit();
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const admin = new Admin({ name, email, password: hashedPassword, role: "admin" });
  await admin.save();
  console.log("Admin created successfully");
  process.exit();
};

createAdmin();

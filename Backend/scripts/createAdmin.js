const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("../models/User");

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const existingAdmin = await User.findOne({
      email: "admin@collegeplacement.com",
    });

    if (existingAdmin) {
      console.log("Admin already exists");
      process.exit();
    }

    const hashedPassword = await bcrypt.hash("Admin@123", 10);

    await User.create({
      name: "TPO Admin",
      email: "admin@collegeplacement.com",
      password: hashedPassword,
      role: "admin",
      phone: "",
    });

    console.log("Admin created successfully");

    process.exit();
  } catch (error) {
    console.error("Error creating admin:", error.message);
    process.exit(1);
  }
};

createAdmin();
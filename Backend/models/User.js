
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    // Password is optional for Google-authenticated users
    password: {
      type: String,
      minlength: 6,
      default: undefined,
    },

    // Google account ID
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },

    role: {
      type: String,
      enum: ["student", "recruiter", "admin"],
      default: "student",
    },

    phone: {
      type: String,
      default: "",
    },

    profileImage: {
      type: String,
      default: "",
    },

    resume: {
      type: String,
      default: "",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);

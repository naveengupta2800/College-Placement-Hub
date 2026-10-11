const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
  {
    recruiter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    companyName: {
      type: String,
      required: true,
      trim: true,
    },

    companyEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    companyPhone: {
      type: String,
      default: "",
    },

    website: {
      type: String,
      default: "",
    },

    description: {
      type: String,
      default: "",
    },

    location: {
      type: String,
      default: "",
    },

    logo: {
      type: String,
      default: "",
    },

    isApproved: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Company", companySchema);
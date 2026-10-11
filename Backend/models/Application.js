const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    drive: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PlacementDrive",
      required: true,
    },

    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },

    resume: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: [
        "Applied",
        "Shortlisted",
        "Rejected",
        "Selected",
      ],
      default: "Applied",
    },

    currentRound: {
      type: String,
      default: "Application",
    },

    appliedAt: {
      type: Date,
      default: Date.now,
    },

    recruiterRemarks: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Same student cannot apply twice for same drive
applicationSchema.index(
  { student: 1, drive: 1 },
  { unique: true }
);

module.exports = mongoose.model(
  "Application",
  applicationSchema
);
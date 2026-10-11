const mongoose = require("mongoose");

const placementDriveSchema = new mongoose.Schema(
  {
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },

    recruiter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    jobTitle: {
      type: String,
      required: true,
      trim: true,
    },

    jobDescription: {
      type: String,
      required: true,
    },

    skillsRequired: {
      type: [String],
      default: [],
    },

    package: {
      type: String,
      required: true,
    },

    openings: {
      type: Number,
      required: true,
      min: 1,
    },

    location: {
      type: String,
      default: "",
    },

    employmentType: {
      type: String,
      enum: [
        "Full Time",
        "Internship",
        "Internship + Full Time",
      ],
      default: "Full Time",
    },

    eligibility: {
      branches: {
        type: [String],
        default: [],
      },

      minimumCGPA: {
        type: Number,
        default: 0,
      },

      minimumTenthPercentage: {
        type: Number,
        default: 0,
      },

      minimumTwelfthPercentage: {
        type: Number,
        default: 0,
      },

      passingYear: {
        type: Number,
        default: null,
      },

      backlogsAllowed: {
        type: Boolean,
        default: false,
      },
    },

    applicationDeadline: {
      type: Date,
      required: true,
    },

    driveDate: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: [
        "pending",
        "approved",
        "rejected",
        "closed",
      ],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "PlacementDrive",
  placementDriveSchema
);
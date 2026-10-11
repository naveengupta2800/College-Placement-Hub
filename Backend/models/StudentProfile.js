const mongoose = require("mongoose");

const studentProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    enrollmentNumber: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },

    college: {
      type: String,
      default: "",
    },

    branch: {
      type: String,
      default: "",
    },

    semester: {
      type: Number,
      default: null,
    },

    passingYear: {
      type: Number,
      default: null,
    },

    cgpa: {
      type: Number,
      default: null,
    },

    tenthPercentage: {
      type: Number,
      default: null,
    },

    twelfthPercentage: {
      type: Number,
      default: null,
    },

    skills: {
      type: [String],
      default: [],
    },

    resume: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "StudentProfile",
  studentProfileSchema
);
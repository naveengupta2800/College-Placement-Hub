const mongoose = require("mongoose");

const placementRoundSchema = new mongoose.Schema(
  {
    drive: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PlacementDrive",
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    date: {
      type: Date,
      required: true,
    },

    mode: {
      type: String,
      enum: ["Online", "Offline"],
      default: "Online",
    },

    location: {
      type: String,
      default: "",
    },

    meetingLink: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["Scheduled", "Completed", "Cancelled"],
      default: "Scheduled",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "PlacementRound",
  placementRoundSchema
);
const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    // Notification kis user ke liye hai
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Notification title
    title: {
      type: String,
      required: true,
      trim: true,
    },

    // Notification message
    message: {
      type: String,
      required: true,
      trim: true,
    },

    // Notification category
    type: {
      type: String,
      enum: [
        "application",
        "shortlisted",
        "rejected",
        "selected",
        "round",
        "announcement",
        "general",
      ],
      default: "general",
    },

    // Read/unread status
    isRead: {
      type: Boolean,
      default: false,
    },

    // Related document ID
    // Example: Application ID / Round ID
    relatedId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Notification",
  notificationSchema
);
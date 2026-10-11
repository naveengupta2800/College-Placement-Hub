const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  getMyNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} = require("../controllers/notificationController");

// Get notifications
router.get(
  "/",
  protect,
  getMyNotifications
);

// Mark one as read
router.put(
  "/:notificationId/read",
  protect,
  markAsRead
);

// Mark all as read
router.put(
  "/read-all",
  protect,
  markAllAsRead
);

// Delete notification
router.delete(
  "/:notificationId",
  protect,
  deleteNotification
);

module.exports = router;
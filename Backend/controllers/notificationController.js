const Notification = require("../models/Notification");

// =====================================
// GET MY NOTIFICATIONS
// =====================================

const getMyNotifications = async (req, res) => {
  try {
    const notifications =
      await Notification.find({
        user: req.user._id,
      })
        .sort({ createdAt: -1 })
        .limit(50);

    const unreadCount =
      await Notification.countDocuments({
        user: req.user._id,
        isRead: false,
      });

    res.status(200).json({
      success: true,
      count: notifications.length,
      unreadCount,
      notifications,
    });
  } catch (error) {
    console.error(
      "Get Notifications Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// =====================================
// MARK ONE NOTIFICATION AS READ
// =====================================

const markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;

    const notification =
      await Notification.findOne({
        _id: notificationId,
        user: req.user._id,
      });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    notification.isRead = true;

    await notification.save();

    res.status(200).json({
      success: true,
      message:
        "Notification marked as read",
      notification,
    });
  } catch (error) {
    console.error(
      "Mark Notification Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// =====================================
// MARK ALL NOTIFICATIONS AS READ
// =====================================

const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      {
        user: req.user._id,
        isRead: false,
      },
      {
        $set: {
          isRead: true,
        },
      }
    );

    res.status(200).json({
      success: true,
      message:
        "All notifications marked as read",
    });
  } catch (error) {
    console.error(
      "Mark All Notifications Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// =====================================
// DELETE NOTIFICATION
// =====================================

const deleteNotification = async (
  req,
  res
) => {
  try {
    const { notificationId } = req.params;

    const notification =
      await Notification.findOneAndDelete({
        _id: notificationId,
        user: req.user._id,
      });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    res.status(200).json({
      success: true,
      message:
        "Notification deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete Notification Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = {
  getMyNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
};
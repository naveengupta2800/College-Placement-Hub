const express = require("express");

const {
  getProfile,
  updateProfile,
  uploadResume: uploadResumeController,
} = require("../controllers/studentController");

const protect = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");

const uploadResume = require("../middleware/uploadMiddleware");

const router = express.Router();

// Get profile
router.get(
  "/profile",
  protect,
  allowRoles("student"),
  getProfile
);

// Create / update profile
router.put(
  "/profile",
  protect,
  allowRoles("student"),
  updateProfile
);

// Upload resume
router.post(
  "/resume",
  protect,
  allowRoles("student"),
  uploadResume.single("resume"),
  uploadResumeController
);

module.exports = router;
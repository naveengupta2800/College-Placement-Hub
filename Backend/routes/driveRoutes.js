const express = require("express");

const {
  createDrive,
  getRecruiterDrives,
  getDriveById,
  getApprovedDrives,
} = require("../controllers/driveController");

const protect = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");

const router = express.Router();


// =====================================
// CREATE DRIVE
// =====================================

router.post(
  "/",
  protect,
  allowRoles("recruiter"),
  createDrive
);


router.get(
  "/recruiter",
  protect,
  allowRoles("recruiter"),
  getRecruiterDrives
);

router.get(
  "/approved",
  protect,
  allowRoles("student"),
  getApprovedDrives
);


// =====================================
// SINGLE DRIVE
// =====================================

router.get(
  "/:id",
  protect,
  getDriveById
);


module.exports = router;
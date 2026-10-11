const express = require("express");

const {
   applyForDrive,
  getMyApplications,
  getDriveApplicants,
  updateApplicationStatus,
  getApplicationById,
  getRecruiterApplicants,
} = require("../controllers/applicationController");

const protect = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");

const router = express.Router();

// =====================================
// STUDENT
// =====================================

// Apply for placement drive
router.post(
  "/apply",
  protect,
  allowRoles("student"),
  applyForDrive
);

// Get logged-in student's applications
router.get(
  "/my",
  protect,
  allowRoles("student"),
  getMyApplications
);

// =====================================
// RECRUITER
// =====================================

// Get applicants of a drive
// IMPORTANT: Keep before /:id
router.get(
  "/recruiter",
  protect,
  allowRoles("recruiter"),
  getRecruiterApplicants
);
router.get(
  "/drive/:driveId",
  protect,
  allowRoles("recruiter"),
  getDriveApplicants
);

// Update applicant status
router.put(
  "/:applicationId/status",
  protect,
  allowRoles("recruiter"),
  updateApplicationStatus
);

// =====================================
// SINGLE APPLICATION
// =====================================

router.get(
  "/:id",
  protect,
  allowRoles(
    "student",
    "recruiter",
    "admin"
  ),
  getApplicationById
);

module.exports = router;
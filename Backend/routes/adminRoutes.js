const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");

const {
  getPendingCompanies,
  updateCompanyApproval,

  getPendingDrives,
  updateDriveApproval,

  getDashboardStats,

  getStudents,
  getStudentById,

  getRecruiters,
  getRecruiterById,

  getApplications,

  createAnnouncement,
} = require("../controllers/adminController");

// =====================================
// ADMIN DASHBOARD
// =====================================

router.get(
  "/dashboard",
  protect,
  allowRoles("admin"),
  getDashboardStats
);

// =====================================
// COMPANIES
// =====================================

// Get pending companies
router.get(
  "/companies/pending",
  protect,
  allowRoles("admin"),
  getPendingCompanies
);

// Approve / Reject company
router.put(
  "/companies/:id/approval",
  protect,
  allowRoles("admin"),
  updateCompanyApproval
);

// =====================================
// PLACEMENT DRIVES
// =====================================

// Get pending drives
router.get(
  "/drives/pending",
  protect,
  allowRoles("admin"),
  getPendingDrives
);

// Approve / Reject drive
router.put(
  "/drives/:id/approval",
  protect,
  allowRoles("admin"),
  updateDriveApproval
);

// =====================================
// STUDENTS
// =====================================

// Get all students
router.get(
  "/students",
  protect,
  allowRoles("admin"),
  getStudents
);

// Get single student
router.get(
  "/students/:id",
  protect,
  allowRoles("admin"),
  getStudentById
);

// =====================================
// RECRUITERS
// =====================================

// Get all recruiters
router.get(
  "/recruiters",
  protect,
  allowRoles("admin"),
  getRecruiters
);

// Get single recruiter
router.get(
  "/recruiters/:id",
  protect,
  allowRoles("admin"),
  getRecruiterById
);

// =====================================
// APPLICATIONS
// =====================================

// Get all applications
router.get(
  "/applications",
  protect,
  allowRoles("admin"),
  getApplications
);

// =====================================
// ANNOUNCEMENTS
// =====================================

// Send announcement
router.post(
  "/announcements",
  protect,
  allowRoles("admin"),
  createAnnouncement
);

// =====================================
// EXPORT
// =====================================

module.exports = router;
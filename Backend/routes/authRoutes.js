const express = require("express");

const {
  register,
  login,
  getMe,
  testEmail,
} = require("../controllers/authController");

const protect = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");

const router = express.Router();

// =====================================
// AUTHENTICATION
// =====================================

// Register
router.post(
  "/register",
  register
);

// Login
router.post(
  "/login",
  login
);

// Current logged-in user
router.get(
  "/me",
  protect,
  getMe
);

// =====================================
// ROLE TEST ROUTES
// =====================================

// Student only
router.get(
  "/student-test",
  protect,
  allowRoles("student"),
  (req, res) => {
    res.status(200).json({
      success: true,
      message: "Welcome Student",
      user: req.user,
    });
  }
);

// Recruiter only
router.get(
  "/recruiter-test",
  protect,
  allowRoles("recruiter"),
  (req, res) => {
    res.status(200).json({
      success: true,
      message: "Welcome Recruiter",
      user: req.user,
    });
  }
);

// Admin only
router.get(
  "/admin-test",
  protect,
  allowRoles("admin"),
  (req, res) => {
    res.status(200).json({
      success: true,
      message: "Welcome Admin",
      user: req.user,
    });
  }
);

// =====================================
// EMAIL TEST
// =====================================

router.get(
  "/test-email",
  protect,
  testEmail
);

module.exports = router;
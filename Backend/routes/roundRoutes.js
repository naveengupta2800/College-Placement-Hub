const express = require("express");

const {
  createRound,
  getDriveRounds,
  getStudentRounds,
  updateRound,
  deleteRound,
  getRecruiterRounds,
} = require("../controllers/roundController");

const protect = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");

const router = express.Router();

// =====================================
// CREATE ROUND
// =====================================

router.post(
  "/drive/:driveId",
  protect,
  allowRoles("recruiter"),
  createRound
);

// =====================================
// GET STUDENT ROUNDS
// IMPORTANT: Keep before /:roundId
// =====================================

router.get(
  "/student",
  protect,
  allowRoles("student"),
  getStudentRounds
);

// =====================================
// GET DRIVE ROUNDS
// =====================================

router.get(
  "/drive/:driveId",
  protect,
  getDriveRounds
);

router.get(
  "/recruiter",
  protect,
  allowRoles("recruiter"),
  getRecruiterRounds
);
// =====================================
// UPDATE ROUND
// =====================================

router.put(
  "/:roundId",
  protect,
  allowRoles("recruiter"),
  updateRound
);

// =====================================
// DELETE ROUND
// =====================================

router.delete(
  "/:roundId",
  protect,
  allowRoles("recruiter"),
  deleteRound
);

module.exports = router;
const express = require("express");

const {
  updateCompany,
  getCompany,
} = require("../controllers/recruiterController");

const protect = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");

const router = express.Router();

router.get(
  "/company",
  protect,
  allowRoles("recruiter"),
  getCompany
);

router.put(
  "/company",
  protect,
  allowRoles("recruiter"),
  updateCompany
);

module.exports = router;
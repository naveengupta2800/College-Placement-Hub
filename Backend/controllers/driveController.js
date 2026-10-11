const PlacementDrive = require("../models/PlacementDrive");
const Company = require("../models/Company");

// =====================================
// CREATE PLACEMENT DRIVE
// =====================================

const createDrive = async (req, res) => {
  try {
    const {
      jobTitle,
      jobDescription,
      skillsRequired,
      package: packageAmount,
      openings,
      location,
      employmentType,
      eligibility,
      applicationDeadline,
      driveDate,
      rounds,
    } = req.body;

    // Check company profile
    const company = await Company.findOne({
      recruiter: req.user._id,
    });

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Please create your company profile first",
      });
    }

    // Check company approval
    if (!company.isApproved) {
      return res.status(403).json({
        success: false,
        message: "Your company is not approved by TPO yet",
      });
    }

    // Required fields
    if (
      !jobTitle ||
      !jobDescription ||
      !packageAmount ||
      !openings ||
      !applicationDeadline ||
      !driveDate
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    const drive = await PlacementDrive.create({
      company: company._id,
      recruiter: req.user._id,

      jobTitle,
      jobDescription,

      skillsRequired: skillsRequired || [],

      package: packageAmount,

      openings,

      location: location || "",

      employmentType:
        employmentType || "Full Time",

      eligibility: eligibility || {},

      applicationDeadline,

      driveDate,

      rounds: rounds || [],

      // New drives require admin approval
      status: "pending",
    });

    res.status(201).json({
      success: true,
      message: "Placement drive created successfully and sent for approval",
      drive,
    });
  } catch (error) {
    console.error("Create Drive Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// =====================================
// GET RECRUITER'S DRIVES
// =====================================

const getRecruiterDrives = async (req, res) => {
  try {
    const drives = await PlacementDrive.find({
      recruiter: req.user._id,
    })
      .populate("company", "companyName logo")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: drives.length,
      drives,
    });
  } catch (error) {
    console.error("Get Recruiter Drives Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// =====================================
// GET SINGLE DRIVE
// =====================================

const getDriveById = async (req, res) => {
  try {
    const drive = await PlacementDrive.findById(
      req.params.id
    ).populate(
      "company",
      "companyName companyEmail website location logo"
    );

    if (!drive) {
      return res.status(404).json({
        success: false,
        message: "Placement drive not found",
      });
    }

    res.status(200).json({
      success: true,
      drive,
    });
  } catch (error) {
    console.error("Get Drive Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
// =====================================
// GET APPROVED DRIVES FOR STUDENTS
// =====================================

const getApprovedDrives = async (req, res) => {
  try {
    const drives = await PlacementDrive.find({
      status: "approved",
      applicationDeadline: {
        $gte: new Date(),
      },
    })
      .populate(
        "company",
        "companyName logo website location"
      )
      .sort({ driveDate: 1 });

    res.status(200).json({
      success: true,
      count: drives.length,
      drives,
    });
  } catch (error) {
    console.error("Get Approved Drives Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
module.exports = {
  createDrive,
  getRecruiterDrives,
  getDriveById,
  getApprovedDrives,
};
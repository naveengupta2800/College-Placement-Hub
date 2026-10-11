const StudentProfile = require("../models/StudentProfile");


// ==========================
// GET STUDENT PROFILE
// ==========================

const getProfile = async (req, res) => {
  try {
    const profile = await StudentProfile.findOne({
      user: req.user._id,
    }).populate("user", "name email phone role");

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Student profile not found",
      });
    }

    res.status(200).json({
      success: true,
      profile,
    });
  } catch (error) {
    console.error("Get Profile Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// ==========================
// CREATE / UPDATE PROFILE
// ==========================

const updateProfile = async (req, res) => {
  try {
    const {
      enrollmentNumber,
      college,
      branch,
      semester,
      passingYear,
      cgpa,
      tenthPercentage,
      twelfthPercentage,
      skills,
    } = req.body;

    const profile = await StudentProfile.findOneAndUpdate(
      { user: req.user._id },
      {
        user: req.user._id,
        enrollmentNumber,
        college,
        branch,
        semester,
        passingYear,
        cgpa,
        tenthPercentage,
        twelfthPercentage,
        skills,
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      profile,
    });
  } catch (error) {
    console.error("Update Profile Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
// ==========================
// UPLOAD RESUME
// ==========================

const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a resume",
      });
    }

    const resumePath = `/uploads/${req.file.filename}`;

    const profile = await StudentProfile.findOneAndUpdate(
      {
        user: req.user._id,
      },
      {
        user: req.user._id,
        resume: resumePath,
      },
      {
        new: true,
        upsert: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Resume uploaded successfully",
      resume: profile.resume,
    });
  } catch (error) {
    console.error("Resume Upload Error:", error);

    res.status(500).json({
      success: false,
      message: "Resume upload failed",
    });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  uploadResume,
};
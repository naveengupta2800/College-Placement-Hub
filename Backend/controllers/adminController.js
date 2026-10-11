const User = require("../models/User");
const Company = require("../models/Company");
const PlacementDrive = require("../models/PlacementDrive");
const Application = require("../models/Application");
const StudentProfile = require("../models/StudentProfile");
const Notification = require("../models/Notification");

// =====================================
// GET PENDING COMPANIES
// =====================================

const getPendingCompanies = async (req, res) => {
  try {
    const companies = await Company.find({
      isApproved: false,
    })
      .populate(
        "recruiter",
        "name email phone"
      )
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: companies.length,
      companies,
    });
  } catch (error) {
    console.error(
      "Get Pending Companies Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// =====================================
// APPROVE / REJECT COMPANY
// =====================================

const updateCompanyApproval = async (
  req,
  res
) => {
  try {
    const { status } = req.body;

    if (
      !["approved", "rejected"].includes(status)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid approval status",
      });
    }

    const company =
      await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    company.isApproved =
      status === "approved";

    await company.save();

    res.status(200).json({
      success: true,
      message:
        status === "approved"
          ? "Company approved successfully"
          : "Company rejected successfully",
      company,
    });
  } catch (error) {
    console.error(
      "Company Approval Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// =====================================
// GET PENDING DRIVES
// =====================================

const getPendingDrives = async (
  req,
  res
) => {
  try {
    const drives =
      await PlacementDrive.find({
        status: "pending",
      })
        .populate(
          "company",
          "companyName companyEmail website location"
        )
        .populate(
          "recruiter",
          "name email"
        )
        .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: drives.length,
      drives,
    });
  } catch (error) {
    console.error(
      "Get Pending Drives Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// =====================================
// APPROVE / REJECT DRIVE
// =====================================

const updateDriveApproval = async (
  req,
  res
) => {
  try {
    const { status } = req.body;

    if (
      !["approved", "rejected"].includes(status)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid approval status",
      });
    }

    const drive =
      await PlacementDrive.findById(
        req.params.id
      );

    if (!drive) {
      return res.status(404).json({
        success: false,
        message:
          "Placement drive not found",
      });
    }

    drive.status = status;

    await drive.save();

    res.status(200).json({
      success: true,
      message:
        status === "approved"
          ? "Placement drive approved successfully"
          : "Placement drive rejected successfully",
      drive,
    });
  } catch (error) {
    console.error(
      "Drive Approval Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// =====================================
// GET ALL STUDENTS
// =====================================

const getStudents = async (req, res) => {
  try {
    const students = await User.find({
      role: "student",
    })
      .select("-password")
      .sort({ createdAt: -1 })
      .lean();

    const studentIds = students.map(
      (student) => student._id
    );

    const profiles =
      await StudentProfile.find({
        user: {
          $in: studentIds,
        },
      }).lean();

    const profileMap = {};

    profiles.forEach((profile) => {
      profileMap[
        profile.user.toString()
      ] = profile;
    });

    const studentsWithProfiles =
      students.map((student) => ({
        ...student,

        profile:
          profileMap[
            student._id.toString()
          ] || null,
      }));

    res.status(200).json({
      success: true,
      count: studentsWithProfiles.length,
      students: studentsWithProfiles,
    });
  } catch (error) {
    console.error(
      "Get Students Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// =====================================
// GET SINGLE STUDENT
// =====================================

const getStudentById = async (req, res) => {
  try {
    const student = await User.findOne({
      _id: req.params.id,
      role: "student",
    })
      .select("-password")
      .lean();

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    const profile =
      await StudentProfile.findOne({
        user: student._id,
      }).lean();

    res.status(200).json({
      success: true,
      student: {
        ...student,
        profile: profile || null,
      },
    });
  } catch (error) {
    console.error(
      "Get Student By ID Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// =====================================
// GET ALL RECRUITERS
// =====================================

const getRecruiters = async (req, res) => {
  try {
    const recruiters = await User.find({
      role: "recruiter",
    })
      .select("-password")
      .sort({ createdAt: -1 })
      .lean();

    const recruiterIds = recruiters.map(
      (recruiter) => recruiter._id
    );

    const companies = await Company.find({
      recruiter: {
        $in: recruiterIds,
      },
    }).lean();

    const companyMap = {};

    companies.forEach((company) => {
      companyMap[
        company.recruiter.toString()
      ] = company;
    });

    const recruitersWithCompanies =
      recruiters.map((recruiter) => ({
        ...recruiter,

        company:
          companyMap[
            recruiter._id.toString()
          ] || null,
      }));

    res.status(200).json({
      success: true,
      count: recruitersWithCompanies.length,
      recruiters: recruitersWithCompanies,
    });
  } catch (error) {
    console.error(
      "Get Recruiters Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// =====================================
// GET SINGLE RECRUITER
// =====================================

const getRecruiterById = async (
  req,
  res
) => {
  try {
    const recruiter = await User.findOne({
      _id: req.params.id,
      role: "recruiter",
    })
      .select("-password")
      .lean();

    if (!recruiter) {
      return res.status(404).json({
        success: false,
        message: "Recruiter not found",
      });
    }

    const company = await Company.findOne({
      recruiter: recruiter._id,
    }).lean();

    const drives =
      await PlacementDrive.find({
        recruiter: recruiter._id,
      })
        .populate(
          "company",
          "companyName"
        )
        .sort({ createdAt: -1 })
        .lean();

    res.status(200).json({
      success: true,

      recruiter: {
        ...recruiter,
        company: company || null,
        drives,
      },
    });
  } catch (error) {
    console.error(
      "Get Recruiter By ID Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// =====================================
// GET ALL APPLICATIONS
// =====================================

const getApplications = async (
  req,
  res
) => {
  try {
    const applications =
      await Application.find()
        .populate(
          "student",
          "name email phone"
        )
        .populate(
          "company",
          "companyName companyEmail"
        )
        .populate(
          "drive",
          "jobTitle package location"
        )
        .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    console.error(
      "Get Applications Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// =====================================
// CREATE ANNOUNCEMENT
// =====================================

const createAnnouncement = async (
  req,
  res
) => {
  try {
    const {
      title,
      message,
      audience,
    } = req.body;

    if (
      !title ||
      !title.trim() ||
      !message ||
      !message.trim()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Title and message are required",
      });
    }

    const allowedAudience = [
      "all",
      "student",
      "recruiter",
    ];

    if (
      !allowedAudience.includes(audience)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid audience",
      });
    }

    let userQuery = {};

    if (audience === "student") {
      userQuery.role = "student";
    }

    if (audience === "recruiter") {
      userQuery.role = "recruiter";
    }

    const users = await User.find(
      userQuery
    ).select("_id");

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No users found",
      });
    }

    const notifications = users.map(
      (user) => ({
        user: user._id,

        title: title.trim(),

        message: message.trim(),

        type: "announcement",

        isRead: false,
      })
    );

    await Notification.insertMany(
      notifications
    );

    res.status(201).json({
      success: true,
      message:
        "Announcement sent successfully",
      count: notifications.length,
    });
  } catch (error) {
    console.error(
      "Create Announcement Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// =====================================
// ADMIN DASHBOARD STATISTICS
// =====================================

const getDashboardStats = async (
  req,
  res
) => {
  try {
    // =====================================
    // USER STATISTICS
    // =====================================

    const totalStudents =
      await User.countDocuments({
        role: "student",
      });

    const totalRecruiters =
      await User.countDocuments({
        role: "recruiter",
      });

    const totalAdmins =
      await User.countDocuments({
        role: "admin",
      });

    // =====================================
    // COMPANY STATISTICS
    // =====================================

    const totalCompanies =
      await Company.countDocuments();

    const approvedCompanies =
      await Company.countDocuments({
        isApproved: true,
      });

    const pendingCompanies =
      await Company.countDocuments({
        isApproved: false,
      });

    // =====================================
    // DRIVE STATISTICS
    // =====================================

    const totalDrives =
      await PlacementDrive.countDocuments();

    const approvedDrives =
      await PlacementDrive.countDocuments({
        status: "approved",
      });

    const pendingDrives =
      await PlacementDrive.countDocuments({
        status: "pending",
      });

    const rejectedDrives =
      await PlacementDrive.countDocuments({
        status: "rejected",
      });

    const closedDrives =
      await PlacementDrive.countDocuments({
        status: "closed",
      });

    // =====================================
    // APPLICATION STATISTICS
    // =====================================

    const totalApplications =
      await Application.countDocuments();

    const appliedApplications =
      await Application.countDocuments({
        status: "Applied",
      });

    const shortlistedApplications =
      await Application.countDocuments({
        status: "Shortlisted",
      });

    const rejectedApplications =
      await Application.countDocuments({
        status: "Rejected",
      });

    const selectedApplications =
      await Application.countDocuments({
        status: "Selected",
      });

    // =====================================
    // PLACEMENT PERCENTAGE
    // =====================================

    let placementPercentage = 0;

    if (totalStudents > 0) {
      placementPercentage = Number(
        (
          (selectedApplications /
            totalStudents) *
          100
        ).toFixed(2)
      );
    }

    // =====================================
    // RECENT APPLICATIONS
    // =====================================

    const recentApplications =
      await Application.find()
        .populate(
          "student",
          "name email"
        )
        .populate(
          "company",
          "companyName"
        )
        .populate(
          "drive",
          "jobTitle"
        )
        .sort({ createdAt: -1 })
        .limit(5);

    // =====================================
    // RECENT DRIVES
    // =====================================

    const recentDrives =
      await PlacementDrive.find()
        .populate(
          "company",
          "companyName"
        )
        .populate(
          "recruiter",
          "name email"
        )
        .sort({ createdAt: -1 })
        .limit(5);

    // =====================================
    // RESPONSE
    // =====================================

    res.status(200).json({
      success: true,

      stats: {
        users: {
          totalStudents,
          totalRecruiters,
          totalAdmins,
        },

        companies: {
          totalCompanies,
          approvedCompanies,
          pendingCompanies,
        },

        drives: {
          totalDrives,
          approvedDrives,
          pendingDrives,
          rejectedDrives,
          closedDrives,
        },

        applications: {
          totalApplications,
          appliedApplications,
          shortlistedApplications,
          rejectedApplications,
          selectedApplications,
        },

        placement: {
          selectedStudents:
            selectedApplications,
          placementPercentage,
        },

        recentApplications,
        recentDrives,
      },
    });
  } catch (error) {
    console.error(
      "Dashboard Stats Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// =====================================
// EXPORT
// =====================================

module.exports = {
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
};
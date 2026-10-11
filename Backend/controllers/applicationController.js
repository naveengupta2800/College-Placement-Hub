const Application = require("../models/Application");
const PlacementDrive = require("../models/PlacementDrive");
const StudentProfile = require("../models/StudentProfile");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");
const Notification = require("../models/Notification");

// =====================================
// APPLY FOR PLACEMENT DRIVE
// =====================================

const applyForDrive = async (req, res) => {
  try {
    const { driveId } = req.body;

    if (!driveId) {
      return res.status(400).json({
        success: false,
        message: "Drive ID is required",
      });
    }

    // =====================================
    // FIND DRIVE
    // =====================================

    const drive = await PlacementDrive.findById(
      driveId
    ).populate("company");

    if (!drive) {
      return res.status(404).json({
        success: false,
        message: "Placement drive not found",
      });
    }

    // =====================================
    // CHECK DRIVE STATUS
    // =====================================

    if (drive.status !== "approved") {
      return res.status(400).json({
        success: false,
        message:
          "This placement drive is not available",
      });
    }

    // =====================================
    // DEADLINE CHECK
    // =====================================

    if (
      drive.applicationDeadline &&
      new Date() >
        new Date(drive.applicationDeadline)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Application deadline has passed",
      });
    }

    // =====================================
    // FIND STUDENT PROFILE
    // =====================================

    const profile =
      await StudentProfile.findOne({
        user: req.user._id,
      });

    if (!profile) {
      return res.status(400).json({
        success: false,
        message:
          "Please complete your student profile first",
      });
    }

    // =====================================
    // RESUME CHECK
    // =====================================

    if (!profile.resume) {
      return res.status(400).json({
        success: false,
        message:
          "Please upload your resume before applying",
      });
    }

    // =====================================
    // ELIGIBILITY CHECK
    // =====================================

    const eligibility =
      drive.eligibility || {};

    // CGPA
    if (
      eligibility.minimumCGPA !== null &&
      eligibility.minimumCGPA !== undefined &&
      profile.cgpa !== null &&
      profile.cgpa !== undefined &&
      profile.cgpa < eligibility.minimumCGPA
    ) {
      return res.status(400).json({
        success: false,
        message:
          "You do not meet the CGPA requirement",
      });
    }

    // 10th Percentage
    if (
      eligibility.minimumTenthPercentage !==
        null &&
      eligibility.minimumTenthPercentage !==
        undefined &&
      profile.tenthPercentage !== null &&
      profile.tenthPercentage !==
        undefined &&
      profile.tenthPercentage <
        eligibility.minimumTenthPercentage
    ) {
      return res.status(400).json({
        success: false,
        message:
          "You do not meet the 10th percentage requirement",
      });
    }

    // 12th Percentage
    if (
      eligibility.minimumTwelfthPercentage !==
        null &&
      eligibility.minimumTwelfthPercentage !==
        undefined &&
      profile.twelfthPercentage !== null &&
      profile.twelfthPercentage !==
        undefined &&
      profile.twelfthPercentage <
        eligibility.minimumTwelfthPercentage
    ) {
      return res.status(400).json({
        success: false,
        message:
          "You do not meet the 12th percentage requirement",
      });
    }

    // Passing Year
    if (
      eligibility.passingYear !== null &&
      eligibility.passingYear !== undefined &&
      profile.passingYear !== null &&
      profile.passingYear !== undefined &&
      profile.passingYear !==
        eligibility.passingYear
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Your passing year does not match the requirement",
      });
    }

    // Branch Eligibility
    if (
      Array.isArray(eligibility.branches) &&
      eligibility.branches.length > 0
    ) {
      const studentBranch =
        profile.branch?.trim().toLowerCase();

      const branchAllowed =
        eligibility.branches.some(
          (branch) =>
            branch
              ?.trim()
              .toLowerCase() === studentBranch
        );

      if (!branchAllowed) {
        return res.status(400).json({
          success: false,
          message:
            "Your branch is not eligible for this drive",
        });
      }
    }

    // =====================================
    // CHECK ALREADY APPLIED
    // =====================================

    const existingApplication =
      await Application.findOne({
        student: req.user._id,
        drive: driveId,
      });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message:
          "You have already applied for this drive",
      });
    }

    // =====================================
    // CREATE APPLICATION
    // =====================================

    const application =
      await Application.create({
        student: req.user._id,
        drive: drive._id,
        company: drive.company._id,
        resume: profile.resume,
        status: "Applied",
        currentRound: "Application",
      });

    // =====================================
    // CREATE APPLICATION NOTIFICATION
    // =====================================

    try {
      await Notification.create({
        user: req.user._id,
        title: "Application Submitted",
        message: `Your application for ${drive.jobTitle} at ${drive.company.companyName} has been submitted successfully.`,
        type: "application",
        isRead: false,
        relatedId: application._id,
      });

      console.log(
        "Application notification created successfully"
      );
    } catch (notificationError) {
      console.error(
        "Application notification failed:",
        notificationError.message
      );
    }

    // =====================================
    // SEND APPLICATION EMAIL
    // =====================================

    try {
      await sendEmail({
        to: req.user.email,

        subject:
          `Application Submitted - ${drive.jobTitle}`,

        html: `
          <div style="
            font-family: Arial, sans-serif;
            line-height: 1.6;
            max-width: 600px;
            margin: auto;
            padding: 20px;
            border: 1px solid #e5e7eb;
            border-radius: 10px;
          ">

            <h2>
              Application Submitted Successfully
            </h2>

            <p>
              Hello <strong>${req.user.name}</strong>,
            </p>

            <p>
              Your application has been successfully
              submitted for the following placement drive.
            </p>

            <hr />

            <p>
              <strong>Company:</strong>
              ${drive.company.companyName}
            </p>

            <p>
              <strong>Role:</strong>
              ${drive.jobTitle}
            </p>

            <p>
              <strong>Package:</strong>
              ${drive.package || "Not specified"}
            </p>

            <p>
              <strong>Status:</strong>
              Applied
            </p>

            ${
              drive.applicationDeadline
                ? `
                  <p>
                    <strong>Application Deadline:</strong>
                    ${new Date(
                      drive.applicationDeadline
                    ).toLocaleString("en-IN")}
                  </p>
                `
                : ""
            }

            <hr />

            <p>
              You will receive further updates regarding
              your application through email and the
              College Placement portal.
            </p>

            <p>
              Regards,<br />
              <strong>College Placement Cell</strong>
            </p>

          </div>
        `,
      });

      console.log(
        "Application confirmation email sent successfully"
      );
    } catch (emailError) {
      console.error(
        "Application email failed:",
        emailError.message
      );
    }

    // =====================================
    // RESPONSE
    // =====================================

    res.status(201).json({
      success: true,
      message:
        "Successfully applied for placement drive",
      application,
    });
  } catch (error) {
    console.error(
      "Apply Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// =====================================
// GET MY APPLICATIONS
// =====================================

const getMyApplications = async (
  req,
  res
) => {
  try {
    const applications =
      await Application.find({
        student: req.user._id,
      })
        .populate(
          "drive",
          "jobTitle package driveDate applicationDeadline status location"
        )
        .populate(
          "company",
          "companyName logo location"
        )
        .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    console.error(
      "Get My Applications Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// =====================================
// GET SINGLE APPLICATION
// =====================================

const getApplicationById = async (
  req,
  res
) => {
  try {
    const application =
      await Application.findById(
        req.params.id
      )
        .populate(
          "student",
          "name email phone"
        )
        .populate(
          "company",
          "companyName companyEmail location website logo"
        )
        .populate(
          "drive",
          "jobTitle jobDescription package openings location employmentType driveDate applicationDeadline eligibility status"
        );

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    // Student can only access own application
    if (
      req.user.role === "student" &&
      application.student._id.toString() !==
        req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    // Recruiter can only access application
    // belonging to their drive
    if (
      req.user.role === "recruiter"
    ) {
      const drive =
        await PlacementDrive.findOne({
          _id: application.drive._id,
          recruiter: req.user._id,
        });

      if (!drive) {
        return res.status(403).json({
          success: false,
          message: "Access denied",
        });
      }
    }

    res.status(200).json({
      success: true,
      application,
    });
  } catch (error) {
    console.error(
      "Get Application By ID Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// =====================================
// GET APPLICANTS FOR RECRUITER
// =====================================

const getDriveApplicants = async (
  req,
  res
) => {
  try {
    const { driveId } = req.params;

    // =====================================
    // CHECK DRIVE OWNERSHIP
    // =====================================

    const drive =
      await PlacementDrive.findOne({
        _id: driveId,
        recruiter: req.user._id,
      });

    if (!drive) {
      return res.status(404).json({
        success: false,
        message:
          "Drive not found or access denied",
      });
    }

    // =====================================
    // GET APPLICATIONS
    // =====================================

    const applications =
      await Application.find({
        drive: driveId,
      })
        .populate(
          "student",
          "name email phone"
        )
        .populate(
          "company",
          "companyName logo"
        )
        .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    console.error(
      "Get Drive Applicants Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// =====================================
// GET ALL APPLICANTS FOR RECRUITER
// =====================================

const getRecruiterApplicants = async (req, res) => {
  try {
    // Recruiter ki saari drives find karo
    const drives = await PlacementDrive.find({
      recruiter: req.user._id,
    }).select("_id jobTitle package location driveDate");

    const driveIds = drives.map((drive) => drive._id);

    // Agar recruiter ki koi drive nahi hai
    if (driveIds.length === 0) {
      return res.status(200).json({
        success: true,
        count: 0,
        applications: [],
      });
    }

    // In drives ke saare applicants
    const applications = await Application.find({
      drive: { $in: driveIds },
    })
      .populate("student", "name email phone")
      .populate(
        "company",
        "companyName companyEmail location website logo"
      )
      .populate(
        "drive",
        "jobTitle jobDescription package openings location employmentType driveDate applicationDeadline eligibility status"
      )
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    console.error("Get Recruiter Applicants Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
// =====================================
// UPDATE APPLICATION STATUS
// =====================================

const updateApplicationStatus = async (
  req,
  res
) => {
  try {
    const { applicationId } =
      req.params;

    const {
      status,
      currentRound,
      recruiterRemarks,
    } = req.body;

    // =====================================
    // FIND APPLICATION
    // =====================================

    const application =
      await Application.findById(
        applicationId
      ).populate("drive");

    if (!application) {
      return res.status(404).json({
        success: false,
        message:
          "Application not found",
      });
    }

    // =====================================
    // CHECK RECRUITER OWNERSHIP
    // =====================================

    if (
      req.user.role === "recruiter" &&
      application.drive.recruiter.toString() !==
        req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    // =====================================
    // ALLOWED STATUS
    // =====================================

    const allowedStatuses = [
      "Applied",
      "Shortlisted",
      "Rejected",
      "Selected",
    ];

    if (
      status &&
      !allowedStatuses.includes(status)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid application status",
      });
    }

    // =====================================
    // UPDATE APPLICATION
    // =====================================

    if (status) {
      application.status = status;
    }

    if (currentRound) {
      application.currentRound =
        currentRound;
    }

    if (
      recruiterRemarks !== undefined
    ) {
      application.recruiterRemarks =
        recruiterRemarks;
    }

    await application.save();

    // =====================================
    // GET STUDENT
    // =====================================

    const student =
      await User.findById(
        application.student
      );

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // =====================================
    // CREATE STATUS NOTIFICATION
    // =====================================

    if (status) {
      let notificationTitle = "";
      let notificationMessage = "";
      let notificationType = "general";

      // SHORTLISTED
      if (status === "Shortlisted") {
        notificationTitle =
          "Application Shortlisted";

        notificationMessage =
          `Congratulations! You have been shortlisted for ${application.drive.jobTitle}.`;

        notificationType =
          "shortlisted";
      }

      // REJECTED
      if (status === "Rejected") {
        notificationTitle =
          "Application Rejected";

        notificationMessage =
          `Your application for ${application.drive.jobTitle} has been rejected.`;

        notificationType =
          "rejected";
      }

      // SELECTED
      if (status === "Selected") {
        notificationTitle =
          "Congratulations! You Are Selected";

        notificationMessage =
          `You have been selected for ${application.drive.jobTitle}.`;

        notificationType =
          "selected";
      }

      // SAVE NOTIFICATION
      if (notificationTitle) {
        try {
          await Notification.create({
            user: student._id,
            title: notificationTitle,
            message: notificationMessage,
            type: notificationType,
            isRead: false,
            relatedId:
              application._id,
          });

          console.log(
            `Status notification created for ${student.email}`
          );
        } catch (
          notificationError
        ) {
          console.error(
            "Status notification failed:",
            notificationError.message
          );
        }
      }
    }

    // =====================================
    // SEND STATUS EMAIL
    // =====================================

    if (status) {
      try {
        let subject = "";
        let heading = "";
        let message = "";

        // SHORTLISTED
        if (
          status === "Shortlisted"
        ) {
          subject =
            `You Have Been Shortlisted - ${application.drive.jobTitle}`;

          heading =
            "Congratulations! You Have Been Shortlisted";

          message =
            "You have been shortlisted for the next stage of the placement process.";
        }

        // REJECTED
        if (
          status === "Rejected"
        ) {
          subject =
            `Application Update - ${application.drive.jobTitle}`;

          heading =
            "Application Status Update";

          message =
            "Thank you for your interest. Unfortunately, your application was not selected for the next stage.";
        }

        // SELECTED
        if (
          status === "Selected"
        ) {
          subject =
            `Congratulations! You Have Been Selected - ${application.drive.jobTitle}`;

          heading =
            "Congratulations! You Have Been Selected";

          message =
            "We are pleased to inform you that you have been selected for this placement opportunity.";
        }

        // SEND EMAIL
        if (subject) {
          await sendEmail({
            to: student.email,

            subject,

            html: `
              <div style="
                font-family: Arial, sans-serif;
                line-height: 1.6;
                max-width: 600px;
                margin: auto;
                padding: 20px;
                border: 1px solid #e5e7eb;
                border-radius: 10px;
              ">

                <h2>
                  ${heading}
                </h2>

                <p>
                  Hello <strong>${student.name}</strong>,
                </p>

                <p>
                  ${message}
                </p>

                <hr />

                <p>
                  <strong>Role:</strong>
                  ${application.drive.jobTitle}
                </p>

                <p>
                  <strong>Status:</strong>
                  ${status}
                </p>

                ${
                  currentRound
                    ? `
                      <p>
                        <strong>Current Round:</strong>
                        ${currentRound}
                      </p>
                    `
                    : ""
                }

                ${
                  recruiterRemarks
                    ? `
                      <p>
                        <strong>Recruiter Remarks:</strong>
                        ${recruiterRemarks}
                      </p>
                    `
                    : ""
                }

                <hr />

                <p>
                  Please keep checking your email and
                  College Placement portal for further
                  placement updates.
                </p>

                <p>
                  Regards,<br />
                  <strong>College Placement Cell</strong>
                </p>

              </div>
            `,
          });

          console.log(
            `Status email sent to ${student.email}`
          );
        }
      } catch (emailError) {
        console.error(
          "Status email failed:",
          emailError.message
        );
      }
    }

    // =====================================
    // RESPONSE
    // =====================================

    res.status(200).json({
      success: true,
      message:
        "Application updated successfully",
      application,
    });
  } catch (error) {
    console.error(
      "Update Application Error:",
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
  applyForDrive,
  getMyApplications,
  getApplicationById,
  getDriveApplicants,
  getRecruiterApplicants,
  updateApplicationStatus,
};
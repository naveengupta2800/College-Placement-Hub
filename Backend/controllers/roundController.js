const PlacementRound = require("../models/PlacementRound");
const PlacementDrive = require("../models/PlacementDrive");
const Application = require("../models/Application");
const User = require("../models/User");
const Notification = require("../models/Notification");
const sendEmail = require("../utils/sendEmail");

// =====================================
// CREATE PLACEMENT ROUND
// =====================================

const createRound = async (req, res) => {
  try {
    const { driveId } = req.params;

    const {
      name,
      description,
      date,
      mode,
      location,
      meetingLink,
      status,
    } = req.body;

    // =====================================
    // CHECK DRIVE
    // =====================================

    const drive = await PlacementDrive.findOne({
      _id: driveId,
      recruiter: req.user._id,
    }).populate("company");

    if (!drive) {
      return res.status(404).json({
        success: false,
        message:
          "Drive not found or access denied",
      });
    }

    // =====================================
    // REQUIRED FIELDS
    // =====================================

    if (!name || !date) {
      return res.status(400).json({
        success: false,
        message:
          "Round name and date are required",
      });
    }

    // =====================================
    // CREATE ROUND
    // =====================================

    const round = await PlacementRound.create({
      drive: driveId,
      name,
      description: description || "",
      date,
      mode: mode || "Online",
      location: location || "",
      meetingLink: meetingLink || "",
      status: status || "Scheduled",
    });

    // =====================================
    // FIND SHORTLISTED STUDENTS
    // =====================================

    const applications = await Application.find({
      drive: driveId,
      status: "Shortlisted",
    });

    console.log(
      `Shortlisted students found: ${applications.length}`
    );

    // =====================================
    // EMAIL + NOTIFICATION
    // =====================================

    for (const application of applications) {
      try {
        const student = await User.findById(
          application.student
        );

        if (!student) {
          continue;
        }

        // =====================================
        // CREATE IN-APP NOTIFICATION
        // =====================================

        await Notification.create({
          user: student._id,

          title: "New Placement Round Scheduled",

          message:
            `${round.name} for ${drive.jobTitle} has been scheduled on ${new Date(
              round.date
            ).toLocaleString("en-IN")}.`,

          type: "round",

          relatedId: round._id,
        });

        console.log(
          `Notification created for ${student.email}`
        );

        // =====================================
        // SEND EMAIL
        // =====================================

        try {
          await sendEmail({
            to: student.email,

            subject:
              `Placement Round Scheduled - ${drive.jobTitle}`,

            html: `
              <div style="
                font-family: Arial, sans-serif;
                line-height: 1.6;
                max-width: 650px;
                margin: auto;
                padding: 20px;
              ">

                <h2>
                  Placement Round Scheduled
                </h2>

                <p>
                  Hello <strong>${student.name}</strong>,
                </p>

                <p>
                  A new placement round has been
                  scheduled for you.
                </p>

                <hr />

                <p>
                  <strong>Company:</strong>
                  ${drive.company.companyName}
                </p>

                <p>
                  <strong>Job Role:</strong>
                  ${drive.jobTitle}
                </p>

                <p>
                  <strong>Round:</strong>
                  ${round.name}
                </p>

                ${
                  round.description
                    ? `
                      <p>
                        <strong>Description:</strong>
                        ${round.description}
                      </p>
                    `
                    : ""
                }

                <p>
                  <strong>Date & Time:</strong>
                  ${new Date(
                    round.date
                  ).toLocaleString("en-IN")}
                </p>

                <p>
                  <strong>Mode:</strong>
                  ${round.mode}
                </p>

                ${
                  round.location
                    ? `
                      <p>
                        <strong>Location:</strong>
                        ${round.location}
                      </p>
                    `
                    : ""
                }

                ${
                  round.meetingLink
                    ? `
                      <p>
                        <strong>Meeting Link:</strong>
                        <a
                          href="${round.meetingLink}"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Join Meeting
                        </a>
                      </p>
                    `
                    : ""
                }

                <hr />

                <p>
                  Please be present on time and keep
                  the required documents ready.
                </p>

                <p>
                  Regards,<br />
                  <strong>College Placement Cell</strong>
                </p>

              </div>
            `,
          });

          console.log(
            `Round email sent to ${student.email}`
          );
        } catch (emailError) {
          console.error(
            `Round email failed for ${student.email}:`,
            emailError.message
          );
        }
      } catch (studentError) {
        console.error(
          `Round notification failed for ${application.student}:`,
          studentError.message
        );
      }
    }

    // =====================================
    // RESPONSE
    // =====================================

    res.status(201).json({
      success: true,
      message:
        "Placement round created successfully",
      round,
    });
  } catch (error) {
    console.error(
      "Create Round Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// =====================================
// GET DRIVE ROUNDS
// =====================================

const getDriveRounds = async (req, res) => {
  try {
    const { driveId } = req.params;

    const rounds = await PlacementRound.find({
      drive: driveId,
    }).sort({ date: 1 });

    res.status(200).json({
      success: true,
      count: rounds.length,
      rounds,
    });
  } catch (error) {
    console.error(
      "Get Drive Rounds Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// =====================================
// UPDATE ROUND
// =====================================

const updateRound = async (req, res) => {
  try {
    const { roundId } = req.params;

    const round =
      await PlacementRound.findById(
        roundId
      );

    if (!round) {
      return res.status(404).json({
        success: false,
        message: "Round not found",
      });
    }

    // =====================================
    // CHECK DRIVE OWNERSHIP
    // =====================================

    const drive =
      await PlacementDrive.findOne({
        _id: round.drive,
        recruiter: req.user._id,
      }).populate("company");

    if (!drive) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    // =====================================
    // UPDATE FIELDS
    // =====================================

    const {
      name,
      description,
      date,
      mode,
      location,
      meetingLink,
      status,
    } = req.body;

    if (name !== undefined) {
      round.name = name;
    }

    if (description !== undefined) {
      round.description = description;
    }

    if (date !== undefined) {
      round.date = date;
    }

    if (mode !== undefined) {
      round.mode = mode;
    }

    if (location !== undefined) {
      round.location = location;
    }

    if (meetingLink !== undefined) {
      round.meetingLink = meetingLink;
    }

    if (status !== undefined) {
      round.status = status;
    }

    await round.save();

    // =====================================
    // RESPONSE
    // =====================================

    res.status(200).json({
      success: true,
      message:
        "Round updated successfully",
      round,
    });
  } catch (error) {
    console.error(
      "Update Round Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// =====================================
// DELETE ROUND
// =====================================

const deleteRound = async (req, res) => {
  try {
    const { roundId } = req.params;

    const round =
      await PlacementRound.findById(
        roundId
      );

    if (!round) {
      return res.status(404).json({
        success: false,
        message: "Round not found",
      });
    }

    // =====================================
    // CHECK DRIVE OWNERSHIP
    // =====================================

    const drive =
      await PlacementDrive.findOne({
        _id: round.drive,
        recruiter: req.user._id,
      });

    if (!drive) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    // =====================================
    // DELETE ROUND
    // =====================================

    await PlacementRound.findByIdAndDelete(
      roundId
    );

    res.status(200).json({
      success: true,
      message:
        "Round deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete Round Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
// =====================================
// GET STUDENT ROUNDS
// =====================================

const getStudentRounds = async (req, res) => {
  try {
    const applications = await Application.find({
      student: req.user._id,
      status: {
        $in: ["Shortlisted", "Selected"],
      },
    }).select("drive");

    const driveIds = applications.map(
      (application) => application.drive
    );

    if (driveIds.length === 0) {
      return res.status(200).json({
        success: true,
        count: 0,
        rounds: [],
      });
    }

    const rounds = await PlacementRound.find({
      drive: {
        $in: driveIds,
      },
    })
      .populate(
        "drive",
        "jobTitle package location company"
      )
      .sort({ date: 1 });

    res.status(200).json({
      success: true,
      count: rounds.length,
      rounds,
    });
  } catch (error) {
    console.error(
      "Get Student Rounds Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
const getRecruiterRounds = async (req, res) => {
  try {
    // Recruiter ki saari drives
    const drives = await PlacementDrive.find({
      recruiter: req.user._id,
    }).select("_id");

    const driveIds = drives.map((drive) => drive._id);

    if (driveIds.length === 0) {
      return res.status(200).json({
        success: true,
        count: 0,
        rounds: [],
      });
    }

    // In drives ke saare rounds
    const rounds = await PlacementRound.find({
      drive: { $in: driveIds },
    })
      .populate(
        "drive",
        "jobTitle package location driveDate applicationDeadline"
      )
      .sort({ date: 1 });

    // Company information drive ke through fetch karna
    const populatedRounds = await PlacementRound.populate(
      rounds,
      {
        path: "drive.company",
        select: "companyName companyEmail location logo",
      }
    );

    const formattedRounds = populatedRounds.map((round) => ({
      ...round.toObject(),
      company: round.drive?.company || null,
    }));

    res.status(200).json({
      success: true,
      count: formattedRounds.length,
      rounds: formattedRounds,
    });
  } catch (error) {
    console.error("Get Recruiter Rounds Error:", error);

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
  createRound,
  getDriveRounds,
  getStudentRounds,
  updateRound,
  deleteRound,
  getRecruiterRounds,
};
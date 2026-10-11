const Company = require("../models/Company");

// ==========================
// CREATE / UPDATE COMPANY
// ==========================

const updateCompany = async (req, res) => {
  try {
    const {
      companyName,
      companyEmail,
      companyPhone,
      website,
      description,
      location,
      logo,
    } = req.body;

    const company = await Company.findOneAndUpdate(
      {
        recruiter: req.user._id,
      },
      {
        recruiter: req.user._id,
        companyName,
        companyEmail,
        companyPhone,
        website,
        description,
        location,
        logo,
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Company profile updated successfully",
      company,
    });
  } catch (error) {
    console.error("Company Update Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// ==========================
// GET COMPANY
// ==========================

const getCompany = async (req, res) => {
  try {
    const company = await Company.findOne({
      recruiter: req.user._id,
    });

    if (!company) {
  return res.status(200).json({
    success: true,
    company: null,
    message: "Company profile not created yet",
  });
}

    res.status(200).json({
      success: true,
      company,
    });
  } catch (error) {
    console.error("Get Company Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


module.exports = {
  updateCompany,
  getCompany,
};
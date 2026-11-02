const User = require("../models/User");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");
const sendEmail = require("../utils/sendEmail");
const { OAuth2Client } = require("google-auth-library");

// =====================================
// REGISTER
// =====================================

const register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      phone,
    } = req.body;

    // =====================================
    // VALIDATION
    // =====================================

    if (
      !name ||
      !email ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Name, email and password are required",
      });
    }

    // =====================================
    // CHECK EXISTING USER
    // =====================================

    const existingUser =
      await User.findOne({
        email: email.toLowerCase().trim(),
      });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // =====================================
    // HASH PASSWORD
    // =====================================

    const hashedPassword =
      await bcrypt.hash(
        password,
        10
      );

    // =====================================
    // CREATE USER
    // =====================================

    const user = await User.create({
      name: name.trim(),

      email: email
        .toLowerCase()
        .trim(),

      password: hashedPassword,

      // Public registration can only create
      // student or recruiter accounts.
      role:
        role === "recruiter"
          ? "recruiter"
          : "student",

      phone: phone || "",
    });

    // =====================================
    // GENERATE TOKEN
    // =====================================

    const token = generateToken(
      user._id,
      user.role
    );

    // =====================================
    // RESPONSE
    // =====================================

    res.status(201).json({
      success: true,
      message:
        "Registration successful",

      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
      },
    });
  } catch (error) {
    console.error(
      "Register Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// =====================================
// LOGIN
// =====================================

const login = async (req, res) => {
  try {
    const {
      email,
      password,
    } = req.body;

    // =====================================
    // VALIDATION
    // =====================================

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Email and password are required",
      });
    }

    // =====================================
    // FIND USER
    // =====================================

    const user =
      await User.findOne({
        email: email
          .toLowerCase()
          .trim(),
      });

    if (!user) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password",
      });
    }

    // =====================================
    // CHECK PASSWORD
    // =====================================

    const isPasswordCorrect =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password",
      });
    }

    // =====================================
    // CHECK ACCOUNT STATUS
    // =====================================

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message:
          "Account is inactive",
      });
    }

    // =====================================
    // GENERATE TOKEN
    // =====================================

    const token = generateToken(
      user._id,
      user.role
    );

    // =====================================
    // RESPONSE
    // =====================================

    res.status(200).json({
      success: true,
      message: "Login successful",

      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
      },
    });
  } catch (error) {
    console.error(
      "Login Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// =====================================
// GOOGLE LOGIN
// =====================================

const googleLogin = async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({
        success: false,
        message: "Google credential is required",
      });
    }

    if (!process.env.GOOGLE_CLIENT_ID) {
      return res.status(500).json({
        success: false,
        message: "Google authentication is not configured",
      });
    }

    // Verify Google ID token
    const client = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID
    );

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    const {
      sub: googleId,
      email,
      name,
      picture,
      email_verified,
    } = payload;

    // Verify email
    if (!email || !email_verified || !googleId) {
      return res.status(401).json({
        success: false,
        message: "Google email verification failed",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Find existing user
    let user = await User.findOne({
      email: normalizedEmail,
    });

    if (user) {

      // Check account status
      if (!user.isActive) {
        return res.status(403).json({
          success: false,
          message: "Account is inactive",
        });
      }

      // Prevent linking a different Google account
      if (user.googleId && user.googleId !== googleId) {
        return res.status(409).json({
          success: false,
          message: "Another Google account is linked to this email",
        });
      }

      // Link Google account with existing account
      if (!user.googleId) {
        user.googleId = googleId;
        user.save();
      }

    } else {

      // Create new student account
      user = await User.create({
        name: name || normalizedEmail.split("@")[0],
        email: normalizedEmail,
        googleId,
        password: undefined,
        role: "student",
        profileImage: picture || "",
        isActive: true,
      });

    }

    // Generate existing JWT
    const token = generateToken(
      user._id,
      user.role
    );

    return res.status(200).json({
      success: true,
      message: "Google login successful",

      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        profileImage: user.profileImage,
      },
    });

  } catch (error) {
    console.error("Google Login Error:", error);

    return res.status(401).json({
      success: false,
      message: "Google authentication failed",
    });
  }
};
// =====================================
// GET CURRENT USER
// =====================================

const getMe = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    console.error(
      "Get Me Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// =====================================
// TEST EMAIL
// =====================================

const testEmail = async (
  req,
  res
) => {
  try {
    await sendEmail({
      to: req.user.email,

      subject:
        "College Placement - Test Email",

      html: `
        <div style="
          font-family: Arial, sans-serif;
          max-width: 600px;
          margin: auto;
          padding: 20px;
          line-height: 1.6;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
        ">

          <h2>
            College Placement System
          </h2>

          <p>
            Hello <strong>
              ${req.user.name}
            </strong>,
          </p>

          <p>
            This is a test email from the
            College Placement Management System.
          </p>

          <p>
            Email notification system is
            working successfully.
          </p>

          <hr />

          <p>
            Regards,<br />
            <strong>
              College Placement Cell
            </strong>
          </p>

        </div>
      `,
    });

    res.status(200).json({
      success: true,
      message:
        "Test email sent successfully",
    });
  } catch (error) {
    console.error(
      "Test Email Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to send test email",
    });
  }
};

// =====================================
// EXPORT
// =====================================

module.exports = {
  register,
  login,
  googleLogin,
  getMe,
  testEmail,
};
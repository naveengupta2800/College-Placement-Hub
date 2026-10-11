const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const studentRoutes = require("./routes/studentRoutes");
const recruiterRoutes = require("./routes/recruiterRoutes");
const driveRoutes = require("./routes/driveRoutes");
const adminRoutes = require("./routes/adminRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const roundRoutes = require("./routes/roundRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

app.use("/api/auth", authRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/recruiter", recruiterRoutes);
app.use("/api/drives", driveRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/applications",applicationRoutes);
app.use("/api/rounds", roundRoutes);
app.use("/api/notifications",notificationRoutes
);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "College Placement Backend is running",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
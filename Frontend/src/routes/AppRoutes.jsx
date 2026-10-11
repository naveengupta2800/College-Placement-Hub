import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";
import RoleRoute from "./RoleRoute";

// ================= AUTH =================

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Unauthorized from "../pages/Unauthorized";

// ================= STUDENT =================

import StudentDashboard from "../pages/student/StudentDashboard";
import PlacementDrives from "../pages/student/PlacementDrives";
import DriveDetails from "../pages/student/DriveDetails";
import StudentProfile from "../pages/student/StudentProfile";
import MyApplications from "../pages/student/MyApplications";
import ApplicationDetails from "../pages/student/ApplicationDetails";
import PlacementRounds from "../pages/student/PlacementRounds";
import Notifications from "../pages/student/Notifications";

// ================= RECRUITER =================

import RecruiterDashboard from "../pages/recruiter/RecruiterDashboard";
import CompanyProfile from "../pages/recruiter/CompanyProfile";
import MyDrives from "../pages/recruiter/MyDrives";
import CreateDrive from "../pages/recruiter/CreateDrive";
import EditDrive from "../pages/recruiter/EditDrive";
import DriveApplicants from "../pages/recruiter/DriveApplicants";
import ApplicantDetails from "../pages/recruiter/ApplicantDetails";
import RecruiterApplicants from "../pages/recruiter/RecruiterApplicants";
import RecruiterRounds from "../pages/recruiter/RecruiterRounds";
import ManageRounds from "../pages/recruiter/ManageRounds";
import RecruiterNotifications from "../pages/recruiter/Notifications";

// ================= ADMIN =================

import AdminDashboard from "../pages/admin/AdminDashboard";
import ManageCompanies from "../pages/admin/ManageCompanies";
import ManageDrives from "../pages/admin/ManageDrives";
import ManageStudents from "../pages/admin/ManageStudents";
import StudentDetails from "../pages/admin/StudentDetails";
import ManageRecruiters from "../pages/admin/ManageRecruiters";
import RecruiterDetails from "../pages/admin/RecruiterDetails";
import ManageApplications from "../pages/admin/ManageApplications";
import AdminNotifications from "../pages/admin/AdminNotifications";

// ================= 404 =================

const Placeholder = ({ title }) => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <h1 className="text-2xl font-bold text-gray-800">
        {title}
      </h1>
    </div>
  );
};

// ================= APP ROUTES =================

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* =====================================================
            PUBLIC ROUTES
        ===================================================== */}

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        {/* =====================================================
            PROTECTED ROUTES
        ===================================================== */}

        <Route element={<ProtectedRoute />}>

          {/* =================================================
              STUDENT ROUTES
          ================================================= */}

          <Route
            element={
              <RoleRoute allowedRoles={["student"]} />
            }
          >

            <Route
              path="/student/dashboard"
              element={<StudentDashboard />}
            />

            <Route
              path="/student/drives"
              element={<PlacementDrives />}
            />

            <Route
              path="/student/drives/:id"
              element={<DriveDetails />}
            />

            <Route
              path="/student/profile"
              element={<StudentProfile />}
            />

            <Route
              path="/student/applications"
              element={<MyApplications />}
            />
            
            <Route
              path="/student/applications/:id"
              element={<ApplicationDetails />}
            />

            <Route
              path="/student/rounds"
              element={<PlacementRounds />}
            />

            <Route
              path="/student/notifications"
              element={<Notifications />}
            />

          </Route>

          {/* =================================================
              RECRUITER ROUTES
          ================================================= */}

          <Route
            element={
              <RoleRoute allowedRoles={["recruiter"]} />
            }
          >

            <Route
              path="/recruiter/dashboard"
              element={<RecruiterDashboard />}
            />

            <Route
              path="/recruiter/company"
              element={<CompanyProfile />}
            />

            <Route
              path="/recruiter/drives"
              element={<MyDrives />}
            />

            <Route
              path="/recruiter/drives/create"
              element={<CreateDrive />}
            />
            <Route
               path="/recruiter/applicants"
               element={<RecruiterApplicants />}
                  />
            <Route
              path="/recruiter/drives/:id/edit"
              element={<EditDrive />}
            />

            <Route
              path="/recruiter/drives/:id/applicants"
              element={<DriveApplicants />}
            />

            <Route
              path="/recruiter/applicants/:id"
              element={<ApplicantDetails />}
            />
            <Route
              path="/recruiter/rounds"
              element={<RecruiterRounds />}
            />
            <Route
              path="/recruiter/drives/:id/rounds"
              element={<ManageRounds />}
            />

            <Route
              path="/recruiter/notifications"
              element={<RecruiterNotifications />}
            />

          </Route>

          {/* =================================================
              ADMIN ROUTES
          ================================================= */}

          <Route
            element={
              <RoleRoute allowedRoles={["admin"]} />
            }
          >

            {/* Dashboard */}

            <Route
              path="/admin/dashboard"
              element={<AdminDashboard />}
            />

            {/* Companies */}

            <Route
              path="/admin/companies"
              element={<ManageCompanies />}
            />

            {/* Placement Drives */}

            <Route
              path="/admin/drives"
              element={<ManageDrives />}
            />

            {/* Students */}

            <Route
              path="/admin/students"
              element={<ManageStudents />}
            />

            <Route
              path="/admin/students/:id"
              element={<StudentDetails />}
            />

            {/* Recruiters */}

            <Route
              path="/admin/recruiters"
              element={<ManageRecruiters />}
            />

            <Route
              path="/admin/recruiters/:id"
              element={<RecruiterDetails />}
            />

            {/* Applications */}

            <Route
              path="/admin/applications"
              element={<ManageApplications />}
            />

            {/* Notifications / Announcements */}

            <Route
              path="/admin/notifications"
              element={<AdminNotifications />}
            />

          </Route>

          {/* =================================================
              UNAUTHORIZED
          ================================================= */}

          <Route
            path="/unauthorized"
            element={<Unauthorized />}
          />

        </Route>

        {/* =====================================================
            DEFAULT ROUTE
        ===================================================== */}

        <Route
          path="/"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />

        {/* =====================================================
            404
        ===================================================== */}

        <Route
          path="*"
          element={
            <Placeholder
              title="404 - Page Not Found"
            />
          }
        />

      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
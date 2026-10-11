import { useEffect, useState } from "react";

import {
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  FileText,
  ArrowRight,
  CalendarDays,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

import DashboardLayout from "../../components/layout/DashboardLayout";
import Card from "../../components/common/Card";
import StatCard from "../../components/common/Card";
import Badge from "../../components/common/Badge";
import DriveCard from "../../components/student/DriveCard";
import RoundCard from "../../components/student/RoundCard";

import { useAuth } from "../../context/AuthContext";

import {
  getApprovedDrives,
  getMyApplications,
} from "../../services/studentService";

const StudentDashboard = () => {
  const { user } = useAuth();

  const [drives, setDrives] = useState([]);
  const [applications, setApplications] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================
  // LOAD DASHBOARD DATA
  // =====================================

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const [driveResponse, applicationResponse] =
        await Promise.all([
          getApprovedDrives(),
          getMyApplications(),
        ]);

      if (driveResponse?.success) {
        setDrives(driveResponse.drives || []);
      }

      if (applicationResponse?.success) {
        setApplications(
          applicationResponse.applications || []
        );
      }
    } catch (error) {
      console.error(
        "Student Dashboard Error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to load dashboard data."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  // =====================================
  // STATISTICS
  // =====================================

  const totalApplications = applications.length;

  const shortlistedApplications =
    applications.filter(
      (application) =>
        application.status === "Shortlisted"
    ).length;

  const selectedApplications =
    applications.filter(
      (application) =>
        application.status === "Selected"
    ).length;

  const availableDrives = drives.length;

  const stats = {
    applications: totalApplications,
    shortlisted: shortlistedApplications,
    selected: selectedApplications,
    availableDrives,
  };

  // =====================================
  // RECENT DRIVES
  // =====================================

  const upcomingDrives = drives.slice(0, 4);

  // =====================================
  // RECENT APPLICATIONS
  // =====================================

  const recentApplications =
    [...applications]
      .sort(
        (a, b) =>
          new Date(b.appliedAt || b.createdAt) -
          new Date(a.appliedAt || a.createdAt)
      )
      .slice(0, 5);

  // =====================================
  // LOADING STATE
  // =====================================

  if (loading) {
    return (
      <DashboardLayout
        title="Student Dashboard"
        description="Track your placement journey and opportunities."
      >
        <div className="flex min-h-[500px] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-50">
              <RefreshCw
                size={22}
                className="animate-spin text-blue-600"
              />
            </div>

            <p className="mt-4 text-sm font-medium text-gray-700">
              Loading your dashboard...
            </p>

            <p className="mt-1 text-xs text-gray-500">
              Please wait while we fetch your placement data.
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // =====================================
  // ERROR STATE
  // =====================================

  if (error) {
    return (
      <DashboardLayout
        title="Student Dashboard"
        description="Track your placement journey and opportunities."
      >
        <div className="flex min-h-[500px] items-center justify-center">
          <div className="w-full max-w-md rounded-xl border border-red-200 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
              <AlertCircle
                size={23}
                className="text-red-600"
              />
            </div>

            <h2 className="mt-4 text-lg font-bold text-gray-900">
              Unable to load dashboard
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              {error}
            </p>

            <button
              onClick={loadDashboard}
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              <RefreshCw size={16} />
              Try Again
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Student Dashboard"
      description="Track your placement journey and opportunities."
    >
      <div className="space-y-8">

        {/* =====================================
            WELCOME
        ===================================== */}

        <div className="flex items-end justify-between">
          <div>
            <p className="text-sm font-medium text-blue-600">
              Welcome back 👋
            </p>

            <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-900">
              {user?.name || "Student"}
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Here is what's happening with your
              placement journey.
            </p>
          </div>

          <button
            onClick={() =>
              (window.location.href =
                "/student/drives")
            }
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            <BriefcaseBusiness size={17} />
            Explore Drives
          </button>
        </div>

        {/* =====================================
            STAT CARDS
        ===================================== */}

        <div className="grid grid-cols-4 gap-5">

          <StatCard
            title="Applications"
            value={stats.applications}
            subtitle="Total applications"
            icon={<FileText size={21} />}
            iconBg="bg-blue-50"
            iconColor="text-blue-600"
          />

          <StatCard
            title="Shortlisted"
            value={stats.shortlisted}
            subtitle="Applications shortlisted"
            icon={<Clock3 size={21} />}
            iconBg="bg-amber-50"
            iconColor="text-amber-600"
          />

          <StatCard
            title="Selected"
            value={stats.selected}
            subtitle="Successful applications"
            icon={<CheckCircle2 size={21} />}
            iconBg="bg-emerald-50"
            iconColor="text-emerald-600"
          />

          <StatCard
            title="Available Drives"
            value={stats.availableDrives}
            subtitle="Currently open"
            icon={<BriefcaseBusiness size={21} />}
            iconBg="bg-purple-50"
            iconColor="text-purple-600"
          />

        </div>

        {/* =====================================
            DRIVES + ROUNDS
        ===================================== */}

        <div className="grid grid-cols-[1fr_360px] gap-6">

          {/* PLACEMENT DRIVES */}

          <Card padding="p-0">

            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">

              <div>
                <h2 className="text-base font-bold text-gray-900">
                  Upcoming Placement Drives
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  Opportunities currently available for you.
                </p>
              </div>

              <button
                onClick={() =>
                  (window.location.href =
                    "/student/drives")
                }
                className="flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700"
              >
                View all
                <ArrowRight size={16} />
              </button>

            </div>

            {upcomingDrives.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <BriefcaseBusiness
                  size={30}
                  className="mx-auto text-gray-300"
                />

                <p className="mt-3 text-sm font-semibold text-gray-700">
                  No placement drives available
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  New approved drives will appear here.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {upcomingDrives.map((drive) => (
                  <DriveCard
                    key={drive._id}
                    drive={drive}
                  />
                ))}
              </div>
            )}

          </Card>

          {/* UPCOMING ROUNDS */}

          <Card padding="p-0">

            <div className="border-b border-gray-100 px-6 py-5">

              <div className="flex items-center gap-2">
                <CalendarDays
                  size={18}
                  className="text-blue-600"
                />

                <h2 className="text-base font-bold text-gray-900">
                  Upcoming Rounds
                </h2>
              </div>

              <p className="mt-1 text-xs text-gray-500">
                Your scheduled placement rounds.
              </p>

            </div>

            <div className="px-6 py-10 text-center">

              <CalendarDays
                size={30}
                className="mx-auto text-gray-300"
              />

              <p className="mt-3 text-sm font-semibold text-gray-700">
                No upcoming rounds
              </p>

              <p className="mt-1 text-xs leading-5 text-gray-500">
                Scheduled interview and assessment
                rounds will appear here.
              </p>

            </div>

          </Card>

        </div>

        {/* =====================================
            APPLICATIONS
        ===================================== */}

        <Card>

          <div className="flex items-center justify-between">

            <div>
              <h2 className="text-base font-bold text-gray-900">
                Application Overview
              </h2>

              <p className="mt-1 text-xs text-gray-500">
                Track the current status of your applications.
              </p>
            </div>

            <button
              onClick={() =>
                (window.location.href =
                  "/student/applications")
              }
              className="flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              View applications
              <ArrowRight size={16} />
            </button>

          </div>

          <div className="mt-6 overflow-hidden rounded-lg border border-gray-200">

            {recentApplications.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <FileText
                  size={30}
                  className="mx-auto text-gray-300"
                />

                <p className="mt-3 text-sm font-semibold text-gray-700">
                  No applications yet
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  Apply to an eligible placement drive
                  to see your applications here.
                </p>

                <button
                  onClick={() =>
                    (window.location.href =
                      "/student/drives")
                  }
                  className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700"
                >
                  Explore Drives
                  <ArrowRight size={14} />
                </button>
              </div>
            ) : (
              <table className="w-full text-left">

                <thead className="bg-gray-50">
                  <tr>

                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Company
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Role
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Applied On
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Current Round
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Status
                    </th>

                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100 bg-white">

                  {recentApplications.map(
                    (application) => (
                      <tr
                        key={application._id}
                        className="transition hover:bg-gray-50"
                      >

                        <td className="px-5 py-4">
                          <p className="text-sm font-semibold text-gray-900">
                            {application.company
                              ?.companyName ||
                              "Company"}
                          </p>
                        </td>

                        <td className="px-5 py-4 text-sm text-gray-600">
                          {application.drive
                            ?.jobTitle ||
                            "Job Role"}
                        </td>

                        <td className="px-5 py-4 text-sm text-gray-500">
                          {application.appliedAt
                            ? new Date(
                                application.appliedAt
                              ).toLocaleDateString(
                                "en-IN",
                                {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                }
                              )
                            : "N/A"}
                        </td>

                        <td className="px-5 py-4 text-sm text-gray-600">
                          {application.currentRound ||
                            "Application"}
                        </td>

                        <td className="px-5 py-4">
                          <ApplicationStatus
                            status={
                              application.status
                            }
                          />
                        </td>

                      </tr>
                    )
                  )}

                </tbody>
              </table>
            )}

          </div>

        </Card>

      </div>
    </DashboardLayout>
  );
};

// =====================================
// APPLICATION STATUS BADGE
// =====================================

const ApplicationStatus = ({ status }) => {
  const statusConfig = {
    Applied: {
      variant: "warning",
      label: "Applied",
    },

    Shortlisted: {
      variant: "success",
      label: "Shortlisted",
    },

    Rejected: {
      variant: "danger",
      label: "Rejected",
    },

    Selected: {
      variant: "info",
      label: "Selected",
    },
  };

  const config =
    statusConfig[status] || {
      variant: "default",
      label: status || "Unknown",
    };

  return (
    <Badge variant={config.variant}>
      {config.label}
    </Badge>
  );
};

export default StudentDashboard;
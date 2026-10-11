import { useEffect, useMemo, useState } from "react";
import {
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  Clock3,
  Users,
  Plus,
  ArrowRight,
  CalendarDays,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "../../components/layout/DashboardLayout";
import Card from "../../components/common/Card";
import Badge from "../../components/common/Badge";
import Loader from "../../components/common/Loader";

import {
  getRecruiterCompany,
  getRecruiterDrives,
  getRecruiterApplicants,
} from "../../services/recruiterService";

const RecruiterDashboard = () => {
  const navigate = useNavigate();

  const [company, setCompany] = useState(null);
  const [drives, setDrives] = useState([]);
  const [applicants, setApplicants] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const [companyData, drivesData, applicantsData] =
        await Promise.all([
          getRecruiterCompany(),
          getRecruiterDrives(),
          getRecruiterApplicants(),
        ]);

      if (companyData.success) {
        setCompany(companyData.company || null);
      }

      if (drivesData.success) {
        setDrives(drivesData.drives || []);
      }

      if (applicantsData.success) {
        setApplicants(applicantsData.applications || []);
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load recruiter dashboard"
      );
    } finally {
      setLoading(false);
    }
  };

  const stats = useMemo(() => {
    return {
      totalDrives: drives.length,

      approvedDrives: drives.filter(
        (drive) => drive.status === "approved"
      ).length,

      pendingDrives: drives.filter(
        (drive) => drive.status === "pending"
      ).length,

      applicants: applicants.length,

      selected: applicants.filter(
        (application) =>
          application.status === "Selected"
      ).length,
    };
  }, [drives, applicants]);

  const recentDrives = [...drives]
    .sort(
      (a, b) =>
        new Date(b.createdAt || 0) -
        new Date(a.createdAt || 0)
    )
    .slice(0, 5);

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <DashboardLayout
        title="Recruiter Dashboard"
        description="Manage your campus placement activities"
      >
        <div className="flex min-h-[500px] items-center justify-center">
          <Loader />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Recruiter Dashboard"
      description="Manage your campus placement activities"
    >
      <div className="space-y-6">

        {/* Error */}
        {error && (
          <Card className="border-red-200 bg-red-50">
            <p className="text-sm text-red-600">
              {error}
            </p>

            <button
              onClick={fetchDashboard}
              className="mt-2 text-sm font-semibold text-red-700 underline"
            >
              Try again
            </button>
          </Card>
        )}

        {/* Welcome */}
        <Card className="overflow-hidden p-0">
          <div className="flex items-center justify-between bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-7 text-white">

            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15">
                  <Building2 size={24} />
                </div>

                <div>
                  <p className="text-sm text-blue-100">
                    Welcome back
                  </p>

                  <h1 className="text-xl font-bold">
                    {company?.companyName ||
                      "Your Company"}
                  </h1>
                </div>
              </div>

              <p className="mt-4 max-w-xl text-sm leading-6 text-blue-100">
                Manage your placement drives, review
                applicants and track candidate selections
                from one place.
              </p>
            </div>

            <button
              onClick={() =>
                navigate("/recruiter/drives/create")
              }
              className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-semibold text-blue-700 shadow-sm transition hover:bg-blue-50"
            >
              <Plus size={18} />
              Create Drive
            </button>

          </div>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-5 gap-4">

          <StatCard
            title="Total Drives"
            value={stats.totalDrives}
            icon={<BriefcaseBusiness size={20} />}
            bg="bg-blue-50"
            color="text-blue-600"
          />

          <StatCard
            title="Approved"
            value={stats.approvedDrives}
            icon={<CheckCircle2 size={20} />}
            bg="bg-emerald-50"
            color="text-emerald-600"
          />

          <StatCard
            title="Pending"
            value={stats.pendingDrives}
            icon={<Clock3 size={20} />}
            bg="bg-amber-50"
            color="text-amber-600"
          />

          <StatCard
            title="Applicants"
            value={stats.applicants}
            icon={<Users size={20} />}
            bg="bg-purple-50"
            color="text-purple-600"
          />

          <StatCard
            title="Selected"
            value={stats.selected}
            icon={<CheckCircle2 size={20} />}
            bg="bg-indigo-50"
            color="text-indigo-600"
          />

        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-3 gap-6">

          {/* Recent Drives */}
          <Card className="col-span-2">

            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-gray-900">
                  Recent Placement Drives
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  Your latest placement opportunities
                </p>
              </div>

              <button
                onClick={() =>
                  navigate("/recruiter/drives")
                }
                className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700"
              >
                View all
                <ArrowRight size={15} />
              </button>
            </div>

            <div className="mt-5 divide-y divide-gray-100">

              {recentDrives.length === 0 ? (
                <div className="py-12 text-center">
                  <BriefcaseBusiness
                    size={30}
                    className="mx-auto text-gray-300"
                  />

                  <p className="mt-3 text-sm font-medium text-gray-700">
                    No placement drives yet
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    Create your first placement drive.
                  </p>
                </div>
              ) : (
                recentDrives.map((drive) => (
                  <div
                    key={drive._id}
                    className="flex items-center justify-between py-4"
                  >

                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                        <BriefcaseBusiness size={18} />
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {drive.jobTitle}
                        </p>

                        <div className="mt-1 flex items-center gap-3 text-xs text-gray-500">
                          <span>
                            {drive.location ||
                              "Location not specified"}
                          </span>

                          <span>
                            {drive.openings || 0} openings
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">

                      <div className="text-right">
                        <p className="text-xs text-gray-400">
                          Deadline
                        </p>

                        <p className="mt-1 text-xs font-medium text-gray-700">
                          {formatDate(
                            drive.applicationDeadline
                          )}
                        </p>
                      </div>

                      <DriveStatus status={drive.status} />

                    </div>

                  </div>
                ))
              )}

            </div>
          </Card>

          {/* Quick Actions */}
          <Card>

            <h2 className="font-semibold text-gray-900">
              Quick Actions
            </h2>

            <p className="mt-1 text-xs text-gray-500">
              Manage your recruitment activities
            </p>

            <div className="mt-5 space-y-3">

              <QuickAction
                icon={<Plus size={19} />}
                title="Create Placement Drive"
                description="Post a new opportunity"
                onClick={() =>
                  navigate("/recruiter/drives/create")
                }
              />

              <QuickAction
                icon={<BriefcaseBusiness size={19} />}
                title="Manage Drives"
                description="View and edit your drives"
                onClick={() =>
                  navigate("/recruiter/drives")
                }
              />

              <QuickAction
                icon={<Users size={19} />}
                title="View Applicants"
                description="Review candidate applications"
                onClick={() =>
                  navigate("/recruiter/applicants")
                }
              />

              <QuickAction
                icon={<CalendarDays size={19} />}
                title="Manage Rounds"
                description="Schedule placement rounds"
                onClick={() =>
                  navigate("/recruiter/rounds")
                }
              />

            </div>
          </Card>

        </div>

        {/* Company Status */}
        <Card>

          <div className="flex items-center justify-between">

            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100 text-gray-600">
                <Building2 size={21} />
              </div>

              <div>
                <h2 className="font-semibold text-gray-900">
                  Company Profile
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {company
                    ? "Your company profile is available."
                    : "Complete your company profile to start recruiting."}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">

              <Badge
                variant={
                  company?.isApproved
                    ? "success"
                    : "warning"
                }
              >
                {company?.isApproved
                  ? "Approved"
                  : "Pending Approval"}
              </Badge>

              <button
                onClick={() =>
                  navigate("/recruiter/company")
                }
                className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                Manage Profile
              </button>

            </div>

          </div>

        </Card>

      </div>
    </DashboardLayout>
  );
};

const StatCard = ({
  title,
  value,
  icon,
  bg,
  color,
}) => {
  return (
    <Card className="flex items-center gap-3">
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${bg} ${color}`}
      >
        {icon}
      </div>

      <div className="min-w-0">
        <p className="truncate text-xs font-medium text-gray-500">
          {title}
        </p>

        <p className="mt-1 text-2xl font-bold text-gray-900">
          {value}
        </p>
      </div>
    </Card>
  );
};

const DriveStatus = ({ status }) => {
  const config = {
    approved: {
      label: "Approved",
      variant: "success",
    },
    pending: {
      label: "Pending",
      variant: "warning",
    },
    rejected: {
      label: "Rejected",
      variant: "danger",
    },
    closed: {
      label: "Closed",
      variant: "default",
    },
  };

  const current = config[status] || {
    label: status || "Unknown",
    variant: "default",
  };

  return (
    <Badge variant={current.variant}>
      {current.label}
    </Badge>
  );
};

const QuickAction = ({
  icon,
  title,
  description,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-xl border border-gray-100 p-3 text-left transition hover:border-blue-100 hover:bg-blue-50/50"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-sm font-semibold text-gray-800">
          {title}
        </p>

        <p className="mt-0.5 text-xs text-gray-500">
          {description}
        </p>
      </div>

      <ArrowRight
        size={16}
        className="ml-auto shrink-0 text-gray-300"
      />
    </button>
  );
};

export default RecruiterDashboard;
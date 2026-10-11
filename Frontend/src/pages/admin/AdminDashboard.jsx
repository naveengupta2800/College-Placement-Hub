import { useEffect, useState } from "react";
import {
  Users,
  Building2,
  BriefcaseBusiness,
  FileText,
  UserCheck,
  Clock3,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "../../components/layout/DashboardLayout";
import Card from "../../components/common/Card";
import StatCard from "../../components/common/StatCard";
import Badge from "../../components/common/Badge";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";

import { getAdminDashboard } from "../../services/adminService";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAdminDashboard();

      if (response.success) {
        setData(response);
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to load admin dashboard."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusVariant = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
      case "selected":
        return "success";

      case "pending":
      case "applied":
        return "warning";

      case "rejected":
        return "danger";

      case "shortlisted":
        return "info";

      default:
        return "default";
    }
  };

  if (loading) {
    return (
      <DashboardLayout
        title="Admin Dashboard"
        description="Monitor and manage the placement process"
      >
        <div className="flex min-h-[500px] items-center justify-center">
          <Loader />
        </div>
      </DashboardLayout>
    );
  }

  const stats = data?.stats || {};

  const recentApplications =
    data?.recentApplications || [];

  const recentDrives =
    data?.recentDrives || [];

  return (
    <DashboardLayout
      title="Admin Dashboard"
      description="Monitor and manage the placement process"
    >
      <div className="space-y-6">

        {/* ================= ERROR ================= */}

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* ================= WELCOME ================= */}

        <Card className="overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-700 text-white">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm font-medium text-blue-100">
                Placement Management
              </p>

              <h2 className="mt-2 text-2xl font-bold">
                Welcome to Admin Dashboard
              </h2>

              <p className="mt-2 max-w-xl text-sm leading-6 text-blue-100">
                Manage companies, placement drives,
                students, recruiters and applications
                from a single dashboard.
              </p>

            </div>

            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/10">
              <TrendingUp size={38} />
            </div>

          </div>

        </Card>

        {/* ================= STATS ================= */}

        <div className="grid grid-cols-4 gap-5">

          <StatCard
            title="Total Students"
            value={stats.totalStudents || 0}
            subtitle="Registered students"
            icon={<Users size={22} />}
            iconBg="bg-blue-50"
            iconColor="text-blue-600"
          />

          <StatCard
            title="Recruiters"
            value={stats.totalRecruiters || 0}
            subtitle="Registered recruiters"
            icon={<UserCheck size={22} />}
            iconBg="bg-purple-50"
            iconColor="text-purple-600"
          />

          <StatCard
            title="Companies"
            value={stats.totalCompanies || 0}
            subtitle="Registered companies"
            icon={<Building2 size={22} />}
            iconBg="bg-emerald-50"
            iconColor="text-emerald-600"
          />

          <StatCard
            title="Placement Drives"
            value={stats.totalDrives || 0}
            subtitle="Total drives"
            icon={<BriefcaseBusiness size={22} />}
            iconBg="bg-amber-50"
            iconColor="text-amber-600"
          />

        </div>

        {/* ================= SECOND STATS ================= */}

        <div className="grid grid-cols-4 gap-5">

          <StatCard
            title="Applications"
            value={stats.totalApplications || 0}
            subtitle="Total applications"
            icon={<FileText size={22} />}
            iconBg="bg-cyan-50"
            iconColor="text-cyan-600"
          />

          <StatCard
            title="Pending Companies"
            value={stats.pendingCompanies || 0}
            subtitle="Awaiting approval"
            icon={<Clock3 size={22} />}
            iconBg="bg-orange-50"
            iconColor="text-orange-600"
          />

          <StatCard
            title="Pending Drives"
            value={stats.pendingDrives || 0}
            subtitle="Awaiting approval"
            icon={<Clock3 size={22} />}
            iconBg="bg-yellow-50"
            iconColor="text-yellow-600"
          />

          <StatCard
            title="Placement Rate"
            value={`${stats.placementPercentage || 0}%`}
            subtitle="Students placed"
            icon={<TrendingUp size={22} />}
            iconBg="bg-green-50"
            iconColor="text-green-600"
          />

        </div>

        {/* ================= QUICK ACTIONS ================= */}

        <Card>

          <div className="mb-5">

            <h3 className="text-lg font-semibold text-gray-900">
              Quick Actions
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Manage important placement activities.
            </p>

          </div>

          <div className="grid grid-cols-4 gap-4">

            <button
              onClick={() =>
                navigate("/admin/companies")
              }
              className="group rounded-xl border border-gray-200 p-5 text-left transition hover:border-blue-300 hover:bg-blue-50"
            >
              <Building2
                size={24}
                className="text-blue-600"
              />

              <h4 className="mt-4 font-semibold text-gray-900">
                Manage Companies
              </h4>

              <p className="mt-1 text-xs text-gray-500">
                Approve or reject recruiters.
              </p>

              <ArrowRight
                size={16}
                className="mt-4 text-gray-400 transition group-hover:translate-x-1"
              />
            </button>

            <button
              onClick={() =>
                navigate("/admin/drives")
              }
              className="group rounded-xl border border-gray-200 p-5 text-left transition hover:border-blue-300 hover:bg-blue-50"
            >
              <BriefcaseBusiness
                size={24}
                className="text-purple-600"
              />

              <h4 className="mt-4 font-semibold text-gray-900">
                Manage Drives
              </h4>

              <p className="mt-1 text-xs text-gray-500">
                Review placement drives.
              </p>

              <ArrowRight
                size={16}
                className="mt-4 text-gray-400 transition group-hover:translate-x-1"
              />
            </button>

            <button
              onClick={() =>
                navigate("/admin/students")
              }
              className="group rounded-xl border border-gray-200 p-5 text-left transition hover:border-blue-300 hover:bg-blue-50"
            >
              <Users
                size={24}
                className="text-emerald-600"
              />

              <h4 className="mt-4 font-semibold text-gray-900">
                Manage Students
              </h4>

              <p className="mt-1 text-xs text-gray-500">
                View registered students.
              </p>

              <ArrowRight
                size={16}
                className="mt-4 text-gray-400 transition group-hover:translate-x-1"
              />
            </button>

            <button
              onClick={() =>
                navigate("/admin/applications")
              }
              className="group rounded-xl border border-gray-200 p-5 text-left transition hover:border-blue-300 hover:bg-blue-50"
            >
              <FileText
                size={24}
                className="text-orange-600"
              />

              <h4 className="mt-4 font-semibold text-gray-900">
                Applications
              </h4>

              <p className="mt-1 text-xs text-gray-500">
                Monitor applications.
              </p>

              <ArrowRight
                size={16}
                className="mt-4 text-gray-400 transition group-hover:translate-x-1"
              />
            </button>

          </div>

        </Card>

        {/* ================= RECENT ACTIVITY ================= */}

        <div className="grid grid-cols-2 gap-6">

          {/* Recent Applications */}

          <Card padding="p-0">

            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">

              <div>
                <h3 className="font-semibold text-gray-900">
                  Recent Applications
                </h3>

                <p className="mt-1 text-xs text-gray-500">
                  Latest student applications
                </p>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  navigate("/admin/applications")
                }
              >
                View All
              </Button>

            </div>

            {recentApplications.length === 0 ? (
              <div className="p-6">
                <EmptyState
                  icon={<FileText size={22} />}
                  title="No applications"
                  description="No recent applications found."
                />
              </div>
            ) : (
              <div className="divide-y divide-gray-100">

                {recentApplications
                  .slice(0, 5)
                  .map((application) => (

                    <div
                      key={application._id}
                      className="flex items-center justify-between px-6 py-4"
                    >

                      <div className="min-w-0">

                        <p className="truncate text-sm font-semibold text-gray-900">
                          {application.student?.name ||
                            "Student"}
                        </p>

                        <p className="mt-1 truncate text-xs text-gray-500">
                          {application.drive?.jobTitle ||
                            "Placement Drive"}
                        </p>

                      </div>

                      <div className="flex flex-col items-end gap-2">

                        <Badge
                          variant={getStatusVariant(
                            application.status
                          )}
                        >
                          {application.status}
                        </Badge>

                        <span className="text-[11px] text-gray-400">
                          {formatDate(
                            application.createdAt
                          )}
                        </span>

                      </div>

                    </div>

                  ))}

              </div>
            )}

          </Card>

          {/* Recent Drives */}

          <Card padding="p-0">

            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">

              <div>
                <h3 className="font-semibold text-gray-900">
                  Recent Drives
                </h3>

                <p className="mt-1 text-xs text-gray-500">
                  Latest placement drives
                </p>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  navigate("/admin/drives")
                }
              >
                View All
              </Button>

            </div>

            {recentDrives.length === 0 ? (
              <div className="p-6">
                <EmptyState
                  icon={
                    <BriefcaseBusiness size={22} />
                  }
                  title="No placement drives"
                  description="No recent drives found."
                />
              </div>
            ) : (
              <div className="divide-y divide-gray-100">

                {recentDrives
                  .slice(0, 5)
                  .map((drive) => (

                    <div
                      key={drive._id}
                      className="flex items-center justify-between px-6 py-4"
                    >

                      <div className="min-w-0">

                        <p className="truncate text-sm font-semibold text-gray-900">
                          {drive.jobTitle ||
                            "Placement Drive"}
                        </p>

                        <p className="mt-1 truncate text-xs text-gray-500">
                          {drive.company?.companyName ||
                            "Company"}
                        </p>

                      </div>

                      <div className="flex flex-col items-end gap-2">

                        <Badge
                          variant={getStatusVariant(
                            drive.status
                          )}
                        >
                          {drive.status}
                        </Badge>

                        <span className="text-[11px] text-gray-400">
                          {formatDate(
                            drive.createdAt
                          )}
                        </span>

                      </div>

                    </div>

                  ))}

              </div>
            )}

          </Card>

        </div>

      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
import { useEffect, useMemo, useState } from "react";
import {
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  Search,
  XCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "../../components/layout/DashboardLayout";
import Card from "../../components/common/Card";
import Badge from "../../components/common/Badge";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";

import { getMyApplications } from "../../services/studentService";

const MyApplications = () => {
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getMyApplications();

      if (data.success) {
        setApplications(data.applications || []);
      } else {
        setError(
          data.message || "Unable to load applications"
        );
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load applications"
      );
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case "Selected":
        return "success";

      case "Shortlisted":
        return "info";

      case "Rejected":
        return "danger";

      case "Applied":
        return "warning";

      default:
        return "default";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Selected":
        return <CheckCircle2 size={17} />;

      case "Shortlisted":
        return <Clock3 size={17} />;

      case "Rejected":
        return <XCircle size={17} />;

      default:
        return <FileText size={17} />;
    }
  };

  const filteredApplications = useMemo(() => {
    const query = search.toLowerCase().trim();

    return applications.filter((application) => {
      const company =
        application.company?.companyName?.toLowerCase() || "";

      const role =
        application.drive?.jobTitle?.toLowerCase() || "";

      const matchesSearch =
        !query ||
        company.includes(query) ||
        role.includes(query);

      const matchesFilter =
        filter === "All" ||
        application.status === filter;

      return matchesSearch && matchesFilter;
    });
  }, [applications, search, filter]);

  const stats = useMemo(() => {
    return {
      total: applications.length,

      applied: applications.filter(
        (app) => app.status === "Applied"
      ).length,

      shortlisted: applications.filter(
        (app) => app.status === "Shortlisted"
      ).length,

      selected: applications.filter(
        (app) => app.status === "Selected"
      ).length,
    };
  }, [applications]);

  return (
    <DashboardLayout
      title="My Applications"
      description="Track all your placement applications"
    >
      <div className="space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            My Applications
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Keep track of your placement application progress.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-5">

          <ApplicationStat
            title="Total Applications"
            value={stats.total}
            icon={<FileText size={20} />}
            bg="bg-blue-50"
            color="text-blue-600"
          />

          <ApplicationStat
            title="Applied"
            value={stats.applied}
            icon={<Clock3 size={20} />}
            bg="bg-amber-50"
            color="text-amber-600"
          />

          <ApplicationStat
            title="Shortlisted"
            value={stats.shortlisted}
            icon={<CheckCircle2 size={20} />}
            bg="bg-purple-50"
            color="text-purple-600"
          />

          <ApplicationStat
            title="Selected"
            value={stats.selected}
            icon={<CheckCircle2 size={20} />}
            bg="bg-emerald-50"
            color="text-emerald-600"
          />

        </div>

        {/* Filters */}
        <Card padding="p-4">
          <div className="flex items-center justify-between gap-5">

            <div className="relative w-80">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search company or role..."
                className="h-10 w-full rounded-lg border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div className="flex items-center gap-2">
              {[
                "All",
                "Applied",
                "Shortlisted",
                "Selected",
                "Rejected",
              ].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`rounded-lg px-3.5 py-2 text-sm font-medium transition ${
                    filter === status
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>

          </div>
        </Card>

        {/* Error */}
        {error && (
          <Card className="border-red-200 bg-red-50">
            <p className="text-sm text-red-600">
              {error}
            </p>

            <button
              onClick={fetchApplications}
              className="mt-2 text-sm font-semibold text-red-700 underline"
            >
              Try again
            </button>
          </Card>
        )}

        {/* Loading */}
        {loading ? (
          <div className="flex min-h-[400px] items-center justify-center">
            <Loader />
          </div>
        ) : filteredApplications.length === 0 ? (
          <EmptyState
            icon={<FileText size={28} />}
            title={
              applications.length === 0
                ? "No applications yet"
                : "No matching applications"
            }
            description={
              applications.length === 0
                ? "Apply to an approved placement drive to see your application here."
                : "Try changing your search or status filter."
            }
          />
        ) : (
          <Card padding="p-0">

            {/* Table Header */}
            <div className="grid grid-cols-[2fr_1.5fr_1fr_1fr_1fr_40px] items-center gap-4 border-b border-gray-100 bg-gray-50 px-6 py-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Company
              </p>

              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Role
              </p>

              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Applied On
              </p>

              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Current Round
              </p>

              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Status
              </p>

              <span />
            </div>

            {/* Rows */}
            <div className="divide-y divide-gray-100">
              {filteredApplications.map((application) => (
                <div
                  key={application._id}
                  className="grid grid-cols-[2fr_1.5fr_1fr_1fr_1fr_40px] items-center gap-4 px-6 py-5 transition hover:bg-gray-50"
                >

                  {/* Company */}
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                      <BriefcaseBusiness size={18} />
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-gray-900">
                        {application.company?.companyName ||
                          "Company"}
                      </p>

                      <p className="truncate text-xs text-gray-500">
                        {application.drive?.location ||
                          "Location not specified"}
                      </p>
                    </div>
                  </div>

                  {/* Role */}
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {application.drive?.jobTitle ||
                        "Job Role"}
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      {application.drive?.package ||
                        "Package not specified"}
                    </p>
                  </div>

                  {/* Applied Date */}
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CalendarDays
                      size={15}
                      className="text-gray-400"
                    />

                    {formatDate(application.appliedAt)}
                  </div>

                  {/* Round */}
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      {application.currentRound ||
                        "Application"}
                    </p>
                  </div>

                  {/* Status */}
                  <div>
                    <Badge
                      variant={getStatusVariant(
                        application.status
                      )}
                    >
                      <span className="mr-1.5">
                        {getStatusIcon(
                          application.status
                        )}
                      </span>

                      {application.status}
                    </Badge>
                  </div>

                  {/* Details */}
                  <button
                    onClick={() =>
                      navigate(
                        `/student/applications/${application._id}`
                      )
                    }
                    className="text-gray-400 transition hover:text-blue-600"
                    title="View application"
                  >
                    →
                  </button>

                </div>
              ))}
            </div>
          </Card>
        )}

      </div>
    </DashboardLayout>
  );
};

const ApplicationStat = ({
  title,
  value,
  icon,
  bg,
  color,
}) => {
  return (
    <Card className="flex items-center gap-4">
      <div
        className={`flex h-11 w-11 items-center justify-center rounded-xl ${bg} ${color}`}
      >
        {icon}
      </div>

      <div>
        <p className="text-xs font-medium text-gray-500">
          {title}
        </p>

        <p className="mt-1 text-2xl font-bold text-gray-900">
          {value}
        </p>
      </div>
    </Card>
  );
};

export default MyApplications;
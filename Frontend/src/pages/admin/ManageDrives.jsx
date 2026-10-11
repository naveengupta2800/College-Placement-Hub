import { useEffect, useMemo, useState } from "react";
import {
  BriefcaseBusiness,
  Search,
  CheckCircle2,
  XCircle,
  MapPin,
  CalendarDays,
  Users,
  Building2,
  Clock3,
  GraduationCap,
} from "lucide-react";

import DashboardLayout from "../../components/layout/DashboardLayout";
import Card from "../../components/common/Card";
import Badge from "../../components/common/Badge";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";

import {
  getPendingDrives,
  updateDriveApproval,
} from "../../services/adminService";

const ManageDrives = () => {
  const [drives, setDrives] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState("");

  const fetchDrives = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getPendingDrives();

      if (response.success) {
        setDrives(response.drives || []);
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to load placement drives."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrives();
  }, []);

  const getDriveStatus = (drive) => {
    return drive.status || "Pending";
  };

  const filteredDrives = useMemo(() => {
    return drives.filter((drive) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        drive.jobTitle
          ?.toLowerCase()
          .includes(searchText) ||
        drive.company?.companyName
          ?.toLowerCase()
          .includes(searchText) ||
        drive.location
          ?.toLowerCase()
          .includes(searchText);

      const matchesFilter =
        filter === "All" ||
        drive.status?.toLowerCase() ===
          filter.toLowerCase();

      return matchesSearch && matchesFilter;
    });
  }, [drives, search, filter]);

  const handleApproval = async (driveId, isApproved) => {
    try {
      setActionLoading(driveId);
      setError("");

      const response = await updateDriveApproval(
        driveId,
        { status: isApproved ? "approved" : "rejected", }
      );

      if (response.success) {
        setDrives((prev) =>
          prev.map((drive) =>
            drive._id === driveId
              ? {
                  ...drive,
                  status: isApproved
                    ? "approved"
                    : "rejected",
                }
              : drive
          )
        );
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to update drive status."
      );
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusVariant = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "success";

      case "rejected":
        return "danger";

      case "pending":
        return "warning";

      case "closed":
        return "default";

      default:
        return "info";
    }
  };

  const formatDate = (date) => {
    if (!date) return "Not specified";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  if (loading) {
    return (
      <DashboardLayout
        title="Manage Drives"
        description="Review and manage placement drives"
      >
        <div className="flex min-h-[500px] items-center justify-center">
          <Loader />
        </div>
      </DashboardLayout>
    );
  }

  const pendingCount = drives.filter(
    (drive) =>
      drive.status?.toLowerCase() === "pending"
  ).length;

  const approvedCount = drives.filter(
    (drive) =>
      drive.status?.toLowerCase() === "approved"
  ).length;

  const rejectedCount = drives.filter(
    (drive) =>
      drive.status?.toLowerCase() === "rejected"
  ).length;

  return (
    <DashboardLayout
      title="Manage Placement Drives"
      description="Review and manage recruiter placement drives"
    >
      <div className="space-y-6">

        {/* Header */}

        <div className="flex items-center gap-4">

          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
            <BriefcaseBusiness size={24} />
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Placement Drives
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Review placement opportunities submitted by
              recruiters.
            </p>
          </div>

        </div>

        {/* Error */}

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Stats */}

        <div className="grid grid-cols-4 gap-5">

          <Card>
            <p className="text-sm text-gray-500">
              Total Drives
            </p>

            <h3 className="mt-2 text-2xl font-bold text-gray-900">
              {drives.length}
            </h3>
          </Card>

          <Card>
            <p className="text-sm text-gray-500">
              Pending
            </p>

            <h3 className="mt-2 text-2xl font-bold text-amber-600">
              {pendingCount}
            </h3>
          </Card>

          <Card>
            <p className="text-sm text-gray-500">
              Approved
            </p>

            <h3 className="mt-2 text-2xl font-bold text-emerald-600">
              {approvedCount}
            </h3>
          </Card>

          <Card>
            <p className="text-sm text-gray-500">
              Rejected
            </p>

            <h3 className="mt-2 text-2xl font-bold text-red-600">
              {rejectedCount}
            </h3>
          </Card>

        </div>

        {/* Search + Filter */}

        <Card padding="p-4">

          <div className="flex items-center gap-4">

            <div className="relative flex-1">

              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search role, company or location..."
                className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

            </div>

            <div className="flex gap-2">

              {[
                "All",
                "Pending",
                "Approved",
                "Rejected",
              ].map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setFilter(item)}
                  className={`rounded-lg px-4 py-2.5 text-sm font-medium transition ${
                    filter === item
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {item}
                </button>
              ))}

            </div>

          </div>

        </Card>

        {/* Drives */}

        {filteredDrives.length === 0 ? (
          <EmptyState
            icon={<BriefcaseBusiness size={26} />}
            title="No placement drives found"
            description={
              drives.length === 0
                ? "There are no placement drives available for review."
                : "Try changing your search or filter."
            }
          />
        ) : (
          <div className="grid grid-cols-2 gap-6">

            {filteredDrives.map((drive) => {

              const status = getDriveStatus(drive);

              return (
                <Card
                  key={drive._id}
                  className="transition duration-200 hover:shadow-md"
                >

                  {/* Header */}

                  <div className="flex items-start justify-between">

                    <div className="flex items-start gap-4">

                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                        <BriefcaseBusiness size={22} />
                      </div>

                      <div className="min-w-0">

                        <h3 className="truncate text-lg font-semibold text-gray-900">
                          {drive.jobTitle ||
                            "Placement Drive"}
                        </h3>

                        <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">

                          <Building2 size={14} />

                          <span>
                            {drive.company?.companyName ||
                              "Company"}
                          </span>

                        </div>

                      </div>

                    </div>

                    <Badge
                      variant={getStatusVariant(
                        status
                      )}
                    >
                      {status}
                    </Badge>

                  </div>

                  {/* Basic Details */}

                  <div className="mt-6 grid grid-cols-2 gap-4">

                    <div className="rounded-lg bg-gray-50 p-3">

                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <BriefcaseBusiness size={14} />
                        Package
                      </div>

                      <p className="mt-1 text-sm font-semibold text-gray-800">
                        {drive.package ||
                          "Not specified"}
                      </p>

                    </div>

                    <div className="rounded-lg bg-gray-50 p-3">

                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <Users size={14} />
                        Openings
                      </div>

                      <p className="mt-1 text-sm font-semibold text-gray-800">
                        {drive.openings || 0}
                      </p>

                    </div>

                    <div className="rounded-lg bg-gray-50 p-3">

                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <MapPin size={14} />
                        Location
                      </div>

                      <p className="mt-1 truncate text-sm font-semibold text-gray-800">
                        {drive.location ||
                          "Not specified"}
                      </p>

                    </div>

                    <div className="rounded-lg bg-gray-50 p-3">

                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <CalendarDays size={14} />
                        Drive Date
                      </div>

                      <p className="mt-1 text-sm font-semibold text-gray-800">
                        {formatDate(
                          drive.driveDate
                        )}
                      </p>

                    </div>

                  </div>

                  {/* Employment Type */}

                  <div className="mt-5 flex items-center justify-between">

                    <span className="text-sm text-gray-500">
                      Employment Type
                    </span>

                    <Badge variant="info">
                      {drive.employmentType ||
                        "Full Time"}
                    </Badge>

                  </div>

                  {/* Eligibility */}

                  {drive.eligibility && (
                    <div className="mt-5 rounded-xl border border-gray-100 bg-gray-50 p-4">

                      <div className="mb-3 flex items-center gap-2">

                        <GraduationCap
                          size={17}
                          className="text-blue-600"
                        />

                        <p className="text-sm font-semibold text-gray-800">
                          Eligibility
                        </p>

                      </div>

                      <div className="grid grid-cols-2 gap-3 text-xs text-gray-600">

                        <div>
                          <span className="text-gray-400">
                            Min CGPA
                          </span>

                          <p className="mt-1 font-semibold text-gray-700">
                            {drive.eligibility
                              .minimumCGPA ??
                              "No requirement"}
                          </p>
                        </div>

                        <div>
                          <span className="text-gray-400">
                            Passing Year
                          </span>

                          <p className="mt-1 font-semibold text-gray-700">
                            {drive.eligibility
                              .passingYear ??
                              "No requirement"}
                          </p>
                        </div>

                        <div>
                          <span className="text-gray-400">
                            10th %
                          </span>

                          <p className="mt-1 font-semibold text-gray-700">
                            {drive.eligibility
                              .minimumTenthPercentage ??
                              "No requirement"}
                          </p>
                        </div>

                        <div>
                          <span className="text-gray-400">
                            12th %
                          </span>

                          <p className="mt-1 font-semibold text-gray-700">
                            {drive.eligibility
                              .minimumTwelfthPercentage ??
                              "No requirement"}
                          </p>
                        </div>

                      </div>

                    </div>
                  )}

                  {/* Skills */}

                  {drive.skillsRequired?.length > 0 && (
                    <div className="mt-5">

                      <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-400">
                        Required Skills
                      </p>

                      <div className="flex flex-wrap gap-2">

                        {drive.skillsRequired
                          .slice(0, 6)
                          .map((skill, index) => (
                            <span
                              key={`${skill}-${index}`}
                              className="rounded-md bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700"
                            >
                              {skill}
                            </span>
                          ))}

                        {drive.skillsRequired.length >
                          6 && (
                          <span className="rounded-md bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                            +
                            {drive.skillsRequired.length -
                              6}{" "}
                            more
                          </span>
                        )}

                      </div>

                    </div>
                  )}

                  {/* Deadline */}

                  <div className="mt-5 flex items-center justify-between rounded-lg border border-gray-100 px-4 py-3">

                    <div className="flex items-center gap-2 text-sm text-gray-500">

                      <Clock3 size={16} />

                      Application Deadline

                    </div>

                    <span className="text-sm font-semibold text-gray-800">
                      {formatDate(
                        drive.applicationDeadline
                      )}
                    </span>

                  </div>

                  {/* Description */}

                  {drive.jobDescription && (
                    <div className="mt-5">

                      <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                        Job Description
                      </p>

                      <p className="mt-2 line-clamp-4 text-sm leading-6 text-gray-600">
                        {drive.jobDescription}
                      </p>

                    </div>
                  )}

                  {/* Actions */}

                  <div className="mt-6 flex items-center justify-end gap-3 border-t border-gray-100 pt-5">

                    {status.toLowerCase() !==
                      "approved" && (
                      <Button
                        variant="danger"
                        size="sm"
                        disabled={
                          actionLoading === drive._id
                        }
                        onClick={() =>
                          handleApproval(
                            drive._id,
                            false
                          )
                        }
                      >
                        <XCircle size={16} />
                        Reject
                      </Button>
                    )}

                    {status.toLowerCase() !==
                      "approved" && (
                      <Button
                        variant="success"
                        size="sm"
                        disabled={
                          actionLoading === drive._id
                        }
                        onClick={() =>
                          handleApproval(
                            drive._id,
                            true
                          )
                        }
                      >
                        <CheckCircle2 size={16} />
                        Approve
                      </Button>
                    )}

                    {status.toLowerCase() ===
                      "approved" && (
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={
                          actionLoading === drive._id
                        }
                        onClick={() =>
                          handleApproval(
                            drive._id,
                            false
                          )
                        }
                      >
                        <XCircle size={16} />
                        Revoke Approval
                      </Button>
                    )}

                  </div>

                </Card>
              );
            })}

          </div>
        )}

        {/* Pending Notice */}

        {pendingCount > 0 && (
          <div className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4">

            <Clock3
              size={20}
              className="text-amber-600"
            />

            <div>

              <p className="text-sm font-semibold text-amber-800">
                {pendingCount} drive
                {pendingCount > 1 ? "s" : ""} awaiting
                review
              </p>

              <p className="mt-1 text-xs text-amber-700">
                Review the eligibility, package, openings
                and job details before approval.
              </p>

            </div>

          </div>
        )}

      </div>
    </DashboardLayout>
  );
};

export default ManageDrives;
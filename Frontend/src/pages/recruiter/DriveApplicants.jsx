import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Search,
  Users,
  Eye,
  CheckCircle2,
  XCircle,
  Clock3,
  FileText,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import DashboardLayout from "../../components/layout/DashboardLayout";
import Card from "../../components/common/Card";
import Badge from "../../components/common/Badge";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";

import {
  getDriveApplicants,
  updateApplicationStatus,
} from "../../services/applicationService";

import { getDriveById } from "../../services/driveService";

const DriveApplicants = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [drive, setDrive] = useState(null);
  const [applicants, setApplicants] = useState([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const [driveResponse, applicantsResponse] =
        await Promise.all([
          getDriveById(id),
          getDriveApplicants(id),
        ]);

      if (driveResponse.success) {
        setDrive(driveResponse.drive);
      }

      if (applicantsResponse.success) {
        setApplicants(applicantsResponse.applications || []);
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to load applicants."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const filteredApplicants = useMemo(() => {
    return applicants.filter((application) => {
      const student = application.student;

      const searchText = search.toLowerCase();

      const matchesSearch =
        student?.name?.toLowerCase().includes(searchText) ||
        student?.email?.toLowerCase().includes(searchText);

      const matchesStatus =
        statusFilter === "All" ||
        application.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [applicants, search, statusFilter]);

  const handleStatusChange = async (
    applicationId,
    status
  ) => {
    try {
      setActionLoading(applicationId);
      setError("");

      const response = await updateApplicationStatus(
        applicationId,
        { status }
      );

      if (response.success) {
        setApplicants((prev) =>
          prev.map((application) =>
            application._id === applicationId
              ? {
                  ...application,
                  status,
                }
              : application
          )
        );
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to update application status."
      );
    } finally {
      setActionLoading(null);
    }
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

  const getResumeUrl = (resume) => {
    if (!resume) return "";

    if (resume.startsWith("http")) {
      return resume;
    }

    return `http://localhost:5000${resume}`;
  };

  if (loading) {
    return (
      <DashboardLayout
        title="Drive Applicants"
        description="View and manage applicants"
      >
        <div className="flex min-h-[500px] items-center justify-center">
          <Loader />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Drive Applicants"
      description="Review applicants and manage their application status"
    >
      <div className="space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">

          <div className="flex items-center gap-4">

            <button
              type="button"
              onClick={() =>
                navigate("/recruiter/drives")
              }
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
            >
              <ArrowLeft size={18} />
            </button>

            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {drive?.jobTitle || "Drive Applicants"}
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                {drive?.company?.companyName ||
                  "Placement Drive"}{" "}
                • {applicants.length} applicants
              </p>
            </div>

          </div>

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <Users size={22} />
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
              Total Applicants
            </p>

            <h3 className="mt-2 text-2xl font-bold text-gray-900">
              {applicants.length}
            </h3>
          </Card>

          <Card>
            <p className="text-sm text-gray-500">
              Applied
            </p>

            <h3 className="mt-2 text-2xl font-bold text-amber-600">
              {
                applicants.filter(
                  (a) => a.status === "Applied"
                ).length
              }
            </h3>
          </Card>

          <Card>
            <p className="text-sm text-gray-500">
              Shortlisted
            </p>

            <h3 className="mt-2 text-2xl font-bold text-blue-600">
              {
                applicants.filter(
                  (a) => a.status === "Shortlisted"
                ).length
              }
            </h3>
          </Card>

          <Card>
            <p className="text-sm text-gray-500">
              Selected
            </p>

            <h3 className="mt-2 text-2xl font-bold text-emerald-600">
              {
                applicants.filter(
                  (a) => a.status === "Selected"
                ).length
              }
            </h3>
          </Card>

        </div>

        {/* Filters */}
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
                placeholder="Search applicant by name or email..."
                className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

            </div>

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
              className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="All">
                All Status
              </option>
              <option value="Applied">
                Applied
              </option>
              <option value="Shortlisted">
                Shortlisted
              </option>
              <option value="Rejected">
                Rejected
              </option>
              <option value="Selected">
                Selected
              </option>
            </select>

          </div>
        </Card>

        {/* Applicants */}
        {filteredApplicants.length === 0 ? (
          <EmptyState
            icon={<Users size={26} />}
            title="No applicants found"
            description={
              applicants.length === 0
                ? "No students have applied for this drive yet."
                : "Try changing your search or status filter."
            }
          />
        ) : (
          <Card padding="p-0">

            <div className="overflow-hidden rounded-xl">

              <table className="w-full">

                <thead className="border-b border-gray-200 bg-gray-50">

                  <tr>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Student
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Applied On
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Round
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Resume
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Status
                    </th>

                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Actions
                    </th>

                  </tr>

                </thead>

                <tbody className="divide-y divide-gray-100">

                  {filteredApplicants.map(
                    (application) => {

                      const student =
                        application.student;

                      const isLoading =
                        actionLoading ===
                        application._id;

                      return (
                        <tr
                          key={application._id}
                          className="transition hover:bg-gray-50"
                        >

                          {/* Student */}
                          <td className="px-6 py-5">

                            <div className="flex items-center gap-3">

                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 font-semibold text-blue-600">
                                {student?.name
                                  ?.charAt(0)
                                  ?.toUpperCase() ||
                                  "S"}
                              </div>

                              <div>
                                <p className="font-medium text-gray-900">
                                  {student?.name ||
                                    "Unknown Student"}
                                </p>

                                <p className="mt-0.5 text-xs text-gray-500">
                                  {student?.email ||
                                    "No email"}
                                </p>
                              </div>

                            </div>

                          </td>

                          {/* Applied */}
                          <td className="px-6 py-5">

                            <span className="text-sm text-gray-600">
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
                                : "—"}
                            </span>

                          </td>

                          {/* Round */}
                          <td className="px-6 py-5">

                            <div className="flex items-center gap-2 text-sm text-gray-600">

                              <Clock3
                                size={15}
                                className="text-gray-400"
                              />

                              {application.currentRound ||
                                "Application"}

                            </div>

                          </td>

                          {/* Resume */}
                          <td className="px-6 py-5">

                            {application.resume ? (
                              <a
                                href={getResumeUrl(
                                  application.resume
                                )}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
                              >
                                <FileText size={16} />
                                View Resume
                              </a>
                            ) : (
                              <span className="text-sm text-gray-400">
                                Not uploaded
                              </span>
                            )}

                          </td>

                          {/* Status */}
                          <td className="px-6 py-5">

                            <Badge
                              variant={getStatusVariant(
                                application.status
                              )}
                            >
                              {application.status}
                            </Badge>

                          </td>

                          {/* Actions */}
                          <td className="px-6 py-5">

                            <div className="flex justify-end gap-2">

                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  navigate(
                                    `/recruiter/applicants/${application._id}`
                                  )
                                }
                              >
                                <Eye size={15} />
                                View
                              </Button>

                              {application.status !==
                                "Shortlisted" &&
                                application.status !==
                                  "Selected" && (
                                  <Button
                                    variant="success"
                                    size="sm"
                                    disabled={isLoading}
                                    onClick={() =>
                                      handleStatusChange(
                                        application._id,
                                        "Shortlisted"
                                      )
                                    }
                                  >
                                    <CheckCircle2
                                      size={15}
                                    />
                                    Shortlist
                                  </Button>
                                )}

                              {application.status !==
                                "Rejected" &&
                                application.status !==
                                  "Selected" && (
                                  <Button
                                    variant="danger"
                                    size="sm"
                                    disabled={isLoading}
                                    onClick={() =>
                                      handleStatusChange(
                                        application._id,
                                        "Rejected"
                                      )
                                    }
                                  >
                                    <XCircle size={15} />
                                    Reject
                                  </Button>
                                )}

                              {application.status ===
                                "Shortlisted" && (
                                <Button
                                  variant="success"
                                  size="sm"
                                  disabled={isLoading}
                                  onClick={() =>
                                    handleStatusChange(
                                      application._id,
                                      "Selected"
                                    )
                                  }
                                >
                                  <CheckCircle2
                                    size={15}
                                  />
                                  Select
                                </Button>
                              )}

                            </div>

                          </td>

                        </tr>
                      );
                    }
                  )}

                </tbody>

              </table>

            </div>

          </Card>
        )}

      </div>
    </DashboardLayout>
  );
};

export default DriveApplicants;
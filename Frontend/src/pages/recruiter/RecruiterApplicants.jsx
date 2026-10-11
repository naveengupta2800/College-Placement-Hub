import { useEffect, useMemo, useState } from "react";
import { Search, Users, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "../../components/layout/DashboardLayout";
import Card from "../../components/common/Card";
import Badge from "../../components/common/Badge";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";

import { getRecruiterApplicants } from "../../services/applicationService";

const RecruiterApplicants = () => {
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchApplicants = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getRecruiterApplicants();

      if (response.success) {
        setApplications(response.applications || []);
      } else {
        setError(response.message || "Failed to load applicants");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to load applicants"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, []);

  const filteredApplications = useMemo(() => {
    return applications.filter((application) => {
      const student = application.student;
      const drive = application.drive;

      const searchText = search.toLowerCase();

      const matchesSearch =
        student?.name?.toLowerCase().includes(searchText) ||
        student?.email?.toLowerCase().includes(searchText) ||
        drive?.jobTitle?.toLowerCase().includes(searchText);

      const matchesStatus =
        statusFilter === "All" ||
        application.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [applications, search, statusFilter]);

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

  if (loading) {
    return (
      <DashboardLayout
        title="Applicants"
        description="Manage all applicants"
      >
        <div className="flex min-h-[500px] items-center justify-center">
          <Loader />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Applicants"
      description="View and manage applicants across your placement drives"
    >
      <div className="space-y-6">

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
              {applications.length}
            </h3>
          </Card>

          <Card>
            <p className="text-sm text-gray-500">
              Applied
            </p>

            <h3 className="mt-2 text-2xl font-bold text-amber-600">
              {
                applications.filter(
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
                applications.filter(
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
                applications.filter(
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
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search applicant or job role..."
                className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
              className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none"
            >
              <option value="All">All Status</option>
              <option value="Applied">Applied</option>
              <option value="Shortlisted">
                Shortlisted
              </option>
              <option value="Rejected">Rejected</option>
              <option value="Selected">Selected</option>
            </select>

          </div>
        </Card>

        {/* Applicants */}
        {filteredApplications.length === 0 ? (
          <EmptyState
            icon={<Users size={26} />}
            title="No applicants found"
            description={
              applications.length === 0
                ? "No students have applied for your drives yet."
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
                      Job Role
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Applied On
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Status
                    </th>

                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Action
                    </th>

                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">

                  {filteredApplications.map((application) => {
                    const student = application.student;
                    const drive = application.drive;

                    return (
                      <tr
                        key={application._id}
                        className="transition hover:bg-gray-50"
                      >

                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">

                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 font-semibold text-blue-600">
                              {student?.name
                                ?.charAt(0)
                                ?.toUpperCase() || "S"}
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

                        <td className="px-6 py-5">
                          <p className="text-sm font-medium text-gray-800">
                            {drive?.jobTitle ||
                              "Unknown Role"}
                          </p>

                          <p className="mt-1 text-xs text-gray-500">
                            {drive?.package || ""}
                          </p>
                        </td>

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

                        <td className="px-6 py-5">
                          <Badge
                            variant={getStatusVariant(
                              application.status
                            )}
                          >
                            {application.status}
                          </Badge>
                        </td>

                        <td className="px-6 py-5">
                          <div className="flex justify-end">

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

                          </div>
                        </td>

                      </tr>
                    );
                  })}

                </tbody>

              </table>
            </div>
          </Card>
        )}

      </div>
    </DashboardLayout>
  );
};

export default RecruiterApplicants;
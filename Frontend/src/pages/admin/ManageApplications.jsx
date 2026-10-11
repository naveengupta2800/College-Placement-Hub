import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "../../components/layout/DashboardLayout";

import { getAdminApplications } from "../../services/adminService";

const ManageApplications = () => {
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // =====================================================
  // FETCH APPLICATIONS
  // =====================================================

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAdminApplications();

      if (data.success) {
        setApplications(data.applications || []);
      } else {
        setError(
          data.message || "Failed to load applications"
        );
      }
    } catch (error) {
      console.error(
        "Fetch Applications Error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to load applications"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  // =====================================================
  // FILTER APPLICATIONS
  // =====================================================

  const filteredApplications = useMemo(() => {
    return applications.filter((application) => {
      const studentName =
        application.student?.name || "";

      const studentEmail =
        application.student?.email || "";

      const companyName =
        application.company?.companyName || "";

      const jobTitle =
        application.drive?.jobTitle || "";

      const searchValue = search
        .toLowerCase()
        .trim();

      const matchesSearch =
        studentName
          .toLowerCase()
          .includes(searchValue) ||
        studentEmail
          .toLowerCase()
          .includes(searchValue) ||
        companyName
          .toLowerCase()
          .includes(searchValue) ||
        jobTitle
          .toLowerCase()
          .includes(searchValue);

      const matchesStatus =
        statusFilter === "All" ||
        application.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [
    applications,
    search,
    statusFilter,
  ]);

  // =====================================================
  // STATUS STYLE
  // =====================================================

  const getStatusStyle = (status) => {
    switch (status) {
      case "Applied":
        return "bg-blue-100 text-blue-700";

      case "Shortlisted":
        return "bg-yellow-100 text-yellow-700";

      case "Selected":
        return "bg-green-100 text-green-700";

      case "Rejected":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <DashboardLayout
        title="Manage Applications"
        description="Monitor and review all student placement applications"
      >
        <div className="flex min-h-[500px] items-center justify-center">
          <div className="text-center">

            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />

            <p className="text-sm text-gray-500">
              Loading applications...
            </p>

          </div>
        </div>
      </DashboardLayout>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error) {
    return (
      <DashboardLayout
        title="Manage Applications"
        description="Monitor and review all student placement applications"
      >
        <div className="rounded-xl border border-red-200 bg-red-50 p-6">

          <h2 className="text-lg font-semibold text-red-700">
            Failed to load applications
          </h2>

          <p className="mt-2 text-sm text-red-600">
            {error}
          </p>

          <button
            onClick={fetchApplications}
            className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
          >
            Try Again
          </button>

        </div>
      </DashboardLayout>
    );
  }

  // =====================================================
  // STATS
  // =====================================================

  const totalApplications =
    applications.length;

  const appliedCount =
    applications.filter(
      (item) => item.status === "Applied"
    ).length;

  const shortlistedCount =
    applications.filter(
      (item) => item.status === "Shortlisted"
    ).length;

  const selectedCount =
    applications.filter(
      (item) => item.status === "Selected"
    ).length;

  const rejectedCount =
    applications.filter(
      (item) => item.status === "Rejected"
    ).length;

  // =====================================================
  // UI
  // =====================================================

  return (
    <DashboardLayout
      title="Manage Applications"
      description="Monitor and review all student placement applications"
    >
      <div className="w-full max-w-full overflow-hidden">
        <div className="space-y-7">

          {/* =================================================
              HEADER
          ================================================= */}

          <div className="flex items-center justify-between">

            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Manage Applications
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Monitor and review all student
                placement applications.
              </p>
            </div>

            <button
              onClick={fetchApplications}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              Refresh
            </button>

          </div>

          {/* =================================================
              STAT CARDS
          ================================================= */}

          <div className="grid grid-cols-5 gap-4">

            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <p className="text-sm text-gray-500">
                Total
              </p>

              <h2 className="mt-2 text-2xl font-bold text-gray-900">
                {totalApplications}
              </h2>
            </div>

            <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
              <p className="text-sm text-blue-600">
                Applied
              </p>

              <h2 className="mt-2 text-2xl font-bold text-blue-700">
                {appliedCount}
              </h2>
            </div>

            <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4">
              <p className="text-sm text-yellow-600">
                Shortlisted
              </p>

              <h2 className="mt-2 text-2xl font-bold text-yellow-700">
                {shortlistedCount}
              </h2>
            </div>

            <div className="rounded-xl border border-green-200 bg-green-50 p-4">
              <p className="text-sm text-green-600">
                Selected
              </p>

              <h2 className="mt-2 text-2xl font-bold text-green-700">
                {selectedCount}
              </h2>
            </div>

            <div className="rounded-xl border border-red-200 bg-red-50 p-4">
              <p className="text-sm text-red-600">
                Rejected
              </p>

              <h2 className="mt-2 text-2xl font-bold text-red-700">
                {rejectedCount}
              </h2>
            </div>

          </div>

          {/* =================================================
              FILTERS
          ================================================= */}

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">

            <div className="flex gap-5">

              <div className="flex-1">

                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Search Applications
                </label>

                <input
                  type="text"
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  placeholder="Search student, email, company or job role..."
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

              </div>

              <div className="w-52">

                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Status
                </label>

                <select
                  value={statusFilter}
                  onChange={(e) =>
                    setStatusFilter(
                      e.target.value
                    )
                  }
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="All">
                    All Applications
                  </option>

                  <option value="Applied">
                    Applied
                  </option>

                  <option value="Shortlisted">
                    Shortlisted
                  </option>

                  <option value="Selected">
                    Selected
                  </option>

                  <option value="Rejected">
                    Rejected
                  </option>
                </select>

              </div>

            </div>

          </div>

          {/* =================================================
              APPLICATIONS
          ================================================= */}

          <div className="w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

            <div className="border-b border-gray-200 px-5 py-4">

              <h2 className="text-lg font-semibold text-gray-900">
                Applications
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Showing{" "}
                {filteredApplications.length}{" "}
                of {applications.length} applications
              </p>

            </div>

            {filteredApplications.length === 0 ? (

              <div className="px-6 py-16 text-center">

                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-2xl">
                  📄
                </div>

                <h3 className="text-lg font-semibold text-gray-800">
                  No applications found
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Try changing your search or
                  status filter.
                </p>

              </div>

            ) : (

              <table className="w-full table-fixed">

                <thead className="bg-gray-50">

                  <tr className="border-b border-gray-200">

                    <th className="w-[19%] px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Student
                    </th>

                    <th className="w-[16%] px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Company
                    </th>

                    <th className="w-[18%] px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Role
                    </th>

                    <th className="w-[11%] px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Package
                    </th>

                    <th className="w-[12%] px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Status
                    </th>

                    <th className="w-[14%] px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Applied On
                    </th>

                    <th className="w-[10%] px-4 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Action
                    </th>

                  </tr>

                </thead>

                <tbody className="divide-y divide-gray-100">

                  {filteredApplications.map(
                    (application) => {

                      const student =
                        application.student;

                      const company =
                        application.company;

                      const drive =
                        application.drive;

                      return (
                        <tr
                          key={application._id}
                          className="transition hover:bg-gray-50"
                        >

                          {/* Student */}

                          <td className="px-4 py-4">

                            <div className="flex items-center gap-2">

                              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700">
                                {student?.name
                                  ?.charAt(0)
                                  ?.toUpperCase() ||
                                  "S"}
                              </div>

                              <div className="min-w-0">

                                <p className="truncate text-sm font-medium text-gray-900">
                                  {student?.name ||
                                    "Unknown Student"}
                                </p>

                                <p className="truncate text-xs text-gray-500">
                                  {student?.email ||
                                    "No email"}
                                </p>

                              </div>

                            </div>

                          </td>

                          {/* Company */}

                          <td className="px-4 py-4">

                            <p className="truncate text-sm font-medium text-gray-800">
                              {company?.companyName ||
                                "Unknown Company"}
                            </p>

                            <p className="truncate text-xs text-gray-500">
                              {company?.companyEmail ||
                                ""}
                            </p>

                          </td>

                          {/* Role */}

                          <td className="px-4 py-4">

                            <p
                              className="truncate text-sm font-medium text-gray-800"
                              title={
                                drive?.jobTitle || ""
                              }
                            >
                              {drive?.jobTitle ||
                                "N/A"}
                            </p>

                          </td>

                          {/* Package */}

                          <td className="px-4 py-4">

                            <span className="whitespace-nowrap text-sm text-gray-700">
                              {drive?.package ||
                                "Not specified"}
                            </span>

                          </td>

                          {/* Status */}

                          <td className="px-4 py-4">

                            <span
                              className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusStyle(
                                application.status
                              )}`}
                            >
                              {application.status ||
                                "Unknown"}
                            </span>

                          </td>

                          {/* Applied On */}

                          <td className="px-4 py-4">

                            <span className="whitespace-nowrap text-sm text-gray-600">
                              {application.createdAt
                                ? new Date(
                                    application.createdAt
                                  ).toLocaleDateString(
                                    "en-IN",
                                    {
                                      day: "2-digit",
                                      month: "short",
                                      year: "numeric",
                                    }
                                  )
                                : "N/A"}
                            </span>

                          </td>

                          {/* Action */}

                          <td className="px-4 py-4 text-right">

                            <button
                              onClick={() =>
                                navigate(
                                  `/student/applications/${application._id}`
                                )
                              }
                              className="rounded-lg bg-blue-50 px-3 py-2 text-xs font-medium text-blue-700 transition hover:bg-blue-100"
                            >
                              View
                            </button>

                          </td>

                        </tr>
                      );
                    }
                  )}

                </tbody>

              </table>

            )}

          </div>

        </div>
      </div>
    </DashboardLayout>
  );
};
export default ManageApplications;
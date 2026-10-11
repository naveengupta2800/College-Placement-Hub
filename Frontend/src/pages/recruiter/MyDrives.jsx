import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Search,
  BriefcaseBusiness,
  MapPin,
  CalendarDays,
  Users,
  Pencil,
  Clock3,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "../../components/layout/DashboardLayout";
import Card from "../../components/common/Card";
import Badge from "../../components/common/Badge";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";

import { getRecruiterDrives } from "../../services/recruiterService";

const MyDrives = () => {
  const navigate = useNavigate();

  const [drives, setDrives] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDrives = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getRecruiterDrives();

      if (response.success) {
        setDrives(response.drives || []);
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to load placement drives"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrives();
  }, []);

  const filteredDrives = useMemo(() => {
    return drives.filter((drive) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        drive.jobTitle?.toLowerCase().includes(searchText) ||
        drive.company?.companyName
          ?.toLowerCase()
          .includes(searchText) ||
        drive.location?.toLowerCase().includes(searchText);

      const matchesStatus =
        statusFilter === "All" ||
        drive.status?.toLowerCase() ===
          statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [drives, search, statusFilter]);

  const getStatusVariant = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "success";

      case "pending":
        return "warning";

      case "rejected":
        return "danger";

      case "closed":
        return "default";

      default:
        return "info";
    }
  };

  const formatDate = (date) => {
    if (!date) return "Not specified";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <DashboardLayout
        title="My Drives"
        description="Manage your placement drives"
      >
        <div className="flex min-h-[500px] items-center justify-center">
          <Loader />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="My Drives"
      description="Create and manage your placement opportunities"
    >
      <div className="space-y-6">

        {/* ================= HEADER ================= */}

        <div className="flex items-center justify-between">

          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Placement Drives
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Manage all your placement opportunities from one place.
            </p>
          </div>

          <Button
            onClick={() =>
              navigate("/recruiter/drives/create")
            }
          >
            <Plus size={18} />
            Create Drive
          </Button>

        </div>

        {/* ================= ERROR ================= */}

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* ================= FILTERS ================= */}

        <Card padding="p-4">

          <div className="flex items-center gap-4">

            {/* Search */}

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
                placeholder="Search by role, company or location..."
                className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

            </div>

            {/* Status */}

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
              className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="All">
                All Status
              </option>

              <option value="Pending">
                Pending
              </option>

              <option value="Approved">
                Approved
              </option>

              <option value="Rejected">
                Rejected
              </option>

              <option value="Closed">
                Closed
              </option>
            </select>

          </div>

        </Card>

        {/* ================= DRIVES ================= */}

        {filteredDrives.length === 0 ? (
          <EmptyState
            icon={<BriefcaseBusiness size={26} />}
            title="No placement drives found"
            description={
              drives.length === 0
                ? "You haven't created any placement drive yet."
                : "Try changing your search or status filter."
            }
          />
        ) : (
          <div className="grid grid-cols-2 gap-6">

            {filteredDrives.map((drive) => (

              <Card
                key={drive._id}
                className="transition duration-200 hover:-translate-y-0.5 hover:shadow-md"
              >

                {/* ================= CARD HEADER ================= */}

                <div className="flex items-start justify-between">

                  <div className="flex min-w-0 items-start gap-4">

                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                      <BriefcaseBusiness size={22} />
                    </div>

                    <div className="min-w-0">

                      <h3 className="truncate text-lg font-semibold text-gray-900">
                        {drive.jobTitle ||
                          "Untitled Position"}
                      </h3>

                      <p className="mt-1 text-sm text-gray-500">
                        {drive.company?.companyName ||
                          "Company"}
                      </p>

                    </div>

                  </div>

                  <Badge
                    variant={getStatusVariant(
                      drive.status
                    )}
                  >
                    {drive.status || "Unknown"}
                  </Badge>

                </div>

                {/* ================= DRIVE DETAILS ================= */}

                <div className="mt-6 grid grid-cols-2 gap-4">

                  {/* Package */}

                  <div className="flex items-center gap-2 text-sm text-gray-600">

                    <BriefcaseBusiness
                      size={16}
                      className="text-gray-400"
                    />

                    <span>
                      {drive.package ||
                        "Package not specified"}
                    </span>

                  </div>

                  {/* Openings */}

                  <div className="flex items-center gap-2 text-sm text-gray-600">

                    <Users
                      size={16}
                      className="text-gray-400"
                    />

                    <span>
                      {drive.openings || 0} openings
                    </span>

                  </div>

                  {/* Location */}

                  <div className="flex items-center gap-2 text-sm text-gray-600">

                    <MapPin
                      size={16}
                      className="text-gray-400"
                    />

                    <span>
                      {drive.location ||
                        "Location not specified"}
                    </span>

                  </div>

                  {/* Drive Date */}

                  <div className="flex items-center gap-2 text-sm text-gray-600">

                    <CalendarDays
                      size={16}
                      className="text-gray-400"
                    />

                    <span>
                      {formatDate(
                        drive.driveDate
                      )}
                    </span>

                  </div>

                </div>

                {/* ================= DEADLINE ================= */}

                <div className="mt-5 flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3">

                  <div className="flex items-center gap-2">

                    <Clock3
                      size={16}
                      className="text-gray-400"
                    />

                    <span className="text-xs text-gray-500">
                      Application Deadline
                    </span>

                  </div>

                  <span className="text-sm font-semibold text-gray-800">
                    {formatDate(
                      drive.applicationDeadline
                    )}
                  </span>

                </div>

                {/* ================= SKILLS ================= */}

                {drive.skillsRequired?.length > 0 && (
                  <div className="mt-5">

                    <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-400">
                      Required Skills
                    </p>

                    <div className="flex flex-wrap gap-2">

                      {drive.skillsRequired
                        .slice(0, 5)
                        .map((skill, index) => (

                          <span
                            key={`${skill}-${index}`}
                            className="rounded-md bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700"
                          >
                            {skill}
                          </span>

                        ))}

                      {drive.skillsRequired.length > 5 && (
                        <span className="rounded-md bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                          +{drive.skillsRequired.length - 5} more
                        </span>
                      )}

                    </div>

                  </div>
                )}

                {/* ================= ACTIONS ================= */}

                <div className="mt-6 flex items-center justify-end gap-3 border-t border-gray-100 pt-5">

                  {/* Applicants */}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      navigate(
                        `/recruiter/drives/${drive._id}/applicants`
                      )
                    }
                  >
                    <Users size={16} />
                    Applicants
                  </Button>

                  {/* Rounds */}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      navigate(
                        `/recruiter/drives/${drive._id}/rounds`
                      )
                    }
                  >
                    <CalendarDays size={16} />
                    Rounds
                  </Button>

                  {/* Edit */}

                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() =>
                      navigate(
                        `/recruiter/drives/${drive._id}/edit`
                      )
                    }
                  >
                    <Pencil size={16} />
                    Edit
                  </Button>

                </div>

              </Card>

            ))}

          </div>
        )}

      </div>
    </DashboardLayout>
  );
};

export default MyDrives;

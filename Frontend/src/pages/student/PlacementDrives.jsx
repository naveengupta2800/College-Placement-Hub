import { useEffect, useMemo, useState } from "react";
import {
  BriefcaseBusiness,
  CalendarDays,
  MapPin,
  Search,
  Building2,
  IndianRupee,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "../../components/layout/DashboardLayout";
import Card from "../../components/common/Card";
import Badge from "../../components/common/Badge";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";

import { getApprovedDrives } from "../../services/driveService";

const PlacementDrives = () => {
  const navigate = useNavigate();

  const [drives, setDrives] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDrives();
  }, []);

  const fetchDrives = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getApprovedDrives();

      if (data.success) {
        setDrives(data.drives || []);
      } else {
        setError(data.message || "Failed to load placement drives");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load placement drives"
      );
    } finally {
      setLoading(false);
    }
  };

  const filteredDrives = useMemo(() => {
    const query = search.toLowerCase().trim();

    if (!query) return drives;

    return drives.filter((drive) => {
      return (
        drive.jobTitle?.toLowerCase().includes(query) ||
        drive.company?.companyName?.toLowerCase().includes(query) ||
        drive.location?.toLowerCase().includes(query) ||
        drive.employmentType?.toLowerCase().includes(query)
      );
    });
  }, [drives, search]);

  const formatDate = (date) => {
    if (!date) return "Not specified";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <DashboardLayout
      title="Placement Drives"
      description="Explore approved placement opportunities"
    >
      <div className="space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Available Drives
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              {drives.length} placement opportunities available
            </p>
          </div>

          <div className="relative w-80">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search company, role, location..."
              className="h-11 w-full rounded-lg border border-gray-200 bg-white pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        {/* Error */}
        {error && (
          <Card className="border-red-200 bg-red-50">
            <p className="text-sm font-medium text-red-600">
              {error}
            </p>

            <button
              onClick={fetchDrives}
              className="mt-3 text-sm font-semibold text-red-700 underline"
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
        ) : filteredDrives.length === 0 ? (
          <EmptyState
            icon={<BriefcaseBusiness size={28} />}
            title="No placement drives found"
            description={
              search
                ? "Try searching with a different keyword."
                : "There are currently no approved placement drives."
            }
          />
        ) : (
          <div className="grid grid-cols-2 gap-6">
            {filteredDrives.map((drive) => (
              <Card
                key={drive._id}
                className="group transition duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
              >
                {/* Top */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                      <Building2 size={22} />
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {drive.company?.companyName ||
                          "Company"}
                      </h3>

                      <p className="mt-0.5 text-sm text-gray-500">
                        {drive.jobTitle}
                      </p>
                    </div>
                  </div>

                  <Badge variant="success">
                    Approved
                  </Badge>
                </div>

                {/* Details */}
                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="rounded-lg bg-gray-50 p-3">
                    <div className="flex items-center gap-2 text-gray-500">
                      <IndianRupee size={16} />
                      <span className="text-xs">
                        Package
                      </span>
                    </div>

                    <p className="mt-1 text-sm font-semibold text-gray-900">
                      {drive.package || "Not specified"}
                    </p>
                  </div>

                  <div className="rounded-lg bg-gray-50 p-3">
                    <div className="flex items-center gap-2 text-gray-500">
                      <BriefcaseBusiness size={16} />
                      <span className="text-xs">
                        Employment
                      </span>
                    </div>

                    <p className="mt-1 text-sm font-semibold text-gray-900">
                      {drive.employmentType || "Full Time"}
                    </p>
                  </div>

                  <div className="rounded-lg bg-gray-50 p-3">
                    <div className="flex items-center gap-2 text-gray-500">
                      <MapPin size={16} />
                      <span className="text-xs">
                        Location
                      </span>
                    </div>

                    <p className="mt-1 truncate text-sm font-semibold text-gray-900">
                      {drive.location || "Not specified"}
                    </p>
                  </div>

                  <div className="rounded-lg bg-gray-50 p-3">
                    <div className="flex items-center gap-2 text-gray-500">
                      <CalendarDays size={16} />
                      <span className="text-xs">
                        Deadline
                      </span>
                    </div>

                    <p className="mt-1 text-sm font-semibold text-gray-900">
                      {formatDate(drive.applicationDeadline)}
                    </p>
                  </div>
                </div>

                {/* Skills */}
                {drive.skillsRequired?.length > 0 && (
                  <div className="mt-5">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Skills
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {drive.skillsRequired
                        .slice(0, 5)
                        .map((skill, index) => (
                          <span
                            key={index}
                            className="rounded-md bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700"
                          >
                            {skill}
                          </span>
                        ))}
                    </div>
                  </div>
                )}

                {/* Bottom */}
                <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-5">
                  <div>
                    <p className="text-xs text-gray-400">
                      Openings
                    </p>

                    <p className="mt-0.5 text-sm font-semibold text-gray-800">
                      {drive.openings || 0} positions
                    </p>
                  </div>

                  <button
                    onClick={() =>
                      navigate(`/student/drives/${drive._id}`)
                    }
                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                  >
                    View Details
                    <ArrowRight size={16} />
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default PlacementDrives;
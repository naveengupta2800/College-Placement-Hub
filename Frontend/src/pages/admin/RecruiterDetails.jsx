import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Building2,
  Globe,
  MapPin,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  XCircle,
} from "lucide-react";

import DashboardLayout from "../../components/layout/DashboardLayout";
import Card from "../../components/common/Card";
import Badge from "../../components/common/Badge";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";

import api from "../../services/api";

const RecruiterDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [recruiter, setRecruiter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchRecruiter = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        `/admin/recruiters/${id}`
      );

      if (response.data.success) {
        setRecruiter(response.data.recruiter);
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to load recruiter details."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecruiter();
  }, [id]);

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
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

  if (loading) {
    return (
      <DashboardLayout
        title="Recruiter Details"
        description="View recruiter information"
      >
        <div className="flex min-h-[500px] items-center justify-center">
          <Loader />
        </div>
      </DashboardLayout>
    );
  }

  if (error || !recruiter) {
    return (
      <DashboardLayout
        title="Recruiter Details"
        description="View recruiter information"
      >
        <div className="space-y-5">

          <Button
            variant="outline"
            onClick={() =>
              navigate("/admin/recruiters")
            }
          >
            <ArrowLeft size={17} />
            Back to Recruiters
          </Button>

          <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            {error || "Recruiter not found."}
          </div>

        </div>
      </DashboardLayout>
    );
  }

  const company = recruiter.company;

  const isActive =
    recruiter.isActive !== false;

  return (
    <DashboardLayout
      title="Recruiter Details"
      description="View complete recruiter and company information"
    >
      <div className="space-y-6">

        {/* ================= TOP BAR ================= */}

        <div className="flex items-center justify-between">

          <Button
            variant="outline"
            onClick={() =>
              navigate("/admin/recruiters")
            }
          >
            <ArrowLeft size={17} />
            Back to Recruiters
          </Button>

          <div className="flex items-center gap-3">

            <Badge
              variant={
                isActive
                  ? "success"
                  : "danger"
              }
            >
              {isActive ? (
                <span className="flex items-center gap-1">
                  <CheckCircle2 size={13} />
                  Active
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <XCircle size={13} />
                  Inactive
                </span>
              )}
            </Badge>

            {company && (
              <Badge
                variant={
                  company.isApproved
                    ? "success"
                    : "warning"
                }
              >
                Company{" "}
                {company.isApproved
                  ? "Approved"
                  : "Pending"}
              </Badge>
            )}

          </div>

        </div>

        {/* ================= RECRUITER HEADER ================= */}

        <Card>

          <div className="flex items-center gap-5">

            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-purple-50 text-2xl font-bold text-purple-600">
              {recruiter.name
                ?.charAt(0)
                ?.toUpperCase() || "R"}
            </div>

            <div className="flex-1">

              <h2 className="text-2xl font-bold text-gray-900">
                {recruiter.name ||
                  "Recruiter"}
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Recruiter Account
              </p>

              <div className="mt-3 flex items-center gap-6">

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail
                    size={15}
                    className="text-gray-400"
                  />
                  {recruiter.email}
                </div>

                {recruiter.phone && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone
                      size={15}
                      className="text-gray-400"
                    />
                    {recruiter.phone}
                  </div>
                )}

              </div>

            </div>

          </div>

        </Card>

        {/* ================= RECRUITER + COMPANY ================= */}

        <div className="grid grid-cols-2 gap-6">

          {/* Recruiter Information */}

          <Card>

            <div className="mb-6 flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
                <User size={20} />
              </div>

              <div>
                <h3 className="font-semibold text-gray-900">
                  Recruiter Information
                </h3>

                <p className="text-xs text-gray-500">
                  Account and contact details
                </p>
              </div>

            </div>

            <div className="space-y-5">

              <div>
                <p className="text-xs text-gray-400">
                  Full Name
                </p>

                <p className="mt-1 text-sm font-medium text-gray-800">
                  {recruiter.name || "N/A"}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400">
                  Email Address
                </p>

                <p className="mt-1 flex items-center gap-2 text-sm font-medium text-gray-800">
                  <Mail
                    size={14}
                    className="text-gray-400"
                  />
                  {recruiter.email || "N/A"}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400">
                  Phone Number
                </p>

                <p className="mt-1 flex items-center gap-2 text-sm font-medium text-gray-800">
                  <Phone
                    size={14}
                    className="text-gray-400"
                  />
                  {recruiter.phone || "N/A"}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400">
                  Account Created
                </p>

                <p className="mt-1 text-sm font-medium text-gray-800">
                  {formatDate(
                    recruiter.createdAt
                  )}
                </p>
              </div>

            </div>

          </Card>

          {/* Company Information */}

          <Card>

            <div className="mb-6 flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <Building2 size={20} />
              </div>

              <div>
                <h3 className="font-semibold text-gray-900">
                  Company Information
                </h3>

                <p className="text-xs text-gray-500">
                  Recruiter's registered company
                </p>
              </div>

            </div>

            {!company ? (
              <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6 text-center">

                <Building2
                  size={28}
                  className="mx-auto text-gray-400"
                />

                <p className="mt-3 text-sm font-medium text-gray-700">
                  No company profile
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  This recruiter has not created a company profile yet.
                </p>

              </div>
            ) : (
              <div className="space-y-5">

                <div className="flex items-center justify-between">

                  <div>
                    <p className="text-xs text-gray-400">
                      Company Name
                    </p>

                    <p className="mt-1 text-lg font-semibold text-gray-900">
                      {company.companyName}
                    </p>
                  </div>

                  <Badge
                    variant={
                      company.isApproved
                        ? "success"
                        : "warning"
                    }
                  >
                    {company.isApproved
                      ? "Approved"
                      : "Pending"}
                  </Badge>

                </div>

                <div>
                  <p className="text-xs text-gray-400">
                    Company Email
                  </p>

                  <p className="mt-1 flex items-center gap-2 text-sm font-medium text-gray-800">
                    <Mail
                      size={14}
                      className="text-gray-400"
                    />
                    {company.companyEmail ||
                      "N/A"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-400">
                    Phone
                  </p>

                  <p className="mt-1 flex items-center gap-2 text-sm font-medium text-gray-800">
                    <Phone
                      size={14}
                      className="text-gray-400"
                    />
                    {company.companyPhone ||
                      "N/A"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-400">
                    Location
                  </p>

                  <p className="mt-1 flex items-center gap-2 text-sm font-medium text-gray-800">
                    <MapPin
                      size={14}
                      className="text-gray-400"
                    />
                    {company.location || "N/A"}
                  </p>
                </div>

                {company.website && (
                  <div>
                    <p className="text-xs text-gray-400">
                      Website
                    </p>

                    <a
                      href={company.website}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-1 flex items-center gap-2 text-sm font-medium text-blue-600 hover:underline"
                    >
                      <Globe size={14} />
                      {company.website}
                    </a>
                  </div>
                )}

              </div>
            )}

          </Card>

        </div>

        {/* ================= COMPANY DESCRIPTION ================= */}

        {company?.description && (
          <Card>

            <h3 className="font-semibold text-gray-900">
              Company Description
            </h3>

            <p className="mt-3 max-w-4xl text-sm leading-7 text-gray-600">
              {company.description}
            </p>

          </Card>
        )}

        {/* ================= PLACEMENT DRIVES ================= */}

        <Card padding="p-0">

          <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                <BriefcaseBusiness size={20} />
              </div>

              <div>

                <h3 className="font-semibold text-gray-900">
                  Placement Drives
                </h3>

                <p className="text-xs text-gray-500">
                  Drives created by this recruiter
                </p>

              </div>

            </div>

            <Badge variant="info">
              {recruiter.drives?.length || 0} Drives
            </Badge>

          </div>

          {!recruiter.drives ||
          recruiter.drives.length === 0 ? (
            <div className="px-6 py-12 text-center">

              <BriefcaseBusiness
                size={32}
                className="mx-auto text-gray-300"
              />

              <p className="mt-3 text-sm font-medium text-gray-700">
                No placement drives
              </p>

              <p className="mt-1 text-xs text-gray-500">
                This recruiter hasn't created any placement drive yet.
              </p>

            </div>
          ) : (
            <div className="divide-y divide-gray-100">

              {recruiter.drives.map((drive) => (

                <div
                  key={drive._id}
                  className="flex items-center justify-between px-6 py-5 transition hover:bg-gray-50"
                >

                  <div className="flex items-center gap-4">

                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                      <BriefcaseBusiness
                        size={18}
                      />
                    </div>

                    <div>

                      <h4 className="text-sm font-semibold text-gray-900">
                        {drive.jobTitle ||
                          "Placement Drive"}
                      </h4>

                      <div className="mt-2 flex items-center gap-5 text-xs text-gray-500">

                        <span className="flex items-center gap-1">
                          <CalendarDays
                            size={13}
                          />
                          {formatDate(
                            drive.driveDate
                          )}
                        </span>

                        <span className="flex items-center gap-1">
                          <MapPin
                            size={13}
                          />
                          {drive.location ||
                            "Location N/A"}
                        </span>

                      </div>

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

              ))}

            </div>
          )}

        </Card>

      </div>
    </DashboardLayout>
  );
};

export default RecruiterDetails;
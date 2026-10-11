import { useEffect, useState } from "react";
import {
  ArrowLeft,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  CheckCircle2,
  IndianRupee,
  MapPin,
  Users,
  GraduationCap,
  FileText,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import DashboardLayout from "../../components/layout/DashboardLayout";
import Card from "../../components/common/Card";
import Badge from "../../components/common/Badge";
import Loader from "../../components/common/Loader";
import Button from "../../components/common/Button";

import { getDriveById } from "../../services/driveService";
import { applyForDrive } from "../../services/applicationService";

const DriveDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [drive, setDrive] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchDrive();
  }, [id]);

  const fetchDrive = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getDriveById(id);

      if (data.success) {
        setDrive(data.drive);
      } else {
        setError(data.message || "Drive not found");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load drive details"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    try {
      setApplying(true);
      setError("");
      setSuccess("");

      const data = await applyForDrive(id);

      if (data.success) {
        setSuccess(
          data.message || "Application submitted successfully"
        );
      } else {
        setError(data.message || "Unable to apply");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to submit application"
      );
    } finally {
      setApplying(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "Not specified";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <DashboardLayout
        title="Drive Details"
        description="Placement opportunity details"
      >
        <div className="flex min-h-[500px] items-center justify-center">
          <Loader />
        </div>
      </DashboardLayout>
    );
  }

  if (error && !drive) {
    return (
      <DashboardLayout title="Drive Details">
        <Card>
          <div className="py-12 text-center">
            <p className="text-sm text-red-600">
              {error}
            </p>

            <button
              onClick={() => navigate("/student/drives")}
              className="mt-4 text-sm font-semibold text-blue-600 hover:underline"
            >
              Back to Placement Drives
            </button>
          </div>
        </Card>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Drive Details"
      description="Review the opportunity before applying"
    >
      <div className="space-y-6">

        {/* Back */}
        <button
          onClick={() => navigate("/student/drives")}
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-blue-600"
        >
          <ArrowLeft size={17} />
          Back to Placement Drives
        </button>

        {/* Hero */}
        <Card className="overflow-hidden p-0">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-8 text-white">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15">
                  <Building2 size={30} />
                </div>

                <div>
                  <p className="text-sm font-medium text-blue-100">
                    {drive.company?.companyName ||
                      "Company"}
                  </p>

                  <h1 className="mt-1 text-2xl font-bold">
                    {drive.jobTitle}
                  </h1>

                  <div className="mt-3 flex items-center gap-4 text-sm text-blue-100">
                    <span className="flex items-center gap-1.5">
                      <MapPin size={15} />
                      {drive.location || "Not specified"}
                    </span>

                    <span className="flex items-center gap-1.5">
                      <BriefcaseBusiness size={15} />
                      {drive.employmentType}
                    </span>
                  </div>
                </div>
              </div>

              <Badge variant="success">
                Approved
              </Badge>
            </div>
          </div>

          {/* Key stats */}
          <div className="grid grid-cols-4 divide-x divide-gray-100">
            <div className="p-6">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Package
              </p>

              <p className="mt-2 text-lg font-bold text-gray-900">
                {drive.package || "Not specified"}
              </p>
            </div>

            <div className="p-6">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Openings
              </p>

              <p className="mt-2 text-lg font-bold text-gray-900">
                {drive.openings || 0}
              </p>
            </div>

            <div className="p-6">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Application Deadline
              </p>

              <p className="mt-2 text-lg font-bold text-gray-900">
                {formatDate(
                  drive.applicationDeadline
                )}
              </p>
            </div>

            <div className="p-6">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Drive Date
              </p>

              <p className="mt-2 text-lg font-bold text-gray-900">
                {formatDate(drive.driveDate)}
              </p>
            </div>
          </div>
        </Card>

        {/* Messages */}
        {success && (
          <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-700">
            <CheckCircle2 size={19} />
            <span>{success}</span>
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="grid grid-cols-3 gap-6">

          {/* Main */}
          <div className="col-span-2 space-y-6">

            {/* Description */}
            <Card>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <FileText size={19} />
                </div>

                <div>
                  <h2 className="font-semibold text-gray-900">
                    Job Description
                  </h2>

                  <p className="text-xs text-gray-500">
                    About this opportunity
                  </p>
                </div>
              </div>

              <p className="mt-5 whitespace-pre-line text-sm leading-7 text-gray-600">
                {drive.jobDescription ||
                  "No job description provided."}
              </p>
            </Card>

            {/* Skills */}
            <Card>
              <h2 className="font-semibold text-gray-900">
                Required Skills
              </h2>

              <div className="mt-4 flex flex-wrap gap-2">
                {drive.skillsRequired?.length > 0 ? (
                  drive.skillsRequired.map(
                    (skill, index) => (
                      <span
                        key={index}
                        className="rounded-lg bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700"
                      >
                        {skill}
                      </span>
                    )
                  )
                ) : (
                  <p className="text-sm text-gray-500">
                    No specific skills mentioned.
                  </p>
                )}
              </div>
            </Card>

            {/* Eligibility */}
            <Card>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
                  <GraduationCap size={20} />
                </div>

                <h2 className="font-semibold text-gray-900">
                  Eligibility Criteria
                </h2>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-4">

                <EligibilityItem
                  label="Minimum CGPA"
                  value={
                    drive.eligibility?.minimumCGPA ??
                    "No minimum"
                  }
                />

                <EligibilityItem
                  label="10th Percentage"
                  value={
                    drive.eligibility
                      ?.minimumTenthPercentage != null
                      ? `${drive.eligibility.minimumTenthPercentage}%`
                      : "No minimum"
                  }
                />

                <EligibilityItem
                  label="12th Percentage"
                  value={
                    drive.eligibility
                      ?.minimumTwelfthPercentage != null
                      ? `${drive.eligibility.minimumTwelfthPercentage}%`
                      : "No minimum"
                  }
                />

                <EligibilityItem
                  label="Passing Year"
                  value={
                    drive.eligibility?.passingYear ??
                    "Any"
                  }
                />

                <EligibilityItem
                  label="Branches"
                  value={
                    drive.eligibility?.branches?.length
                      ? drive.eligibility.branches.join(", ")
                      : "All branches"
                  }
                />

                <EligibilityItem
                  label="Backlogs"
                  value={
                    drive.eligibility?.backlogsAllowed
                      ? "Allowed"
                      : "Not Allowed"
                  }
                />
              </div>
            </Card>
          </div>

          {/* Apply Sidebar */}
          <div>
            <div className="sticky top-6 space-y-6">

              <Card>
                <h2 className="text-lg font-semibold text-gray-900">
                  Apply for this Drive
                </h2>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  Make sure your profile and resume are
                  updated before applying.
                </p>

                <div className="mt-5 space-y-3">
                  <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
                    <CalendarDays
                      size={18}
                      className="text-gray-500"
                    />

                    <div>
                      <p className="text-xs text-gray-400">
                        Deadline
                      </p>

                      <p className="text-sm font-semibold text-gray-800">
                        {formatDate(
                          drive.applicationDeadline
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
                    <Users
                      size={18}
                      className="text-gray-500"
                    />

                    <div>
                      <p className="text-xs text-gray-400">
                        Openings
                      </p>

                      <p className="text-sm font-semibold text-gray-800">
                        {drive.openings}
                      </p>
                    </div>
                  </div>
                </div>

                <Button
                  variant="primary"
                  size="lg"
                  className="mt-6 w-full"
                  loading={applying}
                  disabled={Boolean(success)}
                  onClick={handleApply}
                >
                  {success ? "Applied Successfully" : "Apply Now"}
                </Button>

                <p className="mt-3 text-center text-xs text-gray-400">
                  Your eligibility will be checked automatically.
                </p>
              </Card>

              {/* Company */}
              <Card>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Company
                </p>

                <div className="mt-4 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-gray-100 text-gray-600">
                    <Building2 size={20} />
                  </div>

                  <div>
                    <p className="font-semibold text-gray-900">
                      {drive.company?.companyName}
                    </p>

                    <p className="text-xs text-gray-500">
                      {drive.company?.location ||
                        drive.location ||
                        "Location not specified"}
                    </p>
                  </div>
                </div>

                {drive.company?.website && (
                  <a
                    href={drive.company.website}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 block text-sm font-medium text-blue-600 hover:underline"
                  >
                    Visit company website
                  </a>
                )}
              </Card>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

const EligibilityItem = ({ label, value }) => {
  return (
    <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
      <p className="text-xs text-gray-400">
        {label}
      </p>

      <p className="mt-1 text-sm font-semibold text-gray-800">
        {value}
      </p>
    </div>
  );
};

export default DriveDetails;
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  GraduationCap,
  FileText,
  CheckCircle2,
  XCircle,
  Clock3,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import DashboardLayout from "../../components/layout/DashboardLayout";
import Card from "../../components/common/Card";
import Badge from "../../components/common/Badge";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";

import {
  getApplicationById,
  updateApplicationStatus,
} from "../../services/applicationService";

const ApplicantDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [application, setApplication] = useState(null);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const [error, setError] = useState("");

  const fetchApplication = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getApplicationById(id);

      if (response.success) {
        setApplication(response.application);
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to load applicant details."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplication();
  }, [id]);

  const updateStatus = async (status) => {
    try {
      setActionLoading(true);
      setError("");

      const response = await updateApplicationStatus(
        id,
        { status }
      );

      if (response.success) {
        setApplication((prev) => ({
          ...prev,
          status,
        }));
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to update application."
      );
    } finally {
      setActionLoading(false);
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
        title="Applicant Details"
        description="View applicant information"
      >
        <div className="flex min-h-[500px] items-center justify-center">
          <Loader />
        </div>
      </DashboardLayout>
    );
  }

  if (!application) {
    return (
      <DashboardLayout
        title="Applicant Details"
        description="View applicant information"
      >
        <Card>
          <div className="py-12 text-center">
            <h3 className="text-lg font-semibold text-gray-900">
              Applicant not found
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              The application you're looking for could not be found.
            </p>

            <div className="mt-5">
              <Button
                onClick={() =>
                  navigate("/recruiter/drives")
                }
              >
                Back to Drives
              </Button>
            </div>
          </div>
        </Card>
      </DashboardLayout>
    );
  }

  const student = application.student;
  const profile = application.studentProfile;
  const drive = application.drive;

  return (
    <DashboardLayout
      title="Applicant Details"
      description="Review student profile and application"
    >
      <div className="space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">

          <div className="flex items-center gap-4">

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
            >
              <ArrowLeft size={18} />
            </button>

            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Applicant Details
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Review applicant information and application status.
              </p>
            </div>

          </div>

          <Badge
            variant={getStatusVariant(
              application.status
            )}
          >
            {application.status}
          </Badge>

        </div>

        {/* Error */}
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Applicant Hero */}
        <Card>

          <div className="flex items-center justify-between">

            <div className="flex items-center gap-5">

              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                <User size={30} />
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {student?.name || "Unknown Student"}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {student?.email || "No email available"}
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  Applied on{" "}
                  {application.appliedAt
                    ? new Date(
                        application.appliedAt
                      ).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                    : "—"}
                </p>
              </div>

            </div>

            {/* Status Actions */}
            <div className="flex gap-3">

              {application.status !==
                "Shortlisted" &&
                application.status !==
                  "Selected" && (
                  <Button
                    variant="success"
                    disabled={actionLoading}
                    onClick={() =>
                      updateStatus("Shortlisted")
                    }
                  >
                    <CheckCircle2 size={17} />
                    Shortlist
                  </Button>
                )}

              {application.status !==
                "Rejected" &&
                application.status !==
                  "Selected" && (
                  <Button
                    variant="danger"
                    disabled={actionLoading}
                    onClick={() =>
                      updateStatus("Rejected")
                    }
                  >
                    <XCircle size={17} />
                    Reject
                  </Button>
                )}

              {application.status ===
                "Shortlisted" && (
                <Button
                  variant="success"
                  disabled={actionLoading}
                  onClick={() =>
                    updateStatus("Selected")
                  }
                >
                  <CheckCircle2 size={17} />
                  Select
                </Button>
              )}

            </div>

          </div>

        </Card>

        <div className="grid grid-cols-3 gap-6">

          {/* Personal Information */}
          <Card className="col-span-2">

            <div className="mb-6 flex items-center gap-3 border-b border-gray-100 pb-5">

              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <User size={19} />
              </div>

              <div>
                <h3 className="font-semibold text-gray-900">
                  Personal Information
                </h3>

                <p className="text-xs text-gray-500">
                  Applicant contact details
                </p>
              </div>

            </div>

            <div className="grid grid-cols-2 gap-6">

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  Full Name
                </p>

                <p className="mt-1 text-sm font-medium text-gray-800">
                  {student?.name || "Not available"}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  Email
                </p>

                <div className="mt-1 flex items-center gap-2">
                  <Mail
                    size={15}
                    className="text-gray-400"
                  />

                  <p className="text-sm text-gray-800">
                    {student?.email || "Not available"}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  Phone
                </p>

                <div className="mt-1 flex items-center gap-2">
                  <Phone
                    size={15}
                    className="text-gray-400"
                  />

                  <p className="text-sm text-gray-800">
                    {student?.phone || "Not available"}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  Enrollment Number
                </p>

                <p className="mt-1 text-sm font-medium text-gray-800">
                  {profile?.enrollmentNumber ||
                    "Not available"}
                </p>
              </div>

            </div>

          </Card>

          {/* Application Summary */}
          <Card>

            <div className="mb-5 flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                <Clock3 size={19} />
              </div>

              <h3 className="font-semibold text-gray-900">
                Application
              </h3>

            </div>

            <div className="space-y-5">

              <div>
                <p className="text-xs text-gray-400">
                  Current Status
                </p>

                <div className="mt-1">
                  <Badge
                    variant={getStatusVariant(
                      application.status
                    )}
                  >
                    {application.status}
                  </Badge>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-400">
                  Current Round
                </p>

                <p className="mt-1 text-sm font-medium text-gray-800">
                  {application.currentRound ||
                    "Application"}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400">
                  Applied Date
                </p>

                <p className="mt-1 text-sm font-medium text-gray-800">
                  {application.appliedAt
                    ? new Date(
                        application.appliedAt
                      ).toLocaleDateString("en-IN")
                    : "—"}
                </p>
              </div>

            </div>

          </Card>

          {/* Academic Information */}
          <Card className="col-span-2">

            <div className="mb-6 flex items-center gap-3 border-b border-gray-100 pb-5">

              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
                <GraduationCap size={20} />
              </div>

              <div>
                <h3 className="font-semibold text-gray-900">
                  Academic Information
                </h3>

                <p className="text-xs text-gray-500">
                  Student academic profile
                </p>
              </div>

            </div>

            <div className="grid grid-cols-3 gap-6">

              <div>
                <p className="text-xs text-gray-400">
                  College
                </p>

                <p className="mt-1 text-sm font-medium text-gray-800">
                  {profile?.college || "Not available"}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400">
                  Branch
                </p>

                <p className="mt-1 text-sm font-medium text-gray-800">
                  {profile?.branch || "Not available"}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400">
                  Semester
                </p>

                <p className="mt-1 text-sm font-medium text-gray-800">
                  {profile?.semester || "Not available"}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400">
                  Passing Year
                </p>

                <p className="mt-1 text-sm font-medium text-gray-800">
                  {profile?.passingYear || "Not available"}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400">
                  CGPA
                </p>

                <p className="mt-1 text-sm font-semibold text-gray-800">
                  {profile?.cgpa ?? "Not available"}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400">
                  10th Percentage
                </p>

                <p className="mt-1 text-sm font-medium text-gray-800">
                  {profile?.tenthPercentage ?? "Not available"}%
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400">
                  12th Percentage
                </p>

                <p className="mt-1 text-sm font-medium text-gray-800">
                  {profile?.twelfthPercentage ?? "Not available"}%
                </p>
              </div>

            </div>

          </Card>

          {/* Resume */}
          <Card>

            <div className="mb-5 flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 text-red-600">
                <FileText size={19} />
              </div>

              <h3 className="font-semibold text-gray-900">
                Resume
              </h3>

            </div>

            {application.resume ? (
              <div>

                <p className="text-sm text-gray-500">
                  Resume uploaded by applicant.
                </p>

                <a
                  href={getResumeUrl(
                    application.resume
                  )}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
                >
                  <FileText size={16} />
                  View Resume
                </a>

              </div>
            ) : (
              <p className="text-sm text-gray-400">
                Resume not uploaded.
              </p>
            )}

          </Card>

          {/* Skills */}
          <Card className="col-span-2">

            <h3 className="mb-4 font-semibold text-gray-900">
              Skills
            </h3>

            {profile?.skills?.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {profile.skills.map(
                  (skill, index) => (
                    <span
                      key={index}
                      className="rounded-lg bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700"
                    >
                      {skill}
                    </span>
                  )
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-400">
                No skills added.
              </p>
            )}

          </Card>

          {/* Drive Information */}
          <Card>

            <h3 className="mb-5 font-semibold text-gray-900">
              Applied For
            </h3>

            <div className="space-y-4">

              <div>
                <p className="text-xs text-gray-400">
                  Job Role
                </p>

                <p className="mt-1 text-sm font-semibold text-gray-800">
                  {drive?.jobTitle ||
                    "Not available"}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400">
                  Package
                </p>

                <p className="mt-1 text-sm font-medium text-gray-800">
                  {drive?.package ||
                    "Not specified"}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400">
                  Location
                </p>

                <p className="mt-1 text-sm font-medium text-gray-800">
                  {drive?.location ||
                    "Not specified"}
                </p>
              </div>

            </div>

          </Card>

          {/* Recruiter Remarks */}
          {application.recruiterRemarks && (
            <Card className="col-span-3">

              <h3 className="font-semibold text-gray-900">
                Recruiter Remarks
              </h3>

              <p className="mt-3 text-sm leading-6 text-gray-600">
                {application.recruiterRemarks}
              </p>

            </Card>
          )}

        </div>

      </div>
    </DashboardLayout>
  );
};

export default ApplicantDetails;
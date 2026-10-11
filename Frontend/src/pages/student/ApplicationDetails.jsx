import { useEffect, useState } from "react";
import {
  ArrowLeft,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  MapPin,
  MessageSquare,
  XCircle,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import DashboardLayout from "../../components/layout/DashboardLayout";
import Card from "../../components/common/Card";
import Badge from "../../components/common/Badge";
import Loader from "../../components/common/Loader";

import { getApplicationById } from "../../services/applicationService";

const ApplicationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchApplication();
  }, [id]);

  const fetchApplication = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getApplicationById(id);

      if (data.success) {
        setApplication(data.application);
      } else {
        setError(
          data.message || "Unable to load application"
        );
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load application"
      );
    } finally {
      setLoading(false);
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
        return <CheckCircle2 size={20} />;
      case "Rejected":
        return <XCircle size={20} />;
      case "Shortlisted":
        return <Clock3 size={20} />;
      default:
        return <FileText size={20} />;
    }
  };

  if (loading) {
    return (
      <DashboardLayout
        title="Application Details"
        description="Track your placement application"
      >
        <div className="flex min-h-[500px] items-center justify-center">
          <Loader />
        </div>
      </DashboardLayout>
    );
  }

  if (error || !application) {
    return (
      <DashboardLayout title="Application Details">
        <Card>
          <div className="py-12 text-center">
            <p className="text-sm text-red-600">
              {error || "Application not found"}
            </p>

            <button
              onClick={() =>
                navigate("/student/applications")
              }
              className="mt-4 text-sm font-semibold text-blue-600 hover:underline"
            >
              Back to My Applications
            </button>
          </div>
        </Card>
      </DashboardLayout>
    );
  }

  const drive = application.drive;
  const company = application.company;

  return (
    <DashboardLayout
      title="Application Details"
      description="Track your placement application"
    >
      <div className="space-y-6">

        {/* Back */}
        <button
          onClick={() =>
            navigate("/student/applications")
          }
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-blue-600"
        >
          <ArrowLeft size={17} />
          Back to My Applications
        </button>

        {/* Application Header */}
        <Card className="overflow-hidden p-0">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-8 text-white">
            <div className="flex items-start justify-between">

              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/15">
                  <Building2 size={26} />
                </div>

                <div>
                  <p className="text-sm text-blue-100">
                    {company?.companyName || "Company"}
                  </p>

                  <h1 className="mt-1 text-2xl font-bold">
                    {drive?.jobTitle || "Job Role"}
                  </h1>

                  <div className="mt-3 flex items-center gap-4 text-sm text-blue-100">
                    <span className="flex items-center gap-1.5">
                      <MapPin size={15} />
                      {drive?.location || "Location not specified"}
                    </span>

                    <span className="flex items-center gap-1.5">
                      <CalendarDays size={15} />
                      Applied {formatDate(application.appliedAt)}
                    </span>
                  </div>
                </div>
              </div>

              <Badge variant={getStatusVariant(application.status)}>
                {application.status}
              </Badge>

            </div>
          </div>

          <div className="grid grid-cols-4 divide-x divide-gray-100">

            <InfoItem
              label="Current Status"
              value={application.status}
            />

            <InfoItem
              label="Current Round"
              value={application.currentRound || "Application"}
            />

            <InfoItem
              label="Package"
              value={drive?.package || "Not specified"}
            />

            <InfoItem
              label="Applied On"
              value={formatDate(application.appliedAt)}
            />

          </div>
        </Card>

        <div className="grid grid-cols-3 gap-6">

          {/* Main */}
          <div className="col-span-2 space-y-6">

            {/* Application Status */}
            <Card>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <BriefcaseBusiness size={19} />
                </div>

                <div>
                  <h2 className="font-semibold text-gray-900">
                    Application Status
                  </h2>

                  <p className="text-xs text-gray-500">
                    Current progress of your application
                  </p>
                </div>
              </div>

              <div className="mt-7">

                <StatusTimeline
                  application={application}
                />

              </div>
            </Card>

            {/* Recruiter Remarks */}
            {application.recruiterRemarks && (
              <Card>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                    <MessageSquare size={19} />
                  </div>

                  <div>
                    <h2 className="font-semibold text-gray-900">
                      Recruiter Remarks
                    </h2>

                    <p className="text-xs text-gray-500">
                      Feedback from the recruiter
                    </p>
                  </div>
                </div>

                <div className="mt-5 rounded-lg bg-gray-50 p-4">
                  <p className="whitespace-pre-line text-sm leading-6 text-gray-600">
                    {application.recruiterRemarks}
                  </p>
                </div>
              </Card>
            )}

            {/* Job Information */}
            <Card>
              <h2 className="font-semibold text-gray-900">
                Job Information
              </h2>

              <div className="mt-5 space-y-4">

                <InfoRow
                  label="Company"
                  value={
                    company?.companyName || "Not specified"
                  }
                />

                <InfoRow
                  label="Job Role"
                  value={
                    drive?.jobTitle || "Not specified"
                  }
                />

                <InfoRow
                  label="Employment Type"
                  value={
                    drive?.employmentType || "Not specified"
                  }
                />

                <InfoRow
                  label="Location"
                  value={
                    drive?.location || "Not specified"
                  }
                />

                <InfoRow
                  label="Application Deadline"
                  value={formatDate(
                    drive?.applicationDeadline
                  )}
                />

              </div>
            </Card>

          </div>

          {/* Right */}
          <div className="space-y-6">

            {/* Status Card */}
            <Card>
              <div className="flex flex-col items-center text-center">

                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                  {getStatusIcon(application.status)}
                </div>

                <h2 className="mt-4 text-lg font-semibold text-gray-900">
                  {application.status}
                </h2>

                <p className="mt-1 text-sm leading-6 text-gray-500">
                  {getStatusMessage(application.status)}
                </p>

                <Badge
                  variant={getStatusVariant(
                    application.status
                  )}
                >
                  {application.status}
                </Badge>

              </div>
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
                    {company?.companyName || "Company"}
                  </p>

                  <p className="text-xs text-gray-500">
                    {company?.location ||
                      drive?.location ||
                      "Location not specified"}
                  </p>
                </div>
              </div>
            </Card>

          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

const InfoItem = ({ label, value }) => {
  return (
    <div className="p-5">
      <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
        {label}
      </p>

      <p className="mt-2 text-sm font-semibold text-gray-900">
        {value}
      </p>
    </div>
  );
};

const InfoRow = ({ label, value }) => {
  return (
    <div className="flex items-center justify-between border-b border-gray-100 pb-3">
      <span className="text-sm text-gray-500">
        {label}
      </span>

      <span className="max-w-[60%] text-right text-sm font-medium text-gray-800">
        {value}
      </span>
    </div>
  );
};

const StatusTimeline = ({ application }) => {
  const statuses = [
    {
      name: "Application Submitted",
      active: true,
      description: `Applied on ${new Date(
        application.appliedAt
      ).toLocaleDateString("en-IN")}`,
    },
    {
      name: "Shortlisted",
      active: ["Shortlisted", "Selected"].includes(
        application.status
      ),
      description:
        "Application shortlisted by recruiter",
    },
    {
      name: "Selected",
      active: application.status === "Selected",
      description:
        "Successfully selected for the opportunity",
    },
  ];

  if (application.status === "Rejected") {
    statuses.push({
      name: "Application Rejected",
      active: true,
      rejected: true,
      description:
        "Application was not selected for the next stage",
    });
  }

  return (
    <div className="space-y-0">
      {statuses.map((item, index) => (
        <div
          key={item.name}
          className="flex gap-4"
        >
          <div className="flex flex-col items-center">
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-full ${
                item.active
                  ? item.rejected
                    ? "bg-red-50 text-red-600"
                    : "bg-blue-50 text-blue-600"
                  : "bg-gray-100 text-gray-400"
              }`}
            >
              {item.rejected ? (
                <XCircle size={18} />
              ) : (
                <CheckCircle2 size={18} />
              )}
            </div>

            {index !== statuses.length - 1 && (
              <div
                className={`h-12 w-px ${
                  item.active
                    ? "bg-blue-200"
                    : "bg-gray-200"
                }`}
              />
            )}
          </div>

          <div className="pb-7">
            <p
              className={`text-sm font-semibold ${
                item.active
                  ? "text-gray-900"
                  : "text-gray-400"
              }`}
            >
              {item.name}
            </p>

            <p className="mt-1 text-xs text-gray-500">
              {item.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

const getStatusMessage = (status) => {
  switch (status) {
    case "Selected":
      return "Congratulations! You have been selected for this opportunity.";

    case "Shortlisted":
      return "Your application has been shortlisted. Keep an eye on upcoming rounds.";

    case "Rejected":
      return "This application was not selected for the next stage.";

    default:
      return "Your application has been submitted and is currently under review.";
  }
};

export default ApplicationDetails;
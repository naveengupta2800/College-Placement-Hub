import {
  ArrowRight,
  BriefcaseBusiness,
  CalendarDays,
  MapPin,
} from "lucide-react";

import Badge from "../../components/common/Badge";

const DriveCard = ({ drive }) => {
  const deadline = drive.applicationDeadline
    ? new Date(
        drive.applicationDeadline
      ).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "N/A";

  return (
    <div className="flex items-center justify-between px-6 py-5 transition hover:bg-gray-50">

      <div className="flex items-center gap-4">

        {/* Company Icon */}
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          <BriefcaseBusiness size={20} />
        </div>

        {/* Drive Information */}
        <div>

          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-gray-900">
              {drive.jobTitle}
            </h3>

            <Badge variant="success">
              Approved
            </Badge>
          </div>

          <p className="mt-1 text-sm font-medium text-gray-600">
            {drive.company?.companyName ||
              "Company"}
          </p>

          <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">

            <span className="font-medium text-emerald-600">
              {drive.package || "Package not specified"}
            </span>

            <span className="flex items-center gap-1">
              <MapPin size={13} />
              {drive.location || "Not specified"}
            </span>

            <span className="flex items-center gap-1">
              <CalendarDays size={13} />
              Deadline: {deadline}
            </span>

          </div>

        </div>
      </div>

      {/* Action */}
      <button
        onClick={() =>
          (window.location.href =
            `/student/drives/${drive._id}`)
        }
        className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3.5 py-2 text-xs font-semibold text-gray-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
      >
        View Details
        <ArrowRight size={14} />
      </button>

    </div>
  );
};

export default DriveCard;
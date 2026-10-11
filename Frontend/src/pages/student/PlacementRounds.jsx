import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Clock3,
  MapPin,
  Video,
  Building2,
  BriefcaseBusiness,
  ExternalLink,
} from "lucide-react";

import DashboardLayout from "../../components/layout/DashboardLayout";
import Card from "../../components/common/Card";
import Badge from "../../components/common/Badge";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";

import { getStudentRounds } from "../../services/roundService";

const PlacementRounds = () => {
  const [rounds, setRounds] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchRounds();
  }, []);

  const fetchRounds = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getStudentRounds();

      if (data.success) {
        setRounds(data.rounds || []);
      } else {
        setError(data.message || "Unable to load placement rounds");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load placement rounds"
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

  const formatTime = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case "Scheduled":
        return "info";

      case "Completed":
        return "success";

      case "Cancelled":
        return "danger";

      default:
        return "default";
    }
  };

  const filteredRounds = useMemo(() => {
    if (filter === "All") return rounds;

    return rounds.filter(
      (round) => round.status === filter
    );
  }, [rounds, filter]);

  const stats = useMemo(() => {
    return {
      total: rounds.length,

      scheduled: rounds.filter(
        (round) => round.status === "Scheduled"
      ).length,

      completed: rounds.filter(
        (round) => round.status === "Completed"
      ).length,

      cancelled: rounds.filter(
        (round) => round.status === "Cancelled"
      ).length,
    };
  }, [rounds]);

  return (
    <DashboardLayout
      title="Placement Rounds"
      description="View your upcoming and completed placement rounds"
    >
      <div className="space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Placement Rounds
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Stay updated with your placement interview rounds.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-5">

          <RoundStat
            title="Total Rounds"
            value={stats.total}
            icon={<CalendarDays size={20} />}
            bg="bg-blue-50"
            color="text-blue-600"
          />

          <RoundStat
            title="Scheduled"
            value={stats.scheduled}
            icon={<Clock3 size={20} />}
            bg="bg-amber-50"
            color="text-amber-600"
          />

          <RoundStat
            title="Completed"
            value={stats.completed}
            icon={<CalendarDays size={20} />}
            bg="bg-emerald-50"
            color="text-emerald-600"
          />

          <RoundStat
            title="Cancelled"
            value={stats.cancelled}
            icon={<CalendarDays size={20} />}
            bg="bg-red-50"
            color="text-red-600"
          />

        </div>

        {/* Filters */}
        <Card padding="p-4">
          <div className="flex items-center gap-2">

            {[
              "All",
              "Scheduled",
              "Completed",
              "Cancelled",
            ].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                  filter === status
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {status}
              </button>
            ))}

          </div>
        </Card>

        {/* Error */}
        {error && (
          <Card className="border-red-200 bg-red-50">
            <p className="text-sm text-red-600">
              {error}
            </p>

            <button
              onClick={fetchRounds}
              className="mt-2 text-sm font-semibold text-red-700 underline"
            >
              Try again
            </button>
          </Card>
        )}

        {/* Content */}
        {loading ? (
          <div className="flex min-h-[400px] items-center justify-center">
            <Loader />
          </div>
        ) : filteredRounds.length === 0 ? (
          <EmptyState
            icon={<CalendarDays size={28} />}
            title="No placement rounds"
            description={
              filter === "All"
                ? "Your scheduled placement rounds will appear here."
                : `No ${filter.toLowerCase()} rounds found.`
            }
          />
        ) : (
          <div className="space-y-4">
            {filteredRounds.map((round) => (
              <Card
                key={round._id}
                className="transition hover:border-blue-200 hover:shadow-md"
              >
                <div className="flex items-start justify-between">

                  {/* Left */}
                  <div className="flex items-start gap-4">

                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                      <CalendarDays size={22} />
                    </div>

                    <div>
                      <div className="flex items-center gap-3">
                        <h2 className="text-lg font-semibold text-gray-900">
                          {round.name}
                        </h2>

                        <Badge
                          variant={getStatusVariant(
                            round.status
                          )}
                        >
                          {round.status}
                        </Badge>
                      </div>

                      <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">

                        <span className="flex items-center gap-1.5">
                          <Building2 size={15} />
                          {round.drive?.company?.companyName ||
                            round.company?.companyName ||
                            "Company"}
                        </span>

                        <span className="flex items-center gap-1.5">
                          <BriefcaseBusiness size={15} />
                          {round.drive?.jobTitle ||
                            "Placement Drive"}
                        </span>

                      </div>
                    </div>

                  </div>

                </div>

                {/* Details */}
                <div className="mt-6 grid grid-cols-3 gap-4">

                  <RoundDetail
                    icon={<CalendarDays size={17} />}
                    label="Date"
                    value={formatDate(round.date)}
                  />

                  <RoundDetail
                    icon={<Clock3 size={17} />}
                    label="Time"
                    value={formatTime(round.date)}
                  />

                  <RoundDetail
                    icon={
                      round.mode === "Online" ? (
                        <Video size={17} />
                      ) : (
                        <MapPin size={17} />
                      )
                    }
                    label="Mode"
                    value={round.mode}
                  />

                </div>

                {/* Description */}
                {round.description && (
                  <div className="mt-5 rounded-lg bg-gray-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Instructions
                    </p>

                    <p className="mt-2 text-sm leading-6 text-gray-600">
                      {round.description}
                    </p>
                  </div>
                )}

                {/* Bottom */}
                {(round.mode === "Online"
                  ? round.meetingLink
                  : round.location) && (
                  <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-5">

                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      {round.mode === "Online" ? (
                        <>
                          <Video size={16} />
                          Online Interview
                        </>
                      ) : (
                        <>
                          <MapPin size={16} />
                          {round.location}
                        </>
                      )}
                    </div>

                    {round.mode === "Online" &&
                      round.meetingLink && (
                        <a
                          href={round.meetingLink}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                        >
                          Join Meeting
                          <ExternalLink size={15} />
                        </a>
                      )}

                  </div>
                )}

              </Card>
            ))}
          </div>
        )}

      </div>
    </DashboardLayout>
  );
};

const RoundStat = ({
  title,
  value,
  icon,
  bg,
  color,
}) => {
  return (
    <Card className="flex items-center gap-4">
      <div
        className={`flex h-11 w-11 items-center justify-center rounded-xl ${bg} ${color}`}
      >
        {icon}
      </div>

      <div>
        <p className="text-xs font-medium text-gray-500">
          {title}
        </p>

        <p className="mt-1 text-2xl font-bold text-gray-900">
          {value}
        </p>
      </div>
    </Card>
  );
};

const RoundDetail = ({
  icon,
  label,
  value,
}) => {
  return (
    <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-4">
      <div className="text-gray-500">
        {icon}
      </div>

      <div>
        <p className="text-xs text-gray-400">
          {label}
        </p>

        <p className="mt-1 text-sm font-semibold text-gray-800">
          {value}
        </p>
      </div>
    </div>
  );
};

export default PlacementRounds;
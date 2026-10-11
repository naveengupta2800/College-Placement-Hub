import {
  CalendarDays,
  Clock3,
  Video,
} from "lucide-react";

import Badge from "../common/Badge";

const RoundCard = ({ round }) => {
  return (
    <div className="px-6 py-5">

      <div className="flex items-start justify-between">

        <div>
          <p className="text-sm font-bold text-gray-900">
            {round.round}
          </p>

          <p className="mt-1 text-xs font-medium text-gray-500">
            {round.company}
          </p>

          <p className="mt-1 text-xs text-gray-400">
            {round.role}
          </p>
        </div>

        <Badge
          variant={
            round.mode === "Online"
              ? "info"
              : "purple"
          }
        >
          {round.mode}
        </Badge>

      </div>

      <div className="mt-4 space-y-2">

        <div className="flex items-center gap-2 text-xs text-gray-600">
          <CalendarDays
            size={14}
            className="text-gray-400"
          />
          {round.date}
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-600">
          <Clock3
            size={14}
            className="text-gray-400"
          />
          {round.time}
        </div>

      </div>

      {round.mode === "Online" && (
        <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 transition hover:bg-blue-100">
          <Video size={14} />
          Meeting Details
        </button>
      )}

    </div>
  );
};

export default RoundCard;
const StatCard = ({
  title,
  value,
  icon = null,
  description = "",
  className = "",
}) => {
  return (
    <div
      className={`rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md ${className}`}
    >
      <div className="flex items-start justify-between gap-4">

        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-500">
            {title}
          </p>

          <h2 className="mt-2 text-2xl font-bold text-gray-900">
            {value}
          </h2>

          {description && (
            <p className="mt-1 text-xs text-gray-500">
              {description}
            </p>
          )}
        </div>

        {icon && (
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-xl text-blue-600">
            {icon}
          </div>
        )}

      </div>
    </div>
  );
};

export default StatCard;
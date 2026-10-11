const PageHeader = ({
  title,
  description = "",
  action = null,
  className = "",
}) => {
  return (
    <div
      className={`mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between ${className}`}
    >
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {title}
        </h1>

        {description && (
          <p className="mt-1 text-sm text-gray-500">
            {description}
          </p>
        )}
      </div>

      {action && (
        <div className="flex items-center gap-2">
          {action}
        </div>
      )}
    </div>
  );
};

export default PageHeader;
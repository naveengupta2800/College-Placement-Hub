const EmptyState = ({
  icon,
  title,
  description,
}) => {
  return (
    <div className="flex min-h-[350px] flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white px-6 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gray-100 text-gray-500">
        {icon}
      </div>

      <h3 className="mt-4 text-lg font-semibold text-gray-900">
        {title}
      </h3>

      <p className="mt-1 max-w-md text-sm text-gray-500">
        {description}
      </p>
    </div>
  );
};

export default EmptyState;
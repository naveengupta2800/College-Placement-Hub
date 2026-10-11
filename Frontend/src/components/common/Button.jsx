const Button = ({
  children,
  type = "button",
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  className = "",
  onClick,
}) => {
  const variants = {
    primary:
      "bg-blue-600 text-white hover:bg-blue-700",

    secondary:
      "bg-gray-100 text-gray-700 hover:bg-gray-200",

    success:
      "bg-green-600 text-white hover:bg-green-700",

    danger:
      "bg-red-600 text-white hover:bg-red-700",

    warning:
      "bg-yellow-500 text-white hover:bg-yellow-600",

    outline:
      "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2.5 text-sm",
    lg: "px-5 py-3 text-base",
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`
        inline-flex
        items-center
        justify-center
        gap-2
        rounded-lg
        font-medium
        transition
        duration-200
        disabled:cursor-not-allowed
        disabled:opacity-50
        ${variants[variant] || variants.primary}
        ${sizes[size] || sizes.md}
        ${className}
      `}
    >
      {loading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
      )}

      {loading ? "Loading..." : children}
    </button>
  );
};

export default Button;
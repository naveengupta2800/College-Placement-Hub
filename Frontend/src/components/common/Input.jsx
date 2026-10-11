const Input = ({
  label,
  name,
  type = "text",
  value = "",
  onChange,
  placeholder = "",
  required = false,
  disabled = false,
  error = "",
  className = "",
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={name}
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          {label}

          {required && (
            <span className="ml-1 text-red-500">
              *
            </span>
          )}
        </label>
      )}

      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={`
          w-full
          rounded-lg
          border
          bg-white
          px-4
          py-2.5
          text-sm
          text-gray-900
          outline-none
          transition
          placeholder:text-gray-400
          disabled:cursor-not-allowed
          disabled:bg-gray-100
          disabled:text-gray-500
          ${
            error
              ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
              : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          }
          ${className}
        `}
        {...props}
      />

      {error && (
        <p className="mt-1.5 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;
const Card = ({
  children,
  className = "",
  padding = true,
}) => {
  return (
    <div
      className={`rounded-xl border border-gray-200 bg-white shadow-sm ${
        padding ? "p-6" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;
const Modal = ({
  isOpen,
  onClose,
  title,
  children,
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >

        {/* Header */}

        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">

          <h2 className="text-lg font-semibold text-gray-900">
            {title}
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-xl text-gray-500 transition hover:bg-gray-100 hover:text-gray-800"
          >
            ×
          </button>

        </div>

        {/* Content */}

        <div className="p-6">
          {children}
        </div>

      </div>
    </div>
  );
};

export default Modal;
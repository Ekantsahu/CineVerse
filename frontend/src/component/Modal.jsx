const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">

      {/* Modal */}
      <div className="relative w-full max-w-xl bg-[#111214] border border-white/10 rounded-2xl shadow-2xl">

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="
            absolute
            top-4
            right-4
            w-9
            h-9
            flex
            items-center
            justify-center
            rounded-full
            bg-white/5
            text-gray-400
            text-xl
            hover:bg-white/10
            hover:text-white
            transition
            z-10
          "
          aria-label="Close"
        >
          ×
        </button>

        {/* Content */}
        <div className="p-7 pt-8">
          {children}
        </div>

      </div>
    </div>
  );
};

export default Modal;
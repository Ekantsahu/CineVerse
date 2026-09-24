const GenreForm = ({
  value,
  setValue,
  handleSubmit,
  buttonText = "Submit",
  handleDelete,
}) => {
  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex flex-col sm:flex-row gap-3">

        {/* Input */}
        <input
          type="text"
          placeholder="Write genre name..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="
            flex-1
            bg-[#18191c]
            border border-white/10
            rounded-lg
            px-4 py-3
            text-white
            placeholder-gray-600
            outline-none
            transition
            focus:border-purple-500
            focus:ring-1
            focus:ring-purple-500
          "
        />

        {/* Submit */}
        <button
          type="submit"
          className="
            px-6
            py-3
            rounded-lg
            font-semibold
            text-white
            bg-gradient-to-r
            from-purple-600
            to-pink-500
            hover:opacity-90
            transition
            whitespace-nowrap
          "
        >
          {buttonText}
        </button>

        {/* Delete */}
        {handleDelete && (
          <button
            type="button"
            onClick={handleDelete}
            className="
              px-6
              py-3
              rounded-lg
              font-semibold
              text-red-400
              border
              border-red-500/30
              bg-red-500/5
              hover:bg-red-500/10
              hover:border-red-500/50
              transition
              whitespace-nowrap
            "
          >
            Delete
          </button>
        )}

      </div>
    </form>
  );
};

export default GenreForm;
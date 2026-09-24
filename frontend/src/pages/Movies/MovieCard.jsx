import { Link } from "react-router-dom";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000";

const getImageUrl = (image) => {
  if (!image) return "";

  if (image.startsWith("http")) {
    return image;
  }

  return `${API_URL}${image}`;
};

const MovieCard = ({ movie }) => {
  return (
    <Link
      to={`/movies/${movie._id}`}
      className="group block"
    >
      {/* Poster */}
      <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-[#17181c] border border-white/5 shadow-lg">

        <img
          src={getImageUrl(movie.image)}
          alt={movie.name}
          loading="lazy"
          className="
            h-full
            w-full
            object-cover
            transition-transform
            duration-500
            ease-out
            group-hover:scale-105
          "
        />

        {/* Dark hover gradient */}
        <div
          className="
            absolute
            inset-0
            bg-gradient-to-t
            from-black
            via-black/40
            to-transparent
            opacity-0
            transition-opacity
            duration-300
            group-hover:opacity-100
          "
        />

        {/* Hover content */}
        <div
          className="
            absolute
            inset-x-0
            bottom-0
            p-4
            translate-y-4
            opacity-0
            transition-all
            duration-300
            group-hover:translate-y-0
            group-hover:opacity-100
          "
        >
          <div className="flex items-center gap-2 mb-2">

            <span className="text-xs text-gray-300">
              {movie.year}
            </span>

            {movie.rating > 0 && (
              <>
                <span className="text-gray-500">•</span>

                <span className="text-xs font-semibold text-yellow-400">
                  ★ {Number(movie.rating).toFixed(1)}
                </span>
              </>
            )}

          </div>

          <h3 className="text-sm font-bold text-white line-clamp-2">
            {movie.name}
          </h3>

          <div
            className="
              mt-3
              inline-flex
              items-center
              rounded-lg
              bg-white
              px-3
              py-1.5
              text-xs
              font-bold
              text-black
              transition
              group-hover:bg-purple-500
              group-hover:text-white
            "
          >
            View Details
          </div>
        </div>

      </div>

      {/* Movie information */}
      <div className="pt-3 px-1">

        <h3
          className="
            truncate
            text-sm
            font-semibold
            text-gray-200
            transition-colors
            duration-200
            group-hover:text-purple-400
          "
        >
          {movie.name}
        </h3>

        <div className="flex items-center gap-2 mt-1">

          <span className="text-xs text-gray-500">
            {movie.year}
          </span>

          {movie.rating > 0 && (
            <>
              <span className="text-gray-700">•</span>

              <span className="text-xs text-yellow-500">
                ★ {Number(movie.rating).toFixed(1)}
              </span>
            </>
          )}

        </div>

      </div>
    </Link>
  );
};

export default MovieCard;
import { Link } from "react-router-dom";
import { useState } from "react";
import { useGetAllMoviesQuery } from "../../redux/api/movies";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000";

const getImageUrl = (image) => {
  if (!image) return "";

  if (image.startsWith("http")) {
    return image;
  }

  return `${API_URL}${image}`;
};

const AdminMoviesList = () => {
  const [page, setPage] = useState(1);
  const limit = 12;

  const {
    data,
    isLoading,
    isFetching,
  } = useGetAllMoviesQuery({
    page,
    limit,
  });

  const movies = data?.movies || [];
  const totalMovies = data?.totalMovies || 0;
  const totalPages = data?.totalPages || 1;

  const goToPage = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;

    setPage(newPage);

    // Scroll back to top when changing page
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="min-h-screen bg-[#0f1014] px-4 py-8 text-white sm:px-6 lg:ml-64 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-purple-400">
              Movie Management
            </p>

            <h1 className="text-3xl font-bold tracking-tight">
              All Movies
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Manage and update movies in your CineVerse collection.
            </p>
          </div>

          <div className="rounded-xl border border-white/[0.06] bg-[#15161b] px-4 py-3">
            <span className="text-xs text-gray-500">
              Total Movies
            </span>

            <p className="mt-1 text-xl font-bold text-purple-400">
              {totalMovies}
            </p>
          </div>
        </div>

        <div className="mb-8 h-px bg-white/[0.06]" />

        {/* Loading */}
        {isLoading && (
          <div className="flex min-h-[300px] items-center justify-center">
            <p className="text-gray-500">Loading movies...</p>
          </div>
        )}

        {/* Fetching next page */}
        {!isLoading && isFetching && (
          <div className="mb-5 text-center text-sm text-purple-400">
            Loading page {page}...
          </div>
        )}

        {/* Empty State */}
        {!isLoading && movies.length === 0 && (
          <div className="rounded-2xl border border-white/[0.06] bg-[#15161b] px-6 py-16 text-center">
            <h2 className="text-lg font-semibold text-gray-300">
              No movies found
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Start by adding a movie to your collection.
            </p>

            <Link
              to="/admin/movies/create"
              className="mt-6 inline-flex rounded-xl bg-purple-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-purple-500"
            >
              Create Movie
            </Link>
          </div>
        )}

        {/* Movie Grid */}
        {!isLoading && movies.length > 0 && (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {movies.map((movie) => (
                <div
                  key={movie._id}
                  className="group overflow-hidden rounded-2xl border border-white/[0.06] bg-[#15161b] transition-all duration-300 hover:-translate-y-1 hover:border-purple-500/30 hover:shadow-xl hover:shadow-purple-900/10"
                >
                  {/* Poster */}
                  <Link to={`/admin/movies/update/${movie._id}`}>
                    <div className="relative aspect-[2/3] overflow-hidden bg-[#191a1f]">
                      <img
                        src={getImageUrl(movie.image)}
                        alt={movie.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-70" />

                      <span className="absolute right-3 top-3 rounded-lg border border-white/10 bg-black/60 px-3 py-1 text-xs font-medium text-gray-200 backdrop-blur-md">
                        {movie.year}
                      </span>

                      <div className="absolute bottom-0 left-0 right-0 translate-y-2 p-4 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                        <span className="text-xs font-medium text-purple-400">
                          Manage Movie
                        </span>
                      </div>
                    </div>
                  </Link>

                  {/* Content */}
                  <div className="p-4">
                    <h2 className="truncate text-base font-semibold text-white">
                      {movie.name}
                    </h2>

                    <p className="mt-2 line-clamp-2 text-xs leading-5 text-gray-500">
                      {movie.detail}
                    </p>

                    <div className="mt-4 flex items-center justify-between border-t border-white/[0.06] pt-4">
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-gray-600">
                          Reviews
                        </p>

                        <p className="mt-1 text-sm font-semibold text-gray-300">
                          {movie.numReviews || 0}
                        </p>
                      </div>

                      <Link
                        to={`/admin/movies/update/${movie._id}`}
                        className="rounded-lg bg-purple-600/10 px-3 py-2 text-xs font-semibold text-purple-400 transition hover:bg-purple-600 hover:text-white"
                      >
                        Update
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-10 flex flex-col items-center gap-4">
                <div className="flex items-center gap-2">

                  {/* Previous */}
                  <button
                    onClick={() => goToPage(page - 1)}
                    disabled={page === 1 || isFetching}
                    className="rounded-lg border border-white/10 bg-[#15161b] px-4 py-2 text-sm text-gray-300 transition hover:border-purple-500/40 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    ← Previous
                  </button>

                  {/* Page Numbers */}
                  <div className="flex items-center gap-1">
                    {Array.from(
                      { length: totalPages },
                      (_, index) => index + 1
                    ).map((pageNumber) => (
                      <button
                        key={pageNumber}
                        onClick={() => goToPage(pageNumber)}
                        disabled={isFetching}
                        className={`h-9 min-w-9 rounded-lg px-3 text-sm font-medium transition ${
                          page === pageNumber
                            ? "bg-purple-600 text-white"
                            : "bg-[#15161b] text-gray-400 hover:bg-purple-600/10 hover:text-white"
                        }`}
                      >
                        {pageNumber}
                      </button>
                    ))}
                  </div>

                  {/* Next */}
                  <button
                    onClick={() => goToPage(page + 1)}
                    disabled={page === totalPages || isFetching}
                    className="rounded-lg border border-white/10 bg-[#15161b] px-4 py-2 text-sm text-gray-300 transition hover:border-purple-500/40 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    Next →
                  </button>
                </div>

                {/* Page info */}
                <p className="text-xs text-gray-600">
                  Page {page} of {totalPages} • {totalMovies} movies
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminMoviesList;
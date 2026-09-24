import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useGetAllMoviesQuery } from "../../redux/api/movies";
import { useFetchGenresQuery } from "../../redux/api/genre";
import MovieCard from "./MovieCard";

import banner from "../../assets/banner.jpg";

import { setMoviesFilter } from "../../redux/features/movies/moviesSlice";

const AllMovies = () => {
  const dispatch = useDispatch();

  const { moviesFilter } = useSelector(
    (state) => state.movies
  );

  const [page, setPage] = useState(1);

  const searchTerm = moviesFilter?.searchTerm || "";
  const selectedGenre = moviesFilter?.selectedGenre || "";
  const selectedYear = moviesFilter?.selectedYear || "";
  const selectedSort = moviesFilter?.selectedSort || "";

  const {
    data,
    isLoading,
    isFetching,
  } = useGetAllMoviesQuery({
    page,
    limit: 12,
    genre: selectedGenre,
    year: selectedYear,
    search: searchTerm,
    sort: selectedSort,
  });

  const { data: genres = [] } = useFetchGenresQuery();

  const movies = data?.movies || [];
  const totalMovies = data?.totalMovies || 0;
  const totalPages = data?.totalPages || 1;

  // Reset to page 1 when a filter changes
  useEffect(() => {
    setPage(1);
  }, [
    searchTerm,
    selectedGenre,
    selectedYear,
    selectedSort,
  ]);

  // Search
  const handleSearchChange = (e) => {
    dispatch(
      setMoviesFilter({
        searchTerm: e.target.value,
      })
    );
  };

  // Genre
  const handleGenreChange = (e) => {
    dispatch(
      setMoviesFilter({
        selectedGenre: e.target.value,
      })
    );
  };

  // Year
  const handleYearChange = (e) => {
    dispatch(
      setMoviesFilter({
        selectedYear: e.target.value,
      })
    );
  };

  // Sort
  const handleSortChange = (e) => {
    dispatch(
      setMoviesFilter({
        selectedSort: e.target.value,
      })
    );
  };

  // Pagination
  const goToPage = (newPage) => {
    if (newPage < 1 || newPage > totalPages) {
      return;
    }

    setPage(newPage);

    window.scrollTo({
      top: 520,
      behavior: "smooth",
    });
  };

  /*
    We only receive 12 movies from the backend now,
    so we cannot use them to generate every possible year.
    Keep the year filter simple for now.
  */
  const movieYears = movies.map((movie) => movie.year);

  const uniqueYears = Array.from(
    new Set(movieYears)
  ).sort((a, b) => b - a);

  return (
    <div className="min-h-screen bg-[#08090b] text-white">

      {/* ================= HERO ================= */}

      <section className="relative h-[520px] overflow-hidden md:h-[600px]">

        <img
          src={banner}
          alt="CineVerse"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#08090b] via-black/60 to-black/20" />

        <div className="relative z-10 mx-auto flex h-full max-w-7xl items-center px-6">

          <div className="max-w-3xl pt-16">

            <p className="mb-4 text-sm uppercase tracking-[0.35em] text-purple-400 md:text-base">
              Welcome to CineVerse
            </p>

            <h1 className="mb-5 text-5xl font-extrabold leading-tight md:text-7xl">
              Discover Your

              <span className="block bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                Next Movie
              </span>
            </h1>

            <p className="max-w-2xl text-base leading-relaxed text-gray-300 md:text-lg">
              Explore movies, discover new stories, and find something worth
              watching tonight.
            </p>

          </div>

        </div>
      </section>

      {/* ================= FILTER BAR ================= */}

      <section className="relative z-20 -mt-10 px-4 md:px-8">

        <div className="mx-auto max-w-6xl">

          <div className="rounded-2xl border border-white/10 bg-[#111214]/95 p-4 shadow-2xl backdrop-blur-xl md:p-5">

            {/* Search */}

            <div className="relative mb-4">

              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>

              <input
                type="text"
                placeholder="Search movies..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="
                  w-full
                  rounded-xl
                  border
                  border-white/10
                  bg-[#191a1e]
                  py-4
                  pl-12
                  pr-4
                  text-white
                  outline-none
                  placeholder:text-gray-600
                  transition
                  focus:border-purple-500
                  focus:ring-1
                  focus:ring-purple-500
                "
              />

            </div>

            {/* Filters */}

            <div className="mt-8 flex flex-col items-center justify-center gap-4 px-4 md:flex-row">

              {/* Genre */}

              <div className="relative w-full md:w-56">

                <label className="absolute -top-2.5 left-4 z-10 bg-[#0f1014] px-2 text-[11px] font-semibold uppercase tracking-wider text-purple-400">
                  Genre
                </label>

                <select
                  value={selectedGenre}
                  onChange={handleGenreChange}
                  className="
                    w-full
                    appearance-none
                    rounded-xl
                    border
                    border-white/10
                    bg-[#17181c]
                    px-5
                    py-4
                    pr-10
                    text-sm
                    font-medium
                    text-gray-200
                    outline-none
                    transition-all
                    hover:border-purple-500/40
                    focus:border-purple-500
                    focus:ring-2
                    focus:ring-purple-500/20
                  "
                >
                  <option value="">All Genres</option>

                  {genres.map((genre) => (
                    <option key={genre._id} value={genre._id}>
                      {genre.name}
                    </option>
                  ))}
                </select>

                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-purple-400">
                  ▾
                </span>

              </div>

              {/* Year */}

              <div className="relative w-full md:w-56">

                <label className="absolute -top-2.5 left-4 z-10 bg-[#0f1014] px-2 text-[11px] font-semibold uppercase tracking-wider text-purple-400">
                  Release Year
                </label>

                <select
                  value={selectedYear}
                  onChange={handleYearChange}
                  className="
                    w-full
                    appearance-none
                    rounded-xl
                    border
                    border-white/10
                    bg-[#17181c]
                    px-5
                    py-4
                    pr-10
                    text-sm
                    font-medium
                    text-gray-200
                    outline-none
                    transition-all
                    hover:border-purple-500/40
                    focus:border-purple-500
                    focus:ring-2
                    focus:ring-purple-500/20
                  "
                >
                  <option value="">All Years</option>

                  {uniqueYears.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>

                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-purple-400">
                  ▾
                </span>

              </div>

              {/* Sort */}

              <div className="relative w-full md:w-56">

                <label className="absolute -top-2.5 left-4 z-10 bg-[#0f1014] px-2 text-[11px] font-semibold uppercase tracking-wider text-purple-400">
                  Sort By
                </label>

                <select
                  value={selectedSort}
                  onChange={handleSortChange}
                  className="
                    w-full
                    appearance-none
                    rounded-xl
                    border
                    border-white/10
                    bg-[#17181c]
                    px-5
                    py-4
                    pr-10
                    text-sm
                    font-medium
                    text-gray-200
                    outline-none
                    transition-all
                    hover:border-purple-500/40
                    focus:border-purple-500
                    focus:ring-2
                    focus:ring-purple-500/20
                  "
                >
                  <option value="">Default</option>
                  <option value="new">Newest</option>
                  <option value="top">Top Rated</option>
                  <option value="random">Random</option>
                </select>

                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-purple-400">
                  ▾
                </span>

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ================= MOVIES ================= */}

      <section className="mx-auto max-w-7xl px-4 py-14 md:px-8">

        <div className="mb-8 flex items-end justify-between">

          <div>
            <p className="mb-2 text-sm uppercase tracking-widest text-purple-400">
              Explore
            </p>

            <h2 className="text-3xl font-bold md:text-4xl">
              All Movies
            </h2>
          </div>

          <span className="text-sm text-gray-500">
            {totalMovies} movies
          </span>

        </div>

        {/* Loading */}

        {(isLoading || isFetching) && (
          <div className="flex justify-center py-20">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-purple-500/30 border-t-purple-500" />
          </div>
        )}

        {/* Empty */}

        {!isLoading &&
          !isFetching &&
          movies.length === 0 && (
            <div className="py-24 text-center">

              <div className="mb-5 text-5xl">
                🎬
              </div>

              <h3 className="mb-2 text-2xl font-semibold">
                No movies found
              </h3>

              <p className="text-gray-500">
                Try changing your search or filters.
              </p>

            </div>
          )}

        {/* Movie Grid */}

        {!isLoading &&
          !isFetching &&
          movies.length > 0 && (
            <div className="
              grid
              grid-cols-2
              gap-x-5
              gap-y-10
              sm:grid-cols-3
              md:grid-cols-4
              lg:grid-cols-5
              xl:grid-cols-6
            ">
              {movies.map((movie) => (
                <MovieCard
                  key={movie._id}
                  movie={movie}
                />
              ))}
            </div>
          )}

        {/* ================= PAGINATION ================= */}

        {!isLoading && totalPages > 1 && (
          <div className="mt-14 flex flex-col items-center gap-4">

            <div className="flex items-center gap-2">

              <button
                onClick={() => goToPage(page - 1)}
                disabled={page === 1 || isFetching}
                className="
                  rounded-xl
                  border border-white/10
                  bg-[#15161b]
                  px-4 py-2.5
                  text-sm text-gray-300
                  transition
                  hover:border-purple-500/40
                  hover:text-white
                  disabled:cursor-not-allowed
                  disabled:opacity-30
                "
              >
                ← Previous
              </button>

              <div className="flex gap-1">

                {Array.from(
                  { length: totalPages },
                  (_, index) => index + 1
                ).map((pageNumber) => (
                  <button
                    key={pageNumber}
                    onClick={() => goToPage(pageNumber)}
                    disabled={isFetching}
                    className={`
                      min-w-10
                      rounded-xl
                      px-3 py-2.5
                      text-sm font-medium
                      transition
                      ${
                        page === pageNumber
                          ? "bg-purple-600 text-white shadow-lg shadow-purple-900/30"
                          : "bg-[#15161b] text-gray-400 hover:bg-purple-600/10 hover:text-white"
                      }
                    `}
                  >
                    {pageNumber}
                  </button>
                ))}

              </div>

              <button
                onClick={() => goToPage(page + 1)}
                disabled={page === totalPages || isFetching}
                className="
                  rounded-xl
                  border border-white/10
                  bg-[#15161b]
                  px-4 py-2.5
                  text-sm text-gray-300
                  transition
                  hover:border-purple-500/40
                  hover:text-white
                  disabled:cursor-not-allowed
                  disabled:opacity-30
                "
              >
                Next →
              </button>

            </div>

            <p className="text-xs text-gray-600">
              Page {page} of {totalPages}
            </p>

          </div>
        )}

      </section>
    </div>
  );
};

export default AllMovies;
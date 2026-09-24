import { useState } from "react";
import {
  useGetAllMoviesQuery,
  useGetNewMoviesQuery,
  useGetTopMoviesQuery,
  useGetRandomMoviesQuery,
} from "../../redux/api/movies";

import { useFetchGenresQuery } from "../../redux/api/genre";
import SliderUtil from "../../component/SliderUtil";

const MoviesContainerPage = () => {
  const { data: allMoviesData } = useGetAllMoviesQuery({
    page: 1,
    limit: 50,
  });

  const allMovies = allMoviesData?.movies || [];
  const { data: newMovies = [] } = useGetNewMoviesQuery();
  const { data: topMovies = [] } = useGetTopMoviesQuery();
  const { data: genres = [] } = useFetchGenresQuery();
  const { data: randomMovies = [] } = useGetRandomMoviesQuery();

  const [selectedGenre, setSelectedGenre] = useState(null);

  // Filter ALL movies by selected genre
  const filteredMovies =
    selectedGenre === null
      ? allMovies
      : allMovies.filter((movie) => {
          const movieGenre =
            typeof movie.genre === "object" ? movie.genre?._id : movie.genre;

          return movieGenre === selectedGenre;
        });

  return (
    <section className="mx-auto max-w-7xl px-5 pb-20 lg:px-8">
      {/* Browse by Genre */}
      {genres.length > 0 && (
        <div className="mb-14">
          <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-purple-400">
              Explore
            </p>

            <h2 className="mt-1 text-2xl font-bold md:text-3xl">
              Browse by Genre
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Discover movies based on your favorite genre.
            </p>
          </div>

          {/* Genre Buttons */}
          <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-hide">
            {/* All */}
            <button
              onClick={() => setSelectedGenre(null)}
              className={`whitespace-nowrap rounded-xl px-5 py-2.5 text-sm font-medium transition-all duration-300 ${
                selectedGenre === null
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-900/30"
                  : "border border-white/10 bg-[#17181c] text-gray-400 hover:border-purple-500/30 hover:text-white"
              }`}
            >
              All Movies
            </button>

            {/* Genres */}
            {genres.map((genre) => (
              <button
                key={genre._id}
                onClick={() => setSelectedGenre(genre._id)}
                className={`whitespace-nowrap rounded-xl px-5 py-2.5 text-sm font-medium transition-all duration-300 ${
                  selectedGenre === genre._id
                    ? "bg-purple-600 text-white shadow-lg shadow-purple-900/30"
                    : "border border-white/10 bg-[#17181c] text-gray-400 hover:border-purple-500/30 hover:text-white"
                }`}
              >
                {genre.name}
              </button>
            ))}
          </div>

          {/* Selected Genre Movies */}
          <div className="mt-10">
            <div className="mb-5 flex items-end justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-purple-400">
                  {selectedGenre
                    ? genres.find((genre) => genre._id === selectedGenre)?.name
                    : "All Movies"}
                </p>

                <h3 className="mt-1 text-xl font-bold md:text-2xl">
                  {selectedGenre ? "Movies in this Genre" : "All Movies"}
                </h3>
              </div>

              <span className="text-xs text-gray-500">
                {filteredMovies.length} movies
              </span>
            </div>

            {filteredMovies.length > 0 ? (
              <SliderUtil data={filteredMovies} />
            ) : (
              <div className="rounded-2xl border border-white/[0.06] bg-[#15161b] py-12 text-center">
                <p className="text-sm text-gray-500">
                  No movies found in this genre.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Recommended */}
      <MovieSection
        eyebrow="Recommended"
        title="Choose For You"
        data={randomMovies}
      />

      {/* Popular */}
      <MovieSection eyebrow="Popular" title="Top Movies" data={topMovies} />

      {/* Latest */}
      <MovieSection eyebrow="Latest" title="Latest Movies" data={newMovies} />
    </section>
  );
};

const MovieSection = ({ eyebrow, title, data }) => {
  if (!data?.length) return null;

  return (
    <div className="mb-14">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-purple-400">
            {eyebrow}
          </p>

          <h2 className="mt-1 text-2xl font-bold md:text-3xl">{title}</h2>
        </div>

        <span className="text-xs text-gray-500">{data.length} movies</span>
      </div>

      <SliderUtil data={data} />
    </div>
  );
};

export default MoviesContainerPage;

import { useGetNewMoviesQuery } from "../../redux/api/movies";
import { Link } from "react-router-dom";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000";

const getImageUrl = (image) => {
  if (!image) return "";
  if (image.startsWith("http")) return image;
  return `${API_URL}${image}`;
};

const Header = () => {
  const { data } = useGetNewMoviesQuery();

  const featuredMovie = data?.[0];

  if (!featuredMovie) {
    return (
      <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#15161a] to-[#0c0d0f] p-10">
          <p className="text-sm uppercase tracking-[0.3em] text-red-500">
            Welcome to CineVerse
          </p>

          <h1 className="mt-4 text-4xl font-black md:text-6xl">
            Your movie collection starts here.
          </h1>

          <p className="mt-5 max-w-xl text-gray-400">
            Add movies from the admin dashboard and they'll appear here.
          </p>

          <Link
            to="/movies"
            className="mt-8 inline-block rounded-xl bg-red-600 px-6 py-3 font-semibold transition hover:bg-red-500"
          >
            Browse Movies
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="relative mx-auto max-w-7xl overflow-hidden px-5 py-8 lg:px-8">
      <div className="relative min-h-[500px] overflow-hidden rounded-3xl border border-white/10">
        
        {/* Background */}
        <img
          src={getImageUrl(featuredMovie.image)}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-40"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-[#08090b] via-[#08090b]/85 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#08090b] via-transparent to-transparent" />

        {/* Content */}
        <div className="relative z-10 flex min-h-[500px] max-w-2xl flex-col justify-end p-8 pb-12 md:p-12 md:pb-16">
          <span className="mb-4 w-fit rounded-full border border-red-500/30 bg-red-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-red-400">
            Featured Movie
          </span>

          <h1 className="text-4xl font-black leading-tight md:text-6xl">
            {featuredMovie.name}
          </h1>

          <div className="mt-4 flex items-center gap-3 text-sm text-gray-300">
            <span>{featuredMovie.year}</span>
            <span className="text-gray-600">•</span>
            <span>Movie</span>
          </div>

          <p className="mt-5 line-clamp-3 max-w-xl text-sm leading-7 text-gray-300 md:text-base">
            {featuredMovie.detail}
          </p>

          <div className="mt-7 flex gap-3">
            <Link
              to={`/movies/${featuredMovie._id}`}
              className="rounded-xl bg-white px-6 py-3 font-bold text-black transition hover:bg-gray-200"
            >
              ▶ Watch Details
            </Link>

            <Link
              to="/movies"
              className="rounded-xl border border-white/20 bg-white/10 px-6 py-3 font-semibold backdrop-blur transition hover:bg-white/20"
            >
              Browse
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Header;
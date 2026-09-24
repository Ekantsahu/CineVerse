import {
  useGetTopMoviesQuery,
  useGetAllMoviesQuery,
} from "../../../../redux/api/movies";
import { useGetUsersQuery } from "../../../../redux/api/users";

import SecondaryCard from "./SecondaryCard";
import VideoCard from "./VideoCard";
import RealTimeCard from "./RealTimeCard";

const Main = () => {
  const { data: topMovies = [] } = useGetTopMoviesQuery();
  const { data: visitors = [] } = useGetUsersQuery();
  const { data: allMoviesData } = useGetAllMoviesQuery({
    page: 1,
    limit: 12,
  });

  const allMovies = allMoviesData?.movies || [];
  const totalComments = allMovies.reduce(
    (total, movie) => total + (movie.numReviews || 0),
    0,
  );

  return (
    <main className="min-h-screen bg-[#0f1014] px-4 py-6 text-white sm:px-6 lg:ml-64 lg:px-8 xl:px-10">
      {/* Background glow */}
      <div className="pointer-events-none fixed right-0 top-0 -z-0 h-96 w-96 rounded-full bg-purple-600/5 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-[1600px]">
        {/* Header */}
        <header className="mb-8 border-b border-white/[0.06] pb-6">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-purple-400">
                Admin Dashboard
              </p>

              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Welcome back
              </h1>

              <p className="mt-2 text-sm text-gray-500">
                Manage your movies, users and platform activity.
              </p>
            </div>

            <div className="rounded-xl border border-white/[0.06] bg-[#15161b] px-4 py-3">
              <p className="text-xs text-gray-500">Platform Status</p>

              <div className="mt-1 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/50" />
                <span className="text-sm font-medium text-gray-300">
                  Active
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_350px]">
          {/* Left */}
          <section>
            {/* Statistics */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <SecondaryCard
                pill="Users"
                content={visitors.length}
                info="Total registered users"
                gradient="from-purple-600 to-indigo-500"
              />

              <SecondaryCard
                pill="Comments"
                content={totalComments}
                info="Total movie reviews"
                gradient="from-amber-500 to-orange-500"
              />

              <SecondaryCard
                pill="Movies"
                content={allMovies.length}
                info="Movies in database"
                gradient="from-purple-500 to-pink-500"
              />
            </div>

            {/* Top Movies */}
            <div className="mt-8 overflow-hidden rounded-2xl border border-white/[0.06] bg-[#15161b]">
              {/* Section Header */}
              <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-5 sm:px-6">
                <div>
                  <h2 className="text-lg font-semibold text-white">
                    Top Content
                  </h2>

                  <p className="mt-1 text-xs text-gray-500">
                    Your most reviewed movies
                  </p>
                </div>

                <span className="rounded-lg bg-purple-500/10 px-3 py-1.5 text-xs font-medium text-purple-400">
                  {topMovies.length} movies
                </span>
              </div>

              {/* Movies */}
              <div className="divide-y divide-white/[0.05]">
                {topMovies.length > 0 ? (
                  topMovies.map((movie) => (
                    <div
                      key={movie._id}
                      className="transition-colors duration-200 hover:bg-white/[0.02]"
                    >
                      <VideoCard
                        image={movie.image}
                        title={movie.name}
                        date={movie.year}
                        comments={movie.numReviews}
                      />
                    </div>
                  ))
                ) : (
                  <div className="px-6 py-14 text-center">
                    <p className="text-sm text-gray-500">No movies available</p>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Right Panel */}
          <aside>
            <div className="sticky top-6">
              <RealTimeCard />
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default Main;

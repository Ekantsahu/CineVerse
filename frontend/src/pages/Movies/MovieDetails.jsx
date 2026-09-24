import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  useGetSpecificMovieQuery,
  useAddMovieReviewMutation,
} from "../../redux/api/movies";
import MovieTabs from "./MovieTabs";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000";

const getImageUrl = (image) => {
  if (!image) return "";

  if (image.startsWith("http")) {
    return image;
  }

  return `${API_URL}${image}`;
};

const MovieDetails = () => {
  const { id: movieId } = useParams();

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const { data: movie, refetch } = useGetSpecificMovieQuery(movieId);
  const { userInfo } = useSelector((state) => state.auth);

  const [createReview, { isLoading: loadingMovieReview }] =
    useAddMovieReviewMutation();

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await createReview({
        id: movieId,
        rating,
        comment,
      }).unwrap();

      setRating(0);
      setComment("");

      refetch();

      toast.success("Review created successfully");
    } catch (error) {
      toast.error(error.data || error.message);
    }
  };

  if (!movie) {
    return (
      <div className="min-h-screen bg-[#0f1014] flex items-center justify-center">
        <p className="text-gray-400 text-lg">Loading movie...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f1014] text-white">

      {/* Hero */}
      <section className="relative overflow-hidden">

        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20 blur-sm scale-110"
          style={{
            backgroundImage: `url(${getImageUrl(movie.image)})`,
          }}
        />

        {/* Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f1014]/60 via-[#0f1014]/90 to-[#0f1014]" />

        <div className="relative max-w-7xl mx-auto px-6 pt-8">

          {/* Back */}
          <Link
            to="/"
            className="
              inline-flex
              items-center
              gap-2
              text-gray-300
              hover:text-white
              transition
              mb-10
            "
          >
            ← Go Back
          </Link>

          {/* Main movie section */}
          <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-10 items-start">

            {/* Poster */}
            <div className="mx-auto lg:mx-0 w-[260px] sm:w-[300px]">
              <div className="overflow-hidden rounded-2xl shadow-2xl border border-white/10">
                <img
                  src={getImageUrl(movie.image)}
                  alt={movie.name}
                  className="
                    w-full
                    aspect-[2/3]
                    object-cover
                    transition
                    duration-500
                    hover:scale-105
                  "
                />
              </div>
            </div>

            {/* Information */}
            <div className="pt-2">

              <div className="flex flex-wrap items-center gap-3 mb-4">

                <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-sm">
                  {movie.year}
                </span>

                {movie.rating > 0 && (
                  <span className="px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-400 text-sm">
                    ★ {Number(movie.rating).toFixed(1)}
                  </span>
                )}

                <span className="px-3 py-1 rounded-full bg-white/5 text-gray-400 text-sm">
                  {movie.numReviews || 0} Reviews
                </span>

              </div>

              <h1 className="
                text-4xl
                sm:text-5xl
                lg:text-6xl
                font-extrabold
                tracking-tight
                mb-6
              ">
                {movie.name}
              </h1>

              <p className="
                max-w-3xl
                text-gray-400
                text-base
                sm:text-lg
                leading-8
                mb-8
              ">
                {movie.detail}
              </p>

              {/* Cast */}
              <div className="mb-8">

                <h3 className="text-lg font-semibold mb-3">
                  Cast
                </h3>

                <div className="flex flex-wrap gap-2">
                  {movie.cast?.map((actor, index) => (
                    <span
                      key={index}
                      className="
                        px-4
                        py-2
                        rounded-lg
                        bg-[#191a1f]
                        border
                        border-white/10
                        text-gray-300
                        text-sm
                      "
                    >
                      {actor}
                    </span>
                  ))}
                </div>

              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Reviews / Tabs */}
      <section className="max-w-7xl mx-auto px-6 pb-20 pt-10">

        <div className="
          rounded-2xl
          bg-[#15161b]
          border
          border-white/5
          p-5
          sm:p-8
        ">
          <MovieTabs
            loadingMovieReview={loadingMovieReview}
            userInfo={userInfo}
            submitHandler={submitHandler}
            rating={rating}
            setRating={setRating}
            comment={comment}
            setComment={setComment}
            movie={movie}
          />
        </div>

      </section>

    </div>
  );
};

export default MovieDetails;
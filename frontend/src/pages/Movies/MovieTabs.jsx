import { Link } from "react-router-dom";
import { Star, MessageSquare, Send } from "lucide-react";

const MovieTabs = ({
  userInfo,
  submitHandler,
  comment,
  setComment,
  movie,
  rating,
  setRating,
  loadingMovieReview,
}) => {
  return (
    <div className="text-white">

      {/* Write Review */}
      <section>
        {userInfo ? (
          <form onSubmit={submitHandler}>
            <div className="mb-6">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10">
                  <MessageSquare
                    size={19}
                    className="text-purple-400"
                  />
                </div>

                <div>
                  <h3 className="text-lg font-semibold">
                    Write Your Review
                  </h3>

                  <p className="text-xs text-gray-500">
                    Share your thoughts about this movie
                  </p>
                </div>
              </div>

              {/* Rating */}
              <div className="mb-5">
                <label className="mb-3 block text-sm font-medium text-gray-300">
                  Your Rating
                </label>

                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="transition-transform duration-200 hover:scale-110"
                    >
                      <Star
                        size={24}
                        className={
                          star <= rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-600 hover:text-yellow-400"
                        }
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Comment */}
              <textarea
                id="comment"
                rows="5"
                required
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="What did you think about this movie?"
                className="
                  w-full
                  max-w-3xl
                  resize-none
                  rounded-xl
                  border border-white/[0.08]
                  bg-[#0f1014]
                  px-4
                  py-4
                  text-sm
                  text-white
                  outline-none
                  placeholder:text-gray-600
                  transition
                  focus:border-purple-500
                  focus:ring-2
                  focus:ring-purple-500/10
                "
              />

              {/* Submit */}
              <div className="mt-4">
                <button
                  type="submit"
                  disabled={loadingMovieReview || rating === 0}
                  className="
                    inline-flex
                    items-center
                    gap-2
                    rounded-xl
                    bg-gradient-to-r
                    from-purple-600
                    to-indigo-600
                    px-5
                    py-3
                    text-sm
                    font-semibold
                    text-white
                    shadow-lg
                    shadow-purple-900/20
                    transition-all
                    duration-300
                    hover:-translate-y-0.5
                    hover:from-purple-500
                    hover:to-indigo-500
                    disabled:cursor-not-allowed
                    disabled:opacity-40
                  "
                >
                  <Send size={15} />

                  {loadingMovieReview
                    ? "Submitting..."
                    : "Submit Review"}
                </button>
              </div>
            </div>
          </form>
        ) : (
          <div className="rounded-xl border border-white/[0.06] bg-[#0f1014] p-5">
            <p className="text-sm text-gray-400">
              Please{" "}
              <Link
                to="/login"
                className="font-semibold text-purple-400 transition hover:text-purple-300"
              >
                Sign In
              </Link>{" "}
              to write a review.
            </p>
          </div>
        )}
      </section>

      {/* Divider */}
      <div className="my-10 h-px bg-white/[0.06]" />

      {/* Reviews Header */}
      <section>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold">
              Reviews
            </h3>

            <p className="mt-1 text-xs text-gray-500">
              {movie?.reviews?.length || 0}{" "}
              {movie?.reviews?.length === 1
                ? "review"
                : "reviews"}
            </p>
          </div>

          {movie?.rating > 0 && (
            <div className="flex items-center gap-2 rounded-xl border border-yellow-500/10 bg-yellow-500/5 px-4 py-2">
              <Star
                size={16}
                className="fill-yellow-400 text-yellow-400"
              />

              <span className="text-sm font-bold text-yellow-400">
                {Number(movie.rating).toFixed(1)}
              </span>
            </div>
          )}
        </div>

        {/* No Reviews */}
        {(!movie?.reviews || movie.reviews.length === 0) && (
          <div className="rounded-xl border border-white/[0.06] bg-[#0f1014] px-6 py-12 text-center">
            <MessageSquare
              size={32}
              className="mx-auto mb-3 text-gray-700"
            />

            <p className="text-sm text-gray-500">
              No reviews yet.
            </p>

            <p className="mt-1 text-xs text-gray-600">
              Be the first person to review this movie.
            </p>
          </div>
        )}

        {/* Reviews */}
        <div className="space-y-4">
          {movie?.reviews?.map((review) => (
            <div
              key={review._id}
              className="
                rounded-xl
                border border-white/[0.06]
                bg-[#0f1014]
                p-5
                transition
                duration-300
                hover:border-purple-500/20
              "
            >
              {/* Review Header */}
              <div className="flex items-start justify-between gap-4">

                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-500/10 text-sm font-bold text-purple-400">
                    {review.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-gray-200">
                      {review.name}
                    </p>

                    <p className="mt-1 text-[11px] text-gray-600">
                      {review.createdAt
                        ? new Date(
                            review.createdAt
                          ).toLocaleDateString()
                        : ""}
                    </p>
                  </div>
                </div>

                {/* Rating */}
                {review.rating && (
                  <div className="flex items-center gap-1 rounded-lg bg-yellow-500/5 px-2.5 py-1.5">
                    <Star
                      size={13}
                      className="fill-yellow-400 text-yellow-400"
                    />

                    <span className="text-xs font-semibold text-yellow-400">
                      {review.rating}
                    </span>
                  </div>
                )}
              </div>

              {/* Review Text */}
              <p className="mt-5 text-sm leading-7 text-gray-400">
                {review.comment}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default MovieTabs;
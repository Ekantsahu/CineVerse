import {
  useDeleteCommentMutation,
  useGetAllMoviesQuery,
} from "../../redux/api/movies";
import { toast } from "react-toastify";
import { MessageSquare, Trash2, Star } from "lucide-react";

const AllComments = () => {
  const { data: moviesData, refetch } = useGetAllMoviesQuery({
    page: 1,
    limit: 50,
  });

  const movies = moviesData?.movies || [];
  const [deleteComment, { isLoading: deleting }] = useDeleteCommentMutation();

  const handleDeleteComment = async (movieId, reviewId) => {
    try {
      await deleteComment({ movieId, reviewId }).unwrap();

      toast.success("Comment deleted successfully");
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to delete comment");
    }
  };

  const moviesWithReviews = movies.filter((movie) => movie.reviews?.length > 0);

  const totalComments = movies.reduce(
    (total, movie) => total + (movie.reviews?.length || 0),
    0,
  );

  return (
    <div className="min-h-screen bg-[#0f1014] px-4 py-8 text-white sm:px-6 lg:ml-64 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-purple-400">
              Community
            </p>

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Comments
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Manage reviews and comments from your movie audience.
            </p>
          </div>

          {/* Total */}
          <div className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-[#15161b] px-5 py-3">
            <MessageSquare size={18} className="text-purple-400" />

            <div>
              <p className="text-[10px] uppercase tracking-wider text-gray-600">
                Total Comments
              </p>

              <p className="text-lg font-bold text-white">{totalComments}</p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="mb-8 h-px bg-white/[0.06]" />

        {/* Empty State */}
        {moviesWithReviews.length === 0 && (
          <div className="rounded-2xl border border-white/[0.06] bg-[#15161b] px-6 py-16 text-center">
            <MessageSquare size={36} className="mx-auto mb-4 text-gray-700" />

            <h2 className="text-lg font-semibold text-gray-300">
              No comments yet
            </h2>

            <p className="mt-2 text-sm text-gray-600">
              Movie reviews will appear here when users leave comments.
            </p>
          </div>
        )}

        {/* Movies */}
        <div className="space-y-6">
          {moviesWithReviews.map((movie) => (
            <section
              key={movie._id}
              className="overflow-hidden rounded-2xl border border-white/[0.06] bg-[#15161b]"
            >
              {/* Movie Header */}
              <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-5 sm:px-6">
                <div className="flex min-w-0 items-center gap-4">
                  {/* Poster */}
                  <div className="h-14 w-10 flex-shrink-0 overflow-hidden rounded-lg bg-[#1c1d22]">
                    <img
                      src={
                        movie.image?.startsWith("http")
                          ? movie.image
                          : `http://localhost:3000${movie.image}`
                      }
                      alt={movie.name}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="min-w-0">
                    <h2 className="truncate text-base font-semibold text-white">
                      {movie.name}
                    </h2>

                    <p className="mt-1 text-xs text-gray-500">
                      {movie.reviews.length}{" "}
                      {movie.reviews.length === 1 ? "review" : "reviews"}
                    </p>
                  </div>
                </div>

                <div className="hidden rounded-lg bg-purple-500/10 px-3 py-1.5 text-xs font-medium text-purple-400 sm:block">
                  {movie.year}
                </div>
              </div>

              {/* Comments */}
              <div className="divide-y divide-white/[0.05]">
                {movie.reviews.map((review) => (
                  <div
                    key={review._id}
                    className="group px-5 py-5 transition-colors hover:bg-white/[0.015] sm:px-6"
                  >
                    <div className="flex items-start justify-between gap-4">
                      {/* User */}
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-purple-500/10 text-sm font-bold text-purple-400">
                          {review.name?.charAt(0)?.toUpperCase() || "U"}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-gray-200">
                            {review.name}
                          </p>

                          <p className="mt-0.5 text-[11px] text-gray-600">
                            {review.createdAt
                              ? new Date(review.createdAt).toLocaleDateString()
                              : ""}
                          </p>
                        </div>
                      </div>

                      {/* Rating */}
                      <div className="flex flex-shrink-0 items-center gap-1 rounded-lg bg-yellow-500/5 px-2.5 py-1.5">
                        <Star
                          size={12}
                          className="fill-yellow-400 text-yellow-400"
                        />

                        <span className="text-xs font-semibold text-yellow-400">
                          {review.rating}
                        </span>
                      </div>
                    </div>

                    {/* Comment */}
                    <p className="mt-4 max-w-3xl text-sm leading-6 text-gray-400">
                      {review.comment}
                    </p>

                    {/* Delete */}
                    <div className="mt-4 flex justify-end">
                      <button
                        type="button"
                        disabled={deleting}
                        onClick={() =>
                          handleDeleteComment(movie._id, review._id)
                        }
                        className="
                          inline-flex items-center gap-2
                          rounded-lg
                          border border-red-500/10
                          bg-red-500/5
                          px-3 py-2
                          text-xs font-medium
                          text-red-400
                          transition-all duration-200
                          hover:border-red-500/20
                          hover:bg-red-500/10
                          disabled:cursor-not-allowed
                          disabled:opacity-50
                        "
                      >
                        <Trash2 size={14} />

                        {deleting ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllComments;

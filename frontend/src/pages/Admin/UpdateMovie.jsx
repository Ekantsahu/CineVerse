import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useGetSpecificMovieQuery,
  useUpdateMovieMutation,
  useUploadImageMutation,
  useDeleteMovieMutation,
} from "../../redux/api/movies";
import { toast } from "react-toastify";

const UpdateMovie = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [movieData, setMovieData] = useState({
    name: "",
    year: 0,
    detail: "",
    cast: [],
    ratings: 0,
    image: null,
  });

  const [selectedImage, setSelectedImage] = useState(null);

  const { data: initialMovieData, isLoading } =
    useGetSpecificMovieQuery(id);

  const [updateMovie, { isLoading: isUpdatingMovie }] =
    useUpdateMovieMutation();

  const [uploadImage, { isLoading: isUploadingImage }] =
    useUploadImageMutation();

  const [deleteMovie, { isLoading: isDeletingMovie }] =
    useDeleteMovieMutation();

  useEffect(() => {
    if (initialMovieData) {
      setMovieData(initialMovieData);
    }
  }, [initialMovieData]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setMovieData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCastChange = (e) => {
    setMovieData((prevData) => ({
      ...prevData,
      cast: e.target.value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setSelectedImage(file);
    }
  };

  const handleUpdateMovie = async () => {
    try {
      if (
        !movieData.name.trim() ||
        !movieData.year ||
        !movieData.detail.trim() ||
        movieData.cast.length === 0
      ) {
        toast.error("Please fill in all required fields");
        return;
      }

      let uploadedImagePath = movieData.image;

      // Upload new image if selected
      if (selectedImage) {
        const formData = new FormData();
        formData.append("image", selectedImage);

        const uploadResponse = await uploadImage(formData).unwrap();

        uploadedImagePath = uploadResponse.image;
      }

      await updateMovie({
        id,
        updatedMovie: {
          ...movieData,
          image: uploadedImagePath,
          year: Number(movieData.year),
        },
      }).unwrap();

      toast.success("Movie updated successfully");

      navigate("/admin/movies-list");
    } catch (error) {
      console.error("Failed to update movie:", error);

      toast.error(
        error?.data?.message || "Failed to update movie"
      );
    }
  };

  const handleDeleteMovie = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${movieData.name}"?`
    );

    if (!confirmed) return;

    try {
      await deleteMovie(id).unwrap();

      toast.success("Movie deleted successfully");

      navigate("/admin/movies-list");
    } catch (error) {
      console.error("Failed to delete movie:", error);

      toast.error(
        error?.data?.message || "Failed to delete movie"
      );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#08090b] text-white flex items-center justify-center">
        <div className="text-gray-400 text-lg">
          Loading movie...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#08090b] text-white px-4 py-10 md:px-8">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.25em] text-purple-400 mb-2">
            CineVerse Admin
          </p>

          <h1 className="text-3xl md:text-4xl font-bold">
            Update Movie
          </h1>

          <p className="text-gray-500 mt-2">
            Update movie information, cast and poster.
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-[#111214] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">

          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr]">

            {/* Poster Section */}
            <div className="bg-[#0d0e10] p-6 flex flex-col items-center border-b lg:border-b-0 lg:border-r border-white/10">

              <div className="w-full max-w-[220px] aspect-[2/3] rounded-xl overflow-hidden bg-[#18191c] border border-white/10 shadow-xl">

                {selectedImage ? (
                  <img
                    src={URL.createObjectURL(selectedImage)}
                    alt="New movie poster"
                    className="w-full h-full object-cover"
                  />
                ) : movieData.image ? (
                  <img
                    src={movieData.image}
                    alt={movieData.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-600">
                    No Poster
                  </div>
                )}

              </div>

              <label className="mt-5 w-full max-w-[220px] cursor-pointer">

                <div className="w-full text-center bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white font-semibold py-3 rounded-xl transition">
                  {selectedImage
                    ? "Change Poster"
                    : "Upload New Poster"}
                </div>

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />

              </label>

              {selectedImage && (
                <p className="text-xs text-gray-500 mt-3 text-center break-all">
                  {selectedImage.name}
                </p>
              )}
            </div>

            {/* Form Section */}
            <div className="p-6 md:p-8">

              {/* Movie Name */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Movie Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={movieData.name}
                  onChange={handleChange}
                  placeholder="Enter movie name"
                  className="
                    w-full
                    bg-[#18191c]
                    border border-white/10
                    text-white
                    rounded-xl
                    px-4
                    py-3
                    outline-none
                    transition
                    focus:border-purple-500
                    focus:ring-1
                    focus:ring-purple-500
                    placeholder:text-gray-600
                  "
                />
              </div>

              {/* Year + Rating */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Release Year
                  </label>

                  <input
                    type="number"
                    name="year"
                    value={movieData.year}
                    onChange={handleChange}
                    className="
                      w-full
                      bg-[#18191c]
                      border border-white/10
                      text-white
                      rounded-xl
                      px-4
                      py-3
                      outline-none
                      focus:border-purple-500
                      focus:ring-1
                      focus:ring-purple-500
                    "
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Rating
                  </label>

                  <input
                    type="number"
                    name="ratings"
                    min="0"
                    max="10"
                    step="0.1"
                    value={movieData.ratings || 0}
                    onChange={handleChange}
                    className="
                      w-full
                      bg-[#18191c]
                      border border-white/10
                      text-white
                      rounded-xl
                      px-4
                      py-3
                      outline-none
                      focus:border-purple-500
                      focus:ring-1
                      focus:ring-purple-500
                    "
                  />
                </div>

              </div>

              {/* Description */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>

                <textarea
                  name="detail"
                  value={movieData.detail}
                  onChange={handleChange}
                  rows="6"
                  placeholder="Write movie description..."
                  className="
                    w-full
                    bg-[#18191c]
                    border border-white/10
                    text-white
                    rounded-xl
                    px-4
                    py-3
                    outline-none
                    resize-none
                    focus:border-purple-500
                    focus:ring-1
                    focus:ring-purple-500
                    placeholder:text-gray-600
                  "
                />
              </div>

              {/* Cast */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Cast
                </label>

                <input
                  type="text"
                  value={movieData.cast.join(", ")}
                  onChange={handleCastChange}
                  placeholder="Robert Downey Jr, Chris Evans, Chris Hemsworth"
                  className="
                    w-full
                    bg-[#18191c]
                    border border-white/10
                    text-white
                    rounded-xl
                    px-4
                    py-3
                    outline-none
                    focus:border-purple-500
                    focus:ring-1
                    focus:ring-purple-500
                    placeholder:text-gray-600
                  "
                />

                <p className="text-xs text-gray-600 mt-2">
                  Separate actors with commas.
                </p>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-5 border-t border-white/10">

                <button
                  type="button"
                  onClick={handleUpdateMovie}
                  disabled={isUpdatingMovie || isUploadingImage}
                  className="
                    flex-1
                    bg-gradient-to-r
                    from-purple-600
                    to-pink-500
                    hover:from-purple-500
                    hover:to-pink-400
                    disabled:opacity-50
                    disabled:cursor-not-allowed
                    text-white
                    font-semibold
                    py-3
                    rounded-xl
                    transition
                  "
                >
                  {isUploadingImage
                    ? "Uploading Poster..."
                    : isUpdatingMovie
                    ? "Updating Movie..."
                    : "Update Movie"}
                </button>

                <button
                  type="button"
                  onClick={handleDeleteMovie}
                  disabled={
                    isUpdatingMovie ||
                    isUploadingImage ||
                    isDeletingMovie
                  }
                  className="
                    sm:w-36
                    border
                    border-red-500/30
                    text-red-400
                    hover:bg-red-500/10
                    hover:border-red-500/60
                    disabled:opacity-50
                    disabled:cursor-not-allowed
                    font-semibold
                    py-3
                    rounded-xl
                    transition
                  "
                >
                  {isDeletingMovie
                    ? "Deleting..."
                    : "Delete Movie"}
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/admin/movies-list")}
                  className="
                    sm:w-28
                    bg-[#1a1b1f]
                    border border-white/10
                    text-gray-300
                    hover:bg-[#222328]
                    hover:text-white
                    font-semibold
                    py-3
                    rounded-xl
                    transition
                  "
                >
                  Cancel
                </button>

              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateMovie;
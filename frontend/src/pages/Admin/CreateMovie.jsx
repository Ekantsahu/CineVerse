import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useCreateMovieMutation,
  useUploadImageMutation,
} from "../../redux/api/movies";
import { useFetchGenresQuery } from "../../redux/api/genre";
import { toast } from "react-toastify";

const CreateMovie = () => {
  const navigate = useNavigate();

  const [movieData, setMovieData] = useState({
    name: "",
    year: "",
    detail: "",
    cast: [],
    rating: 0,
    image: null,
    genre: "",
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const [createMovie, { isLoading: isCreatingMovie }] =
    useCreateMovieMutation();

  const [uploadImage, { isLoading: isUploadingImage }] =
    useUploadImageMutation();

  const { data: genres = [], isLoading: isLoadingGenres } =
    useFetchGenresQuery();

  useEffect(() => {
    if (genres.length > 0 && !movieData.genre) {
      setMovieData((prev) => ({
        ...prev,
        genre: genres[0]._id,
      }));
    }
  }, [genres, movieData.genre]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setMovieData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setSelectedImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleCreateMovie = async () => {
    if (
      !movieData.name ||
      !movieData.year ||
      !movieData.detail ||
      movieData.cast.length === 0 ||
      !movieData.genre ||
      !selectedImage
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      // Upload image
      const formData = new FormData();
      formData.append("image", selectedImage);

      const uploadResponse = await uploadImage(formData).unwrap();

      if (!uploadResponse?.image) {
        toast.error("Image upload failed");
        return;
      }

      // Create movie
      await createMovie({
        ...movieData,
        image: uploadResponse.image,
      }).unwrap();

      toast.success("Movie added successfully");

      setMovieData({
        name: "",
        year: "",
        detail: "",
        cast: [],
        rating: 0,
        image: null,
        genre: genres[0]?._id || "",
      });

      setSelectedImage(null);
      setPreview(null);

      navigate("/admin/movies-list");
    } catch (error) {
      console.error("Failed to create movie:", error);

      toast.error(
        error?.data?.message || error?.data?.error || "Failed to create movie",
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#08090b] text-white px-6 py-8 lg:ml-[17rem]">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8">
        <h1 className="text-3xl font-bold">Create Movie</h1>

        <p className="text-gray-500 mt-2">
          Add a new movie to your CineVerse collection
        </p>
      </div>

      {/* Form Card */}
      <div className="max-w-6xl mx-auto bg-[#111214] border border-white/10 rounded-2xl shadow-xl overflow-hidden">
        {/* Card Header */}
        <div className="px-8 py-6 border-b border-white/10">
          <h2 className="text-xl font-semibold">Movie Information</h2>

          <p className="text-sm text-gray-500 mt-1">
            Enter the details of the movie you want to add.
          </p>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-10">
            {/* Form */}
            <div className="space-y-6">
              {/* Movie Name */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Movie Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={movieData.name}
                  onChange={handleChange}
                  placeholder="Enter movie name"
                  className="w-full bg-[#18191c] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition"
                />
              </div>

              {/* Year + Genre */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Release Year
                  </label>

                  <input
                    type="number"
                    name="year"
                    value={movieData.year}
                    onChange={handleChange}
                    placeholder="2019"
                    className="w-full bg-[#18191c] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Genre
                  </label>

                  <select
                    name="genre"
                    value={movieData.genre}
                    onChange={handleChange}
                    disabled={isLoadingGenres}
                    className="w-full bg-[#18191c] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition"
                  >
                    {isLoadingGenres ? (
                      <option className="bg-gray-800 text-white">
                        Loading genres...
                      </option>
                    ) : (
                      genres.map((genre) => (
                        <option
                          key={genre._id}
                          value={genre._id}
                          className="bg-gray-800 text-white"
                        >
                          {genre.name}
                        </option>
                      ))
                    )}
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>

                <textarea
                  name="detail"
                  value={movieData.detail}
                  onChange={handleChange}
                  rows="5"
                  placeholder="Write a short description about the movie..."
                  className="w-full bg-[#18191c] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 outline-none resize-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition"
                />
              </div>

              {/* Cast */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Cast
                </label>

                <input
                  type="text"
                  placeholder="Robert Downey Jr., Chris Evans, Chris Hemsworth"
                  value={movieData.cast.join(", ")}
                  onChange={(e) =>
                    setMovieData((prev) => ({
                      ...prev,
                      cast: e.target.value
                        .split(",")
                        .map((item) => item.trim())
                        .filter(Boolean),
                    }))
                  }
                  className="w-full bg-[#18191c] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition"
                />

                <p className="text-xs text-gray-600 mt-2">
                  Separate actors with commas.
                </p>
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Movie Poster
              </label>

              <div className="relative border border-dashed border-white/20 rounded-xl bg-[#18191c] min-h-[380px] flex items-center justify-center overflow-hidden">
                {preview ? (
                  <div className="w-full h-full">
                    <img
                      src={preview}
                      alt="Movie preview"
                      className="w-full h-[380px] object-cover"
                    />

                    <label className="absolute bottom-4 left-1/2 -translate-x-1/2 cursor-pointer bg-black/80 hover:bg-black text-white text-sm px-4 py-2 rounded-lg transition">
                      Change Poster
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                ) : (
                  <label className="cursor-pointer text-center p-8">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400 text-2xl">
                      +
                    </div>

                    <p className="font-medium">Upload Movie Poster</p>

                    <p className="text-sm text-gray-600 mt-2">
                      PNG, JPG or WEBP
                    </p>

                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 mt-10 pt-6 border-t border-white/10">
            <button
              type="button"
              onClick={() => navigate("/admin/movies/dashboard")}
              className="px-6 py-3 rounded-lg border border-white/10 text-gray-300 hover:bg-white/5 transition"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleCreateMovie}
              disabled={isCreatingMovie || isUploadingImage}
              className="px-7 py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCreatingMovie || isUploadingImage
                ? "Creating Movie..."
                : "Create Movie"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateMovie;

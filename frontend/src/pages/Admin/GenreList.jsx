import { useState } from "react";
import {
  useCreateGenreMutation,
  useUpdateGenreMutation,
  useDeleteGenreMutation,
  useFetchGenresQuery,
} from "../../redux/api/genre";

import { toast } from "react-toastify";
import GenreForm from "../../component/GenreForm";
import Modal from "../../component/Modal";

const GenreList = () => {
  const { data: genres = [], refetch } = useFetchGenresQuery();

  const [name, setName] = useState("");
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [updatingName, setUpdatingName] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const [createGenre] = useCreateGenreMutation();
  const [updateGenre] = useUpdateGenreMutation();
  const [deleteGenre] = useDeleteGenreMutation();

  const handleCreateGenre = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Genre name is required");
      return;
    }

    try {
      const result = await createGenre({
        name: name.trim(),
      }).unwrap();

      if (result.error) {
        toast.error(result.error);
        return;
      }

      setName("");
      toast.success(`${result.name} created successfully`);
      refetch();
    } catch (error) {
      console.error(error);
      toast.error(
        error?.data?.message || "Creating genre failed. Try again."
      );
    }
  };

  const handleUpdateGenre = async (e) => {
    e.preventDefault();

    if (!updatingName.trim()) {
      toast.error("Genre name is required");
      return;
    }

    try {
      const result = await updateGenre({
        id: selectedGenre._id,
        updateGenre: {
          name: updatingName.trim(),
        },
      }).unwrap();

      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success(`${result.name} updated successfully`);

      refetch();
      setSelectedGenre(null);
      setUpdatingName("");
      setModalVisible(false);
    } catch (error) {
      console.error(error);
      toast.error("Updating genre failed. Try again.");
    }
  };

  const handleDeleteGenre = async () => {
    try {
      const result = await deleteGenre(selectedGenre._id).unwrap();

      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success(`${result.name} deleted successfully`);

      refetch();
      setSelectedGenre(null);
      setUpdatingName("");
      setModalVisible(false);
    } catch (error) {
      console.error(error);
      toast.error("Genre deletion failed. Try again.");
    }
  };

  return (
    <main className="min-h-screen bg-[#08090b] text-white px-6 py-8 lg:ml-[17rem]">

      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8">
        <h1 className="text-3xl font-bold">
          Manage Genres
        </h1>

        <p className="text-gray-500 mt-2">
          Create and manage movie genres for your CineVerse collection.
        </p>
      </div>

      {/* Main Card */}
      <div className="max-w-6xl mx-auto">

        <div className="bg-[#111214] border border-white/10 rounded-2xl overflow-hidden shadow-xl">

          {/* Card Header */}
          <div className="px-8 py-6 border-b border-white/10">
            <h2 className="text-xl font-semibold">
              Movie Genres
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Add a genre or select an existing genre to edit it.
            </p>
          </div>

          {/* Create Genre */}
          <div className="p-8 border-b border-white/10">

            <h3 className="text-sm font-medium text-gray-300 mb-3">
              Create New Genre
            </h3>

            <form
              onSubmit={handleCreateGenre}
              className="flex flex-col sm:flex-row gap-3 max-w-2xl"
            >
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter genre name..."
                className="flex-1 bg-[#18191c] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition"
              />

              <button
                type="submit"
                className="px-6 py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90 transition"
              >
                Add Genre
              </button>
            </form>

          </div>

          {/* Genre List */}
          <div className="p-8">

            <div className="flex items-center justify-between mb-5">

              <div>
                <h3 className="text-lg font-semibold">
                  Available Genres
                </h3>

                <p className="text-sm text-gray-500">
                  {genres.length} genre
                  {genres.length !== 1 ? "s" : ""} available
                </p>
              </div>

            </div>

            {genres.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">

                {genres.map((genre) => (
                  <button
                    key={genre._id}
                    onClick={() => {
                      setModalVisible(true);
                      setSelectedGenre(genre);
                      setUpdatingName(genre.name);
                    }}
                    className="group relative text-left bg-[#18191c] border border-white/10 rounded-xl p-5 hover:border-purple-500/60 hover:bg-[#1d1e22] transition duration-200"
                  >

                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center mb-4 text-purple-400 font-bold">
                      {genre.name.charAt(0).toUpperCase()}
                    </div>

                    <h4 className="font-semibold text-white truncate">
                      {genre.name}
                    </h4>

                    <p className="text-xs text-gray-600 mt-1 group-hover:text-gray-400 transition">
                      Click to manage
                    </p>

                  </button>
                ))}

              </div>
            ) : (
              <div className="border border-dashed border-white/10 rounded-xl p-12 text-center">

                <div className="w-14 h-14 mx-auto rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400 text-2xl mb-4">
                  +
                </div>

                <h3 className="font-semibold">
                  No genres yet
                </h3>

                <p className="text-sm text-gray-600 mt-2">
                  Create your first movie genre above.
                </p>

              </div>
            )}

          </div>

        </div>

      </div>

      {/* Edit Modal */}
      <Modal
        isOpen={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setSelectedGenre(null);
        }}
      >
        <div className=" text-white">

          <h2 className="text-xl font-semibold mb-1">
            Manage Genre
          </h2>

          <p className="text-sm text-gray-500 mb-6">
            Update or delete this genre.
          </p>

          <GenreForm
            value={updatingName}
            setValue={setUpdatingName}
            handleSubmit={handleUpdateGenre}
            buttonText="Update"
            handleDelete={handleDeleteGenre}
          />

        </div>
      </Modal>

    </main>
  );
};

export default GenreList;
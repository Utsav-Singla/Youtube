import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const Upload = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [video, setVideo] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!title || !video || !thumbnail) {
      setError("Title, video and thumbnail are required");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("video", video);
    formData.append("thumbnail", thumbnail);

    try {
      setLoading(true);
      const { data } = await api.post("/videos", formData);
      navigate(`/watch/${data.video._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-xl bg-[#181818] border border-[#2a2a2a] rounded-xl p-8">

        <h1 className="text-2xl font-semibold text-white mb-6">
          Upload video
        </h1>

        {error && (
          <div className="mb-4 bg-red-950 border border-red-800 text-red-400 px-4 py-2 rounded text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Title */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Add a title"
              className="w-full bg-[#121212] border border-[#303030] text-white placeholder-gray-500 px-4 py-2 rounded focus:outline-none focus:border-red-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">
              Description
            </label>
            <textarea
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell viewers about your video"
              className="w-full bg-[#121212] border border-[#303030] text-white placeholder-gray-500 px-4 py-2 rounded focus:outline-none focus:border-red-500"
            />
          </div>

          {/* Video */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">
              Video file
            </label>
            <input
              type="file"
              accept="video/*"
              onChange={(e) => setVideo(e.target.files[0])}
              className="w-full text-sm text-gray-300 file:bg-[#303030] file:text-white file:px-4 file:py-2 file:rounded file:border-0 hover:file:bg-[#3a3a3a]"
            />
          </div>

          {/* Thumbnail */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">
              Thumbnail
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setThumbnail(e.target.files[0])}
              className="w-full text-sm text-gray-300 file:bg-[#303030] file:text-white file:px-4 file:py-2 file:rounded file:border-0 hover:file:bg-[#3a3a3a]"
            />
          </div>

          <button
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 transition py-3 rounded font-medium text-white disabled:opacity-50"
          >
            {loading ? "Uploading…" : "Upload"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Upload;

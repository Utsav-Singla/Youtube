import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const WatchHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const { data } = await api.get("/history");
        setHistory(data.history || []);
      } catch (err) {
        console.error("HISTORY FETCH ERROR", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  /* LOADING */
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-gray-400">
        Loading history…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white px-6 py-6">
      <h1 className="text-xl font-semibold mb-6">
        Watch history
      </h1>

      {history.length === 0 ? (
        <p className="text-gray-400">
          You haven’t watched any videos yet.
        </p>
      ) : (
        <div className="space-y-6 max-w-6xl">
          {history.map((item) => {
            const video = item.video;
            if (!video) return null;

            return (
              <div
                key={item._id}
                onClick={() => navigate(`/watch/${video._id}`)}
                className="flex gap-5 cursor-pointer group"
              >
                {/* THUMBNAIL */}
                <img
                  src={video.thumbnailUrl}
                  alt={video.title}
                  className="w-56 aspect-video object-cover rounded-lg bg-[#303030]"
                />

                {/* INFO */}
                <div className="flex-1">
                  <h2 className="text-base font-medium group-hover:text-blue-400">
                    {video.title}
                  </h2>

                  <p className="text-sm text-gray-400 mt-1">
                    Watched recently
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default WatchHistory;

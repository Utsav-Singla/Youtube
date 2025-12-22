import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const Home = () => {
  const [videos, setVideos] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const [mode, setMode] = useState("recommendations");
  // "recommendations" | "all"

  const observer = useRef(null);
  const navigate = useNavigate();

  // 🔹 Intersection Observer
  const lastVideoRef = useCallback(
    (node) => {
      if (loading || !hasMore) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setPage((prev) => prev + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  // 🔹 Fetch videos
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);

        const endpoint =
          mode === "recommendations"
            ? `/recommendations?page=${page}&limit=12`
            : `/videos?page=${page}&limit=12`;

        const { data } = await api.get(endpoint);

        const newVideos = data.videos || [];

        // 🚫 prevent duplicates
        setVideos((prev) => {
          const ids = new Set(prev.map((v) => v._id));
          const unique = newVideos.filter((v) => !ids.has(v._id));
          return [...prev, ...unique];
        });

        // 🧠 fallback logic
        // 🔁 FALLBACK LOGIC (CRITICAL)
        if (
          mode === "recommendations" &&
          newVideos.length === 0 &&
          page === 1
        ) {
          // switch to ALL videos
          setMode("all");
          setVideos([]);
          setPage(1);
          setHasMore(true);
          return;
        }

        setHasMore(data.hasMore);
      } catch (error) {
        console.error("HOME FETCH ERROR", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [page, mode]);

  return (
    <div className="min-h-screen bg-black text-white px-4 sm:px-6 py-6">
      <h1 className="text-xl font-semibold mb-6">
        {mode === "recommendations" ? "Recommended" : "All Videos"}
      </h1>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {videos.map((video, index) => {
          if (videos.length === index + 1) {
            return (
              <div
                key={video._id}
                ref={lastVideoRef}
                className="cursor-pointer"
                onClick={() => navigate(`/watch/${video._id}`)}
              >
                <VideoCard video={video} />
              </div>
            );
          }

          return (
            <div
              key={video._id}
              className="cursor-pointer"
              onClick={() => navigate(`/watch/${video._id}`)}
            >
              <VideoCard video={video} />
            </div>
          );
        })}
      </div>

      {loading && (
        <p className="text-center text-gray-400 mt-6">Loading more videos…</p>
      )}

      {!hasMore && !loading && (
        <p className="text-center text-gray-500 mt-6">
          You’re all caught up 🎉
        </p>
      )}
    </div>
  );
};

const VideoCard = ({ video }) => (
  <div>
    <div className="aspect-video bg-neutral-800 rounded-lg overflow-hidden">
      <img
        src={video.thumbnailUrl}
        alt={video.title}
        className="w-full h-full object-cover"
      />
    </div>

    <div className="mt-3 flex gap-3">
      {/* Avatar */}
      <div className="h-9 w-9 rounded-full bg-neutral-800 overflow-hidden shrink-0">
        <img
          src={`https://api.dicebear.com/7.x/initials/svg?seed=${
            video.owner?.name || "User"
          }`}
          alt="channel"
          className="h-full w-full object-cover"
        />
      </div>

      {/* Text */}
      <div>
        <h2 className="text-sm font-medium line-clamp-2">{video.title}</h2>
        <p className="text-xs text-gray-400">{video.owner?.name}</p>
        <p className="text-xs text-gray-500">{video.views} views</p>
      </div>
    </div>
  </div>
);

export default Home;

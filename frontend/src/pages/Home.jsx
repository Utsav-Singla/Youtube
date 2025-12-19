import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

/* Skeleton */
const VideoSkeleton = () => (
  <div className="animate-pulse space-y-3">
    <div className="aspect-video rounded-xl bg-neutral-900" />
    <div className="flex gap-3">
      <div className="h-9 w-9 rounded-full bg-neutral-900" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-neutral-900 rounded w-5/6" />
        <div className="h-3 bg-neutral-900 rounded w-1/2" />
      </div>
    </div>
  </div>
);

const Home = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/videos")
      .then(res => setVideos(res.data.videos || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    /* FULL BLACK BACKGROUND */
    <div className="min-h-screen w-full bg-black text-white">
      
      <div className="px-4 sm:px-6 py-6">
        <h1 className="text-lg font-semibold mb-6">
          Recommended
        </h1>

        {/* Skeleton */}
        {loading && (
          <div className="grid gap-7 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <VideoSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Videos */}
        {!loading && (
          <div className="grid gap-7 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {videos.map(video => (
              <div
                key={video._id}
                onClick={() => navigate(`/watch/${video._id}`)}
                className="cursor-pointer group"
              >
                {/* Thumbnail */}
                <div className="relative aspect-video rounded-xl overflow-hidden bg-neutral-900">
                  <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                {/* Info */}
                <div className="mt-3 flex gap-3">
                  {/* Avatar */}
                  <div className="h-9 w-9 rounded-full bg-neutral-800 overflow-hidden shrink-0">
                    <img
                      src={`https://api.dicebear.com/7.x/initials/svg?seed=${video.channelName || "User"}`}
                      alt="channel"
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="flex-1">
                    <h2 className="text-sm font-medium line-clamp-2 leading-snug">
                      {video.title}
                    </h2>

                    <p className="mt-1 text-xs text-gray-400">
                      {video.channelName || "Unknown Channel"}
                    </p>

                    <p className="text-xs text-gray-500">
                      {video.views || 0} views
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;

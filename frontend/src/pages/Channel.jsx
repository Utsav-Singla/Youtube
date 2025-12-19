import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

const Channel = () => {
  const { id } = useParams(); // userId
  const navigate = useNavigate();

  const [channel, setChannel] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChannel = async () => {
      try {
        const { data } = await api.get(`/channels/${id}`);

        setChannel(data.channel);
        setVideos(data.videos || []);
      } catch (err) {
        console.error("CHANNEL ERROR", err);
      } finally {
        setLoading(false);
      }
    };

    fetchChannel();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-gray-400">
        Loading channel…
      </div>
    );
  }

  if (!channel) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-red-400">
        Channel not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white px-6 py-6">

      {/* CHANNEL HEADER */}
      <div className="flex items-center gap-6 mb-10">
        <div className="h-24 w-24 rounded-full bg-neutral-800 flex items-center justify-center text-3xl font-semibold">
          {channel.name?.[0]}
        </div>

        <div>
          <h1 className="text-3xl font-semibold">
            {channel.name}
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Joined {new Date(channel.createdAt).toDateString()}
          </p>
        </div>
      </div>

      {/* VIDEOS */}
      <h2 className="text-lg font-medium mb-6">
        Videos
      </h2>

      {videos.length === 0 ? (
        <p className="text-gray-400">
          No videos uploaded yet.
        </p>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {videos.map((v) => (
            <div
              key={v._id}
              onClick={() => navigate(`/watch/${v._id}`)}
              className="cursor-pointer group"
            >
              <div className="aspect-video bg-neutral-800 rounded-xl overflow-hidden">
                <img
                  src={v.thumbnailUrl}
                  alt={v.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition"
                />
              </div>

              <h3 className="mt-2 text-sm font-medium line-clamp-2 group-hover:text-blue-400">
                {v.title}
              </h3>

              <p className="text-xs text-gray-500 mt-1">
                {v.views} views
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Channel;

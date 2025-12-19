import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

const Channel = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [channel, setChannel] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔔 SUBSCRIPTION STATE
  const [subscribers, setSubscribers] = useState(0);
  const [subscribed, setSubscribed] = useState(false);
  const [subLoading, setSubLoading] = useState(false);

  // ---------------- FETCH CHANNEL ----------------
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

    if (id) fetchChannel();
  }, [id]);

  // ---------------- FETCH SUB STATS ----------------
  useEffect(() => {
    const fetchSubStats = async () => {
      try {
        const { data } = await api.post(`/subscriptions/${id}/stats`);
        setSubscribers(data.subscribers || 0);
        setSubscribed(data.isSubscribed || false);
      } catch (err) {
        console.error("SUB STATS ERROR", err);
      }
    };

    if (id) fetchSubStats();
  }, [id]);

  // ---------------- TOGGLE SUBSCRIBE ----------------
  const toggleSubscribe = async () => {
    if (subLoading) return;

    const prevSubscribed = subscribed;
    const prevCount = subscribers;

    // ✅ Optimistic UI
    setSubscribed(!subscribed);
    setSubscribers(subscribed ? subscribers - 1 : subscribers + 1);

    try {
      setSubLoading(true);
      await api.post(`/subscriptions/${id}`);
    } catch (err) {
      console.error("SUBSCRIBE ERROR", err);

      // ❌ Rollback on error
      setSubscribed(prevSubscribed);
      setSubscribers(prevCount);
    } finally {
      setSubLoading(false);
    }
  };

  // ---------------- UI STATES ----------------
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

  // ---------------- UI ----------------
  return (
    <div className="min-h-screen bg-black text-white px-6 py-6">

      {/* CHANNEL HEADER */}
      <div className="flex items-center justify-between flex-wrap gap-6 mb-10">

        {/* LEFT */}
        <div className="flex items-center gap-6">
          <div className="h-24 w-24 rounded-full bg-neutral-800 flex items-center justify-center text-3xl">
            {channel.name[0]}
          </div>

          <div>
            <h1 className="text-3xl font-semibold">
              {channel.name}
            </h1>

            <p className="text-gray-400 text-sm">
              {subscribers.toLocaleString()} subscribers • Joined{" "}
              {new Date(channel.createdAt).toDateString()}
            </p>
          </div>
        </div>

        {/* RIGHT — SUBSCRIBE */}
        <button
          disabled={subLoading}
          onClick={toggleSubscribe}
          className={`px-6 py-2 rounded-full text-sm font-medium transition
            ${
              subscribed
                ? "bg-neutral-700 text-white hover:bg-neutral-600"
                : "bg-red-600 text-white hover:bg-red-700"
            }`}
        >
          {subscribed ? "Subscribed" : "Subscribe"}
        </button>
      </div>

      {/* VIDEOS */}
      <h2 className="text-lg mb-6">Videos</h2>

      {videos.length === 0 ? (
        <p className="text-gray-400">No videos uploaded</p>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {videos.map((v) => (
            <div
              key={v._id}
              onClick={() => navigate(`/watch/${v._id}`)}
              className="cursor-pointer"
            >
              <img
                src={v.thumbnailUrl}
                alt={v.title}
                className="rounded-xl aspect-video object-cover"
              />

              <p className="mt-2 text-sm font-medium line-clamp-2">
                {v.title}
              </p>

              <p className="text-xs text-gray-500">
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

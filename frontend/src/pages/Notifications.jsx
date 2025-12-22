import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const { data } = await api.get("/notifications");
        setNotifications(data.notifications || []);

        // mark all as read
        await api.post("/notifications/read");
      } catch (err) {
        console.error("NOTIFICATION FETCH ERROR", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-gray-400">
        Loading notifications…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white px-6 py-6">
      <h1 className="text-xl font-semibold mb-6">
        Notifications
      </h1>

      {notifications.length === 0 ? (
        <p className="text-gray-400">No notifications</p>
      ) : (
        <div className="space-y-4">
          {notifications.map((n) => (
            <div
              key={n._id}
              onClick={() => navigate(`/watch/${n.video._id}`)}
              className={`flex gap-4 p-4 rounded-lg cursor-pointer transition
                ${
                  n.isRead
                    ? "bg-neutral-900 hover:bg-neutral-800"
                    : "bg-neutral-800 hover:bg-neutral-700"
                }`}
            >
              {/* THUMBNAIL */}
              <img
                src={n.video.thumbnailUrl}
                alt={n.video.title}
                className="w-32 h-20 object-cover rounded"
              />

              {/* TEXT */}
              <div className="flex flex-col justify-center">
                <p className="text-sm leading-snug">
                  <span className="font-medium">
                    {n.channel?.name}
                  </span>{" "}
                  uploaded a new video
                </p>

                <p className="text-xs text-gray-400 mt-1">
                  {n.video.title}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;

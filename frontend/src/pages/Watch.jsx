import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import api from "../services/api";
import React from "react";
import { useNavigate } from "react-router-dom";

const Watch = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [video, setVideo] = useState(null);
  const [videoSrc, setVideoSrc] = useState("");
  const [loading, setLoading] = useState(true);

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  // Reactions
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [userReaction, setUserReaction] = useState(null);
  const [reactionLoading, setReactionLoading] = useState(false);

  const [subscribed, setSubscribed] = useState(false);
  const [subscribersCount, setSubscribersCount] = useState(0);
  const [subLoading, setSubLoading] = useState(false);

  useEffect(() => {
    if (video) {
      console.log("VIDEO OBJECT:", video);
    }
  }, [video]);

  // ---------------- FETCH VIDEO + REACTIONS ----------------
  useEffect(() => {
    let blobUrl = "";

    const fetchData = async () => {
      try {
        // Video meta
        const videoRes = await api.get(`/videos/${id}`);
        setVideo(videoRes.data.video);

        // Video file (JWT safe)
        const fileRes = await api.get(videoRes.data.video.videoUrl, {
          responseType: "blob",
        });
        blobUrl = URL.createObjectURL(fileRes.data);
        setVideoSrc(blobUrl);

        // Reactions
        const reactionRes = await api.get(`/videos/${id}/reactions`);
        setLikes(reactionRes.data.likes || 0);
        setDislikes(reactionRes.data.dislikes || 0);
        setUserReaction(reactionRes.data.userReaction || null);
      } catch (err) {
        console.error("WATCH FETCH ERROR", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      if (blobUrl) URL.revokeObjectURL(blobUrl);
    };
  }, [id]);

  // ---------------- FETCH SUBSCRIPTION STATS ----------------
  useEffect(() => {
    if (!video?.owner?._id) return;

    const fetchSubStats = async () => {
      try {
        const { data } = await api.post(
          `/subscriptions/${video.owner._id}/stats`
        );

        setSubscribersCount(data.subscribers);
        setSubscribed(data.isSubscribed);
      } catch (err) {
        console.error("SUB STATS ERROR", err);
      }
    };

    fetchSubStats();
  }, [video]);

  // ---------------- FETCH COMMENTS ----------------
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const { data } = await api.get(`/comments/${id}`);
        setComments(data.comments || []);
      } catch (err) {
        console.error("COMMENT FETCH ERROR", err);
      }
    };

    fetchComments();
  }, [id]);

  // ---------------- Update Watch History ----------------
  useEffect(() => {
    const updateHistory = async () => {
      try {
        await api.post(`/history/${id}`, {
          progress: 0,
        });
      } catch (err) {
        console.error("WATCH HISTORY UPDATE ERROR", err);
      }
    };

    updateHistory();
  }, [id]);

  // ---------------- TOGGLE REACTION ----------------
  const toggleReaction = async (type) => {
    if (reactionLoading) return;

    // Save previous state
    const prev = {
      likes,
      dislikes,
      userReaction,
    };

    // -------- OPTIMISTIC UPDATE --------
    if (type === "like") {
      if (userReaction === "like") {
        setLikes((l) => Math.max(0, l - 1));
        setUserReaction(null);
      } else {
        setLikes((l) => l + 1);
        if (userReaction === "dislike") {
          setDislikes((d) => Math.max(0, d - 1));
        }
        setUserReaction("like");
      }
    }

    if (type === "dislike") {
      if (userReaction === "dislike") {
        setDislikes((d) => Math.max(0, d - 1));
        setUserReaction(null);
      } else {
        setDislikes((d) => d + 1);
        if (userReaction === "like") {
          setLikes((l) => Math.max(0, l - 1));
        }
        setUserReaction("dislike");
      }
    }

    try {
      setReactionLoading(true);

      const { data } = await api.post(`/likes/${id}`, { type });

      // -------- SAFE BACKEND SYNC --------
      if (typeof data.likes === "number") {
        setLikes(data.likes);
      }
      if (typeof data.dislikes === "number") {
        setDislikes(data.dislikes);
      }
      if ("userReaction" in data) {
        setUserReaction(data.userReaction);
      }
    } catch (err) {
      console.error("REACTION ERROR", err);

      // -------- ROLLBACK --------
      setLikes(prev.likes);
      setDislikes(prev.dislikes);
      setUserReaction(prev.userReaction);
    } finally {
      setReactionLoading(false);
    }
  };

  // ---------------- TOGGLE SUBSCRIPTION ----------------
  const toggleSubscribe = async () => {
    if (subLoading || !video?.owner?._id) return;

    // optimistic UI
    setSubscribed((prev) => !prev);
    setSubscribersCount((prev) =>
      subscribed ? Math.max(0, prev - 1) : prev + 1
    );

    try {
      setSubLoading(true);
      await api.post(`/subscriptions/${video.owner._id}`);
    } catch (err) {
      console.error("SUBSCRIBE ERROR", err);

      // rollback on failure
      setSubscribed((prev) => !prev);
      setSubscribersCount((prev) =>
        subscribed ? prev + 1 : Math.max(0, prev - 1)
      );
    } finally {
      setSubLoading(false);
    }
  };

  // ---------------- ADD COMMENT ----------------
  const submitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const { data } = await api.post(`/comments/${id}`, {
        text: newComment,
      });
      setComments([data.comment, ...comments]);
      setNewComment("");
    } catch (err) {
      console.error("COMMENT ERROR", err);
    }
  };

  // ---------------- LOADING / ERROR ----------------
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-gray-400">
        Loading…
      </div>
    );
  }

  if (!video) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-red-400">
        Video not found
      </div>
    );
  }

  // ---------------- UI ----------------
  return (
    <div className="min-h-screen bg-black text-white px-4 sm:px-6 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* LEFT */}
        <div className="lg:col-span-2 space-y-6">
          {/* VIDEO */}
          <div className="rounded-2xl overflow-hidden bg-neutral-900 shadow-lg">
            <video
              src={videoSrc}
              controls
              className="w-full aspect-video bg-black"
            />
          </div>

          {/* TITLE */}
          <h1 className="text-xl sm:text-2xl font-semibold leading-snug">
            {video.title}
          </h1>

          {/* CHANNEL + SUBSCRIBE + ACTIONS */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            {/* CHANNEL INFO */}
            <button
              type="button"
              onClick={() => navigate(`/channel/${video.owner._id}`)}
              className="flex items-center gap-3 hover:opacity-90"
            >
              <div className="h-10 w-10 rounded-full bg-neutral-800 flex items-center justify-center text-sm font-medium">
                {video.owner.name?.[0] || "U"}
              </div>

              <div className="text-left">
                <p className="text-sm font-medium">{video.owner.name}</p>
                <p className="text-xs text-gray-400">
                  {subscribersCount.toLocaleString()} subscribers
                </p>
              </div>
            </button>

            {/* SUBSCRIBE + LIKE/DISLIKE */}
            <div className="flex items-center gap-3">
              {/* SUBSCRIBE */}
              <button
                disabled={subLoading}
                onClick={toggleSubscribe}
                className={`px-5 py-2 rounded-full text-sm font-medium transition
                ${
                  subscribed
                    ? "bg-neutral-700 text-white hover:bg-neutral-600"
                    : "bg-red-600 text-white hover:bg-red-700"
                }`}
              >
                {subscribed ? "Subscribed" : "Subscribe"}
              </button>

              {/* LIKE / DISLIKE */}
              <div className="flex items-center gap-2 bg-neutral-900 border border-neutral-800 rounded-full px-2 py-1">
                <button
                  type="button"
                  disabled={reactionLoading}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleReaction("like");
                  }}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm transition
                  ${
                    userReaction === "like"
                      ? "bg-blue-600 text-white"
                      : "text-gray-300 hover:bg-neutral-800"
                  }`}
                >
                  👍 {likes}
                </button>

                <button
                  type="button"
                  disabled={reactionLoading}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleReaction("dislike");
                  }}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm transition
                  ${
                    userReaction === "dislike"
                      ? "bg-gray-600 text-white"
                      : "text-gray-300 hover:bg-neutral-800"
                  }`}
                >
                  👎 {dislikes}
                </button>
              </div>
            </div>
          </div>

          {/* DESCRIPTION */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 text-sm text-gray-300 leading-relaxed">
            {video.description || "No description provided."}
          </div>

          {/* COMMENTS */}
          <div className="space-y-6">
            <h2 className="text-lg font-medium">Comments</h2>

            {/* ADD COMMENT */}
            <form onSubmit={submitComment}>
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment"
                className="w-full bg-neutral-900 border border-neutral-800 rounded-full px-5 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
            </form>

            {/* COMMENT LIST */}
            {comments.length === 0 ? (
              <p className="text-gray-500 text-sm">No comments yet</p>
            ) : (
              <ul className="space-y-5">
                {comments.map((c) => (
                  <li key={c._id} className="flex gap-3">
                    <div className="h-9 w-9 rounded-full bg-neutral-800 flex items-center justify-center text-sm font-medium">
                      {c.user?.name?.[0] || "U"}
                    </div>

                    <div>
                      <p className="text-sm font-medium">
                        {c.user?.name || "User"}
                      </p>
                      <p className="text-sm text-gray-300 mt-1">{c.text}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="hidden lg:block text-gray-500 text-sm">
          Recommendations coming soon
        </div>
      </div>
    </div>
  );
};

export default Watch;

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

const Watch = () => {
  const { id } = useParams();

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

  // ---------------- FETCH VIDEO + REACTIONS ----------------
  useEffect(() => {
    let blobUrl = "";

    const fetchData = async () => {
      try {
        // Video meta
        const videoRes = await api.get(`/videos/${id}`);
        setVideo(videoRes.data.video);

        // Video file (JWT safe)
        const fileRes = await api.get(
          videoRes.data.video.videoUrl,
          { responseType: "blob" }
        );
        blobUrl = URL.createObjectURL(fileRes.data);
        setVideoSrc(blobUrl);

        // Reactions
        const reactionRes = await api.get(
          `/videos/${id}/reactions`
        );
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
      }
      catch (err) {
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
      setLikes(l => Math.max(0, l - 1));
      setUserReaction(null);
    } else {
      setLikes(l => l + 1);
      if (userReaction === "dislike") {
        setDislikes(d => Math.max(0, d - 1));
      }
      setUserReaction("like");
    }
  }

  if (type === "dislike") {
    if (userReaction === "dislike") {
      setDislikes(d => Math.max(0, d - 1));
      setUserReaction(null);
    } else {
      setDislikes(d => d + 1);
      if (userReaction === "like") {
        setLikes(l => Math.max(0, l - 1));
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* LEFT */}
        <div className="lg:col-span-2">
          {/* VIDEO */}
          <div className="rounded-xl overflow-hidden bg-neutral-900">
            <video
              src={videoSrc}
              controls
              className="w-full aspect-video bg-black"
            />
          </div>

          {/* TITLE */}
          <h1 className="mt-4 text-xl font-semibold leading-snug">
            {video.title}
          </h1>

          {/* ACTIONS */}
          <div className="mt-3 flex items-center gap-4">
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
                    : "bg-neutral-800 text-gray-300 hover:bg-neutral-700"
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
                    : "bg-neutral-800 text-gray-300 hover:bg-neutral-700"
                }`}
            >
              👎 {dislikes}
            </button>
          </div>

          {/* DESCRIPTION */}
          <p className="mt-4 text-sm text-gray-400">
            {video.description}
          </p>

          {/* COMMENTS */}
          <div className="mt-8">
            <h2 className="text-lg font-medium mb-4">
              Comments
            </h2>

            <form onSubmit={submitComment} className="mb-6">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment"
                className="w-full bg-neutral-900 border border-neutral-800 rounded-full px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
            </form>

            {comments.length === 0 ? (
              <p className="text-gray-500 text-sm">
                No comments yet
              </p>
            ) : (
              <ul className="space-y-4">
                {comments.map((c) => (
                  <li key={c._id} className="flex gap-3">
                    <div className="h-9 w-9 rounded-full bg-neutral-800 flex items-center justify-center text-sm">
                      {c.user?.name?.[0] || "U"}
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        {c.user?.name || "User"}
                      </p>
                      <p className="text-sm text-gray-300 mt-1">
                        {c.text}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* RIGHT */}
        <div className="hidden lg:block text-gray-500 text-sm">
          Recommendations coming soon
        </div>
      </div>
    </div>
  );
};

export default Watch;

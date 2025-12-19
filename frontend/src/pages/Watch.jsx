import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

const Watch = () => {
  const { id } = useParams();

  const [video, setVideo] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);

 
  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const { data } = await api.get(`/videos/${id}`);
        setVideo(data.video);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();
  }, [id]);
  
  useEffect(() => {
    const updateWatchHistory = async () => {
      try {
        await api.post(`/history/${id}`, { progress: 0 });
      } catch (err) {
        console.error('WATCH HISTORY UPDATE ERROR', err);
      } finally {
        // No need to set loading here
      } };

    updateWatchHistory(); 
  },[id])

  
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const { data } = await api.get(`/comments/${id}`);
        setComments(data.comments || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchComments();
  }, [id]);

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
      console.error(err);
    }
  };

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

  return (
    <div className="min-h-screen bg-black text-white px-4 sm:px-6 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT – VIDEO + INFO */}
        <div className="lg:col-span-2">
          {/* Video */}
          <div className="rounded-xl overflow-hidden bg-neutral-900">
            <video
              src={video.videoUrl}
              controls
              className="w-full aspect-video bg-black"
            />
          </div>

          {/* Title */}
          <h1 className="mt-4 text-xl font-semibold leading-snug">
            {video.title}
          </h1>

          {/* Description */}
          <p className="mt-2 text-sm text-gray-400">{video.description}</p>

          {/* COMMENTS */}
          <div className="mt-8">
            <h2 className="text-lg font-medium mb-4">Comments</h2>

            {/* Add comment */}
            <form onSubmit={submitComment} className="mb-6">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment"
                className="w-full bg-neutral-900 border border-neutral-800 rounded-full px-4 py-2 text-sm placeholder-gray-500 focus:outline-none focus:border-red-600"
              />
            </form>

            {/* Comment list */}
            {comments.length === 0 ? (
              <p className="text-gray-500 text-sm">No comments yet</p>
            ) : (
              <ul className="space-y-4">
                {comments.map((c) => (
                  <li key={c._id} className="flex gap-3">
                    {/* Avatar */}
                    <div className="h-9 w-9 rounded-full bg-neutral-800 overflow-hidden shrink-0">
                      <img
                        src={`https://api.dicebear.com/7.x/initials/svg?seed=${
                          c.user?.name || "User"
                        }`}
                        alt="avatar"
                        className="h-full w-full object-cover"
                      />
                    </div>

                    {/* Text */}
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

        {/* RIGHT – SIDEBAR */}
        <div className="hidden lg:block text-gray-500 text-sm">
          Recommendations coming soon
        </div>
      </div>
    </div>
  );
};

export default Watch;

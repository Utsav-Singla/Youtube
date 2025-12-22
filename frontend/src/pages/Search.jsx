import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../services/api";

const Search = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const query = searchParams.get("q");
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/search?q=${query}`);
        setVideos(data.videos || []);
        console.log("SEARCH RESULTS", data.videos);
      } catch (err) {
        console.error("SEARCH ERROR", err);
      } finally {
        setLoading(false);
      }
    };

    if (query) fetchResults();
  }, [query]);

  /* LOADING */
  if (loading) {
    return (
      <div className="min-h-screen bg-black text-gray-400 flex items-center justify-center">
        Searching…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white px-6 py-6">
      <h1 className="text-lg font-semibold mb-6">
        Search results for “{query}”
      </h1>

      {videos.length === 0 ? (
        <p className="text-gray-400">No results found</p>
      ) : (
        <div className="space-y-6 max-w-6xl">
          {videos.map((v) => (
            <div
              key={v._id}
              onClick={() => navigate(`/watch/${v._id}`)}
              className="flex gap-5 cursor-pointer group"
            >
              {/* THUMBNAIL */}
              <div className="relative w-72 shrink-0">
                <img
                  src={v.thumbnailUrl}
                  alt={v.title}
                  className="w-full aspect-video object-cover rounded-xl bg-[#303030]"
                />
              </div>

              {/* DETAILS */}
              <div className="flex-1">
                {/* TITLE */}
                <h2 className="text-lg font-medium leading-snug group-hover:text-blue-400">
                  {v.title}
                </h2>

                {/* META */}
                <p className="text-sm text-gray-400 mt-1">
                  {v.owner?.name || "Unknown Channel"} •{" "}
                  {v.views || 0} views
                </p>

                {/* DESCRIPTION */}
                <p className="text-sm text-gray-400 mt-2 line-clamp-3">
                  {v.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;

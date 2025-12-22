import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);

  // 🔔 Fetch unread notifications count
  useEffect(() => {
    if (!user) return;

    const fetchUnread = async () => {
      try {
        const { data } = await api.get("/notifications/unread-count");
        setUnreadCount(data.count || 0);
      } catch (err) {
        console.error("NOTIFICATION COUNT ERROR", err);
      }
    };

    fetchUnread();
  }, [user]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/search?q=${encodeURIComponent(query)}`);
    setQuery("");
  };

  return (
    <header className="sticky top-0 z-50 w-full h-14 bg-[#202020] border-b border-[#303030]">
      <div className="h-full px-6 flex items-center justify-between gap-4">

        {/* LEFT — LOGO */}
        <div
          onClick={() => navigate("/")}
          className="flex items-center gap-1 cursor-pointer select-none"
        >
          <span className="text-xl font-bold text-white">My</span>
          <span className="text-xl font-bold text-red-600">Tube</span>
        </div>

        {/* CENTER — SEARCH */}
        <form
          onSubmit={handleSearch}
          className="hidden md:flex flex-1 max-w-xl"
        >
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search"
            className="flex-1 px-4 py-2 text-sm bg-[#121212] text-white placeholder-gray-400 border border-[#303030] rounded-l-full outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            className="px-5 bg-[#303030] text-gray-200 rounded-r-full hover:bg-[#3a3a3a]"
          >
            🔍
          </button>
        </form>

        {/* RIGHT — ACTIONS */}
        {user && (
          <div className="flex items-center gap-3">

            {/* UPLOAD */}
            <button
              onClick={() => navigate("/upload")}
              className="px-4 py-1.5 text-sm rounded-full bg-[#303030] text-white hover:bg-[#3a3a3a]"
            >
              Upload
            </button>

            {/* HISTORY */}
            <button
              onClick={() => navigate("/history")}
              className="px-4 py-1.5 text-sm rounded-full bg-[#303030] text-white hover:bg-[#3a3a3a]"
            >
              History
            </button>

            {/* 🔔 NOTIFICATIONS */}
            <button
              onClick={() => navigate("/notifications")}
              className="relative h-9 w-9 flex items-center justify-center rounded-full hover:bg-[#303030]"
            >
              🔔
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* AVATAR */}
            <div
              onClick={() => navigate(`/channel/${user.id || user._id}`)}
              className="h-9 w-9 rounded-full bg-[#303030] flex items-center justify-center text-sm font-medium text-white cursor-pointer"
            >
              {user.name?.[0]?.toUpperCase()}
            </div>

            {/* LOGOUT */}
            <button
              onClick={() => {
                logout();
                navigate("/login");
              }}
              className="px-4 py-1.5 text-sm rounded-full bg-red-600 text-white hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;

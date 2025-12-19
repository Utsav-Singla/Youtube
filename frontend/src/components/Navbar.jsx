import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/search?q=${encodeURIComponent(query)}`);
    setQuery("");
  };

  return (
    <nav className="w-full h-14 bg-[#202020] border-b border-[#303030] px-6 flex items-center justify-between">
      {/* LOGO */}
      <div
        onClick={() => navigate("/")}
        className="text-xl font-semibold cursor-pointer text-white"
      >
        <span className="text-red-600">My</span>Tube
      </div>

      {/* SEARCH */}
      <form onSubmit={handleSearch} className="flex w-full max-w-xl mx-6">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search"
          className="flex-1 px-4 py-2 text-sm bg-[#121212] text-white placeholder-gray-400 border border-[#303030] rounded-l-full outline-none"
        />
        <button className="px-5 bg-[#303030] text-gray-200 rounded-r-full">
          🔍
        </button>
      </form>

      {/* USER */}
      {user && (
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/upload")}
            className="px-4 py-1.5 text-sm rounded-full bg-[#303030] text-white"
          >
            Upload
          </button>
          <button
            onClick={() => navigate("/history")}
            className="px-4 py-1.5 text-sm rounded-full bg-[#303030] text-white"
          >
            History
          </button>

          <span className="text-sm text-gray-300">{user.name}</span>

          <button
            onClick={() => {
              logout();
              navigate("/login");
            }}
            className="px-4 py-1.5 text-sm rounded-full bg-red-600 text-white"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

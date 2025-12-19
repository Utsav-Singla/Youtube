import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-black border-b border-[#2a2a2a]">
      <div className="h-14 px-4 md:px-6 flex items-center justify-between gap-4">

        {/* Logo */}
        <div
          onClick={() => navigate("/")}
          className="flex items-center gap-1 cursor-pointer"
        >
          <span className="text-lg font-bold text-white">My</span>
          <span className="text-lg font-bold text-red-600">Tube</span>
        </div>

        {/* Search */}
        <div className="hidden md:flex flex-1 max-w-xl">
          <input
            type="text"
            placeholder="Search"
            className="w-full bg-[#121212] border border-[#303030] text-white placeholder-gray-500 px-5 py-1.5 rounded-full focus:outline-none focus:border-red-500"
          />
        </div>

        {/* Right */}
        {user && (
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/upload")}
              className="px-4 py-1.5 rounded-full bg-[#303030] text-white text-sm hover:bg-[#3a3a3a]"
            >
              Upload
            </button>

            <div className="h-9 w-9 rounded-full bg-[#3a3a3a] flex items-center justify-center text-sm font-medium text-white">
              {user.name?.charAt(0).toUpperCase()}
            </div>

            <button
              onClick={() => {
                logout();
                navigate("/login");
              }}
              className="px-3 py-1.5 rounded-full bg-red-600 text-sm hover:bg-red-700"
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

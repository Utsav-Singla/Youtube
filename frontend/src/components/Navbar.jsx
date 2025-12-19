import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Search } from "lucide-react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-[#0f0f0f] border-b border-gray-800">
      <div className="h-14 px-4 md:px-6 flex items-center justify-between gap-4">

        {/* LEFT – LOGO */}
        <div
          onClick={() => navigate("/")}
          className="flex items-center gap-1 cursor-pointer select-none"
        >
          <span className="text-xl font-bold text-white tracking-tight">
            My
          </span>
          <span className="text-xl font-bold text-red-600 tracking-tight">
            Tube
          </span>
        </div>

        {/* CENTER – SEARCH */}
        <div className="hidden md:flex flex-1 max-w-2xl items-center">
          <div className="flex w-full">
            <input
              type="text"
              placeholder="Search"
              className="flex-1 bg-[#121212] border border-gray-700 rounded-l-full px-5 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-red-500"
            />
            <button className="px-5 rounded-r-full bg-[#222] border border-l-0 border-gray-700 hover:bg-[#333] transition">
              <Search size={18} className="text-gray-300" />
            </button>
          </div>
        </div>

        {/* RIGHT – USER */}
        {user && (
          <div className="flex items-center gap-4">
            <span className="hidden sm:block text-sm text-gray-300">
              {user.name}
            </span>

            <div className="h-9 w-9 rounded-full overflow-hidden bg-gray-700 ring-2 ring-gray-800">
              <img
                src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`}
                alt="avatar"
                className="h-full w-full object-cover"
              />
            </div>

            <button
              onClick={() => {
                logout();
                navigate("/login");
              }}
              className="px-4 py-1.5 rounded-full bg-red-600 text-sm font-medium hover:bg-red-700 transition"
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

import { useState } from "react";
import {
  AiOutlineHome,
  AiOutlineLogin,
  AiOutlineUserAdd,
  AiOutlineSearch,
  AiOutlineUser,
} from "react-icons/ai";
import { MdOutlineLocalMovies } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "../../redux/api/users";
import { logout } from "../../redux/features/auth/authSlice";

const Navigation = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      setDropdownOpen(false);
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-[#08090b]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-8">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-purple-600 text-xl">
            🎬
          </div>

          <div className="hidden sm:block">
            <div className="text-lg font-bold tracking-tight">
              Cine<span className="text-red-500">Verse</span>
            </div>
            <div className="text-[10px] uppercase tracking-[0.25em] text-gray-500">
              Movies & More
            </div>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          <Link
            to="/"
            className="flex items-center gap-2 text-sm text-gray-300 transition hover:text-white"
          >
            <AiOutlineHome size={18} />
            Home
          </Link>

          <Link
            to="/movies"
            className="flex items-center gap-2 text-sm text-gray-300 transition hover:text-white"
          >
            <MdOutlineLocalMovies size={19} />
            Movies
          </Link>
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-4">
         

          {userInfo ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 transition hover:bg-white/10"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-purple-600">
                  <AiOutlineUser size={18} />
                </div>

                <span className="hidden max-w-[100px] truncate text-sm sm:block">
                  {userInfo.username}
                </span>

                <span className="text-xs text-gray-400">
                  {dropdownOpen ? "▲" : "▼"}
                </span>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 top-14 w-52 overflow-hidden rounded-xl border border-white/10 bg-[#15161a] shadow-2xl">
                  {userInfo.isAdmin && (
                    <Link
                      to="/admin/movies/dashboard"
                      onClick={() => setDropdownOpen(false)}
                      className="block px-4 py-3 text-sm text-gray-300 transition hover:bg-white/10 hover:text-white"
                    >
                      Admin Dashboard
                    </Link>
                  )}

                  <Link
                    to="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="block px-4 py-3 text-sm text-gray-300 transition hover:bg-white/10 hover:text-white"
                  >
                    Profile
                  </Link>

                  <button
                    onClick={logoutHandler}
                    className="w-full border-t border-white/10 px-4 py-3 text-left text-sm text-red-400 transition hover:bg-red-500/10"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="hidden items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-300 transition hover:text-white sm:flex"
              >
                <AiOutlineLogin size={19} />
                Login
              </Link>

              <Link
                to="/register"
                className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-gray-200"
              >
                <AiOutlineUserAdd size={18} />
                <span className="hidden sm:inline">Register</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navigation;    
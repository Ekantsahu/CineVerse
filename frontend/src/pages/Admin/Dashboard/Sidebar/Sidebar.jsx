import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Film,
  Tags,
  Pencil,
  MessageSquare,
  Clapperboard,
} from "lucide-react";

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    {
      name: "Dashboard",
      path: "/admin/movies/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Create Movie",
      path: "/admin/movies/create",
      icon: Film,
    },
    {
      name: "Create Genre",
      path: "/admin/movies/genre",
      icon: Tags,
    },
    {
      name: "Update Movie",
      path: "/admin/movies-list",
      icon: Pencil,
    },
    {
      name: "Comments",
      path: "/admin/movies/comments",
      icon: MessageSquare,
    },
  ];

  return (
    <aside className="fixed left-0 top-0 z-50 hidden h-screen w-64 border-r border-white/[0.06] bg-[#111217]/95 backdrop-blur-xl lg:block">
      {/* Logo */}
      <div className="flex h-20 items-center border-b border-white/[0.06] px-6">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 shadow-lg shadow-purple-500/20">
            <Clapperboard size={21} />
          </div>

          <div>
            <h1 className="text-lg font-bold tracking-tight text-white">
              CineVerse
            </h1>
            <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500">
              Admin Panel
            </p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="px-4 py-6">
        <p className="mb-4 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-600">
          Management
        </p>

        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;

            const active = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`group relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300 ${
                  active
                    ? "bg-purple-500/10 text-purple-400"
                    : "text-gray-400 hover:bg-white/[0.04] hover:text-white"
                }`}
              >
                {/* Active indicator */}
                {active && (
                  <span className="absolute left-0 h-7 w-1 rounded-r-full bg-purple-500 shadow-lg shadow-purple-500/50" />
                )}

                <Icon
                  size={18}
                  className={`transition-colors ${
                    active
                      ? "text-purple-400"
                      : "text-gray-500 group-hover:text-purple-400"
                  }`}
                />

                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Bottom */}
      <div className="absolute bottom-6 left-4 right-4">
        <div className="rounded-2xl border border-white/[0.06] bg-[#17181c] p-4">
          <p className="text-xs font-medium text-gray-300">
            Movie Management
          </p>
          <p className="mt-1 text-[11px] text-gray-600">
            Manage your CineVerse platform
          </p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
// src/layouts/HomeLayout.jsx
import { NavLink, Outlet } from "react-router-dom";
import HeaderHome from "../../components/home/HeaderHome";

export default function HomeLayout() {
  const base =
    "px-4 py-2 text-sm rounded-full transition duration-150";
  const active =
    "bg-[#2CC1AE] text-white";
  const idle =
    "hover:bg-black/5 text-[#111]";

  return (
    <div className="min-h-screen bg-[#FFF9F0] flex flex-col">
      {/* Header */}
      <HeaderHome />

      {/* Body: sidebar + content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-56 shrink-0 bg-[#FFF6EA] p-6 overflow-y-auto">
          <nav className="flex flex-col gap-3">
            <NavLink
              to="/home"
              end
              className={({ isActive }) => `${base} ${isActive ? active : idle}`}
            >
              Moment
            </NavLink>

            <NavLink
              to="/home/calendar"
              className={({ isActive }) => `${base} ${isActive ? active : idle}`}
            >
              Calendar
            </NavLink>

            <NavLink
              to="/home/album"
              className={({ isActive }) => `${base} ${isActive ? active : idle}`}
            >
              Album
            </NavLink>

            <NavLink
              to="/home/children"
              className={({ isActive }) => `${base} ${isActive ? active : idle}`}
            >
              Children
            </NavLink>

            <NavLink
              to="/home/health"
              className={({ isActive }) => `${base} ${isActive ? active : idle}`}
            >
              Health
            </NavLink>
          </nav>
        </aside>

        {/* Nội dung chính */}
        <main className="flex-1 px-6 py-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

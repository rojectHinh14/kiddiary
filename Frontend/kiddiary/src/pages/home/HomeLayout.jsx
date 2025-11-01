import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import HeaderHome from "../../components/home/HeaderHome";

// ======= SVG Icon components (không cần lib ngoài) =======
function IconBase({ className, children }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {children}
    </svg>
  );
}
function MomentIcon(props) {
  return (
    <IconBase {...props}>
      <path d="M12 6v6l4 2" />
      <circle cx="12" cy="12" r="9" />
    </IconBase>
  );
}
function CalendarIcon(props) {
  return (
    <IconBase {...props}>
      <rect x="3" y="4" width="18" height="18" rx="3" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </IconBase>
  );
}
function AlbumIcon(props) {
  return (
    <IconBase {...props}>
      <rect x="4" y="5" width="16" height="14" rx="2" />
      <path d="M8 13l2-2 2 2 3-3 3 3" />
    </IconBase>
  );
}
function ChildrenIcon(props) {
  return (
    <IconBase {...props}>
      <circle cx="8" cy="8" r="3" />
      <circle cx="16" cy="8" r="3" />
      <path d="M2 20c1.5-3 4-5 6-5s4.5 2 6 5M12 15c1.2 0 2.3.4 3.3 1.1" />
    </IconBase>
  );
}
function HealthIcon(props) {
  return (
    <IconBase {...props}>
      <path d="M20.8 9.5c0 5.8-8.8 10.5-8.8 10.5S3.2 15.3 3.2 9.5C3.2 6.5 5.6 4 8.5 4c1.6 0 3 .7 3.5 1.9C12.6 4.7 14 4 15.6 4c2.9 0 5.2 2.5 5.2 5.5z" />
      <path d="M9 9h2l1 2 1-2h2" />
    </IconBase>
  );
}
// =========================================================

const navs = [
  { to: "/home", label: "Moment", end: true, icon: MomentIcon },
  { to: "/home/calendar", label: "Calendar", icon: CalendarIcon },
  { to: "/home/album", label: "Album", icon: AlbumIcon },
  { to: "/home/children", label: "Children", icon: ChildrenIcon },
  { to: "/home/health", label: "Health", icon: HealthIcon },
];

export default function HomeLayout() {
  const base =
    "group relative flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors";
  const active =
    "bg-teal-500 text-white shadow-md before:absolute before:left-1 before:inset-y-1 before:w-1 before:rounded-full before:bg-white/70";
  const idle = "text-slate-700 hover:bg-black/5";

  return (
    // Padding-top = chiều cao header, lấy từ biến --hdr do HeaderHome đặt
    <div
      className="min-h-screen bg-[#FFF9F0] flex flex-col"
      style={{ paddingTop: "var(--hdr, 80px)" }}
    >
      <HeaderHome />

      {/* Body */}
      <div className="flex flex-1 gap-6 px-4 sm:px-6 lg:px-8">
        {/* Sidebar */}
        <aside className="w-64 shrink-0">
          <div
            className="sticky rounded-2xl border border-teal-100 bg-[#FFF6EA]/90 backdrop-blur p-4 shadow-sm"
            // Né header + cách đỉnh 24px
            style={{ top: "calc(var(--hdr, 80px) + 24px)" }}
          >
            <div className="px-2 pb-2 text-xs font-semibold uppercase tracking-wide text-teal-700/80">
              Navigation
            </div>

            <nav className="flex flex-col gap-2">
              {navs.map(({ to, label, end, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    `${base} ${isActive ? active : idle}`
                  }
                >
                  <Icon className="h-5 w-5 opacity-80 group-hover:opacity-100" />
                  <span>{label}</span>
                  <span className="pointer-events-none absolute inset-0 rounded-xl transition-[box-shadow] group-active:shadow-inner" />
                </NavLink>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 py-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

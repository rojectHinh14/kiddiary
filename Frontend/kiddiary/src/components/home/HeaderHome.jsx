import React, { useEffect, useRef, useState } from "react";
import ProfileMenu from "./ProfileMenu";

/**
 * Header cố định (fixed) + tự đo chiều cao và set CSS variable --hdr
 * để phần nội dung phía dưới không bị chui vào dưới header.
 * Có hiệu ứng mờ nền, đổ bóng và đổi style khi scroll.
 */
export default function HeaderHome({ onOpenProfile, onLogout }) {
  const ref = useRef(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    const setVar = () => {
      const h = ref.current?.offsetHeight || 80; // fallback 80px
      document.documentElement.style.setProperty("--hdr", `${h}px`);
    };

    onScroll();
    setVar();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", setVar);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", setVar);
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <header
        ref={ref}
        className={[
          // nền full-width
          "w-full transition-all duration-300",
          // layout
          "px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4",
          // hiệu ứng khi cuộn
          scrolled
            ? "bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-white/50 shadow-lg"
            : "bg-[#FFF6EA]"
        ].join(" ")}
      >
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl grid place-items-center font-bold text-white bg-gradient-to-br from-teal-400 to-emerald-500 shadow-sm">
            K
          </div>
          <span className="text-xl sm:text-2xl font-semibold tracking-tight text-teal-600">
            KidDiary
          </span>
        </div>

        {/* Search (ẩn trên mobile) */}
        <div className="hidden md:flex flex-1 max-w-2xl mx-4">
          <label className="relative w-full">
            <input
              type="text"
              placeholder="Search memories, albums, vaccines…"
              className="w-full rounded-full pl-10 pr-4 py-2 outline-none border border-teal-100
                         focus:ring-2 focus:ring-teal-300/50 focus:border-teal-300 bg-white/90"
            />
            <svg
              viewBox="0 0 24 24"
              className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 opacity-60"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-3.5-3.5" />
            </svg>
          </label>
        </div>

        {/* Avatar/Menu */}
        <div className="shrink-0">
          <ProfileMenu onOpenProfile={onOpenProfile} onLogout={onLogout} />
        </div>
      </header>
    </div>
  );
}

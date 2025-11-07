import React, { useEffect, useRef, useState } from "react";
import ProfileMenu from "./ProfileMenu";

import SearchModal from "./SearchModal";
import axios from "axios";

/**
 * Header cố định (fixed) + tự đo chiều cao và set CSS variable --hdr
 * để phần nội dung phía dưới không bị chui vào dưới header.
 * Có hiệu ứng mờ nền, đổ bóng và đổi style khi scroll.
 * + AI Search functionality
 */
export default function HeaderHome({ onOpenProfile, onLogout }) {
  const ref = useRef(null);
  const [scrolled, setScrolled] = useState(false);


  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    const setVar = () => {
      const h = ref.current?.offsetHeight || 80;
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


  // Xử lý search
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const res = await axios.get(
        `http://localhost:8080/api/search?q=${encodeURIComponent(searchQuery)}`,
        { withCredentials: true }
      );

      if (res.data.errCode === 0) {
        setSearchResults({
          query: searchQuery,
          totalResults: res.data.totalResults,
          data: res.data.data || [],
        });
        setShowSearchModal(true);
      }
    } catch (err) {
      console.error("Search error:", err);
      alert("Search failed. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const closeSearchModal = () => {
    setShowSearchModal(false);
    setSearchResults(null);
  };

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50">
        <header
          ref={ref}
          className={[
            "w-full transition-all duration-300",
            "px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4",
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
                placeholder="Search memories, albums by date or keywords…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isSearching}
                className="w-full rounded-full pl-10 pr-4 py-2 outline-none border border-teal-100
                         focus:ring-2 focus:ring-teal-300/50 focus:border-teal-300 bg-white/90
                         disabled:opacity-50 disabled:cursor-not-allowed"
              />
              {isSearching ? (
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <div className="h-5 w-5 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
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
              )}
            </label>
          </div>

          {/* Avatar/Menu */}
          <div className="shrink-0">
            <ProfileMenu onOpenProfile={onOpenProfile} onLogout={onLogout} />
          </div>
        </header>
      </div>

      {/* Search Results Modal */}
      {showSearchModal && searchResults && (
        <SearchModal
          query={searchResults.query}
          results={searchResults.data}
          totalResults={searchResults.totalResults}
          onClose={closeSearchModal}
        />
      )}
    </>
  );
}
// src/components/RightSidebar.jsx
import { useEffect, useState, useMemo } from "react";

// Đặt trong .env: VITE_API_BASE_URL=http://localhost:8080
const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export default function RightSidebar({ onAdd }) {
  const [children, setChildren] = useState([]);
  const [idx, setIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/api/children`, {
          credentials: "include", // gửi kèm cookie HttpOnly
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (mounted) {
          setChildren(json?.data || []);
          setIdx(0);
        }
      } catch (e) {
        setErr(e.message || "Fetch error");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const current = children.length ? children[idx] : null;

  // Tạo src ảnh: nếu avatarUrl là "/uploads/..", nối với API_BASE
  const avatarSrc = useMemo(() => {
    if (!current) return "";
    if (current.avatarUrl) {
      const url = current.avatarUrl.startsWith("http")
        ? current.avatarUrl
        : `${API_BASE}${current.avatarUrl}`;
      return url;
    }
    // Fallback: avatar chữ cái
    const name = `${current.firstName || ""} ${current.lastName || ""}`.trim() || "Kid";
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=400&background=random`;
  }, [current]);

  const fullName = current
    ? `${current.firstName || ""} ${current.lastName || ""}`.trim() || "Unnamed"
    : "";

  const canSwitch = children.length > 1;
  const prev = () => setIdx((p) => (p - 1 + children.length) % children.length);
  const next = () => setIdx((p) => (p + 1) % children.length);

  return (
    <aside className="sticky top-16 space-y-4">
      <button
        onClick={onAdd}
        className="w-full bg-[#FF6B6B] text-white font-semibold rounded-xl py-3"
      >
        + Add moments
      </button>

      <button className="w-full border rounded-xl py-3 flex items-center justify-center gap-2">
        <span>👪</span> Add family and friends
      </button>

      <div className="rounded-xl border bg-white overflow-hidden">
        {/* State: loading / error / empty / ready */}
        {loading ? (
          <div className="h-40 flex items-center justify-center text-sm text-gray-500">
            Loading children…
          </div>
        ) : err ? (
          <div className="h-40 flex items-center justify-center text-sm text-red-500">
            {err}
          </div>
        ) : !current ? (
          <div className="h-40 flex flex-col items-center justify-center gap-2 p-4 text-center">
            <div className="text-sm text-gray-500">No children yet</div>
            <button
              className="px-3 py-1 rounded-lg bg-gray-900 text-white text-sm"
              onClick={onAdd}
            >
              Add first moment
            </button>
          </div>
        ) : (
          <div className="relative">
            <img
              className="w-full h-40 object-cover"
              src={avatarSrc}
              alt={fullName}
              onError={(e) => {
                e.currentTarget.src =
                  "https://placehold.co/600x300?text=No+Avatar";
              }}
            />

            {/* Nút Back/Next đè trên ảnh */}
            {canSwitch && (
              <>
                <button
                  onClick={prev}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 backdrop-blur flex items-center justify-center shadow hover:bg-white"
                  aria-label="Previous child"
                >
                  ‹
                </button>
                <button
                  onClick={next}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 backdrop-blur flex items-center justify-center shadow hover:bg-white"
                  aria-label="Next child"
                >
                  ›
                </button>
              </>
            )}
          </div>
        )}

        <div className="text-center py-2 font-medium">
          {current ? fullName : "—"}
        </div>

        {/* Dots chỉ vị trí */}
        {children.length > 1 && (
          <div className="pb-3 flex items-center justify-center gap-1.5">
            {children.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                className={`h-2.5 w-2.5 rounded-full ${
                  i === idx ? "bg-gray-900" : "bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Go to child ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      <button className="w-full text-[#ff4b4b] font-medium underline underline-offset-4">
        photo albums
      </button>
    </aside>
  );
}

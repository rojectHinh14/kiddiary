// src/components/RightSidebar.jsx
import { useEffect, useState, useMemo } from "react";

// .env: VITE_API_BASE_URL=http://localhost:8080
const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export default function RightSidebar({ onAdd }) {
  const [albums, setAlbums] = useState([]);  // ⬅️ albums thay cho children
  const [idx, setIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // helper: chuẩn hóa URL ảnh (cover/media)
  const abs = (p) => {
    if (!p || typeof p !== "string") return "";
    const url = p.trim();
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    return `${API_BASE}${url.startsWith("/") ? url : `/${url}`}`;
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setErr("");
        const res = await fetch(`${API_BASE}/api/albums`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json(); // { errCode, data: albums }
        if (!mounted) return;

        const list = Array.isArray(json?.data) ? json.data : [];
        // map: id, title, coverUrl (media đầu tiên nếu có)
        const mapped = list.map((a) => {
          const title =
            a.albumName?.trim?.() ||
            a.title?.trim?.() ||
            `Album #${a.id ?? ""}`;
          const mediaArr = Array.isArray(a.Media) ? a.Media : [];
          const first = mediaArr[0];
          const coverUrl = first?.fileUrl ? abs(first.fileUrl) : "";
          return {
            id: a.id,
            title,
            coverUrl,
            count: mediaArr.length,
          };
        });

        setAlbums(mapped);
        setIdx(0);
      } catch (e) {
        if (mounted) setErr(e.message || "Fetch error");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const current = albums.length ? albums[idx] : null;

  // ảnh cover (fallback placeholder nếu rỗng)
  const coverSrc = useMemo(() => {
    if (!current || !current.coverUrl)
      return "https://placehold.co/600x300?text=No+Cover";
    return current.coverUrl;
  }, [current]);

  const canSwitch = albums.length > 1;
  const prev = () => setIdx((p) => (p - 1 + albums.length) % albums.length);
  const next = () => setIdx((p) => (p + 1) % albums.length);

  return (
    <aside className="sticky top-16 space-y-4">
      <button
        onClick={onAdd}
        className="w-full bg-[#FF6B6B] text-white font-semibold rounded-xl py-3"
      >
        + Add moments
      </button>

      <div className="rounded-xl border bg-white overflow-hidden">
        {/* State: loading / error / empty / ready */}
        {loading ? (
          <div className="h-40 flex items-center justify-center text-sm text-gray-500">
            Loading albums…
          </div>
        ) : err ? (
          <div className="h-40 flex items-center justify-center text-sm text-red-500">
            {err}
          </div>
        ) : !current ? (
          <div className="h-40 flex flex-col items-center justify-center gap-2 p-4 text-center">
            <div className="text-sm text-gray-500">No albums yet</div>
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
              src={coverSrc}
              alt={current.title}
              onError={(e) => {
                e.currentTarget.src =
                  "https://placehold.co/600x300?text=No+Cover";
              }}
            />

            {/* Nút Back/Next đè trên ảnh */}
            {canSwitch && (
              <>
                <button
                  onClick={prev}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 backdrop-blur flex items-center justify-center shadow hover:bg-white"
                  aria-label="Previous album"
                >
                  ‹
                </button>
                <button
                  onClick={next}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 backdrop-blur flex items-center justify-center shadow hover:bg-white"
                  aria-label="Next album"
                >
                  ›
                </button>
              </>
            )}
          </div>
        )}

        <div className="text-center py-2 font-medium">
          {current ? current.title : "—"}
        </div>

        {/* Dots chỉ vị trí */}
        {albums.length > 1 && (
          <div className="pb-3 flex items-center justify-center gap-1.5">
            {albums.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                className={`h-2.5 w-2.5 rounded-full ${
                  i === idx ? "bg-gray-900" : "bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Go to album ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}

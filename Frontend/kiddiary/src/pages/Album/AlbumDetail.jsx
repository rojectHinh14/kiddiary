// src/pages/Album/AlbumDetail.jsx
import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import {
  getAlbumByIdService,
  removeManyFromAlbumService, // <-- dùng cho xóa 1 hoặc nhiều
} from "../../services/albumService";
import AlbumCreateWizard from "./AlbumCreateWizard";

export default function AlbumDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showWizard, setShowWizard] = useState(false);

  // select mode
  const [selectMode, setSelectMode] = useState(false);
  const [selected, setSelected] = useState(() => new Set()); // Set<string>

  const mapResponse = (a) => ({
    ...a,
    title: a.albumName,
    year: new Date(a.createdAt).getFullYear(),
    description: a.description || "No description yet.",
    items: (a.Media || []).map((m) => ({
      id: m.id,
      img: m.fileUrl?.startsWith("/")
        ? `${import.meta.env.VITE_BACKEND_URL}${m.fileUrl}`
        : m.fileUrl,
      title: m.description || "Untitled",
      date: m.date || a.createdAt,
      desc: m.aiTags || "",
    })),
  });

  const refetch = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAlbumByIdService(id);
      if (res.data?.errCode === 0) setAlbum(mapResponse(res.data.data));
      else setAlbum(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  // ESC to exit select mode
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        setSelectMode(false);
        setSelected(new Set());
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const handleFinishAdd = async () => {
    setShowWizard(false);
    await refetch();
  };

  // --- select helpers (dùng string id để so sánh ổn định) ---
  const toggleSelect = (mediaId) => {
    const key = String(mediaId);
    setSelected((prev) => {
      const n = new Set(prev);
      if (n.has(key)) n.delete(key);
      else n.add(key);
      return n;
    });
  };

  const selectAll = () => {
    if (!album?.items?.length) return;
    setSelected(new Set(album.items.map((x) => String(x.id))));
  };

  const clearSelect = () => setSelected(new Set());

  // Xóa theo selected (1 hoặc nhiều đều OK)
  const handleRemove = async () => {
    if (selected.size === 0) return;

    const confirmText =
      selected.size === 1
        ? "Remove this moment from the album?"
        : `Remove ${selected.size} moments from the album?`;
    if (!confirm(confirmText)) return;

    try {
      const okIds = await removeManyFromAlbumService(id, Array.from(selected));
      // cập nhật UI tại chỗ
      setAlbum((prev) => {
        if (!prev) return prev;
        const removed = new Set(okIds.map(String));
        return {
          ...prev,
          items: prev.items.filter((it) => !removed.has(String(it.id))),
        };
      });
      // reset chọn
      setSelected(new Set());
      setSelectMode(false);
    } catch (e) {
      alert(e?.message || "Remove failed");
    }
  };

  // Xóa nhanh 1 item (khi không ở select mode)
  const removeOne = async (mediaId) => {
    if (!confirm("Remove this moment from the album?")) return;
    try {
      await removeManyFromAlbumService(id, [String(mediaId)]);
      setAlbum((prev) =>
        !prev
          ? prev
          : {
              ...prev,
              items: prev.items.filter(
                (it) => String(it.id) !== String(mediaId)
              ),
            }
      );
    } catch (e) {
      alert(e?.message || "Remove failed");
    }
  };

  /* ---------- UI ---------- */

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 lg:px-6 py-8">
        <div className="sticky top-0 z-10 -mx-4 lg:-mx-6 px-4 lg:px-6 py-3 backdrop-blur bg-[#FFF9F0]/70 border-b">
          <div className="h-8 w-28 rounded-full bg-black/5 animate-pulse" />
        </div>

        <div className="mt-6 grid gap-4">
          <div className="h-28 rounded-2xl bg-black/5 animate-pulse" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-[4/3] rounded-2xl bg-black/5 animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!album) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-16 text-center">
        <p className="text-gray-600">Album not found.</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 rounded-xl border hover:bg-black/5"
        >
          Go back
        </button>
      </div>
    );
  }

  const total = album.items.length;
  const selectedCount = selected.size;

  return (
    <div className="max-w-6xl mx-auto px-4 lg:px-6 py-6">
      {/* Sticky toolbar */}
      <div className="sticky top-0 z-10 -mx-4 lg:-mx-6 px-4 lg:px-6 py-3 backdrop-blur bg-[#FFF9F0]/70 border-b">
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 rounded-xl px-3 py-2 border hover:bg-black/5"
          >
            <span className="text-lg">←</span>
            <span className="font-medium">Back</span>
          </button>

          {!selectMode ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectMode(true)}
                className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 font-medium hover:bg-black/5"
                title="Select moments to remove"
              >
                Select
              </button>
              <button
                onClick={() => setShowWizard(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-[#FF6B6B] text-white px-4 py-2 font-medium shadow hover:brightness-95"
              >
                ＋ Add more moments
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={selectAll}
                className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 hover:bg-black/5"
                title="Select all"
              >
                Select all
              </button>
              <button
                onClick={clearSelect}
                className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 hover:bg-black/5"
                title="Clear"
              >
                Clear
              </button>
              <button
                onClick={handleRemove}
                disabled={selectedCount === 0}
                className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 font-medium shadow
                  ${selectedCount === 0 ? "bg-red-200 text-white cursor-not-allowed" : "bg-red-600 text-white hover:bg-red-700"}`}
              >
                Remove {selectedCount > 0 ? `(${selectedCount})` : ""}
              </button>
              <button
                onClick={() => { setSelectMode(false); setSelected(new Set()); }}
                className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 hover:bg-black/5"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Album hero */}
      <section className="mt-6 rounded-2xl border bg-white/70 shadow-sm">
        <div className="p-5 sm:p-7">
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-sm font-semibold">
              {album.year}
            </span>
            <span className="px-3 py-1 rounded-full bg-black/5 text-gray-700 text-sm">
              {total} {total === 1 ? "photo" : "photos"}
            </span>
          </div>

          <h1 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight">
            {album.title}
          </h1>

          <p className="mt-2 text-gray-600 max-w-3xl">{album.description}</p>
        </div>
      </section>

      {/* Grid */}
      {total === 0 ? (
        <div className="mt-10 rounded-2xl border bg-white/70 p-10 text-center">
          <p className="text-gray-600">This album is empty. Start adding moments!</p>
          <button
            onClick={() => setShowWizard(true)}
            className="mt-4 rounded-xl bg-[#FF6B6B] text-white px-4 py-2 font-medium hover:brightness-95"
          >
            Add photos
          </button>
        </div>
      ) : (
        <div className={`mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 ${selectMode ? "select-none" : ""}`}>
          {album.items.map((it) => {
            const checked = selected.has(String(it.id));
            return (
              <figure
                key={it.id}
                className={`group overflow-hidden rounded-2xl border bg-white shadow-sm hover:shadow-md transition-shadow ${
                  checked ? "ring-2 ring-red-400" : ""
                }`}
                onClick={() => {
                  if (selectMode) toggleSelect(it.id);
                }}
              >
                <div className="relative">
                  <img
                    src={it.img}
                    alt={it.title}
                    className="w-full aspect-[4/3] object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  />

                  {/* checkbox overlay khi selectMode */}
                  {selectMode && (
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); toggleSelect(it.id); }}
                      className={`absolute top-3 left-3 h-7 w-7 rounded-full border-2 flex items-center justify-center backdrop-blur
                        ${checked ? "bg-red-500 border-red-500" : "bg-white/80 border-white"}`}
                      title={checked ? "Unselect" : "Select"}
                    >
                      {checked ? (
                        <svg viewBox="0 0 20 20" className="h-4 w-4 text-white">
                          <path d="M7.5 13.1 3.9 9.5l-1.4 1.4L7.5 16 18 5.5 16.6 4.1z" />
                        </svg>
                      ) : (
                        <span className="block h-3 w-3 rounded-full bg-black/20" />
                      )}
                    </button>
                  )}

                  {/* nút xoá nhanh 1 item khi KHÔNG ở select mode */}
                  {!selectMode && (
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); removeOne(it.id); }}
                      className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white/80 backdrop-blur border hover:bg-white"
                      title="Remove this moment"
                    >
                      🗑️
                    </button>
                  )}

                  {/* caption */}
                  <figcaption className="absolute inset-x-0 bottom-0 p-3 sm:p-4 bg-gradient-to-t from-black/60 to-transparent text-white">
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <div className="truncate font-semibold">{it.title}</div>
                        {it.desc && (
                          <div className="truncate text-xs opacity-90">{it.desc}</div>
                        )}
                      </div>
                      <span className="shrink-0 rounded-full bg-white/20 px-2 py-0.5 text-xs">
                        {format(new Date(it.date), "MMM dd")}
                      </span>
                    </div>
                  </figcaption>
                </div>
              </figure>
            );
          })}
        </div>
      )}

      {/* Wizard */}
      {showWizard && (
        <AlbumCreateWizard
          onClose={() => setShowWizard(false)}
          albumId={id}
          onFinish={handleFinishAdd}
        />
      )}
    </div>
  );
}

// src/pages/Album/AlbumDetail.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { getAlbumByIdService } from "../../services/albumService";
import AlbumCreateWizard from "./AlbumCreateWizard";

export default function AlbumDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showWizard, setShowWizard] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await getAlbumByIdService(id);
        if (res.data?.errCode === 0) {
          const a = res.data.data;
          setAlbum({
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
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleFinishAdd = () => {
    // refetch
    setShowWizard(false);
    // re-run effect
    (async () => {
      try {
        setLoading(true);
        const res = await getAlbumByIdService(id);
        if (res.data?.errCode === 0) {
          const a = res.data.data;
          setAlbum({
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
        }
      } finally {
        setLoading(false);
      }
    })();
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

  return (
    <div className="max-w-6xl mx-auto px-4 lg:px-6 py-6">

      {/* Sticky toolbar */}
      <div className="sticky top-0 z-10 -mx-4 lg:-mx-6 px-4 lg:px-6 py-3 backdrop-blur bg-[#FFF9F0]/70 border-b">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 rounded-xl px-3 py-2 border hover:bg-black/5"
          >
            <span className="text-lg">←</span>
            <span className="font-medium">Back</span>
          </button>

          <button
            onClick={() => setShowWizard(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-[#FF6B6B] text-white px-4 py-2 font-medium shadow hover:brightness-95"
          >
            ＋ Add more moments
          </button>
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
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {album.items.map((it) => (
            <figure
              key={it.id}
              className="group overflow-hidden rounded-2xl border bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="relative">
                <img
                  src={it.img}
                  alt={it.title}
                  className="w-full aspect-[4/3] object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />
                {/* overlay */}
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
          ))}
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

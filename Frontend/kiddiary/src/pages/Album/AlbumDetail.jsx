// AlbumDetail.jsx
import { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";

export default function AlbumDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Demo data: trong dự án thật, fetch bằng id
  const album = useMemo(
    () => ({
      id,
      title: "January",
      year: 2022,
      description:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      items: [
        {
          id: "p1",
          img: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=1200&auto=format&fit=crop",
          title: "Title Text",
          date: "2022-01-31",
          desc:
            "Lorem ipsum dolor sit amet, consectetur elit, sed do eiusmod tempor incididunt ut labore…",
        },
        {
          id: "p2",
          img: "https://images.unsplash.com/photo-1562552052-7cfdc0bd3b2b?q=80&w=1200&auto=format&fit=crop",
          title: "Title Text",
          date: "2022-01-31",
          desc:
            "Lorem ipsum dolor sit amet, consectetur elit, sed do eiusmod tempor incididunt ut labore…",
        },
        {
          id: "p3",
          img: "https://images.unsplash.com/photo-1470115636492-6d2b56f9146e?q=80&w=1200&auto=format&fit=crop",
          title: "Title Text",
          date: "2022-01-31",
          desc:
            "Lorem ipsum dolor sit amet, consectetur elit, sed do eiusmod tempor incididunt ut labore…",
        },
      ],
    }),
    [id]
  );

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      {/* Back */}
      <button onClick={() => navigate(-1)} className="text-sm hover:underline mb-4">
        ← Back
      </button>

      {/* Year */}
      <h1 className="text-4xl font-bold">{album.year}</h1>
      <p className="mt-2 text-gray-600">{album.description}</p>

      {/* Month header */}
      <div className="mt-8 flex items-center justify-between border-b pb-2">
        <h2 className="text-2xl font-semibold">{album.title}</h2>
        <div className="flex items-center gap-4 text-gray-500">
          <button className="hover:text-black">‹</button>
          <button className="hover:text-black">›</button>
        </div>
      </div>

      {/* Grid items */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {album.items.map((it) => (
          <div key={it.id} className="rounded-xl overflow-hidden border bg-white shadow-sm">
            <div className="relative">
              <img src={it.img} alt="" className="w-full aspect-[4/3] object-cover" />
              {/* location badge */}
            </div>

            <div className="p-3">
              <div className="flex items-center justify-between">
                <div className="font-medium">{it.title}</div>
                <div className="text-xs text-gray-500">📅 {format(new Date(it.date), "MMM dd")}</div>
              </div>
              <p className="mt-2 text-sm text-gray-600 line-clamp-2">{it.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

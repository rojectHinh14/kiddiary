// AlbumDetail.jsx
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
    fetchAlbum();
  }, [id]);

  const fetchAlbum = async () => {
    try {
      setLoading(true);
      const response = await getAlbumByIdService(id);
      if (response.data.errCode === 0) {
        const rawAlbum = response.data.data;
        const mappedAlbum = {
          ...rawAlbum,
          title: rawAlbum.albumName,
          year: new Date(rawAlbum.createdAt).getFullYear(),
          description: rawAlbum.description || "No description",
          items: (rawAlbum.Media || []).map((media) => ({
            id: media.id,
            img: media.fileUrl.startsWith("/")
              ? `http://localhost:8080${media.fileUrl}`
              : media.fileUrl,
            title: media.description || "Untitled photo",
            date: media.date || rawAlbum.createdAt,
            desc: media.aiTags || "No description",
          })),
        };
        setAlbum(mappedAlbum);
      }
    } catch (error) {
      console.error("Error fetching album:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFinishAdd = () => {
    fetchAlbum(); // Refetch để update items
    setShowWizard(false);
  };

  if (loading) {
    return <div className="text-center py-8">Loading album...</div>;
  }

  if (!album) {
    return <div className="text-center py-8">Album not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      {/* Back & Add button */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => navigate(-1)}
          className="text-sm hover:underline"
        >
          ← Back
        </button>
        <button
          onClick={() => setShowWizard(true)}
          className="px-4 py-2 bg-[#FF6B6B] text-white rounded-md font-medium hover:bg-[#FF6B6B]/90"
        >
          Add more moments
        </button>
      </div>

      {/* Year & Desc */}
      <h1 className="text-4xl font-bold">{album.year}</h1>
      <p className="mt-2 text-gray-600">{album.description}</p>

      {/* Title & Nav */}
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
          <div
            key={it.id}
            className="rounded-xl overflow-hidden border bg-white shadow-sm"
          >
            <div className="relative">
              <img
                src={it.img}
                alt=""
                className="w-full aspect-[4/3] object-cover"
              />
            </div>
            <div className="p-3">
              <div className="flex items-center justify-between">
                <div className="font-medium">{it.title}</div>
                <div className="text-xs text-gray-500">
                  📅 {format(new Date(it.date), "MMM dd")}
                </div>
              </div>
              <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                {it.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Wizard cho add more */}
      {showWizard && (
        <AlbumCreateWizard
          onClose={() => setShowWizard(false)}
          albumId={id} // Mode add (không có initialAlbumInfo)
          onFinish={handleFinishAdd}
        />
      )}
    </div>
  );
}

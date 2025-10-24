// AlbumPanel.jsx
import { useState, useEffect } from "react";
import NewAlbumDialog from "./NewAlbumDialog";
import AlbumGrid from "./AlbumGrid";
import AlbumCreateWizard from "./AlbumCreateWizard";
import { getAllAlbumsByUserService } from "../../services/albumService";

export default function AlbumPanel() {
  const [open, setOpen] = useState(false);
  const [openWizard, setOpenWizard] = useState(false);
  const [pendingAlbum, setPendingAlbum] = useState(null);
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentAlbumIdForAdd, setCurrentAlbumIdForAdd] = useState(null);
  useEffect(() => {
    fetchAlbums();
  }, []);

  const fetchAlbums = async () => {
    try {
      setLoading(true);
      const response = await getAllAlbumsByUserService();
      if (response.data.errCode === 0) {
        const mappedAlbums = response.data.data.map((album) => ({
          ...album,
          title: album.albumName,
          coverUrl: album.Media?.[0]?.fileUrl
            ? `http://localhost:8080${album.Media[0].fileUrl}`
            : "https://placehold.co/400x300?text=No+Cover",
          photos: album.Media || [],
        }));
        setAlbums(mappedAlbums);
      }
    } catch (error) {
      console.error("Error fetching albums:", error);
    } finally {
      setLoading(false);
    }
  };

  // Khi finish wizard (tạo mới hoặc add), refetch
  const handleFinishWizard = (selectedIds, newAlbumId = null) => {
    fetchAlbums(); // Refetch để update list và count photos
    console.log(
      "Finished with selected:",
      selectedIds,
      "Album ID:",
      newAlbumId
    );
  };

  if (loading) {
    return <div className="text-center py-8">Loading albums...</div>;
  }

  return (
    <div className="max-w-[1100px] mx-auto">
      {/* Header */}
      <div className="text-center pt-6">
        <h2 className="text-2xl font-semibold">Photo albums</h2>
        <p className="text-gray-600 mt-1">
          Photo albums are great for organizing and sharing your moments
        </p>
        <button
          onClick={() => setOpen(true)}
          className="mt-3 text-[#ff4b4b] font-medium hover:underline"
        >
          Add new album
        </button>
      </div>

      {/* Grid */}
      <AlbumGrid
        albums={albums}
        onAddClick={() => setOpen(true)}
        onAddToAlbum={(albumId) => {
          setCurrentAlbumIdForAdd(albumId);
          setOpenWizard(true);
        }}
      />

      {/* Step 1: Dialog nhập title cho album mới */}
      <NewAlbumDialog
        open={open}
        onClose={() => setOpen(false)}
        onNext={(info) => {
          setPendingAlbum(info);
          setOpen(false);
          setOpenWizard(true);
        }}
      />

      {/* Wizard: Chọn media và xử lý create/add */}
      {openWizard && (
        <AlbumCreateWizard
          onClose={() => {
            setOpenWizard(false);
            setCurrentAlbumIdForAdd(null);
            setPendingAlbum(null); // Reset
          }}
          initialAlbumInfo={currentAlbumIdForAdd ? null : pendingAlbum}
          onFinish={handleFinishWizard}
          albumId={currentAlbumIdForAdd || null}
        />
      )}
    </div>
  );
}

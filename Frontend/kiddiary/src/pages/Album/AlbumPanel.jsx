// AlbumPanel.jsx (cập nhật)
import { useState, useEffect } from "react";
import NewAlbumDialog from "./NewAlbumDialog";
import AlbumGrid from "./AlbumGrid";
import AlbumCreateWizard from "./AlbumCreateWizard";
import { getAllAlbumsByUserService } from "../../services/albumService";

export default function AlbumPanel() {
  const [openNewDialog, setOpenNewDialog] = useState(false); // ← Đổi tên cho rõ (chỉ cho NewAlbumDialog)
  const [pendingAlbum, setPendingAlbum] = useState(null); // Giữ nguyên, chỉ dùng cho create new
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);

  // ← MỚI: State bundle cho Wizard
  const [wizardConfig, setWizardConfig] = useState({
    open: false,
    albumId: null,
    initialInfo: null, // Chỉ dùng khi create new
  });

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

  // Khi finish wizard (tạo mới hoặc add), refetch & close
  const handleFinishWizard = (selectedIds, newAlbumId = null) => {
    fetchAlbums(); // Refetch để update list và count photos
    closeWizard(); // ← MỚI: Close wizard
  };

  // ← MỚI: Helper close wizard
  const closeWizard = () => {
    setWizardConfig({ open: false, albumId: null, initialInfo: null });
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
          onClick={() => setOpenNewDialog(true)} // ← Đổi: Chỉ open dialog, không wizard
          className="mt-3 text-[#ff4b4b] font-medium hover:underline"
        >
          Add new album
        </button>
      </div>

      {/* Grid */}
      <AlbumGrid
        albums={albums}
        onAddClick={() => setOpenNewDialog(true)} // ← Đổi: Chỉ open dialog
        onAddToAlbum={(albumId) => {
          // ← FIX: Bundle state ngay lập tức, đảm bảo nhất quán
          setWizardConfig({ open: true, albumId, initialInfo: null });
        }}
      />

      {/* Step 1: Dialog nhập title cho album mới */}
      <NewAlbumDialog
        open={openNewDialog} // ← Đổi tên
        onClose={() => setOpenNewDialog(false)}
        onNext={(info) => {
          setPendingAlbum(info);
          setOpenNewDialog(false); // Close dialog
          // ← FIX: Bundle state cho create new
          setWizardConfig({ open: true, albumId: null, initialInfo: info });
        }}
      />

      {/* Wizard: Chọn media và xử lý create/add */}
      {wizardConfig.open && ( // ← Đổi: Dùng wizardConfig.open
        <AlbumCreateWizard
          onClose={closeWizard} // ← Đổi: Dùng helper
          initialAlbumInfo={wizardConfig.initialInfo} // ← Đổi: Từ config
          onFinish={handleFinishWizard}
          albumId={wizardConfig.albumId} // ← Đổi: Từ config, luôn đúng
        />
      )}
    </div>
  );
}

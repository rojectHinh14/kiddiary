// AlbumPanel.jsx
import { useState } from "react";
import NewAlbumDialog from "./NewAlbumDialog";
import AlbumGrid from "./AlbumGrid";
import AlbumCreateWizard from "./AlbumCreateWizard"; // 👈 THÊM IMPORT NÀY

export default function AlbumPanel() {
  const [open, setOpen] = useState(false);
  const [openWizard, setOpenWizard] = useState(false);
  const [pendingAlbum, setPendingAlbum] = useState(null); // 👈 dữ liệu bước 1

  const [albums, setAlbums] = useState([
    { id: "a1", title: "First Birthday", coverUrl: "https://images.unsplash.com/photo-1548625149-9129dad7b0ec?q=80&w=1200&auto=format&fit=crop", photos: new Array(24).fill(0).map((_, i) => `p${i}`) },
    { id: "a2", title: "Summer Picnic", coverUrl: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?q=80&w=1200&auto=format&fit=crop", photos: new Array(12).fill(0).map((_, i) => `p${i}`) },
    { id: "a3", title: "Buddy & Doggo", coverUrl: "https://images.unsplash.com/photo-1517423440428-a5a00ad493e8?q=80&w=1200&auto=format&fit=crop", photos: new Array(9).fill(0).map((_, i) => `p${i}`) },
  ]);

  // khi finish wizard, tạo album thật (mock)
  const handleFinishWizard = (selectedMomentIds = []) => {
    const coverUrl = pendingAlbum?.coverFile
      ? URL.createObjectURL(pendingAlbum.coverFile)
      : "https://placehold.co/800x600?text=Album";

    const newAlbum = {
      id: crypto.randomUUID(),
      title: pendingAlbum?.title || "Untitled album",
      coverUrl,
      description: pendingAlbum?.description || "",
      photos: selectedMomentIds, // ở đây mình lưu id; bạn có thể map sang url
      createdAt: new Date().toISOString(),
    };

    setAlbums((prev) => [newAlbum, ...prev]);
    setOpenWizard(false);
    setPendingAlbum(null);
  };

  return (
    <div className="max-w-[1100px] mx-auto">
      {/* Header */}
      <div className="text-center pt-6">
        <h2 className="text-2xl font-semibold">Photo albums</h2>
        <p className="text-gray-600 mt-1">
          Photo albums are great for organizing and sharing your moments
        </p>
        <button onClick={() => setOpen(true)} className="mt-3 text-[#ff4b4b] font-medium hover:underline">
          Add new album
        </button>
      </div>

      {/* Grid */}
      <AlbumGrid albums={albums} onAddClick={() => setOpen(true)} />

      {/* Step 1: Dialog nhập thông tin */}
      <NewAlbumDialog
        open={open}
        onClose={() => setOpen(false)}
        onNext={(info) => {
          setPendingAlbum(info);  // lưu dữ liệu
          setOpen(false);         // đóng dialog
          setOpenWizard(true);    // 👉 mở bước 2
        }}
      />

      {/* Step 2: Wizard chọn moments */}
      {openWizard && (
        <AlbumCreateWizard
          onClose={() => setOpenWizard(false)}
          initialAlbumInfo={pendingAlbum}
          onFinish={handleFinishWizard} // trả về mảng id moments đã chọn
        />
      )}
    </div>
  );
}

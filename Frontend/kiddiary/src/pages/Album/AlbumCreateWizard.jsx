// AlbumCreateWizard.jsx
import { useState, useEffect, useMemo } from "react";
import { getAllMediaByUserService } from "../../services/mediaService";
import {
  createAlbumService,
  addMediaToAlbumService,
} from "../../services/albumService";

export default function AlbumCreateWizard({
  onClose,
  initialAlbumInfo,
  onFinish,
  albumId = null,
}) {
  const [step, setStep] = useState(2);
  const albumInfo = useMemo(
    () => initialAlbumInfo || { title: "", description: "", coverFile: null },
    [initialAlbumInfo]
  );
  const [medias, setMedias] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  useEffect(() => {
    fetchMedias();
  }, []);

  const fetchMedias = async () => {
    try {
      setLoading(true);
      const response = await getAllMediaByUserService();
      if (response.data.errCode === 0) {
        setMedias(
          response.data.data.map((media) => ({
            id: media.id,
            img: media.fileUrl.startsWith("/")
              ? `http://localhost:8080${media.fileUrl}`
              : media.fileUrl,
            title: media.description || "Untitled photo",
            date: media.date,
            desc: media.aiTags || "",
          }))
        );
      }
    } catch (error) {
      console.error("Error fetching medias:", error);
      // show toast error
    } finally {
      setLoading(false);
    }
  };

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const finish = async () => {
    if (selectedIds.length === 0 || isSubmitting) return;
    setIsSubmitting(true);

    try {
      let newAlbumId = albumId;
      if (!albumId) {
        const createResponse = await createAlbumService({
          albumName: albumInfo.title || "Untitled album", // ← Đảm bảo title từ dialog
          albumTypeCode: "NORMAL",
        });
        if (createResponse.data.errCode !== 0) {
          throw new Error("Failed to create album");
        }
        newAlbumId = createResponse.data.data.id;
      } else {
        console.log("DEBUG: Adding to existing albumId:", albumId); // ← THÊM
      }

      const addResponse = await addMediaToAlbumService(newAlbumId, selectedIds);
      if (addResponse.data.errCode === 0) {
        onFinish?.(selectedIds, newAlbumId);
        onClose();
      } else {
        console.error("DEBUG: Add response error:", addResponse); // ← THÊM
        throw new Error("Failed to add media");
      }
    } catch (error) {
      console.error("Error in finish:", error);
      alert("Failed to add moments");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-6">Loading moments...</div>
      </div>
    );
  }

  const title = albumId ? "Add moments to album" : "Add moments to new album";
  const subtitle = albumId ? "" : albumInfo.title;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="max-w-6xl w-full mx-6 bg-white rounded-2xl p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-center text-xl font-semibold">{title}</h2>
        {subtitle && (
          <p className="text-center text-[#FF6B6B] mt-1">{subtitle}</p>
        )}

        {/* Grid chọn media: Hiển thị ảnh với checkbox */}
        <div className="mt-6 grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {medias.map((media) => (
            <div
              key={media.id}
              className={`relative rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${
                selectedIds.includes(media.id)
                  ? "border-[#FF6B6B] bg-[#FF6B6B]/10"
                  : "border-gray-200"
              }`}
              onClick={() => toggleSelect(media.id)}
            >
              <img
                src={media.img}
                alt={media.title}
                className="w-full h-32 object-cover"
              />
              {selectedIds.includes(media.id) && (
                <div className="absolute top-1 right-1 w-5 h-5 bg-[#FF6B6B] rounded-full flex items-center justify-center text-white text-xs">
                  ✓
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Summary và buttons */}
        <div className="mt-6 text-center">
          <div className="text-gray-500 mb-3">
            {selectedIds.length} moments selected
          </div>
          <button
            onClick={finish}
            disabled={selectedIds.length === 0 || isSubmitting} // ← THÊM isSubmitting
            className="px-6 py-2 rounded-md bg-[#FF6B6B] text-white font-semibold disabled:opacity-50"
          >
            {isSubmitting
              ? "Processing..."
              : albumId
              ? "Add moments to album"
              : "Create album with moments"}{" "}
            // ← THÊM loading text
          </button>
          <button
            onClick={onClose}
            disabled={isSubmitting} // ← THÊM disable cancel khi submitting
            className="ml-4 text-[#FF6B6B] font-medium disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

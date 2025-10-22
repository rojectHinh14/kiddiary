// AlbumCreateWizard.jsx
import { useMemo, useState } from "react";

export default function AlbumCreateWizard({ onClose, initialAlbumInfo, onFinish }) {
  const [step, setStep] = useState(2); // khi mở từ panel, ta vào thẳng step 2
  const [albumInfo] = useState(initialAlbumInfo || { title: "", description: "", coverFile: null });

  const moments = useMemo(
    () => Array.from({ length: 18 }).map((_, i) => ({ id: `m${i + 1}`, img: `https://picsum.photos/seed/${i + 100}/240/180` })),
    []
  );
  const [selectedIds, setSelectedIds] = useState([]);

  const finish = () => {
    onFinish?.(selectedIds);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="max-w-6xl w-full mx-6 bg-white rounded-2xl p-6">
        <h2 className="text-center text-xl font-semibold">Add moments to album</h2>
        <p className="text-center text-[#FF6B6B] mt-1">{albumInfo?.title}</p>

        {/* ... grid chọn moments như bạn đang có ... */}
        {/* Sau khi chọn */}
        <div className="mt-6 text-center">
          <div className="text-gray-500 mb-3">{selectedIds.length} moments selected</div>
          <button onClick={finish} className="px-6 py-2 rounded-md bg-[#FF6B6B] text-white font-semibold">
            Add moments to album
          </button>
          <button onClick={onClose} className="ml-4 text-[#FF6B6B] font-medium">Cancel</button>
        </div>
      </div>
    </div>
  );
}

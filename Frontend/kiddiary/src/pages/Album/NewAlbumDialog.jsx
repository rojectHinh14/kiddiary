// NewAlbumDialog.jsx
import { useRef, useState } from "react";

export default function NewAlbumDialog({ open, onClose, onNext }) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [preview, setPreview] = useState(null);
  const fileRef = useRef(null);

  if (!open) return null;

  const handleNext = () => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      alert("Please enter album title"); 
      return;
    }
    const file = fileRef.current?.files?.[0] || null;
    onNext?.({
      title: trimmedTitle,
      description: desc.trim(),
      coverFile: file,
    });
  };

  const handleFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    setPreview(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-[720px] rounded-2xl bg-white shadow-xl p-8">
        <h3 className="text-center text-xl font-semibold">Add new album</h3>

        <div className="mt-8 space-y-6">
          <div>
            <label className="block text-sm font-medium">Title</label>
            <input
              className="mt-1 w-full rounded-xl border px-3 py-2"
              placeholder="Album title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Description</label>
            <input
              className="mt-1 w-full rounded-xl border px-3 py-2"
              placeholder="Album description"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />
          </div>

          <div>
          </div>
        </div>

        <div className="mt-8 flex gap-4">
          <button
            onClick={handleNext}
            className="px-5 py-2 rounded-xl bg-[#FF6B6B] text-white font-semibold"
          >
            Next
          </button>
          <button onClick={onClose} className="text-[#FF6B6B] font-medium">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

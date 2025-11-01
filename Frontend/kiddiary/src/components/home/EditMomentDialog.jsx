// src/components/home/EditMomentDialog.jsx
import React, { useEffect, useState } from "react";
import { format } from "date-fns";

export default function EditMomentDialog({ initial, onClose, onSubmit }) {
  const [caption, setCaption] = useState("");
  const [date, setDate] = useState(new Date());
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(initial?.image || "");

  useEffect(() => {
    if (!initial) return;
    setCaption(initial.caption || "");
    setDate(initial.date ? new Date(initial.date) : new Date());
    setPreview(initial.image || "");
  }, [initial]);

  useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const submit = (e) => {
    e.preventDefault();
    onSubmit({ id: initial.id, caption, file, date });
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center" onClick={onClose} role="dialog" aria-modal>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <form
        onClick={(e)=>e.stopPropagation()}
        onSubmit={submit}
        className="relative w-[min(560px,95vw)] rounded-2xl bg-white shadow-xl border border-black/10 p-5"
      >
        <div className="text-lg font-semibold">Edit post</div>

        <label className="block mt-4 text-sm font-medium">Caption</label>
        <textarea
          value={caption}
          onChange={(e)=>setCaption(e.target.value)}
          rows={3}
          className="mt-1 w-full rounded-lg border p-2 outline-none focus:ring-2 focus:ring-teal-300/60"
          placeholder="Say something..."
        />

        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-[1fr,180px]">
          <div>
            <label className="block text-sm font-medium">Date</label>
            <input
              type="date"
              value={format(date, "yyyy-MM-dd")}
              onChange={(e)=>setDate(new Date(e.target.value))}
              className="mt-1 w-full rounded-lg border p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Change image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e)=>setFile(e.target.files?.[0] || null)}
              className="mt-1 block w-full text-sm"
            />
          </div>
        </div>

        {/* preview */}
        <div className="mt-4 rounded-xl border bg-gray-50 p-2 grid place-items-center">
          {preview ? (
            <img src={preview} alt="" className="max-h-[320px] object-contain" />
          ) : (
            <div className="h-[120px] grid place-items-center text-gray-400">No image</div>
          )}
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="h-9 px-4 rounded-lg border hover:bg-black/5">
            Cancel
          </button>
          <button type="submit" className="h-9 px-4 rounded-lg bg-teal-600 text-white hover:bg-teal-700">
            Save changes
          </button>
        </div>
      </form>
    </div>
  );
}

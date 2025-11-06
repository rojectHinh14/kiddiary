import React from "react";

export default function ChildViewDialog({ child, onClose /*, onEdit*/ }) {
  const name =
    child?.name ||
    `${child?.firstName || ""} ${child?.lastName || ""}`.trim() ||
    child?.fullName ||
    child?.childName ||
    "Unnamed";

  const raw = child?.image || child?.avatar || child?.imageUrl || child?.fileUrl || null;
  const avatar = raw
    ? (raw.startsWith?.("http") ? raw : `${import.meta.env.VITE_BACKEND_URL}${raw}`)
    : null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        className="relative w-[min(560px,95vw)] rounded-2xl bg-white p-5 shadow-xl border border-black/10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-4">
          <img
            src={avatar || "https://i.pravatar.cc/160?img=1"}
            alt={name}
            className="h-20 w-20 rounded-full object-cover border"
          />
        </div>

        <div className="mt-4">
          <div className="text-lg font-semibold">{name}</div>
          {child?.dateOfBirth && <div className="text-sm text-gray-600">DOB: {child.dateOfBirth}</div>}
          {child?.gender && <div className="text-sm text-gray-600">Gender: {child.gender}</div>}
          {child?.note && <div className="mt-2 text-sm text-gray-700 bg-gray-50 rounded-lg p-3">{child.note}</div>}
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button onClick={onClose} className="h-9 px-4 rounded-lg border hover:bg-black/5">Close</button>
          {/* <button onClick={onEdit} className="h-9 px-4 rounded-lg bg-teal-600 text-white hover:bg-teal-700">Edit</button> */}
        </div>
      </div>
    </div>
  );
}

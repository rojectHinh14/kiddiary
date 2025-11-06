import React, { useState } from "react";

export default function ChildCard({
  child,
  selectMode = false,
  selected = false,
  onToggleSelect,
  onOpenDetail,
}) {
  const name =
    child?.name ||
    `${child?.firstName || ""} ${child?.lastName || ""}`.trim() ||
    child?.fullName ||
    child?.childName ||
    "Unnamed";

  const [imgOk, setImgOk] = useState(Boolean(child?.image));
  const initials = name.split(" ").filter(Boolean).slice(0, 2).map(s => s[0]?.toUpperCase()).join("") || "K";

  return (
    <div className="flex flex-col items-center">
      <div
        className={[
          "relative w-40 h-40 rounded-full border overflow-hidden shadow-sm transition",
          selected ? "ring-2 ring-red-400" : "",
          !selectMode && "cursor-pointer hover:shadow-md",
        ].join(" ")}
        onClick={() => (selectMode ? onToggleSelect?.() : onOpenDetail?.())}
      >
        {imgOk && child?.image ? (
          <img
            src={child.image}
            alt={name}
            className="w-full h-full object-cover select-none"
            draggable={false}
            onError={(e) => {
              console.warn("[ChildCard] image failed:", child.image);
              setImgOk(false);
            }}
          />
        ) : (
          <div className="w-full h-full grid place-items-center bg-gray-100 text-gray-600 text-3xl font-semibold select-none">
            {initials}
          </div>
        )}

        {selectMode && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onToggleSelect?.(); }}
            className={`absolute top-2 left-2 h-7 w-7 rounded-full border-2 flex items-center justify-center backdrop-blur ${
              selected ? "bg-red-500 border-red-500" : "bg-white/80 border-white"
            }`}
            title={selected ? "Unselect" : "Select"}
          >
            {selected ? (
              <svg viewBox="0 0 20 20" className="h-4 w-4 text-white"><path d="M7.5 13.1 3.9 9.5l-1.4 1.4L7.5 16 18 5.5 16.6 4.1z" /></svg>
            ) : (
              <span className="block h-3 w-3 rounded-full bg-black/20" />
            )}
          </button>
        )}
      </div>

      <p className="mt-2 text-sm font-medium max-w-[12rem] truncate">{name}</p>
    </div>
  );
}

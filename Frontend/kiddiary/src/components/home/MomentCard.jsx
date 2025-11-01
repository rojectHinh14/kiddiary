import React, { useEffect, useRef, useState } from "react";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";

export default function MomentCard({
  id,
  username = "Username",
  date = "Posted date",
  caption = "",
  image,
  avatar,
  onEdit = () => {},
  onDelete = () => {},
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const menuRef = useRef(null);
  const btnRef = useRef(null);

  // click ra ngoài / ESC -> đóng
  useEffect(() => {
    const onDown = (e) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    const onClick = (e) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target) && !btnRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("keydown", onDown);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onDown);
      document.removeEventListener("mousedown", onClick);
    };
  }, []);

  return (
    <section className="bg-white rounded-[20px] shadow-[0_6px_28px_rgba(0,0,0,0.06)] p-6 md:p-8">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={
              avatar ||
              "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200"
            }
            alt="avatar"
            className="h-10 w-10 rounded-full object-cover"
          />
        <div className="leading-tight">
            <div className="text-[15px] font-semibold text-gray-900">{username}</div>
            <div className="text-[12px] text-black/50 -mt-0.5">{date}</div>
          </div>
        </div>

        <div className="relative">
          <button
            ref={btnRef}
            type="button"
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
            className="h-9 w-9 inline-flex items-center justify-center rounded-full hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-teal-300/60"
          >
            <MoreHorizontal size={18} />
          </button>

          {/* Popover menu */}
          {menuOpen && (
            <div
              ref={menuRef}
              role="menu"
              className="absolute right-0 mt-2 w-44 origin-top-right rounded-2xl border border-black/10 bg-white/95 backdrop-blur shadow-[0_12px_40px_rgba(0,0,0,0.12)] animate-in fade-in zoom-in-95"
              style={{ zIndex: 40 }}
            >
              <button
                role="menuitem"
                onClick={() => {
                  setMenuOpen(false);
                  onEdit(id);
                }}
                className="w-full flex items-center gap-2 px-3 py-2.5 rounded-t-2xl hover:bg-black/5 text-[14px]"
              >
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-teal-50 text-teal-600">
                  <Pencil size={16} />
                </span>
                Edit post
              </button>

              <div className="my-1 h-px bg-black/5" />

              <button
                role="menuitem"
                onClick={() => {
                  setMenuOpen(false);
                  setConfirmOpen(true);
                }}
                className="w-full flex items-center gap-2 px-3 py-2.5 rounded-b-2xl hover:bg-red-50 text-[14px] text-red-600"
              >
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-red-50">
                  <Trash2 size={16} />
                </span>
                Delete
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Caption */}
      {caption && <p className="text-[15px] text-gray-900 mt-4">{caption}</p>}

      {/* Single image */}
      {image && (
        <figure className="mt-4 overflow-hidden rounded-2xl border border-black/5 bg-gray-50">
          <div className="w-full max-h-[60vh] grid place-items-center">
            <img
              src={image}
              alt="moment"
              loading="lazy"
              className="w-full h-auto max-h-[520px] object-contain"
            />
          </div>
        </figure>
      )}

      {/* Confirm Delete Dialog */}
      {confirmOpen && (
        <ConfirmDialog
          title="Delete this post?"
          desc="This action cannot be undone."
          onCancel={() => setConfirmOpen(false)}
          onConfirm={() => {
            setConfirmOpen(false);
            onDelete(id);
          }}
        />
      )}
    </section>
  );
}

/* ---------- Mini components ---------- */
function ConfirmDialog({ title, desc, onCancel, onConfirm }) {
  useLockBodyScroll(true);

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center"
      role="dialog"
      aria-modal
      onClick={onCancel}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        className="relative w-[min(420px,92vw)] rounded-2xl bg-white p-5 shadow-xl border border-black/10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-lg font-semibold">{title}</div>
        <div className="mt-1 text-sm text-gray-600">{desc}</div>

        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="h-9 px-4 rounded-lg border hover:bg-black/5"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="h-9 px-4 rounded-lg bg-red-600 text-white hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

function useLockBodyScroll(lock) {
  useEffect(() => {
    if (!lock) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = original; };
  }, [lock]);
}

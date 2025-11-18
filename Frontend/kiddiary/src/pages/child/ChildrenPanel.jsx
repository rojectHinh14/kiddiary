// src/features/children/ChildrenPanel.jsx
import { useMemo, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ChildForm from "./ChildForm";
import ChildCard from "./ChildCard";
import ChildViewDialog from "./ChildViewDialog";
import ChatBox from "../../components/ChatBox";
import {
  loadChildren,
  setViewing,
  deleteManyChildren,
} from "../../store/slice/childrenSlice";

export default function ChildrenPanel() {
  const dispatch = useDispatch();
  const { list, viewing, loading } = useSelector((s) => s.children);
  const BASE = import.meta.env.VITE_BACKEND_URL?.replace(/\/+$/, "") || "";

  const [openForm, setOpenForm] = useState(false);
  const [selectMode, setSelectMode] = useState(false);
  const [selected, setSelected] = useState(() => new Set()); // set<string>

  useEffect(() => {
    dispatch(loadChildren());
  }, [dispatch]);

  const abs = (p) => {
    if (!p || typeof p !== "string") return null;
    let url = p.trim().replace(/\\/g, "/").replace(/^\.\/+/, "");
    if (/^https?:\/\//i.test(url)) return url;
    if (url.startsWith("/")) return `${BASE}${url}`;
    return `${BASE}/${url}`;
  };

  const pickImage = (c) =>
    c.image ??
    c.avatar ??
    c.avatarUrl ??
    c.photo ??
    c.photoUrl ??
    c.profileImage ??
    c.picture ??
    c.img ??
    c.imageUrl ??
    c.fileUrl ??
    null;

  const normalize = (arr) =>
    (Array.isArray(arr) ? arr : []).map((c) => {
      const name =
        (c.name && c.name.trim()) ||
        `${c.firstName || ""} ${c.lastName || ""}`.trim() ||
        c.fullName ||
        c.childName ||
        c.nickname ||
        "Unnamed";
      const image = abs(pickImage(c));
      return { id: c.id, name, image, ...c };
    });

  const rows = useMemo(() => normalize(list), [list, BASE]);

  // --- Select helpers (dùng string id)
  const toggleSelect = (id) =>
    setSelected((prev) => {
      const key = String(id);
      const n = new Set(prev);
      n.has(key) ? n.delete(key) : n.add(key);
      return n;
    });

  const selectAll = () =>
    setSelected(new Set(rows.map((r) => String(r.id))));
  const clearSelect = () => setSelected(new Set());

  const handleDelete = async () => {
    if (!selected.size) return;
    if (!confirm(`Delete ${selected.size} selected child(ren)?`)) return;
    try {
      await dispatch(deleteManyChildren([...selected])).unwrap();
      setSelected(new Set());
      setSelectMode(false);
    } catch (e) {
      alert(e);
    }
  };

  const handleExitSelectMode = () => {
    setSelectMode(false);
    setSelected(new Set());
  };

  return (
    <div className="min-h-screen bg-[#FFF9F0] px-4 sm:px-8 py-8 sm:py-10">
      {/* Header */}
      <div className="max-w-6xl mx-auto flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">Children</h1>
          {selectMode && (
            <p className="mt-1 text-sm text-slate-500">
              {selected.size
                ? `${selected.size} child${
                    selected.size > 1 ? "ren" : ""
                  } selected`
                : "Tap on each child to select them for deletion."}
            </p>
          )}
        </div>

        {!selectMode ? (
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectMode(true)}
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 bg-white hover:bg-slate-50"
            >
              Select
            </button>
            <button
              onClick={() => setOpenForm(true)}
              className="rounded-xl bg-teal-600 text-white px-4 py-2 text-sm font-semibold shadow-sm hover:bg-teal-700"
            >
              + Add child
            </button>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            <button
              onClick={selectAll}
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 bg-white hover:bg-slate-50"
            >
              Select all
            </button>
            <button
              onClick={clearSelect}
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 bg-white hover:bg-slate-50"
            >
              Clear
            </button>
            <button
              onClick={handleDelete}
              disabled={!selected.size}
              className={`rounded-xl px-3 py-2 text-sm font-semibold shadow-sm ${
                selected.size
                  ? "bg-red-600 text-white hover:bg-red-700"
                  : "bg-red-200 text-white cursor-not-allowed"
              }`}
            >
              Delete {selected.size ? `(${selected.size})` : ""}
            </button>
            <button
              onClick={handleExitSelectMode}
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 bg-white hover:bg-slate-50"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Grid */}
      <div className="max-w-6xl mx-auto mt-6">
        {loading ? (
          <p className="text-sm text-slate-500">Loading…</p>
        ) : rows.length === 0 ? (
          <div className="h-48 grid place-items-center rounded-2xl border border-dashed border-slate-200 bg-white/60 text-slate-400 text-sm">
            No children yet. Click <span className="mx-1 font-medium">Add child</span> to create one.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 md:gap-8">
            {rows.map((child) => (
              <ChildCard
                key={child.id}
                child={child}
                selectMode={selectMode}
                selected={selected.has(String(child.id))}
                onToggleSelect={() => toggleSelect(child.id)}
                onOpenDetail={() => dispatch(setViewing(child))}
              />
            ))}

            {!selectMode && (
              <button
                type="button"
                onClick={() => setOpenForm(true)}
                className="flex flex-col items-center justify-center rounded-full sm:rounded-2xl border border-dashed border-slate-200 bg-white/70 hover:bg-white transition-colors h-36 w-36 sm:h-40 sm:w-40 mx-auto"
              >
                <span className="text-4xl text-slate-300 leading-none mb-1">
                  +
                </span>
                <span className="text-xs font-medium text-slate-500">
                  Add child
                </span>
              </button>
            )}
          </div>
        )}
      </div>

      {openForm && (
        <ChildForm
          onCancel={() => setOpenForm(false)}
          onSave={() => {
            setOpenForm(false);
            dispatch(loadChildren());
          }}
        />
      )}

      {viewing && <ChildViewDialog />}

      <ChatBox />
    </div>
  );
}

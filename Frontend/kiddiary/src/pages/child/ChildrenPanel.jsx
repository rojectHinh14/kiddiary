// src/features/children/ChildrenPanel.jsx
import { useMemo, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ChildForm from "./ChildForm";
import ChildCard from "./ChildCard";
import ChildViewDialog from "./ChildViewDialog";
import ChatBox from "../../components/ChatBox";
import { loadChildren, setViewing } from "../../store/slice/childrenSlice";
import { deleteManyChildren } from "../../store/slice/childrenSlice";

export default function ChildrenPanel() {
  const dispatch = useDispatch();
  const { list, viewing, loading } = useSelector((s) => s.children);
  const BASE = import.meta.env.VITE_BACKEND_URL?.replace(/\/+$/, "") || "";

  const [openForm, setOpenForm] = useState(false);
  const [selectMode, setSelectMode] = useState(false);
  const [selected, setSelected] = useState(() => new Set()); // set<string>

  useEffect(() => { dispatch(loadChildren()); }, [dispatch]);

  const abs = (p) => {
    if (!p || typeof p !== "string") return null;
    let url = p.trim().replace(/\\/g, "/").replace(/^\.\/+/, "");
    if (/^https?:\/\//i.test(url)) return url;
    if (url.startsWith("/")) return `${BASE}${url}`;
    return `${BASE}/${url}`;
  };
  const pickImage = (c) =>
    c.image ?? c.avatar ?? c.avatarUrl ?? c.photo ?? c.photoUrl ?? c.profileImage ?? c.picture ?? c.img ?? c.imageUrl ?? c.fileUrl ?? null;

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

  const selectAll = () => setSelected(new Set(rows.map((r) => String(r.id))));
  const clearSelect = () => setSelected(new Set());

  const handleDelete = async () => {
    if (!selected.size) return;
    if (!confirm(`Delete ${selected.size} selected child(ren)?`)) return;
    try {
      await dispatch(deleteManyChildren([...selected])).unwrap();
      // dọn UI chọn
      setSelected(new Set());
      setSelectMode(false);
    } catch (e) {
      alert(e);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF9F0] px-8 py-10">
      <div className="max-w-6xl mx-auto mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Children</h1>
        {!selectMode ? (
          <div className="flex gap-2">
            <button onClick={() => setSelectMode(true)} className="rounded-xl border px-3 py-2 hover:bg-black/5">Select</button>
            <button onClick={() => setOpenForm(true)} className="rounded-xl bg-teal-600 text-white px-4 py-2 font-medium hover:bg-teal-700">+ Add child</button>
          </div>
        ) : (
          <div className="flex gap-2">
            <button onClick={selectAll} className="rounded-xl border px-3 py-2 hover:bg-black/5">Select all</button>
            <button onClick={clearSelect} className="rounded-xl border px-3 py-2 hover:bg-black/5">Clear</button>
            <button
              onClick={handleDelete}
              disabled={!selected.size}
              className={`rounded-xl px-3 py-2 font-medium ${selected.size ? "bg-red-600 text-white hover:bg-red-700" : "bg-red-200 text-white cursor-not-allowed"}`}
            >
              Delete {selected.size ? `(${selected.size})` : ""}
            </button>
            <button onClick={() => { setSelectMode(false); setSelected(new Set()); }} className="rounded-xl border px-3 py-2 hover:bg-black/5">Cancel</button>
          </div>
        )}
      </div>

      {/* Grid */}
      <div className="max-w-6xl mx-auto flex justify-start gap-10 flex-wrap">
        {loading && <p className="text-gray-500">Loading…</p>}
        {!loading && rows.map((child) => (
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
          <div onClick={() => setOpenForm(true)} className="cursor-pointer flex flex-col items-center">
            <div className="w-40 h-40 rounded-full bg-gray-50 flex items-center justify-center border">
              <span className="text-4xl text-gray-400">＋</span>
            </div>
            <p className="mt-2 text-sm text-gray-700">Add</p>
          </div>
        )}
      </div>

      {openForm && (
        <ChildForm
          onCancel={() => setOpenForm(false)}
          onSave={() => { setOpenForm(false); dispatch(loadChildren()); }}
        />
      )}

      {viewing && <ChildViewDialog />}
      <ChatBox />
    </div>
  );
}

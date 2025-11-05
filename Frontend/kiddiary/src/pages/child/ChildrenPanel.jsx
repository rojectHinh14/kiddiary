import { useState, useEffect } from "react";
import ChildForm from "./ChildForm";
import { getChildrenService } from "../../services/childService";
import ChildCard from "./ChildCard";
import ChildViewDialog from "./ChildViewDialog";
import ChatBox from "../../components/ChatBox";

export default function ChildrenPanel() {
  const [rows, setRows] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [viewing, setViewing] = useState(null);
  const [selectMode, setSelectMode] = useState(false);
  const [selected, setSelected] = useState(() => new Set());

  const BASE = import.meta.env.VITE_BACKEND_URL?.replace(/\/+$/, "") || "";

  // Chuẩn hoá URL ảnh (fix các case phổ biến)
  const abs = (p) => {
    if (!p || typeof p !== "string") return null;
    let url = p.trim().replace(/\\/g, "/");          // \ -> /
    url = url.replace(/^\.\/+/, "");                 // ./uploads/a.jpg -> uploads/a.jpg
    if (/^https?:\/\//i.test(url)) return url;       // đã full
    if (url.startsWith("/")) return `${BASE}${url}`; // /uploads/a.jpg
    return `${BASE}/${url}`;                         // uploads/a.jpg
  };

  // gom nhiều khả năng key ảnh
  const pickImage = (c) =>
    c.image ?? c.avatar ?? c.avatarUrl ?? c.photo ?? c.photoUrl ?? c.profileImage ?? c.picture ?? c.img ?? c.imageUrl ?? c.fileUrl ?? null;

  // map payload -> view model
  const normalize = (list) =>
    (Array.isArray(list) ? list : []).map((c) => {
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

  const fetchChildren = async () => {
    try {
      const res = await getChildrenService();
      if (res?.data?.errCode === 0) setRows(normalize(res.data.data));
      else console.warn("children err:", res?.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchChildren(); }, []);

  const handleAddChild = (child) => {
    setRows((prev) => [
      ...prev,
      {
        id: child.id,
        name:
          child.name ||
          `${child.firstName || ""} ${child.lastName || ""}`.trim() ||
          child.fullName ||
          "Unnamed",
        image: abs(pickImage(child)),
        ...child,
      },
    ]);
    setOpenForm(false);
  };

  // Select/Delete UI-only
  const toggleSelect = (id) => setSelected((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const selectAll = () => setSelected(new Set(rows.map((r) => r.id)));
  const clearSelect = () => setSelected(new Set());
  const handleDelete = () => {
    if (!selected.size) return;
    if (!confirm(`Remove ${selected.size} selected item(s)? (UI only)`)) return;
    setRows((prev) => prev.filter((r) => !selected.has(r.id)));
    setSelected(new Set());
    setSelectMode(false);
  };

  return (
    <div className="min-h-screen bg-[#FFF9F0] px-8 py-10">
      {/* Toolbar */}
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
            <button onClick={handleDelete} disabled={!selected.size}
              className={`rounded-xl px-3 py-2 font-medium ${selected.size ? "bg-red-600 text-white hover:bg-red-700" : "bg-red-200 text-white cursor-not-allowed"}`}>
              Delete {selected.size ? `(${selected.size})` : ""}
            </button>
            <button onClick={() => { setSelectMode(false); setSelected(new Set()); }} className="rounded-xl border px-3 py-2 hover:bg-black/5">Cancel</button>
          </div>
        )}
      </div>

      {/* Grid */}
      <div className="max-w-6xl mx-auto flex justify-start gap-10 flex-wrap">
        {rows.map((child) => (
          <ChildCard
            key={child.id}
            child={child}
            selectMode={selectMode}
            selected={selected.has(child.id)}
            onToggleSelect={() => toggleSelect(child.id)}
            onOpenDetail={() => setViewing(child)}
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

      {openForm && <ChildForm onCancel={() => setOpenForm(false)} onSave={handleAddChild} />}

      {viewing && <ChildViewDialog child={viewing} onClose={() => setViewing(null)} />}
        <ChatBox/>
    </div>
  );
}

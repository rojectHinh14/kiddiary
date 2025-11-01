// src/pages/home/MomentsPage.jsx
import React, { useCallback, useEffect, useState } from "react";
import { format } from "date-fns";
import { PenSquare } from "lucide-react";
import MomentCard from "../../components/home/MomentCard";
import NewPostDialog from "../../components/home/NewPostDialog";
import ChatBox from "../../components/ChatBox";
import {
  uploadMediaService,
  getAllMediaByUserService,
  // updateMediaService,      // <-- cần có trong services
  // deleteMediaService,      // <-- cần có trong services
} from "../../services/mediaService";
import EditMomentDialog from "../../components/home/EditMomentDialog";

export default function MomentsPage() {
  const [posts, setPosts] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(true);

  // edit
  const [editing, setEditing] = useState(null); // {id, caption, image, date}

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getAllMediaByUserService();
      if (res.data?.errCode === 0) {
        const mapped = res.data.data
          .sort((a,b)=>new Date(b.date)-new Date(a.date))
          .map((m)=>({
            id: String(m.id),
            username: `${m.User?.firstName||""} ${m.User?.lastName||""}`.trim() || "Unknown",
            dateRaw: m.date,
            date: format(new Date(m.date), "dd MMM yyyy"),
            caption: m.description || "",
            image: `${import.meta.env.VITE_BACKEND_URL}${m.fileUrl}`,
            avatar: m.User?.image
              ? (m.User.image.startsWith("http") ? m.User.image : `${import.meta.env.VITE_BACKEND_URL}${m.User.image}`)
              : "https://i.pravatar.cc/120?img=12",
          }));
        setPosts(mapped);
      } else setPosts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(()=>{ fetchPosts(); }, [fetchPosts]);

  const handleCreate = useCallback(async ({ files, caption, date, people }) => {
    if (!files?.length) return;
    const form = new FormData();
    form.append("file", files[0]);
    form.append("description", caption || "");
    form.append("date", format(date || new Date(), "yyyy-MM-dd"));
    if (people) form.append("people", people);
    const res = await uploadMediaService(form);
    if (res.data?.errCode === 0) fetchPosts();
    setOpenDialog(false);
  }, [fetchPosts]);

  // === Edit ===
  const handleEditOpen = useCallback((id) => {
    const p = posts.find(x => x.id === String(id));
    if (!p) return;
    setEditing({
      id: p.id,
      caption: p.caption,
      image: p.image,
      date: new Date(p.dateRaw),
    });
  }, [posts]);

  const handleUpdate = useCallback(async ({ id, caption, file, date }) => {
    // form-data để server nhận cả file hoặc chỉ description
    const form = new FormData();
    form.append("id", id);
    form.append("description", caption || "");
    if (date) form.append("date", format(date, "yyyy-MM-dd"));
    if (file) form.append("file", file); // tùy backend, có thể là "newFile"
    // const res = await updateMediaService(form);
    // if (res.data?.errCode === 0) {
    //   await fetchPosts();
    //   setEditing(null);
    // }
  }, []);

  // === Delete ===
  const handleDelete = useCallback(async (id) => {
    // const res = await deleteMediaService({ id });
    // if (res.data?.errCode === 0) fetchPosts();
  }, []);

  return (
    <div className="max-w-[1040px] mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-[#169c90]">KidDiary</h1>
        <button
          type="button"
          onClick={() => setOpenDialog(true)}
          className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium shadow-[0_2px_0_0_rgba(0,0,0,0.06)] hover:bg-black/5"
        >
          <PenSquare size={16} />
          New post
        </button>
      </div>

      {loading ? (
        <div className="mt-6 space-y-6">
          {[1,2].map(k => (
            <div key={k} className="bg-white rounded-[20px] p-6 md:p-8 shadow-[0_6px_28px_rgba(0,0,0,0.06)]">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gray-200" />
                <div className="h-3 w-40 bg-gray-200 rounded" />
              </div>
              <div className="h-4 w-64 bg-gray-200 rounded mt-4" />
              <div className="h-[320px] bg-gray-100 rounded-2xl mt-4" />
            </div>
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="h-64 grid place-items-center text-gray-500">
          No posts yet. Click <span className="mx-1 font-medium">New post</span> to share your first memory.
        </div>
      ) : (
        <div className="mt-6 space-y-6">
          {posts.map((p) => (
            <MomentCard
              key={p.id}
              {...p}
              onEdit={handleEditOpen}      // <-- TRUYỀN VÀO
              onDelete={handleDelete}      // <-- TRUYỀN VÀO
            />
          ))}
        </div>
      )}

      <NewPostDialog open={openDialog} onClose={()=>setOpenDialog(false)} onSubmit={handleCreate} />

      {/* Dialog edit */}
      {editing && (
        <EditMomentDialog
          initial={editing}
          onClose={() => setEditing(null)}
          onSubmit={handleUpdate}
        />
      )}

      <ChatBox />
    </div>
  );
}

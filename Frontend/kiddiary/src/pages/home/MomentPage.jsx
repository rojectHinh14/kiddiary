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
} from "../../services/mediaService";

export default function MomentsPage() {
  const [posts, setPosts] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getAllMediaByUserService();
      if (res.data?.errCode === 0) {
        const mapped = res.data.data
          .sort((a,b)=>new Date(b.date)-new Date(a.date))
          .map((m)=>({
            id: m.id.toString(),
            username: `${m.User?.firstName||""} ${m.User?.lastName||""}`.trim() || "Unknown",
            date: format(new Date(m.date), "dd MMM yyyy"),
            caption: m.description || "(No caption)",
            images: [`${import.meta.env.VITE_BACKEND_URL}${m.fileUrl}`],
            avatar: m.User?.image
              ? (m.User.image.startsWith("http") ? m.User.image : `${import.meta.env.VITE_BACKEND_URL}${m.User.image}`)
              : "https://i.pravatar.cc/120?img=12",
            people: m.aiTags || "",
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
    form.append("description", caption);
    form.append("date", format(date || new Date(), "yyyy-MM-dd"));
    if (people) form.append("people", people);
    const res = await uploadMediaService(form);
    if (res.data?.errCode === 0) fetchPosts();
    setOpenDialog(false);
  }, [fetchPosts]);

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
        <div className="flex items-center justify-center h-64">Loading posts…</div>
      ) : (
        <div className="mt-6 space-y-6">
          {posts.map(p => <MomentCard key={p.id} {...p} />)}
        </div>
      )}

      <NewPostDialog open={openDialog} onClose={()=>setOpenDialog(false)} onSubmit={handleCreate}/>
      <ChatBox />
    </div>
  );
}

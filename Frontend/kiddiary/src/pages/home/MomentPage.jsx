import React, { useCallback, useEffect, useState } from "react";
import { format } from "date-fns";
import { PenSquare } from "lucide-react";
import MomentCard from "../../components/home/MomentCard";
import NewPostDialog from "../../components/home/NewPostDialog";
import ChatBox from "../../components/ChatBox";
import EditMomentDialog from "../../components/home/EditMomentDialog";
import {
  uploadMediaService,
  getAllMediaByUserService,
  deleteMedia,
  updateMediaService,
} from "../../services/mediaService";

export default function MomentsPage() {
  const [posts, setPosts] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // {id, caption, image, date}

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getAllMediaByUserService();
      if (res.data?.errCode === 0) {
        const mapped = res.data.data
          // ❗ Sort theo ngày ĐĂNG (createdAt) mới nhất
          .slice()
          .sort((a, b) => {
            const aTime = new Date(a.createdAt || a.date).getTime();
            const bTime = new Date(b.createdAt || b.date).getTime();
            return bTime - aTime; // mới nhất lên đầu
          })
          .map((m) => ({
            id: String(m.id),
            username:
              `${m.User?.firstName || ""} ${m.User?.lastName || ""}`.trim() ||
              "Unknown",
            // dateRaw vẫn là ngày moment (field date) để dùng cho edit
            dateRaw: m.date,
            date: format(new Date(m.date), "dd MMM yyyy"),
            caption: m.description || "",
            image: `${import.meta.env.VITE_BACKEND_URL}${m.fileUrl}`,
            avatar: m.User?.image
              ? m.User.image.startsWith("http")
                ? m.User.image
                : `${import.meta.env.VITE_BACKEND_URL}${m.User.image}`
              : "https://i.pravatar.cc/120?img=12",
          }));
        setPosts(mapped);
      } else {
        setPosts([]);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  const handleCreate = useCallback(
    async ({ files, caption, date }) => {
      if (!files?.length) return;

      const fileBase64 = await fileToBase64(files[0]);

      const payload = {
        fileBase64: fileBase64,
        description: caption || "",
        date: format(date || new Date(), "yyyy-MM-dd"),
      };

      const res = await uploadMediaService(payload);

      if (res.data?.errCode === 0) await fetchPosts();
      setOpenDialog(false);
    },
    [fetchPosts]
  );

  // === Edit ===
  const handleEdit = useCallback(
    async ({ id, caption, file, date }) => {
      const payload = {
        id,
        description: caption || "",
        date: format(date || new Date(), "yyyy-MM-dd"),
      };

      if (file) {
        console.log("New file detected, converting to Base64...");
        const fileBase64 = await fileToBase64(file);
        payload.fileBase64 = fileBase64;
      }

      try {
        const res = await updateMediaService(payload);

        if (res.data?.errCode === 0) {
          console.log("Edit successful, fetching new posts...");
          setEditing(null);
          await fetchPosts();
        } else {
          alert(`Edit failed: ${res.data?.message || "Server error"}`);
        }
      } catch (error) {
        console.error("Error during media update:", error);
        alert("An unexpected error occurred during update.");
      }
    },
    [fetchPosts]
  );

  const handleEditOpen = useCallback(
    (id) => {
      const p = posts.find((x) => x.id === String(id));
      if (!p) return;
      setEditing({
        id: p.id,
        caption: p.caption,
        image: p.image,
        date: new Date(p.dateRaw),
      });
    },
    [posts]
  );

  const handleDelete = useCallback(
    async (id) => {
      console.log("[MomentsPage] handleDelete CALLED with id =", id);
      const prev = posts;
      setPosts((list) => list.filter((x) => String(x.id) !== String(id)));
      try {
        const data = await deleteMedia(id);
        console.log("[MomentsPage] delete response =", data);
        if (data?.errCode !== 0)
          throw new Error(data?.message || "Delete failed");
      } catch (e) {
        console.error("[MomentsPage] delete error:", e);
        setPosts(prev); // hoàn tác nếu lỗi
      }
    },
    [posts]
  );

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
          New Moment
        </button>
      </div>

      {loading ? (
        <div className="mt-6 space-y-6">{/* skeleton như cũ */}</div>
      ) : posts.length === 0 ? (
        <div className="h-64 grid place-items-center text-gray-500">
          No posts yet. Click{" "}
          <span className="mx-1 font-medium">New post</span> to share your first
          memory.
        </div>
      ) : (
        <div className="mt-6 space-y-6">
          {posts.map((p) => (
            <MomentCard
              key={p.id}
              {...p}
              onEdit={handleEditOpen}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <NewPostDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onSubmit={handleCreate}
      />

      {editing && (
        <EditMomentDialog
          initial={editing}
          onClose={() => setEditing(null)}
          onSubmit={handleEdit}
        />
      )}

      <ChatBox />
    </div>
  );
}

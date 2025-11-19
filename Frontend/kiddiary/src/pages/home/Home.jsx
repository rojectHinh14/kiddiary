import React, { useState, useEffect, useCallback } from "react";
import MomentCard from "../../components/home/MomentCard";
import HeaderHome from "../../components/home/HeaderHome";
import { PenSquare } from "lucide-react";
import NewPostDialog from "../../components/home/NewPostDialog";
import Profile from "../profile/Profile";
import CalendarPage from "../calendar/CalendarPage";
import {
  uploadMediaService,
  getAllMediaByUserService,
  deleteMedia,
} from "../../services/mediaService";
import { format } from "date-fns";
import AlbumPanel from "../Album/AlbumPanel";
import ChildrenPanel from "../child/ChildrenPanel";
import ChatBox from "../../components/ChatBox";
import BabyOverviewPanel from "../health/BabyOverviewPanel";
import VaccinationSchedulePage from "../health/VaccinationSchedulePage";
import SleepTrackerPage from "../health/SleepTrackerPage";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("moment");
  const [healthView, setHealthView] = useState("overview");

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getAllMediaByUserService();
      if (response.data && response.data.errCode === 0) {
        const sorted = response.data.data.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
        const mapped = sorted.map((m) => {
          const fullName = `${m.User?.firstName || ""} ${m.User?.lastName || ""}`.trim();
          return {
            id: m.id, // giữ kiểu number
            username: fullName || "Unknown User",
            date: format(new Date(m.date), "dd MMM yyyy"),
            caption: m.description || "(No caption)",
            image: `${import.meta.env.VITE_BACKEND_URL}${m.fileUrl}`, // <-- 'image' (khớp MomentCard)
            avatar: m.User?.image
              ? (m.User.image.startsWith("http")
                  ? m.User.image
                  : `${import.meta.env.VITE_BACKEND_URL}${m.User.image}`)
              : "https://i.pravatar.cc/120?img=12",
            people: m.aiTags || "",
          };
        });
        setPosts(mapped);
      } else {
        setPosts([]);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (tab === "moment") fetchPosts();
  }, [tab, fetchPosts]);

  const handleCreate = useCallback(
    async ({ files, caption, date: inputDate, people }) => {
      if (files.length === 0) return;
      try {
        const file = files[0];
        const formData = new FormData();
        formData.append("file", file);
        formData.append("description", caption);
        formData.append("date", format(inputDate || new Date(), "yyyy-MM-dd"));
        if (people) formData.append("people", people);

        const response = await uploadMediaService(formData);
        if (response.data && response.data.errCode === 0) {
          const m = response.data.data;
          if (m) {
            const fullName = `${m.User?.firstName || ""} ${m.User?.lastName || ""}`.trim();
            const newPost = {
              id: m.id,
              username: fullName || "Unknown User",
              date: format(new Date(m.date), "dd MMM yyyy"),
              caption: m.description || "(No caption)",
              image: `${import.meta.env.VITE_BACKEND_URL}${m.fileUrl}`, // <-- 'image'
              avatar: m.User?.image
                ? (m.User.image.startsWith("http")
                    ? m.User.image
                    : `${import.meta.env.VITE_BACKEND_URL}${m.User.image}`)
                : "https://i.pravatar.cc/120?img=12",
              people: m.aiTags || "",
            };
            setPosts((prev) => [newPost, ...prev]);
          } else {
            await fetchPosts();
          }
        } else {
          alert("Upload failed: " + (response.data?.message || "Unknown error"));
        }
      } catch (error) {
        console.error("Error creating post:", error);
        alert("Upload error: " + (error.response?.data?.message || error.message));
      }
    },
    [fetchPosts]
  );

  const handleDelete = useCallback(
     console.log("[Home] handleDelete CALLED with id =", id);
    async (id) => {
      const prevPosts = posts;
      setPosts((list) => list.filter((x) => String(x.id) !== String(id)));

      try {
        const res = await deleteMedia(id);
        const data = res?.data ?? res; 
        console.log("[Home] delete response =", data);

        if (data?.errCode !== 0) throw new Error(data?.message || "Delete failed");
       
      } catch (e) {
        console.error(e);
        // revert
        setPosts(prevPosts);
        // hoặc: await fetchPosts();
      }
    },
    [posts]
  );

  return (
    <div className="min-h-screen bg-[#FFF9F0] flex flex-col overflow-x-hidden">
      <HeaderHome
        onOpenProfile={() => setTab("profile")}
        onLogout={() => {
          localStorage.removeItem("token");
          window.location.href = "/login";
        }}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-56 shrink-0 bg-[#FFF6EA] p-6 overflow-y-auto">
          <nav className="flex flex-col gap-3">
            <button
              onClick={() => setTab("moment")}
              className={`px-4 py-2 text-sm rounded-full ${
                tab === "moment" ? "bg-[#2CC1AE] text-white font-medium" : "hover:bg-black/5"
              }`}
            >
              Moment
            </button>
            <button
              onClick={() => setTab("calendar")}
              className={`px-4 py-2 text-sm rounded-full ${
                tab === "calendar" ? "bg-[#2CC1AE] text-white font-medium" : "hover:bg-black/5"
              }`}
            >
              Calendar
            </button>
            <button
              onClick={() => setTab("album")}
              className={`px-4 py-2 text-sm rounded-full ${
                tab === "album" ? "bg-[#2CC1AE] text-white font-medium" : "hover:bg-black/5"
              }`}
            >
              Album
            </button>
            <button
              onClick={() => setTab("health")}
              className={`px-4 py-2 text-sm rounded-full ${
                tab === "health"
                  ? "bg-[#2CC1AE] text-white font-medium shadow-[0_2px_0_rgba(0,0,0,0.06)]"
                  : "hover:bg-black/5"
              }`}
            >
              Health
            </button>
            <button
              onClick={() => setTab("children")}
              className="px-4 py-2 text-sm rounded-full hover:bg-black/5"
            >
              Children
            </button>
          </nav>
        </aside>

        {/* Main */}
        <main className="flex-1">
          {tab === "moment" && (
            <div className="flex-1 overflow-y-auto p-4">
              {loading ? (
                <div className="flex items-center justify-center h-64">Loading posts...</div>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => setOpenDialog(true)}
                    className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium shadow-[0_2px_0_0_rgba(0,0,0,0.06)] hover:bg-black/5"
                  >
                    <PenSquare size={16} />
                    New post
                  </button>

                  <div className="max-w-[1040px] mx-auto mt-6 space-y-6">
                    {posts.map((p) => (
                      <MomentCard
                        key={p.id}
                        {...p}
                        onDelete={handleDelete}
                        onEdit={(id) => console.log("edit", id)}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {tab === "calendar" && <CalendarPage />}
          {tab === "album" && <AlbumPanel />}
          {tab === "health" && (
            <div className="px-4 md:px-5 lg:px-6 py-4 bg-white">
              <div className="mx-auto w-full max-w-[1120px]">
                {healthView === "overview" && (
                  <BabyOverviewPanel
                    onOpenVaccination={() => setHealthView("vaccination")}
                    onOpenSleep={() => setHealthView("sleep")}
                  />
                )}
                {healthView === "vaccination" && (
                  <VaccinationSchedulePage onBack={() => setHealthView("overview")} />
                )}
                {healthView === "sleep" && <SleepTrackerPage onBack={() => setHealthView("overview")} />}
              </div>
            </div>
          )}
          {tab === "children" && <ChildrenPanel />}
          {tab === "profile" && <Profile />}
        </main>
      </div>

      <NewPostDialog open={openDialog} onClose={() => setOpenDialog(false)} onSubmit={handleCreate} />
      <ChatBox />
    </div>
  );
}

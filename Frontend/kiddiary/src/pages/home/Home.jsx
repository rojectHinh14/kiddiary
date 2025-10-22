import React, { useMemo, useState, useEffect } from "react";
import MomentCard from "../../components/home/MomentCard";
import HeaderHome from "../../components/home/HeaderHome";
import { PenSquare } from "lucide-react";
import NewPostDialog from "../../components/home/NewPostDialog";
import Profile from "../profile/Profile";
import CalendarPage from "../calendar/CalendarPage";
import {
  uploadMediaService,
  getAllMediaByUserService,
} from "../../services/mediaService";
import { format } from "date-fns";
import AlbumPanel from "../Album/AlbumPanel";
import ChildrenPanel from "../child/ChildrenPanel";
import ChatBox from "../../components/ChatBox";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("moment");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await getAllMediaByUserService();
        if (response.data && response.data.errCode === 0) {
          const mappedPosts = response.data.data
            .map((media) => ({
              id: media.id.toString(),
              username: "Username",
              date: format(new Date(media.date), "dd MMM yyyy"),
              caption: media.description || "(No caption)",
              images: [`data:image/jpeg;base64,${media.fileUrl}`],
              avatar: "https://i.pravatar.cc/120?img=12",
              people: "",
            }))
            .reverse();
          setPosts(mappedPosts);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    if (tab === "moment") {
      fetchPosts();
    }
  }, [tab]);

  const handleCreate = async ({ files, caption, date: inputDate, people }) => {
    if (files.length === 0) return;

    try {
      // Convert file đầu tiên thành base64
      const file = files[0];
      const base64 = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
          const base64String = reader.result.split(",")[1];
          resolve(base64String);
        };
      });

      const response = await uploadMediaService({
        fileBase64: base64,
        description: caption,
        date: format(inputDate || new Date(), "yyyy-MM-dd"),
      });

      if (response.data && response.data.errCode === 0) {
        // Refetch để update posts
        const fetchResponse = await getAllMediaByUserService();
        if (fetchResponse.data && fetchResponse.data.errCode === 0) {
          const mappedPosts = fetchResponse.data.data
            .map((media) => ({
              id: media.id.toString(),
              username: "Username",
              date: format(new Date(media.date), "dd MMM yyyy"),
              caption: media.description || "(No caption)",
              images: [`data:image/jpeg;base64,${media.fileUrl}`],
              avatar: "https://i.pravatar.cc/120?img=12",
              people: "",
            }))
            .reverse();
          setPosts(mappedPosts);
        }
        setOpenDialog(false);
      } else {
        alert("Upload failed: " + (response.data?.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Upload error: " + error.message);
    }
  };

  if (loading && tab === "moment") {
    return (
      <div className="min-h-screen bg-[#FFF9F0] flex items-center justify-center">
        Loading posts...
      </div>
    );
  }

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
    <aside className="w-56 shrink-0 bg-[#FFF6EA] p-6 overflow-y-auto">
          <nav className="flex flex-col gap-3">
            <button
              onClick={() => setTab("moment")}
              className={`px-4 py-2 text-sm rounded-full ${
                tab === "moment"
                  ? "bg-[#2CC1AE] text-white font-medium"
                  : "hover:bg-black/5"
              }`}
            >
              Moment
            </button>
            <button
              onClick={() => setTab("calendar")}
              className={`px-4 py-2 text-sm rounded-full ${
                tab === "calendar"
                  ? "bg-[#2CC1AE] text-white font-medium"
                  : "hover:bg-black/5"
              }`}
            >
              Calendar
            </button>
            <button
              onClick={() => setTab("album")}
              className={`px-4 py-2 text-sm rounded-full ${
                tab === "album"
                  ? "bg-[#2CC1AE] text-white font-medium"
                  : "hover:bg-black/5"
              }`}
            >
              Album
            </button>
            <button
              onClick={() => setTab("family")}
              className="px-4 py-2 text-sm rounded-full hover:bg-black/5"
            >
              Family &amp; Friend
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
        <main className="flex-1 px-8 pb-16 pt-8">
          {tab === "moment" && (
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
                  <MomentCard key={p.id} {...p} />
                ))}
              </div>
            </>
          )}

          {tab === "calendar" && <CalendarPage />}

          {tab === "album" && <AlbumPanel/>}

          {tab === "family" && (
            <div className="text-gray-500">👨‍👩‍👧 Family & Friend</div>
          )}

          {tab === "children" && <ChildrenPanel/>}
          {tab === "profile" && <Profile />}
        </main>
      </div>

      <NewPostDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onSubmit={handleCreate}
      />
      <ChatBox/>
    </div>
  );
}

import React, { useMemo, useState } from "react";
import MomentCard from "../../components/home/MomentCard";
import HeaderHome from "../../components/home/HeaderHome";
import { PenSquare } from "lucide-react";
import NewPostDialog from "../../components/home/NewPostDialog";
import Profile from "../profile/Profile";
import CalendarPage from "../calendar/CalendarPage";

export default function Home() {
  // seed sample post
  const sampleImages = useMemo(
    () => [
      "https://images.unsplash.com/photo-1600880292089-90a7e086ee0c",
      "https://images.unsplash.com/photo-1600880292243-6b4f3d3a3f07",
      "https://images.unsplash.com/photo-1600880292050-69a8e0d0db10",
    ],
    []
  );

  const [posts, setPosts] = useState([
    {
      id: "seed-1",
      username: "Username",
      date: "Posted date",
      caption: "Insert Caption Here",
      images: sampleImages,
      avatar: "https://i.pravatar.cc/120?img=12",
    },
  ]);

  const [openDialog, setOpenDialog] = useState(false);

  // 👉 thêm state để biết đang ở tab nào
  const [tab, setTab] = useState("moment");


  const handleCreate = ({ files, caption, date, people }) => {
    const urls = files.slice(0, 3).map((f) => URL.createObjectURL(f));
    const prettyDate = new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    const newPost = {
      id: crypto.randomUUID(),
      username: "Username",
      date: prettyDate,
      caption: caption?.trim() || "(No caption)",
      images: urls,
      avatar: "https://i.pravatar.cc/120?img=12",
      people,
    };

    setPosts((prev) => [newPost, ...prev]);
    setOpenDialog(false);
  };

  return (
    <div className="min-h-screen bg-[#FFF9F0] flex flex-col overflow-x-hidden">
<HeaderHome
  onOpenProfile={() => setTab("profile")}
  onLogout={() => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  }}
/>
      <div className="flex w-full">
        {/* Sidebar */}
        <aside className="w-56 shrink-0 h-[100vh] bg-[#FFF6EA] p-6 space-y-6">
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

          {tab === "calendar" && <CalendarPage/>}

          {tab === "album" && (
            <div className="text-gray-500">🖼 Album view here</div>
          )}

          {tab === "family" && (
            <div className="text-gray-500">👨‍👩‍👧 Family & Friend</div>
          )}

          {tab === "children" && (
            <div className="text-gray-500">👶 Children</div>
          )}
            {tab === "profile" && <Profile />}   

        </main>
      </div>

      <NewPostDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onSubmit={handleCreate}
      />
    </div>
  );
}

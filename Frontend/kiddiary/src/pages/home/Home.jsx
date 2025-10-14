import React from "react";
import MomentCard from "../../components/home/MomentCard";
import HeaderHome from "../../components/home/HeaderHome";

export default function Home() {
  const sampleImages = [
    "https://images.unsplash.com/photo-1600880292089-90a7e086ee0c",
    "https://images.unsplash.com/photo-1600880292243-6b4f3d3a3f07",
    "https://images.unsplash.com/photo-1600880292050-69a8e0d0db10",
  ];

  return (
    // Đặt layout theo cột, chặn overflow-x
    <div className="min-h-screen bg-[#FFF9F0] flex flex-col overflow-x-hidden">
      {/* Header ở trên cùng, full width */}
      <HeaderHome />

      {/* Phần nội dung: sidebar + main đặt ngang */}
      <div className="flex w-full ">
        {/* Sidebar (trái) */}
        <aside className="w-56 bg-[rgb(255,246,234)] p-6 space-y-6 shrink-0 h-[100vh]">
  
          <nav className="flex flex-col gap-4">
            <button className="px-4 py-2 bg-[#2CC1AE] text-white rounded-full">Moment</button>
            <button className="px-4 py-2 rounded-full hover:bg-gray-200">Moment</button>
            <button className="px-4 py-2 rounded-full hover:bg-gray-200">Moment</button>
          </nav>
        </aside>

        {/* Main content (phải) */}
        <main className="flex-1 p-8">
          <div className="max-w-[1040px] mx-auto">
            <MomentCard images={sampleImages} />
          </div>
        </main>
      </div>
    </div>
  );
}

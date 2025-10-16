import React from "react";
import { MoreHorizontal } from "lucide-react";

export default function MomentCard({
  username = "Username",
  date = "Posted date",
  caption = "Insert Caption Here",
  images = [],
  avatar,
}) {
  return (
    <section className="bg-white rounded-[20px] shadow-[0_6px_28px_rgba(0,0,0,0.06)] p-6 md:p-8">
      {/* Row: avatar + name + date + menu */}
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={
              avatar ||
              "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200"
            }
            alt="avatar"
            className="h-10 w-10 rounded-full object-cover"
          />
          <div className="leading-tight">
            <div className="text-[15px] font-semibold text-gray-900">
              {username}
            </div>
            <div className="text-[12px] text-black/50 -mt-0.5">{date}</div>
          </div>
        </div>

        <button
          type="button"
          className="h-9 w-9 inline-flex items-center justify-center rounded-full hover:bg-black/5"
          aria-label="More"
        >
          <MoreHorizontal size={18} />
        </button>
      </header>

      {/* Caption */}
      <p className="text-[15px] text-gray-900 mt-4">{caption}</p>

      {/* Image strip */}
      <div className="mt-5">
        <div className="flex gap-6 overflow-hidden">
          {/* 1st: big square */}
          {images[0] && (
            <div className="rounded-[18px] overflow-hidden w-[264px] h-[264px] shrink-0">
              <img
                src={images[0]}
                className="w-full h-full object-cover"
                alt="photo-1"
                loading="lazy"
              />
            </div>
          )}

          {/* 2nd: big square */}
          {images[1] && (
            <div className="rounded-[18px] overflow-hidden w-[264px] h-[264px] shrink-0">
              <img
                src={images[1]}
                className="w-full h-full object-cover"
                alt="photo-2"
                loading="lazy"
              />
            </div>
          )}

          {/* 3rd: tall portrait */}
          {images[2] && (
            <div className="rounded-[18px] overflow-hidden w-[160px] h-[264px] shrink-0">
              <img
                src={images[2]}
                className="w-full h-full object-cover"
                alt="photo-3"
                loading="lazy"
              />
            </div>
          )}
        </div>

        {/* page indicator bar */}
        <div className="flex justify-center mt-6">
          <div className="h-[6px] w-[120px] bg-black/10 rounded-full">
            <div className="h-[6px] w-[56px] bg-black/20 rounded-full mx-auto translate-y-0.5" />
          </div>
        </div>
      </div>
    </section>
  );
}

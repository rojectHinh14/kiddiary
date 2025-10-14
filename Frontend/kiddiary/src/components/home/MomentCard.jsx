import React from "react";
import { MoreHorizontal } from "lucide-react";
import Header from "../Header";
import HeaderHome from "./HeaderHome";

export default function MomentCard({
  username,
  date,
  caption,
  images = [],
  avatar,
}) {
  return (
    <section className="bg-white rounded-[20px] shadow-[0_6px_28px_rgba(0,0,0,0.06)] p-6 md:p-8">
      {/* Header */}
   

      {/* Caption */}
      <p className="text-[15px] text-gray-900 mt-4">{caption}</p>

      {/* Image strip (3 ảnh vuông, cách đều) */}
      <div className="mt-5">
        <div className="grid grid-cols-3 gap-8">
          {images.map((src, i) => (
            <div key={i} className="w-[260px] h-[260px]">
              <img
                src={src}
                className="w-full h-full rounded-[18px] object-cover"
                alt={`moment-${i}`}
                loading="lazy"
              />
            </div>
          ))}
        </div>

        {/* thanh “progress/indicator” kiểu Figma */}
        <div className="flex justify-center mt-6">
          <div className="h-[6px] w-[56px] bg-gray-200 rounded-full" />
        </div>
      </div>
    </section>
  );
}

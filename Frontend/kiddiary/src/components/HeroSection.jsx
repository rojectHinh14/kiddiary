// MemorySections.jsx
import React from "react";

/**
 * Usage:
 * - Put images under /public/images/ (or điều chỉnh đường dẫn)
 * - Requires TailwindCSS in the project
 */

export default function HeroSection() {
  return (
    <section className="memory-section bg-[#FFF9ED] text-gray-800 py-20">
      {/* custom CSS + Google fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Inter:wght@300;400;600;700&display=swap');

        .memory-section { font-family: 'Inter', sans-serif; }
        .heading-fg {
          font-family: 'Fredoka One', Inter, sans-serif;
          color: #3f3f3f;
          letter-spacing: -0.6px;
          line-height: 1;
          text-shadow: 0 8px 0 rgba(0,0,0,0.06);
        }
        /* subtle rounded shadow for small stacked images */
        .stack-img {
          border-radius: 16px;
          box-shadow: 0 10px 18px rgba(31,31,31,0.06);
        }
        /* small border ring style */
        .ring-4-sel { box-shadow: 0 0 0 6px rgba(255,255,255,0.85) inset; }

        /* make the svg stroke wavy more visible on small screens */
        .wavy-svg { filter: drop-shadow(0 8px 10px rgba(0,0,0,0.08)); }
      `}</style>

      <div className="max-w-6xl mx-auto px-6">
{/* ========== SECTION 1 ========== */}
<div className="w-[95%] mx-auto grid grid-cols-12 gap-12 items-center mb-24">
  {/* images stack (left) */}
  <div className="col-span-12 md:col-span-6 relative h-[420px]">
    {/* top image */}
    <div
      className="absolute"
      style={{
        top: 0,
        left: 0,
        width: 380,
        height: 200,
        border: "6px solid #66BFB3",
        overflow: "hidden",
        borderRadius: 14,
        zIndex: 30,
      }}
    >
      <img
        src="/images/photo1.jpg"
        alt="img1"
        className="w-full h-full object-cover"
      />
    </div>

    {/* middle overlapping image */}
    <div
      className="absolute"
      style={{
        top: 100,
        left: 230,
        width: 380,
        height: 210,
        zIndex: 40,
        borderRadius: 14,
        overflow: "hidden",
        border: "6px solid #F6C85F",
        boxShadow: "0 10px 30px rgba(40,40,40,0.08)",
      }}
    >
      <img
        src="/images/photo2.jpg"
        alt="img2"
        className="w-full h-full object-cover"
      />
    </div>

    {/* bottom-left image */}
    <div
      className="absolute"
      style={{
        top: 250,
        left: 30,
        width: 380,
        height: 200,
        zIndex: 20,
        borderRadius: 16,
        overflow: "hidden",
        border: "6px solid #F9844A",
        boxShadow: "0 10px 28px rgba(30,30,30,0.06)",
      }}
    >
      <img
        src="/images/photo3.jpg"
        alt="img3"
        className="w-full h-full object-cover"
      />
    </div>
  </div>

  {/* text content (right) */}
  <div className="col-span-12 md:col-span-6 pl-8">
    <h2 className="heading-fg text-4xl md:text-5xl font-bold mb-4">
      Smart Memory Search
    </h2>
    <p className="text-gray-600 leading-relaxed mb-6 max-w-2xl">
      With our AI-powered search, you don’t need to scroll endlessly
      through thousands of pictures. Just type a simple description —
      like “birthday at the park” or “first day at school” — and the
      right photo instantly appears. Relive your child’s milestones in
      seconds, without the stress of searching.
    </p>

    <button
      className="inline-flex items-center justify-center rounded-full px-6 py-2.5 font-semibold transition-transform transform hover:-translate-y-0.5"
      style={{
        background: "#5CB7A7",
        color: "white",
        boxShadow: "0 8px 18px rgba(92,183,167,0.18)",
      }}
    >
      Learn more
    </button>
  </div>
</div>


        {/* ========== SECTION 2 ========== */}
        <div className="grid grid-cols-12 gap-8 items-center">
          {/* left text */}
          <div className="col-span-12 md:col-span-6 pr-6">
            <h2 className="heading-fg text-4xl md:text-5xl font-bold mb-4">
              Family-Centric Album
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6 max-w-xl">
              Our platform was built with families in mind. Create albums for
              each child, tag events like birthdays or vacations, and view your
              memories on a clear, beautiful timeline. No more messy folders —
              just a smart, intuitive album that grows with your family’s
              journey.
            </p>

            <button
              className="inline-flex items-center justify-center rounded-full px-6 py-2.5 font-semibold transition-transform transform hover:-translate-y-0.5"
              style={{
                background: "#5CB7A7",
                color: "white",
                boxShadow: "0 8px 18px rgba(92,183,167,0.18)",
              }}
            >
              Learn more
            </button>
          </div>

          {/* right large image with wavy pink stroke */}
          <div className="col-span-12 md:col-span-6 flex justify-center">
            {/* SVG wrapper: viewBox controls aspect ratio */}
            <svg
              viewBox="0 0 600 380"
              className="w-full max-w-[520px] wavy-svg"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                {/* clip so image has rounded corners */}
                <clipPath id="clipRounded">
                  <rect x="0" y="0" width="600" height="380" rx="20" ry="20" />
                </clipPath>

                {/* turbulence + displacement to make stroke wavy */}
                <filter id="wavy" x="-20%" y="-20%" width="140%" height="140%">
                  <feTurbulence
                    baseFrequency="0.02"
                    numOctaves="2"
                    seed="8"
                    stitchTiles="stitch"
                    result="noise"
                  />
                  <feDisplacementMap
                    in="SourceGraphic"
                    in2="noise"
                    scale="6"
                    xChannelSelector="R"
                    yChannelSelector="G"
                  />
                </filter>
              </defs>

              {/* the actual image */}
              <image
                x="0"
                y="0"
                width="600"
                height="380"
                preserveAspectRatio="xMidYMid slice"
                href="/images/photo4.jpg"
                clipPath="url(#clipRounded)"
              />

              {/* wavy stroke (apply filter to path to get wavy look) */}
              <rect
                x="0"
                y="0"
                width="600"
                height="380"
                rx="20"
                ry="20"
                fill="none"
                stroke="#F9844A"
                strokeWidth="12"
                strokeLinejoin="round"
                filter="url(#wavy)"
              />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}

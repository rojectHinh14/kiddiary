import WavyImage from "../utils/WavyImage";

// AlbumSection.jsx
export default function AlbumSection() {
  return (
    <section className="bg-[rgb(255,249,240)] py-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto lg:grid lg:grid-cols-2 lg:items-stretch gap-10 lg:gap-24">
        {/* Content */}
        <div className="order-2 lg:order-1 self-stretch flex flex-col justify-center space-y-6">
          <h2
            className="text-4xl md:text-5xl font-extrabold text-[#2C2C2C] leading-tight"
            style={{ textShadow: "0 4px 4px rgba(0,0,0,0.25)" }}
          >
            Family-Centric Album
          </h2>
          <p className="text-lg text-[#6B6B6B] leading-relaxed">
            Our platform was built with families in mind. Create albums for each child,
            tag events like birthdays or vacations, and view your memories on a clear,
            beautiful timeline. No more messy folders—just a smart, intuitive album that
            grows with your family’s journey.
          </p>
          <a
            href="#"
            className="inline-block bg-[#2CC1AE] hover:brightness-95 text-white px-8 py-3 text-lg rounded-full transition"
          >
            Learn more
          </a>
        </div>

        {/* Image */}
      {/* Image */}
<div className="order-1 lg:order-2 self-stretch">
  <div className="h-full min-h-[380px] flex items-center justify-center">
 <WavyImage
  src="/images/family-album.jpg"
  alt="Family album on tablet"
  width={720}
  height={420}
  radius={28}
  inset={5}         // nhỏ lại (khoảng cách từ ảnh ra viền)
  band={10}         // dải hồng mỏng hơn
  amplitude={8}     // sóng vừa
  wavelength={54}   // sóng thưa
  innerWave={true}
  innerAmplitude={5}
  innerWavelength={50}
/>
  </div>
</div>
      </div>
    </section>
  );
}

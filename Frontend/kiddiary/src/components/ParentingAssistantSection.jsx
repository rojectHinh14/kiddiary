import WavyFrame from "../utils/WavyFrame";

const ytId = "ii-FfE-7C-k"; // từ link https://www.youtube.com/watch?v=ii-FfE-7C-k


export default function ParentingAssistantSection() {
  return (
    <section className="bg-[#FFF7E8] py-16 px-4 md:px-8">
      <div className="max-w-5xl mx-auto text-center space-y-6">
        <h2
          className="text-4xl md:text-5xl font-extrabold text-[#2C2C2C]"
          style={{ textShadow: "0 4px 4px rgba(0,0,0,0.25)" }}
        >
          Parenting Assistant
        </h2>
        <p className="text-[#FF4D7A] font-semibold">
          Your companion, anytime you need it.
        </p>
        <p className="text-[#6B6B6B] leading-relaxed max-w-3xl mx-auto">
          Our built-in AI assistant is more than just a chatbot—it’s a parenting partner.
          Ask for advice on nutrition, track upcoming milestones, or quickly find nearby
          healthcare services. With 24/7 availability, you’ll always have support at your fingertips.
        </p>
        <a
          href="#"
          className="inline-block bg-[#2CC1AE] hover:brightness-95 text-white px-6 py-2.5 rounded-full"
        >
          Try now
        </a>
      </div>

      {/* Video block */}
      <div className="max-w-5xl mx-auto mt-10">
       <WavyFrame
  width={960}
  height={540}
  radius={20}
  inset={4}
  band={8}            // mỏng
  color="#2CC1AE"
  amplitude={6}
  wavelength={50}
  innerWave={true}     // có gợn bên trong
  innerAmplitude={4}
  innerWavelength={46}
  className="mx-auto"
>
  <div className="relative w-full aspect-[16/9]">
    <iframe
      className="absolute inset-0 w-full h-full"
      src="https://www.youtube.com/embed/ii-FfE-7C-k?rel=0&modestbranding=1&playsinline=1"
      title="YouTube video"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowFullScreen
    />
  </div>
</WavyFrame>
      </div>
    </section>
  );
}

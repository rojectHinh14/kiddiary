// FeatureSection.jsx

// Màu viền đúng Figma
const borderColorClasses = {
  green: "border-[#2CC1AE]",   // emerald
  orange: "border-[#F59E0B]",  // orange
  pink: "border-[#EC4899]",    // pink
  none: "border-transparent",
};

const palette = {
  emerald: "#2CC1AE",
  orange: "#F59E0B",
  pink:   "#EC4899",
  heading: "#2C2C2C",
  body:    "#6B6B6B",
};

export default function FeatureSection({ features, backgroundColor = "#2CC1AE" }) {
  // Kích thước ảnh (3 ảnh = nhau, to hơn)
  const IMG_W = 360; // tăng/giảm tùy ý
  const IMG_H = 210;

  return (
    <section className={`${backgroundColor} py-16 px-2 md:px-8`}>
      <div className="max-w-7xl mx-auto space-y-24">
        {features.map((feature, index) => (
          <div
            key={index}
            className={`flex flex-col ${
              feature.imagePosition === "left" ? "lg:flex-row" : "lg:flex-row-reverse"
            } items-center gap-8 lg:gap-18`}
          >
            {/* Image Section */}
            <div className="flex-1 w-full -ml-7 mr-20">
              {feature.images.length === 1 ? (
                <div className={`relative ${feature.hasDecorativeBorder ? "p-4" : ""}`}>
                  {feature.hasDecorativeBorder && (
                    <div className="absolute inset-0 bg-gradient-to-br from-[#FF6FAE] to-[#E84E89] rounded-[2rem] -rotate-1" />
                  )}
                  <div className={`relative ${feature.hasDecorativeBorder ? "bg-white rounded-[2rem] p-2" : ""}`}>
                    <img
                      src={feature.images[0].src}
                      alt={feature.images[0].alt}
                      className={`w-full h-auto rounded-2xl object-cover ${feature.images[0].className || ""}`}
                    />
                  </div>
                </div>
              ) : (
                // Collage 3 ảnh: 1 (trên-trái), 2 (dưới-trái), 3 (bên phải, giữa)
                <div className="relative h-[460px] max-w-[680px] mx-auto lg:mx-0">
                  {feature.images.map((image, imgIndex) => {
                    // vị trí 3 ảnh
                    const pos =
                      imgIndex === 0
                        ? "top-0 left-0 z-20"                                // #1
                        : imgIndex === 1
                        ? "left-3 bottom-0 z-10"                              // #2
                        : "top-[88px] left-[260px] md:left-[300px] z-30";     // #3

                    return (
                      <div
                        key={imgIndex}
                        className={`absolute rounded-3xl overflow-hidden shadow-2xl border-[6px] ${borderColorClasses[image.borderColor]} ${pos} transition-transform duration-300 hover:scale-105 hover:z-50`}
                        style={{ width: IMG_W, height: IMG_H }}
                      >
                        <img
                          src={image.src}
                          alt={image.alt}
                          className="w-full h-full object-cover"
                          draggable={false}
                        />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Content Section */}
            <div className="flex-1 w-full space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold text-[#2C2C2C] leading-tight" style={{ textShadow: "0 4px 4px rgba(0,0,0,0.25)" }}>
                {feature.title}
              </h2>
              <p className="text-lg text-[#6B6B6B] leading-relaxed">
                {feature.description}
              </p>
              {feature.buttonText && (
                <a
                  href={feature.buttonHref || "#"}
                  className="inline-block bg-[#2CC1AE] hover:brightness-95 text-white px-8 py-3 text-lg rounded-full transition"
                >
                  {feature.buttonText}
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
      
    </section>
  );
}

import React, { useState, useEffect } from "react";
import { Star, Award, ChevronLeft, ChevronRight } from "lucide-react";

export default function TestimonialsPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsToShow, setCardsToShow] = useState(3);

  useEffect(() => {
    const updateCardsToShow = () => {
      if (window.innerWidth < 768) {
        setCardsToShow(1);
      } else if (window.innerWidth < 1024) {
        setCardsToShow(2);
      } else {
        setCardsToShow(3);
      }
    };

    updateCardsToShow();
    window.addEventListener("resize", updateCardsToShow);
    return () => window.removeEventListener("resize", updateCardsToShow);
  }, []);

  const testimonials = [
    {
      title: "My favorite app",
      content:
        "I have had Tinybeans for 8 years - my 6 grands are spread across the entire US (and for a time across continents) this app allows us to always be right next door on the daily activities in their lives.",
      footer: "Tinybeans user since 2016",
      color: "blue",
    },
    {
      title: "Love this app! Perfect solution",
      content:
        "It's the perfect way to share photos of my kids with far-away family without putting their faces on social media. We've used it since my kids were born 3.5 years ago and we LOVE it. Easy to use, fun to interact with, and keeps a lovely digital record of my kids' lives.",
      footer: "",
      color: "purple",
    },
    {
      title: "The joy of my life",
      content:
        "Tinybeans has been the joy of my life. I'm 92 and have four great grandchildren. I have followed them from birth and laughed and cried and enjoyed seeing them grow daily. The first thing I do morning and night is check my Tiny Beans. Many thanks for this light in my life! 🙏",
      footer: "Tinybeans user",
      color: "green",
    },
    {
      title: "The calendar is amazing",
      content:
        "We've been using Tinybeans for nearly 5 years now. I love the calendar 🗓️ - it's fun to look back at being able to see exactly what we did Tuesday, etc. And it's fun to share with family members, other parents at school and others.",
      footer: "",
      color: "red",
    },
    {
      title: "Best family app ever",
      content:
        "This app has brought our family closer together. My parents get to see their grandkids growing up even though they live in another country. The private sharing feature gives us peace of mind. Highly recommend!",
      footer: "Tinybeans user since 2018",
      color: "blue",
    },
    {
      title: "Simply wonderful",
      content:
        "I love how easy it is to upload photos and videos. The memories feature is fantastic - it reminds me of precious moments I had forgotten about. This app is a treasure trove of our family memories.",
      footer: "Tinybeans user since 2020",
      color: "purple",
    },
  ];

  const maxIndex = testimonials.length - cardsToShow;

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const renderStars = () => (
    <div className="flex gap-1 mb-3">
      {[...Array(5)].map((_, i) => (
        <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
      ))}
    </div>
  );

  const getShapeColor = (color) => {
    const colors = {
      blue: "bg-blue-400",
      purple: "bg-purple-400",
      green: "bg-green-400",
      red: "bg-red-500",
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="min-h-screen bg-white p-8 overflow-hidden relative">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://tinybeans.com/wp-content/uploads/2024/01/Testimonial-3-1.webp"
          alt="Background"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Title */}
        <h1 className="text-5xl font-bold text-center mb-12 text-gray-900">
          Thousands of happy families
        </h1>

        {/* Stats Cards - Flex Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16 justify-items-center">
          {/* Over 150K Reviews */}
          <div className="w-full bg-white rounded-3xl px-8 py-6 shadow-sm border border-gray-100 text-center">
            <div className="flex justify-center mb-3">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-red-500 text-red-500" />
                ))}
              </div>
            </div>
            <div className="text-red-500 font-bold text-2xl mb-1">
              OVER 150K
            </div>
            <div className="text-gray-900 font-semibold text-sm">
              5 STAR REVIEWS
            </div>
          </div>

          {/* 4.8 Rating */}
          <div className="w-full bg-white rounded-3xl px-8 py-6 shadow-sm border border-gray-100 text-center">
            <div className="text-6xl font-bold text-red-500 mb-2">4.8</div>
            <div className="text-red-500 font-bold text-lg mb-1">OUT OF 5</div>
            <div className="text-gray-900 font-semibold text-sm">
              19.4K APP STORE RATINGS
            </div>
          </div>

          {/* App of the Day */}
          <div className="w-full bg-white rounded-3xl px-8 py-6 shadow-sm border border-gray-100 text-center">
            <div className="flex justify-center mb-3">
              <div className="relative">
                <Award className="w-12 h-12 text-red-500" />
              </div>
            </div>
            <div className="text-red-500 font-bold text-xl mb-1">
              APP OF THE DAY
            </div>
            <div className="text-gray-900 font-semibold text-sm mb-1">
              APP STORE
            </div>
            <div className="text-gray-600 text-sm">50+ TIMES</div>
          </div>
        </div>

        {/* Testimonials Slider */}
        <div className="relative px-12">
          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white rounded-full p-3 shadow-lg hover:bg-gray-50 transition-colors"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6 text-gray-600" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white rounded-full p-3 shadow-lg hover:bg-gray-50 transition-colors"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6 text-gray-600" />
          </button>

          {/* Slider Container */}
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${
                  currentIndex * (100 / cardsToShow)
                }%)`,
              }}
            >
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 px-4"
                  style={{ width: `${100 / cardsToShow}%` }}
                >
                  <div className="relative h-full">
                    {/* Decorative blob */}
                    <div
                      className={`absolute -bottom-8 ${
                        index % 2 === 0 ? "-left-8" : "-right-8"
                      } w-40 h-40 ${getShapeColor(
                        testimonial.color
                      )} rounded-full opacity-60 blur-2xl -z-10`}
                    ></div>

                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 h-full flex flex-col">
                      {renderStars()}
                      <h3 className="text-xl font-bold mb-4 text-gray-900">
                        {testimonial.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed mb-6 flex-grow">
                        {testimonial.content}
                      </p>
                      {testimonial.footer && (
                        <p className="text-gray-400 text-sm italic">
                          {testimonial.footer}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dots Navigation */}
          <div className="flex justify-center gap-2 mt-8">
            {[...Array(maxIndex + 1)].map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  currentIndex === index
                    ? "bg-red-500 w-8"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

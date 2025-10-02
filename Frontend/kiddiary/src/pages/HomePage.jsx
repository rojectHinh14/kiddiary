import ChatBox from "../components/ChatBox";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { BuntingGarland } from "../utils/BuntingGarland";

export default function HomePage() {
  return (
<div className="min-h-screen bg-[#FFF9F0] flex flex-col relative overflow-x-hidden font-montAlt">
      {/* Navbar */}
      <Header simple />

      <div className="mt-20">
        {/* Banner – dải cờ */}
        <div className="relative">
          <BuntingGarland />
        </div>

        {/* Text + Button */}
        <section className="relative z-30 text-center mt-10 px-6">
          <h1 className="text-4xl md:text-5xl font-semibold text-[#4C4C4C] leading-snug max-w-3xl mx-auto">
            Your daily dose of joy <br /> and connection.
          </h1>

          <p className="text-[#6B6B6B] text-base md:text-lg mt-4 max-w-2xl mx-auto">
            Capture and privately share sweet snapshots and videos of your littles
            with our family photo-sharing app that turns moments into memories.
          </p>

          <button className="mt-6 px-6 py-3 rounded-full bg-[#41B3A2] text-white hover:bg-[#379889] transition font-semibold">
            Learn more
          </button>
        </section>

        {/* Baby images */}
        <section className="relative flex justify-center items-end w-full mt-16">
          <div className="flex w-full justify-center items-end gap-4 px-4">
            {/* Baby 1 */}
            <div className="relative w-[26rem] h-[22rem] overflow-hidden z-20">
              <div className="w-[26rem] h-[26rem] rounded-full border-[10px] border-[#4FB3D8] overflow-hidden shadow-2xl mx-auto">
                <img
                  src="../public/homepage/img-1.jpg"
                  alt="Baby 1"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Baby 2 */}
            <div className="relative w-[18rem] h-[15rem] -mx-8 z-30 overflow-hidden">
              <div className="w-[18rem] h-[18rem] rounded-full border-[8px] border-[#F4A261] overflow-hidden shadow-xl mx-auto">
                <img
                  src="../public/homepage/img-2.jpg"
                  alt="Baby 2"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Baby 3 */}
            <div className="relative w-[22rem] h-[18rem] overflow-hidden z-10">
              <div className="w-[22rem] h-[22rem] rounded-full border-[10px] border-[#E76F51] overflow-hidden shadow-lg mx-auto">
                <img
                  src="../public/homepage/img-3.jpg"
                  alt="Baby 3"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Feature buttons */}
        <section className="flex flex-wrap justify-center gap-4 mt-6 px-6">
          {[
            { text: "Share special moment", color: "border-pink-400" },
            { text: "Private, safe & secure", color: "border-blue-400" },
            { text: "Capture baby's firsts", color: "border-green-400" },
            { text: "Keep family in the loop", color: "border-yellow-400" },
            { text: "Print photobooks", color: "border-orange-400" },
            { text: "Revisit precious memories", color: "border-purple-400" },
          ].map((item, i) => (
            <div
              key={i}
              className={`px-6 py-3 bg-white border ${item.color} rounded-xl shadow-sm text-gray-600 font-medium hover:shadow-md cursor-pointer transition`}
            >
              {item.text}
            </div>
          ))}
        </section>
      </div>

      {/* Footer */}
      <Footer className="mt-12 md:mt-16" />
      {/*Chat box */}
      <ChatBox logoSrc="../../public/chatbox/logo.png" title="KidDiary Support" />
    </div>
  );
}

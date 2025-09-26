import { useState } from "react";

export default function ChatBox({
  // ảnh nằm trong thư mục public/chatbox/logo.png
  logoSrc = "/chatbox/logo.png",
  title = "KidDiary Support",
}) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const handleToggle = () => {
    if (isChatOpen) {
      setIsClosing(true);
      setTimeout(() => {
        setIsChatOpen(false);
        setIsClosing(false);
      }, 300);
    } else {
      setIsChatOpen(true);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Nút mở/đóng chat */}
      <button
        onClick={handleToggle}
        aria-label={isChatOpen ? "Đóng hộp chat" : "Mở hộp chat"}
        className="w-16 h-16 rounded-full bg-[#41B3A2] flex items-center justify-center shadow-2xl transition-all duration-300 hover:bg-[#379889] focus:outline-none focus:ring-4 focus:ring-[#41B3A2]/30"
      >
        {!isChatOpen ? (
          <img
            src={logoSrc}
            alt="Logo"
            className="w-10 h-10 rounded-full object-cover"
            draggable={false}
          />
        ) : (
          <span className="text-3xl leading-none font-bold text-white">×</span>
        )}
      </button>

      {/* Chat box */}
      {(isChatOpen || isClosing) && (
        <div
          className={[
            "absolute bottom-20 right-0 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden",
            isClosing ? "animate-fadeOutDown" : "animate-fadeInUp",
          ].join(" ")}
          role="dialog"
          aria-labelledby="chatbox-title"
          aria-modal="false"
        >
          {/* Header */}
          <div className="bg-[#41B3A2] text-white px-4 py-2 flex items-center gap-2">
            <img
              src={logoSrc}
              alt=""
              className="w-5 h-5 rounded-full object-cover"
              aria-hidden="true"
              draggable={false}
            />
            <div id="chatbox-title" className="font-semibold">
              {title}
            </div>
          </div>

          {/* Nội dung chat */}
          <div className="p-4 h-64 overflow-y-auto text-sm text-gray-700 space-y-2">
            <div className="flex items-start gap-2">
              <img
                src={logoSrc}
                alt=""
                className="w-6 h-6 rounded-full object-cover"
                aria-hidden="true"
                draggable={false}
              />
              <div className="bg-gray-100 rounded-xl px-3 py-2">
                <span className="font-semibold">Bot:</span>{" "}
                Xin chào, mình có thể giúp gì cho bạn?
              </div>
            </div>
          </div>

          {/* Ô nhập */}
          <form
            className="flex border-t"
            onSubmit={(e) => {
              e.preventDefault();
              // TODO: xử lý gửi tin nhắn
            }}
          >
            <input
              type="text"
              placeholder="Nhập tin nhắn..."
              className="flex-1 px-3 py-2 text-sm outline-none"
            />
            <button
              type="submit"
              className="px-4 py-2 text-[#41B3A2] font-semibold hover:text-[#379889] focus:outline-none"
            >
              Gửi
            </button>
          </form>
        </div>
      )}

      {/* Keyframes animation */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeOutDown {
          from { opacity: 1; transform: translateY(0); }
          to   { opacity: 0; transform: translateY(20px); }
        }
        .animate-fadeInUp { animation: fadeInUp 0.3s ease-out forwards; }
        .animate-fadeOutDown { animation: fadeOutDown 0.3s ease-in forwards; }
      `}</style>
    </div>
  );
}

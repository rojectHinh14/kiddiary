import { useState } from "react";

export default function ChatBox() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const handleToggle = () => {
    if (isChatOpen) {
      // Nếu đang mở → chạy animation đóng
      setIsClosing(true);
      setTimeout(() => {
        setIsChatOpen(false);
        setIsClosing(false);
      }, 300); // khớp với duration animation
    } else {
      setIsChatOpen(true);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Nút mở/đóng chat */}
      <button
        onClick={handleToggle}
        className="w-16 h-16 rounded-full bg-[#41B3A2] flex items-center justify-center shadow-2xl hover:bg-[#379889] transition-all duration-300"
      >
        {!isChatOpen ? (
          <img
            src="./public/chatbox/chat.png"
            alt="Chat Icon"
            className="w-8 h-8"
          />
        ) : (
          <span className="text-2xl font-bold text-white">×</span>
        )}
      </button>

      {/* Chat box */}
      {(isChatOpen || isClosing) && (
        <div
          className={`
            absolute bottom-20 right-0 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden
            ${isClosing ? "animate-fadeOutDown" : "animate-fadeInUp"}
          `}
        >
          {/* Header */}
          <div className="bg-[#41B3A2] text-white px-4 py-2 font-semibold">
            KidDiary Support
          </div>
          {/* Nội dung chat */}
          <div className="p-4 h-64 overflow-y-auto text-sm text-gray-700">
            <div className="mb-2">
              <span className="font-semibold">Bot:</span> Xin chào, mình có
              thể giúp gì cho bạn?
            </div>
          </div>
          {/* Ô nhập */}
          <div className="flex border-t">
            <input
              type="text"
              placeholder="Nhập tin nhắn..."
              className="flex-1 px-3 py-2 text-sm outline-none"
            />
            <button className="px-4 text-[#41B3A2] font-semibold">
              Gửi
            </button>
          </div>
        </div>
      )}

      {/* Custom keyframes cho animation */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeOutDown {
          from {
            opacity: 1;
            transform: translateY(0);
          }
          to {
            opacity: 0;
            transform: translateY(20px);
          }
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.3s ease-out forwards;
        }
        .animate-fadeOutDown {
          animation: fadeOutDown 0.3s ease-in forwards;
        }
      `}</style>
    </div>
  );
}

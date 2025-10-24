import { useState } from "react";
import axios from "axios";
import { useEffect, useRef } from "react";

export default function ChatBox({
  logoSrc = "/chatbox/logo.png",
  title = "KidDiary Support",
}) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "Xin chào, mình có thể giúp gì cho bạn?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

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

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const newUserMessage = { role: "user", text: input };
    setMessages((prev) => [...prev, newUserMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:8080/api/gemini/chat", {
        prompt: input,
      });

      const botReply =
        res.data.reply || "Xin lỗi, mình không nhận được phản hồi.";
      setMessages((prev) => [...prev, { role: "bot", text: botReply }]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "Lỗi khi kết nối tới server." },
      ]);
    } finally {
      setLoading(false);
    }
  };
  const messagesEndRef = useRef(null);

useEffect(() => {
  // scroll
  messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
}, [messages]);

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
            {messages.map((msg, idx) =>
              msg.role === "bot" ? (
                <div key={idx} className="flex items-start gap-2">
                  <img
                    src={logoSrc}
                    alt=""
                    className="w-6 h-6 rounded-full object-cover"
                    aria-hidden="true"
                    draggable={false}
                  />
                  <div className="bg-gray-100 rounded-xl px-3 py-2">
                    <span className="font-semibold">Bot:</span> {msg.text}
                  </div>
                </div>
              ) : (
                <div
                  key={idx}
                  className="flex items-start justify-end gap-2 text-right"
                >
                  <div className="bg-[#41B3A2]/10 rounded-xl px-3 py-2 max-w-[75%]">
                    <span className="font-semibold text-[#41B3A2]">Bạn:</span>{" "}
                    {msg.text}
                  </div>
                </div>
              )
            )}
            {loading && (
              <div className="text-gray-400 text-sm italic">Đang trả lời...</div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Ô nhập */}
          <form className="flex border-t" onSubmit={handleSend}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
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

      {/* Animation */}
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

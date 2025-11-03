import { useEffect, useRef, useState } from "react";
import axios from "axios";

export default function ChatBox({
  logoSrc = "/chatbox/logo.png",
  title = "KidDiary Support",
}) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false); // <-- NEW
  const [messages, setMessages] = useState([
    { role: "bot", text: "Xin chào, mình có thể giúp gì cho bạn?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const handleToggle = () => {
    if (isChatOpen) {
      setIsClosing(true);
      setTimeout(() => {
        setIsChatOpen(false);
        setIsClosing(false);
        setIsMaximized(false); // đóng chat thì cũng thoát fullscreen
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
      const botReply = res?.data?.reply || "Xin lỗi, mình không nhận được phản hồi.";
      setMessages((prev) => [...prev, { role: "bot", text: botReply }]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [...prev, { role: "bot", text: "Lỗi khi kết nối tới server." }]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isMaximized]);

  // Esc để đóng modal (khi đang phóng to)
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape" && isMaximized) setIsMaximized(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isMaximized]);

  // ============ Khối UI cho phần “cửa sổ chat” (dùng chung mini + modal) ============
  const ChatWindow = ({ compact = false }) => (
    <div className={`flex flex-col ${compact ? "w-80 h-[22rem]" : "w-full h-full"}`}>
      {/* Header */}
      <div className="bg-[#41B3A2] text-white px-4 py-2 flex items-center gap-2">
        <img
          src={logoSrc}
          alt=""
          className="w-5 h-5 rounded-full object-cover"
          aria-hidden="true"
          draggable={false}
        />
        <div id="chatbox-title" className="font-semibold flex-1">
          {title}
        </div>

        {/* Nút phóng to / thu nhỏ */}
        <button
          onClick={() => setIsMaximized((v) => !v)}
          className="p-1 rounded hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/40"
          aria-label={isMaximized ? "Thu nhỏ cửa sổ chat" : "Phóng to cửa sổ chat"}
          title={isMaximized ? "Thu nhỏ" : "Phóng to"}
        >
          {/* icon dùng SVG thuần để không cần lib */}
          {isMaximized ? (
            // icon restore
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M9 3H3v6M15 21h6v-6M21 9V3h-6M3 15v6h6" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          ) : (
            // icon maximize
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M8 3H3v5M16 21h5v-5M21 8V3h-5M3 16v5h5" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          )}
        </button>
      </div>

      {/* Nội dung chat */}
      <div className="p-4 flex-1 overflow-y-auto text-sm text-gray-700 space-y-2 bg-white">
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
            <div key={idx} className="flex items-start justify-end gap-2 text-right">
              <div className="bg-[#41B3A2]/10 rounded-xl px-3 py-2 max-w-[75%]">
                <span className="font-semibold text-[#41B3A2]">Bạn:</span> {msg.text}
              </div>
            </div>
          )
        )}
        {loading && <div className="text-gray-400 text-sm italic">Đang trả lời...</div>}
        <div ref={messagesEndRef} />
      </div>

      {/* Ô nhập */}
      <form className="flex border-t bg-white" onSubmit={handleSend}>
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
  );

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Nút mở/đóng chat */}
      <button
        onClick={handleToggle}
        aria-label={isChatOpen ? "Đóng hộp chat" : "Mở hộp chat"}
        className="w-16 h-16 rounded-full bg-[#41B3A2] flex items-center justify-center shadow-2xl transition-all duration-300 hover:bg-[#379889] focus:outline-none focus:ring-4 focus:ring-[#41B3A2]/30"
      >
        {!isChatOpen ? (
          <img src={logoSrc} alt="Logo" className="w-10 h-10 rounded-full object-cover" draggable={false} />
        ) : (
          <span className="text-3xl leading-none font-bold text-white">×</span>
        )}
      </button>

      {/* Chat mini (dock) */}
      {(isChatOpen || isClosing) && !isMaximized && (
        <div
          className={[
            "absolute bottom-20 right-0 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden",
            isClosing ? "animate-fadeOutDown" : "animate-fadeInUp",
          ].join(" ")}
          role="dialog"
          aria-labelledby="chatbox-title"
          aria-modal="false"
        >
          <ChatWindow compact />
        </div>
      )}

      {/* Modal fullscreen (center) */}
      {isChatOpen && isMaximized && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="chatbox-title"
        >
          {/* overlay */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setIsMaximized(false)}
          />
          {/* khung modal */}
          <div className="relative bg-white w-[min(900px,92vw)] h-[min(70vh,85vh)] rounded-2xl shadow-2xl border border-gray-200 overflow-hidden animate-fadeInUp">
            <ChatWindow />
          </div>
        </div>
      )}

      {/* Animations */}
      <style>{`
        @keyframes fadeInUp { from{opacity:0; transform:translateY(20px)} to{opacity:1; transform:translateY(0)} }
        @keyframes fadeOutDown { from{opacity:1; transform:translateY(0)} to{opacity:0; transform:translateY(20px)} }
        .animate-fadeInUp { animation: fadeInUp .3s ease-out forwards; }
        .animate-fadeOutDown { animation: fadeOutDown .3s ease-in forwards; }
      `}</style>
    </div>
  );
}

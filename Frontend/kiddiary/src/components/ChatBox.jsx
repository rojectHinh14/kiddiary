// ChatBox.jsx
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { ChatWindow } from "./home/ChatWindow";

export default function ChatBox({ logoSrc="/chatbox/logo.png", title="KidDiary Support" }) {
  const [isChatOpen, setIsChatOpen] = useState(false);   // <- mặc định đóng
  const [isClosing, setIsClosing] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [messages, setMessages] = useState([{ role: "bot", text: "Xin chào, mình có thể giúp gì cho bạn?" }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const handleToggle = () => {
    if (isChatOpen) {
      setIsClosing(true);
      setTimeout(() => {
        setIsChatOpen(false);
        setIsClosing(false);
        setIsMaximized(false);
      }, 250); // match animation
    } else {
      setIsChatOpen(true);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    const userMsg = { role: "user", text: input };
    setMessages((p) => [...p, userMsg]);
    setInput("");
    setLoading(true);
    try {
      const { data } = await axios.post("http://localhost:8080/api/gemini/chat", { prompt: userMsg.text });
      setMessages((p) => [...p, { role: "bot", text: data?.reply || "Xin lỗi, mình không nhận được phản hồi." }]);
    } catch {
      setMessages((p) => [...p, { role: "bot", text: "Lỗi khi kết nối tới server." }]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isMaximized]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape" && isMaximized) setIsMaximized(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isMaximized]);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Nút mở/đóng chat (logo tròn) */}
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

      {/* Chat mini (dock) – chỉ hiện khi mở */}
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
          <ChatWindow
            compact
            logoSrc={logoSrc}
            title={title}
            isMaximized={isMaximized}
            setIsMaximized={setIsMaximized}
            messages={messages}
            loading={loading}
            input={input}
            setInput={setInput}
            handleSend={handleSend}
            messagesEndRef={messagesEndRef}
          />
        </div>
      )}

      {/* Modal fullscreen */}
      {isChatOpen && isMaximized && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center" role="dialog" aria-modal="true" aria-labelledby="chatbox-title">
          <div className="absolute inset-0 bg-black/40" onClick={() => setIsMaximized(false)} />
          <div className="relative bg-white w-[min(900px,92vw)] h-[min(70vh,85vh)] rounded-2xl shadow-2xl border border-gray-200 overflow-hidden animate-fadeInUp">
            <ChatWindow
              logoSrc={logoSrc}
              title={title}
              isMaximized={isMaximized}
              setIsMaximized={setIsMaximized}
              messages={messages}
              loading={loading}
              input={input}
              setInput={setInput}
              handleSend={handleSend}
              messagesEndRef={messagesEndRef}
            />
          </div>
        </div>
      )}

      {/* Animations */}
      <style>{`
        @keyframes fadeInUp { from{opacity:0; transform:translateY(20px)} to{opacity:1; transform:translateY(0)} }
        @keyframes fadeOutDown { from{opacity:1; transform:translateY(0)} to{opacity:0; transform:translateY(20px)} }
        .animate-fadeInUp { animation: fadeInUp .25s ease-out forwards; }
        .animate-fadeOutDown { animation: fadeOutDown .25s ease-in forwards; }
      `}</style>
    </div>
  );
}

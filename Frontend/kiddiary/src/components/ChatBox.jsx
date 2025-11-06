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
  const [historyLoaded, setHistoryLoaded] = useState(false);

  // Load lịch sử chat khi mở chatbox lần đầu
  useEffect(() => {
    if (isChatOpen && !historyLoaded) {
      loadChatHistory();
    }
  }, [isChatOpen]);

  const loadChatHistory = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/gemini/history", {
        withCredentials: true,
      });

      if (res.data.success && res.data.history.length > 0) {
        // Convert history to messages format
        const historyMessages = [];
        res.data.history.forEach((log) => {
          historyMessages.push({ role: "user", text: log.question });
          historyMessages.push({ role: "bot", text: log.answer });
        });

        // Prepend history trước greeting message
        setMessages([
          ...historyMessages,
          {
            role: "bot",
            text: "Xin chào, mình có thể giúp gì cho bạn?",
          },
        ]);
      }
      
      setHistoryLoaded(true);
    } catch (err) {
      console.error("Failed to load chat history:", err);
      setHistoryLoaded(true); // Đánh dấu đã thử load
    }
  };

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
      const res = await axios.post(
        "http://localhost:8080/api/gemini/chat",
        { prompt: input },
        {
          withCredentials: true, // ← FIX: Gửi cookie kèm theo
        }
      );

      const botReply =
        res.data.reply || "Xin lỗi, mình không nhận được phản hồi.";
      
      // Nếu có kết quả từ database, hiển thị thêm
      const dbResults = res.data.dbResults;
      const totalResults = res.data.totalResults || 0;

      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: botReply,
          results: dbResults, // Lưu kết quả để render sau
          total: totalResults,
        },
      ]);
    } catch (err) {
      console.error(err);
      const errorMsg =
        err.response?.status === 401
          ? "Bạn cần đăng nhập để sử dụng chatbot."
          : "Lỗi khi kết nối tới server.";
      setMessages((prev) => [...prev, { role: "bot", text: errorMsg }]);
    } finally {
      setLoading(false);
    }
  };

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
                  <div className="bg-gray-100 rounded-xl px-3 py-2 max-w-[90%]">
                    <span className="font-semibold">Bot:</span> {msg.text}
                    
                    {/* Hiển thị kết quả nếu có */}
                    {msg.total > 0 && msg.results && (
                      <div className="mt-2 text-xs text-gray-600">
                        <div className="font-semibold mb-1">
                          Tìm thấy {msg.total} kết quả:
                        </div>
                        {msg.results.data?.slice(0, 5).map((item, i) => (
                          <div key={i} className="mb-1">
                            {item.fileUrl ? (
                              <a
                                href={item.fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#41B3A2] hover:underline"
                              >
                                📷 {item.description || "Ảnh"} ({item.date})
                              </a>
                            ) : (
                              <span>
                                📁 {item.albumName} ({item.Media?.length || 0} ảnh)
                              </span>
                            )}
                          </div>
                        ))}
                        {msg.total > 5 && (
                          <div className="text-gray-400 italic">
                            ... và {msg.total - 5} kết quả khác
                          </div>
                        )}
                      </div>
                    )}
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
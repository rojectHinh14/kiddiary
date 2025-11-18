import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import axios from "axios";

export default function ChatBox({
  logoSrc = "/chatbox/logo.png",
  title = "KidDiary Support",
}) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "Xin chào, mình có thể giúp gì cho bạn?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);

  // Mở / đóng chat
  const handleToggle = () => {
    if (isChatOpen) {
      // khi đóng thì luôn thu nhỏ lại
      setIsExpanded(false);
      setIsClosing(true);
      setTimeout(() => {
        setIsChatOpen(false);
        setIsClosing(false);
      }, 300);
    } else {
      setIsChatOpen(true);
    }
  };

  // Gửi tin nhắn lên API /api/chat
  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const newUserMessage = { role: "user", text: input };
    setMessages((prev) => [...prev, newUserMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:8080/api/chat",
        { prompt: input },
        {
          withCredentials: true,
        }
      );

      const botReply =
        res.data.reply || "Xin lỗi, mình không nhận được phản hồi.";
      const childrenCount = res.data.childrenCount ?? null;

      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: botReply,
          childrenCount,
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

  // Auto scroll xuống cuối khi có message mới
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Khu vực hiển thị nội dung chat (dùng chung cho 2 layout)
  const MessagesArea = () => (
    <div className="p-4 flex-1 overflow-y-auto text-sm text-gray-700 space-y-2">
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
              <span className="font-semibold">Bot:</span>{" "}
              <div className="prose prose-sm whitespace-pre-wrap">
                <ReactMarkdown>
                  {typeof msg.text === "string"
                    ? msg.text
                    : JSON.stringify(msg.text ?? "")}
                </ReactMarkdown>
              </div>
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
  );

  return (
    <>
      {/* Nút mở/đóng + khung nhỏ ở góc phải */}
      <div className="fixed bottom-6 right-6 z-50">
        {/* Nút mở/đóng chat */}
        <button
          onClick={handleToggle}
          aria-label={isChatOpen ? "Đóng hộp chat" : "Mở hộp chat"}
          className="w-16 h-16 rounded-full bg-[#41B3A2] flex items-center justify-center shadow-2xl transition-all duration-300 hover:bg-[#379889] focus:outline-none focus:ring-4 focus:ring-[#41B3A2]/30"
        >
          {!isChatOpen && !isClosing ? (
            <img
              src={logoSrc}
              alt="Logo"
              className="w-10 h-10 rounded-full object-cover"
              draggable={false}
            />
          ) : (
            <span className="text-3xl leading-none font-bold text-white">
              ×
            </span>
          )}
        </button>

        {/* Chat box nhỏ ở góc phải (khi không ở chế độ mở rộng) */}
        {(isChatOpen || isClosing) && !isExpanded && (
          <div
            className={[
              "absolute bottom-20 right-0 w-80 h-[360px] bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col",
              isClosing ? "animate-fadeOutDown" : "animate-fadeInUp",
            ].join(" ")}
            role="dialog"
            aria-labelledby="chatbox-title"
            aria-modal="false"
          >
            {/* Header */}
            <div className="bg-[#41B3A2] text-white px-4 py-2 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
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

              {/* Nút mở rộng */}
              <button
                type="button"
                onClick={() => setIsExpanded(true)}
                className="text-xs bg-white/15 hover:bg-white/25 rounded-full px-2 py-1"
              >
                Mở rộng
              </button>
            </div>

            {/* Nội dung chat */}
            <MessagesArea />

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
      </div>

      {/* Chat box mở rộng giữa màn hình */}
      {isChatOpen && isExpanded && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          {/* overlay mờ */}
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setIsExpanded(false)}
          />

          {/* khung chat to ở giữa */}
          <div className="relative bg-white w-full max-w-xl h-[70vh] mx-4 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
            {/* Header */}
            <div className="bg-[#41B3A2] text-white px-4 py-2 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <img
                  src={logoSrc}
                  alt=""
                  className="w-6 h-6 rounded-full object-cover"
                  aria-hidden="true"
                  draggable={false}
                />
                <div className="font-semibold">{title}</div>
              </div>

              <div className="flex items-center gap-2">
                {/* Thu nhỏ */}
                <button
                  type="button"
                  onClick={() => setIsExpanded(false)}
                  className="text-xs bg-white/15 hover:bg-white/25 rounded-full px-2 py-1"
                >
                  Thu nhỏ
                </button>
                {/* Đóng hẳn */}
                <button
                  type="button"
                  onClick={handleToggle}
                  className="text-lg leading-none font-bold"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Nội dung chat (dùng chung) */}
            <MessagesArea />

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
    </>
  );
}

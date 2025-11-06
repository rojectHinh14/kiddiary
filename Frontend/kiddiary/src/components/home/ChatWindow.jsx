import React from "react";

export const ChatWindow = React.memo(function ChatWindow({
  compact = false,
  logoSrc,
  title,
  isMaximized,
  setIsMaximized,
  messages,
  loading,
  input,
  setInput,
  handleSend,
  messagesEndRef,
}) {
  return (
    <div className={`flex flex-col ${compact ? "w-80 h-[22rem]" : "w-full h-full"}`}>
      {/* Header */}
      <div className="bg-[#41B3A2] text-white px-4 py-2 flex items-center gap-2">
        <img src={logoSrc} alt="" className="w-5 h-5 rounded-full object-cover" />
        <div id="chatbox-title" className="font-semibold flex-1">{title}</div>
        <button
          onClick={() => setIsMaximized((v) => !v)}
          className="p-1 rounded hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/40"
          aria-label={isMaximized ? "Thu nhỏ cửa sổ chat" : "Phóng to cửa sổ chat"}
          title={isMaximized ? "Thu nhỏ" : "Phóng to"}
        >
          {isMaximized ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M9 3H3v6M15 21h6v-6M21 9V3h-6M3 15v6h6" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          ) : (
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
              <img src={logoSrc} alt="" className="w-6 h-6 rounded-full object-cover" />
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
        <button type="submit" className="px-4 py-2 text-[#41B3A2] font-semibold hover:text-[#379889]">
          Gửi
        </button>
      </form>
    </div>
  );
});

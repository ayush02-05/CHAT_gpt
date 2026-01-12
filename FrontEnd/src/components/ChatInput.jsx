import axios from "axios";
import React, { useState } from "react";

export default function ChatInput({
  setMessages,
  activeChatId,
  socket,
  setIsLoading,
}) {
  const [input, setInput] = useState("");

  const handleSend = async () => {
    const contents = input.trim();

    if (!activeChatId) {
      alert("Please selct the chat first");
      return;
    }
    if (!contents || contents === "") {
      alert("Please input first");
      return;
    }

    setMessages((previous) => [
      ...previous,
      {
        role: "user",
        text: contents,
      },
    ]);
    setIsLoading(true);

    socket.emit("ai-message", {
      chat: activeChatId,
      content: contents,
    });

    setInput("");
  };

  return (
    <div className="w-full relative group mt-6">
      {/* Animated Gradient Glow Border */}
      <div className="absolute -inset-[1.5px] bg-gradient-to-r from-purple-500 to-indigo-500 rounded-[2rem] opacity-70 blur-[1px] group-hover:opacity-100 group-hover:blur-[2px] transition-all duration-500"></div>

      {/* Input Body */}
      <div className="relative bg-[#0F0F0F] rounded-[2rem] flex flex-col md:flex-row items-stretch md:items-center p-2 min-h-[80px] shadow-2xl shadow-black/80">
        <div className="flex-1 flex flex-col justify-center px-4 py-2">
          <input
            className="w-full rounded-full bg-black px-5 py-3 text-white
              outline-none border border-white/10
              transition-all duration-300
              focus:border-cyan-400
              opacity-50
              focus:shadow-[0_0_30px_rgba(34,211,238,0.4)]
                selection:bg-indigo-500
    selection:text-white"
            placeholder="Type your message..."
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>

        {/* Submit Button */}
        <button
          className="h-10 w-14 md:h-13 md:w-15 bg-gradient-to-b from-purple-800 to-blue-900 rounded-[1.5rem] flex items-center justify-center transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] ml-auto mt-2 md:mt-0"
          onClick={handleSend}
        >
          <span className="material-symbols-outlined text-white text-[32px]">
            auto_awesome
          </span>
        </button>
      </div>
    </div>
  );
}

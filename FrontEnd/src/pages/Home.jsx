import React, { useState, useEffect, useRef } from "react";
import Sidebar from "../components/Sidebar.jsx";
import Navbar from "../components/Navbar.jsx";
import ChatInput from "../components/ChatInput.jsx";
import ActionChips from "../components/ActionChips.jsx";
import axios from "axios";
import { io } from "socket.io-client";

export default function Home() {
  const [messages, setMessages] = useState([
    { role: "model", text: "Hello! How can I help you today?" },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef(null);
  const [chatList, setchatList] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [socket, setsocket] = useState(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      const { scrollHeight, clientHeight } = chatContainerRef.current;
      if (scrollHeight > clientHeight) {
        chatContainerRef.current.scrollTop = scrollHeight;
      }
    }
  }, [messages]);

  useEffect(() => {
    async function fetchdata() {
      await axios
        .get("http://localhost:5000/chat", { withCredentials: true })
        .then((response) => {
          setchatList(response.data.chat);
        });
    }
    fetchdata();

    const tempdata = io("http://localhost:5000", { withCredentials: true });

    tempdata.on("ai-response", ({ chatId, text }) => {
      if (chatId !== activeChatId) return;
      setIsLoading(false);
      setMessages((prev) => [...prev, { role: "model", text }]);
    });

    setsocket(tempdata);

    return () => {
      tempdata.disconnect(); // ✅ cleanup
    };
  }, []);

  const getMessages = async (chatID) => {
    if (!chatID) return;
    try {
      const response = await axios.get(
        `http://localhost:5000/chat/messages/${chatID}`,
        { withCredentials: true }
      );

      setMessages(
        response.data.messages.map((item) => ({
          role: item.role,
          text: item.content,
        }))
      );
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (activeChatId) {
      getMessages(activeChatId);
    }
  }, [activeChatId]);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-black">
      <Sidebar
        chatList={chatList}
        setchatList={setchatList}
        activeChatId={activeChatId}
        setActiveChatId={setActiveChatId}
        setMessages={setMessages}
      />

      <main className="flex-1 flex flex-col relative px-10">
        {/* Glow */}
        <div className="absolute inset-0 pointer-events-none bg-glow-gradient opacity-30" />
        <Navbar />
        {/* CHAT AREA */}
        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto p-4 space-y-3 relative z-10 bg-black rounded-lg shadow-lg"
        >
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`px-4 py-2 rounded-xl max-w-[75%] text-sm shadow ${
                  msg.role === "user"
                    ? "bg-gradient-to-r from-[#25232D] to-[#15121A]"
                    : "bg-gradient-to-b from-[#252525] to-[#181818]"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="px-4 py-2 rounded-xl bg-gradient-to-b from-[#252525] to-[#181818] text-sm shadow">
                <span className="typing-dots">
                  <span>.</span>
                  <span>.</span>
                  <span>.</span>
                </span>
              </div>
            </div>
          )}

          {/* HERO (only for empty or intro state) */}
          {messages.length <= 1 && (
            <div className="mt-120 lg:mt-80 flex items-center justify-center pointer-events-none z-0">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium text-center text-white/90 tracking-tight mb-0">
                What will we build today?
              </h1>
            </div>
          )}
        </div>
        {/* INPUT */}
        {activeChatId && (
          <div className="py-5 relative z-20">
            <ChatInput
              setMessages={setMessages}
              activeChatId={activeChatId}
              socket={socket}
              setIsLoading={setIsLoading}
            />
          </div>
        )}

        {/* FOOTER */}
        <footer className="relative pb-2 w-full flex sm:inset-0 justify-center gap-6 text-xs text-gray-600 z-20">
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Status</a>
        </footer>
      </main>
    </div>
  );
}

import React, { useState } from "react";
import "./Sidebar.css";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function Sidebar({
  chatList,
  setchatList,
  activeChatId,
  setActiveChatId,
  setMessages,
}) {
  const [showLogout, setShowLogout] = useState(false);
  const navigate = useNavigate();
  const handleNewChat = async () => {
    const title = prompt("Enter Title : ");
    if (title !== "") {
      try {
        const response = await axios.post(
          "https://chat-gpt-a3cn.onrender.com/chat",
          { title },
          { withCredentials: true }
        );
        const newChat = {
          _id: response.data.chat._id,
          title: response.data.chat.title,
        };

        setchatList([newChat, ...chatList]);

        if (response) {
          toast.success("Chat created successfully");
        }
      } catch (error) {
        console.log(error);
      }
    } else console.log("No input Provide ");
  };

  const handlelogout = async () => {
    try {
      await axios.post(
        "https://chat-gpt-a3cn.onrender.com/user/logout",
        {},
        { withCredentials: true }
      );
      setActiveChatId(null);
      setchatList([]);
      setMessages([]);
      toast.success("Logged out successfully");
      navigate("/"); // redirect to login
    } catch (error) {
      console.error(error);
      toast.error("Logout failed");
    }
  };

  return (
    <aside className="sidebar-container hidden md:flex">
      <div className="sidebar-content">
        <button className="new-chat-btn" onClick={handleNewChat}>
          <span className="material-symbols-outlined">add</span>
          <span>New Chat</span>
        </button>

        <div className="history-section">
          {chatList.length === 0 && <p>No chats yet</p>}
          {chatList.map((item) => (
            <button
              key={item._id}
              className={`history-item ${
                activeChatId === item._id ? "active" : ""
              }`}
              onClick={() => {
                setActiveChatId(item._id);
              }}
            >
              <span className="material-symbols-outlined">
                {item.active ? "chat_bubble" : "chat_bubble_outline"}
              </span>
              <span className="title">{item.title}</span>
            </button>
          ))}
        </div>

        <button
          className={`Logout-btn ${showLogout ? "show" : ""}`}
          onClick={handlelogout}
        >
          <span className="material-symbols-outlined">logout</span>
          <span>Log Out</span>
        </button>

        <div className="profile-section">
          <button
            className="profile-btn"
            onClick={() => setShowLogout((prev) => !prev)}
          >
            <div className="avatar"></div>
            <div className="info">
              <span className="name"></span>
              <span className="plan">Pro Member</span>
            </div>
            <span className="material-symbols-outlined settings-icon">
              settings
            </span>
          </button>
        </div>
      </div>
    </aside>
  );
}

import React, { useEffect, useState, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_API_URL, {
  transports: ["websocket"],
  autoConnect: false, // prevent auto connection
});

const ChatWindow = () => {
  const { userId } = useParams();
  const { state } = useLocation();
  const matchedUser = state?.user;

  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);

  const messagesEndRef = useRef(null);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Fetch messages on mount
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/chat/conversation/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setMessages(res.data.messages);
      } catch (error) {
        console.error("Error fetching messages", error);
      }
    };

    fetchMessages();
  }, [userId]);

  // Setup socket connection and listeners
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!socketConnected && token) {
      socket.connect();

      socket.emit("setup", token);

      socket.on("connected", () => {
        setSocketConnected(true);
        console.log("Socket connected");
      });

      socket.on("messageReceived", (newMessage) => {
        setMessages((prevMessages) => {
          // Check if the message is from the current conversation
          if (
            newMessage.sender === userId ||
            newMessage.receiver === userId
          ) {
            return [...prevMessages, newMessage];
          }
          return prevMessages; // If it's not from the current conversation, ignore
        });
      });

      // Join the room for chat
      socket.emit("joinChat", userId);
    }

    // Cleanup on unmount
    return () => {
      socket.off("messageReceived");
      socket.disconnect();
    };
  }, [userId, socketConnected]);

  const handleSend = async () => {
    if (!content.trim()) return;

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/chat/send`,
        {
          receiverId: userId,
          content,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setMessages((prev) => [...prev, res.data.message]);
      socket.emit("newMessage", res.data.message); // Emit to server
      setContent(""); // Clear input field
    } catch (error) {
      console.error("Error sending message", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">
        Chat with {matchedUser?.name || "User"}
      </h1>

      <div className="border rounded p-4 h-96 overflow-y-scroll bg-gray-100 mb-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`mb-2 p-2 rounded ${
              msg.isSender ? "text-right bg-blue-200" : "bg-gray-300"
            }`}
          >
            {msg.content}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex">
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Type your message..."
          className="flex-grow p-2 border rounded-l"
        />
        <button
          onClick={handleSend}
          className="bg-blue-500 text-white px-4 rounded-r"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;

import { useState, useEffect } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";

export default function Chat() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [chatList, setChatList] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [prompt, setPrompt] = useState("");
  const [pdfText, setPdfText] = useState(localStorage.getItem("pdfText") || "");
  const [loading, setLoading] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

  // Fetch user session
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await axios.get(`${API_URL}/auth/session`, { withCredentials: true });
        if (res.data.loggedIn) {
          setUser(res.data.user);
        } else {
          navigate("/");
        }
      } catch (err) {
        console.error(err);
        navigate("/");
      }
    };
    fetchSession();
  }, []);

  // Fetch chats whenever user changes
  useEffect(() => {
    if (!user) return;
    fetchChats();
  }, [user]);

  const fetchChats = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/chat?userId=${user.id}`);
      setChatList(res.data);

      // If a PDF is already loaded, select its chat automatically
      if (pdfText) {
        const existingChat = res.data.find(c => c.pdfText === pdfText);
        if (existingChat) handleSelectChat(existingChat);
      }
    } catch (err) {
      console.error("Error fetching chats:", err);
    }
  };

  // Select a chat and load all previous messages
  const handleSelectChat = (chat) => {
    setActiveChat(chat._id);
    setPdfText(chat.pdfText);
    localStorage.setItem("pdfText", chat.pdfText);

    // Load messages from the selected chat
    if (chat.messages && chat.messages.length > 0) {
      setMessages(chat.messages);
    } else {
      setMessages([]);
    }
  };

  // Send a prompt
  const handleSend = async () => {
    if (!user) return alert("User session not loaded yet");
    if (!prompt.trim() || !pdfText) return alert("Upload a PDF first!");

    const newMessage = { role: "user", content: prompt };
    setMessages(prev => [...prev, newMessage]);
    setPrompt("");
    setLoading(true);

    try {
      const res = await axios.post(`${API_URL}/api/chat`, {
        userId: user.id,
        pdfText,
        prompt,
      });

      const botReply = { role: "bot", content: res.data.response };
      setMessages(prev => [...prev, botReply]);

      // Refresh sidebar chat list to reflect new messages
      fetchChats();
    } catch (err) {
      console.error(err);
      alert("Error getting response");
    } finally {
      setLoading(false);
    }
  };

  // Start a new chat (upload new PDF)
  const handleNewChat = () => {
    localStorage.removeItem("pdfText");
    setPdfText("");
    setMessages([]);
    setActiveChat(null);
    navigate("/");
  };

  // Logout
  const handleLogout = async () => {
    try {
      await axios.post(`${API_URL}/auth/logout`, {}, { withCredentials: true });
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      localStorage.removeItem("pdfText");
      setUser(null);
      navigate("/");
    }
  };

  return (
    <div className="flex flex-col h-screen bg-black text-white">
      {/* Navbar */}
      <div className="flex items-center justify-between px-10 py-5 border-b border-white">
        <h1 className="text-4xl font-semibold">pdf-chatbot</h1>
        <div className="flex items-center gap-5">
          {user && <p className="text-xl">Signed in as {user.name}</p>}
          <button
            onClick={handleLogout}
            className="bg-white text-black px-4 py-2 rounded-lg font-semibold hover:bg-gray-300"
          >
            Home
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 bg-black flex flex-col justify-between p-5 border-r border-white">
          <div>
            <h2 className="text-4xl font-semibold mb-6">Your chats</h2>
            <button
              onClick={handleNewChat}
              className="bg-white text-black w-full py-2 rounded-lg hover:bg-gray-300 transition-all mb-4"
            >
              + New Chat
            </button>

            <div className="flex flex-col gap-2 overflow-y-auto max-h-[70vh]">
              {chatList.map(chat => (
                <div
                  key={chat._id}
                  onClick={() => handleSelectChat(chat)}
                  className={`cursor-pointer p-2 rounded hover:bg-zinc-800 transition ${activeChat === chat._id ? "bg-zinc-700" : "bg-zinc-900"
                    }`}
                >
                  {chat.pdfText.slice(0, 40)}...
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-lg max-w-[80%] ${msg.role === "user"
                  ? "bg-zinc-900 ml-auto text-right"
                  : "bg-zinc-800 mr-auto"
                  }`}
              >
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              </div>
            ))}
            {loading && <div className="text-gray-400 italic">pdf-chatbot is thinking...</div>}
          </div>

          <div className="p-4 border-t border-white flex gap-3">
            <input
              type="text"
              className="flex-1 bg-zinc-900 text-white p-3 rounded-lg outline-none"
              placeholder="Ask something about your PDF..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button
              onClick={handleSend}
              disabled={loading}
              className="bg-zinc-800 px-15 py-2 rounded-lg font-semibold hover:bg-zinc-700 disabled:bg-gray-600"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from "react";
import { X, MessageCircle } from "lucide-react";

const FloatingChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const toggleChat = () => setIsOpen(!isOpen);

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: "Bearer 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",
          "HTTP-Referer": "https://nextlearn.com",
          "X-Title": "NextLearn",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "deepseek/deepseek-r1:free",
          messages: newMessages,
        }),
      });
      const data = await res.json();
      const botResponse = data.choices?.[0]?.message?.content || "No response received.";
      setMessages([...newMessages, { role: "bot", content: botResponse }]);
    } catch (error) {
      setMessages([...newMessages, { role: "bot", content: "Error: " + error.message }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 flex flex-col items-end">
      {!isOpen && (
        <button
          className="p-4 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition"
          onClick={toggleChat}
        >
          <MessageCircle size={24} />
        </button>
      )}
      {isOpen && (
        <div className="w-[30rem] h-[26rem] bg-white shadow-xl rounded-2xl p-4 flex flex-col border border-gray-200 relative">
          <button
            className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
            onClick={toggleChat}
          >
            <X size={20} />
          </button>
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Chat with AI</h3>
          <div className="h-60 p-2 overflow-y-auto border rounded bg-gray-100 text-sm flex flex-col">
            {messages.map((msg, index) => (
              <div key={index} className={`p-1 ${msg.role === "user" ? "text-right text-blue-600" : "text-left text-gray-800"}`}>
                <strong>{msg.role === "user" ? "You: " : "Bot: "}</strong>
                {msg.content}
              </div>
            ))}
            {loading && <div className="text-gray-500">Loading...</div>}
          </div>
          <div className="flex mt-3">
            <input
              type="text"
              className="flex-1 p-2 border rounded-l outline-none"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded-r hover:bg-blue-700"
              onClick={sendMessage}
              disabled={loading}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FloatingChatbot;

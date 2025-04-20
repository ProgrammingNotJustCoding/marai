"use client";

import React, { useState } from "react";
import { FiSend } from "react-icons/fi";

type Message = {
  id: string;
  from: string;
  sender: string;
  content: string;
  timestamp: string;
  read: boolean;
};

type MessagesTabProps = {
  messages: Message[];
  formatTime: (dateString: string) => string;
};

const MessagesTab: React.FC<MessagesTabProps> = ({ messages, formatTime }) => {
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    console.log("Sending message:", newMessage);
    setNewMessage("");
  };

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Case Messages
      </h2>

      <div className="bg-gray-50 dark:bg-neutral-800 rounded-lg p-4 mb-4 h-80 overflow-y-auto">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.from === "client" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[70%] rounded-lg p-3 ${
                  message.from === "client"
                    ? "bg-green-600 text-white"
                    : "bg-white dark:bg-neutral-700 text-gray-800 dark:text-white"
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium text-sm">{message.sender}</span>
                  <span className="text-xs opacity-70">
                    {formatTime(message.timestamp)}
                  </span>
                </div>
                <p className="text-sm">{message.content}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex">
        <input
          type="text"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-grow px-4 py-2 border border-gray-300 dark:border-neutral-700 rounded-l-md bg-white dark:bg-neutral-800 text-gray-900 dark:text-white focus:border-green-500 focus:ring-green-500"
        />
        <button
          onClick={() => handleSendMessage()}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-r-md transition-colors flex items-center"
        >
          <FiSend className="mr-2" />
          Send
        </button>
      </div>
    </div>
  );
};

export default MessagesTab;

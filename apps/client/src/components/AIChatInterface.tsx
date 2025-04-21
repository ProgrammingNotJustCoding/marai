"use client";

import React, { useState, useRef, useEffect } from "react";
import { FiSend, FiUser, FiRefreshCw, FiMessageCircle } from "react-icons/fi";
import { AI_API_URL } from "@/utils/constants";
import ReactMarkdown from "react-markdown";

type Message = {
  role: "user" | "assistant";
  content: string;
  timestamp: number;
};

const AIChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      role: "user",
      content: input.trim(),
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch(`${AI_API_URL}/legal-chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: userMessage.content,
          enable_search: false,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      const assistantMessage: Message = {
        role: "assistant",
        content: data.response || "Sorry, I couldn't process your request.",
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error fetching from AI API:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Sorry, I encountered an error processing your request. Please try again later.",
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const resetChat = () => {
    setMessages([]);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] border rounded-lg bg-white dark:bg-neutral-900 shadow-sm">
      <div className="flex-1 overflow-y-auto p-4 space-y-4 relative">
        {messages.length === 0 ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="p-6 max-w-md text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center">
                <FiMessageCircle className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">
                Welcome to AI Legal Assistant
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Ask me any legal question and I'll do my best to provide helpful
                information. I can explain laws, discuss legal concepts, and
                provide general guidance.
              </p>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                <p className="mb-1">Example questions you can ask:</p>
                <ul className="text-left space-y-1 mb-4">
                  <li>• What are my rights as a tenant?</li>
                  <li>• How does copyright protection work?</li>
                  <li>• What's the process for setting up an LLC?</li>
                  <li>• What are parking laws for residential areas?</li>
                </ul>
              </div>
            </div>
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-3 ${
                  message.role === "user"
                    ? "bg-green-600 text-white"
                    : "bg-gray-100 dark:bg-neutral-800"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  {message.role === "user" ? (
                    <span className="font-medium">You</span>
                  ) : (
                    <span className="font-medium">AI Legal Assistant</span>
                  )}
                  <span className="text-xs opacity-70">
                    {formatTime(message.timestamp)}
                  </span>
                </div>
                {message.role === "user" ? (
                  <div className="whitespace-pre-wrap">{message.content}</div>
                ) : (
                  <div className="markdown-body prose dark:prose-invert prose-sm max-w-none">
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[80%] rounded-lg px-4 py-3 bg-gray-100 dark:bg-neutral-800">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium">AI Legal Assistant</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-pulse"></div>
                <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-pulse delay-75"></div>
                <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-pulse delay-150"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t dark:border-neutral-700 p-4">
        {messages.length > 0 && (
          <div className="flex justify-end mb-2">
            <button
              onClick={resetChat}
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <FiRefreshCw className="text-xs" /> Reset chat
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a legal question..."
            className="flex-1 border dark:border-neutral-700 rounded-lg px-4 py-2 bg-transparent focus:outline-none focus:ring-2 focus:ring-green-500"
            disabled={isLoading}
            autoFocus
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-lg px-4 py-2 flex items-center gap-2 transition-colors"
          >
            <FiSend /> Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default AIChatInterface;

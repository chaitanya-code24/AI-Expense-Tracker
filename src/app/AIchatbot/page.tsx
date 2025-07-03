"use client";
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

type Message = { sender: "user" | "bot"; text: string };

export default function AIChatbot() {
  const [messages, setMessages] = useState<Message[]>([
    { sender: "bot", text: "Hi! Log an expense or ask for a report." }
  ]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage() {
    if (!input.trim()) return;
    setMessages((msgs) => [...msgs, { sender: "user", text: input }]);
    setInput("");
    setTimeout(() => {
      setMessages((msgs) => [
        ...msgs,
        { sender: "bot", text: "This is a demo. Backend not connected." }
      ]);
    }, 500);
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Back Button */}
      <div className="max-w-2xl mx-auto w-full px-2 md:px-0 pt-6 pb-2">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-black text-sm font-medium hover:underline"
        >
          <span className="text-xl">&#8592;</span>
          Back
        </button>
        <h1 className="text-3xl font-bold text-black mt-6 mb-2">AI Chat</h1>
      </div>
      {/* Chat Window */}
      <div className="flex-1 overflow-y-auto px-0 py-8 md:px-0 md:py-12">
        <div className="max-w-2xl mx-auto space-y-4 px-2 md:px-0">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`px-4 py-2 text-base rounded-xl max-w-[75%] ${
                  msg.sender === "user"
                    ? "bg-black text-white rounded-br-none"
                    : "bg-neutral-100 text-neutral-900 border border-neutral-200 rounded-bl-none"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
      </div>

      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage();
        }}
        className="w-full bg-white"
      >
        <div className="max-w-2xl mx-auto flex items-center px-2 md:px-0 py-4">
          <input
            className="flex-1 px-4 py-3 text-base bg-neutral-100 rounded-lg border border-neutral-200 focus:outline-none focus:border-black focus:bg-white text-neutral-900 placeholder-neutral-500 transition-all shadow-sm"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            type="submit"
            className="ml-2 text-base font-medium text-white bg-black px-6 py-3 rounded-lg hover:bg-neutral-800 transition"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}

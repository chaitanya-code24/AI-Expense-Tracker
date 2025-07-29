"use client";
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { useSearchParams } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";

type Message = { sender: "user" | "bot"; text: string };

export default function AIChatbot() {
  const [messages, setMessages] = useState<Message[]>([
    { sender: "bot", text: "Hi! Log an expense or ask about your spending." }
  ]);
  const [input, setInput] = useState("");
  const searchParams = useSearchParams();
  const uid = searchParams.get("uid");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/"); // Redirect if not authenticated
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setMessages((msgs) => [...msgs, { sender: "user", text: userMessage }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(
        `https://backend-expense-tracker-sd03.onrender.com/chat?query=${encodeURIComponent(userMessage)}&uid=${uid}`,
        {
          method: "POST"
        }
      );

      const data = await res.json();
      const response =
        data?.answer || data?.message || "Sorry, I couldn't understand.";

      setMessages((msgs) => [...msgs, { sender: "bot", text: response }]);
    } catch (err) {
      setMessages((msgs) => [
        ...msgs,
        { sender: "bot", text: "⚠️ Failed to connect to backend.", err }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      {/* Back Button */}
      <div className="max-w-2xl mx-auto w-full px-2 md:px-0 pt-6 pb-2">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm font-medium hover:underline"
        >
          <span className="text-xl">&#8592;</span> Back
        </button>
        <h1 className="text-3xl font-bold mt-6 mb-2">💬 AI Chat</h1>
      </div>

      {/* Chat Window */}
      <div className="flex-1 overflow-y-auto px-2 py-6 md:px-0 md:py-8">
        <div className="max-w-2xl mx-auto space-y-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`px-4 py-3 rounded-xl text-sm max-w-[75%] whitespace-pre-line ${
                  msg.sender === "user"
                    ? "bg-black text-white rounded-br-none"
                    : "bg-neutral-100 text-black border border-neutral-300 rounded-bl-none"
                }`}
              >
                <ReactMarkdown>{msg.text}</ReactMarkdown>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="px-4 py-2 text-sm bg-neutral-100 text-black border border-neutral-300 rounded-xl rounded-bl-none animate-pulse">
                Thinking...
              </div>
            </div>
          )}
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
            className="flex-1 px-4 py-3 text-base bg-neutral-100 rounded-lg border border-neutral-200 focus:outline-none focus:border-black focus:bg-white text-black placeholder-neutral-500 transition-all shadow-sm"
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

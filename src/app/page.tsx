"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "./firebase";
import { useUser } from "../app/context/usercontext";

export default function LandingPage() {
  const router = useRouter();
  const { setUid } = useUser();

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      setUid(user.uid);
      router.push("/dashboard");
    } catch (error) {
      console.error("Google login failed", error);
    }
  };

  return (
    <main className="relative min-h-screen bg-gradient-to-br from-zinc-900 via-black to-zinc-800 overflow-hidden text-white font-sans">
      {/* Blobs */}
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-purple-700 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
      <div className="absolute top-1/3 right-10 w-[300px] h-[300px] bg-pink-600 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-pulse delay-1000" />

      {/* Navbar */}
      <header className="relative z-20 flex justify-between items-center px-6 py-4 max-w-6xl mx-auto">
        <h1 className="text-xl font-bold tracking-tight text-white">
          Blinq<span className="text-purple-400">Track</span>AI
        </h1>
        <nav className="flex gap-6 text-sm text-gray-300">
          <a href="#home" className="hover:text-white">Home</a>
          <a href="#features" className="hover:text-white">Features</a>
          <a href="#about" className="hover:text-white">About</a>
        </nav>
        <button
          onClick={handleGoogleLogin}
          className="bg-white text-black px-5 py-2 rounded-full hover:bg-gray-200 transition text-sm shadow"
        >
          Get Started
        </button>
      </header>

      {/* Hero Section */}
      <section id="home" className="relative z-10 flex flex-col items-center px-6 py-32 gap-6 text-center max-w-4xl mx-auto">
        <h2 className="text-5xl md:text-6xl font-bold leading-tight">
          Smarter Spending Starts Here
        </h2>
        <p className="text-lg text-gray-300 max-w-xl">
          AI-powered insights, effortless expense tracking, and a beautiful minimalist interface.
        </p>
        <button
          onClick={handleGoogleLogin}
          className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-full text-white font-medium text-sm mt-4 transition"
        >
          Get Started
        </button>
      </section>

      {/* Features */}
      <section id="features" className="bg-black py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-semibold mb-10">Features</h2>
          <div className="grid md:grid-cols-3 gap-8 text-left">
            {[
              {
                title: "Instant Expense Input",
                desc: "Add expenses with plain text like “Spent 50 on lunch.”",
              },
              {
                title: "AI Categorization",
                desc: "Automatically tags and organizes your spending using LLMs.",
              },
              {
                title: "Insightful Chatbot",
                desc: "Ask your AI assistant for reports or trends in your spending.",
              },
            ].map((item, idx) => (
              <div key={idx} className="bg-zinc-800 p-6 rounded-xl shadow hover:shadow-lg transition">
                <h3 className="font-semibold text-lg mb-2 text-white">{item.title}</h3>
                <p className="text-sm text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="bg-white text-gray-800 py-20 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-3xl font-semibold">Why We Built This</h2>
          <p className="text-gray-600 text-lg">
            Managing your finances shouldn’t feel like filling spreadsheets.
            BlinqTrackAI combines intelligent automation and minimal UI to give you clarity,
            not clutter — so you can focus on what matters.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white text-center py-6 text-sm">
        Built with ❤️ by BlinqTrackAI Team
      </footer>
    </main>
  );
}

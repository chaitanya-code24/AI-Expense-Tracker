"use client";

import React, { useState } from "react";
import Image from "next/image";
import { auth } from "./firebase"; // Adjust path if needed
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [forgot, setForgot] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setMessage("Login successful!");
      router.push("/dashboard"); // Redirect to dashboard
    } catch (err: any) {
      setMessage(err.message);
    }
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Password reset link sent!");
    } catch (err: any) {
      setMessage(err.message);
    }
  };

  const handleGoogleLogin = async () => {
    setMessage("");
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      setMessage("Google login successful!");
      router.push("/dashboard"); // Redirect to dashboard
    } catch (err: any) {
      setMessage(err.message);
    }
  };

  return (
    <main className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-50 via-white to-neutral-200 overflow-hidden">
      {/* 3D Glassmorphism Blobs */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-gradient-to-tr from-indigo-200 via-white to-pink-100 opacity-70 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-br from-pink-200 via-white to-indigo-100 opacity-60 rounded-full blur-2xl animate-pulse delay-2000" />
        <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-gradient-to-br from-neutral-100 via-white to-indigo-100 opacity-40 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2" />
      </div>
      {/* Card */}
      <div className="relative z-10 w-full max-w-sm bg-white/80 rounded-3xl shadow-2xl p-10 flex flex-col gap-8 border border-neutral-100 backdrop-blur-md">
        <div className="flex flex-col items-center gap-2">
          <div className="w-14 h-14 rounded-full bg-neutral-900 flex items-center justify-center shadow-lg mb-2">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <rect width="24" height="24" rx="12" fill="#fff" />
              <path d="M7 17V7h10v10H7z" fill="#111" />
            </svg>
          </div>
          <h1 className="text-2xl font-extrabold text-neutral-900 tracking-tight">
            Welcome Back
          </h1>
          <p className="text-neutral-400 text-sm">Sign in to your account</p>
        </div>
        {message && (
          <div className="text-center text-xs text-red-500">{message}</div>
        )}
        {!forgot ? (
          <form className="flex flex-col gap-4" onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email"
              className="border border-neutral-200 bg-neutral-100/70 rounded-xl px-4 py-2 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 transition"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="border border-neutral-200 bg-neutral-100/70 rounded-xl px-4 py-2 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 transition"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <button
              type="submit"
              className="bg-neutral-900 text-white rounded-xl py-2 font-semibold hover:bg-neutral-800 transition shadow"
            >
              Login
            </button>
            <button
              type="button"
              className="text-neutral-500 text-xs underline mt-1 hover:text-neutral-900 transition"
              onClick={() => setForgot(true)}
            >
              Forgot password?
            </button>
            <div className="flex items-center my-2">
              <div className="flex-1 h-px bg-neutral-200" />
              <span className="mx-2 text-neutral-400 text-xs">or</span>
              <div className="flex-1 h-px bg-neutral-200" />
            </div>
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="flex items-center justify-center gap-2 border border-neutral-200 rounded-xl py-2 bg-white hover:bg-neutral-100 transition shadow"
            >
              <Image
                src="/google.svg"
                alt="Google"
                width={20}
                height={20}
                className="inline"
                priority
              />
              <span className="text-neutral-900 font-medium">Continue with Google</span>
            </button>
            <div className="text-center text-xs text-neutral-500 mt-4">
              Don&apos;t have an account?{" "}
              <a
                href="/Signup"
                className="text-neutral-900 underline hover:text-indigo-600 transition"
              >
                Sign up
              </a>
            </div>
          </form>
        ) : (
          <form className="flex flex-col gap-4" onSubmit={handleForgot}>
            <input
              type="email"
              placeholder="Enter your email"
              className="border border-neutral-200 bg-neutral-100/70 rounded-xl px-4 py-2 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 transition"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <button
              type="submit"
              className="bg-neutral-900 text-white rounded-xl py-2 font-semibold hover:bg-neutral-800 transition shadow"
            >
              Send reset link
            </button>
            <button
              type="button"
              className="text-neutral-500 text-xs underline mt-1 hover:text-neutral-900 transition"
              onClick={() => setForgot(false)}
            >
              Back to login
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
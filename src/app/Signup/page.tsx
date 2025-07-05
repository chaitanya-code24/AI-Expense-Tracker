"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { auth } from "../firebase";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      if (auth.currentUser && name) {
        await updateProfile(auth.currentUser, { displayName: name });
      }
      setMessage("Signup successful! Redirecting...");
      router.push(`/dashboard?name=${encodeURIComponent(name)}`);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setMessage(err.message);
      } else {
        setMessage("An unknown error occurred.");
      }
    }
    setLoading(false);
  };

  const handleGoogleSignup = async () => {
    setMessage("");
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      setMessage("Signup with Google successful! Redirecting...");
      router.push("/dashboard");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setMessage(err.message);
      } else {
        setMessage("An unknown error occurred.");
      }
    }
    setLoading(false);
  };

  return (
    <main className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-50 via-white to-neutral-200 overflow-hidden">
      {/* Blurred background effects */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-gradient-to-tr from-indigo-200 via-white to-pink-100 opacity-70 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-br from-pink-200 via-white to-indigo-100 opacity-60 rounded-full blur-2xl animate-pulse delay-2000" />
        <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-gradient-to-br from-neutral-100 via-white to-indigo-100 opacity-40 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2" />
      </div>

      {/* Sign-up Card */}
      <div className="relative z-10 w-full max-w-sm bg-white/80 rounded-3xl shadow-2xl p-10 flex flex-col gap-8 border border-neutral-100 backdrop-blur-md">
        <div className="flex flex-col items-center gap-2">
          <div className="w-14 h-14 rounded-full bg-neutral-900 flex items-center justify-center shadow-lg mb-2">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <rect width="24" height="24" rx="12" fill="#fff" />
              <path d="M7 17V7h10v10H7z" fill="#111" />
            </svg>
          </div>
          <h1 className="text-2xl font-extrabold text-neutral-900 tracking-tight">
            Create Account
          </h1>
          <p className="text-neutral-400 text-sm">Sign up to get started</p>
        </div>

        {/* Feedback Message */}
        {message && (
          <div
            className={`text-center text-xs mt-2 ${
              message.toLowerCase().includes("success")
                ? "text-green-600"
                : "text-red-500"
            }`}
          >
            {message}
          </div>
        )}

        {/* Form */}
        <form className="flex flex-col gap-4" onSubmit={handleSignup}>
          <input
            type="text"
            placeholder="Full Name"
            className="border border-neutral-200 bg-neutral-100/70 rounded-xl px-4 py-2 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 transition"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            className="border border-neutral-200 bg-neutral-100/70 rounded-xl px-4 py-2 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 transition"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="border border-neutral-200 bg-neutral-100/70 rounded-xl px-4 py-2 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 transition"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-neutral-900 text-white rounded-xl py-2 font-semibold hover:bg-neutral-800 transition shadow disabled:opacity-60"
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>

          <div className="flex items-center my-2">
            <div className="flex-1 h-px bg-neutral-200" />
            <span className="mx-2 text-neutral-400 text-xs">or</span>
            <div className="flex-1 h-px bg-neutral-200" />
          </div>

          <button
            type="button"
            onClick={handleGoogleSignup}
            disabled={loading}
            className="flex items-center justify-center gap-2 border border-neutral-200 rounded-xl py-2 bg-white hover:bg-neutral-100 transition shadow disabled:opacity-60"
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
            Already have an account?{" "}
            <Link
              href="/"
              className="text-neutral-900 underline hover:text-indigo-600 transition"
            >
              Login
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}

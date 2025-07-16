"use client";

import React, { useState, useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";



// Dummy data for chart and expenses

const categories = ["🍴 Food", "🥤 Drinks & Snacks", "🛺 Transport", "🚬 Addiction", "🧼 Groceries / Essentials","🍕 Junk Food / Takeout", "🏠 Stay / Rent","🎭 Entertainment","other"];

// --- Glass Aura Pie Chart Component ---
function GlassAuraPie({
  data,
  size = 240,
}: {
  data: Record<string, number>;
  size?: number;
}) {
  const total = Object.values(data).reduce((a, b) => a + b, 0);
  let cumulative = 0;
  const radius = size / 2 - 18;
  const cx = size / 2;
  const cy = size / 2;

  // Gentle pastel glass colors
  const glassColors = [
    "url(#glass1)",
    "url(#glass2)",
    "url(#glass3)",
    "url(#glass4)",
    "url(#glass5)",
    "url(#glass6)",
  ];

  const slices = Object.entries(data).map(([cat, amt], i) => {
    const value = amt / total;
    const startAngle = cumulative * 360;
    const endAngle = (cumulative + value) * 360;
    cumulative += value;

    // Convert angles to radians
    const startRadians = (startAngle - 90) * (Math.PI / 180);
    const endRadians = (endAngle - 90) * (Math.PI / 180);

    // Calculate coordinates
    const x1 = cx + radius * Math.cos(startRadians);
    const y1 = cy + radius * Math.sin(startRadians);
    const x2 = cx + radius * Math.cos(endRadians);
    const y2 = cy + radius * Math.sin(endRadians);

    // Large arc flag
    const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;

    const pathData = [
      `M ${cx} ${cy}`,
      `L ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
      "Z",
    ].join(" ");

    // For label position
    const midAngle = (startAngle + endAngle) / 2;
    const labelRadius = radius * 0.75;
    const labelX = cx + labelRadius * Math.cos((midAngle - 90) * (Math.PI / 180));
    const labelY = cy + labelRadius * Math.sin((midAngle - 90) * (Math.PI / 180));

    return (
      <g key={cat} className="group">
        <path
          d={pathData}
          fill={glassColors[i % glassColors.length]}
          style={{
            filter:
              "drop-shadow(0 2px 12px rgba(80,100,180,0.10)) drop-shadow(0 1.5px 8px rgba(120,120,120,0.07))",
            transition: "transform 0.2s cubic-bezier(.4,2,.6,1), filter 0.2s",
            cursor: "pointer",
          }}
          className="hover:scale-[1.04] hover:filter-none"
        />
        {value > 0.08 && (
          <text
            x={labelX}
            y={labelY}
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-xs font-semibold pointer-events-none select-none"
            fill="#222"
            style={{
              opacity: 0.8,
              textShadow: "0 1px 6px rgba(255,255,255,0.7)",
              letterSpacing: "0.01em",
            }}
          >
            {Math.round(value * 100)}%
          </text>
        )}
      </g>
    );
  });

  // Center glass circle for donut effect
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="rounded-2xl"
      style={{
        background: "transparent",
        overflow: "visible",
      }}
    >
      <defs>
        <radialGradient id="glass1" cx="50%" cy="50%" r="80%">
          <stop offset="0%" stopColor="#e0e7ff" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#6366f1" stopOpacity="0.18" />
        </radialGradient>
        <radialGradient id="glass2" cx="50%" cy="50%" r="80%">
          <stop offset="0%" stopColor="#fce7f3" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#f472b6" stopOpacity="0.18" />
        </radialGradient>
        <radialGradient id="glass3" cx="50%" cy="50%" r="80%">
          <stop offset="0%" stopColor="#e0f2fe" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.18" />
        </radialGradient>
        <radialGradient id="glass4" cx="50%" cy="50%" r="80%">
          <stop offset="0%" stopColor="#fef9c3" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#f59e42" stopOpacity="0.18" />
        </radialGradient>
        <radialGradient id="glass5" cx="50%" cy="50%" r="80%">
          <stop offset="0%" stopColor="#f0fdf4" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#84cc16" stopOpacity="0.18" />
        </radialGradient>
        <radialGradient id="glass6" cx="50%" cy="50%" r="80%">
          <stop offset="0%" stopColor="#ede9fe" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#a21caf" stopOpacity="0.18" />
        </radialGradient>
      </defs>
      {slices}
      <circle
        cx={cx}
        cy={cy}
        r={radius * 0.55}
        fill="rgba(255,255,255,0.75)"
        style={{
          backdropFilter: "blur(6px)",
          filter: "drop-shadow(0 2px 12px rgba(120,120,180,0.10))",
        }}
      />
      <text
        x={cx}
        y={cy}
        textAnchor="middle"
        dominantBaseline="middle"
        className="text-xl font-bold"
        fill="#6366f1"
        style={{
          opacity: 0.85,
          letterSpacing: "0.01em",
          textShadow: "0 1px 8px rgba(255,255,255,0.7)",
        }}
      >
        ₹{total}
      </text>
    </svg>
  );
}

// Add this helper function above your component
function getLegendGradient(i: number) {
  const gradients = [
    `<radialGradient id='g1' cx='50%' cy='50%' r='80%'><stop offset='0%' stop-color='#e0e7ff' stop-opacity='0.85'/><stop offset='100%' stop-color='#6366f1' stop-opacity='0.18'/></radialGradient>`,
    `<radialGradient id='g2' cx='50%' cy='50%' r='80%'><stop offset='0%' stop-color='#fce7f3' stop-opacity='0.85'/><stop offset='100%' stop-color='#f472b6' stop-opacity='0.18'/></radialGradient>`,
    `<radialGradient id='g3' cx='50%' cy='50%' r='80%'><stop offset='0%' stop-color='#e0f2fe' stop-opacity='0.85'/><stop offset='100%' stop-color='#22d3ee' stop-opacity='0.18'/></radialGradient>`,
    `<radialGradient id='g4' cx='50%' cy='50%' r='80%'><stop offset='0%' stop-color='#fef9c3' stop-opacity='0.85'/><stop offset='100%' stop-color='#f59e42' stop-opacity='0.18'/></radialGradient>`,
    `<radialGradient id='g5' cx='50%' cy='50%' r='80%'><stop offset='0%' stop-color='#f0fdf4' stop-opacity='0.85'/><stop offset='100%' stop-color='#84cc16' stop-opacity='0.18'/></radialGradient>`,
    `<radialGradient id='g6' cx='50%' cy='50%' r='80%'><stop offset='0%' stop-color='#ede9fe' stop-opacity='0.85'/><stop offset='100%' stop-color='#a21caf' stop-opacity='0.18'/></radialGradient>`,
  ];
  const idx = i % gradients.length;
  // SVG circle using the gradient
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32'><defs>${gradients[idx]}</defs><circle cx='16' cy='16' r='16' fill='url(#g${idx + 1})'/></svg>`;
  return `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`;
}

// 1. Remove PieChart component (delete everything from "function PieChart..." to its closing brace)

// 2. Define a type for expenses
type Expense = {
    _id?: string;
    amount: number;
    category: string;
    description: string;
    paymentMethod?: string;
};

export default function Dashboard() {
    const [tab, setTab] = useState("dashboard");
    const [input, setInput] = useState({
        amount: "",
        category: "",
        description: "",
        paymentMethod: "",
    });
    const [darkMode, setDarkMode] = useState(false);
    const [uid, setUid] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [expenseList, setExpenseList] = useState<Expense[]>([]);
    
    const router = useRouter();
    


    // Fetch expenses function
    const fetchExpenses = async (userId: string) => {
        setLoading(true);
        try {
            const res = await fetch(`https://backend-expense-tracker-sd03.onrender.com/expenses?uid=${userId}`);
            
            if (res.ok) {
                const data = await res.json();
                console.log("Expenses response:", data);
                setExpenseList(data.expenses || []);
            }
        } catch {
            // Optionally handle error
        }
        setLoading(false);
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUid(user ? user.uid : null);
            if (user?.uid) {
                fetchExpenses(user.uid);
            } else {
                setExpenseList([]); // Clear on logout
            }
        });
        return () => unsubscribe();
    }, []);

    // When UID changes (e.g., after login), fetch expenses
    useEffect(() => {
        if (uid) fetchExpenses(uid);
    }, [uid]);

    // Get username from query params
    

    // Calculate total and top category
    const total = expenseList.reduce((sum: number, e: Expense) => sum + e.amount, 0);
    const topCategory = expenseList.reduce((acc: Record<string, number>, curr: Expense) => {
        acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
        return acc;
    }, {});

    const mostSpent = (Object.entries(topCategory) as [string, number][]).sort((a, b) => b[1] - a[1])[0]?.[0] || "-";

    // Handle input
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };
    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.amount || !input.category || !input.description || !input.paymentMethod) return;
        if (!uid) {
            alert("User not authenticated.");
            return;
        }
        try {
            const res = await fetch("https://backend-expense-tracker-sd03.onrender.com/add-expense", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    amount: Number(input.amount),
                    category: input.category,
                    description: input.description,
                    paymentMethod: input.paymentMethod,
                    uid: uid,
                     // <-- Add this line
                }),
            });
            if (res.ok) {
                setInput({ amount: "", category: "", description: "", paymentMethod: "" });
                fetchExpenses(uid); // Fetch updated list
            } else {
                alert("Failed to add expense.");
            }
        } catch {
            alert("Error connecting to backend.");
        }
    };

    return (
        
        <>
    {loading && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/30 backdrop-blur-md">
        <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )}
        <main
            className={
                darkMode
                    ? "min-h-screen bg-gradient-to-br from-black via-neutral-900 to-neutral-800 text-white font-sans flex flex-col items-center px-4 md:px-0 pb-24"
                    : "min-h-screen bg-gradient-to-br from-white via-neutral-100 to-neutral-200 text-black font-sans flex flex-col items-center px-4 md:px-0 pb-24"
            }
        >
            {/* Top Bar with Theme Switcher and Logout */}
           <div className="w-full flex justify-between items-center max-w-4xl mx-auto mt-6 mb-2">
    <div className="flex flex-col">
        <span className={darkMode
            ? "font-extrabold text-xl sm:text-2xl md:text-3xl text-white tracking-tight select-none"
            : "font-extrabold text-xl sm:text-2xl md:text-3xl text-black tracking-tight select-none"}>
            BlinqTrackAI
        </span>
        <span className={darkMode
            ? "text-sm text-white/70 font-medium mt-1"
            : "text-sm text-black/70 font-medium mt-1"}>
            Welcome,
        </span>
    </div>

    <div className="flex items-center gap-4">
        <button
            onClick={() => setDarkMode((prev) => !prev)}
            className={`rounded-full px-3 py-1 font-semibold shadow transition border ${
                darkMode
                    ? "bg-neutral-800 text-white border-neutral-700 hover:bg-neutral-700"
                    : "bg-white text-black border-neutral-200 hover:bg-neutral-100"
            }`}
            title="Toggle dark mode"
        >
            {darkMode ? "Dark" : "Light"}
        </button>
        <button
            onClick={async () => {
                await signOut(auth);
                router.push("/");
            }}
            className={darkMode
                ? "bg-white text-black px-4 py-2 rounded-xl font-semibold shadow hover:bg-neutral-200 transition"
                : "bg-neutral-900 text-white px-4 py-2 rounded-xl font-semibold shadow hover:bg-neutral-800 transition"}
        >
            Logout
        </button>
    </div>
</div>

            <div className="w-full max-w-4xl mx-auto mt-6">
                {/* Tabs */}
                <nav className={`flex justify-center gap-6 mb-12 border-b ${darkMode ? "border-neutral-700" : "border-neutral-200"}`}>
                    <button
                        className={`py-2 px-6 border-b-2 transition-all font-medium ${
                            tab === "dashboard"
                                ? darkMode
                                    ? "border-white text-white"
                                    : "border-black text-black"
                                : darkMode
                                    ? "border-transparent text-neutral-400 hover:text-white"
                                    : "border-transparent text-neutral-400 hover:text-black"
                        }`}
                        onClick={() => setTab("dashboard")}
                    >
                        Dashboard
                    </button>
                </nav>

                {tab === "dashboard" && (
                    // Masonry layout using CSS columns
                    <section className="w-full">
                        <div className="columns-1 md:columns-2 gap-8 space-y-8">
                            {/* Total Expense Card */}
                            <div className={`break-inside-avoid rounded-2xl border p-8 mb-8 flex flex-col items-center shadow-lg transition-all duration-200 ${
                                darkMode
                                    ? "border-neutral-800 bg-neutral-900 text-white"
                                    : "border-neutral-200 bg-white text-neutral-900"
                            }`}>
                                <span className={`uppercase text-xs mb-3 tracking-widest ${
                                    darkMode ? "text-neutral-400" : "text-neutral-400"
                                }`}>Total This Month</span>
                                <div className="flex flex-col items-center">
                                    <span className={`text-5xl font-black tracking-tight mb-2 ${
                                        darkMode ? "text-white" : "text-neutral-900"
                                    }`}>
                                        ₹{total}
                                    </span>
                                    <span className={`text-xs font-mono tracking-wide ${
                                        darkMode ? "text-neutral-400" : "text-neutral-400"
                                    }`}>All categories</span>
                                </div>
                            </div>
                            
                            {/* Top Category Card */}
                            <div className={`break-inside-avoid rounded-2xl border p-8 mb-8 flex flex-col items-center shadow-lg transition-all duration-200 ${
                                darkMode
                                    ? "border-neutral-800 bg-neutral-900 text-white"
                                    : "border-neutral-200 bg-white text-neutral-900"
                            }`}>
                                <span className={`uppercase text-xs mb-3 tracking-widest ${
                                    darkMode ? "text-neutral-400" : "text-neutral-400"
                                }`}>Top Category</span>
                                <div className="flex flex-col items-center">
                                    <span className={`text-4xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-400 bg-clip-text text-transparent mb-2`}>
                                        {mostSpent !== "-" ? mostSpent : "—"}
                                    </span>
                                    {mostSpent !== "-" && (
                                        <span className={`inline-block mt-1 px-3 py-1 rounded-lg border text-xs font-semibold shadow-sm tracking-wide ${
                                            darkMode
                                                ? "bg-neutral-800 border-neutral-700 text-neutral-200"
                                                : "bg-neutral-100 border-neutral-200 text-neutral-700"
                                        }`}>
                                            Highest spend this month
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* AI Chat Card */}
                            <div
                                className={`break-inside-avoid rounded-2xl border p-8 mb-8 flex flex-col items-start shadow-lg hover:scale-[1.03] cursor-pointer transition-all duration-200 relative ${
                                    darkMode
                                        ? "border-neutral-800 bg-gradient-to-br from-neutral-900 via-black to-neutral-800"
                                        : "border-neutral-200 bg-black"
                                }`}
                                onClick={() => router.push(`/AIchatbot?uid=${uid}`)}

                                role="button"
                                tabIndex={0}
                                onKeyDown={e => { if (e.key === "Enter") router.push("/AIchatbot"); }}
                            >
                                <div className="w-full flex flex-col items-start">
                                    <span className="text-3xl font-bold mb-1 text-white text-left">AI Chat</span>
                                    <span className={`text-xs text-left mb-6 ${
                                        darkMode ? "text-neutral-300" : "text-white"
                                    }`}>
                                        Ask questions, log expenses, or get smart reports with your AI assistant.
                                    </span>
                                </div>
                                <span
                                    className="absolute bottom-4 right-4 text-white text-2xl"
                                    style={{ transform: "rotate(270deg)" }}
                                >
                                    &#8595;
                                </span>
                            </div>

                            {/* Chart Card */}
                            <div
                                className={`break-inside-avoid rounded-2xl border p-10 mb-8 flex flex-col items-center shadow-2xl ${
                                    darkMode
                                        ? "border-neutral-800 bg-neutral-900/80 backdrop-blur-lg"
                                        : "border-transparent bg-white/60 backdrop-blur-lg"
                                }`}
                                style={{
                                    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.10)",
                                    border: darkMode ? undefined : "1.5px solid rgba(255,255,255,0.18)",
                                }}
                            >
                                <span className={`uppercase text-xs mb-4 tracking-widest block text-center letter-spacing-wide ${
                                    darkMode ? "text-neutral-400" : "text-neutral-500"
                                }`}>
                                    Expense Chart
                                </span>
                                {Object.keys(topCategory).length === 0 ? (
                                    <div className={darkMode ? "text-neutral-500" : "text-neutral-400"}>No data to display.</div>
                                ) : (
                                    <div className="w-full flex flex-col items-center">
                                        <GlassAuraPie data={topCategory} size={240} />
                                        <div className="flex flex-wrap justify-center gap-4 mt-8">
                                            {(Object.entries(topCategory) as [string, number][]).map(([cat, amt], i) => (
                                                <div
                                                    key={cat}
                                                    className={`flex items-center gap-2 px-3 py-1 rounded-lg shadow-sm transition-all ${
                                                        darkMode
                                                            ? "bg-neutral-800/70 backdrop-blur-sm hover:bg-neutral-700"
                                                            : "bg-white/40 backdrop-blur-sm hover:bg-white/70"
                                                    }`}
                                                    style={{
                                                        transition: "background 0.2s cubic-bezier(.4,2,.6,1)",
                                                    }}
                                                >
                                                    <span
                                                        className="inline-block w-4 h-4 rounded-full"
                                                        style={{
                                                            backgroundImage: getLegendGradient(i),
                                                            backgroundSize: "cover",
                                                            border: "1.5px solid rgba(180,180,200,0.10)",
                                                        }}
                                                    ></span>
                                                    <span className={`text-sm font-medium ${
                                                        darkMode ? "text-neutral-200" : "text-neutral-700"
                                                    }`}>{cat} (₹{amt})</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                            {/* Expense Input Card */}
                            <div className={`break-inside-avoid rounded-2xl border p-8 mb-8 flex flex-col shadow-lg hover:scale-[1.02] transition-all duration-200 ${
                                darkMode
                                    ? "border-neutral-800 bg-neutral-900/80"
                                    : "border-neutral-200 bg-white/80"
                            }`}>
                                <span className={`uppercase text-xs mb-2 tracking-widest ${
                                    darkMode ? "text-neutral-400" : "text-neutral-400"
                                }`}>Add Expense</span>
                                <form className="flex flex-col gap-4 mt-2" onSubmit={handleAdd}>
                                    <input
                                        type="number"
                                        name="amount"
                                        placeholder="Amount"
                                        value={input.amount}
                                        onChange={handleChange}
                                        className={`border rounded-xl px-4 py-2 font-mono focus:outline-none transition placeholder-neutral-400 ${
                                            darkMode
                                                ? "border-neutral-700 bg-neutral-800 text-white focus:border-white"
                                                : "border-neutral-200 bg-neutral-50 text-black focus:border-black"
                                        }`}
                                        min={1}
                                    />
                                    <select
                                        name="category"
                                        value={input.category}
                                        onChange={handleChange}
                                        className={`border rounded-xl px-4 py-2 focus:outline-none transition ${
                                            darkMode
                                                ? "border-neutral-700 bg-neutral-800 text-white focus:border-white"
                                                : "border-neutral-200 bg-neutral-50 text-neutral-700 focus:border-black"
                                        }`}
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map((cat) => (
                                            <option key={cat} value={cat}>
                                                {cat}
                                            </option>
                                        ))}
                                    </select>
                                    <input
                                        type="text"
                                        name="description"
                                        placeholder="Description"
                                        value={input.description}
                                        onChange={handleChange}
                                        className={`border rounded-xl px-4 py-2 focus:outline-none transition placeholder-neutral-400 ${
                                            darkMode
                                                ? "border-neutral-700 bg-neutral-800 text-white focus:border-white"
                                                : "border-neutral-200 bg-neutral-50 text-black focus:border-black"
                                        }`}
                                    />
                                    {/* Payment Method Option */}
                                    <select
                                        name="paymentMethod"
                                        value={input.paymentMethod || ""}
                                        onChange={handleChange}
                                        className={`border rounded-xl px-4 py-2 focus:outline-none transition ${
                                            darkMode
                                                ? "border-neutral-700 bg-neutral-800 text-white focus:border-white"
                                                : "border-neutral-200 bg-neutral-50 text-neutral-700 focus:border-black"
                                        }`}
                                    >
                                        <option value="">Select Payment Method</option>
                                        <option value="Card">Card</option>
                                        <option value="UPI">UPI</option>
                                        <option value="Cash">Cash</option>
                                    </select>
                                    <button
                                        type="submit"
                                        className={`rounded-xl py-2 mt-2 font-semibold tracking-wide shadow transition ${
                                            darkMode
                                                ? "bg-white text-black hover:bg-neutral-200"
                                                : "bg-black text-white hover:bg-neutral-800"
                                        }`}
                                    >
                                        + Add Expense
                                    </button>
                                </form>
                            </div>
                            {/* Recent Expenses Card */}
                            <div className={`break-inside-avoid rounded-2xl border p-8 mb-8 flex flex-col shadow-lg hover:scale-[1.01] transition-all duration-200 ${
                                darkMode
                                    ? "border-neutral-800 bg-neutral-900/80"
                                    : "border-neutral-200 bg-white/80"
                            }`}>
                                <span className={`uppercase text-xs mb-4 tracking-widest text-center ${
                                    darkMode ? "text-neutral-400" : "text-neutral-400"
                                }`}>Recent Expenses</span>
                                <div className="flex flex-col gap-2">
                                    {expenseList.slice(0, 5).map((e, i) => (
                                        <div
                                            key={e._id || i}
                                            className={`flex justify-between items-center border rounded-xl px-4 py-3 transition ${
                                                darkMode
                                                    ? "border-neutral-800 bg-neutral-800 hover:bg-neutral-700"
                                                    : "border-neutral-100 bg-neutral-50 hover:bg-neutral-200"
                                            }`}
                                        >
                                            <div>
                                                <span className={`font-semibold ${
                                                    darkMode ? "text-white" : "text-neutral-800"
                                                }`}>{e.description}</span>
                                                <span className={`text-xs ml-2 ${
                                                    darkMode ? "text-neutral-400" : "text-neutral-400"
                                                }`}>{e.category}</span>
                                                {e.paymentMethod && (
                                                    <span className={`text-xs ml-2 ${
                                                        darkMode ? "text-neutral-500" : "text-neutral-500"
                                                    }`}>
                                                        • {e.paymentMethod}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className={`font-mono text-lg ${
                                                    darkMode ? "text-neutral-200" : "text-neutral-700"
                                                }`}>₹{e.amount}</span>
                                                {/* Delete Button */}
                                                <button
                                                    onClick={async () => {
                                                        if (!e._id) return;
                                                        try {
                                                            const res = await fetch(`https://backend-expense-tracker-sd03.onrender.com/expense_del/${e._id}`, {
                                                                method: "DELETE",
                                                            });
                                                            if (res.ok) {
                                                                setExpenseList(expenseList.filter((exp) => exp._id !== e._id));
                                                            } else {
                                                                alert("Failed to delete expense.");
                                                            }
                                                        } catch {
                                                            alert("Error connecting to backend.");
                                                        }
                                                    }}
                                                    className={`ml-2 px-2 py-1 rounded text-xs font-semibold transition ${
                                                        darkMode
                                                            ? "bg-red-900 hover:bg-red-700 text-red-200"
                                                            : "bg-red-100 hover:bg-red-200 text-red-600"
                                                    }`}
                                                    title="Delete"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    {expenseList.length === 0 && (
                                        <div className={darkMode ? "text-neutral-500" : "text-neutral-400"}>No expenses yet.</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </section>
                )}
            </div>
        </main>
    </>);
}

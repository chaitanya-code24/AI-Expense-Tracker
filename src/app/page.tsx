"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Add this import

// Dummy data for chart and expenses

const categories = ["Food", "Entertainment", "Transport", "Shopping", "Other"];

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
    // 3. Use Expense[] instead of any[]
    const [expenseList, setExpenseList] = useState<Expense[]>([]);
    const router = useRouter();

    // Fetch expenses from backend on mount
    useEffect(() => {
        async function fetchExpenses() {
            try {
                const res = await fetch("http://localhost:8000/expenses");
                if (res.ok) {
                    const data = await res.json();
                    setExpenseList(data.expenses || []);
                }
            } catch {
                // Optionally handle error
            }
        }
        fetchExpenses();
    }, []);

    // Calculate total and top category
    const total = expenseList.reduce((sum, e) => sum + e.amount, 0);
    const topCategory =
        expenseList.reduce((acc, curr) => {
            acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
            return acc;
        }, {} as Record<string, number>);
    const mostSpent = (Object.entries(topCategory) as [string, number][]).sort((a, b) => b[1] - a[1])[0]?.[0] || "-";

    // Handle input
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };
    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.amount || !input.category || !input.description || !input.paymentMethod) return;

        // Send data to FastAPI backend
        try {
            const res = await fetch("http://localhost:8000/add-expense", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    amount: Number(input.amount),
                    category: input.category,
                    description: input.description,
                    paymentMethod: input.paymentMethod,
                }),
            });

            if (res.ok) {
                const data = await res.json();
                setExpenseList([
                    data.expense,
                    ...expenseList,
                ]);
                setInput({ amount: "", category: "", description: "", paymentMethod: "" });
            } else {
                // Handle error (optional)
                alert("Failed to add expense.");
            }
        } catch {
            alert("Error connecting to backend.");
        }
    };

    return (
        <main className="min-h-screen bg-gradient-to-br from-white via-neutral-100 to-neutral-200 text-black font-sans flex flex-col items-center px-4 md:px-0 pb-24">
            <div className="w-full max-w-4xl mx-auto mt-12">
                {/* Tabs - AI Chat tab removed */}
                <nav className="flex justify-center gap-6 mb-12 border-b border-neutral-200">
                    <button
                        className={`py-2 px-6 border-b-2 transition-all font-medium ${
                            tab === "dashboard"
                                ? "border-black text-black"
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
                            <div className="break-inside-avoid rounded-2xl border border-neutral-200 bg-white p-8 mb-8 flex flex-col items-center shadow-lg transition-all duration-200">
                                <span className="uppercase text-xs text-neutral-400 mb-3 tracking-widest">Total This Month</span>
                                <div className="flex flex-col items-center">
                                    <span className="text-5xl font-black tracking-tight text-neutral-900 mb-2">
                                        ₹{total}
                                    </span>
                                    <span className="text-xs text-neutral-400 font-mono tracking-wide">All categories</span>
                                </div>
                            </div>
                            
                            {/* Top Category Card */}
                            <div className="break-inside-avoid rounded-2xl border border-neutral-200 bg-white p-8 mb-8 flex flex-col items-center shadow-lg transition-all duration-200">
                                <span className="uppercase text-xs text-neutral-400 mb-3 tracking-widest">Top Category</span>
                                <div className="flex flex-col items-center">
                                    <span className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-400 bg-clip-text text-transparent mb-2">
                                        {mostSpent !== "-" ? mostSpent : "—"}
                                    </span>
                                    {mostSpent !== "-" && (
                                        <span className="inline-block mt-1 px-3 py-1 rounded-lg bg-neutral-100 border border-neutral-200 text-xs font-semibold text-neutral-700 shadow-sm tracking-wide">
                                            Highest spend this month
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* AI Chat Card */}
                            <div
                                className="break-inside-avoid rounded-2xl border border-neutral-200 bg-black p-8 mb-8 flex flex-col items-start shadow-lg hover:scale-[1.03] hover:bg-neutral-900 cursor-pointer transition-all duration-200 relative"
                                onClick={() => router.push("/AIchatbot")}
                                role="button"
                                tabIndex={0}
                                onKeyDown={e => { if (e.key === "Enter") router.push("/AIchatbot"); }}
                            >
                                <div className="w-full flex flex-col items-start">
                                    <span className="text-3xl font-bold mb-1 text-white text-left">AI Chat</span>
                                    <span className="text-xs text-white text-left mb-6">
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
                                className="break-inside-avoid rounded-2xl border border-transparent bg-white/60 backdrop-blur-lg p-10 mb-8 flex flex-col items-center shadow-2xl"
                                style={{
                                    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.10)",
                                    border: "1.5px solid rgba(255,255,255,0.18)",
                                }}
                            >
                                <span className="uppercase text-xs text-neutral-500 mb-4 tracking-widest block text-center letter-spacing-wide">
                                    Expense Chart
                                </span>
                                {Object.keys(topCategory).length === 0 ? (
                                    <div className="text-neutral-400 text-center w-full mt-10">No data to display.</div>
                                ) : (
                                    <div className="w-full flex flex-col items-center">
                                        <GlassAuraPie data={topCategory} size={240} />
                                        <div className="flex flex-wrap justify-center gap-4 mt-8">
                                            {(Object.entries(topCategory) as [string, number][]).map(([cat, amt], i) => (
                                                <div
                                                  key={cat}
                                                  className="flex items-center gap-2 px-3 py-1 rounded-lg bg-white/40 backdrop-blur-sm shadow-sm transition-all hover:bg-white/70"
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
                                                  <span className="text-sm text-neutral-700 font-medium">{cat} (₹{amt})</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                            {/* Expense Input Card */}
                            <div className="break-inside-avoid rounded-2xl border border-neutral-200 bg-white/80 p-8 mb-8 flex flex-col shadow-lg hover:scale-[1.02] transition-all duration-200">
                                <span className="uppercase text-xs text-neutral-400 mb-2 tracking-widest">Add Expense</span>
                                <form className="flex flex-col gap-4 mt-2" onSubmit={handleAdd}>
                                    <input
                                        type="number"
                                        name="amount"
                                        placeholder="Amount"
                                        value={input.amount}
                                        onChange={handleChange}
                                        className="border border-neutral-200 rounded-xl px-4 py-2 bg-neutral-50 focus:outline-none focus:border-black transition placeholder-neutral-400 font-mono"
                                        min={1}
                                    />
                                    <select
                                        name="category"
                                        value={input.category}
                                        onChange={handleChange}
                                        className="border border-neutral-200 rounded-xl px-4 py-2 bg-neutral-50 focus:outline-none focus:border-black transition text-neutral-700"
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
                                        className="border border-neutral-200 rounded-xl px-4 py-2 bg-neutral-50 focus:outline-none focus:border-black transition placeholder-neutral-400"
                                    />
                                    {/* Payment Method Option */}
                                    <select
                                        name="paymentMethod"
                                        value={input.paymentMethod || ""}
                                        onChange={handleChange}
                                        className="border border-neutral-200 rounded-xl px-4 py-2 bg-neutral-50 focus:outline-none focus:border-black transition text-neutral-700"
                                    >
                                        <option value="">Select Payment Method</option>
                                        <option value="Card">Card</option>
                                        <option value="UPI">UPI</option>
                                        <option value="Cash">Cash</option>
                                    </select>
                                    <button
                                        type="submit"
                                        className="bg-black text-white rounded-xl py-2 mt-2 hover:bg-neutral-800 transition font-semibold tracking-wide shadow"
                                    >
                                        + Add Expense
                                    </button>
                                </form>
                            </div>
                            {/* Recent Expenses Card */}
                            <div className="break-inside-avoid rounded-2xl border border-neutral-200 bg-white/80 p-8 mb-8 flex flex-col shadow-lg hover:scale-[1.01] transition-all duration-200">
                                <span className="uppercase text-xs text-neutral-400 mb-4 tracking-widest text-center">Recent Expenses</span>
                                <div className="flex flex-col gap-2">
                                    {expenseList.slice(0, 5).map((e, i) => (
                                        <div
                                            key={e._id || i}
                                            className="flex justify-between items-center border border-neutral-100 rounded-xl px-4 py-3 bg-neutral-50 hover:bg-neutral-200 transition"
                                        >
                                            <div>
                                                <span className="font-semibold text-neutral-800">{e.description}</span>
                                                <span className="text-xs text-neutral-400 ml-2">{e.category}</span>
                                                {e.paymentMethod && (
                                                    <span className="text-xs text-neutral-500 ml-2">
                                                        • {e.paymentMethod}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-mono text-lg text-neutral-700">₹{e.amount}</span>
                                                {/* Delete Button */}
                                                <button
                                                    onClick={async () => {
                                                        if (!e._id) return;
                                                        try {
                                                            const res = await fetch(`http://localhost:8000/expense_del/${e._id}`, {
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
                                                    className="ml-2 px-2 py-1 rounded bg-red-100 hover:bg-red-200 text-red-600 text-xs font-semibold transition"
                                                    title="Delete"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    {expenseList.length === 0 && (
                                        <div className="text-neutral-400 text-center py-4">No expenses yet.</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </section>
                )}
            </div>
        </main>
    );
}

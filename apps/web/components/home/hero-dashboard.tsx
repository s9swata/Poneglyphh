"use client";

import { BarChart, Sparkline } from "@/components/charts";

export function HeroDashboard() {
  const monthly = [
    { label: "Jan", values: [42, 28] },
    { label: "Feb", values: [55, 32] },
    { label: "Mar", values: [48, 38] },
    { label: "Apr", values: [70, 45] },
    { label: "May", values: [63, 52] },
    { label: "Jun", values: [81, 60] },
    { label: "Jul", values: [74, 55] },
    { label: "Aug", values: [90, 68] },
    { label: "Sep", values: [88, 72] },
    { label: "Oct", values: [102, 84] },
    { label: "Nov", values: [97, 79] },
    { label: "Dec", values: [118, 95] },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto border border-grey-3 rounded-2xl overflow-hidden bg-white shadow-sm">
      {/* Dashboard top bar */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-grey-3 bg-grey-4/60">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
            <div className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
            <div className="w-3 h-3 rounded-full bg-[#28C840]" />
          </div>
          <span className="text-[11px] font-medium text-grey-1 ml-2">
            Poneglyph — Global Crime Overview
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-grey-2 bg-primary/20 px-2 py-0.5 rounded-full">
            Live
          </span>
          <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
        </div>
      </div>

      {/* Stat row */}
      <div className="grid grid-cols-4 divide-x divide-grey-3 border-b border-grey-3">
        {[
          {
            label: "Dataset Records",
            value: "112,847",
            delta: "+12%",
            up: true,
            spark: [40, 55, 48, 70, 63, 81, 74, 90, 88, 102, 97, 118],
          },
          {
            label: "AI Insights Published",
            value: "15,134",
            delta: "+8%",
            up: true,
            spark: [20, 25, 22, 30, 28, 35, 32, 40, 38, 45, 43, 50],
          },
          {
            label: "NGOs Contributing",
            value: "4,600",
            delta: "+24%",
            up: true,
            spark: [30, 38, 35, 50, 47, 58, 54, 66, 62, 75, 70, 85],
          },
          {
            label: "Campaigns Deployed",
            value: "8,490",
            delta: "+31%",
            up: true,
            spark: [100, 140, 120, 180, 160, 210, 190, 240, 230, 280, 260, 310],
          },
        ].map((s) => (
          <div key={s.label} className="flex flex-col gap-1 p-4">
            <div className="flex items-end justify-between">
              <p className="text-xl font-semibold text-black leading-none">{s.value}</p>
              <Sparkline values={s.spark} color="primary" width={60} height={28} />
            </div>
            <p className={`text-[10px] font-medium ${s.up ? "text-success" : "text-error"}`}>
              {s.up ? "↑" : "↓"} {s.delta} this month
            </p>
            <p className="text-[10px] text-grey-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Main chart */}
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm font-medium text-black">Resource Allocation Over Time</p>
            <p className="text-[11px] text-grey-1">
              Task Force Funds vs. Intelligence operations logged
            </p>
          </div>
          <div className="flex gap-3">
            {[
              { label: "Funds ($k)", color: "#22242A" },
              { label: "Intel Ops", color: "#E3FF8F" },
            ].map((l) => (
              <div key={l.label} className="flex items-center gap-1.5 text-[10px] text-grey-1">
                <div className="w-2.5 h-2.5 rounded-sm" style={{ background: l.color }} />
                {l.label}
              </div>
            ))}
          </div>
        </div>
        <BarChart data={monthly} colors={["black", "primary"]} height={160} unit="k" />
      </div>
    </div>
  );
}

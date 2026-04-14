"use client";

import { Heatmap, ChartCard } from "@/components/charts";

export function ImpactHeatmap() {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const regions = ["Asia", "Africa", "LatAm", "MENA", "Europe", "NAm"];
  // Simulated activity intensity 0–1
  const data = [
    [0.3, 0.5, 0.4, 0.7, 0.6, 0.8, 0.7, 0.9, 0.8, 1.0, 0.9, 1.0],
    [0.2, 0.4, 0.6, 0.5, 0.7, 0.6, 0.8, 0.7, 0.9, 0.8, 1.0, 0.9],
    [0.1, 0.3, 0.2, 0.4, 0.5, 0.7, 0.6, 0.5, 0.7, 0.6, 0.8, 0.9],
    [0.4, 0.3, 0.5, 0.4, 0.6, 0.5, 0.7, 0.6, 0.5, 0.7, 0.6, 0.8],
    [0.1, 0.2, 0.1, 0.3, 0.2, 0.4, 0.3, 0.5, 0.4, 0.3, 0.5, 0.6],
    [0.2, 0.1, 0.3, 0.2, 0.1, 0.3, 0.2, 0.4, 0.3, 0.2, 0.4, 0.5],
  ];

  return (
    <ChartCard title="Incident Heatmap" subtitle="Reported exploitation by region × month">
      <Heatmap data={data} rowLabels={regions} colLabels={months} color="primary" />
      <div className="flex items-center gap-2 mt-1">
        <span className="text-[9px] text-grey-2">Low</span>
        <div className="flex gap-px">
          {[0.15, 0.3, 0.5, 0.7, 0.85, 1].map((v) => (
            <div
              key={v}
              className="w-4 h-2.5 rounded-sm bg-primary"
              style={{ opacity: 0.2 + v * 0.8 }}
            />
          ))}
        </div>
        <span className="text-[9px] text-grey-2">High</span>
      </div>
    </ChartCard>
  );
}

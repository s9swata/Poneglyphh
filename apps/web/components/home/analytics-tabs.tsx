"use client";

import { ArrowRight } from "lucide-react";
import { HBarChart, LineChart, DonutChart } from "@/components/charts";
import type { HBarDatum, LineSeries, DonutSegment } from "@/components/charts";

export function AnalyticsTabsUI() {
  const impactByRegion: HBarDatum[] = [
    { label: "South Asia", value: 87, color: "black" },
    { label: "Sub-Saharan Africa", value: 74, color: "primary" },
    { label: "Latin America", value: 61, color: "blue" },
    { label: "Southeast Asia", value: 53, color: "success" },
    { label: "MENA", value: 42, color: "grey" },
  ];

  const volunteerTrend: LineSeries[] = [
    {
      label: "New Cases",
      color: "primary",
      filled: true,
      values: [120, 145, 132, 168, 155, 192, 178, 215, 204, 248, 236, 280],
    },
    {
      label: "Resolved",
      color: "black",
      filled: false,
      values: [100, 118, 108, 140, 128, 162, 150, 185, 174, 212, 200, 245],
    },
  ];

  const aiInsights: DonutSegment[] = [
    { label: "Trafficking Networks", value: 34, color: "black" },
    { label: "Child Exploitation", value: 28, color: "primary" },
    { label: "Forced Labor", value: 18, color: "error" },
    { label: "Organized Crime", value: 20, color: "success" },
  ];

  return (
    <div className="w-full border border-grey-3 rounded-2xl overflow-hidden bg-white">
      {/* 3 chart panels */}
      <div className="grid grid-cols-3 divide-x divide-grey-3 border-b border-grey-3">
        {/* Panel 1: Impact by region */}
        <div className="p-5">
          <HBarChart data={impactByRegion} title="Impact by Region" unit="%" />
        </div>
        {/* Panel 2: Volunteer trends */}
        <div className="p-5">
          <LineChart
            series={volunteerTrend}
            xLabels={["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"]}
            height={160}
            title="Cases Tracked vs Resolved"
            showLegend={true}
          />
        </div>
        {/* Panel 3: AI insights donut */}
        <div className="p-5 flex flex-col items-center justify-center">
          <DonutChart
            segments={aiInsights}
            size={140}
            centerLabel="8.5k"
            centerSub="insights"
            title="AI Insight Categories"
            showLegend={true}
          />
        </div>
      </div>

      {/* Bottom 3 labels */}
      <div className="grid grid-cols-3 divide-x divide-grey-3">
        {[
          {
            title: "Victim Mapping",
            badge: "AI",
            desc: "See exploitation hotzones, route tracking, and demographic vulnerabilities globally.",
          },
          {
            title: "Incident Trends",
            desc: "Track crime volume, seasonal variations, and cross-border reporting patterns.",
          },
          {
            title: "AI Threat Engine",
            desc: "Sub-agents process disparate reports and generate structured, actionable statistics.",
          },
        ].map((f) => (
          <div key={f.title} className="p-5 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <p className="text-[13px] font-medium text-black">{f.title}</p>
              {f.badge && (
                <span className="text-[9px] font-medium bg-primary text-black px-1.5 py-0.5 rounded-full">
                  {f.badge}
                </span>
              )}
            </div>
            <p className="text-[11px] text-grey-1 leading-relaxed">{f.desc}</p>
            <button className="text-[11px] font-medium text-black flex items-center gap-1 mt-1">
              Learn more <ArrowRight size={10} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

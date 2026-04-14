"use client";

import { ChartCard, ScatterPlot, StackedBar, ProgressRing, LineChart } from "@/components/charts";
import type { ScatterPoint, StackedSegment } from "@/components/charts";

export function AiAnalysisViz() {
  const scatter: ScatterPoint[] = [
    { x: 20, y: 65, label: "Interpol", color: "primary", size: 8 },
    { x: 45, y: 80, label: "UNODC", color: "black", size: 10 },
    { x: 70, y: 55, label: "Europol", color: "blue", size: 7 },
    { x: 30, y: 40, label: "Polaris", color: "success", size: 9 },
    { x: 85, y: 70, label: "IJM", color: "primary", size: 6 },
    { x: 55, y: 90, label: "A21", color: "error", size: 8 },
    { x: 15, y: 30, label: "NCMEC", color: "grey", size: 6 },
    { x: 90, y: 45, label: "ECPAT", color: "blue", size: 7 },
    { x: 60, y: 75, label: "Walk Free", color: "success", size: 5 },
    { x: 40, y: 60, label: "Hope", color: "primary", size: 6 },
  ];

  const resourceSplit: StackedSegment[] = [
    { label: "Task Forces", value: 38, color: "black" },
    { label: "Victim Support", value: 27, color: "primary" },
    { label: "Legal Aid", value: 18, color: "blue" },
    { label: "Border Intel", value: 12, color: "success" },
    { label: "Other", value: 5, color: "grey" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl mx-auto">
      <ChartCard title="Rescue Operations vs. Intel Gathered" subtitle="Bubble = operation scale">
        <ScatterPlot points={scatter} height={200} xLabel="Intel Gathered →" yLabel="Rescues ↑" />
      </ChartCard>

      <div className="flex flex-col gap-4">
        <ChartCard title="Intervention Category Split" subtitle="Current resource deployment">
          <StackedBar segments={resourceSplit} height={14} showLabels={true} />
          <div className="grid grid-cols-3 gap-3 mt-2">
            {[
              { label: "Efficiency", value: 82, color: "primary" as const },
              { label: "Coverage", value: 67, color: "blue" as const },
              { label: "Speed", value: 91, color: "success" as const },
            ].map((r) => (
              <ProgressRing
                key={r.label}
                value={r.value}
                color={r.color}
                label={r.label}
                size={72}
              />
            ))}
          </div>
        </ChartCard>

        <ChartCard title="AI Processing Queue" subtitle="Sub-agent task throughput">
          <LineChart
            series={[
              {
                label: "Tasks Queued",
                color: "grey",
                values: [40, 55, 48, 60, 52, 70, 65, 80, 72, 88, 80, 95],
                filled: false,
              },
              {
                label: "Tasks Completed",
                color: "success",
                filled: true,
                values: [38, 53, 46, 58, 50, 68, 63, 78, 70, 86, 78, 93],
              },
            ]}
            xLabels={["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"]}
            height={120}
            showLegend={true}
          />
        </ChartCard>
      </div>
    </div>
  );
}

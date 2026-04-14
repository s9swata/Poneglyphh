"use client";

import { ChartCard, DonutChart, BarChart, HBarChart } from "@/components/charts";

export function ByTheNumbers() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Card 1: Threat Detection */}
      <ChartCard title="Threat Detection Accuracy" subtitle="Pattern matching alignment">
        <DonutChart
          segments={[
            { label: "High Threat", value: 62, color: "primary" },
            { label: "Medium", value: 24, color: "black" },
            { label: "Suspicious", value: 10, color: "grey" },
            { label: "False Positive", value: 4, color: "error" },
          ]}
          size={140}
          centerLabel="96%"
          centerSub="accurate"
          showLegend={true}
        />
      </ChartCard>

      {/* Card 2: Data pipeline */}
      <ChartCard title="Intel Report Pipeline" subtitle="Volume processed by AI agents">
        <BarChart
          data={[
            { label: "W1", values: [120, 95] },
            { label: "W2", values: [145, 118] },
            { label: "W3", values: [132, 108] },
            { label: "W4", values: [168, 140] },
            { label: "W5", values: [155, 128] },
            { label: "W6", values: [192, 162] },
            { label: "W7", values: [178, 150] },
            { label: "W8", values: [215, 185] },
          ]}
          colors={["black", "primary"]}
          height={140}
          showLegend={true}
          legendLabels={["Uploaded", "Processed"]}
        />
      </ChartCard>

      {/* Card 3: Regional coverage */}
      <ChartCard title="High-Risk Hotspots" subtitle="% of global incidents mapped">
        <div className="flex flex-col gap-3 flex-1">
          <HBarChart
            data={[
              { label: "South Asia", value: 91, color: "primary" },
              { label: "Sub-Saharan Africa", value: 78, color: "black" },
              { label: "Latin America", value: 65, color: "blue" },
              { label: "Southeast Asia", value: 58, color: "success" },
              { label: "MENA", value: 44, color: "grey" },
              { label: "Europe", value: 32, color: "grey" },
            ]}
            unit="%"
            showValues={true}
          />
        </div>
      </ChartCard>
    </div>
  );
}

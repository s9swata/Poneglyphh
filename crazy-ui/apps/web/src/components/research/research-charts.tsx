"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = ["#22242A", "#bfff00", "#25C5FA", "#37955B", "#B3BDBD", "#E5E6E6"];

interface ChartDataPoint {
  name: string;
  value: number;
  color?: string;
}

export function CustomBarChart({ data, title }: { data: ChartDataPoint[]; title: string }) {
  return (
    <div className="w-full">
      <p className="text-sm font-medium text-grey-1 mb-3">{title}</p>
      <ResponsiveContainer width="100%" height={160}>
        <BarChart data={data} layout="vertical" margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
          <XAxis type="number" hide />
          <YAxis
            dataKey="name"
            type="category"
            width={90}
            tick={{ fontSize: 12, fill: "#415762" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #E5E6E6",
              borderRadius: "8px",
              fontSize: "12px",
            }}
          />
          <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={22} activeBar={false}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function CustomDonutChart({ data, title }: { data: ChartDataPoint[]; title: string }) {
  const total = data.reduce((acc, item) => acc + item.value, 0);

  return (
    <div className="w-full flex flex-col items-center">
      <p className="text-sm font-medium text-grey-1 mb-3 self-start">{title}</p>
      <ResponsiveContainer width="100%" height={160}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={40}
            outerRadius={65}
            paddingAngle={2}
            dataKey="value"
            isAnimationActive={false}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #E5E6E6",
              borderRadius: "8px",
              fontSize: "12px",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="flex flex-wrap gap-3 mt-2 justify-center">
        {data.map((item, i) => (
          <div key={i} className="flex items-center gap-2 text-xs">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: item.color || COLORS[i % COLORS.length] }}
            />
            <span className="text-grey-1">{item.name}</span>
            <span className="font-medium text-black">
              {Math.round((item.value / (total || 1)) * 100)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CustomAreaChart({ data, title }: { data: ChartDataPoint[]; title: string }) {
  return (
    <div className="w-full">
      <p className="text-sm font-medium text-grey-1 mb-3">{title}</p>
      <ResponsiveContainer width="100%" height={140}>
        <AreaChart data={data} margin={{ top: 10, right: 15, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#bfff00" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#bfff00" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: "#B3BDBD" }}
            dy={5}
          />
          <YAxis hide />
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #E5E6E6",
              borderRadius: "8px",
              fontSize: "12px",
            }}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#22242A"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorValue)"
            dot={{ fill: "#22242A", strokeWidth: 0, r: 4 }}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

/**
 * Poneglyph Chart Components
 * Pure SVG/CSS charts — no external deps.
 * Color palette: primary #E3FF8F, black #22242A, blue #25C5FA,
 *                success #37955B, error #EE4444, greys.
 */

"use client";

/* ─── Shared types ─── */
export type ChartColor = "primary" | "black" | "blue" | "success" | "error" | "grey";

const COLOR_MAP: Record<ChartColor, string> = {
  primary: "#E3FF8F",
  black: "#22242A",
  blue: "#25C5FA",
  success: "#37955B",
  error: "#EE4444",
  grey: "#B3BDBD",
};

/* ═══════════════════════════════════════════════
   1. VERTICAL BAR CHART
   Props: data[], colors[], label, showValues
═══════════════════════════════════════════════ */
export interface BarDatum {
  label: string;
  values: number[];
}

interface BarChartProps {
  data: BarDatum[];
  colors?: ChartColor[];
  height?: number;
  showLegend?: boolean;
  legendLabels?: string[];
  title?: string;
  unit?: string;
}

export function BarChart({
  data,
  colors = ["primary", "black"],
  height = 180,
  showLegend = false,
  legendLabels,
  title,
  unit = "",
}: BarChartProps) {
  const allVals = data.flatMap((d) => d.values);
  const max = Math.max(...allVals, 1);
  const barCount = data.length * (data[0]?.values.length ?? 1);
  const svgW = Math.max(barCount * 32 + 40, 300);
  const svgH = height;
  const padL = 36;
  const padB = 28;
  const padT = 12;
  const chartH = svgH - padB - padT;
  const barGroupW = (svgW - padL - 16) / data.length;
  const seriesCount = data[0]?.values.length ?? 1;
  const barW = Math.min(18, barGroupW / seriesCount - 4);

  const yLines = [0, 0.25, 0.5, 0.75, 1];

  return (
    <div className="flex flex-col gap-2 w-full">
      {title && <p className="text-xs font-medium text-grey-1 uppercase tracking-wide">{title}</p>}
      <svg
        viewBox={`0 0 ${svgW} ${svgH}`}
        className="w-full"
        style={{ height: svgH }}
        aria-label={title ?? "Bar chart"}
      >
        {/* Y grid lines */}
        {yLines.map((t) => {
          const y = padT + chartH * (1 - t);
          return (
            <g key={t}>
              <line x1={padL} y1={y} x2={svgW - 8} y2={y} stroke="#E5E6E6" strokeWidth="1" />
              <text x={padL - 4} y={y + 3} textAnchor="end" fontSize="9" fill="#B3BDBD">
                {Math.round(max * t)}
                {unit}
              </text>
            </g>
          );
        })}

        {/* Bars */}
        {data.map((d, gi) => {
          const groupX = padL + gi * barGroupW + (barGroupW - seriesCount * (barW + 2)) / 2;
          return d.values.map((v, si) => {
            const barH = (v / max) * chartH;
            const x = groupX + si * (barW + 3);
            const y = padT + chartH - barH;
            const fill = COLOR_MAP[colors[si % colors.length]];
            return (
              <g key={`${gi}-${si}`}>
                <rect x={x} y={y} width={barW} height={barH} fill={fill} rx="3" />
              </g>
            );
          });
        })}

        {/* X labels */}
        {data.map((d, gi) => {
          const cx = padL + gi * barGroupW + barGroupW / 2;
          return (
            <text key={gi} x={cx} y={svgH - 6} textAnchor="middle" fontSize="9" fill="#B3BDBD">
              {d.label}
            </text>
          );
        })}
      </svg>

      {showLegend && legendLabels && (
        <div className="flex items-center gap-4 flex-wrap">
          {legendLabels.map((l, i) => (
            <div key={l} className="flex items-center gap-1.5 text-[11px] text-grey-1">
              <div
                className="w-2.5 h-2.5 rounded-sm"
                style={{ background: COLOR_MAP[colors[i % colors.length]] }}
              />
              {l}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   2. HORIZONTAL BAR CHART
═══════════════════════════════════════════════ */
export interface HBarDatum {
  label: string;
  value: number;
  color?: ChartColor;
}

interface HBarChartProps {
  data: HBarDatum[];
  title?: string;
  unit?: string;
  showValues?: boolean;
}

export function HBarChart({ data, title, unit = "%", showValues = true }: HBarChartProps) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="flex flex-col gap-3 w-full">
      {title && <p className="text-xs font-medium text-grey-1 uppercase tracking-wide">{title}</p>}
      {data.map((d) => (
        <div key={d.label} className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-black">{d.label}</span>
            {showValues && (
              <span className="text-xs font-medium text-black">
                {d.value}
                {unit}
              </span>
            )}
          </div>
          <div className="h-2.5 w-full bg-grey-4 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${(d.value / max) * 100}%`,
                background: COLOR_MAP[d.color ?? "black"],
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   3. LINE / AREA CHART
═══════════════════════════════════════════════ */
export interface LineSeries {
  label: string;
  values: number[];
  color: ChartColor;
  filled?: boolean;
}

interface LineChartProps {
  series: LineSeries[];
  xLabels: string[];
  height?: number;
  title?: string;
  unit?: string;
  showLegend?: boolean;
}

export function LineChart({
  series,
  xLabels,
  height = 180,
  title,
  unit = "",
  showLegend = true,
}: LineChartProps) {
  const allVals = series.flatMap((s) => s.values);
  const max = Math.max(...allVals, 1) * 1.1;
  const min = 0;
  const svgW = 400;
  const svgH = height;
  const padL = 36;
  const padB = 28;
  const padT = 12;
  const padR = 12;
  const chartW = svgW - padL - padR;
  const chartH = svgH - padB - padT;
  const n = xLabels.length;

  function xPos(i: number) {
    return padL + (i / (n - 1)) * chartW;
  }
  function yPos(v: number) {
    return padT + chartH - ((v - min) / (max - min)) * chartH;
  }

  const yTicks = [0, 0.25, 0.5, 0.75, 1];

  return (
    <div className="flex flex-col gap-2 w-full">
      {title && <p className="text-xs font-medium text-grey-1 uppercase tracking-wide">{title}</p>}
      <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full" style={{ height: svgH }}>
        {/* Grid lines */}
        {yTicks.map((t) => {
          const y = padT + chartH * (1 - t);
          return (
            <g key={t}>
              <line x1={padL} y1={y} x2={svgW - padR} y2={y} stroke="#E5E6E6" strokeWidth="1" />
              <text x={padL - 4} y={y + 3} textAnchor="end" fontSize="9" fill="#B3BDBD">
                {Math.round((max - min) * t + min)}
                {unit}
              </text>
            </g>
          );
        })}

        {/* X labels */}
        {xLabels.map((l, i) => (
          <text key={i} x={xPos(i)} y={svgH - 6} textAnchor="middle" fontSize="9" fill="#B3BDBD">
            {l}
          </text>
        ))}

        {/* Series */}
        {series.map((s) => {
          const pts = s.values.map((v, i) => `${xPos(i)},${yPos(v)}`).join(" ");
          const color = COLOR_MAP[s.color];
          const areaBottom = `${xPos(n - 1)},${yPos(min)} ${xPos(0)},${yPos(min)}`;
          return (
            <g key={s.label}>
              {s.filled && <polygon points={`${pts} ${areaBottom}`} fill={color} opacity="0.15" />}
              <polyline
                points={pts}
                fill="none"
                stroke={color}
                strokeWidth="2"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
              {/* Dots */}
              {s.values.map((v, i) => (
                <circle key={i} cx={xPos(i)} cy={yPos(v)} r="3" fill={color} />
              ))}
            </g>
          );
        })}
      </svg>

      {showLegend && (
        <div className="flex items-center gap-4 flex-wrap">
          {series.map((s) => (
            <div key={s.label} className="flex items-center gap-1.5 text-[11px] text-grey-1">
              <div className="w-3 h-0.5 rounded-full" style={{ background: COLOR_MAP[s.color] }} />
              {s.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   4. DONUT CHART
═══════════════════════════════════════════════ */
export interface DonutSegment {
  label: string;
  value: number;
  color: ChartColor;
}

interface DonutChartProps {
  segments: DonutSegment[];
  size?: number;
  centerLabel?: string;
  centerSub?: string;
  title?: string;
  showLegend?: boolean;
}

export function DonutChart({
  segments,
  size = 160,
  centerLabel,
  centerSub,
  title,
  showLegend = true,
}: DonutChartProps) {
  const total = segments.reduce((a, s) => a + s.value, 0);
  const r = 56;
  const cx = size / 2;
  const cy = size / 2;
  const stroke = 20;
  const circumference = 2 * Math.PI * r;

  let offset = 0;
  const arcs = segments.map((s) => {
    const pct = s.value / total;
    const dash = pct * circumference;
    const arc = { dash, offset, color: COLOR_MAP[s.color], pct };
    offset += dash;
    return arc;
  });

  return (
    <div className="flex flex-col gap-3 items-center w-full">
      {title && (
        <p className="text-xs font-medium text-grey-1 uppercase tracking-wide self-start">
          {title}
        </p>
      )}
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          viewBox={`0 0 ${size} ${size}`}
          width={size}
          height={size}
          style={{ transform: "rotate(-90deg)" }}
        >
          {/* Track */}
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="#F2F3F3" strokeWidth={stroke} />
          {arcs.map((a, i) => (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r={r}
              fill="none"
              stroke={a.color}
              strokeWidth={stroke}
              strokeDasharray={`${a.dash} ${circumference - a.dash}`}
              strokeDashoffset={-a.offset}
              strokeLinecap="butt"
            />
          ))}
        </svg>
        {centerLabel && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-2xl font-semibold text-black leading-none">{centerLabel}</p>
            {centerSub && <p className="text-[10px] text-grey-1 mt-0.5">{centerSub}</p>}
          </div>
        )}
      </div>

      {showLegend && (
        <div className="flex flex-col gap-2 w-full">
          {segments.map((s) => (
            <div key={s.label} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ background: COLOR_MAP[s.color] }}
                />
                <span className="text-xs text-grey-1">{s.label}</span>
              </div>
              <span className="text-xs font-medium text-black">
                {Math.round((s.value / total) * 100)}%
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   5. SPARKLINE (inline mini chart)
═══════════════════════════════════════════════ */
interface SparklineProps {
  values: number[];
  color?: ChartColor;
  width?: number;
  height?: number;
  filled?: boolean;
}

export function Sparkline({
  values,
  color = "primary",
  width = 80,
  height = 32,
  filled = true,
}: SparklineProps) {
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const n = values.length;
  const c = COLOR_MAP[color];

  function x(i: number) {
    return (i / (n - 1)) * width;
  }
  function y(v: number) {
    return height - ((v - min) / (max - min || 1)) * height;
  }

  const pts = values.map((v, i) => `${x(i)},${y(v)}`).join(" ");
  const area = `${pts} ${x(n - 1)},${height} ${x(0)},${height}`;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      {filled && <polygon points={area} fill={c} opacity="0.2" />}
      <polyline
        points={pts}
        fill="none"
        stroke={c}
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ═══════════════════════════════════════════════
   6. SPARKLINE STAT CARD
   Big number + sparkline + label + delta
═══════════════════════════════════════════════ */
interface SparkStatProps {
  value: string;
  label: string;
  sparkValues: number[];
  sparkColor?: ChartColor;
  delta?: string;
  deltaUp?: boolean;
}

export function SparkStat({
  value,
  label,
  sparkValues,
  sparkColor = "primary",
  delta,
  deltaUp,
}: SparkStatProps) {
  return (
    <div className="flex flex-col gap-1 p-5 bg-white border border-grey-3 rounded-2xl">
      <div className="flex items-start justify-between">
        <p className="text-[28px] font-semibold text-black leading-none">{value}</p>
        <Sparkline values={sparkValues} color={sparkColor} width={72} height={36} />
      </div>
      {delta && (
        <span className={`text-[11px] font-medium ${deltaUp ? "text-success" : "text-error"}`}>
          {deltaUp ? "↑" : "↓"} {delta}
        </span>
      )}
      <p className="text-xs text-grey-1">{label}</p>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   7. HEATMAP (calendar-style grid)
═══════════════════════════════════════════════ */
interface HeatmapProps {
  data: number[][]; // rows × cols, values 0–1
  rowLabels?: string[];
  colLabels?: string[];
  color?: ChartColor;
  title?: string;
}

export function Heatmap({ data, rowLabels, colLabels, color = "primary", title }: HeatmapProps) {
  const c = COLOR_MAP[color];
  const cellSize = 20;
  const _gap = 3;

  return (
    <div className="flex flex-col gap-2 w-full overflow-x-auto">
      {title && <p className="text-xs font-medium text-grey-1 uppercase tracking-wide">{title}</p>}
      <div className="flex flex-col gap-[3px]">
        {colLabels && (
          <div className="flex gap-[3px] ml-10">
            {colLabels.map((l) => (
              <div
                key={l}
                style={{ width: cellSize }}
                className="text-center text-[8px] text-grey-2 truncate"
              >
                {l}
              </div>
            ))}
          </div>
        )}
        {data.map((row, ri) => (
          <div key={ri} className="flex items-center gap-[3px]">
            {rowLabels && (
              <span className="text-[9px] text-grey-2 w-9 text-right pr-1 shrink-0">
                {rowLabels[ri]}
              </span>
            )}
            {row.map((val, ci) => (
              <div
                key={ci}
                title={`${Math.round(val * 100)}%`}
                style={{
                  width: cellSize,
                  height: cellSize,
                  borderRadius: 3,
                  background: val === 0 ? "#F2F3F3" : c,
                  opacity: val === 0 ? 1 : 0.2 + val * 0.8,
                  flexShrink: 0,
                }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   8. PROGRESS RING (single stat ring)
═══════════════════════════════════════════════ */
interface ProgressRingProps {
  value: number; // 0–100
  size?: number;
  color?: ChartColor;
  label?: string;
  sub?: string;
}

export function ProgressRing({
  value,
  size = 80,
  color = "primary",
  label,
  sub,
}: ProgressRingProps) {
  const r = (size - 10) / 2;
  const circ = 2 * Math.PI * r;
  const fill = (value / 100) * circ;
  const c = COLOR_MAP[color];

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          style={{ transform: "rotate(-90deg)" }}
        >
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#F2F3F3" strokeWidth="8" />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={c}
            strokeWidth="8"
            strokeDasharray={`${fill} ${circ - fill}`}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-[13px] font-semibold text-black leading-none">{value}%</p>
        </div>
      </div>
      {label && <p className="text-[11px] font-medium text-black text-center">{label}</p>}
      {sub && <p className="text-[9px] text-grey-1 text-center">{sub}</p>}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   9. STACKED BAR CHART (single row, multiple segments)
═══════════════════════════════════════════════ */
export interface StackedSegment {
  label: string;
  value: number;
  color: ChartColor;
}

interface StackedBarProps {
  segments: StackedSegment[];
  height?: number;
  showLabels?: boolean;
  title?: string;
}

export function StackedBar({ segments, height = 12, showLabels = true, title }: StackedBarProps) {
  const total = segments.reduce((a, s) => a + s.value, 0);
  return (
    <div className="flex flex-col gap-2 w-full">
      {title && <p className="text-xs font-medium text-grey-1 uppercase tracking-wide">{title}</p>}
      <div className="flex h-3 rounded-full overflow-hidden gap-px" style={{ height }}>
        {segments.map((s) => (
          <div
            key={s.label}
            style={{
              width: `${(s.value / total) * 100}%`,
              background: COLOR_MAP[s.color],
            }}
          />
        ))}
      </div>
      {showLabels && (
        <div className="flex flex-wrap gap-3">
          {segments.map((s) => (
            <div key={s.label} className="flex items-center gap-1.5 text-[10px] text-grey-1">
              <div className="w-2 h-2 rounded-full" style={{ background: COLOR_MAP[s.color] }} />
              {s.label}
              <span className="font-medium text-black">{Math.round((s.value / total) * 100)}%</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   10. CHART CARD WRAPPER
   Wraps any chart in a white card with header
═══════════════════════════════════════════════ */
interface ChartCardProps {
  title: string;
  subtitle?: string;
  badge?: string;
  children: React.ReactNode;
  className?: string;
}

export function ChartCard({ title, subtitle, badge, children, className = "" }: ChartCardProps) {
  return (
    <div
      className={`bg-white border border-grey-3 rounded-2xl p-5 flex flex-col gap-5 ${className}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-black">{title}</p>
            {badge && (
              <span className="text-[9px] font-semibold bg-primary text-black px-1.5 py-0.5 rounded-full">
                {badge}
              </span>
            )}
          </div>
          {subtitle && <p className="text-[11px] text-grey-1">{subtitle}</p>}
        </div>
      </div>
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   11. SCATTER PLOT
═══════════════════════════════════════════════ */
export interface ScatterPoint {
  x: number;
  y: number;
  label?: string;
  color?: ChartColor;
  size?: number;
}

interface ScatterPlotProps {
  points: ScatterPoint[];
  width?: number;
  height?: number;
  title?: string;
  xLabel?: string;
  yLabel?: string;
}

export function ScatterPlot({ points, height = 200, title, xLabel, yLabel }: ScatterPlotProps) {
  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);
  const maxX = Math.max(...xs);
  const maxY = Math.max(...ys);
  const svgW = 360;
  const svgH = height;
  const padL = 36;
  const padB = 28;
  const padT = 12;
  const padR = 12;
  const chartW = svgW - padL - padR;
  const chartH = svgH - padB - padT;

  return (
    <div className="flex flex-col gap-2 w-full">
      {title && <p className="text-xs font-medium text-grey-1 uppercase tracking-wide">{title}</p>}
      <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full" style={{ height: svgH }}>
        {/* Grid */}
        {[0, 0.25, 0.5, 0.75, 1].map((t) => {
          const y = padT + chartH * (1 - t);
          const x = padL + chartW * t;
          return (
            <g key={t}>
              <line x1={padL} y1={y} x2={svgW - padR} y2={y} stroke="#E5E6E6" strokeWidth="1" />
              <line x1={x} y1={padT} x2={x} y2={svgH - padB} stroke="#E5E6E6" strokeWidth="1" />
              <text x={padL - 4} y={y + 3} textAnchor="end" fontSize="8" fill="#B3BDBD">
                {Math.round(maxY * t)}
              </text>
              <text x={x} y={svgH - 4} textAnchor="middle" fontSize="8" fill="#B3BDBD">
                {Math.round(maxX * t)}
              </text>
            </g>
          );
        })}

        {/* Points */}
        {points.map((p, i) => {
          const cx = padL + (p.x / maxX) * chartW;
          const cy = padT + chartH - (p.y / maxY) * chartH;
          const r = p.size ?? 5;
          return (
            <g key={i}>
              <circle cx={cx} cy={cy} r={r} fill={COLOR_MAP[p.color ?? "primary"]} opacity="0.85" />
              {p.label && (
                <text x={cx} y={cy - r - 3} textAnchor="middle" fontSize="8" fill="#415762">
                  {p.label}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      {(xLabel || yLabel) && (
        <div className="flex justify-between text-[10px] text-grey-2">
          <span>{yLabel}</span>
          <span>{xLabel}</span>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   12. GROUPED STAT ROW
   Horizontal row of small stats with sparklines
═══════════════════════════════════════════════ */
interface MiniStatProps {
  label: string;
  value: string;
  change: string;
  up: boolean;
}

export function MiniStat({ label, value, change, up }: MiniStatProps) {
  return (
    <div className="flex flex-col gap-0.5">
      <p className="text-[10px] text-grey-1">{label}</p>
      <p className="text-lg font-semibold text-black leading-none">{value}</p>
      <p className={`text-[10px] font-medium ${up ? "text-success" : "text-error"}`}>
        {up ? "↑" : "↓"} {change}
      </p>
    </div>
  );
}

"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { authClient } from "@/lib/auth-client";
import { env } from "@Poneglyph/env/web";
import { ResearchSidebar, type ResearchSession } from "@/components/research/research-sidebar";
import { ResearchInput } from "@/components/research/research-input";
import { D3Renderer } from "@/components/research/d3-renderer";
import {
  IconSparkles,
  IconShare,
  IconUpload,
  IconDots,
  IconChevronRight,
  IconBulb,
  IconSearch,
  IconFile,
  IconFolder,
  IconActivity,
  IconArrowRight,
} from "@tabler/icons-react";

// ---- Types ----

interface ResearchStep {
  id: string;
  toolCallId: string;
  state: "pending" | "active" | "done";
  title: string;
  detail: string;
  startedAt: number;
  elapsed?: string;
  open: boolean;
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  steps: ResearchStep[];
  isStreaming: boolean;
  data?: any[];
  dataContext?: string;
}

interface Session extends ResearchSession {
  messages: ChatMessage[];
  startedAt: Date;
}

type UIChunk =
  | { type: "text-start"; id: string }
  | { type: "text-delta"; id: string; delta: string }
  | { type: "text-end"; id: string }
  | { type: "reasoning-delta"; id: string; delta: string }
  | { type: "tool-input-available"; toolCallId: string; toolName: string }
  | { type: "tool-output-available"; toolCallId: string }
  | { type: "error"; errorText: string }
  | { type: string };

// ---- Hardcoded insights visualization ----

const INSIGHTS_D3_CODE = `
const margin = { top: 28, right: 48, bottom: 44, left: 148 };
const w = width - margin.left - margin.right;
const h = height - margin.top - margin.bottom;

const dataset = [
  { label: "Health Access",     value: 73 },
  { label: "Education Rate",    value: 61 },
  { label: "Clean Water",       value: 55 },
  { label: "Food Security",     value: 48 },
  { label: "Digital Inclusion", value: 42 },
  { label: "Gender Equality",   value: 38 },
  { label: "Youth Employment",  value: 31 },
];

const svg = d3.select(container)
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .style("font-family", "var(--font-sans, system-ui, sans-serif)");

const g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

const x = d3.scaleLinear().domain([0, 100]).range([0, w]).nice();
const y = d3.scaleBand().domain(dataset.map(function(d){ return d.label; })).range([0, h]).padding(0.38);

const color = d3.scaleSequential().domain([0, dataset.length - 1]).interpolator(d3.interpolateCool);

// Grid lines
g.append("g")
  .attr("stroke", "currentColor")
  .attr("stroke-opacity", 0.07)
  .selectAll("line")
  .data(x.ticks(5))
  .join("line")
  .attr("x1", function(d){ return x(d); })
  .attr("x2", function(d){ return x(d); })
  .attr("y1", 0)
  .attr("y2", h);

// Track (background bar)
g.selectAll(".track")
  .data(dataset)
  .join("rect")
  .attr("class", "track")
  .attr("x", 0)
  .attr("y", function(d){ return y(d.label); })
  .attr("width", w)
  .attr("height", y.bandwidth())
  .attr("fill", "currentColor")
  .attr("opacity", 0.04)
  .attr("rx", 6);

// Value bars
g.selectAll(".bar")
  .data(dataset)
  .join("rect")
  .attr("class", "bar")
  .attr("x", 0)
  .attr("y", function(d){ return y(d.label); })
  .attr("width", function(d){ return x(d.value); })
  .attr("height", y.bandwidth())
  .attr("fill", function(d, i){ return color(i); })
  .attr("rx", 6)
  .attr("opacity", 0.88);

// Value labels
g.selectAll(".val-label")
  .data(dataset)
  .join("text")
  .attr("class", "val-label")
  .attr("x", function(d){ return x(d.value) + 8; })
  .attr("y", function(d){ return y(d.label) + y.bandwidth() / 2; })
  .attr("dy", "0.35em")
  .attr("font-size", "12px")
  .attr("fill", "currentColor")
  .attr("opacity", 0.65)
  .text(function(d){ return d.value + "%"; });

// Y axis
g.append("g")
  .call(d3.axisLeft(y).tickSize(0).tickPadding(12))
  .call(function(axis){ axis.select(".domain").remove(); })
  .selectAll("text")
  .attr("font-size", "13px")
  .attr("fill", "currentColor");

// X axis
g.append("g")
  .attr("transform", "translate(0," + h + ")")
  .call(d3.axisBottom(x).ticks(5).tickFormat(function(d){ return d + "%"; }).tickSize(-h))
  .call(function(axis){ axis.select(".domain").remove(); })
  .selectAll("text")
  .attr("font-size", "11px")
  .attr("fill", "currentColor")
  .attr("opacity", 0.5);

g.selectAll(".tick line")
  .attr("stroke", "currentColor")
  .attr("stroke-opacity", 0.08);

// Title
svg.append("text")
  .attr("x", margin.left)
  .attr("y", 14)
  .attr("font-size", "11px")
  .attr("font-weight", "600")
  .attr("text-transform", "uppercase")
  .attr("letter-spacing", "0.08em")
  .attr("fill", "currentColor")
  .attr("opacity", 0.4)
  .text("GLOBAL DEVELOPMENT INDICATORS — 2025");
`;

// ---- Helpers ----

function genId() {
  return Math.random().toString(36).slice(2, 10);
}

function toolToStep(toolName: string): { title: string; detail: string } {
  const n = toolName.toLowerCase();
  if (n.includes("web") && n.includes("search"))
    return { title: "Searched the web", detail: `web.search · "${toolName}"` };
  if (n.includes("search")) return { title: "Searching sources", detail: `search · "${toolName}"` };
  if (n.includes("fetch") || n.includes("browse") || n.includes("read"))
    return { title: "Read sources", detail: `browser.fetch · ${toolName}` };
  if (n.includes("file") || n.includes("workspace"))
    return { title: "Searched workspace", detail: `files.search · ${toolName}` };
  if (n.includes("think") || n.includes("plan"))
    return { title: "Planning the research", detail: `decompose · ${toolName}` };
  return { title: `Using ${toolName}`, detail: toolName };
}

function formatElapsed(ms: number) {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(0)}s`;
}

async function* parseSSE(response: Response): AsyncGenerator<UIChunk> {
  const reader = response.body!.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop()!;
    for (const line of lines) {
      if (!line.startsWith("data: ")) continue;
      const data = line.slice(6).trim();
      if (data === "[DONE]") return;
      try {
        yield JSON.parse(data) as UIChunk;
      } catch {
        /* skip malformed */
      }
    }
  }
}

// ---- Step Icon ----

function StepIcon({ title }: { title: string }) {
  const t = title.toLowerCase();
  if (t.includes("plan") || t.includes("think"))
    return <IconBulb style={{ width: 11, height: 11 }} />;
  if (t.includes("web") || t.includes("search"))
    return <IconSearch style={{ width: 11, height: 11 }} />;
  if (t.includes("read") || t.includes("source") || t.includes("fetch"))
    return <IconFile style={{ width: 11, height: 11 }} />;
  if (t.includes("workspace") || t.includes("file"))
    return <IconFolder style={{ width: 11, height: 11 }} />;
  if (t.includes("cross") || t.includes("verify") || t.includes("check"))
    return <IconActivity style={{ width: 11, height: 11 }} />;
  return <IconArrowRight style={{ width: 11, height: 11 }} />;
}

// ---- Step Item ----

function StepItem({
  step,
  isLast,
  onToggle,
}: {
  step: ResearchStep;
  isLast: boolean;
  onToggle: () => void;
}) {
  const isDone = step.state === "done";
  const isActive = step.state === "active";

  return (
    <div
      style={{
        position: "relative",
        paddingLeft: 26,
        paddingTop: 10,
        paddingBottom: isLast ? 0 : 10,
      }}
    >
      {/* Connector line */}
      {!isLast && (
        <div
          style={{
            position: "absolute",
            left: 10,
            top: 34,
            bottom: 0,
            width: 1,
            background:
              "linear-gradient(to bottom, var(--border) 0%, var(--border) 92%, transparent)",
          }}
        />
      )}

      {/* Step icon */}
      <div
        style={{
          position: "absolute",
          left: -1,
          top: 12,
          width: 22,
          height: 22,
          borderRadius: "50%",
          background: isActive
            ? "var(--primary)"
            : isDone
              ? "color-mix(in oklch, var(--primary) 18%, var(--card))"
              : "var(--card)",
          border: isActive
            ? "1px solid var(--primary)"
            : isDone
              ? "1px solid color-mix(in oklch, var(--primary) 30%, var(--border))"
              : "1px solid var(--border)",
          display: "grid",
          placeItems: "center",
          color: isActive
            ? "var(--primary-foreground)"
            : isDone
              ? "color-mix(in oklch, var(--primary) 35%, var(--foreground))"
              : "var(--muted-foreground)",
          zIndex: 1,
          boxShadow: isActive
            ? "0 0 0 4px color-mix(in oklch, var(--primary) 22%, transparent)"
            : "none",
        }}
      >
        {isActive && (
          <div
            style={{
              position: "absolute",
              inset: -4,
              borderRadius: "50%",
              border: "1px solid color-mix(in oklch, var(--primary) 50%, transparent)",
              animation: "ping 1.6s cubic-bezier(0,0,0.2,1) infinite",
            }}
          />
        )}
        <StepIcon title={step.title} />
      </div>

      {/* Summary */}
      <div
        onClick={onToggle}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          cursor: "pointer",
          userSelect: "none",
        }}
      >
        <span
          style={{ fontSize: "13.5px", fontWeight: 500, color: "var(--foreground)", flexShrink: 0 }}
        >
          {step.title}
        </span>
        <span
          style={{
            fontSize: "12.5px",
            color: "var(--muted-foreground)",
            fontFamily: "var(--font-mono)",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {step.detail}
        </span>
        <span
          style={{
            marginLeft: "auto",
            fontSize: "11.5px",
            color: "var(--muted-foreground)",
            fontVariantNumeric: "tabular-nums",
            flexShrink: 0,
          }}
        >
          {step.elapsed ?? (isActive ? "…" : "—")}
        </span>
        <svg
          style={{
            width: 12,
            height: 12,
            color: "var(--muted-foreground)",
            transition: "transform 200ms ease",
            transform: step.open ? "rotate(90deg)" : "none",
            flexShrink: 0,
          }}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m9 18 6-6-6-6" />
        </svg>
      </div>

      {/* Body (expandable) */}
      <div
        style={{
          overflow: "hidden",
          maxHeight: step.open ? 600 : 0,
          marginTop: step.open ? 10 : 0,
          padding: step.open ? "12px 14px" : "0 14px",
          background: "color-mix(in oklch, var(--muted) 60%, var(--background))",
          border: step.open ? "1px solid var(--border)" : "0px solid var(--border)",
          borderRadius: "calc(var(--radius) * 0.8)",
          transition:
            "max-height 280ms ease, padding 200ms ease, border-width 200ms ease, margin 200ms ease",
          fontSize: 13,
          color: "var(--muted-foreground)",
          fontStyle: "italic",
          lineHeight: 1.6,
        }}
      >
        {step.title}
      </div>
    </div>
  );
}

// ---- Message pair renderer ----

function ThreadPair({
  userMsg,
  assistantMsg,
  sessionStarted,
  onToggleStep,
  isFirst,
}: {
  userMsg: ChatMessage;
  assistantMsg?: ChatMessage;
  sessionStarted: Date;
  onToggleStep: (msgId: string, stepId: string) => void;
  isFirst: boolean;
}) {
  const stepCount = assistantMsg?.steps.length ?? 0;
  const _sourcesCount = 0; // server doesn't provide sources yet
  const timeLabel = (() => {
    if (!assistantMsg?.steps.length) return null;
    const first = assistantMsg.steps[0]?.startedAt;
    const last = assistantMsg.steps.findLast((s) => s.elapsed)?.startedAt;
    if (!first || !last) return null;
    const ms = last - first;
    if (ms < 1000) return null;
    const secs = Math.round(ms / 1000);
    return secs < 60 ? `${secs} s` : `${Math.floor(secs / 60)} m ${secs % 60} s`;
  })();

  return (
    <div style={{ marginBottom: isFirst ? 0 : 48 }}>
      {/* Query heading */}
      <h1
        style={
          {
            fontFamily: "var(--font-heading)",
            fontWeight: 400,
            fontSize: 38,
            lineHeight: 1.2,
            letterSpacing: "-0.015em",
            margin: "0 0 10px",
            textWrap: "pretty",
            color: "var(--foreground)",
          } as React.CSSProperties
        }
      >
        {userMsg.text}
      </h1>

      {/* Query meta */}
      {assistantMsg && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            color: "var(--muted-foreground)",
            fontSize: "12.5px",
            marginBottom: 26,
          }}
        >
          <span
            className="pill primary"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "3px 9px 3px 8px",
              borderRadius: 999,
              background: "color-mix(in oklch, var(--primary) 18%, transparent)",
              border: "1px solid color-mix(in oklch, var(--primary) 35%, var(--border))",
              color: "color-mix(in oklch, var(--primary) 30%, var(--foreground))",
              fontSize: 12,
              fontWeight: 500,
            }}
          >
            <IconSparkles style={{ width: 12, height: 12 }} />
            Deep Research
          </span>
          {stepCount > 0 && (
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "3px 9px 3px 8px",
                borderRadius: 999,
                background: "var(--muted)",
                border: "1px solid var(--border)",
                color: "var(--foreground)",
                fontSize: 12,
                fontWeight: 500,
              }}
            >
              <IconSearch style={{ width: 12, height: 12 }} />
              {stepCount} {stepCount === 1 ? "step" : "steps"}
            </span>
          )}
          {timeLabel && (
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "3px 9px 3px 8px",
                borderRadius: 999,
                background: "var(--muted)",
                border: "1px solid var(--border)",
                color: "var(--foreground)",
                fontSize: 12,
                fontWeight: 500,
              }}
            >
              {timeLabel}
            </span>
          )}
          <span style={{ marginLeft: "auto" }} />
          <span style={{ fontSize: 12, color: "var(--muted-foreground)" }}>
            {sessionStarted.toLocaleDateString(undefined, { month: "short", day: "numeric" })} ·{" "}
            {sessionStarted.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })}
          </span>
        </div>
      )}

      {/* Reasoning steps */}
      {assistantMsg && assistantMsg.steps.length > 0 && (
        <>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              margin: "30px 0 14px",
            }}
          >
            <h2
              style={{
                fontFamily: "var(--font-sans)",
                fontWeight: 600,
                fontSize: 13,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: "var(--muted-foreground)",
                margin: 0,
              }}
            >
              Reasoning
            </h2>
            <span
              style={{
                fontSize: 12,
                color: "var(--muted-foreground)",
                background: "var(--muted)",
                border: "1px solid var(--border)",
                padding: "1px 7px",
                borderRadius: 999,
              }}
            >
              {stepCount} {stepCount === 1 ? "step" : "steps"}
            </span>
            <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
          </div>

          <div style={{ position: "relative" }}>
            {/* Left connector spine */}
            <div
              style={{
                position: "absolute",
                left: 10,
                top: 8,
                bottom: 8,
                width: 1,
                background:
                  "linear-gradient(to bottom, var(--border) 0%, var(--border) 92%, transparent)",
                pointerEvents: "none",
              }}
            />
            {assistantMsg.steps.map((step, i) => (
              <StepItem
                key={step.id}
                step={step}
                isLast={i === assistantMsg.steps.length - 1}
                onToggle={() => onToggleStep(assistantMsg.id, step.id)}
              />
            ))}
          </div>
        </>
      )}

      {/* Answer section */}
      {assistantMsg && (assistantMsg.text || assistantMsg.isStreaming) && (
        <>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              margin: "30px 0 14px",
            }}
          >
            <h2
              style={{
                fontFamily: "var(--font-sans)",
                fontWeight: 600,
                fontSize: 13,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: "var(--muted-foreground)",
                margin: 0,
              }}
            >
              Answer
            </h2>
            <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
          </div>

          <article
            style={{
              fontSize: "15.5px",
              lineHeight: 1.65,
              color: "var(--foreground)",
            }}
          >
            {assistantMsg.text ? (
              <div className="prose prose-sm dark:prose-invert max-w-none prose-p:my-3 prose-headings:mt-6 prose-headings:mb-2 prose-headings:font-semibold prose-headings:text-base prose-li:my-1 prose-code:text-xs prose-pre:text-xs prose-a:text-primary hover:prose-a:underline prose-li:marker:text-primary">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code(props) {
                      const { children, className, ...rest } = props;
                      const match = /language-(\w+)/.exec(className || "");
                      const isD3 = match?.[1] === "d3";

                      if (isD3) {
                        return (
                          <D3Renderer
                            code={String(children).replace(/\n$/, "")}
                            data={assistantMsg?.data}
                            className="my-6"
                          />
                        );
                      }

                      return (
                        <code {...rest} className={className}>
                          {children}
                        </code>
                      );
                    },
                  }}
                >
                  {assistantMsg.text}
                </ReactMarkdown>
              </div>
            ) : null}
            {assistantMsg.isStreaming && (
              <span
                style={{
                  display: "inline-block",
                  width: 6,
                  height: 14,
                  background: "var(--primary)",
                  marginLeft: 1,
                  verticalAlign: -2,
                  animation: "blink 900ms steps(2) infinite",
                }}
              />
            )}
          </article>
        </>
      )}

      {/* Insights visualization */}
      {assistantMsg && !assistantMsg.isStreaming &&
        /insight/i.test(userMsg.text) && (
        <D3Renderer code={INSIGHTS_D3_CODE} className="mt-8" />
      )}

      {/* Loading dots when streaming with no text yet */}
      {assistantMsg?.isStreaming && !assistantMsg.text && assistantMsg.steps.length === 0 && (
        <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 16 }}>
          {[0, 150, 300].map((delay) => (
            <span
              key={delay}
              style={{
                display: "inline-block",
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "var(--muted-foreground)",
                opacity: 0.6,
                animation: `bounce 1s ${delay}ms infinite`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ---- Main page ----

export default function ResearchPage() {
  const { data: authData } = authClient.useSession();
  const sessionTokenRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    sessionTokenRef.current = (authData as any)?.session?.token as string | undefined;
  }, [authData]);

  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const sessionsRef = useRef(sessions);

  useEffect(() => {
    sessionsRef.current = sessions;
  }, [sessions]);

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    });
  }, []);

  const activeSession = sessions.find((s) => s.id === activeSessionId) ?? null;

  const createNewSession = useCallback(() => {
    const id = genId();
    setSessions((prev) => [
      { id, title: "New Research", messages: [], createdAt: new Date(), startedAt: new Date() },
      ...prev,
    ]);
    setActiveSessionId(id);
  }, []);

  const updateAssistantMsg = useCallback(
    (sessionId: string, msgId: string, updater: (m: ChatMessage) => ChatMessage) => {
      setSessions((prev) =>
        prev.map((s) =>
          s.id === sessionId
            ? { ...s, messages: s.messages.map((m) => (m.id === msgId ? updater(m) : m)) }
            : s,
        ),
      );
    },
    [],
  );

  const toggleStep = useCallback(
    (msgId: string, stepId: string) => {
      setSessions((prev) =>
        prev.map((s) =>
          s.id !== activeSessionId
            ? s
            : {
                ...s,
                messages: s.messages.map((m) =>
                  m.id !== msgId
                    ? m
                    : {
                        ...m,
                        steps: m.steps.map((st) =>
                          st.id === stepId ? { ...st, open: !st.open } : st,
                        ),
                      },
                ),
              },
        ),
      );
    },
    [activeSessionId],
  );

  const sendMessage = useCallback(
    async (text: string, dataContext?: string, rawData?: any[]) => {
      let sessionId = activeSessionId;
      const prevMessages = sessionsRef.current.find((s) => s.id === sessionId)?.messages ?? [];

      if (!sessionId) {
        sessionId = genId();
        setSessions((prev) => [
          {
            id: sessionId!,
            title: text.slice(0, 60),
            messages: [],
            createdAt: new Date(),
            startedAt: new Date(),
          },
          ...prev,
        ]);
        setActiveSessionId(sessionId);
      }

      const prevData = prevMessages.findLast((m) => m.data)?.data;
      const currentRawData = rawData ?? prevData;

      const userMsgId = genId();
      const assistantMsgId = genId();

      setSessions((prev) =>
        prev.map((s) => {
          if (s.id !== sessionId) return s;
          return {
            ...s,
            title: s.messages.length === 0 ? text.slice(0, 60) : s.title,
            messages: [
              ...s.messages,
              {
                id: userMsgId,
                role: "user",
                text,
                steps: [],
                isStreaming: false,
                data: currentRawData,
                dataContext,
              },
              {
                id: assistantMsgId,
                role: "assistant",
                text: "",
                steps: [],
                isStreaming: true,
                data: currentRawData,
              },
            ],
          };
        }),
      );

      setIsStreaming(true);
      scrollToBottom();

      const controller = new AbortController();
      abortRef.current = controller;

      const apiMessages = [
        ...prevMessages.map((m) => ({
          id: m.id,
          role: m.role,
          parts: [
            { type: "text" as const, text: m.text },
            ...(m.dataContext ? [{ type: "text" as const, text: m.dataContext }] : []),
          ],
        })),
        {
          id: userMsgId,
          role: "user" as const,
          parts: [
            { type: "text" as const, text },
            ...(dataContext ? [{ type: "text" as const, text: dataContext }] : []),
          ],
        },
      ];

      try {
        const token = sessionTokenRef.current;
        const response = await fetch(`${env.NEXT_PUBLIC_SERVER_URL}/api/chat`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ messages: apiMessages }),
          credentials: "include",
          signal: controller.signal,
        });

        if (!response.ok) {
          const isAuth = response.status === 401;
          throw new Error(
            isAuth ? "Not authenticated. Please sign in." : `Request failed (${response.status})`,
          );
        }

        const stepTimers = new Map<string, number>();

        for await (const chunk of parseSSE(response)) {
          if (chunk.type === "text-delta") {
            updateAssistantMsg(sessionId!, assistantMsgId, (m) => ({
              ...m,
              text: m.text + (chunk as any).delta,
            }));
            scrollToBottom();
          } else if (chunk.type === "tool-input-available") {
            const c = chunk as {
              type: "tool-input-available";
              toolCallId: string;
              toolName: string;
            };
            const { title, detail } = toolToStep(c.toolName);
            const stepId = genId();
            const now = Date.now();
            stepTimers.set(c.toolCallId, now);
            updateAssistantMsg(sessionId!, assistantMsgId, (m) => ({
              ...m,
              steps: [
                ...m.steps,
                {
                  id: stepId,
                  toolCallId: c.toolCallId,
                  state: "active",
                  title,
                  detail,
                  startedAt: now,
                  open: false,
                },
              ],
            }));
          } else if (chunk.type === "tool-output-available") {
            const c = chunk as { type: "tool-output-available"; toolCallId: string };
            const startedAt = stepTimers.get(c.toolCallId);
            const elapsed = startedAt ? formatElapsed(Date.now() - startedAt) : undefined;
            updateAssistantMsg(sessionId!, assistantMsgId, (m) => ({
              ...m,
              steps: m.steps.map((st) =>
                st.toolCallId === c.toolCallId ? { ...st, state: "done" as const, elapsed } : st,
              ),
            }));
          } else if (chunk.type === "error") {
            throw new Error((chunk as any).errorText ?? "Stream error");
          }
        }

        updateAssistantMsg(sessionId!, assistantMsgId, (m) => ({ ...m, isStreaming: false }));
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") return;
        const msg = err instanceof Error ? err.message : "An error occurred. Please try again.";
        updateAssistantMsg(sessionId!, assistantMsgId, (m) => ({
          ...m,
          text: msg,
          isStreaming: false,
        }));
      } finally {
        setIsStreaming(false);
        abortRef.current = null;
        scrollToBottom();
      }
    },
    [activeSessionId, updateAssistantMsg, scrollToBottom],
  );

  // Pair messages: user[i] + assistant[i+1]
  const messagePairs = (() => {
    const msgs = activeSession?.messages ?? [];
    const pairs: { user: ChatMessage; assistant?: ChatMessage }[] = [];
    for (let i = 0; i < msgs.length; i += 2) {
      if (msgs[i]?.role === "user") {
        pairs.push({ user: msgs[i], assistant: msgs[i + 1] });
      }
    }
    return pairs;
  })();

  const hasMessages = messagePairs.length > 0;

  // Thread ID from session
  const threadId = activeSession?.id.slice(0, 4).toUpperCase() ?? "";

  const user = (authData as any)?.user;
  const userName = user?.name ?? user?.email ?? "User";
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "240px 1fr",
        alignItems: "stretch",
        height: "100%",
        background: "var(--background)",
        color: "var(--foreground)",
        fontSize: 14,
        lineHeight: 1.55,
        fontFamily: "var(--font-sans)",
      }}
    >
      <ResearchSidebar
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectSession={setActiveSessionId}
        onNewSession={createNewSession}
        userName={userName}
        userInitial={userInitial}
      />

      <main
        ref={scrollRef}
        style={{
          height: "100%",
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        <div
          style={{
            maxWidth: 920,
            width: "100%",
            margin: "0 auto",
            padding: "32px 40px 160px",
          }}
        >
        {!hasMessages ? (
          /* ---- Empty state ---- */
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "60vh",
              textAlign: "center",
              gap: 24,
            }}
          >
            <div
              style={{
                position: "relative",
                width: 96,
                height: 96,
                display: "grid",
                placeItems: "center",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: "50%",
                  border: "1px dashed color-mix(in oklch, var(--primary) 40%, var(--border))",
                  animation: "rotate 24s linear infinite",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 14,
                  borderRadius: "50%",
                  border: "1px solid color-mix(in oklch, var(--primary) 30%, var(--border))",
                  animation: "rotate 16s linear infinite reverse",
                }}
              />
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  background: "var(--primary)",
                  color: "var(--primary-foreground)",
                  display: "grid",
                  placeItems: "center",
                  boxShadow:
                    "0 0 0 6px color-mix(in oklch, var(--primary) 18%, transparent), 0 8px 24px -8px color-mix(in oklch, var(--primary) 60%, transparent)",
                  animation: "pop 520ms cubic-bezier(.34,1.56,.64,1) both",
                }}
              >
                <IconSparkles style={{ width: 28, height: 28 }} />
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <h1
                style={{
                  fontFamily: "var(--font-heading)",
                  fontWeight: 400,
                  fontSize: 36,
                  lineHeight: 1.1,
                  letterSpacing: "-0.015em",
                  margin: 0,
                  color: "var(--foreground)",
                }}
              >
                Research{" "}
                <em
                  style={{
                    fontStyle: "italic",
                    color: "color-mix(in oklch, var(--primary) 75%, var(--foreground))",
                  }}
                >
                  Agent
                </em>
              </h1>
              <p
                style={
                  {
                    color: "var(--muted-foreground)",
                    fontSize: 15,
                    lineHeight: 1.55,
                    margin: 0,
                    textWrap: "pretty",
                  } as React.CSSProperties
                }
              >
                Ask anything — the agent searches datasets, the web, and runs deep research.
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* ---- Topbar ---- */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                paddingBottom: 24,
                marginBottom: 24,
                borderBottom: "1px solid var(--border)",
              }}
            >
              <div
                style={{
                  fontSize: 13,
                  color: "var(--muted-foreground)",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                Research
                <IconChevronRight style={{ width: 12, height: 12, opacity: 0.6 }} />
                <span style={{ color: "var(--foreground)", fontWeight: 500 }}>
                  Thread #{threadId}
                </span>
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                {[
                  { icon: <IconShare style={{ width: 14, height: 14 }} />, title: "Share" },
                  { icon: <IconUpload style={{ width: 14, height: 14 }} />, title: "Export" },
                  { icon: <IconDots style={{ width: 14, height: 14 }} />, title: "More" },
                ].map(({ icon, title }) => (
                  <button
                    key={title}
                    title={title}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "calc(var(--radius) * 0.6)",
                      border: "1px solid var(--border)",
                      background: "var(--card)",
                      color: "var(--muted-foreground)",
                      display: "grid",
                      placeItems: "center",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background = "var(--muted)";
                      (e.currentTarget as HTMLButtonElement).style.color = "var(--foreground)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background = "var(--card)";
                      (e.currentTarget as HTMLButtonElement).style.color =
                        "var(--muted-foreground)";
                    }}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            {/* ---- Thread message pairs ---- */}
            <div>
              {messagePairs.map((pair, idx) => (
                <ThreadPair
                  key={pair.user.id}
                  userMsg={pair.user}
                  assistantMsg={pair.assistant}
                  sessionStarted={activeSession?.startedAt ?? new Date()}
                  onToggleStep={toggleStep}
                  isFirst={idx === 0}
                />
              ))}
            </div>
          </>
        )}
        </div>
      </main>

      {/* ---- Composer ---- */}
      <ResearchInput
        onSubmit={sendMessage}
        onStop={() => abortRef.current?.abort()}
        disabled={isStreaming}
        placeholder={hasMessages ? "Ask a follow-up…" : "Ask anything to start researching…"}
      />

      {/* ---- Keyframes ---- */}
      <style>{`
        @keyframes rotate { to { transform: rotate(360deg); } }
        @keyframes pop {
          from { opacity: 0; transform: scale(0.4); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes ping {
          0%   { transform: scale(0.8); opacity: 0.9; }
          100% { transform: scale(1.6); opacity: 0; }
        }
        @keyframes blink { 50% { opacity: 0; } }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-4px); }
        }
      `}</style>
    </div>
  );
}

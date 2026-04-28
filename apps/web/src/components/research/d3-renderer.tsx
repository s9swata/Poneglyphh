"use client";

import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

interface D3RendererProps {
  code: string;
  data?: any[];
  className?: string;
}

/**
 * Safely executes AI-generated D3.js code in an isolated scope.
 *
 * Injected variables available to the generated code:
 *   d3        — the full D3 library
 *   container — the live DOM div to append SVG/canvas into
 *   width     — container pixel width
 *   height    — container pixel height (min 400)
 *   data      — the dataset array passed via props (may be empty)
 */
export function D3Renderer({ code, data, className }: D3RendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  // Incrementing this token causes the render effect to re-run (used by ResizeObserver)
  const [renderToken, setRenderToken] = useState(0);

  // Main render effect — runs when code, data, or container size changes
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    el.innerHTML = "";
    setError(null);

    try {
      const width = el.clientWidth || 600;
      const height = Math.max(el.clientHeight, 400);

      // Wrap user code in a function with injected scope variables.
      // chart/svg/g are pre-declared as params so AI code that references
      // them without declaring gets a valid (null) binding instead of a
      // ReferenceError. The inner `{}` block lets AI code re-declare these
      // with const/let (shadowing the param) without a conflict.
      const run = new Function(
        "d3",
        "container",
        "width",
        "height",
        "data",
        "chart",
        "svg",
        "g",
        `{
        ${code}
      }`,
      );
      run(d3, el, width, height, data ?? [], null, null, null);
    } catch (err: any) {
      console.error("D3 execution error:", err);
      setError(err?.message ?? "Failed to render chart");
    }
    // renderToken is included so ResizeObserver can trigger a re-render
  }, [code, data, renderToken]);

  // Resize observer — increments renderToken when the container changes size
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new ResizeObserver(() => {
      setRenderToken((t) => t + 1);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className={`relative w-full ${className ?? ""}`}>
      <div
        ref={containerRef}
        className="w-full overflow-hidden rounded-xl"
        style={{
          minHeight: "420px",
          background: "var(--card)",
          border: "1px solid var(--border)",
          boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px -4px rgba(0,0,0,0.08)",
          padding: "20px",
        }}
      />
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-lg p-6 text-center">
          <div className="max-w-md">
            <p className="text-destructive font-medium mb-2">Visualization Error</p>
            <p className="text-xs text-muted-foreground font-mono break-all">{error}</p>
            <button
              onClick={() => setRenderToken((t) => t + 1)}
              className="mt-4 text-xs underline text-primary hover:no-underline"
            >
              Try Re-rendering
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

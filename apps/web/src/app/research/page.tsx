"use client";

import { useState, useRef, useEffect } from "react";
import { Search, Send, Loader2 } from "lucide-react";
import { ChatSidebar } from "@/components/chat-sidebar";
import { ResearchNav } from "@/components/research/research-nav";
import {
  CustomBarChart,
  CustomDonutChart,
  CustomAreaChart,
} from "@/components/research/research-charts";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  charts?: ChartData[];
  sources?: { title: string; url: string }[];
}

interface ChartData {
  type: "bar" | "donut" | "area";
  title: string;
  data: { name: string; value: number; color?: string }[];
}

export default function ResearchPage() {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading, mounted]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isLoading) return;

    const userMessage: Message = { id: Date.now().toString(), role: "user", content: query };
    setMessages((prev) => [...prev, userMessage]);
    setQuery("");
    setIsLoading(true);

    try {
      const response = await fetch(
        `http://localhost:3001/api/query?q=${encodeURIComponent(query)}`,
      );
      const data = await response.json();
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.answer,
        charts: data.charts,
        sources: data.sources,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "Sorry, I couldn't fetch the data. Please make sure the API server is running.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted) {
    return (
      <div className="flex flex-col h-screen">
        <ResearchNav />
        <div className="flex flex-1">
          <ChatSidebar />
          <div className="flex-1 flex items-center justify-center bg-white">
            <div className="w-6 h-6 border-2 border-grey-3 border-t-black rounded-full animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <ResearchNav />
      <div className="flex flex-1 h-[calc(100vh-56px)] overflow-hidden">
        <ChatSidebar />
        <div className="flex-1 flex flex-col bg-white overflow-hidden">
          <div className="flex-1 overflow-y-auto px-6 py-4">
            <div className="max-w-2xl mx-auto h-full">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-20">
                  <h2 className="text-[clamp(36px,6vw,56px)] font-medium leading-tight tracking-tight text-black mb-6">
                    Ask anything about{" "}
                    <span style={{ color: "#bfff00" }}>human trafficking data</span>
                  </h2>
                  <p className="text-base text-grey-1 mb-10 max-w-lg">
                    Query our open commons of 156,000+ victim records, 189 countries, and CTDC
                    global data.
                  </p>
                  <div className="flex flex-wrap gap-3 justify-center max-w-xl">
                    {[
                      "Victims by region",
                      "Exploitation types",
                      "Children trafficked",
                      "Top countries of origin",
                    ].map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => setQuery(suggestion)}
                        className="px-5 py-3 text-sm text-black bg-grey-4 border border-grey-3 rounded-full hover:border-grey-2 hover:bg-white transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-6 pb-20">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={
                        message.role === "user" ? "flex justify-end" : "flex flex-col gap-4"
                      }
                    >
                      <div
                        className={
                          message.role === "user"
                            ? "max-w-[80%] px-4 py-3 bg-black text-white rounded-2xl rounded-br-sm text-sm"
                            : "text-base text-black leading-relaxed"
                        }
                      >
                        {message.content}
                      </div>
                      {message.role === "assistant" &&
                        message.charts?.map((chart, i) => (
                          <div key={i} className="p-5 bg-grey-4 rounded-lg">
                            {chart.type === "bar" && (
                              <CustomBarChart data={chart.data} title={chart.title} />
                            )}
                            {chart.type === "donut" && (
                              <CustomDonutChart data={chart.data} title={chart.title} />
                            )}
                            {chart.type === "area" && (
                              <CustomAreaChart data={chart.data} title={chart.title} />
                            )}
                          </div>
                        ))}
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex items-center gap-1 ml-4">
                      <span className="w-1.5 h-1.5 bg-grey-2 rounded-full animate-pulse" />
                      <span
                        className="w-1.5 h-1.5 bg-grey-2 rounded-full animate-pulse"
                        style={{ animationDelay: "0.15s" }}
                      />
                      <span
                        className="w-1.5 h-1.5 bg-grey-2 rounded-full animate-pulse"
                        style={{ animationDelay: "0.3s" }}
                      />
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>
          </div>
          <div className="px-6 py-4 border-t border-grey-3 bg-white">
            <div className="max-w-2xl mx-auto">
              <form
                onSubmit={handleSubmit}
                className="flex items-center gap-3 bg-white border border-grey-3 rounded-lg p-3 focus-within:border-grey-2 transition-colors shadow-sm"
              >
                <Search size={18} className="text-grey-2 shrink-0 ml-1" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Ask about trafficking data..."
                  className="flex-1 text-base bg-transparent outline-none text-black placeholder:text-grey-2"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={!query.trim() || isLoading}
                  className="p-2 bg-black text-white rounded hover:bg-black/80 transition-colors"
                >
                  {isLoading ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Search, Loader2 } from "lucide-react";
import { Highlight, HeroTag } from "@/components/cards";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";

// Modularized components
import { SearchResults } from "@/components/home/search-results";
import { HeroDashboard } from "@/components/home/hero-dashboard";
import { IntelligenceReports } from "@/components/home/intelligence-reports";
import { TrustTicker } from "@/components/home/trust-ticker";
import { AnalyticsTabsUI } from "@/components/home/analytics-tabs";
import { LiveFeedPanel } from "@/components/home/live-feed-panel";
import { ImpactHeatmap } from "@/components/home/impact-heatmap";
import { AiAnalysisViz } from "@/components/home/ai-analysis-viz";
import { ByTheNumbers } from "@/components/home/by-the-numbers";

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchData, setSearchData] = useState<any[]>([]);

  const showResults = hasSearched && searchQuery.trim().length > 0;

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    setHasSearched(true);
    try {
      const response = await fetch(
        `http://localhost:3001/api/query?q=${encodeURIComponent(searchQuery)}`,
      );
      const data = await response.json();
      setSearchData(data.charts || []);
    } catch (err) {
      console.error(err);
      setSearchData([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setHasSearched(false);
  };

  return (
    <>
      <Navigation />

      {/* ══ HERO ══ */}
      <section className="relative overflow-hidden bg-white">
        <div className="absolute inset-0 dots-pattern pointer-events-none" aria-hidden />
        <div className="container-max pt-24 pb-12 flex flex-col items-center gap-8 text-center relative z-10">
          <HeroTag label="New" text="Agentic research now live — try it at /research" />
          <h1 className="text-[clamp(44px,7vw,80px)] font-medium leading-[1.05em] tracking-[-0.03em] text-black">
            The world's humanitarian
            <br />
            <Highlight>data commons</Highlight>
          </h1>
          <p className="text-body-lg text-grey-1 max-w-md">
            NGOs upload field data. AI extracts insights. Researchers, journalists, and task forces
            access them — free, open, and actionable.
          </p>

          <form onSubmit={handleSearch} className="w-full max-w-xl">
            <div className="flex items-center gap-2 bg-white border border-grey-3 rounded-xl p-2 shadow-sm focus-within:border-grey-2 transition-colors">
              <Search size={20} className="text-grey-2 shrink-0 ml-1" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for data (e.g., 'crimes by region', 'exploitation types')..."
                className="flex-1 text-base bg-transparent outline-none text-black placeholder:text-grey-2"
              />
              <button
                type="submit"
                disabled={!searchQuery.trim() || isSearching}
                className="px-4 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-black/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSearching ? <Loader2 size={14} className="animate-spin" /> : "Search"}
              </button>
            </div>
          </form>

          {showResults && !isSearching && (
            <div className="w-full">
              <SearchResults query={searchQuery} results={searchData} />
              <button
                onClick={handleClearSearch}
                className="mt-6 text-sm text-grey-1 hover:text-black underline"
              >
                Clear search
              </button>
            </div>
          )}

          {!showResults && (
            <div className="flex items-center gap-3">
              <Link
                href="/research"
                className="px-5 py-2.5 border border-grey-3 text-black text-sm font-medium rounded-xl hover:bg-grey-4 transition-colors"
              >
                View insights
              </Link>
              <Link
                href="/contact"
                className="flex items-center gap-2 px-5 py-2.5 bg-black text-white text-sm font-medium rounded-xl hover:bg-black/80 transition-colors"
              >
                Submit your dataset <ArrowRight size={14} />
              </Link>
            </div>
          )}
        </div>
        {!showResults && (
          <div className="container-max pb-24 relative z-10">
            <HeroDashboard />
          </div>
        )}
      </section>

      {/* ══ LATEST STATISTICS ══ */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="container-max flex flex-col gap-10">
          <div className="flex flex-col items-center gap-3 text-center">
            <h2 className="text-[clamp(28px,4vw,44px)] font-medium leading-tight tracking-tight text-black">
              Latest Statistics
            </h2>
            <p className="text-body text-grey-1 max-w-lg">
              Explore dynamic articles and statistics on global exploitation, organized crime, and
              human trafficking networks.
            </p>
          </div>
          <div className="-mx-4 px-4 lg:mx-0 lg:px-0">
            <IntelligenceReports />
          </div>
        </div>
      </section>

      <TrustTicker />

      {/* ══ PLATFORM OVERVIEW ══ */}
      <section className="py-24 bg-white">
        <div className="container-max flex flex-col items-center gap-10">
          <div className="flex flex-col items-center gap-6 text-center">
            <h2 className="text-[clamp(32px,5vw,52px)] font-medium leading-tight tracking-tight text-black">
              All humanitarian data, one open <Highlight>platform</Highlight>
            </h2>
            <Link
              href="/contact"
              className="flex items-center gap-2 px-5 py-2.5 bg-black text-white text-sm font-medium rounded-xl hover:bg-black/80 transition-colors"
            >
              Request access <ArrowRight size={14} />
            </Link>
          </div>
          <AnalyticsTabsUI />
        </div>
      </section>

      {/* ══ LIVE FEED + HEATMAP ══ */}
      <section className="py-24 bg-white">
        <div className="container-max grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div className="bg-primary rounded-2xl p-6">
            <LiveFeedPanel />
          </div>
          <ImpactHeatmap />
        </div>
      </section>

      {/* ══ AI ANALYSIS ══ */}
      <section className="py-24 bg-grey-4">
        <div className="container-max flex flex-col items-center gap-12">
          <div className="flex flex-col items-center gap-3 text-center max-w-xl">
            <h2 className="text-[clamp(28px,4vw,44px)] font-medium tracking-tight text-black">
              Powered by field-aware intelligence
            </h2>
            <p className="text-body text-grey-1">
              Poneglyph agents process thousands of disparate reports to extract structured,
              actionable data points for task forces.
            </p>
          </div>
          <AiAnalysisViz />
        </div>
      </section>

      {/* ══ BY THE NUMBERS ══ */}
      <section className="py-24 bg-white">
        <div className="container-max flex flex-col gap-12">
          <ByTheNumbers />
        </div>
      </section>

      <Footer />
    </>
  );
}

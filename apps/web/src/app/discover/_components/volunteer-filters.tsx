"use client";

import { useCallback, useTransition, useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { IconSearch, IconTag } from "@tabler/icons-react";

export function VolunteerFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [cityInput, setCityInput] = useState(searchParams.get("city") ?? "");
  const [tagsInput, setTagsInput] = useState(searchParams.get("tags") ?? "");

  useEffect(() => {
    setCityInput(searchParams.get("city") ?? "");
    setTagsInput(searchParams.get("tags") ?? "");
  }, [searchParams]);

  const applyFilters = useCallback(
    (city: string, tags: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (city.trim()) {
        params.set("city", city.trim());
      } else {
        params.delete("city");
      }
      if (tags.trim()) {
        params.set("tags", tags.trim());
      } else {
        params.delete("tags");
      }
      params.set("page", "1");
      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`);
      });
    },
    [searchParams, pathname, router],
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      applyFilters(cityInput, tagsInput);
    }
  };

  const hasFilters = !!searchParams.get("city") || !!searchParams.get("tags");

  return (
    <div
      className={`flex flex-col sm:flex-row gap-3 ${isPending ? "opacity-70 pointer-events-none" : ""} transition-opacity duration-200`}
    >
      <div className="relative flex-1">
        <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <input
          type="text"
          placeholder="Filter by city..."
          value={cityInput}
          onChange={(e) => setCityInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => applyFilters(cityInput, tagsInput)}
          className="w-full pl-9 pr-3 py-2 text-sm bg-card border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-foreground placeholder:text-muted-foreground"
        />
      </div>

      <div className="relative flex-1">
        <IconTag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <input
          type="text"
          placeholder="Tags (comma-separated slugs)..."
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => applyFilters(cityInput, tagsInput)}
          className="w-full pl-9 pr-3 py-2 text-sm bg-card border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-foreground placeholder:text-muted-foreground"
        />
      </div>

      {hasFilters && (
        <button
          onClick={() => {
            setCityInput("");
            setTagsInput("");
            startTransition(() => {
              router.push(pathname);
            });
          }}
          className="px-4 py-2 text-sm font-medium text-muted-foreground bg-muted hover:bg-muted/80 rounded-lg transition-colors whitespace-nowrap"
        >
          Clear
        </button>
      )}
    </div>
  );
}

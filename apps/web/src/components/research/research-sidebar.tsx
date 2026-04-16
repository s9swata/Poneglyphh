import { IconLoader2, IconGitBranch } from "@tabler/icons-react";
import { Button } from "@Poneglyph/ui/components/button";

export function ResearchSidebar() {
  return (
    <aside className="w-[280px] border-r border-border flex flex-col shrink-0">
      {/* Header */}
      <div className="h-14 px-5 flex items-center shadow-none mb-2 border-b border-border">
        <h2 className="text-sm font-semibold tracking-tight text-foreground">
          Poneglyph
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto px-3 pb-4">
        {/* This Week */}
        <div className="mt-4 mb-2 px-2">
          <h3 className="text-xs font-semibold text-muted-foreground tracking-wide uppercase">
            This Week
          </h3>
        </div>

        <div className="space-y-0.5">
          <Button
            variant="secondary"
            className="w-full justify-start gap-3 px-3 h-10 shadow-sm border-border rounded-sm"
          >
            <IconGitBranch data-icon="inline-start" className="w-4 h-4" />
            <span className="truncate">Acme Research Dashboard</span>
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-start gap-3 px-3 h-10 group rounded-sm"
          >
            <IconLoader2
              data-icon="inline-start"
              className="w-4 h-4 text-muted-foreground/70 group-hover:text-muted-foreground"
            />
            <span className="truncate">Live Telemetry Pipeline</span>
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-start gap-3 px-3 h-10 group rounded-sm"
          >
            <IconGitBranch
              data-icon="inline-start"
              className="w-4 h-4 text-muted-foreground/70 group-hover:text-muted-foreground"
            />
            <span className="truncate">Zero-Downtime Deploys</span>
          </Button>
        </div>

        {/* This Month */}
        <div className="mt-8 mb-2 px-2">
          <h3 className="text-xs font-semibold text-muted-foreground tracking-wide uppercase">
            This Month
          </h3>
        </div>

        <div className="space-y-0.5">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 px-3 h-10 group rounded-sm"
          >
            <IconGitBranch
              data-icon="inline-start"
              className="w-4 h-4 text-muted-foreground/70 group-hover:text-muted-foreground"
            />
            <span className="truncate">Binary Protocol Parser</span>
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-start gap-3 px-3 h-10 group rounded-sm"
          >
            <IconGitBranch
              data-icon="inline-start"
              className="w-4 h-4 text-muted-foreground/70 group-hover:text-muted-foreground"
            />
            <span className="truncate">Edge Cache Invalidation</span>
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-start gap-3 px-3 h-10 group rounded-sm"
          >
            <IconGitBranch
              data-icon="inline-start"
              className="w-4 h-4 text-muted-foreground/70 group-hover:text-muted-foreground"
            />
            <span className="truncate">Auth Token Rotation</span>
          </Button>
        </div>
      </div>
    </aside>
  );
}

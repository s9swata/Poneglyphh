"use client";

import {
  IconInfinity,
  IconChevronDown,
  IconArrowUp,
} from "@tabler/icons-react";
import { Input } from "@Poneglyph/ui/components/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@Poneglyph/ui/components/dropdown-menu";
import { Button } from "@Poneglyph/ui/components/button";

export function ResearchInput() {
  return (
    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background via-background to-transparent pt-12">
      <div className="max-w-3xl mx-auto">
        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
          <Input
            type="text"
            placeholder="Add a follow up..."
            className="w-full bg-transparent px-4 pt-4 pb-3 h-auto text-sm text-foreground placeholder:text-muted-foreground outline-none border-none focus-visible:ring-0 focus-visible:border-none ring-0 shadow-none"
          />
          <div className="flex items-center justify-between px-3 pb-3">
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger className="gap-1.5 px-2.5 py-1.5 rounded-lg bg-muted hover:bg-muted/70 border border-border/80 text-xs font-medium text-muted-foreground transition-colors tracking-tight h-auto inline-flex items-center shrink-0 justify-center">
                  <IconInfinity className="w-3.5 h-3.5 opacity-70" />
                  Agent
                  <IconChevronDown className="w-3.5 h-3.5 opacity-60 ml-0.5" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-40">
                  <DropdownMenuItem>Agent Mode</DropdownMenuItem>
                  <DropdownMenuItem>Direct Mode</DropdownMenuItem>
                  <DropdownMenuItem>Vision Mode</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger className="gap-1 px-2.5 py-1.5 rounded-lg hover:bg-muted text-xs font-medium text-muted-foreground transition-colors tracking-tight h-auto inline-flex items-center shrink-0 justify-center">
                  Opus 4.6
                  <IconChevronDown className="w-3.5 h-3.5 opacity-60 ml-0.5" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
                  <DropdownMenuItem>Opus 4.6 (Best)</DropdownMenuItem>
                  <DropdownMenuItem>Sonnet 4.5 (Fast)</DropdownMenuItem>
                  <DropdownMenuItem>Haiku 4.1 (Compact)</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <Button
              size="icon-sm"
              variant="secondary"
              className="bg-muted flex items-center justify-center text-muted-foreground border border-border/50 hover:bg-muted/70"
            >
              <IconArrowUp className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

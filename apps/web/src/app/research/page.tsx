'use client';

import { IconPlayerPlay } from '@tabler/icons-react';
import { ResearchSidebar } from '@/components/research/research-sidebar';
import { ResearchChatMessage } from '@/components/research/research-chat-message';
import { ResearchStatusLog } from '@/components/research/research-status-log';
import { ResearchInput } from '@/components/research/research-input';

export default function ResearchPage() {
  return (
    <div className="flex h-screen bg-background text-foreground font-sans overflow-hidden">
      
      <ResearchSidebar />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        
        {/* Scrollable Conversation */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-8 pt-8 pb-32">
            
            <h1 className="text-lg font-medium mb-8">Acme Research Dashboard</h1>

            {/* Conversation Thread */}
            <div className="space-y-6">
              
              <ResearchChatMessage content="let's build a dashboard to make our research findings interactive" />

              <ResearchStatusLog>
                Explored 12 files, 4 searches
              </ResearchStatusLog>

              {/* Agent Text 1 */}
              <div className="px-1 text-[15px] leading-relaxed text-foreground">
                <p>On it. I'll build the dashboard using your theme config, wire up the research data, and add interactive charts with public access controls.</p>
              </div>

              <ResearchStatusLog>
                <div>Worked for 14m 22s</div>
                <div>Processed screen recording</div>
              </ResearchStatusLog>

              {/* Agent Text 2 */}
              <div className="px-1 text-[15px] leading-relaxed text-foreground">
                <p>Done! Here's a walkthrough of the dashboard.</p>
              </div>

              {/* Media Placeholder */}
              <div className="w-[85%] rounded-xl overflow-hidden border border-border/80 shadow-elevated relative bg-surface-200 mt-2">
                <div className="aspect-[16/10] bg-gradient-to-br from-surface-300 to-surface-200 opacity-60 w-full h-full" />
                
                {/* Fake App Window Header inside Video */}
                <div className="absolute top-0 left-0 right-0 h-10 border-b border-border/40 bg-surface-100/50 flex items-center px-4 gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-border/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-border/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-border/80" />
                </div>
                
                {/* Fake Sidebar inside Video */}
                <div className="absolute top-10 left-0 bottom-0 w-48 border-r border-border/40 bg-surface-100/30 p-4 space-y-3">
                  <div className="h-2 w-3/4 rounded-full bg-border/60" />
                  <div className="h-2 w-1/2 rounded-full bg-border/40" />
                  <div className="h-2 w-2/3 rounded-full bg-border/40" />
                  <div className="h-2 w-1/2 rounded-full bg-border/40" />
                </div>
                
                {/* Fake Main Content inside Video */}
                <div className="absolute top-10 left-48 right-0 bottom-0 p-6 space-y-4">
                  <div className="h-4 w-48 rounded-full bg-border/50" />
                  <div className="space-y-2 mt-8">
                    <div className="h-2 w-full rounded-full bg-border/30" />
                    <div className="h-2 w-11/12 rounded-full bg-border/30" />
                    <div className="h-2 w-full rounded-full bg-border/30" />
                    <div className="h-2 w-4/5 rounded-full bg-border/30" />
                    <div className="h-2 w-[95%] rounded-full bg-border/30" />
                    <div className="h-2 w-full rounded-full bg-border/30" />
                  </div>
                </div>

                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-background/80 shadow-elevated flex items-center justify-center backdrop-blur-md cursor-pointer hover:bg-background transition-colors border border-border">
                      <IconPlayerPlay className="w-6 h-6 text-foreground ml-1" fill="currentColor" />
                    </div>
                  </div>
              </div>

              {/* Summary Section */}
              <div className="px-1 mt-6">
                <h2 className="text-lg font-medium mb-2">Summary</h2>
                <p className="text-[15px] leading-relaxed text-foreground">
                  Built the interactive dashboard with realtime charts, data from Snowflake, and shadcn components. Deployed to staging via Vercel.
                </p>
              </div>

            </div>
          </div>
        </div>

        <ResearchInput />

      </main>

    </div>
  );
}
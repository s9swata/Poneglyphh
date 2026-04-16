import { Button } from "@Poneglyph/ui/components/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@Poneglyph/ui/components/card";
import { Badge } from "@Poneglyph/ui/components/badge";
import { Input } from "@Poneglyph/ui/components/input";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col items-center py-24 selection:bg-primary/40">
      <div className="w-full max-w-4xl px-8 flex flex-col gap-16">
        {/* Typography */}
        <section className="flex flex-col gap-4 text-center items-center">
          <Badge className="bg-primary text-primary-foreground border-border border">
            Design System
          </Badge>
          <h1 className="text-[72px] leading-[1.1] tracking-tight font-sans text-foreground">
            Aesthetic Engineered.
          </h1>
          <p className="text-[19.2px] font-serif font-medium leading-[1.5] text-muted-foreground w-full max-w-2xl mt-4">
            A study in warm minimalism meets code-editor elegance. The entire
            experience is built on a warm off-white canvas with dark warm-brown
            text that evokes old paper, ink, and craft.
          </p>
          <div className="flex items-center gap-4 mt-6">
            <Button size="lg">Start Building</Button>
            <Button size="lg" variant="ghost">
              View Documentation
            </Button>
          </div>
        </section>

        {/* Cards & Inputs */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16 w-full">
          <Card>
            <CardHeader>
              <CardTitle className="text-[22px] tracking-tight font-sans">
                AI Workspace
              </CardTitle>
              <CardDescription className="font-serif">
                This is a standard card component demonstrating the atmospheric
                shadow and warm border styles.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-sans font-medium uppercase tracking-widest text-muted-foreground/60">
                    API Key
                  </label>
                  <Input placeholder="sk-..." type="password" />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-border border-t">
              <Button variant="outline" size="sm">
                Cancel
              </Button>
              <Button size="sm">Save Configuration</Button>
            </CardFooter>
          </Card>

          {/* AI Timeline Component equivalent */}
          <Card className="bg-muted/30">
            <CardHeader>
              <CardTitle className="text-[22px] tracking-tight font-sans">
                Operation Log
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-6 relative before:content-[''] before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-px before:bg-border/70">
                <div className="flex items-start gap-4 relative z-10">
                  <div className="w-6 h-6 rounded-full bg-chart-1 border-[3px] border-muted shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-[13px] font-medium font-sans">
                      Thinking
                    </span>
                    <span className="text-[16px] font-sans text-muted-foreground">
                      Planning architecture shift...
                    </span>
                  </div>
                </div>
                <div className="flex items-start gap-4 relative z-10">
                  <div className="w-6 h-6 rounded-full bg-chart-2 border-[3px] border-muted shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-[13px] font-medium font-sans">
                      Grep
                    </span>
                    <span className="text-[16px] font-sans text-muted-foreground">
                      Searching for Tailwind configuration...
                    </span>
                  </div>
                </div>
                <div className="flex items-start gap-4 relative z-10">
                  <div className="w-6 h-6 rounded-full bg-chart-4 border-[3px] border-muted shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-[13px] font-medium font-sans">
                      Edit
                    </span>
                    <span className="font-mono text-[12px] bg-card p-3 border border-border shadow-sm rounded-md mt-2">
                      <span className="text-secondary-foreground">@theme</span>{" "}
                      inline {"{"} <br />
                      &nbsp;&nbsp;--tracking-hero: -2.16px;
                      <br />
                      {"}"}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}

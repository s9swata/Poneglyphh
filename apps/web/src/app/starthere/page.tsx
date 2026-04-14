import Link from "next/link";
import { ArrowRight, PlayCircle, BookOpen, Zap } from "lucide-react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";

const steps = [
  {
    step: "01",
    icon: Zap,
    title: "Create your account",
    description:
      "Sign up in under 2 minutes. Volunteers are always free. NGO plans include a 14-day free trial — no credit card required.",
    cta: "Start free",
    href: "/pricing",
  },
  {
    step: "02",
    icon: BookOpen,
    title: "Set up your profile or organization",
    description:
      "Volunteers: add your skills, availability, and causes you care about. NGOs: create your organization profile and add your first project.",
    cta: "View setup guide",
    href: "/blog",
  },
  {
    step: "03",
    icon: PlayCircle,
    title: "Let the matching begin",
    description:
      "Our AI starts working immediately — surfacing the best volunteer-to-project matches and generating your first impact analytics.",
    cta: "See how it works",
    href: "/feature",
  },
];

const resources = [
  { title: "Getting started as a volunteer", type: "Guide", readTime: "5 min" },
  { title: "Setting up your NGO on Poneglyph", type: "Tutorial", readTime: "10 min" },
  { title: "How volunteer matching works", type: "Video", readTime: "6 min" },
  { title: "Impact analytics — your first dashboard", type: "Guide", readTime: "8 min" },
  { title: "Integrating Poneglyph with Slack", type: "Tutorial", readTime: "6 min" },
  { title: "Coordinating volunteers across programs", type: "Guide", readTime: "12 min" },
];

export default function StartHerePage() {
  return (
    <>
      <Navigation />
      {/* ── Hero ── */}
      <section className="relative py-32 overflow-hidden">
        <div className="container-max flex flex-col items-center gap-6 text-center relative z-10">
          <p className="text-sub font-medium uppercase tracking-widest text-grey-1">start here</p>
          <h1 className="text-[clamp(40px,6vw,64px)] font-medium leading-tight tracking-tight text-black max-w-xl">
            Get up and running in minutes
          </h1>
          <p className="text-body text-grey-1 max-w-md">
            Everything you need to start using Poneglyph — guides, tutorials, and step-by-step
            walkthroughs for volunteers and NGOs.
          </p>
        </div>
      </section>

      {/* ── Steps ── */}
      <section className="py-24 bg-white">
        <div className="container-max flex flex-col gap-12">
          <div className="flex flex-col items-center gap-3 text-center">
            <h2 className="text-[clamp(28px,4vw,40px)] font-medium leading-tight tracking-tight text-black">
              Three steps to get started
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((s) => (
              <div
                key={s.step}
                className="flex flex-col gap-5 p-7 bg-grey-4 border border-grey-3 rounded-2xl"
              >
                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-medium text-grey-2 font-mono">{s.step}</span>
                  <div className="h-px flex-1 bg-grey-3" />
                </div>
                <div className="w-11 h-11 bg-white border border-grey-3 rounded-xl flex items-center justify-center">
                  <s.icon size={20} className="text-black" />
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="text-base font-medium text-black">{s.title}</h3>
                  <p className="text-sm text-grey-1 leading-relaxed">{s.description}</p>
                </div>
                <Link
                  href={s.href}
                  className="flex items-center gap-1.5 text-sm font-medium text-black hover:text-grey-1 transition-colors mt-auto"
                >
                  {s.cta} <ArrowRight size={14} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Resources ── */}
      <section className="py-24 bg-grey-4">
        <div className="container-max flex flex-col gap-10">
          <div className="flex flex-col gap-3">
            <p className="text-sub font-medium uppercase tracking-widest text-grey-1">resources</p>
            <h2 className="text-[clamp(24px,3vw,36px)] font-medium leading-tight tracking-tight text-black">
              Guides &amp; tutorials
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {resources.map((r) => (
              <Link
                key={r.title}
                href="/blog"
                className="flex flex-col gap-3 p-5 bg-white border border-grey-3 rounded-2xl hover:border-grey-2 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-medium uppercase tracking-widest text-grey-1 bg-grey-4 px-2 py-1 rounded-full">
                    {r.type}
                  </span>
                  <span className="text-xs text-grey-2">{r.readTime}</span>
                </div>
                <p className="text-sm font-medium text-black leading-snug">{r.title}</p>
                <span className="flex items-center gap-1 text-xs text-grey-1 mt-auto">
                  Read more <ArrowRight size={12} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}

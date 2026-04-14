import Link from "next/link";
import { ArrowRight, MapPin, Clock } from "lucide-react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";

const openings = [
  {
    title: "Senior Frontend Engineer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
  },
  {
    title: "AI/ML Engineer",
    department: "AI Research",
    location: "Remote",
    type: "Full-time",
  },
  {
    title: "Head of NGO Partnerships",
    department: "Partnerships",
    location: "Remote or London",
    type: "Full-time",
  },
  {
    title: "Senior Backend Engineer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
  },
  {
    title: "Impact & Data Analyst",
    department: "Analytics",
    location: "Remote",
    type: "Full-time",
  },
  {
    title: "Community Manager",
    department: "Community",
    location: "Remote",
    type: "Full-time",
  },
];

const values = [
  {
    title: "Mission-driven",
    description:
      "We measure success by real-world impact, not just product metrics. Every feature we ship should move resources toward people who need them.",
  },
  {
    title: "Remote-first",
    description:
      "Work from wherever you do your best thinking. We have been remote since day one and built our culture around it.",
  },
  {
    title: "Ownership culture",
    description:
      "Everyone owns their area. We trust our people to make the right calls — and we give them the context to do so.",
  },
  {
    title: "Radically transparent",
    description:
      "Open salaries, open roadmap, open decisions. If you need to guess what leadership is thinking, we have failed.",
  },
];

export default function CareersPage() {
  return (
    <>
      <Navigation />
      {/* ── Hero ── */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 dots-pattern pointer-events-none" aria-hidden />
        <div className="container-max flex flex-col items-center gap-6 text-center relative z-10">
          <p className="text-sub font-medium uppercase tracking-widest text-grey-1">careers</p>
          <h1 className="text-[clamp(40px,6vw,64px)] font-medium leading-tight tracking-tight text-black max-w-xl">
            Build technology that actually saves lives
          </h1>
          <p className="text-body text-grey-1 max-w-md">
            Join a team of engineers, researchers, and impact workers building the coordination
            layer the humanitarian sector has been missing.
          </p>
          <Link
            href="#openpositions"
            className="flex items-center gap-2 px-5 py-2.5 bg-primary text-black font-medium rounded-xl hover:bg-primary/80 transition-colors"
          >
            View open positions <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* ── Values ── */}
      <section className="py-24 bg-grey-4">
        <div className="container-max flex flex-col gap-12">
          <div className="flex flex-col items-center gap-4 text-center">
            <p className="text-sub font-medium uppercase tracking-widest text-grey-1">
              our culture
            </p>
            <h2 className="text-[clamp(28px,4vw,40px)] font-medium leading-tight tracking-tight text-black">
              How we work
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {values.map((v) => (
              <div
                key={v.title}
                className="bg-white border border-grey-3 rounded-2xl p-6 flex flex-col gap-3"
              >
                <h3 className="text-base font-medium text-black">{v.title}</h3>
                <p className="text-sm text-grey-1 leading-relaxed">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Open Positions ── */}
      <section id="openpositions" className="py-24 bg-white">
        <div className="container-max flex flex-col gap-10">
          <div className="flex flex-col gap-4">
            <p className="text-sub font-medium uppercase tracking-widest text-grey-1">
              open positions
            </p>
            <h2 className="text-[clamp(28px,4vw,40px)] font-medium leading-tight tracking-tight text-black">
              We&apos;re hiring
            </h2>
          </div>
          <div className="flex flex-col gap-3">
            {openings.map((job) => (
              <div
                key={job.title}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-white border border-grey-3 rounded-2xl hover:border-grey-1 transition-colors"
              >
                <div className="flex flex-col gap-1">
                  <p className="text-base font-medium text-black">{job.title}</p>
                  <p className="text-sm text-grey-1">{job.department}</p>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-grey-1">
                  <span className="flex items-center gap-1">
                    <MapPin size={12} />
                    {job.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={12} />
                    {job.type}
                  </span>
                </div>
                <Link
                  href="/contact"
                  className="flex items-center gap-1.5 text-sm font-medium text-black hover:text-grey-1 transition-colors whitespace-nowrap"
                >
                  Apply <ArrowRight size={14} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-4">
        <div className="max-w-container mx-auto">
          <div className="relative bg-black rounded-2xl px-8 py-20 flex flex-col items-center gap-8 overflow-hidden text-center">
            <div className="absolute inset-0 dots-pattern pointer-events-none" aria-hidden />
            <p className="text-sub font-medium uppercase tracking-widest text-grey-2 relative z-10">
              don&apos;t see your role?
            </p>
            <h2 className="text-[clamp(28px,4vw,48px)] font-medium leading-tight tracking-tight text-white relative z-10 max-w-md">
              Send us an open application
            </h2>
            <Link
              href="/contact"
              className="flex items-center gap-2 px-5 py-2.5 bg-primary text-black font-medium rounded-xl hover:bg-primary/80 transition-colors relative z-10"
            >
              Get in touch <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}

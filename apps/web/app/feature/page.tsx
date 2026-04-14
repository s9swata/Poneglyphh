import Link from "next/link";
import { ArrowRight, Zap, Users, FileText, BarChart3, Target, BookOpen } from "lucide-react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";

const features = [
  {
    icon: Zap,
    title: "AI Volunteer Matching",
    description:
      "Automatically match volunteers to NGO projects based on skills, availability, location, and impact fit. Cut coordination time by up to 70%.",
    details: [
      "Skill graph analysis",
      "Availability heatmap matching",
      "Impact compatibility scoring",
      "Bias-aware algorithms",
    ],
  },
  {
    icon: Users,
    title: "Multi-NGO Coordination",
    description:
      "Share volunteer pools across partner organizations. Coordinate joint programs without duplicating effort or losing data.",
    details: [
      "Cross-organization visibility",
      "Shared volunteer profiles",
      "Joint project management",
      "Role-based access control",
    ],
  },
  {
    icon: FileText,
    title: "Volunteer Data Management",
    description:
      "Volunteers upload skills, certifications, and availability. NGOs see a structured, searchable profile — no more emailed CVs.",
    details: [
      "Structured skill profiles",
      "Certification verification",
      "Availability calendar sync",
      "GDPR-compliant storage",
    ],
  },
  {
    icon: BarChart3,
    title: "Impact Analytics",
    description:
      "Real-time dashboards show volunteer hours, regional coverage, program outcomes, and resource gaps — all in one view.",
    details: [
      "Live impact metrics",
      "Regional heatmaps",
      "Program performance tracking",
      "Custom report builder",
    ],
  },
  {
    icon: Target,
    title: "AI Research Agents",
    description:
      "Sub-agents continuously analyze uploaded data, surface insights, flag under-resourced programs, and recommend reallocation actions.",
    details: [
      "Automated gap detection",
      "Resource allocation suggestions",
      "Trend analysis",
      "Alert system for critical shortfalls",
    ],
  },
  {
    icon: BookOpen,
    title: "Volunteer Onboarding",
    description:
      "Guided onboarding flows get volunteers mission-ready fast — with role-specific training paths and task briefings built in.",
    details: [
      "Custom onboarding flows",
      "Skill gap assessments",
      "Mission briefing templates",
      "Progress tracking",
    ],
  },
];

export default function FeaturePage() {
  return (
    <>
      <Navigation />
      {/* ── Hero ── */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 dots-pattern pointer-events-none" aria-hidden />
        <div className="container-max flex flex-col items-center gap-6 text-center relative z-10">
          <p className="text-sub font-medium uppercase tracking-widest text-grey-1">
            for volunteers
          </p>
          <h1 className="text-[clamp(40px,6vw,64px)] font-medium leading-tight tracking-tight text-black max-w-2xl">
            Everything you need to find your mission and make it count
          </h1>
          <p className="text-body text-grey-1 max-w-md">
            From profile creation to impact reporting — Poneglyph handles the full volunteer
            lifecycle in one place.
          </p>
          <div className="flex items-center gap-3">
            <Link
              href="/pricing"
              className="flex items-center gap-2 px-5 py-2.5 bg-primary text-black font-medium rounded-xl hover:bg-primary/80 transition-colors"
            >
              Get started free
            </Link>
            <Link
              href="/contact"
              className="flex items-center gap-2 px-5 py-2.5 border border-grey-3 text-black font-medium rounded-xl hover:bg-grey-4 transition-colors"
            >
              See a demo <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Feature grid ── */}
      <section className="py-24 bg-white">
        <div className="container-max grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="flex flex-col gap-5 p-7 bg-white border border-grey-3 rounded-2xl hover:border-grey-2 transition-colors"
            >
              <div className="w-11 h-11 bg-grey-4 rounded-xl flex items-center justify-center">
                <f.icon size={22} className="text-black" />
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-base font-medium text-black">{f.title}</h3>
                <p className="text-sm text-grey-1 leading-relaxed">{f.description}</p>
              </div>
              <ul className="flex flex-col gap-1.5">
                {f.details.map((d) => (
                  <li key={d} className="flex items-center gap-2 text-xs text-grey-1">
                    <div className="w-1 h-1 rounded-full bg-primary shrink-0" />
                    {d}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="py-24 px-4">
        <div className="max-w-container mx-auto">
          <div className="relative bg-black rounded-2xl px-8 py-20 flex flex-col items-center gap-8 overflow-hidden text-center">
            <div className="absolute inset-0 dots-pattern pointer-events-none" aria-hidden />
            <p className="text-sub font-medium uppercase tracking-widest text-grey-2 relative z-10">
              get started
            </p>
            <h2 className="text-[clamp(36px,5vw,60px)] font-medium leading-tight tracking-tight text-white relative z-10 max-w-xl">
              See Poneglyph in action
            </h2>
            <Link
              href="/contact"
              className="flex items-center gap-2 px-5 py-2.5 bg-primary text-black font-medium rounded-xl hover:bg-primary/80 transition-colors relative z-10"
            >
              Book a demo <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}

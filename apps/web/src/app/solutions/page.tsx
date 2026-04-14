import Link from "next/link";
import { ArrowRight, Heart, Globe, Building2 } from "lucide-react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";

const solutions = [
  {
    icon: Heart,
    audience: "Field Contributors",
    title: "Submit observations & field data",
    description:
      "Submit observations, incident reports, and field data. Your submissions become intelligence that helps the whole sector.",
    cta: "Start contributing",
    href: "/pricing",
  },
  {
    icon: Building2,
    audience: "Data-Contributing NGOs",
    title: "Centralize your reporting",
    description:
      "Centralize your reporting. AI cleans, tags, and indexes your submissions — and publishes trends back to you.",
    cta: "Connect your team",
    href: "/pricing",
  },
  {
    icon: Globe,
    audience: "Research Organizations",
    title: "Agentic research at scale",
    description:
      "Query 156,000+ records, commission agentic research runs, and access AI-generated briefings via our open API.",
    cta: "Access the terminal",
    href: "/contact",
  },
];

const useCases = [
  {
    title: "Real-time incident tracking",
    description:
      "Automatically merge qualitative field reports with quantitative incident data from multiple NGOs into one view.",
  },
  {
    title: "Longitudinal trend monitoring",
    description:
      "Use historical dataset trends to identify high-risk regions before criminal networks expand operations.",
  },
  {
    title: "Multi-source data fusion",
    description:
      "Let AI agents find hidden links between seemingly isolated incidents submitted by different agencies.",
  },
  {
    title: "AI-generated insight briefs",
    description:
      "Generate verified statistical reports on intervention outcomes for board members and global task forces.",
  },
  {
    title: "Data gap identification",
    description:
      "Discover missing regions or missing incident types automatically using AI, so you know where to deploy resources next.",
  },
  {
    title: "Campaign outcome measurement",
    description:
      "Measure the exact impact of your interventions by tracking intelligence trends before and after your campaigns.",
  },
];

export default function SolutionsPage() {
  return (
    <>
      <Navigation />
      {/* ── Hero ── */}
      <section className="relative py-32 overflow-hidden">
        <div className="container-max flex flex-col items-center gap-6 text-center relative z-10">
          <p className="text-sub font-medium uppercase tracking-widest text-grey-1">solutions</p>
          <h1 className="text-[clamp(40px,6vw,64px)] font-medium leading-tight tracking-tight text-black max-w-2xl">
            Open data intelligence for everyone who fights exploitation.
          </h1>
          <p className="text-body text-grey-1 max-w-md">
            Whether you collect data in the field or analyze it from a desk — Poneglyph is your
            platform.
          </p>
        </div>
      </section>

      {/* ── Solution Cards ── */}
      <section className="py-24 bg-white">
        <div className="container-max grid grid-cols-1 md:grid-cols-3 gap-6">
          {solutions.map((s) => (
            <div
              key={s.audience}
              className="flex flex-col gap-6 p-8 bg-grey-4 border border-grey-3 rounded-2xl"
            >
              <div className="flex flex-col gap-3">
                <div className="w-10 h-10 bg-white border border-grey-3 rounded-xl flex items-center justify-center">
                  <s.icon size={20} className="text-black" />
                </div>
                <p className="text-sub font-medium uppercase tracking-widest text-grey-1">
                  {s.audience}
                </p>
              </div>
              <div className="flex flex-col gap-3 flex-1">
                <h2 className="text-xl font-medium text-black leading-snug">{s.title}</h2>
                <p className="text-sm text-grey-1 leading-relaxed flex-1">{s.description}</p>
              </div>
              <Link
                href={s.href}
                className="flex items-center gap-2 text-sm font-medium text-black hover:text-grey-1 transition-colors"
              >
                {s.cta} <ArrowRight size={14} />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ── Use Cases ── */}
      <section className="py-24 bg-grey-4">
        <div className="container-max flex flex-col gap-12">
          <div className="flex flex-col items-center gap-4 text-center">
            <p className="text-sub font-medium uppercase tracking-widest text-grey-1">use cases</p>
            <h2 className="text-[clamp(28px,4vw,40px)] font-medium leading-tight tracking-tight text-black">
              What intelligence teams use Poneglyph for
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {useCases.map((uc) => (
              <div
                key={uc.title}
                className="flex flex-col gap-3 p-6 bg-white border border-grey-3 rounded-2xl"
              >
                <h3 className="text-base font-medium text-black">{uc.title}</h3>
                <p className="text-sm text-grey-1 leading-relaxed">{uc.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-4">
        <div className="max-w-container mx-auto">
          <div className="relative bg-black rounded-2xl px-8 py-20 flex flex-col items-center gap-8 overflow-hidden text-center">
            <p className="text-sub font-medium uppercase tracking-widest text-grey-2 relative z-10">
              ready to start?
            </p>
            <h2 className="text-[clamp(36px,5vw,60px)] font-medium leading-tight tracking-tight text-white relative z-10 max-w-xl">
              Find the right plan for your organization
            </h2>
            <div className="flex items-center gap-3 relative z-10">
              <Link
                href="/pricing"
                className="flex items-center gap-2 px-5 py-2.5 bg-primary text-black font-medium rounded-xl hover:bg-primary/80 transition-colors"
              >
                View pricing <ArrowRight size={16} />
              </Link>
              <Link
                href="/contact"
                className="flex items-center gap-2 px-5 py-2.5 bg-white/10 text-white font-medium rounded-xl hover:bg-white/20 transition-colors"
              >
                Talk to us
              </Link>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}

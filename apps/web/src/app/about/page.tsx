import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Linkedin, Mail } from "lucide-react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { LogoTicker } from "@/components/shared/logo-ticker";

const team = [
  {
    name: "Amara Osei",
    role: "Founder & CEO",
    linkedin: "https://linkedin.com",
    email: "mailto:hello@poneglyph.io",
    initials: "AO",
    image: "avatar-amara.png",
  },
  {
    name: "Priya Sharma",
    role: "Co-founder & CTO",
    linkedin: "https://linkedin.com",
    email: "mailto:hello@poneglyph.io",
    initials: "PS",
    image: "avatar-priya.png",
  },
  {
    name: "Lucas Mendes",
    role: "Head of Product",
    linkedin: "https://linkedin.com",
    initials: "LM",
    image: "avatar-lucas.png",
  },
  {
    name: "Fatima Al-Rashid",
    role: "Head of AI Research",
    linkedin: "https://linkedin.com",
    email: "mailto:hello@poneglyph.io",
    initials: "FA",
    image: "avatar-fatima.png",
  },
  {
    name: "James Okonkwo",
    role: "Founding Engineer",
    linkedin: "https://linkedin.com",
    email: "mailto:hello@poneglyph.io",
    initials: "JO",
    image: "avatar-james.png",
  },
];

export default function AboutPage() {
  return (
    <>
      <Navigation />
      <section className="relative overflow-hidden py-40 flex items-center justify-center">
        <div className="absolute inset-0 dots-pattern pointer-events-none" aria-hidden />
        <div className="container-max relative z-10 text-center">
          <h1 className="text-[clamp(44px,6vw,70px)] font-medium leading-[1em] tracking-[-0.03em] text-black max-w-2xl mx-auto">
            Poneglyph transforms fragmented field data into global intelligence
          </h1>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container-max flex flex-col gap-20">
          <div className="flex flex-col md:flex-row gap-16 items-start">
            <h2 className="text-[clamp(36px,4vw,48px)] font-medium tracking-tight text-black md:w-[280px]">
              Our story
            </h2>
            <div className="flex-1 flex flex-col gap-8">
              <p className="text-[20px] font-medium text-black leading-snug">
                It all started with a frustrating reality: NGOs sit on terabytes of critical field
                data while researchers and journalists struggle to access accurate intelligence.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <p className="text-body text-grey-1 leading-relaxed">
                  Before founding Poneglyph, our team spent years working directly with NGOs across
                  three continents. The same story repeated everywhere — valuable data trapped in
                  silos, unable to inform global task forces.
                </p>
                <p className="text-body text-grey-1 leading-relaxed">
                  We founded Poneglyph in 2024 to fix the data layer. AI-managed ingestion,
                  real-time analytics, and a shared intelligence commons that finally lets datasets
                  cross borders and inform policy.
                </p>
              </div>
            </div>
          </div>
          <div className="w-full h-[520px] rounded-2xl overflow-hidden relative">
            <Image
              src="/images/team-photo.png"
              alt="Poneglyph team"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <LogoTicker />

      <section className="py-24 bg-white overflow-hidden">
        <div className="container-max flex flex-col md:flex-row gap-16 items-start">
          <div className="flex-1 flex flex-col gap-10">
            <blockquote className="text-[clamp(28px,4vw,48px)] font-medium leading-tight tracking-tight text-black">
              &ldquo;The biggest barrier to solving global crises isn't a lack of data — it's our
              inability to share and interpret it correctly.&rdquo;
            </blockquote>
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-full overflow-hidden">
                <Image
                  src="/images/avatar-amara.png"
                  alt="Amara Osei"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <p className="text-sm font-medium text-black">Amara Osei</p>
                <p className="text-sm text-grey-1">Founder & CEO @Poneglyph</p>
              </div>
            </div>
          </div>
          <div className="flex-1 h-[400px] rounded-2xl overflow-hidden relative">
            <video
              src="/videos/poneglyph-video.mp4"
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      <section className="py-24 bg-grey-4">
        <div className="container-max flex flex-col items-center gap-8 max-w-[500px] mx-auto text-center">
          <h2 className="text-[clamp(22px,3vw,28px)] font-medium text-black">
            Data silos have always been the missing layer in humanitarian work.
          </h2>
          <div className="text-body text-grey-1 leading-relaxed space-y-4 text-left">
            <p>
              Every humanitarian organization faces the same invisible tax: time spent manually
              analyzing reports, translating local data, and struggling to correlate regional trends
              globally.
            </p>
            <ul className="space-y-1">
              {[
                "Dataset ingestion from any NGO ✓",
                "AI-extracted trend insights ✓",
                "Publicly accessible intelligence ✓",
                "Agentic research terminal ✓",
                "Autonomous campaign orchestration ✓",
                "Open API for researchers ✓",
              ].map((item) => (
                <li key={item} className="text-black font-medium">
                  {item}
                </li>
              ))}
            </ul>
            <p className="font-medium text-black pt-4">This is what we built. And it works.</p>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="container-max flex flex-col gap-16">
          <h2 className="text-[clamp(28px,4vw,36px)] font-medium tracking-tight text-black max-w-md">
            Powered by people who give a damn
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {team.map((member) => (
              <div
                key={member.name}
                className="flex flex-col gap-4 p-5 border border-grey-3 rounded-2xl hover:border-grey-2 transition-colors"
              >
                <div className="w-full aspect-square relative rounded-xl overflow-hidden bg-grey-4">
                  <Image
                    src={`/images/${member.image}`}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-black">{member.name}</p>
                  <p className="text-xs text-grey-1">{member.role}</p>
                </div>
                <div className="flex gap-1">
                  {member.linkedin && (
                    <Link
                      href={member.linkedin}
                      className="w-7 h-7 flex items-center justify-center rounded-lg text-grey-1 hover:text-black hover:bg-grey-4"
                    >
                      <Linkedin size={14} />
                    </Link>
                  )}
                  {member.email && (
                    <Link
                      href={member.email}
                      className="w-7 h-7 flex items-center justify-center rounded-lg text-grey-1 hover:text-black hover:bg-grey-4"
                    >
                      <Mail size={14} />
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-4 bg-black">
        <div className="max-w-xl mx-auto flex flex-col items-center gap-8 text-center text-white">
          <h2 className="text-[clamp(36px,5vw,60px)] font-medium leading-tight">
            Help us turn humanitarian data into action.
          </h2>
          <Link
            href="/careers#openpositions"
            className="flex items-center gap-2 px-5 py-2.5 bg-primary text-black font-medium rounded-xl"
          >
            View open positions <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
}

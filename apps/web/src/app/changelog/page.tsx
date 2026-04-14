import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";

const entries = [
  {
    date: "March 2025",
    version: "v1.2.0",
    tag: "Major release",
    changes: [
      {
        type: "new",
        text: "AI volunteer matching engine — automatically surfaces best-fit volunteers for each project",
      },
      { type: "new", text: "Impact heatmap: visualize regional volunteer coverage at a glance" },
      {
        type: "new",
        text: "Multi-NGO coordination layer — share volunteer pools with partner organizations",
      },
      {
        type: "improved",
        text: "Matching speed improved by 60% with updated skill graph algorithm",
      },
      {
        type: "fixed",
        text: "Fixed an issue where availability calendar would not sync across timezones",
      },
    ],
  },
  {
    date: "February 2025",
    version: "v1.1.3",
    tag: "Patch",
    changes: [
      { type: "improved", text: "Dashboard loading speed improved by 45%" },
      {
        type: "improved",
        text: "Mobile volunteer profile editor now supports bulk skill selection",
      },
      { type: "fixed", text: "Resolved notification duplication bug on Firefox" },
      { type: "fixed", text: "Fixed date rendering for NGOs in non-UTC timezones" },
    ],
  },
  {
    date: "January 2025",
    version: "v1.1.0",
    tag: "Feature update",
    changes: [
      {
        type: "new",
        text: "AI sub-agent system — background agents analyze program data and flag resource gaps",
      },
      { type: "new", text: "Slack and Airtable integrations (beta)" },
      {
        type: "new",
        text: "Volunteer retention risk scores — get alerted before engagement drops",
      },
      { type: "improved", text: "Analytics dashboard revamped with custom report builder" },
    ],
  },
  {
    date: "December 2024",
    version: "v1.0.0",
    tag: "Major release",
    changes: [
      { type: "new", text: "Poneglyph public launch — volunteer matching for NGOs is live" },
      { type: "new", text: "Volunteer skill profile builder with certification upload" },
      { type: "new", text: "NGO project management with availability heatmaps" },
      { type: "new", text: "Impact analytics: volunteer hours, regional reach, program outcomes" },
    ],
  },
];

const tagColors: Record<string, string> = {
  new: "bg-success/10 text-success",
  improved: "bg-blue/10 text-blue",
  fixed: "bg-error/10 text-error",
};

const releaseTagColors: Record<string, string> = {
  "Major release": "bg-primary text-black",
  Patch: "bg-grey-3 text-grey-1",
  "Feature update": "bg-black text-white",
};

export default function ChangelogPage() {
  return (
    <>
      <Navigation />
      <section className="py-20 border-b border-grey-3">
        <div className="container-max max-w-3xl">
          <p className="text-sub font-medium uppercase tracking-widest text-grey-1 mb-4">
            changelog
          </p>
          <h1 className="text-[clamp(36px,5vw,52px)] font-medium leading-tight tracking-tight text-black">
            What&apos;s new in Poneglyph
          </h1>
        </div>
      </section>

      <section className="py-16">
        <div className="container-max max-w-3xl flex flex-col gap-16">
          {entries.map((entry) => (
            <div key={entry.version} className="flex flex-col gap-6">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-black">{entry.date}</span>
                <span className="text-grey-3">·</span>
                <span className="text-sm text-grey-1 font-mono">{entry.version}</span>
                <span
                  className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                    releaseTagColors[entry.tag] ?? "bg-grey-4 text-grey-1"
                  }`}
                >
                  {entry.tag}
                </span>
              </div>
              <div className="border-l-2 border-grey-3 pl-6 flex flex-col gap-3">
                {entry.changes.map((c, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span
                      className={`text-[10px] font-medium px-2 py-0.5 rounded-full mt-0.5 shrink-0 ${
                        tagColors[c.type] ?? "bg-grey-4 text-grey-1"
                      }`}
                    >
                      {c.type}
                    </span>
                    <p className="text-sm text-grey-1 leading-relaxed">{c.text}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </>
  );
}

import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";

export default function PrivacyPage() {
  const sections = [
    {
      title: "Information we collect",
      content:
        "We collect information you provide directly (name, email, company details) and usage data (pages visited, features used). We do not sell your personal data to third parties.",
    },
    {
      title: "How we use your information",
      content:
        "We use collected data to operate and improve Poneglyph, communicate with you, process payments, and comply with legal obligations. We use industry-standard security practices to protect your data.",
    },
    {
      title: "Data sharing",
      content:
        "We share data with service providers who help us operate Poneglyph (hosting, analytics, payments). We may share anonymized, aggregated data for research. We never share your data with third parties for marketing.",
    },
    {
      title: "Your rights",
      content:
        "You can access, update, or delete your data anytime through your account settings. You can also export your data or request deletion. Contact us at privacy@poneglyph.io for any data-related requests.",
    },
    {
      title: "Security",
      content:
        "We use TLS encryption for all data in transit, AES-256 encryption for data at rest, and regular third-party security audits. Our team follows least-privilege access principles.",
    },
    {
      title: "Changes",
      content:
        "We may update this policy. We will notify you of material changes via email and post the updated policy here with a revised date.",
    },
  ];

  return (
    <>
      <Navigation />
      <section className="py-20 border-b border-grey-3">
        <div className="container-max max-w-2xl">
          <p className="text-sub font-medium uppercase tracking-widest text-grey-1 mb-4">privacy</p>
          <h1 className="text-[clamp(36px,5vw,52px)] font-medium leading-tight tracking-tight text-black">
            Your data, your trust
          </h1>
        </div>
      </section>

      <section className="py-16">
        <div className="container-max max-w-2xl flex flex-col gap-12">
          {sections.map((section) => (
            <div key={section.title} className="flex flex-col gap-3">
              <h2 className="text-lg font-medium text-black">{section.title}</h2>
              <p className="text-body text-grey-1 leading-relaxed">{section.content}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="pb-20">
        <div className="container-max max-w-2xl">
          <p className="text-body text-grey-1">
            Questions? Contact us at{" "}
            <a href="mailto:privacy@poneglyph.io" className="text-black underline">
              privacy@poneglyph.io
            </a>
          </p>
        </div>
      </section>
      <Footer />
    </>
  );
}

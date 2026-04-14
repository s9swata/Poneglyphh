import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { PricingPlans } from "@/components/pricing/pricing-plans";
import { PricingFAQ } from "@/components/pricing/pricing-faq";

export default function PricingPage() {
  return (
    <>
      <Navigation />
      {/* ── Hero ── */}
      <section className="py-24 text-center">
        <div className="container-max flex flex-col items-center gap-6">
          <p className="text-sub font-medium uppercase tracking-widest text-grey-1">pricing</p>
          <h1 className="text-[clamp(40px,6vw,60px)] font-medium leading-tight tracking-tight text-black max-w-xl">
            Open intelligence. Free to access, paid to contribute at scale.
          </h1>
          <p className="text-body text-grey-1 max-w-md">
            Only pay to publish data or run advanced AI agents. Public intelligence is free forever.
          </p>
        </div>
      </section>

      {/* ── Plans ── */}
      <section className="pb-24">
        <PricingPlans />
      </section>

      {/* ── FAQs ── */}
      <section className="py-24 bg-grey-4">
        <div className="container-max flex flex-col gap-12">
          <div className="flex flex-col items-center gap-4 text-center">
            <p className="text-sub font-medium uppercase tracking-widest text-grey-1">faqs</p>
            <h2 className="text-[clamp(28px,4vw,40px)] font-medium leading-tight tracking-tight text-black">
              Common questions
            </h2>
          </div>
          <PricingFAQ />
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="py-24 px-4">
        <div className="max-w-container mx-auto">
          <div className="relative bg-black rounded-2xl px-8 py-20 flex flex-col items-center gap-8 overflow-hidden text-center">
            <p className="text-sub font-medium uppercase tracking-widest text-grey-2 relative z-10">
              get started today
            </p>
            <h2 className="text-[clamp(36px,5vw,60px)] font-medium leading-tight tracking-tight text-white relative z-10 max-w-xl">
              Turn field data into global intelligence. Start free.
            </h2>
            <Link
              href="/contact"
              className="flex items-center gap-2 px-5 py-2.5 bg-primary text-black font-medium rounded-xl hover:bg-primary/80 transition-colors relative z-10"
            >
              Get early access <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}

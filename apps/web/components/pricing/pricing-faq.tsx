"use client";

const faqs = [
  {
    q: "Is the data really free to access?",
    a: "Yes, all published insights are publicly accessible, forever.",
  },
  {
    q: "What data formats can NGOs submit?",
    a: "CSV, JSON, PDF reports, and direct API push. We handle cleaning.",
  },
  {
    q: "How do AI insights get published?",
    a: "Our agents run nightly extraction passes and publish findings with source attribution.",
  },
  {
    q: "Is submitted data kept private?",
    a: "Raw submissions are never made public. Only aggregated, AI-processed insights are surfaced.",
  },
  {
    q: "Can I query the data programmatically?",
    a: "Yes, via our Research API (Contributor tier and above).",
  },
];

export function PricingFAQ() {
  return (
    <div className="flex flex-col gap-4 max-w-2xl mx-auto w-full">
      {faqs.map((faq) => (
        <div
          key={faq.q}
          className="bg-white border border-grey-3 rounded-2xl p-6 flex flex-col gap-3"
        >
          <p className="text-base font-medium text-black">{faq.q}</p>
          <p className="text-sm text-grey-1 leading-relaxed">{faq.a}</p>
        </div>
      ))}
    </div>
  );
}

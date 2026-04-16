"use client";

import { Check, ArrowRight } from "lucide-react";
import Link from "next/link";

interface Plan {
  name: string;
  price: string;
  period: string;
  description: string;
  cta: string;
  ctaHref: string;
  highlighted: boolean;
  features: string[];
}

const plans: Plan[] = [
  {
    name: "Explorer",
    price: "Free",
    period: "",
    description: "For researchers and journalists querying our public dataset.",
    cta: "Start exploring",
    ctaHref: "/contact",
    highlighted: false,
    features: [
      "Public dataset access",
      "AI research terminal (1,000 queries/mo)",
      "Trend reports & published insights",
      "Attribution-free download",
      "Community forum access",
    ],
  },
  {
    name: "Contributor",
    price: "$49",
    period: "/mo",
    description: "For NGOs submitting data and receiving AI insights at scale.",
    cta: "Start free trial",
    ctaHref: "/contact",
    highlighted: true,
    features: [
      "Dataset submission portal",
      "AI-cleaned data feedback loop",
      "Insights published under your NGO's attribution",
      "Campaign orchestration tools",
      "Priority support + Data export",
    ],
  },
  {
    name: "Partner",
    price: "Custom",
    period: "",
    description: "For networks needing API access, custom AI runs, and white-label intelligence.",
    cta: "Talk to us",
    ctaHref: "/contact",
    highlighted: false,
    features: [
      "Full REST API access",
      "Custom agentic research runs",
      "Co-published intelligence briefs",
      "Dedicated data analyst",
      "White-label option + Custom SLA",
    ],
  },
];

export function PricingPlans() {
  return (
    <div className="container-max grid grid-cols-1 md:grid-cols-3 gap-4">
      {plans.map((plan) => (
        <div
          key={plan.name}
          className={`flex flex-col gap-6 p-8 rounded-2xl border ${
            plan.highlighted
              ? "bg-black text-white border-black"
              : "bg-white text-black border-grey-3"
          }`}
        >
          <div className="flex flex-col gap-2">
            <p
              className={`text-sub font-medium uppercase tracking-widest ${plan.highlighted ? "text-grey-2" : "text-grey-1"}`}
            >
              {plan.name}
            </p>
            <div className="flex items-baseline gap-1">
              <span className="text-[42px] font-semibold leading-none">{plan.price}</span>
              {plan.period && (
                <span className={`text-sm ${plan.highlighted ? "text-grey-2" : "text-grey-1"}`}>
                  {plan.period}
                </span>
              )}
            </div>
            <p className={`text-sm ${plan.highlighted ? "text-grey-2" : "text-grey-1"}`}>
              {plan.description}
            </p>
          </div>
          <Link
            href={plan.ctaHref}
            className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-colors ${plan.highlighted ? "bg-primary text-black hover:bg-primary/80" : "bg-black text-white hover:bg-black/80"}`}
          >
            {plan.cta} <ArrowRight size={14} />
          </Link>
          <div
            className={`border-t ${plan.highlighted ? "border-white/10" : "border-grey-3"} pt-6 flex flex-col gap-3`}
          >
            {plan.features.map((feature) => (
              <div key={feature} className="flex items-start gap-2.5 text-sm">
                <Check
                  size={14}
                  className={`shrink-0 mt-0.5 ${plan.highlighted ? "text-primary" : "text-success"}`}
                />
                <span className={plan.highlighted ? "text-grey-2" : "text-grey-1"}>{feature}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

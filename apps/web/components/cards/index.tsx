"use client";

/**
 * Poneglyph Card Components
 * All reusable card primitives from the landing page design system.
 * Color scheme: primary #E3FF8F, black #22242A, greys, blue #25C5FA
 */

import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check } from "lucide-react";
import { motion } from "framer-motion";

/* ─────────────────────────────────────────
   Lime Highlight
   Usage: <Highlight>word</Highlight>
───────────────────────────────────────── */
export function Highlight({ children }: { children: React.ReactNode }) {
  return (
    <span className="relative inline-block">
      <span className="relative z-10">{children}</span>
      <span
        className="absolute inset-x-0 bottom-0 h-[90%] bg-primary rounded-sm -z-0"
        aria-hidden
      />
    </span>
  );
}

/* ─────────────────────────────────────────
   FeatureCard
   Small icon + title + description card
───────────────────────────────────────── */
interface FeatureCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  badge?: string;
}
export function FeatureCard({ icon: Icon, title, description, badge }: FeatureCardProps) {
  return (
    <div className="flex flex-col gap-3 p-6 bg-white border border-grey-3 rounded-2xl hover:border-grey-2 transition-colors">
      <div className="w-10 h-10 bg-grey-4 rounded-xl flex items-center justify-center">
        <Icon size={20} className="text-black" />
      </div>
      <div className="flex items-center gap-2">
        <h3 className="text-[15px] font-medium text-black">{title}</h3>
        {badge && (
          <span className="text-[9px] font-medium bg-primary text-black px-1.5 py-0.5 rounded-full">
            {badge}
          </span>
        )}
      </div>
      <p className="text-sm text-grey-1 leading-relaxed">{description}</p>
    </div>
  );
}

/* ─────────────────────────────────────────
   StatCard
   Big number + label (used in stats grids)
───────────────────────────────────────── */
interface StatCardProps {
  value: string;
  label: string;
  delta?: string;
  deltaPositive?: boolean;
}
export function StatCard({ value, label, delta, deltaPositive }: StatCardProps) {
  return (
    <div className="flex flex-col gap-1 p-6 bg-white border border-grey-3 rounded-2xl">
      <p className="text-[36px] font-semibold text-black leading-none">{value}</p>
      {delta && (
        <span
          className={`text-[11px] font-medium ${deltaPositive ? "text-success" : "text-error"}`}
        >
          {deltaPositive ? "↑" : "↓"} {delta}
        </span>
      )}
      <p className="text-sm text-grey-1 mt-1">{label}</p>
    </div>
  );
}

/* ─────────────────────────────────────────
   PlanRow
   Horizontal plan card (Startups / Mid / Enterprise style)
───────────────────────────────────────── */
interface PlanRowProps {
  label: string;
  description: string;
  href?: string;
  isLast?: boolean;
}
export function PlanRow({ label, description, href = "/pricing", isLast }: PlanRowProps) {
  return (
    <div
      className={`flex items-center justify-between px-8 py-6 hover:bg-grey-4/50 transition-colors ${!isLast ? "border-b border-grey-3" : ""}`}
    >
      <div className="flex flex-col gap-1">
        <p className="text-lg font-medium text-black">{label}</p>
        <p className="text-sm text-grey-1">{description}</p>
      </div>
      <Link href={href}>
        <ArrowUpRight size={20} className="text-grey-1 hover:text-black transition-colors" />
      </Link>
    </div>
  );
}

/* ─────────────────────────────────────────
   PricingCard
   Full pricing plan card (vertical)
───────────────────────────────────────── */
interface PricingCardProps {
  name: string;
  price: string;
  period?: string;
  description: string;
  features: string[];
  cta: string;
  ctaHref: string;
  highlighted?: boolean;
}
export function PricingCard({
  name,
  price,
  period,
  description,
  features,
  cta,
  ctaHref,
  highlighted,
}: PricingCardProps) {
  return (
    <div
      className={`flex flex-col gap-6 p-8 rounded-2xl border ${highlighted ? "bg-black text-white border-black" : "bg-white text-black border-grey-3"}`}
    >
      <div className="flex flex-col gap-2">
        <p
          className={`text-sub font-medium uppercase tracking-widest ${highlighted ? "text-grey-2" : "text-grey-1"}`}
        >
          {name}
        </p>
        <div className="flex items-baseline gap-1">
          <span className="text-[42px] font-semibold leading-none">{price}</span>
          {period && (
            <span className={`text-sm ${highlighted ? "text-grey-2" : "text-grey-1"}`}>
              {period}
            </span>
          )}
        </div>
        <p className={`text-sm ${highlighted ? "text-grey-2" : "text-grey-1"}`}>{description}</p>
      </div>
      <Link
        href={ctaHref}
        className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-colors ${
          highlighted
            ? "bg-primary text-black hover:bg-primary/80"
            : "bg-black text-white hover:bg-black/80"
        }`}
      >
        {cta} <ArrowRight size={14} />
      </Link>
      <div
        className={`border-t ${highlighted ? "border-white/10" : "border-grey-3"} pt-6 flex flex-col gap-3`}
      >
        {features.map((f) => (
          <div key={f} className="flex items-start gap-2.5 text-sm">
            <Check
              size={14}
              className={`shrink-0 mt-0.5 ${highlighted ? "text-primary" : "text-success"}`}
            />
            <span className={highlighted ? "text-grey-2" : "text-grey-1"}>{f}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   TeamMemberCard
───────────────────────────────────────── */
interface TeamMemberCardProps {
  name: string;
  role: string;
  initials: string;
  linkedin?: string;
  email?: string;
}
export function TeamMemberCard({ name, role, initials }: TeamMemberCardProps) {
  return (
    <div className="flex flex-col gap-4 p-5 bg-white border border-grey-3 rounded-2xl hover:border-grey-2 transition-colors">
      <div className="w-full aspect-square bg-grey-4 rounded-xl flex items-center justify-center text-2xl font-semibold text-grey-1">
        {initials}
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-sm font-medium text-black">{name}</p>
        <p className="text-xs text-grey-1">{role}</p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   BlogCard
───────────────────────────────────────── */
interface BlogCardProps {
  tag: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  href: string;
}
export function BlogCard({ tag, title, excerpt, date, readTime, href }: BlogCardProps) {
  return (
    <Link
      href={href}
      className="group flex flex-col gap-4 bg-white border border-grey-3 rounded-2xl overflow-hidden hover:border-grey-2 transition-colors"
    >
      <div className="w-full aspect-video bg-grey-4" />
      <div className="flex flex-col gap-3 p-5 pb-6">
        <span className="text-[10px] font-medium uppercase tracking-widest text-grey-1 bg-grey-4 px-2 py-1 rounded-full w-fit">
          {tag}
        </span>
        <h3 className="text-base font-medium text-black leading-snug group-hover:text-grey-1 transition-colors">
          {title}
        </h3>
        <p className="text-sm text-grey-1 leading-relaxed">{excerpt}</p>
        <div className="flex items-center gap-2 text-xs text-grey-2 mt-1">
          <span>{date}</span>
          <span>·</span>
          <span>{readTime}</span>
        </div>
      </div>
    </Link>
  );
}

/* ─────────────────────────────────────────
   ActivityItem (for feeds)
───────────────────────────────────────── */
interface ActivityItemProps {
  user: string;
  action: string;
  target?: string;
  avatarColor?: string;
  time?: string;
}
export function ActivityItem({
  user,
  action,
  target,
  avatarColor = "bg-black",
  time,
}: ActivityItemProps) {
  return (
    <div className="flex items-start gap-2.5 px-4 py-2.5 border-b border-grey-3/50 last:border-0">
      <div
        className={`w-6 h-6 rounded-full ${avatarColor} shrink-0 flex items-center justify-center text-[8px] font-bold text-white mt-0.5`}
      >
        {user[0]}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] text-grey-1 leading-snug">
          <span className="font-medium text-black">{user}</span> {action}
          {target && <span className="font-medium text-black"> {target}</span>}
        </p>
        {time && <p className="text-[9px] text-grey-2 mt-0.5">{time}</p>}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   HeroTag (announcement badge)
───────────────────────────────────────── */
export function HeroTag({ label, text }: { label?: string; text: string }) {
  return (
    <motion.div
      className="relative z-20 inline-flex items-center gap-2 border border-grey-3 rounded-full px-3 py-1 text-xs text-black bg-white overflow-hidden cursor-default"
      initial="idle"
      whileHover="hover"
    >
      {/* full-pill green fill sweeping left → right */}
      <motion.span
        aria-hidden
        className="absolute inset-0 bg-primary"
        style={{ originX: 0 }}
        variants={{
          idle: { scaleX: 0 },
          hover: {
            scaleX: 1,
            transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
          },
        }}
      />

      {label && (
        <motion.span
          className="relative z-10 text-black text-[9px] font-semibold px-1.5 py-0.5 rounded-full"
          variants={{
            idle: { backgroundColor: "#E3FF8F" },
            hover: {
              backgroundColor: "#ffffff",
              transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] },
            },
          }}
        >
          {label}
        </motion.span>
      )}
      <span className="relative z-10">{text}</span>
      <span className="relative z-10">
        <ArrowRight size={10} />
      </span>
    </motion.div>
  );
}

/* ─────────────────────────────────────────
   SectionHeader
───────────────────────────────────────── */
interface SectionHeaderProps {
  eyebrow?: string;
  heading: React.ReactNode;
  sub?: string;
  align?: "center" | "left";
}
export function SectionHeader({ eyebrow, heading, sub, align = "center" }: SectionHeaderProps) {
  const a = align === "center" ? "items-center text-center" : "items-start text-left";
  return (
    <div className={`flex flex-col gap-4 ${a}`}>
      {eyebrow && (
        <p className="text-sub font-medium uppercase tracking-widest text-grey-1">{eyebrow}</p>
      )}
      <h2 className="text-[clamp(28px,4vw,48px)] font-medium leading-tight tracking-tight text-black">
        {heading}
      </h2>
      {sub && <p className="text-body text-grey-1 max-w-xl">{sub}</p>}
    </div>
  );
}

/* ─────────────────────────────────────────
   DarkBanner (CTA section - dark version)
───────────────────────────────────────── */
interface DarkBannerProps {
  eyebrow: string;
  heading: string;
  cta: string;
  ctaHref: string;
}
export function DarkBanner({ eyebrow, heading, cta, ctaHref }: DarkBannerProps) {
  return (
    <div className="relative bg-black rounded-2xl px-8 py-20 flex flex-col items-center gap-8 overflow-hidden text-center">
      <div className="absolute inset-0 dots-pattern pointer-events-none" aria-hidden />
      <p className="text-sub font-medium uppercase tracking-widest text-grey-2 relative z-10">
        {eyebrow}
      </p>
      <h2 className="text-[clamp(36px,5vw,60px)] font-medium leading-tight tracking-tight text-white relative z-10 max-w-xl">
        {heading}
      </h2>
      <Link
        href={ctaHref}
        className="flex items-center gap-2 px-5 py-2.5 bg-primary text-black font-medium rounded-xl hover:bg-primary/80 transition-colors relative z-10"
      >
        {cta} <ArrowRight size={16} />
      </Link>
    </div>
  );
}

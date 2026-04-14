import Link from "next/link";
import { Instagram, Linkedin, Globe, Mail } from "lucide-react";

const productLinks = [
  { label: "Homepage", href: "/" },
  { label: "For NGOs", href: "/solutions" },
  { label: "For Volunteers", href: "/feature" },
  { label: "Pricing", href: "/pricing" },
  { label: "Changelog", href: "/changelog", badge: "New" },
];

const companyLinks = [
  { label: "About", href: "/about" },
  { label: "Careers", href: "/careers", badge: "We're hiring!" },
  { label: "Contact us", href: "/contact" },
  { label: "Privacy", href: "/privacy" },
  { label: "Log in", href: "#" },
];

const resourceLinks = [
  { label: "Start here", href: "/starthere" },
  { label: "Tutorials", href: "https://www.framer.com/academy/" },
  { label: "Blog", href: "/blog" },
  { label: "Article", href: "/blog/announcing-our-2-3m-seed-round" },
];

const socialLinks = [
  { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
  { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
  { icon: Globe, href: "https://www.framer.com", label: "Website" },
  { icon: Mail, href: "mailto:wearemodula@gmail.com", label: "Email" },
];

function FooterLinkItem({ label, href, badge }: { label: string; href: string; badge?: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 text-sm text-grey-1 hover:text-black transition-colors"
    >
      {label}
      {badge && (
        <span className="text-[10px] font-medium bg-primary text-black px-1.5 py-0.5 rounded-full leading-none">
          {badge}
        </span>
      )}
    </Link>
  );
}

export function Footer() {
  return (
    <footer className="bg-grey-4">
      <div className="container-max py-16">
        {/* Link columns */}
        <div className="grid grid-cols-3 gap-10 mb-16">
          <div className="flex flex-col gap-8">
            <p className="text-sub font-medium uppercase tracking-widest text-grey-1">Product</p>
            <div className="flex flex-col gap-3.5">
              {productLinks.map((l) => (
                <FooterLinkItem key={l.label} {...l} />
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-8">
            <p className="text-sub font-medium uppercase tracking-widest text-grey-1">Company</p>
            <div className="flex flex-col gap-3.5">
              {companyLinks.map((l) => (
                <FooterLinkItem key={l.label} {...l} />
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-8">
            <p className="text-sub font-medium uppercase tracking-widest text-grey-1">Resources</p>
            <div className="flex flex-col gap-3.5">
              {resourceLinks.map((l) => (
                <FooterLinkItem key={l.label} {...l} />
              ))}
            </div>
          </div>
        </div>

        {/* Newsletter + join section */}
        <div className="border-t border-b border-grey-3 py-10 flex flex-col md:flex-row items-start md:items-center gap-10">
          {/* Logo */}
          <div className="flex items-center gap-2 font-onest font-semibold text-black text-lg shrink-0">
            <div className="w-7 h-7 bg-primary rounded-md flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="5" fill="#22242A" />
                <circle cx="8" cy="8" r="2" fill="#E3FF8F" />
              </svg>
            </div>
            Poneglyph
          </div>

          <div className="flex-1 flex flex-col md:flex-row items-start md:items-center gap-10">
            <p className="text-heading-6 font-medium text-black max-w-xs">
              Join 2,000+ NGOs and volunteers already on Poneglyph
            </p>
            <div className="flex items-center border border-grey-3 rounded-xl p-1 bg-white">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-3 py-2 text-sm bg-transparent outline-none text-black placeholder:text-grey-2 min-w-[200px]"
              />
              <button className="px-4 py-2.5 bg-black text-white text-sm font-medium rounded-lg hover:bg-black/80 transition-colors whitespace-nowrap">
                Get updated
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-grey-1">
            © 2025 Poneglyph — Smart Resource Allocation for NGOs
          </p>

          <div className="flex items-center gap-1.5">
            {socialLinks.map(({ icon: Icon, href, label }) => (
              <Link
                key={label}
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-grey-1 hover:text-black hover:bg-grey-3 transition-colors"
                aria-label={label}
              >
                <Icon size={16} />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

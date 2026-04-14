"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "About", href: "/about" },
  { label: "Research", href: "/research" },
  { label: "For Volunteers", href: "/feature" },
  { label: "Pricing", href: "/pricing" },
  { label: "Contact", href: "/contact" },
  { label: "Blog", href: "/blog" },
];

export function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-grey-3">
      <div className="container-max">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 font-onest font-semibold text-black text-base"
          >
            <div className="w-7 h-7 bg-black rounded-md flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <rect x="1" y="1" width="5" height="5" rx="0.5" fill="white" />
                <rect x="8" y="1" width="5" height="5" rx="0.5" fill="white" />
                <rect x="1" y="8" width="5" height="5" rx="0.5" fill="white" />
                <rect x="8" y="8" width="5" height="5" rx="0.5" fill="white" />
              </svg>
            </div>
            Poneglyph
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-sm font-medium text-grey-1 hover:text-black rounded-lg hover:bg-grey-4 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA buttons */}
          <div className="hidden md:flex items-center gap-2">
            <Link
              href="/pricing"
              className="px-4 py-2 text-sm font-medium text-black border border-grey-3 rounded-lg hover:bg-grey-4 transition-colors"
            >
              Try for free
            </Link>
            <Link
              href="/contact"
              className="px-4 py-2 text-sm font-medium text-white bg-black rounded-lg hover:bg-black/80 transition-colors"
            >
              Get a demo
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-grey-4"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-grey-3 py-4 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-3 text-sm font-medium text-grey-1 hover:text-black hover:bg-grey-4 rounded-lg transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex gap-2 mt-3 pt-3 border-t border-grey-3">
              <Link
                href="/contact"
                className="flex-1 text-center px-4 py-2 text-sm font-medium text-black border border-grey-3 rounded-lg"
                onClick={() => setMobileOpen(false)}
              >
                Get a demo
              </Link>
              <Link
                href="/pricing"
                className="flex-1 text-center px-4 py-2 text-sm font-medium text-black bg-primary rounded-lg"
                onClick={() => setMobileOpen(false)}
              >
                Try for free
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

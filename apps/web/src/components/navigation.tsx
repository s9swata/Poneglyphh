"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "About", href: "/about" },
  { label: "Research", href: "/research" },
  { label: "Datasets", href: "/datasets" },
  { label: "Contact", href: "/contact" },
];

function PoneglyphLogo() {
  return (
    <div className="w-7 h-7 bg-black rounded-md flex items-center justify-center shrink-0">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <rect x="1" y="1" width="5" height="5" rx="0.5" fill="white" />
        <rect x="8" y="1" width="5" height="5" rx="0.5" fill="white" />
        <rect x="1" y="8" width="5" height="5" rx="0.5" fill="white" />
        <rect x="8" y="8" width="5" height="5" rx="0.5" fill="white" />
      </svg>
    </div>
  );
}

export function Navigation() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-grey-3">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 font-onest font-semibold text-black text-sm shrink-0"
        >
          <PoneglyphLogo />
          Poneglyph
        </Link>

        {/* Desktop nav links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-4 py-2 text-sm font-medium rounded-xl transition-colors ${
                pathname === link.href
                  ? "text-black bg-grey-4"
                  : "text-grey-1 hover:text-black hover:bg-grey-4"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/datasets/upload"
            className="text-sm font-medium text-grey-1 hover:text-black transition-colors"
          >
            Upload
          </Link>
          <Link
            href="/login"
            className="px-4 py-1.5 text-sm font-medium text-black bg-primary rounded-xl hover:bg-primary/80 transition-colors"
          >
            Sign in
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 rounded-xl hover:bg-grey-4 transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-grey-3 py-3 px-4 flex flex-col gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`px-4 py-2.5 text-sm font-medium rounded-xl transition-colors ${
                pathname === link.href
                  ? "text-black bg-grey-4"
                  : "text-grey-1 hover:text-black hover:bg-grey-4"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="flex gap-2 mt-2 pt-3 border-t border-grey-3">
            <Link
              href="/datasets/upload"
              onClick={() => setMobileOpen(false)}
              className="flex-1 text-center px-4 py-2 text-sm font-medium text-black border border-grey-3 rounded-xl"
            >
              Upload
            </Link>
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="flex-1 text-center px-4 py-2 text-sm font-medium text-black bg-primary rounded-xl"
            >
              Sign in
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

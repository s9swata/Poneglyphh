"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { Account } from "@/components/account";

function IconMenu() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path
        d="M3 5h12M3 9h12M3 13h12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconX() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path
        d="M4 4l10 10M14 4L4 14"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

const navLinks = [
  { label: "About", href: "/about" },
  { label: "Research", href: "/research" },
  { label: "Datasets", href: "/datasets" },
  { label: "Contact", href: "/contact" },
];

function PoneglyphLogo({ dark }: { dark: boolean }) {
  return (
    <div
      className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 transition-colors duration-300 ${dark ? "bg-black" : "bg-white/20"}`}
    >
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
  const isHome = pathname === "/";
  const [mobileOpen, setMobileOpen] = useState(false);

  const { data: session, isPending: _isPending } = authClient.useSession();
  const user = session?.user;
  const isAuthenticated = !!user;

  const [dark, setDark] = useState(!isHome);

  useEffect(() => {
    if (!isHome) {
      setDark(true);
      return;
    }
    const NAV_H = 56;
    const check = () => {
      const section = document.getElementById("how-it-works");
      if (!section) return;
      setDark(section.getBoundingClientRect().top <= NAV_H);
    };
    check();
    window.addEventListener("scroll", check, { passive: true });
    return () => window.removeEventListener("scroll", check);
  }, [isHome]);

  useEffect(() => {
    //
  }, []);

  const handleSignOut = async () => {
    await authClient.signOut();
    window.location.href = "/";
  };

  const textColor = dark ? "text-black" : "text-white";
  const hoverBg = dark ? "hover:bg-black/5" : "hover:bg-white/10";

  return (
    <header
      className={`fixed top-5 left-24 right-24 z-50 rounded-xl transition-all duration-500 ${
        dark ? "backdrop-blur-2xl bg-white/20" : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link
          href="/"
          className={`flex items-center gap-2 font-semibold text-sm shrink-0 transition-colors duration-300 ${textColor}`}
        >
          <PoneglyphLogo dark={dark} />
          Poneglyph
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-4 py-2 text-sm font-medium rounded-xl transition-colors duration-300 ${textColor} ${hoverBg}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Account variant={isHome && !dark ? "transparent" : "default"} />
        </div>

        <button
          className={`md:hidden p-2 rounded-xl transition-colors ${hoverBg} ${textColor}`}
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <IconX /> : <IconMenu />}
        </button>
      </div>

      {mobileOpen && (
        <div
          className={`md:hidden border-t py-3 px-4 flex flex-col gap-1 ${dark ? "border-black/10 bg-white/90" : "border-white/10"}`}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`px-4 py-2.5 text-sm font-medium rounded-xl transition-colors ${textColor} ${hoverBg}`}
            >
              {link.label}
            </Link>
          ))}
          <div className="flex gap-2 mt-2 pt-3 border-t border-current/10">
            {isAuthenticated ? (
              <>
                <Link
                  href="/datasets/upload"
                  onClick={() => setMobileOpen(false)}
                  className={`flex-1 text-center px-4 py-2 text-sm font-medium rounded-xl border ${dark ? "border-black/20 text-black" : "border-white/20 text-white"}`}
                >
                  Upload
                </Link>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className={`flex-1 text-center px-4 py-2 text-sm font-medium rounded-xl border ${dark ? "border-black/20 text-black" : "border-white/20 text-white"}`}
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    handleSignOut();
                    setMobileOpen(false);
                  }}
                  className={`flex-1 text-center px-4 py-2 text-sm font-medium rounded-xl ${dark ? "bg-black text-white" : "bg-white text-black"}`}
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/datasets/upload"
                  onClick={() => setMobileOpen(false)}
                  className={`flex-1 text-center px-4 py-2 text-sm font-medium rounded-xl border ${dark ? "border-black/20 text-black" : "border-white/20 text-white"}`}
                >
                  Upload
                </Link>
                <Link
                  href="/sign-in"
                  onClick={() => setMobileOpen(false)}
                  className={`flex-1 text-center px-4 py-2 text-sm font-medium rounded-xl ${dark ? "bg-black text-white" : "bg-white text-black"}`}
                >
                  Sign in
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

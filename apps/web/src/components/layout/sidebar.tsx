"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IconLayoutDashboard,
  IconClipboardList,
  IconDatabase,
  IconSearch,
  IconMessageCircle,
  IconUsers,
  IconSettings,
  IconInfoCircle,
  IconMail,
  IconLogin,
  IconLogout,
} from "@tabler/icons-react";
import { authClient } from "@/lib/auth-client";

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const handleSignOut = async () => {
    await authClient.signOut();
    window.location.href = "/";
  };

  const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: IconLayoutDashboard },
    { label: "Surveys", href: "/survey", icon: IconClipboardList },
    { label: "Datasets", href: "/datasets", icon: IconDatabase },
    { label: "Research", href: "/research", icon: IconSearch },
    { label: "Discover", href: "/discover", icon: IconUsers },
    { label: "Messages", href: "/messages", icon: IconMessageCircle },
  ];

  const secondaryItems = [
    { label: "About", href: "/about", icon: IconInfoCircle },
    { label: "Contact", href: "/contact", icon: IconMail },
  ];

  return (
    <aside className="dashboard-sidebar">
      <Link href="/" className="brand">
        <div className="brand-mark">P</div>
        <div className="brand-name">Poneglyph</div>
      </Link>

      <nav className="flex flex-col gap-1">
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname === item.href ||
                (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.label}
              href={item.href}
              className="nav-item"
              data-active={isActive ? "true" : "false"}
            >
              <item.icon size={20} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="nav-label">General</div>
      <nav className="flex flex-col gap-1">
        {secondaryItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="nav-item"
            data-active={pathname === item.href ? "true" : "false"}
          >
            <item.icon size={20} />
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="nav-label">Workspace</div>
      <Link
        href="/settings"
        className="nav-item"
        data-active={pathname === "/settings" ? "true" : "false"}
      >
        <IconSettings size={20} />
        Settings
      </Link>

      <div className="mt-auto pt-4 border-t border-black/[0.06]">
        {user ? (
          <div className="sidebar-footer">
            <div className="avatar">{user.name?.charAt(0) || user.email.charAt(0)}</div>
            <div className="flex flex-col overflow-hidden flex-1 min-w-0">
              <div className="user-name truncate">{user.name || "User"}</div>
              <div className="user-plan truncate text-xs opacity-60">{user.email}</div>
            </div>
            <button
              onClick={handleSignOut}
              className="shrink-0 p-1.5 rounded-md opacity-50 hover:opacity-100 transition-opacity"
              aria-label="Sign out"
            >
              <IconLogout size={16} />
            </button>
          </div>
        ) : (
          <Link href="/sign-in" className="nav-item">
            <IconLogin size={20} />
            Sign In
          </Link>
        )}
      </div>
    </aside>
  );
}

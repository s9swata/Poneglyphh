"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@Poneglyph/ui/components/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@Poneglyph/ui/components/avatar";
import { IconSettings, IconLogout, IconChevronDown, IconUser, IconMail } from "@tabler/icons-react";

export function Account({ variant = "default" }: { variant?: "default" | "transparent" }) {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const isAuthenticated = !!user;

  useEffect(() => {
    if (isPending) return;
    const cookies = document.cookie;
    const sessionCookies = cookies
      .split(";")
      .map((c) => c.trim())
      .filter(
        (c) => c.startsWith("better-auth") || c.startsWith("session") || c.startsWith("__Secure"),
      );
    console.group("[Account] Session state on", window.location.pathname);
    console.log("isPending:", isPending);
    console.log("isAuthenticated:", isAuthenticated);
    console.log("user email:", user?.email ?? "none");
    console.log("user id:", user?.id ?? "none");
    console.log("session expires:", session?.session?.expiresAt ?? "none");
    console.log(
      "session cookies visible to JS:",
      sessionCookies.length ? sessionCookies : "none (httpOnly or absent)",
    );
    console.log("all document.cookie:", cookies || "empty");
    console.groupEnd();
  }, [isPending, isAuthenticated]);

  const handleSignOut = async () => {
    await authClient.signOut();
    window.location.href = "/";
  };

  const isTransparent = variant === "transparent";
  const textColor = isTransparent ? "text-white" : "text-foreground";
  const hoverBg = isTransparent ? "hover:bg-white/10" : "hover:bg-accent";
  const triggerStyle = isTransparent
    ? "hover:bg-white/10"
    : "hover:bg-accent focus-visible:ring-primary";

  if (isPending) {
    return (
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <>
        <Link
          href="/datasets/upload"
          className={`text-sm font-medium transition-colors ${textColor} ${hoverBg} px-3 py-1.5 rounded-xl`}
        >
          Upload
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger
            className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-xl transition-colors outline-none focus-visible:ring-2 ${textColor} ${triggerStyle}`}
          >
            <Avatar className="w-8 h-8 rounded-full bg-primary text-primary-foreground">
              <AvatarImage src={user.image || undefined} alt={user.name || "User"} />
              <AvatarFallback>{user.name?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
            <IconChevronDown size={16} className="text-muted-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <div className="px-2 py-1.5 font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none truncate">{user.name}</p>
                <p className="text-xs leading-none text-muted-foreground truncate">{user.email}</p>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push("/dashboard/profile")}>
              <IconUser size={16} className="mr-2" />
              User Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/messages")}>
              <IconMail size={16} className="mr-2" />
              Messages
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/settings")}>
              <IconSettings size={16} className="mr-2" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut} variant="destructive">
              <IconLogout size={16} className="mr-2" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </>
    );
  }

  return (
    <>
      <Link
        href="/sign-in"
        className={
          isTransparent
            ? "px-4 py-1.5 text-sm font-medium rounded-xl bg-white text-black hover:bg-white/80 transition-all"
            : "px-4 py-1.5 text-sm font-medium rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all"
        }
      >
        Sign in
      </Link>
    </>
  );
}

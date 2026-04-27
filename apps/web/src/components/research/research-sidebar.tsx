interface ResearchSidebarProps {
  sessions: ResearchSession[];
  activeSessionId: string | null;
  onSelectSession: (id: string) => void;
  onNewSession: () => void;
  userName?: string;
  userInitial?: string;
}

export interface ResearchSession {
  id: string;
  title: string;
  createdAt: Date;
}

function isThisWeek(date: Date) {
  return date.getTime() >= Date.now() - 7 * 24 * 60 * 60 * 1000;
}

function isThisMonth(date: Date) {
  return date.getTime() >= Date.now() - 30 * 24 * 60 * 60 * 1000;
}

// Nav SVGs inlined to avoid tabler dependency size for tiny icons
const NavIcons = {
  research: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>
    </svg>
  ),
  library: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 5h18M3 12h18M3 19h12"/>
    </svg>
  ),
  spaces: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 7a3 3 0 0 1 3-3h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H7a3 3 0 0 1-3-3z"/>
    </svg>
  ),
  discover: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2v4M12 18v4M2 12h4M18 12h4M5 5l3 3M16 16l3 3M5 19l3-3M16 8l3-3"/>
    </svg>
  ),
  clock: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>
    </svg>
  ),
  plus: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5v14M5 12h14"/>
    </svg>
  ),
};

const navItems = [
  { key: "research", label: "Research", icon: NavIcons.research, active: true },
  { key: "library",  label: "Library",  icon: NavIcons.library,  active: false },
  { key: "spaces",   label: "Spaces",   icon: NavIcons.spaces,   active: false },
  { key: "discover", label: "Discover", icon: NavIcons.discover, active: false },
];

export function ResearchSidebar({
  sessions,
  activeSessionId,
  onSelectSession,
  onNewSession,
  userName = "User",
  userInitial = "U",
}: ResearchSidebarProps) {
  const thisWeek  = sessions.filter((s) => isThisWeek(s.createdAt));
  const thisMonth = sessions.filter((s) => !isThisWeek(s.createdAt) && isThisMonth(s.createdAt));
  const earlier   = sessions.filter((s) => !isThisMonth(s.createdAt));

  const renderSession = (session: ResearchSession) => {
    const isActive = session.id === activeSessionId;
    return (
      <a
        key={session.id}
        href="#"
        onClick={(e) => { e.preventDefault(); onSelectSession(session.id); }}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "7px 10px",
          borderRadius: "calc(var(--radius) * 0.6)",
          color: isActive ? "var(--foreground)" : "var(--muted-foreground)",
          fontSize: 13,
          cursor: "pointer",
          textDecoration: "none",
          background: isActive ? "var(--card)" : "transparent",
          border: isActive ? "1px solid var(--border)" : "1px solid transparent",
          boxShadow: isActive ? "0 1px 0 rgba(0,0,0,0.02)" : "none",
        }}
        onMouseEnter={(e) => {
          if (!isActive) {
            (e.currentTarget as HTMLAnchorElement).style.background = "var(--muted)";
            (e.currentTarget as HTMLAnchorElement).style.color = "var(--foreground)";
          }
        }}
        onMouseLeave={(e) => {
          if (!isActive) {
            (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
            (e.currentTarget as HTMLAnchorElement).style.color = "var(--muted-foreground)";
          }
        }}
      >
        <span style={{ width: 14, height: 14, flexShrink: 0, display: "grid", placeItems: "center" }}>
          {NavIcons.clock}
        </span>
        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {session.title}
        </span>
      </a>
    );
  };

  const renderGroup = (label: string, items: ResearchSession[], mt: number) =>
    items.length > 0 ? (
      <div key={label} style={{ marginTop: mt }}>
        <div
          style={{
            fontSize: "10.5px",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            color: "var(--muted-foreground)",
            padding: "8px 10px 6px",
          }}
        >
          {label}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {items.map(renderSession)}
        </div>
      </div>
    ) : null;

  return (
    <aside
      style={{
        borderRight: "1px solid var(--border)",
        background: "color-mix(in oklch, var(--muted) 50%, var(--background))",
        padding: "18px 14px",
        display: "flex",
        flexDirection: "column",
        gap: 4,
        position: "sticky",
        top: 0,
        height: "100vh",
        overflowY: "auto",
      }}
    >
      {/* Brand */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 10px 18px" }}>
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: "calc(var(--radius) * 0.6)",
            background: "var(--primary)",
            color: "var(--primary-foreground)",
            display: "grid",
            placeItems: "center",
            fontFamily: "var(--font-heading)",
            fontSize: 17,
            boxShadow: "inset 0 -1px 0 rgba(0,0,0,0.1)",
            flexShrink: 0,
          }}
        >
          P
        </div>
        <span style={{ fontFamily: "var(--font-heading)", fontSize: 19, letterSpacing: "-0.01em" }}>
          Poneglyph
        </span>
      </div>

      {/* New thread */}
      <a
        href="#"
        onClick={(e) => { e.preventDefault(); onNewSession(); }}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "8px 10px",
          borderRadius: "calc(var(--radius) * 0.8)",
          background: "var(--card)",
          border: "1px solid var(--border)",
          color: "var(--foreground)",
          fontSize: 13,
          fontWeight: 500,
          cursor: "pointer",
          marginBottom: 14,
          boxShadow: "0 1px 0 rgba(0,0,0,0.02)",
          textDecoration: "none",
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = "var(--muted)"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = "var(--card)"; }}
      >
        <span style={{ width: 14, height: 14, display: "grid", placeItems: "center" }}>
          {NavIcons.plus}
        </span>
        New thread
        <span
          style={{
            marginLeft: "auto",
            fontFamily: "var(--font-mono)",
            fontSize: "10.5px",
            padding: "2px 5px",
            borderRadius: 4,
            border: "1px solid var(--border)",
            color: "var(--muted-foreground)",
          }}
        >
          ⌘ K
        </span>
      </a>

      {/* Nav items */}
      <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
        {navItems.map((item) => (
          <a
            key={item.key}
            href="#"
            onClick={(e) => e.preventDefault()}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "7px 10px",
              borderRadius: "calc(var(--radius) * 0.6)",
              color: item.active ? "var(--foreground)" : "var(--muted-foreground)",
              fontSize: 13,
              cursor: "pointer",
              textDecoration: "none",
              background: item.active ? "var(--card)" : "transparent",
              border: item.active ? "1px solid var(--border)" : "1px solid transparent",
              boxShadow: item.active ? "0 1px 0 rgba(0,0,0,0.02)" : "none",
            }}
            onMouseEnter={(e) => {
              if (!item.active) {
                (e.currentTarget as HTMLAnchorElement).style.background = "var(--muted)";
                (e.currentTarget as HTMLAnchorElement).style.color = "var(--foreground)";
              }
            }}
            onMouseLeave={(e) => {
              if (!item.active) {
                (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
                (e.currentTarget as HTMLAnchorElement).style.color = "var(--muted-foreground)";
              }
            }}
          >
            <span style={{ width: 14, height: 14, flexShrink: 0, display: "grid", placeItems: "center" }}>
              {item.icon}
            </span>
            {item.label}
          </a>
        ))}
      </div>

      {/* Recent sessions */}
      {sessions.length > 0 && (
        <div style={{ marginTop: 6, flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: "10.5px",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "var(--muted-foreground)",
              padding: "8px 10px 6px",
            }}
          >
            Recent
          </div>
          <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" }}>
            {renderGroup("This Week", thisWeek, 0)}
            {renderGroup("This Month", thisMonth, 16)}
            {renderGroup("Earlier", earlier, 16)}
          </div>
        </div>
      )}

      {/* User footer */}
      <div
        style={{
          marginTop: "auto",
          padding: 10,
          display: "flex",
          alignItems: "center",
          gap: 10,
          borderTop: "1px solid var(--border)",
        }}
      >
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: "50%",
            background: "linear-gradient(135deg, oklch(0.78 0.14 130), oklch(0.55 0.12 100))",
            color: "var(--primary-foreground)",
            display: "grid",
            placeItems: "center",
            fontSize: 12,
            fontWeight: 600,
            flexShrink: 0,
          }}
        >
          {userInitial}
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 500 }}>{userName}</div>
          <div style={{ fontSize: 11, color: "var(--muted-foreground)" }}>Research Agent</div>
        </div>
      </div>
    </aside>
  );
}

import { useState, useRef } from "react";
import { env } from "@Poneglyph/env/web";

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
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  ),
  library: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 5h18M3 12h18M3 19h12" />
    </svg>
  ),
  spaces: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 7a3 3 0 0 1 3-3h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H7a3 3 0 0 1-3-3z" />
    </svg>
  ),
  discover: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2v4M12 18v4M2 12h4M18 12h4M5 5l3 3M16 16l3 3M5 19l3-3M16 8l3-3" />
    </svg>
  ),
  clock: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  ),
  plus: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  ),
  upload: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  ),
  x: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  ),
  file: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  ),
  check: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
};

const navItems = [
  { key: "research", label: "Research", icon: NavIcons.research, active: true },
  { key: "library", label: "Library", icon: NavIcons.library, active: false },
  { key: "spaces", label: "Spaces", icon: NavIcons.spaces, active: false },
  { key: "discover", label: "Discover", icon: NavIcons.discover, active: false },
];

type UploadStatus = "idle" | "uploading" | "success" | "error";

export function ResearchSidebar({
  sessions,
  activeSessionId,
  onSelectSession,
  onNewSession,
  userName = "User",
  userInitial = "U",
}: ResearchSidebarProps) {
  const thisWeek = sessions.filter((s) => isThisWeek(s.createdAt));

  // Upload modal state
  const [showUpload, setShowUpload] = useState(false);
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>("idle");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [publisher, setPublisher] = useState("");
  const [tags, setTags] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetUpload = () => {
    setUploadFiles([]);
    setUploadStatus("idle");
    setTitle("");
    setDescription("");
    setPublisher("");
    setTags("");
    setIsDragging(false);
  };

  const closeUpload = () => {
    setShowUpload(false);
    resetUpload();
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    setUploadFiles((p) => [...p, ...Array.from(e.dataTransfer.files)]);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadFiles((p) => [...p, ...Array.from(e.target.files ?? [])]);
  };

  const handleUpload = async () => {
    if (!title || !description || uploadFiles.length === 0) return;
    setUploadStatus("uploading");
    const form = new FormData();
    form.append("title", title);
    form.append("description", description);
    if (publisher) form.append("publisher", publisher);
    if (tags) form.append("tags", tags);
    uploadFiles.forEach((f) => form.append("files", f));
    try {
      const res = await fetch(`${env.NEXT_PUBLIC_SERVER_URL}/api/upload`, {
        method: "POST",
        body: form,
        credentials: "include",
      });
      if (!res.ok) throw new Error();
      setUploadStatus("success");
    } catch {
      setUploadStatus("error");
    }
  };
  const thisMonth = sessions.filter((s) => !isThisWeek(s.createdAt) && isThisMonth(s.createdAt));
  const earlier = sessions.filter((s) => !isThisMonth(s.createdAt));

  const renderSession = (session: ResearchSession) => {
    const isActive = session.id === activeSessionId;
    return (
      <a
        key={session.id}
        href="#"
        onClick={(e) => {
          e.preventDefault();
          onSelectSession(session.id);
        }}
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
        <span
          style={{ width: 14, height: 14, flexShrink: 0, display: "grid", placeItems: "center" }}
        >
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
        /* Stretches to match the full content column height so the
           background fills the page; the inner div handles sticky + scroll */
        alignSelf: "stretch",
      }}
    >
      <div
        style={{
          height: "100%",
          overflowY: "hidden",
          padding: "18px 14px",
          display: "flex",
          flexDirection: "column",
          gap: 4,
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
        onClick={(e) => {
          e.preventDefault();
          onNewSession();
        }}
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
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLAnchorElement).style.background = "var(--muted)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLAnchorElement).style.background = "var(--card)";
        }}
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
            <span
              style={{
                width: 14,
                height: 14,
                flexShrink: 0,
                display: "grid",
                placeItems: "center",
              }}
            >
              {item.icon}
            </span>
            {item.label}
          </a>
        ))}
      </div>

      {/* Recent sessions */}
      {sessions.length > 0 && (
        <div
          style={{
            marginTop: 6,
            flex: 1,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
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

      {/* Upload dataset button */}
      <a
        href="#"
        onClick={(e) => { e.preventDefault(); setShowUpload(true); }}
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
          marginTop: 8,
          boxShadow: "0 1px 0 rgba(0,0,0,0.02)",
          textDecoration: "none",
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = "var(--muted)"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = "var(--card)"; }}
      >
        <span style={{ width: 14, height: 14, display: "grid", placeItems: "center" }}>
          {NavIcons.upload}
        </span>
        Upload dataset
      </a>

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
    </div>

    {/* Upload dataset modal */}
    {showUpload && (
      <div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <div
        onClick={(e) => { if (e.target === e.currentTarget) closeUpload(); }}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 50,
          background: "rgba(0,0,0,0.45)",
          backdropFilter: "blur(4px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
        }}
      >
        <div
          style={{
            background: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: "calc(var(--radius) * 1.2)",
            boxShadow: "0 24px 64px -16px rgba(0,0,0,0.28)",
            width: "100%",
            maxWidth: 480,
            maxHeight: "90vh",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px 16px", borderBottom: "1px solid var(--border)" }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 600, color: "var(--foreground)" }}>Upload dataset</div>
              <div style={{ fontSize: 12, color: "var(--muted-foreground)", marginTop: 2 }}>Share your data with the research community</div>
            </div>
            <button
              onClick={closeUpload}
              style={{ width: 28, height: 28, borderRadius: "calc(var(--radius) * 0.6)", border: "1px solid var(--border)", background: "var(--muted)", color: "var(--muted-foreground)", display: "grid", placeItems: "center", cursor: "pointer" }}
            >
              <span style={{ width: 14, height: 14, display: "grid", placeItems: "center" }}>{NavIcons.x}</span>
            </button>
          </div>

          {uploadStatus === "success" ? (
            <div style={{ padding: 40, display: "flex", flexDirection: "column", alignItems: "center", gap: 12, textAlign: "center" }}>
              <div style={{ width: 52, height: 52, borderRadius: "50%", background: "color-mix(in oklch, var(--primary) 20%, var(--card))", border: "1px solid color-mix(in oklch, var(--primary) 35%, var(--border))", display: "grid", placeItems: "center", color: "var(--primary)" }}>
                <span style={{ width: 22, height: 22, display: "grid", placeItems: "center" }}>{NavIcons.check}</span>
              </div>
              <div style={{ fontSize: 15, fontWeight: 600, color: "var(--foreground)" }}>Dataset shared!</div>
              <div style={{ fontSize: 13, color: "var(--muted-foreground)" }}>Your dataset is now part of the Poneglyph ecosystem.</div>
              <button
                onClick={closeUpload}
                style={{ marginTop: 8, padding: "8px 20px", borderRadius: "calc(var(--radius) * 0.8)", background: "var(--primary)", color: "var(--primary-foreground)", border: 0, fontSize: 13, fontWeight: 500, cursor: "pointer" }}
              >
                Done
              </button>
            </div>
          ) : (
            <div style={{ padding: "20px 24px 24px", display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Title */}
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label style={{ fontSize: 12, fontWeight: 500, color: "var(--foreground)" }}>Title <span style={{ color: "var(--destructive)" }}>*</span></label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Global Health Survey 2025"
                  style={{ padding: "8px 12px", borderRadius: "calc(var(--radius) * 0.8)", border: "1px solid var(--border)", background: "var(--background)", color: "var(--foreground)", fontSize: 13, outline: "none" }}
                  onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = "var(--primary)"; }}
                  onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = "var(--border)"; }}
                />
              </div>

              {/* Description */}
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label style={{ fontSize: 12, fontWeight: 500, color: "var(--foreground)" }}>Description <span style={{ color: "var(--destructive)" }}>*</span></label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What does this dataset contain?"
                  rows={3}
                  style={{ padding: "8px 12px", borderRadius: "calc(var(--radius) * 0.8)", border: "1px solid var(--border)", background: "var(--background)", color: "var(--foreground)", fontSize: 13, outline: "none", resize: "none", fontFamily: "inherit" }}
                  onFocus={(e) => { (e.target as HTMLTextAreaElement).style.borderColor = "var(--primary)"; }}
                  onBlur={(e) => { (e.target as HTMLTextAreaElement).style.borderColor = "var(--border)"; }}
                />
              </div>

              {/* Publisher + Tags */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <label style={{ fontSize: 12, fontWeight: 500, color: "var(--foreground)" }}>Publisher</label>
                  <input
                    value={publisher}
                    onChange={(e) => setPublisher(e.target.value)}
                    placeholder="e.g., WHO"
                    style={{ padding: "8px 12px", borderRadius: "calc(var(--radius) * 0.8)", border: "1px solid var(--border)", background: "var(--background)", color: "var(--foreground)", fontSize: 13, outline: "none" }}
                    onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = "var(--primary)"; }}
                    onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = "var(--border)"; }}
                  />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <label style={{ fontSize: 12, fontWeight: 500, color: "var(--foreground)" }}>Tags</label>
                  <input
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="health, 2025"
                    style={{ padding: "8px 12px", borderRadius: "calc(var(--radius) * 0.8)", border: "1px solid var(--border)", background: "var(--background)", color: "var(--foreground)", fontSize: 13, outline: "none" }}
                    onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = "var(--primary)"; }}
                    onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = "var(--border)"; }}
                  />
                </div>
              </div>

              {/* File drop zone */}
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label style={{ fontSize: 12, fontWeight: 500, color: "var(--foreground)" }}>Files <span style={{ color: "var(--destructive)" }}>*</span></label>
                {uploadFiles.length === 0 ? (
                  <label
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleFileDrop}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 10,
                      padding: "28px 16px",
                      border: `2px dashed ${isDragging ? "var(--primary)" : "var(--border)"}`,
                      borderRadius: "calc(var(--radius) * 0.8)",
                      background: isDragging ? "color-mix(in oklch, var(--primary) 6%, var(--background))" : "var(--muted)",
                      cursor: "pointer",
                      transition: "all 160ms ease",
                    }}
                  >
                    <span style={{ width: 22, height: 22, display: "grid", placeItems: "center", color: "var(--muted-foreground)" }}>{NavIcons.upload}</span>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: 13, fontWeight: 500, color: "var(--foreground)" }}>Drag & drop or click to upload</div>
                      <div style={{ fontSize: 11, color: "var(--muted-foreground)", marginTop: 3 }}>CSV, JSON, PDF — max 50 MB each</div>
                    </div>
                    <input ref={fileInputRef} type="file" multiple onChange={handleFileInput} accept=".csv,.json,.pdf" style={{ display: "none" }} />
                  </label>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {uploadFiles.map((f, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: "calc(var(--radius) * 0.8)", border: "1px solid var(--border)", background: "var(--muted)" }}>
                        <span style={{ width: 16, height: 16, display: "grid", placeItems: "center", color: "var(--muted-foreground)", flexShrink: 0 }}>{NavIcons.file}</span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 12, fontWeight: 500, color: "var(--foreground)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f.name}</div>
                          <div style={{ fontSize: 11, color: "var(--muted-foreground)" }}>{(f.size / (1024 * 1024)).toFixed(2)} MB</div>
                        </div>
                        {uploadStatus === "idle" && (
                          <button onClick={() => setUploadFiles((p) => p.filter((_, j) => j !== i))} style={{ border: 0, background: "transparent", color: "var(--muted-foreground)", cursor: "pointer", display: "grid", placeItems: "center", padding: 4 }}>
                            <span style={{ width: 14, height: 14, display: "grid", placeItems: "center" }}>{NavIcons.x}</span>
                          </button>
                        )}
                        {uploadStatus === "uploading" && (
                          <div style={{ width: 14, height: 14, borderRadius: "50%", border: "2px solid var(--primary)", borderTopColor: "transparent", animation: "spin 0.7s linear infinite", flexShrink: 0 }} />
                        )}
                      </div>
                    ))}
                    {uploadStatus === "idle" && (
                      <button onClick={() => fileInputRef.current?.click()} style={{ fontSize: 12, color: "var(--muted-foreground)", background: "transparent", border: 0, cursor: "pointer", textAlign: "left", padding: "2px 0", textDecoration: "underline" }}>
                        + Add more files
                        <input ref={fileInputRef} type="file" multiple onChange={handleFileInput} accept=".csv,.json,.pdf" style={{ display: "none" }} />
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Error banner */}
              {uploadStatus === "error" && (
                <div style={{ padding: "10px 14px", borderRadius: "calc(var(--radius) * 0.8)", background: "color-mix(in oklch, var(--destructive) 10%, var(--card))", border: "1px solid color-mix(in oklch, var(--destructive) 25%, var(--border))", color: "var(--destructive)", fontSize: 13 }}>
                  Upload failed. Please try again.
                </div>
              )}

              {/* Actions */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 10, paddingTop: 4, borderTop: "1px solid var(--border)", marginTop: 4 }}>
                <button
                  onClick={closeUpload}
                  disabled={uploadStatus === "uploading"}
                  style={{ padding: "8px 16px", borderRadius: "calc(var(--radius) * 0.8)", border: "1px solid var(--border)", background: "transparent", color: "var(--muted-foreground)", fontSize: 13, fontWeight: 500, cursor: "pointer" }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpload}
                  disabled={!title || !description || uploadFiles.length === 0 || uploadStatus === "uploading"}
                  style={{
                    padding: "8px 20px",
                    borderRadius: "calc(var(--radius) * 0.8)",
                    background: "var(--primary)",
                    color: "var(--primary-foreground)",
                    border: 0,
                    fontSize: 13,
                    fontWeight: 500,
                    cursor: (!title || !description || uploadFiles.length === 0 || uploadStatus === "uploading") ? "not-allowed" : "pointer",
                    opacity: (!title || !description || uploadFiles.length === 0) ? 0.5 : 1,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  {uploadStatus === "uploading" ? (
                    <>
                      <div style={{ width: 12, height: 12, borderRadius: "50%", border: "2px solid currentColor", borderTopColor: "transparent", animation: "spin 0.7s linear infinite" }} />
                      Uploading…
                    </>
                  ) : "Share dataset"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      </div>
    )}
    </aside>
  );
}

interface ResearchChatMessageProps {
  content: string;
}

export function ResearchChatMessage({ content }: ResearchChatMessageProps) {
  return (
    <div
      className="rounded-xl border border-border bg-card px-5 py-4"
      style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.04), 0 24px 48px -24px rgba(0,0,0,0.10)" }}
    >
      <p className="text-[15px] leading-relaxed text-foreground">{content}</p>
    </div>
  );
}

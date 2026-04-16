interface ResearchChatMessageProps {
  content: string;
}

export function ResearchChatMessage({ content }: ResearchChatMessageProps) {
  return (
    <div className="rounded-xl border border-border bg-card px-5 py-4 shadow-sm">
      <p className="text-[15px] leading-relaxed text-foreground">{content}</p>
    </div>
  );
}

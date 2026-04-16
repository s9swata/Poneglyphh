"use client";

import { ActivityItem } from "@/components/cards";

const feedItems = [
  { user: "UNODC Data", action: "uploaded global statistics report", avatarColor: "bg-black" },
  {
    user: "AI Agent",
    action: "extracted 847 insights from",
    target: "UNODC dataset",
    avatarColor: "bg-primary",
    textBlack: true,
  },
  {
    user: "Polaris Project",
    action: "submitted fresh hotline datasets",
    avatarColor: "bg-[#25C5FA]",
  },
  {
    user: "AI Agent",
    action: "matched 12 cross-border data points to",
    target: "Europol DB",
    avatarColor: "bg-primary",
    textBlack: true,
  },
  {
    user: "Research Bot",
    action: "generated longitudinal trend report",
    avatarColor: "bg-success",
  },
  { user: "A21 Campaign", action: "uploaded field recovery data", avatarColor: "bg-[#f4a261]" },
  {
    user: "Campaign Agent",
    action: "launched data monitor in",
    target: "Region 4",
    avatarColor: "bg-error",
  },
  { user: "NCMEC", action: "contributed child welfare dataset", avatarColor: "bg-black" },
];

export function LiveFeedPanel() {
  return (
    <div className="bg-white border border-grey-3 rounded-2xl overflow-hidden h-full">
      <div className="flex items-center justify-between px-4 py-3 border-b border-grey-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <span className="text-xs font-medium text-black">Live Activity Feed</span>
        </div>
        <span className="text-[10px] text-grey-2 bg-grey-4 px-2 py-0.5 rounded-full">
          Real-time
        </span>
      </div>
      <div className="flex flex-col divide-y divide-grey-3/50">
        {feedItems.map((a, i) => (
          <ActivityItem
            key={i}
            user={a.user}
            action={a.action}
            target={a.target}
            avatarColor={a.avatarColor}
          />
        ))}
      </div>
    </div>
  );
}

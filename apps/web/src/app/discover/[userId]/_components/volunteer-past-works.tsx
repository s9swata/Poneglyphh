import { IconBriefcase } from "@tabler/icons-react";

interface VolunteerPastWorksProps {
  pastWorks: string[];
}

export function VolunteerPastWorks({ pastWorks }: VolunteerPastWorksProps) {
  if (pastWorks.length === 0) {
    return (
      <div className="text-sm text-muted-foreground py-4">
        No past works listed yet.
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-3">
      {pastWorks.map((work, index) => (
        <li
          key={index}
          className="flex gap-3 rounded-xl border border-border bg-card p-4"
        >
          <span className="mt-0.5 shrink-0">
            <IconBriefcase className="w-4 h-4 text-primary" />
          </span>
          <p className="text-sm text-foreground leading-relaxed">{work}</p>
        </li>
      ))}
    </ul>
  );
}

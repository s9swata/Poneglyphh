import Link from "next/link";
import type { VolunteerListItem } from "@/lib/types";
import { Badge } from "@Poneglyph/ui/components/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@Poneglyph/ui/components/avatar";
import { IconMapPin, IconBriefcase } from "@tabler/icons-react";

interface VolunteerCardProps {
  volunteer: VolunteerListItem;
}

export function VolunteerCard({ volunteer }: VolunteerCardProps) {
  const initials = volunteer.name
    ? volunteer.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  return (
    <Link
      href={`/discover/${volunteer.userId}`}
      className="group flex flex-col h-full overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-primary/30"
    >
      <div className="flex flex-col flex-1 p-5 gap-4">
        <div className="flex items-center gap-3">
          <Avatar className="w-12 h-12 shrink-0">
            {volunteer.image && <AvatarImage src={volunteer.image} alt={volunteer.name ?? "Volunteer"} />}
            <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
              {initials}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0">
            <h3 className="text-base font-bold leading-tight tracking-tight text-foreground group-hover:text-primary transition-colors truncate">
              {volunteer.name ?? "Anonymous Volunteer"}
            </h3>
            {volunteer.city && (
              <div className="flex items-center gap-1 mt-0.5 text-xs text-muted-foreground">
                <IconMapPin className="w-3 h-3 shrink-0" />
                <span className="truncate">{volunteer.city}</span>
              </div>
            )}
          </div>
        </div>

        {volunteer.description && (
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
            {volunteer.description}
          </p>
        )}

        <div className="mt-auto flex flex-wrap gap-1.5">
          {volunteer.tags.slice(0, 3).map((tag) => (
            <Badge
              key={tag.id}
              variant="secondary"
              className="px-2 py-0 text-[10px] font-normal rounded-md bg-secondary/50 hover:bg-secondary"
            >
              {tag.name}
            </Badge>
          ))}
          {volunteer.tags.length > 3 && (
            <Badge
              variant="secondary"
              className="px-2 py-0 text-[10px] font-normal rounded-md bg-secondary/50"
            >
              +{volunteer.tags.length - 3}
            </Badge>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 border-t border-border/50 bg-muted/20 px-5 py-3">
        <IconBriefcase className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
        <span className="text-xs text-muted-foreground">
          {volunteer.pastWorks?.length ?? 0} past{" "}
          {(volunteer.pastWorks?.length ?? 0) === 1 ? "project" : "projects"}
        </span>
      </div>
    </Link>
  );
}

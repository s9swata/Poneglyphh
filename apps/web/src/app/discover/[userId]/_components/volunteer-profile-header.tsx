import { Avatar, AvatarFallback, AvatarImage } from "@Poneglyph/ui/components/avatar";
import { Badge } from "@Poneglyph/ui/components/badge";
import { IconMapPin } from "@tabler/icons-react";
import type { VolunteerProfile } from "@/lib/types";

interface VolunteerProfileHeaderProps {
  volunteer: VolunteerProfile;
}

export function VolunteerProfileHeader({ volunteer }: VolunteerProfileHeaderProps) {
  const initials = volunteer.name
    ? volunteer.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  return (
    <div className="flex flex-col sm:flex-row gap-6 items-start">
      <Avatar className="w-24 h-24 rounded-xl border border-border shrink-0">
        {volunteer.image && <AvatarImage src={volunteer.image} alt={volunteer.name ?? "Volunteer"} />}
        <AvatarFallback className="rounded-xl text-2xl font-bold bg-primary/10 text-primary">
          {initials}
        </AvatarFallback>
      </Avatar>

      <div className="flex flex-col gap-3">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          {volunteer.name ?? "Anonymous Volunteer"}
        </h1>

        {volunteer.city && (
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <IconMapPin className="w-4 h-4 shrink-0" />
            <span>{volunteer.city}</span>
          </div>
        )}

        {volunteer.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {volunteer.tags.map((tag) => (
              <Badge
                key={tag.id}
                variant="secondary"
                className="px-2.5 py-0.5 text-xs font-medium rounded-md bg-secondary/50 hover:bg-secondary"
              >
                {tag.name}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

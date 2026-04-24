import { notFound } from "next/navigation";
import Link from "next/link";
import { Separator } from "@Poneglyph/ui/components/separator";
import { IconArrowLeft } from "@tabler/icons-react";
import { apiClient } from "@/lib/api-client";
import { VolunteerProfileHeader } from "./_components/volunteer-profile-header";
import { VolunteerPastWorks } from "./_components/volunteer-past-works";

type Props = {
  params: Promise<{ userId: string }>;
};

export default async function VolunteerProfilePage(props: Props) {
  const { userId } = await props.params;

  const res = await apiClient.api.discover.volunteers[":targetUserId"].$get({
    param: { targetUserId: userId },
  });

  if (res.status === 404) {
    notFound();
  }

  if (!res.ok) {
    throw new Error("Failed to load volunteer profile");
  }

  const { volunteer } = await res.json();

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Link
        href="/discover"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        <IconArrowLeft className="w-4 h-4" />
        Back to Discover
      </Link>

      <div className="flex flex-col gap-8">
        <VolunteerProfileHeader volunteer={volunteer} />

        <Separator className="bg-border" />

        {volunteer.description && (
          <>
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">About</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">{volunteer.description}</p>
            </section>

            <Separator className="bg-border" />
          </>
        )}

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4">Past Works</h2>
          <VolunteerPastWorks pastWorks={volunteer.pastWorks ?? []} />
        </section>
      </div>
    </div>
  );
}

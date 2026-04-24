import { Suspense } from "react";
import { VolunteerGrid } from "./_components/volunteer-grid";
import { VolunteerFilters } from "./_components/volunteer-filters";
import { VolunteerGridSkeleton } from "./_components/volunteer-grid-skeleton";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function DiscoverPage(props: Props) {
  const searchParams = await props.searchParams;

  const city = typeof searchParams.city === "string" ? searchParams.city : undefined;
  const tags = typeof searchParams.tags === "string" ? searchParams.tags : undefined;
  const page = typeof searchParams.page === "string" ? searchParams.page : "1";
  const limit = typeof searchParams.limit === "string" ? searchParams.limit : "20";

  const suspenseKey = JSON.stringify({ city, tags, page, limit });

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8 space-y-4">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Discover Volunteers</h1>
        <VolunteerFilters />
      </div>

      <Suspense key={suspenseKey} fallback={<VolunteerGridSkeleton />}>
        <VolunteerGrid
          city={city}
          tags={tags}
          page={Number(page)}
          limit={Number(limit)}
        />
      </Suspense>
    </div>
  );
}

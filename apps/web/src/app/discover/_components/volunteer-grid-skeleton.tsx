export function VolunteerGridSkeleton() {
  const skeletons = Array.from({ length: 6 });

  return (
    <div className="space-y-6">
      <div className="h-5 w-48 bg-muted animate-pulse rounded-md" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {skeletons.map((_, i) => (
          <div
            key={i}
            className="flex flex-col h-full overflow-hidden rounded-xl border border-border bg-card"
          >
            <div className="flex flex-col flex-1 p-5 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-muted animate-pulse shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 bg-muted animate-pulse rounded-md" />
                  <div className="h-3 w-1/2 bg-muted animate-pulse rounded-md" />
                </div>
              </div>

              <div className="space-y-2">
                <div className="h-3 w-full bg-muted animate-pulse rounded-md" />
                <div className="h-3 w-4/5 bg-muted animate-pulse rounded-md" />
              </div>

              <div className="flex gap-1.5 mt-auto">
                <div className="h-4 w-14 bg-muted animate-pulse rounded-md" />
                <div className="h-4 w-10 bg-muted animate-pulse rounded-md" />
                <div className="h-4 w-16 bg-muted animate-pulse rounded-md" />
              </div>
            </div>

            <div className="flex items-center gap-2 border-t border-border/50 bg-muted/20 px-5 py-3">
              <div className="h-3 w-24 bg-muted animate-pulse rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

"use client";

const COLORS = ["#22242A", "#bfff00", "#25C5FA", "#37955B", "#B3BDBD", "#E5E6E6"];

export function SearchResults({ query, results = [] }: { query: string; results?: any[] }) {
  return (
    <div className="mt-12 w-full max-w-4xl mx-auto">
      <div className="text-left mb-6">
        <h3 className="text-xl font-medium text-black">
          Results for &quot;<span className="text-primary">{query}</span>&quot;
        </h3>
        <p className="text-sm text-grey-1 mt-1">Based on aggregated data from 156,000+ records</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {results.map((result, i) => (
          <div key={i} className="p-6 bg-grey-4 rounded-xl border border-grey-3">
            <p className="text-sm font-medium text-grey-1 mb-4">{result.title}</p>

            {/* Simple bar visualization */}
            {result.type === "bar" && (
              <div className="space-y-3">
                {result.data.map((item: any, j: number) => {
                  const values = result.data.map((d: any) =>
                    typeof d.value === "number" ? d.value : 0,
                  );
                  const maxValue = Math.max(...values);
                  const width =
                    maxValue > 0
                      ? ((typeof item.value === "number" ? item.value : 0) / maxValue) * 100
                      : 0;
                  return (
                    <div key={j} className="flex items-center gap-3">
                      <span className="text-xs text-grey-1 w-24 truncate">{item.name}</span>
                      <div className="flex-1 h-6 bg-grey-3 rounded overflow-hidden">
                        <div
                          className="h-full rounded"
                          style={{
                            width: `${width}%`,
                            backgroundColor: item.color || COLORS[j % COLORS.length],
                          }}
                        />
                      </div>
                      <span className="text-xs font-medium text-black w-16 text-right">
                        {typeof item.value === "number" && item.value > 1000
                          ? `${(item.value / 1000).toFixed(1)}k`
                          : `${item.value}%`}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Simple line/area visualization */}
            {result.type === "area" && (
              <div className="flex items-end justify-between h-40 gap-1">
                {result.data.map((item: any, j: number) => {
                  const values = result.data.map((d: any) =>
                    typeof d.value === "number" ? d.value : 0,
                  );
                  const maxValue = Math.max(...values);
                  const height =
                    maxValue > 0
                      ? ((typeof item.value === "number" ? item.value : 0) / maxValue) * 100
                      : 0;
                  return (
                    <div key={j} className="flex flex-col items-center flex-1">
                      <div
                        className="w-full bg-primary rounded-t min-h-[4px]"
                        style={{ height: `${Math.max(height, 5)}%` }}
                      />
                      <span className="text-[10px] text-grey-1 mt-2 truncate w-full text-center">
                        {item.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Simple donut visualization */}
            {result.type === "donut" && (
              <div className="flex items-center justify-center h-40">
                <div
                  className="relative w-32 h-32 rounded-full border-8 flex items-center justify-center"
                  style={{
                    borderColor: result.data[0]?.color || COLORS[0],
                    borderLeftColor: result.data[1]?.color || COLORS[1],
                    borderRightColor: result.data[2]?.color || COLORS[2],
                    borderBottomColor: result.data[3]?.color || COLORS[3],
                  }}
                >
                  <div className="text-center">
                    <span className="text-lg font-medium text-black">
                      {typeof result.data[0]?.value === "number" ? result.data[0].value : 0}
                    </span>
                    <span className="text-xs text-grey-1">%</span>
                  </div>
                </div>
                <div className="ml-6 space-y-2">
                  {result.data.map((item: any, j: number) => (
                    <div key={j} className="flex items-center gap-2 text-xs">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: item.color || COLORS[j] }}
                      />
                      <span className="text-grey-1">{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 text-center">
        <p className="text-xs text-grey-2">
          Data is synthetic for demonstration purposes. Connect to API for real data.
        </p>
      </div>
    </div>
  );
}

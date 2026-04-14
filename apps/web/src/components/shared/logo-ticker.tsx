"use client";

const partners = [
  "UNICEF",
  "Oxfam",
  "Save The Children",
  "Red Cross",
  "Care International",
  "World Vision",
  "Médecins Sans Frontières",
  "Action Against Hunger",
];

export function LogoTicker() {
  return (
    <div className="w-full overflow-hidden py-8 border-y border-grey-3 bg-white">
      <div className="ticker-wrap">
        <div className="ticker-track">
          {[...partners, ...partners].map((name, i) => (
            <div
              key={i}
              className="flex items-center gap-3 px-8 text-sm font-medium text-grey-2 whitespace-nowrap"
            >
              <div className="w-5 h-5 bg-grey-3 rounded-full" />
              {name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

"use client";

const partners = [
  "Interpol",
  "Europol",
  "UNODC",
  "Polaris",
  "A21",
  "IJM",
  "NCMEC",
  "Hope for Justice",
];

export function TrustTicker() {
  return (
    <section className="py-8 border-y border-grey-3 bg-white">
      <p className="text-center text-xs text-grey-1 mb-6">Trusted by 134 NGOs across 6 regions</p>
      <div className="ticker-wrap">
        <div className="ticker-track">
          {[...partners, ...partners].map((name, i) => (
            <div
              key={i}
              className="flex items-center gap-2 px-10 text-sm font-medium text-grey-1 whitespace-nowrap"
            >
              <div className="w-4 h-4 border border-grey-3 rounded" />
              {name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

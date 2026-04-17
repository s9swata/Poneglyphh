"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, ArrowRight } from "lucide-react";

const categories = [
  { name: "Environmental data", href: "#" },
  { name: "Socio-economic trends", href: "#" },
  { name: "Health & Welfare surveys", href: "#" },
  { name: "Conflict & Displacement", href: "#" },
  { name: "Education benchmarks", href: "#" },
  { name: "Market & Commodity prices", href: "#" },
  { name: "Infrastructure Mapping", href: "#" },
  { name: "Demographic insights", href: "#" },
  { name: "And more", href: "#", special: true },
];

export function DataCategories() {
  return (
    <section className="relative w-full py-24 px-4 bg-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 px-4">
          <h2 className="text-4xl md:text-7xl font-light text-[#2d4a77] tracking-tight leading-tight">
            For <span className="italic font-serif">every</span> dataset journey
          </h2>
          <p className="mt-6 text-xl text-[#2d4a77]/70 font-medium">
            At Poneglyph, we believe discovery begins with accessibility.
          </p>
        </div>

        <div className="relative border-t border-l border-[#2d4a77]/10 grid grid-cols-1 md:grid-cols-3">
          {categories.map((cat, index) => (
            <motion.a
                key={index}
                href={cat.href}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                viewport={{ once: true }}
                className={`flex items-center justify-between p-10 border-r border-b border-[#2d4a77]/10 hover:bg-[#2d4a77]/5 transition-all duration-300 group ${cat.special ? 'bg-[#2d4a77]/5' : ''}`}
            >
                <span className={`text-2xl font-light tracking-tight ${cat.special ? 'font-medium' : ''}`}>
                    {cat.name}
                </span>
                {cat.special ? (
                    <div className="bg-[#1e1e1e] text-white px-6 py-3 rounded-full flex items-center gap-2 group-hover:bg-[#333] transition-colors">
                        <span className="text-sm font-bold">View all</span>
                        <ArrowRight className="w-4 h-4" />
                    </div>
                ) : (
                    <ArrowUpRight className="w-6 h-6 text-[#2d4a77]/30 group-hover:text-[#2d4a77] group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                )}
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}

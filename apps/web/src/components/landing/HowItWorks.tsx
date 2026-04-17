"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const steps = [
  {
    id: "01",
    title: "Browse & Discover",
    description: "Start by exploring our extensive library of humanitarian and environmental datasets sourced from around the globe.",
    image: "/assets/bird1.avif",
    bg: "bg-blue-50/50",
  },
  {
    id: "02",
    title: "Analyze with AI",
    description: "Our dedicated AI agents guide you through every step, extracting patterns and providing key insights automatically.",
    image: "/assets/butterfly.avif",
    bg: "bg-rose-50/50",
  },
  {
    id: "03",
    title: "Submit & Earn",
    description: "Join our community of volunteers. Submit your own data and build your reputation with verified contributions.",
    image: "/assets/swan.avif",
    bg: "bg-emerald-50/50",
  },
];

export function HowItWorks() {
  return (
    <section className="relative w-full py-24 px-4 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-light text-[#2d4a77] tracking-tight">
            How Poneglyph <span className="italic font-serif">works</span>
          </h2>
          <p className="mt-4 text-xl text-[#2d4a77]/70 font-medium">
            Your hub for open data will do whatever it takes to get you the insights you deserve.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`relative aspect-[3/4] rounded-[2.5rem] overflow-hidden border border-[#2d4a77]/10 flex flex-col group ${step.bg}`}
            >
              <div className="absolute top-8 left-8 z-20">
                <span className="text-sm font-bold opacity-60 tracking-wider font-mono">
                  {step.id}
                </span>
                <h3 className="text-3xl font-bold mt-2 text-[#2d4a77]">
                  {step.title}
                </h3>
              </div>

              <div className="flex-1 relative mt-24 px-8 pb-32">
                 <div className="absolute inset-x-8 bottom-32 top-32 flex items-center justify-center">
                    <Image 
                      src={step.image}
                      alt={step.title}
                      width={400}
                      height={400}
                      className="object-contain w-full h-full transform group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                 </div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-8 pt-20 bg-gradient-to-t from-white/90 via-white/40 to-transparent">
                <p className="text-[#2d4a77] font-medium leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

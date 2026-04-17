"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const pillars = [
  {
    title: "Global Data Network",
    description: "Tell us your needs and preferences—our volunteer network will strive to deliver the raw survey data you deserve.",
    image: "/assets/bird4.avif", // Using existing bird asset
  },
  {
    title: "Precision in Details",
    description: "From data cleaning to structured reports, we help you stay on track with thoughtful, AI-powered automation.",
    image: "/assets/butterfly.avif", // Using existing butterfly asset
  },
  {
    title: "Support You Can Count On",
    description: "Build a lasting relationship with a team that knows you and is there as your research needs evolve.",
    image: "/assets/branches4.avif", // Using existing branches asset
  },
];

export function CommunityPillars() {
  return (
    <section className="relative w-full py-32 px-4 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-24">
          <h2 className="text-4xl md:text-7xl font-light text-[#2d4a77] tracking-tight">
            <span className="italic font-serif">Real</span> insights, here for you
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8 text-center">
          {pillars.map((pillar, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="flex flex-col items-center group"
            >
              <div className="relative w-full h-80 mb-12 flex items-center justify-center">
                <div className="absolute inset-0 bg-blue-100/20 rounded-full scale-0 group-hover:scale-100 transition-transform duration-700 ease-out -z-10" />
                <Image
                  src={pillar.image}
                  alt={pillar.title}
                  width={300}
                  height={300}
                  className="object-contain max-h-full transition-transform duration-500 group-hover:-translate-y-4"
                />
              </div>
              <h3 className="text-2xl font-bold mb-6 text-[#2d4a77]">
                {pillar.title}
              </h3>
              <p className="text-lg text-[#2d4a77]/70 font-medium leading-relaxed max-w-sm">
                {pillar.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

const posts = [
  {
    title: "Poneglyph raises $12M to accelerate open data accessibility",
    category: "News",
    image: "/assets/bird2.avif",
    summary: "A major milestone in our journey to democratize data for NGOs and researchers worldwide.",
    link: "#"
  },
  {
    title: "How AI is uncovering hidden trends in climate dataset extraction",
    category: "Research",
    image: "/assets/branches.avif",
    summary: "Deep dive into our latest agentic workflows for environmental survey processing.",
    link: "#"
  },
  {
    title: "Volunteer spotlight: Meet the people mapping remote regions",
    category: "Community",
    image: "/assets/bird3.avif",
    summary: "Stories from the frontline of data collection in underserved communities.",
    link: "#"
  }
];

export function BlogSection() {
  return (
    <section className="relative w-full py-32 px-4 bg-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
            <div className="max-w-xl">
                <h2 className="text-4xl md:text-7xl font-light text-[#2d4a77] tracking-tight leading-tight">
                    What's <span className="italic font-serif">new</span> on our hub
                </h2>
                <p className="mt-6 text-xl text-[#2d4a77]/70 font-medium">
                    Insights, tips, and breakthroughs from our data community.
                </p>
            </div>
            <a href="#" className="bg-[#1e1e1e] text-white px-8 py-4 rounded-2xl flex items-center gap-2 hover:bg-[#333] transition-all self-start md:self-auto shadow-xl">
                <span className="text-lg font-bold">See our blog</span>
                <ArrowRight className="w-5 h-5" />
            </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {posts.map((post, index) => (
                <motion.a
                    key={index}
                    href={post.link}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex flex-col group"
                >
                    <div className="relative aspect-[16/10] rounded-[2rem] overflow-hidden mb-8 shadow-lg border border-[#2d4a77]/10">
                        <Image 
                            src={post.image}
                            alt={post.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out p-8"
                        />
                        <div className="absolute inset-0 bg-[#2d4a77]/5 group-hover:bg-transparent transition-colors" />
                    </div>
                    
                    <div className="flex flex-col space-y-4">
                        <span className="bg-[#2d4a77]/10 text-[#2d4a77] px-4 py-1.5 rounded-full text-sm font-bold w-fit uppercase tracking-wider">
                            {post.category}
                        </span>
                        <h3 className="text-2xl font-bold text-[#2d4a77] group-hover:text-blue-600 transition-colors leading-tight">
                            {post.title}
                        </h3>
                        <p className="text-lg text-[#2d4a77]/60 font-medium line-clamp-2">
                            {post.summary}
                        </p>
                    </div>
                </motion.a>
            ))}
        </div>
      </div>
    </section>
  );
}

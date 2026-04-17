"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { HowItWorks } from "../components/landing/HowItWorks";
import { DataCategories } from "../components/landing/DataCategories";
import { CommunityPillars } from "../components/landing/CommunityPillars";
import { BlogSection } from "../components/landing/BlogSection";

export default function Home() {
  const containerRef = useRef<HTMLElement>(null);
  const cloudRef = useRef<HTMLImageElement>(null);

  useGSAP(
    () => {
      gsap.set(cloudRef.current, {
        y: "50%",
        scale: 1.5,
        transformOrigin: "bottom center",
      });
      gsap.fromTo(
        cloudRef.current,
        { x: "-130%" },
        { x: "-30%", duration: 2.5, ease: "power1.out", delay: 0.5 },
      );
    },
    { scope: containerRef },
  );

  return (
    <main
      ref={containerRef}
      className="w-full relative overflow-x-hidden text-[#2d4a77]"
    >
      {/* Fixed animated gradient background for the entire landing page */}
      <div className="fixed inset-0 z-[-1] bg-gradient-to-b from-[#708db8] via-[#a8c1d8] to-[#edf2f8] bg-[length:100%_200%] animate-sky-gradient pointer-events-none" />

      {/* --- SECTION 1: HERO (100vh) --- */}
      <section className="relative w-full h-screen z-[1]">
        <div className="relative z-20 w-full h-full flex flex-col items-center justify-center pt-20">
          <h1 className="text-6xl md:text-9xl font-black drop-shadow-sm text-center mb-6 tracking-tighter">
            Poneglyph
          </h1>
          <p className="text-xl md:text-4xl font-medium opacity-90 drop-shadow-sm max-w-2xl text-center px-4">
            The world's <span className="italic font-serif">open</span> dataset
            hub.
          </p>
        </div>

        {/* Cloud layer */}
        <img
          ref={cloudRef}
          src="/assets/cloud_big.avif"
          alt="Big Cloud"
          className="absolute bottom-0 left-0 w-full object-cover z-[1] pointer-events-none"
          style={{
            transform: "translateX(-100%) scale(1.5)",
            transformOrigin: "bottom center",
          }}
        />

        {/* Swans and Birds */}
        <div className="absolute inset-0 z-[5] pointer-events-none">
          <Image
            src="/assets/bird1.avif"
            alt="Bird 1"
            width={200}
            height={200}
            className="absolute z-10 top-[20%] right-[25%] w-18 md:w-34 object-contain opacity-100"
          />
          <Image
            src="/assets/bird3.avif"
            alt="Bird 3"
            width={200}
            height={200}
            className="absolute z-20 top-[35%] right-[10%] w-22 md:w-42 object-contain opacity-100"
          />
          <Image
            src="/assets/bird2.avif"
            alt="Bird 2"
            width={200}
            height={200}
            className="absolute z-30 top-[60%] right-[20%] w-22 md:w-42 object-contain opacity-100"
          />
          <Image
            src="/assets/bird3.avif"
            alt="Bird 3"
            width={200}
            height={200}
            className="absolute z-20 top-[75%] right-[40%] w-24 md:w-46 object-contain opacity-100"
          />
          <Image
            src="/assets/bird2.avif"
            alt="Bird 2"
            width={200}
            height={200}
            className="absolute z-30 top-[90%] left-[20%] w-26 md:w-52 object-contain opacity-100"
          />
        </div>
      </section>

      {/* --- CONTENT SECTIONS --- */}
      <div className="relative z-[2] bg-white/20 backdrop-blur-3xl shadow-[0_-50px_100px_rgba(0,0,0,0.05)] rounded-t-[4rem]">
        {/* SECTION 2: HOW IT WORKS */}
        <HowItWorks />

        {/* SECTION 3: CATEGORIES */}
        <DataCategories />

        {/* SECTION 4: COMMUNITY PILLARS */}
        <CommunityPillars />

        {/* SECTION 5: BLOG SECTION */}
        <BlogSection />

        {/* --- DECORATIVE FOOTER BRANCHES --- */}
        <section className="relative w-full h-[60vh] z-[4] overflow-hidden flex items-center justify-center">
          {/* Left Branches */}
          <img
            src="/assets/branches.avif"
            alt="Tree Branches Left"
            className="absolute top-[10%] left-[-5%] w-[40%] md:w-[30%] object-contain opacity-90 pointer-events-none drop-shadow-2xl z-[5]"
          />
          {/* Right Top Branches */}
          <img
            src="/assets/branches3.avif"
            alt="Tree Branches Right Top"
            className="absolute top-[-5%] right-[-5%] w-[45%] md:w-[35%] object-contain opacity-90 pointer-events-none drop-shadow-2xl z-[5]"
          />
          {/* Right Bottom Branches with Bird */}
          <div className="absolute bottom-[5%] right-[-5%] w-[50%] md:w-[40%] z-[6] pointer-events-none">
            <img
              src="/assets/branches4.avif"
              alt="Tree Branches Right Bottom"
              className="w-full object-contain opacity-95 drop-shadow-2xl"
            />
            <img
              src="/assets/sparrow.svg"
              alt="Sparrow"
              className="absolute top-[-20%] left-[30%] w-[20%] md:w-[15%] object-contain drop-shadow-lg"
              style={{ transform: "scaleX(-1)" }} // Flips the bird to look inward
            />
          </div>

          <div className="relative z-10 text-center">
            <h3 className="text-4xl md:text-6xl font-light tracking-tight text-[#2d4a77]">
              Ready to explore the{" "}
              <span className="italic font-serif">unseen</span>?
            </h3>
            <button className="mt-12 bg-[#1e1e1e] text-white px-12 py-5 rounded-3xl text-xl font-bold hover:scale-105 transition-all shadow-2xl">
              Get Started Now
            </button>
          </div>
        </section>
      </div>

      {/* Background decoration: Cloud positioned lower */}
      <img
        src="/assets/cloud.avif"
        alt="Small Cloud decoration"
        className="fixed top-[150vh] right-[-5%] w-[40%] object-contain z-[0] opacity-30 pointer-events-none mix-blend-multiply"
      />
    </main>
  );
}

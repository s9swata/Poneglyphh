"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export function LandingCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const slides = [
    {
      title: "Extract Datasets",
      description: "Poneglyph helps you extract hard-to-reach datasets efficiently.",
      image: "📊"
    },
    {
      title: "Submit Data",
      description: "Volunteers can easily submit and structure new data for the community.",
      image: "🙌"
    },
    {
      title: "AI-Powered Insights",
      description: "Agents automatically provide key insights and trends from raw datasets.",
      image: "🤖"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="relative w-full max-w-2xl mx-auto bg-white/20 backdrop-blur-md border border-white/30 rounded-3xl p-8 shadow-2xl overflow-hidden flex flex-col items-center text-center">
      <div 
        className="w-full flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {slides.map((slide, i) => (
          <div key={i} className="min-w-full flex flex-col items-center justify-center space-y-6">
            <div className="text-6xl">{slide.image}</div>
            <h3 className="text-3xl font-bold text-[#2d4a77]">{slide.title}</h3>
            <p className="text-xl text-[#3b5d8a]">{slide.description}</p>
          </div>
        ))}
      </div>
      <div className="flex gap-2 mt-8">
        {slides.map((_, i) => (
          <div 
            key={i} 
            className={`w-3 h-3 rounded-full transition-colors duration-300 ${i === currentIndex ? 'bg-[#2d4a77]' : 'bg-[#2d4a77]/30'}`}
          />
        ))}
      </div>
    </div>
  );
}

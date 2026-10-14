"use client";

import React from "react";
import Paragraph from "@/components/Paragraph";

const STEPS = [
  {
    step: "01",
    name: "Audit",
    desc: "We review your website, marketing, and tracking to identify gaps, missed opportunities, and areas for improvement.",
  },
  {
    step: "02",
    name: "Plan",
    desc: "We build a prioritized roadmap based on your goals, expected impact, and business requirements.",
  },
  {
    step: "03",
    name: "Build",
    desc: "Our team implements the agreed website improvements, campaigns, AI solutions, and integrations.",
  },
  {
    step: "04",
    name: "Optimize",
    desc: "We use performance data to identify improvements and continuously refine the systems we've built.",
  },
];

export default function ServicesProcessSection() {
  return (
    <section className="relative w-full border-t border-black/10 bg-[#FFFFFE] py-16 md:py-24">
      {/* Section Header: Process */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/5 border border-black/10 text-xs font-mono font-medium tracking-wider uppercase text-neutral-600 mb-4">
          <span>Execution Process</span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-[#09090b]">
          Audit First. Build Second. Optimize Forever.
        </h2>
        <p className="mt-4 text-base sm:text-lg text-neutral-600 max-w-2xl mx-auto leading-relaxed">
          Every engagement follows a clear process, so you know what we're doing, why it matters, and what comes next.
        </p>
      </div>

      {/* 4 Steps Timeline */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 mt-12">
        <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Subtle connecting line for desktop */}
          <div
            aria-hidden="true"
            className="hidden lg:block absolute top-7 left-12 right-12 h-[2px] bg-black/10 z-0"
          />

          {STEPS.map((st, i) => (
            <div
              key={st.step}
              className="relative z-10 flex flex-col p-6 rounded-2xl bg-black/[0.02] border border-black/10 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:border-black/20"
            >
              {/* Step indicator */}
              <div className="flex items-center justify-between mb-4">
                <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#09090b] text-[#FFFFFE] font-mono text-sm font-bold shadow-md">
                  {st.step}
                </span>
                <span className="font-mono text-xs uppercase tracking-widest text-neutral-400 font-semibold">
                  Phase {i + 1}
                </span>
              </div>

              {/* Step Name */}
              <h3 className="text-xl font-bold tracking-tight text-[#09090b] mb-2">
                {st.name}
              </h3>

              {/* Step Description */}
              <p className="text-sm text-neutral-600 leading-relaxed font-normal">
                {st.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export { ServicesProcessSection };

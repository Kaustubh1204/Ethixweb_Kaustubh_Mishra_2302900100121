"use client";

import React from "react";
import { DynamicFrameLayout, Frame } from "@/components/ui/dynamic-frame-layout";

const demoFrames: Frame[] = [
  {
    id: 1,
    title: "AI Receptionists",
    description: "Voice and chat agents that answer, qualify, route, and book leads while your team stays focused.",
    video: "/videos/WhatsApp%20Video%202026-10-14%20at%2012.02.40%20PM.mp4",
    defaultPos: { x: 0, y: 0, w: 4, h: 4 },
    mediaSize: 1,
    isHovered: false,
  },
  {
    id: 2,
    title: "AI Automation",
    description: "Workflow automation, internal copilots, data syncs, and operational systems built for real teams.",
    video: "/videos/WhatsApp%20Video%202026-10-14%20at%2012.02.36%20PM.mp4",
    defaultPos: { x: 4, y: 0, w: 4, h: 4 },
    mediaSize: 1,
    isHovered: false,
  },
  {
    id: 3,
    title: "Websites",
    description: "Fast, premium websites with sharp positioning, conversion paths, analytics, and SEO foundations.",
    video: "/videos/WhatsApp%20Video%202026-10-14%20at%2012.02.30%20PM.mp4",
    defaultPos: { x: 8, y: 0, w: 4, h: 4 },
    mediaSize: 1,
    isHovered: false,
  },
  {
    id: 4,
    title: "Web Applications",
    description: "Custom portals, dashboards, booking flows, and software tools engineered for daily operations.",
    video: "/videos/WhatsApp%20Video%202026-10-14%20at%2012.02.23%20PM.mp4",
    defaultPos: { x: 0, y: 4, w: 4, h: 4 },
    mediaSize: 1,
    isHovered: false,
  },
  {
    id: 5,
    title: "CRM Integrations",
    description: "HubSpot, GoHighLevel, Salesforce, and custom database pipelines wired directly to your front desk.",
    video: "/videos/WhatsApp%20Video%202026-10-14%20at%2012.02.13%20PM.mp4",
    defaultPos: { x: 4, y: 4, w: 4, h: 4 },
    mediaSize: 1,
    isHovered: false,
  },
  {
    id: 6,
    title: "Lead Generation",
    description: "Targeted outbound systems and paid acquisition engines optimized for high-ticket service agreements.",
    video: "/videos/WhatsApp%20Video%202026-10-14%20at%2012.02.17%20PM.mp4",
    defaultPos: { x: 8, y: 4, w: 4, h: 4 },
    mediaSize: 1,
    isHovered: false,
  },
];

export function Robust() {
  const [activeTouchId, setActiveTouchId] = React.useState<number | null>(null);

  return (
    <section className="relative w-full py-10 sm:py-16 md:py-20 bg-[#FFFFFE] border-t border-black/10 overflow-hidden flex flex-col justify-center items-center px-4 sm:px-6 md:px-8">
      {/* Desktop View: Dynamic expanding layout */}
      <div className="hidden lg:block w-full max-w-6xl h-[75vh] min-h-[550px]">
        <DynamicFrameLayout 
          frames={demoFrames} 
          className="w-full h-full rounded-2xl overflow-hidden" 
          hoverSize={5}
          gapSize={12}
        />
      </div>

      {/* Mobile & Tablet View: Responsive Touch Grid */}
      <div className="lg:hidden w-full max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {demoFrames.map((frame) => {
          const isActive = activeTouchId === frame.id;
          return (
            <div
              key={frame.id}
              onClick={() => setActiveTouchId(isActive ? null : frame.id)}
              className="relative aspect-video rounded-2xl overflow-hidden shadow-lg border border-black/10 cursor-pointer group bg-black"
            >
              <video
                src={frame.video}
                autoPlay
                loop
                muted
                playsInline
                className={`w-full h-full object-cover transition-opacity duration-300 ${
                  isActive ? "opacity-20" : "opacity-100"
                }`}
              />

              {/* Title Badge when not active */}
              {!isActive && (
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                  <span className="px-3 py-1.5 rounded-full bg-black/80 backdrop-blur-md text-white text-xs sm:text-sm font-semibold tracking-tight shadow-md">
                    {frame.title}
                  </span>
                  <span className="text-[10px] text-white/80 bg-black/60 px-2 py-1 rounded-full font-mono uppercase tracking-wider">
                    Tap info
                  </span>
                </div>
              )}

              {/* Active description card on tap */}
              <div
                className={`absolute inset-0 bg-black/90 p-5 flex flex-col justify-center items-center text-center transition-opacity duration-300 ${
                  isActive ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                }`}
              >
                <h3 className="text-base sm:text-lg font-bold text-white mb-2">
                  {frame.title}
                </h3>
                <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed max-w-xs">
                  {frame.description}
                </p>
                <span className="mt-3 text-[10px] font-mono uppercase tracking-widest text-neutral-400">
                  Tap to dismiss
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default Robust;

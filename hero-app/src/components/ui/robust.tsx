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
  return (
    <section className="relative w-full min-h-[85vh] py-12 bg-[#FFFFFE] border-t border-black/10 overflow-hidden flex flex-col justify-center items-center px-4 md:px-8">
      <div className="w-full max-w-6xl h-[75vh] min-h-[550px]">
        <DynamicFrameLayout 
          frames={demoFrames} 
          className="w-full h-full rounded-2xl overflow-hidden" 
          hoverSize={5}
          gapSize={12}
        />
      </div>
    </section>
  );
}

export default Robust;

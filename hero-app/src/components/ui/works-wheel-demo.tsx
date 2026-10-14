"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { WorksWheel, type WorksWheelItem } from "@/components/ui/works-wheel";

const WORKS: WorksWheelItem[] = [
  {
    title: "Website",
    description: "Redesigns, headless builds, landing pages, and ongoing maintenance.",
    video: "/assets3/WhatsApp%20Video%202026-10-14%20at%2012.02.20%20PM.mp4",
    href: "#website",
  },
  {
    title: "AI",
    description: "Chatbots and AI receptionists that qualify and route leads around the clock.",
    video: "/assets3/WhatsApp%20Video%202026-10-14%20at%2012.02.23%20PM.mp4",
    href: "#ai",
  },
  {
    title: "Growth",
    description: "SEO, Google & Meta ads, social, and email working as one engine.",
    video: "/assets3/WhatsApp%20Video%202026-10-14%20at%2012.02.26%20PM.mp4",
    href: "#growth",
  },
  {
    title: "Data",
    description: "Live dashboards, analytics, and monthly reporting for every channel.",
    video: "/assets3/WhatsApp%20Video%202026-10-14%20at%2012.02.30%20PM.mp4",
    href: "#data",
  },
  {
    title: "Accessibility",
    description: "Improvements and testing reviewed against recognized standards.",
    video: "/assets3/WhatsApp%20Video%202026-10-14%20at%2012.02.33%20PM.mp4",
    href: "#accessibility",
  },
  {
    title: "Support",
    description: "A real team on technical support, content, and API maintenance.",
    video: "/assets3/WhatsApp%20Video%202026-10-14%20at%2012.02.36%20PM.mp4",
    href: "#support",
  },
];

export default function WorksWheelDemo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState<number>(0);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const container = containerRef.current;
    if (!container) return;

    // Pin across responsive viewport height scroll distance:
    const isMobile = window.innerWidth < 768;
    const trigger = ScrollTrigger.create({
      trigger: container,
      start: "top top",
      end: () => `+=${window.innerHeight * (isMobile ? 3 : 5)}px`,
      pin: true,
      pinSpacing: true,
      scrub: 1.2,
      onUpdate: (self) => {
        setScrollProgress(self.progress);
      },
    });

    const handleResize = () => {
      ScrollTrigger.refresh();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      trigger.kill();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[100svh] bg-[#FFFFFE] text-[#09090b] border-t border-black/10 overflow-hidden"
    >
      <WorksWheel
        items={WORKS}
        label="Works '26"
        action="View"
        externalProgress={scrollProgress}
        className="w-full h-full"
      />
    </div>
  );
}

export { WorksWheelDemo };

"use client";

import React, { useState, useEffect } from "react";
import { FrameSequenceHero, type FrameSequenceStep } from "@/components/ui/mac-book-neo-hero";

const steps: FrameSequenceStep[] = [
  {
    from: 0.02,
    to: 0.35,
    color: "#ffffff",
    num: "01",
    total: "03",
    icon: "✦",
    title: "Seattle",
    description: "Active Projects",
    label: "09:18 PM",
  },
  {
    from: 0.35,
    to: 0.68,
    color: "#ffffff",
    num: "02",
    total: "03",
    icon: "◐",
    title: "Utah",
    description: "Maintenance & Support",
    label: "10:18 PM",
  },
  {
    from: 0.68,
    to: 1.01,
    color: "#ffffff",
    num: "03",
    total: "03",
    icon: "▣",
    title: "New York",
    description: "Strategy & Growth",
    label: "12:18 AM",
  },
];

export default function GlobalOperationsNetwork() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  // Step frame intervals: mobile uses ~118 frames, desktop uses ~470 frames
  const frameStep = isMobile ? 8 : 2;
  const frameCount = Math.floor(941 / frameStep);
  const framePath = (i: number) => {
    const realIdx = Math.min(941, Math.max(1, (i - 1) * frameStep + 1));
    return `https://raw.githubusercontent.com/duthiljean/hero-apple/main/frames/frame_${String(realIdx).padStart(4, "0")}.jpg`;
  };

  return (
    <section className="relative w-full bg-[#FFFFFE] text-[#09090b] border-t border-black/10">
      <FrameSequenceHero
        frameCount={frameCount}
        framePath={framePath}
        eagerCount={isMobile ? 4 : 8}
        scrollHeight="500vh"
        title={null}
        subtitle=""
        steps={steps}
      />
    </section>
  );
}

export { GlobalOperationsNetwork };

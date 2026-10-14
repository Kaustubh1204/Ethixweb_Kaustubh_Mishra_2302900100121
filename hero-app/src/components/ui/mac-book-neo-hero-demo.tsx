"use client";

import { FrameSequenceHero, type FrameSequenceStep } from "@/components/ui/mac-book-neo-hero";

const FRAME_COUNT = 941;
const framePath = (i: number) =>
  `https://raw.githubusercontent.com/duthiljean/hero-apple/main/frames/frame_${String(i).padStart(4, "0")}.jpg`;

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

export default function MacBookNeoHeroDemo() {
  return (
    <section className="relative w-full bg-[#FFFFFE] text-[#09090b] border-t border-black/10">
      <FrameSequenceHero
        frameCount={FRAME_COUNT}
        framePath={framePath}
        eagerCount={80}
        scrollHeight="500vh"
        title={null}
        subtitle=""
        steps={steps}
      />
    </section>
  );
}

export { MacBookNeoHeroDemo };

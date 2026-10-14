"use client";

import React, { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { Preloader } from "@/components/Preloader";
import { HeroImages } from "@/components/HeroImages";
import { HeroHeader } from "@/components/HeroHeader";

export const HeroApp: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const preloaderRef = useRef<HTMLDivElement>(null);
  const [showPreloader, setShowPreloader] = useState(true);

  useEffect(() => {
    // 1. Check if user already saw preloader in this session or prefers reduced motion
    const isRepeat =
      typeof window !== "undefined" &&
      sessionStorage.getItem("ethix_preloader_seen") === "true";
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (isRepeat || prefersReducedMotion) {
      setShowPreloader(false);
      return;
    }

    // Mark as seen for subsequent visits
    sessionStorage.setItem("ethix_preloader_seen", "true");

    const ctx = gsap.context(() => {
      // 2. Initial State Setup (Never hide the hero heading, text, or images)
      const navEl = document.querySelector("nav");
      if (navEl) gsap.set(navEl, { y: -50, opacity: 0.8 });
      gsap.set(".progress-bar", { scaleX: 0, transformOrigin: "right center" });
      gsap.set(".preloader-content", { x: 0, opacity: 1, scale: 1 });

      // Reset digit tickers to top position 0
      gsap.set([".digit-1", ".digit-2", ".digit-3"], { y: 0 });

      const isMobile = typeof window !== "undefined" && window.innerWidth <= 768;
      const tl = gsap.timeline();

      if (!isMobile) {
        // Calculate total scroll distance for each digit strip (desktop only)
        const getDistance = (selector: string) => {
          const digitEl = document.querySelector(selector) as HTMLElement | null;
          if (!digitEl) return 0;
          const numEl = digitEl.querySelector(".num") as HTMLElement | null;
          const numHeight = numEl?.clientHeight || 150;
          const numCount = digitEl.querySelectorAll(".num").length;
          return (numCount - 1) * numHeight;
        };

        const dist3 = getDistance(".digit-3");
        const dist2 = getDistance(".digit-2");
        const dist1 = getDistance(".digit-1");

        // Fast digit roll and progress bar on desktop
        tl.to(".digit-3", { y: -dist3, duration: 0.45, ease: "power2.inOut", force3D: true }, 0)
          .to(".digit-2", { y: -dist2, duration: 0.45, ease: "power2.inOut", force3D: true }, 0)
          .to(".digit-1", { y: -dist1, duration: 0.25, ease: "power2.inOut", force3D: true }, 0.2)
          .to(".progress-bar", { scaleX: 1, duration: 0.45, ease: "power2.inOut" }, 0);
      }

      // Hero entrance starts at 0.3s (overlapping with preloader exit)
      tl.to(
        ".hero-imgs",
        {
          scale: 1.0,
          duration: 0.5,
          ease: "power2.out",
        },
        0.3
      );

      if (navEl) {
        tl.to(
          navEl,
          {
            y: 0,
            opacity: 1,
            duration: 0.35,
            ease: "power2.out",
            force3D: true,
            onComplete: () => {
              gsap.set(navEl, { clearProps: "all" });
            },
          },
          0.3
        );
      }

      // 5. Preloader content slides and fades out
      tl.to(
        ".preloader-content",
        {
          x: -60,
          opacity: 0,
          duration: 0.2,
          ease: "power2.inOut",
          force3D: true,
        },
        0.2
      );
    }, containerRef);

    // Unmount preloader from DOM after CSS fade finishes (0.28s mobile, 0.40s desktop)
    const isMobile = typeof window !== "undefined" && window.innerWidth <= 768;
    const dismissTimer = setTimeout(() => {
      setShowPreloader(false);
    }, isMobile ? 300 : 450);

    return () => {
      ctx.revert();
      clearTimeout(dismissTimer);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="hero-app-wrapper relative w-full h-screen bg-[#000000] overflow-hidden"
    >
      {/* Light Preloader: Only rendered when active, unmounts from DOM after 0.8s */}
      {showPreloader && <Preloader ref={preloaderRef} />}

      {/* Hero section: In the DOM and visible immediately on first paint */}
      <section className="hero relative w-full max-w-full h-screen p-0 origin-center overflow-hidden">
        <HeroImages />
      </section>

      {/* Website Foreground Content (Header): Immediately painted */}
      <div className="website-content absolute top-0 left-0 w-full h-full z-10 pointer-events-none">
        <HeroHeader
          title="EthixWeb"
          descriptionLines={[
            "We run the tech.",
            "You run the business.",
            "We manage your digital operation, from AI booking agents and CRM integrations to websites, SEO and ads.",
          ]}
        />
      </div>
    </div>
  );
};

export default HeroApp;

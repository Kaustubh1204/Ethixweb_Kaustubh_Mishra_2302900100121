"use client";

import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { Preloader } from "@/components/Preloader";
import { HeroImages } from "@/components/HeroImages";
import { HeroHeader } from "@/components/HeroHeader";

export const HeroApp: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const preloaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Initial State Setups
      const navEl = document.querySelector("nav");
      if (navEl) gsap.set(navEl, { y: -150 });
      gsap.set(".progress-bar", { scaleX: 0, transformOrigin: "right center" });
      gsap.set(".char-span", { y: 400 });
      gsap.set(".hero-desc", { opacity: 0, y: 30 });
      gsap.set(".preloader-content", { x: 0, opacity: 1, scale: 1 });
      gsap.set(".pre-loader-overlay", { opacity: 1, display: "flex", xPercent: 0 });
      gsap.set(".hero-img", {
        clipPath: "polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)",
      });

      // Reset digit tickers to top position 0
      gsap.set([".digit-1", ".digit-2", ".digit-3"], { y: 0 });

      // Calculate total scroll distance for each digit strip
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

      // 2. Coordinated Master Timeline: Digits & Progress Bar → Preloader Exit → Hero Reveal
      const tl = gsap.timeline();

      // Animate digits directly on timeline
      tl.to(
        ".digit-3",
        {
          y: -dist3,
          duration: 3.2,
          ease: "power2.inOut",
          force3D: true,
        },
        0.3
      )
        .to(
          ".digit-2",
          {
            y: -dist2,
            duration: 3.5,
            ease: "power2.inOut",
            force3D: true,
          },
          0.3
        )
        .to(
          ".digit-1",
          {
            y: -dist1,
            duration: 1.2,
            ease: "power2.inOut",
            force3D: true,
          },
          2.6
        )

        // Progress bar fills up alongside digit count
        .to(
          ".progress-bar",
          {
            scaleX: 0.35,
            duration: 1.5,
            ease: "power4.inOut",
          },
          1.0
        )
        .to(
          ".progress-bar",
          {
            scaleX: 1,
            duration: 1.2,
            ease: "power3.out",
          },
          2.5
        )

        // 4. Preloader content slides out to left with subtle scale down
        .to(
          ".preloader-content",
          {
            x: -window.innerWidth * 1.1,
            opacity: 0,
            scale: 0.9,
            duration: 0.8,
            ease: "power3.inOut",
            force3D: true,
          },
          3.8
        )

        // 5. Full overlay fades and hides
        .to(
          ".pre-loader-overlay",
          {
            opacity: 0,
            duration: 0.3,
            ease: "power2.out",
            onComplete: () => {
              const overlay = document.querySelector(".pre-loader-overlay") as HTMLElement | null;
              if (overlay) overlay.style.display = "none";
            },
          },
          4.4
        )

        // 6. Hero visuals reveal synchronized with preloader exit
        .to(
          ".hero-img",
          {
            clipPath: "polygon(100% 0%, 0% 0%, 0% 100%, 100% 100%)",
            duration: 1.1,
            ease: "power4.inOut",
            stagger: 0.18,
            force3D: true,
          },
          4.0
        )
        .to(
          ".hero-imgs",
          {
            scale: 1.05,
            duration: 2.2,
            ease: "power3.out",
          },
          4.0
        );

      // 7. Navigation bar slides down from top
      if (navEl) {
        tl.to(
          navEl,
          {
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            force3D: true,
            onComplete: () => {
              gsap.set(navEl, { clearProps: "transform,y" });
            },
          },
          4.8
        );
      }

      // 8. Main title characters slide up
      tl.to(
        ".char-span",
        {
          y: 0,
          stagger: 0.05,
          duration: 0.8,
          ease: "power3.out",
          force3D: true,
        },
        4.8
      );

      // 9. Description fades in
      tl.to(
        ".hero-desc",
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power2.out",
        },
        5.3
      );
    }, containerRef);

    // Safety fallback: guaranteed exit after 6.5 seconds
    const safetyTimer = setTimeout(() => {
      const overlay = document.querySelector(
        ".pre-loader-overlay"
      ) as HTMLElement | null;
      if (overlay) {
        overlay.style.display = "none";
      }
      const nav = document.querySelector("nav");
      if (nav) gsap.set(nav, { y: 0 });
      gsap.set(".char-span", { y: 0 });
      gsap.set(".hero-desc", { opacity: 1, y: 0 });
      gsap.set(".hero-img", {
        clipPath: "polygon(100% 0%, 0% 0%, 0% 100%, 100% 100%)",
      });
    }, 6500);

    return () => {
      ctx.revert();
      clearTimeout(safetyTimer);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="hero-app-wrapper relative w-full h-screen bg-[#000000] overflow-hidden"
    >
      {/* Full-Viewport Preloader Overlay */}
      <Preloader ref={preloaderRef} />

      {/* Hero section */}
      <section className="hero relative w-full max-w-full h-screen p-0 origin-center overflow-hidden">
        <HeroImages />
      </section>

      {/* Website Foreground Content (Header) */}
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

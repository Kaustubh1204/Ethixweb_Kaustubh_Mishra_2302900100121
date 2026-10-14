"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export type CardSplitTransitionProps = {
  /** Optional content of the section */
  children?: React.ReactNode;
  /** The next component to reveal from behind the split panels */
  revealContent?: React.ReactNode;
  /** Badge text displayed above the upper heading */
  badgeText?: string;
  /** Primary heading displayed on the upper card */
  heading: string;
  /** Primary statement displayed on the lower card */
  description: string;
  /** Optional secondary explanatory paragraph below description */
  supportingText?: string;
  /** Status tag text displayed at the bottom of the lower card */
  statusTag?: string;
  /** Scroll scrub distance multiplier (in units of window.innerHeight). Defaults to 2.5 */
  scrollDistanceMultiplier?: number;
  /** Section container extra className */
  className?: string;
};

export function CardSplitTransition({
  children,
  revealContent,
  badgeText,
  heading,
  description,
  supportingText,
  statusTag = "Systems Ready",
  scrollDistanceMultiplier = 2.5,
  className = "",
}: CardSplitTransitionProps) {
  const containerRef = useRef<HTMLElement>(null);
  const topCardRef = useRef<HTMLDivElement>(null);
  const bottomCardRef = useRef<HTMLDivElement>(null);
  const revealLayerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const container = containerRef.current;
    if (!container) return;

    // Initialize positions offscreen
    if (topCardRef.current) {
      gsap.set(topCardRef.current, { yPercent: -101, opacity: 0 });
    }
    if (bottomCardRef.current) {
      gsap.set(bottomCardRef.current, { yPercent: 101, opacity: 0 });
    }
    if (revealLayerRef.current) {
      gsap.set(revealLayerRef.current, { autoAlpha: 0 });
    }

    /* ----------------------------------------------------
       Unified Timeline & Sequence:
       Total pinned scroll length: window.innerHeight * scrollDistanceMultiplier
       
       Timeline Normalized Progress:
       [0.00 - 0.20]: Viewing current component
       [0.20 - 0.54]: Phase 1 — Upper & lower panels close to meet at 0% (center)
       [0.54 - 0.68]: Brief Hold — Panels remain completely closed, reveal layer activates behind
       [0.68 - 0.96]: Phase 2 — Upper moves up (-101%), Lower moves down (101%) to reveal next component
       [0.96 - 1.00]: Panels clear offscreen, smooth handoff to next section in document flow
    ---------------------------------------------------- */
    const trigger = ScrollTrigger.create({
      trigger: container,
      start: "top top",
      end: () => `+=${window.innerHeight * scrollDistanceMultiplier}px`,
      pin: true,
      pinSpacing: true,
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress;

        if (topCardRef.current && bottomCardRef.current) {
          if (progress < 0.20) {
            // Before closing
            gsap.set(topCardRef.current, { yPercent: -101, opacity: 0 });
            gsap.set(bottomCardRef.current, { yPercent: 101, opacity: 0 });
            if (revealLayerRef.current) {
              gsap.set(revealLayerRef.current, { autoAlpha: 0 });
            }
          } else if (progress <= 0.54) {
            // Phase 1: Closing to meet at center
            const closeRatio = gsap.utils.clamp(0, 1, (progress - 0.20) / 0.34);
            const easedClose = gsap.parseEase("power3.out")(closeRatio);
            const topY = -101 + 101 * easedClose;
            const bottomY = 101 - 101 * easedClose;

            gsap.set(topCardRef.current, { yPercent: topY, opacity: 1 });
            gsap.set(bottomCardRef.current, { yPercent: bottomY, opacity: 1 });

            // Make reveal layer ready behind panels as they close completely
            if (revealLayerRef.current) {
              if (closeRatio >= 0.85) {
                gsap.set(revealLayerRef.current, { autoAlpha: 1 });
              } else {
                gsap.set(revealLayerRef.current, { autoAlpha: 0 });
              }
            }
          } else if (progress <= 0.68) {
            // Brief hold: Panels held closed firmly covering viewport
            gsap.set(topCardRef.current, { yPercent: 0, opacity: 1 });
            gsap.set(bottomCardRef.current, { yPercent: 0, opacity: 1 });
            if (revealLayerRef.current) {
              gsap.set(revealLayerRef.current, { autoAlpha: 1 });
            }
          } else if (progress <= 0.98) {
            // Phase 2: Opening panels away from center to reveal destination component
            const openRatio = gsap.utils.clamp(0, 1, (progress - 0.68) / 0.30);
            const easedOpen = gsap.parseEase("power3.inOut")(openRatio);
            const topY = -101 * easedOpen;
            const bottomY = 101 * easedOpen;

            gsap.set(topCardRef.current, { yPercent: topY, opacity: 1 });
            gsap.set(bottomCardRef.current, { yPercent: bottomY, opacity: 1 });

            if (revealLayerRef.current) {
              gsap.set(revealLayerRef.current, { autoAlpha: 1 });
            }
          } else {
            // Fully open and cleared — panels move offscreen, revealLayer stays 1 so there is no blank flash before handoff
            gsap.set(topCardRef.current, { yPercent: -101, opacity: 0 });
            gsap.set(bottomCardRef.current, { yPercent: 101, opacity: 0 });
            if (revealLayerRef.current) {
              gsap.set(revealLayerRef.current, { autoAlpha: 1 });
            }
          }
        }
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
  }, [scrollDistanceMultiplier]);

  return (
    <section
      ref={containerRef}
      className={`relative w-full h-[100svh] overflow-hidden ${className}`}
    >
      {/* Current section content if provided */}
      {children && (
        <div className="w-full h-full relative z-10">
          {children}
        </div>
      )}

      {/* Reveal Layer: Positioned BEHIND panels at z-[35] (panels at z-[40]) */}
      {revealContent && (
        <div
          ref={revealLayerRef}
          className="reveal-content-layer absolute inset-0 w-full h-full z-[35] overflow-hidden will-change-[transform,opacity] pointer-events-auto"
        >
          {revealContent}
        </div>
      )}

      {/* Unified Upper Panel */}
      <div
        ref={topCardRef}
        className="closing-card-top absolute top-0 left-0 w-full h-1/2 z-[40] bg-[#141414] border-b border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.8)] flex flex-col justify-end items-center pb-8 md:pb-12 px-6 text-center will-change-transform pointer-events-none"
      >
        {badgeText && (
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono tracking-widest uppercase text-amber-400 mb-3">
            <span>{badgeText}</span>
          </div>
        )}
        <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase tracking-tight text-white drop-shadow-lg">
          {heading}
        </h2>
      </div>

      {/* Unified Lower Panel */}
      <div
        ref={bottomCardRef}
        className="closing-card-bottom absolute bottom-0 left-0 w-full h-1/2 z-[40] bg-[#141414] border-t border-white/15 shadow-[0_-20px_50px_rgba(0,0,0,0.8)] flex flex-col justify-start items-center pt-8 md:pt-12 px-6 text-center will-change-transform pointer-events-none"
      >
        <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-medium text-white/80 max-w-3xl leading-snug">
          {description}
        </p>
        {supportingText && (
          <p className="text-sm sm:text-base md:text-lg text-white/60 max-w-2xl mt-3 leading-relaxed">
            {supportingText}
          </p>
        )}
        <div className="mt-4 flex items-center gap-2 text-xs uppercase tracking-widest text-white/40 font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>{statusTag}</span>
        </div>
      </div>
    </section>
  );
}

export default CardSplitTransition;

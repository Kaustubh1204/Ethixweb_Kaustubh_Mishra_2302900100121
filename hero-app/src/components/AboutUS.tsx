"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

const ICONS = [
  { src: "/assets/B2.png", alt: "Ethixweb Agency Asset 1" },
  { src: "/assets/B4.png", alt: "Ethixweb Agency Asset 2" },
  { src: "/assets/C2.png", alt: "Ethixweb Agency Asset 3" },
  { src: "/assets/E3.png", alt: "Ethixweb Agency Asset 4" },
  { src: "/assets/F3.png", alt: "Ethixweb Agency Asset 5" },
];

// Exact text content requested by user with 5 inline placeholder slots
const PARAGRAPH_PARTS = [
  { type: "placeholder", placeholderIndex: 0 },
  { type: "text", content: "Ethixweb is a digital marketing and web development agency built for businesses that want measurable growth, not marketing noise." },
  { type: "placeholder", placeholderIndex: 1 },
  { type: "text", content: "Since 2020, we have focused on helping contractors turn their digital presence into a reliable source of leads, bookings, and revenue." },
  { type: "placeholder", placeholderIndex: 2 },
  { type: "text", content: "Our senior team of developers, designers, and strategists works directly with clients to build high-performing websites, implement intelligent systems, and create growth strategies backed by real data." },
  { type: "placeholder", placeholderIndex: 3 },
  { type: "text", content: "We believe in transparent communication, fast execution, and measurable outcomes" },
  { type: "placeholder", placeholderIndex: 4 },
  { type: "text", content: "— without unnecessary layers, vague promises, or wasted marketing spend." },
];

export default function AboutUS() {
  const heroSectionRef = useRef<HTMLElement>(null);
  const heroHeaderRef = useRef<HTMLDivElement>(null);
  const animatedIconsRef = useRef<HTMLDivElement>(null);
  const iconElementsRef = useRef<(HTMLDivElement | null)[]>([]);
  const textSegmentsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const placeholderRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const duplicatesLayerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cleanup: (() => void) | null = null;
    let initialized = false;

    const init = () => {
      if (initialized) return;
      initialized = true;

      gsap.registerPlugin(ScrollTrigger);

      // Initialize smooth scrolling with Lenis
      const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });

      lenis.on("scroll", ScrollTrigger.update);

      const tickerCallback = (time: number) => {
        lenis.raf(time * 1000);
      };
      gsap.ticker.add(tickerCallback);
      gsap.ticker.lagSmoothing(0);

    const animatedIcons = animatedIconsRef.current;
    const heroHeader = heroHeaderRef.current;
    const heroSection = heroSectionRef.current;
    const iconElements = iconElementsRef.current.filter(Boolean) as HTMLDivElement[];
    const textSegments = textSegmentsRef.current.filter(Boolean) as HTMLSpanElement[];
    const placeholders = placeholderRefs.current.filter(Boolean) as HTMLSpanElement[];

    if (!heroSection || !animatedIcons || !heroHeader || iconElements.length === 0) {
      return;
    }

    // Randomized text segment reveal order
    const textAnimationOrder = textSegments.map((segment, index) => ({
      segment,
      originalIndex: index,
    }));

    for (let i = textAnimationOrder.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [textAnimationOrder[i], textAnimationOrder[j]] = [
        textAnimationOrder[j],
        textAnimationOrder[i],
      ];
    }

    const getHeaderIconSize = () => {
      if (typeof window === "undefined") return 44;
      if (window.innerWidth < 640) return 18;
      if (window.innerWidth < 1000) return 26;
      return 44;
    };
    let headerIconSize = getHeaderIconSize();

    let duplicateIcons: HTMLDivElement[] | null = null;
    const duplicatesLayer = duplicatesLayerRef.current;

    const cleanupDuplicates = () => {
      if (duplicatesLayer) {
        duplicatesLayer.replaceChildren();
      }
      duplicateIcons = null;
    };

    const firstIconRect = iconElements[0].getBoundingClientRect();
    const currentIconSize = firstIconRect.width || 120;
    const exactScale = headerIconSize / currentIconSize;

    // Helper to calculate target coordinate inside pinned heroSection
    const positionDuplicate = (
      duplicate: HTMLDivElement,
      index: number,
      moveProgress: number
    ) => {
      if (index >= placeholders.length) return;

      const heroRect = heroSection.getBoundingClientRect();
      const iconRect = iconElements[index].getBoundingClientRect();
      const targetRect = placeholders[index].getBoundingClientRect();

      const startCenterX = iconRect.left + iconRect.width / 2 - heroRect.left;
      const startCenterY = iconRect.top + iconRect.height / 2 - heroRect.top;

      const targetCenterX = targetRect.left + targetRect.width / 2 - heroRect.left;
      const targetCenterY = targetRect.top + targetRect.height / 2 - heroRect.top;

      const moveX = targetCenterX - startCenterX;
      const moveY = targetCenterY - startCenterY;

      let currentX = 0;
      let currentY = 0;

      if (moveProgress <= 0.5) {
        const verticalProgress = moveProgress / 0.5;
        currentY = moveY * verticalProgress;
      } else {
        const horizontalProgress = (moveProgress - 0.5) / 0.5;
        currentY = moveY;
        currentX = moveX * horizontalProgress;
      }

      const finalX = startCenterX + currentX;
      const finalY = startCenterY + currentY;

      duplicate.style.left = `${finalX - headerIconSize / 2}px`;
      duplicate.style.top = `${finalY - headerIconSize / 2}px`;
      duplicate.style.opacity = "1";
      duplicate.style.display = "flex";
    };

    // ScrollTrigger instance across 8x viewport height scrubbed sequence:
    const trigger = ScrollTrigger.create({
      trigger: heroSection,
      start: "top top",
      end: `+=${window.innerHeight * 8}px`,
      pin: true,
      pinSpacing: true,
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress;
        const heroProgress = progress;

        // Reset text segment opacity if scrubbed back before Stage 4
        if (heroProgress <= 0.60) {
          textSegments.forEach((segment) => {
            gsap.set(segment, { opacity: 0 });
          });
        }

        /* ----------------------------------------------------
           Stage 1: Vertical container movement & icon staggers
        ---------------------------------------------------- */
        if (heroProgress <= 0.24) {
          const moveProgress = heroProgress / 0.24;
          const containerMoveY = -window.innerHeight * 0.3 * moveProgress;

          if (heroProgress <= 0.12) {
            const headerProgress = heroProgress / 0.12;
            const headerMoveY = -50 * headerProgress;
            const headerOpacity = 1 - headerProgress;

            gsap.set(heroHeader, {
              transform: `translate(-50%, calc(-50% + ${headerMoveY}px))`,
              opacity: headerOpacity,
            });
          } else {
            gsap.set(heroHeader, {
              transform: `translate(-50%, calc(-50% + -50px))`,
              opacity: 0,
            });
          }

          heroSection.style.backgroundColor = "#FFFFFE";
          cleanupDuplicates();

          gsap.set(animatedIcons, {
            x: 0,
            y: containerMoveY,
            scale: 1,
            opacity: 1,
          });

          iconElements.forEach((icon, index) => {
            const staggerDelay = index * 0.1;
            const iconStart = staggerDelay;
            const iconEnd = staggerDelay + 0.5;

            const iconProgress = gsap.utils.mapRange(
              iconStart,
              iconEnd,
              0,
              1,
              moveProgress
            );
            const clampedProgress = Math.max(0, Math.min(1, iconProgress));
            const startOffset = -containerMoveY;
            const individualY = startOffset * (1 - clampedProgress);

            gsap.set(icon, {
              x: 0,
              y: individualY,
            });
          });

        /* ----------------------------------------------------
           Stage 2: Scaling & transition toward viewport center
        ---------------------------------------------------- */
        } else if (heroProgress <= 0.48) {
          const scaleProgress = (heroProgress - 0.24) / 0.24;

          gsap.set(heroHeader, {
            transform: `translate(-50%, calc(-50% + -50px))`,
            opacity: 0,
          });

          heroSection.style.backgroundColor = "#FFFFFE";

          cleanupDuplicates();

          const targetCenterY = window.innerHeight / 2;
          const targetCenterX = window.innerWidth / 2;
          const containerRect = animatedIcons.getBoundingClientRect();
          const currentCenterX = containerRect.left + containerRect.width / 2;
          const currentCenterY = containerRect.top + containerRect.height / 2;
          const deltaX = (targetCenterX - currentCenterX) * scaleProgress;
          const deltaY = (targetCenterY - currentCenterY) * scaleProgress;
          const baseY = -window.innerHeight * 0.3;
          const currentScale = 1 + (exactScale - 1) * scaleProgress;

          gsap.set(animatedIcons, {
            x: deltaX,
            y: baseY + deltaY,
            scale: currentScale,
            opacity: 1,
          });

          iconElements.forEach((icon) => {
            gsap.set(icon, { x: 0, y: 0 });
          });

        /* ----------------------------------------------------
           Stage 3: Icon Duplication & morphing to paragraph placeholders
        ---------------------------------------------------- */
        } else if (heroProgress <= 0.60) {
          const moveProgress = (heroProgress - 0.48) / 0.12;

          gsap.set(heroHeader, {
            transform: `translate(-50%, calc(-50% + -100px))`,
            opacity: 0,
          });

          heroSection.style.backgroundColor = "#FFFFFE";
          gsap.set(animatedIcons, { opacity: 0 });

          headerIconSize = getHeaderIconSize();

          if (!duplicateIcons) {
            const newDuplicates: HTMLDivElement[] = [];

            iconElements.forEach((icon, index) => {
              const duplicate = icon.cloneNode(true) as HTMLDivElement;
              duplicate.className = "duplicate-icon absolute z-30 pointer-events-none transition-none";
              duplicate.style.width = `${headerIconSize}px`;
              duplicate.style.height = `${headerIconSize}px`;
              duplicate.style.padding = "0px";
              duplicate.style.background = "transparent";
              duplicate.style.border = "none";
              duplicate.style.boxShadow = "none";

              positionDuplicate(duplicate, index, moveProgress);

              if (duplicatesLayer) {
                duplicatesLayer.appendChild(duplicate);
              }
              newDuplicates.push(duplicate);
            });
            duplicateIcons = newDuplicates;
          } else {
            duplicateIcons.forEach((duplicate, index) => {
              positionDuplicate(duplicate, index, moveProgress);
            });
          }

        /* ----------------------------------------------------
           Stage 4: Text Reveal
        ---------------------------------------------------- */
        } else {
          heroSection.style.backgroundColor = "#FFFFFE";
          gsap.set(animatedIcons, { opacity: 0 });

          if (!duplicateIcons) {
            const newDuplicates: HTMLDivElement[] = [];
            headerIconSize = getHeaderIconSize();

            iconElements.forEach((icon, index) => {
              const duplicate = icon.cloneNode(true) as HTMLDivElement;
              duplicate.className = "duplicate-icon absolute z-30 pointer-events-none transition-none";
              duplicate.style.width = `${headerIconSize}px`;
              duplicate.style.height = `${headerIconSize}px`;
              duplicate.style.padding = "0px";
              duplicate.style.background = "transparent";
              duplicate.style.border = "none";
              duplicate.style.boxShadow = "none";

              positionDuplicate(duplicate, index, 1.0);

              if (duplicatesLayer) {
                duplicatesLayer.appendChild(duplicate);
              }
              newDuplicates.push(duplicate);
            });
            duplicateIcons = newDuplicates;
          } else {
            duplicateIcons.forEach((duplicate, index) => {
              positionDuplicate(duplicate, index, 1.0);
            });
          }

          // Randomized word fade in
          const totalWords = textAnimationOrder.length;
          textAnimationOrder.forEach((item, randomIndex) => {
            const step = 0.35 / Math.max(1, totalWords);
            const segmentStart = 0.60 + randomIndex * step;
            const segmentEnd = Math.min(0.98, segmentStart + step * 1.5);

            const segmentProgress = gsap.utils.mapRange(
              segmentStart,
              segmentEnd,
              0,
              1,
              heroProgress
            );
            const clampedProgress = Math.max(0, Math.min(1, segmentProgress));

            gsap.set(item.segment, {
              opacity: clampedProgress,
            });
          });
        }
      },
    });

    const handleResize = () => {
      ScrollTrigger.refresh();
    };
    window.addEventListener("resize", handleResize);

      cleanup = () => {
        window.removeEventListener("resize", handleResize);
        trigger.kill();
        gsap.ticker.remove(tickerCallback);
        lenis.destroy();
        cleanupDuplicates();
      };
    };

    // If user scrolls before idle, initialize immediately
    const onScrollOrTouch = () => {
      window.removeEventListener("scroll", onScrollOrTouch);
      window.removeEventListener("wheel", onScrollOrTouch);
      window.removeEventListener("touchmove", onScrollOrTouch);
      init();
    };

    window.addEventListener("scroll", onScrollOrTouch, { passive: true });
    window.addEventListener("wheel", onScrollOrTouch, { passive: true });
    window.addEventListener("touchmove", onScrollOrTouch, { passive: true });

    const idleId = typeof window !== "undefined" && "requestIdleCallback" in window
      ? (window as any).requestIdleCallback(init, { timeout: 1200 })
      : setTimeout(init, 500);

    return () => {
      window.removeEventListener("scroll", onScrollOrTouch);
      window.removeEventListener("wheel", onScrollOrTouch);
      window.removeEventListener("touchmove", onScrollOrTouch);
      if (typeof window !== "undefined" && "cancelIdleCallback" in window) {
        (window as any).cancelIdleCallback(idleId);
      } else {
        clearTimeout(idleId);
      }
      if (cleanup) cleanup();
    };
  }, []);

  // Track word index counter for textSegmentsRef
  let globalWordCounter = 0;

  return (
    <div className="relative w-full bg-[#FFFFFE] text-[#09090b]">
      {/* Main Hero Section with Pinned ScrollTrigger */}
      <section
        ref={heroSectionRef}
        className="hero relative w-full max-w-full h-[100svh] px-4 sm:px-6 md:px-12 flex flex-col items-center justify-center bg-[#FFFFFE] text-[#09090b] transition-colors duration-300"
      >
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.035] bg-[radial-gradient(#000000_1px,transparent_1px)] [background-size:28px_28px] overflow-hidden" />

        {/* Dedicated Imperative Duplicates Layer */}
        <div ref={duplicatesLayerRef} className="duplicates-layer absolute inset-0 pointer-events-none z-30" />

        {/* Phase 1 Hero Header: Heading 'about us' and subtitle */}
        <div
          ref={heroHeaderRef}
          className="hero-header absolute top-[38%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] md:w-[65%] text-center flex flex-col items-center gap-4 will-change-[transform,opacity] z-10"
        >
          <h1 className="text-[14vw] md:text-[8.5vw] font-black tracking-tight leading-[0.9] uppercase select-none text-[#09090b] drop-shadow-sm">
            about us
          </h1>
          <p className="text-lg md:text-2xl font-normal text-black/70 max-w-2xl leading-snug">
            A small, senior team. No account managers.
          </p>
        </div>

        {/* Phase 3 & 4 Central Narrative Paragraph with 5 inline placeholder slots */}
        <div className="relative max-w-5xl px-4 sm:px-6 md:px-12 text-center z-10 pointer-events-none">
          <p className="text-base sm:text-xl md:text-2xl lg:text-[2rem] font-bold leading-[1.6] sm:leading-[1.5] tracking-tight text-[#141414]">
            {PARAGRAPH_PARTS.map((part, pIndex) => {
              if (part.type === "placeholder") {
                const pIdx = part.placeholderIndex ?? 0;
                return (
                  <span
                    key={`p-${pIdx}`}
                    ref={(el) => {
                      placeholderRefs.current[pIdx] = el;
                    }}
                    className="placeholder-icon -mt-0.5 sm:-mt-1 md:-mt-2 w-[18px] h-[18px] sm:w-[26px] sm:h-[26px] md:w-[44px] md:h-[44px] inline-block align-middle mx-1 sm:mx-1.5 md:mx-2 rounded-lg invisible"
                  />
                );
              }

              // Split text into individual words for randomized staggered reveal
              const words = (part.content ?? "").split(" ");
              return (
                <React.Fragment key={`part-${pIndex}`}>
                  {words.map((word, wIdx) => {
                    const currentWordIndex = globalWordCounter++;
                    return (
                      <span
                        key={`word-${currentWordIndex}-${wIdx}`}
                        ref={(el) => {
                          textSegmentsRef.current[currentWordIndex] = el;
                        }}
                        className="text-segment inline-block opacity-0 mr-1.5 md:mr-2 transition-opacity duration-75 select-none"
                      >
                        {word}
                      </span>
                    );
                  })}
                </React.Fragment>
              );
            })}
          </p>
        </div>

        {/* Animated Icons bottom docking bar */}
        <div
          ref={animatedIconsRef}
          className="animated-icons fixed bottom-3 sm:bottom-4 md:bottom-6 left-2 sm:left-4 md:left-8 right-2 sm:right-4 md:right-8 flex items-center justify-center gap-1.5 sm:gap-3 md:gap-6 will-change-transform z-20"
        >
          {ICONS.map((icon, idx) => (
            <div
              key={idx}
              ref={(el) => {
                iconElementsRef.current[idx] = el;
              }}
              className="animated-icon flex-1 max-w-[56px] sm:max-w-[90px] md:max-w-[140px] aspect-square rounded-xl sm:rounded-2xl p-1.5 sm:p-2.5 md:p-4 bg-white/70 border border-black/10 backdrop-blur-md shadow-xl flex flex-col items-center justify-center will-change-transform cursor-pointer"
            >
              <img
                src={icon.src}
                alt={icon.alt}
                className="w-full h-full object-contain filter drop-shadow"
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export { AboutUS };

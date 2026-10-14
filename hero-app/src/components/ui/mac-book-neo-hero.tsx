"use client";

import * as React from "react";
import { useEffect, useRef, useState } from "react";

export type FrameSequenceStep = {
  from: number;
  to: number;
  color: string;
  num: string;
  total: string;
  icon?: React.ReactNode;
  title: string;
  description: string;
  label: string;
};

export type FrameSequenceHeroProps = {
  frameCount: number;
  framePath: (i: number) => string;
  eagerCount?: number;
  scrollHeight?: string;
  brand?: React.ReactNode;
  navLinks?: { label: string; href: string }[];
  ctaLabel?: string;
  ctaHref?: string;
  title: React.ReactNode;
  subtitle?: string;
  steps: FrameSequenceStep[];
  className?: string;
};

const cx = (...c: (string | false | null | undefined)[]) =>
  c.filter(Boolean).join(" ");

export function FrameSequenceHero({
  frameCount,
  framePath,
  eagerCount = 140,
  scrollHeight = "600vh",
  brand,
  navLinks = [],
  ctaLabel,
  ctaHref = "#",
  title,
  subtitle,
  steps,
  className,
}: FrameSequenceHeroProps) {
  const spacerRef = useRef<HTMLDivElement | null>(null);

  const cacheRef = useRef<HTMLImageElement[]>(new Array(frameCount));
  const loadedRef = useRef(0);
  const targetFrameRef = useRef(0);
  const displayFrameRef = useRef(0);
  const lastShownRef = useRef(-1);
  const rafActiveRef = useRef(false);

  const [loadPct, setLoadPct] = useState(0);
  const [loaderDone, setLoaderDone] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);
  const [subHidden, setSubHidden] = useState(false);
  const [activeIdx, setActiveIdx] = useState<number>(-1);
  const [progress, setProgress] = useState(0);
  const [stepLocal, setStepLocal] = useState(0);
  const [currentSrc, setCurrentSrc] = useState<string>(() => framePath(1));

  const showFrame = (i: number) => {
    if (i === lastShownRef.current) return;
    setCurrentSrc(framePath(i + 1));
    lastShownRef.current = i;
  };

  const loop = () => {
    if (rafActiveRef.current) return;
    rafActiveRef.current = true;
    const tick = () => {
      const diff = targetFrameRef.current - displayFrameRef.current;
      if (Math.abs(diff) < 0.08) displayFrameRef.current = targetFrameRef.current;
      else displayFrameRef.current += diff * 0.28;
      const idx = Math.max(0, Math.min(frameCount - 1, Math.round(displayFrameRef.current)));
      if (idx !== lastShownRef.current) showFrame(idx);
      if (displayFrameRef.current !== targetFrameRef.current) requestAnimationFrame(tick);
      else rafActiveRef.current = false;
    };
    requestAnimationFrame(tick);
  };

  useEffect(() => {
    const eager = Math.min(eagerCount, frameCount);
    const loadOne = (i: number) => {
      const img = new Image();
      img.decoding = "async";
      img.src = framePath(i + 1);
      const onSettle = () => {
        loadedRef.current += 1;
        const pct = Math.round((loadedRef.current / frameCount) * 100);
        setLoadPct(pct);
        if (loadedRef.current === eager) {
          setLoaderDone(true);
          for (let j = eager; j < frameCount; j++) loadOne(j);
        }
      };
      img.onload = onSettle;
      img.onerror = onSettle;
      cacheRef.current[i] = img;
    };
    for (let i = 0; i < eager; i++) loadOne(i);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frameCount, eagerCount]);

  useEffect(() => {
    let trigger: any;
    let cancelled = false;

    import("gsap").then(({ default: gsap }) => {
      import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
        if (cancelled) return;
        gsap.registerPlugin(ScrollTrigger);

        const root = spacerRef.current;
        if (!root) return;

        const isMobile = window.innerWidth < 768;
        trigger = ScrollTrigger.create({
          trigger: root,
          start: "top top",
          end: isMobile ? "+=280%" : "+=500%",
          pin: true,
          pinSpacing: true,
          scrub: 1,
          onUpdate: (self) => {
            const p = self.progress;
            targetFrameRef.current = p * (frameCount - 1);
            loop();
            setProgress(p);
            setNavScrolled(p > 0.01);
            setSubHidden(p > 0.05);

            let idx = -1;
            let local = 0;
            for (let i = 0; i < steps.length; i++) {
              const s = steps[i];
              if (p >= s.from && p < s.to) {
                idx = i;
                local = (p - s.from) / (s.to - s.from);
                break;
              }
            }
            setActiveIdx(idx);
            setStepLocal(Math.max(0, Math.min(1, local)));
          },
        });
      });
    });

    return () => {
      cancelled = true;
      if (trigger) trigger.kill();
    };
  }, [steps, frameCount]);

  return (
    <div ref={spacerRef} className={cx("fsh-root relative w-full h-[100svh] overflow-hidden", className)}>
      <div aria-hidden className={cx("fsh-loader", loaderDone && "fsh-loader-done")}>
        <div className="fsh-loader-text">
          {loadPct < 100 ? `Loading · ${loadPct}%` : "Ready"}
        </div>
        <div className="fsh-loader-track">
          <span className="fsh-loader-fill" style={{ width: `${loadPct}%` }} />
        </div>
      </div>

      {(brand || navLinks.length > 0 || ctaLabel) && (
        <nav className={cx("fsh-nav absolute top-0 left-0 w-full z-40", navScrolled && "fsh-nav-scrolled")}>
          <div className="fsh-brand">{brand}</div>
          {navLinks.length > 0 && (
            <div className="fsh-nav-links">
              {navLinks.map((l) => (
                <a key={l.label} href={l.href}>{l.label}</a>
              ))}
            </div>
          )}
          {ctaLabel && (
            <a href={ctaHref} className="fsh-cta">{ctaLabel}</a>
          )}
        </nav>
      )}

      {/* Pinned stage — locked still across the entire scrub */}
      <div className="fsh-stage relative w-full h-full overflow-hidden flex items-center justify-center">
        <div className="fsh-canvas-wrap">
          <img
            src={currentSrc}
            alt=""
            className="fsh-canvas"
            draggable={false}
          />
        </div>

        {(title || subtitle) && (
          <div className="fsh-copy">
            {title && <h1 className="fsh-title">{title}</h1>}
            {subtitle && (
              <p className={cx("fsh-sub", subHidden && "fsh-sub-hidden")}>{subtitle}</p>
            )}
          </div>
        )}

        <div className="fsh-cards">
          {steps.map((s, i) => {
            const isActive = activeIdx === i;
            const isPrev = activeIdx >= 0 && i < activeIdx;
            return (
              <article
                key={i}
                style={{ ["--c" as any]: s.color }}
                className={cx(
                  "fsh-card",
                  isActive && "fsh-card-active",
                  isPrev && "fsh-card-prev"
                )}
              >
                <div className="fsh-card-inner">
                  <span aria-hidden className="fsh-card-glow" />
                  <div className="fsh-card-head">
                    <span className="fsh-card-num">
                      <strong>{s.num}</strong> / {s.total}
                    </span>
                    <span aria-hidden className="fsh-card-icon">
                      {s.icon ?? "✦"}
                    </span>
                  </div>
                  <h3 className="fsh-card-title">{s.title}</h3>
                  <p className="fsh-card-desc">{s.description}</p>
                  <div className="fsh-card-foot">
                    <div className="fsh-ticks">
                      {steps.map((_, j) => {
                        const done = j < activeIdx;
                        const cur = j === activeIdx;
                        return (
                          <i key={j} className="fsh-tick">
                            <span
                              style={{
                                transform: `scaleX(${done ? 1 : cur ? stepLocal : 0})`,
                                transition: done ? "none" : "transform 160ms linear",
                              }}
                            />
                          </i>
                        );
                      })}
                    </div>
                    <span className="fsh-card-label">{s.label}</span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div className="fsh-progress">
          <span className="fsh-progress-fill" style={{ width: `${progress * 100}%` }} />
        </div>
      </div>
    </div>
  );
}
export default FrameSequenceHero;

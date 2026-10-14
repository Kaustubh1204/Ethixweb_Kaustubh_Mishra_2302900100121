"use client";

import React, { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { HERO_IMAGES } from "@/constants/images";

export interface HeroVisualsProps {
  images?: string[];
  videoSrc?: string;
  posterSrc?: string;
}

export const HeroVisuals: React.FC<HeroVisualsProps> = ({
  images = HERO_IMAGES,
  videoSrc = "/assestss/hero-bg-optimized.mp4",
  posterSrc = "/assestss/poster.webp",
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    // Determine screen size after first paint
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    checkDesktop();
    window.addEventListener("resize", checkDesktop);
    return () => window.removeEventListener("resize", checkDesktop);
  }, []);

  useEffect(() => {
    if (!isDesktop) return;
    const video = videoRef.current;
    if (!video) return;

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {});
    }
  }, [isDesktop]);

  return (
    <div
      className="hero-imgs absolute inset-0 w-full h-full overflow-hidden z-0 pointer-events-none"
      style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
    >
      {/* Supporting Hero Images that reveal during hero display */}
      {images.map((src, idx) => (
        <div
          key={idx}
          className="hero-img absolute inset-0 w-full h-full"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: "100%",
            height: "100%",
          }}
        >
          <Image
            src={src}
            alt={`Hero Visual ${idx + 1}`}
            fill
            priority={idx === 0}
            sizes="(max-width: 768px) 100vw, 1920px"
            className="object-cover w-full h-full select-none"
          />
        </div>
      ))}

      {/* Primary Hero Visual: Mobile displays only the lightweight poster image */}
      <div className="md:hidden absolute inset-0 w-full h-full flex items-center justify-center bg-[#000000] overflow-hidden">
        <Image
          src={posterSrc}
          alt="Hero background"
          fill
          priority
          sizes="100vw"
          className="object-cover w-full h-full select-none"
        />
        <div className="absolute inset-0 bg-black/35 pointer-events-none" />
      </div>

      {/* Desktop loads the 2.4MB optimized video after first paint */}
      <div
        className="hidden md:flex hero-img hero-video-layer absolute inset-0 w-full h-full items-center justify-center bg-[#000000] overflow-hidden"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "#000000",
        }}
      >
        {isDesktop && (
          <video
            ref={videoRef}
            src={videoSrc}
            poster={posterSrc}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="w-full h-full object-contain select-none pointer-events-none"
            style={{
              objectFit: "contain",
              width: "100%",
              height: "100%",
              maxWidth: "100%",
              maxHeight: "100%",
              backgroundColor: "#000000",
              imageRendering: "auto",
              WebkitBackfaceVisibility: "hidden",
              backfaceVisibility: "hidden",
            }}
          />
        )}

        {/* Cinematic dark tint overlay for text legibility */}
        <div className="absolute inset-0 bg-black/35 pointer-events-none" />
      </div>
    </div>
  );
};

export const HeroImages = HeroVisuals;
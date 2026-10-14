"use client";

import React, { useRef, useEffect } from "react";
import Image from "next/image";
import { HERO_IMAGES } from "@/constants/images";

export interface HeroVisualsProps {
  images?: string[];
  videoSrc?: string;
  videoStartTime?: number;
  videoEndTime?: number;
}

export const HeroVisuals: React.FC<HeroVisualsProps> = ({
  images = HERO_IMAGES,
  videoSrc = "/assestss/Jindal Steel   The Steel Of India   Brand Film.mp4",
  videoStartTime = 33,
  videoEndTime = 53,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hasSeekedRef = useRef<boolean>(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const setStartTime = () => {
      if (!hasSeekedRef.current && video.duration && video.duration > videoStartTime) {
        try {
          video.currentTime = videoStartTime;
          hasSeekedRef.current = true;
        } catch {
          // ignore seek restrictions if any
        }
      }
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Fallback if autoplay policy needs retry on user gesture
        });
      }
    };

    if (video.readyState >= 1) {
      setStartTime();
    } else {
      video.addEventListener("loadedmetadata", setStartTime, { once: true });
    }

    // Loop between 33s and 53s
    const handleTimeUpdate = () => {
      if (video.currentTime >= videoEndTime) {
        video.currentTime = videoStartTime;
        video.play().catch(() => {});
      }
    };

    video.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      video.removeEventListener("loadedmetadata", setStartTime);
      video.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [videoStartTime, videoEndTime]);

  return (
    <div
      className="hero-imgs absolute inset-0 w-full h-full overflow-hidden z-0 pointer-events-none"
      style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
    >
      {/* Supporting Hero Images that reveal in sequence during the preloader exit */}
      {images.map((src, idx) => (
        <div
          key={idx}
          className="hero-img absolute inset-0 w-full h-full clip-image-hidden"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: "100%",
            height: "100%",
            clipPath: "polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)",
          }}
        >
          <Image
            src={src}
            alt={`Hero Visual ${idx + 1}`}
            fill
            priority={idx <= 1}
            sizes="100vw"
            className="object-cover w-full h-full select-none"
          />
        </div>
      ))}

      {/* Primary Hero Visual: Video in letterbox container */}
      <div
        className="hero-img hero-video-layer absolute inset-0 w-full h-full clip-image-hidden flex items-center justify-center bg-[#000000] overflow-hidden"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "#000000",
          clipPath: "polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)",
        }}
      >
        <video
          ref={videoRef}
          src={videoSrc}
          autoPlay
          muted
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

        {/* Cinematic dark tint overlay for text legibility */}
        <div className="absolute inset-0 bg-black/35 pointer-events-none" />
      </div>
    </div>
  );
};

export const HeroImages = HeroVisuals;
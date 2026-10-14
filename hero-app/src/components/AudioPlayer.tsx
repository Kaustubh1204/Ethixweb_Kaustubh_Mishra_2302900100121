"use client";

import React, { useState, useEffect, useRef } from "react";

// Singleton audio instance across renders and client navigation
let globalAudioInstance: HTMLAudioElement | null = null;

export default function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (!globalAudioInstance) {
      globalAudioInstance = new Audio("/assets/bg.mpeg");
      globalAudioInstance.loop = true;
      globalAudioInstance.volume = 0.4;
    }

    const audio = globalAudioInstance;

    const handlePlayState = () => setIsPlaying(!audio.paused);
    audio.addEventListener("play", handlePlayState);
    audio.addEventListener("pause", handlePlayState);

    // Initial state check
    setIsPlaying(!audio.paused);

    // Attempt autoplay if not already playing
    if (audio.paused) {
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          // Autoplay restricted by browser policy; wait for first interaction
          setIsPlaying(false);
        });
    }

    const handleFirstInteraction = () => {
      if (globalAudioInstance && globalAudioInstance.paused) {
        globalAudioInstance
          .play()
          .then(() => setIsPlaying(true))
          .catch(() => {});
      }
      window.removeEventListener("pointerdown", handleFirstInteraction);
      window.removeEventListener("keydown", handleFirstInteraction);
    };

    window.addEventListener("pointerdown", handleFirstInteraction, { once: true });
    window.addEventListener("keydown", handleFirstInteraction, { once: true });

    return () => {
      audio.removeEventListener("play", handlePlayState);
      audio.removeEventListener("pause", handlePlayState);
      window.removeEventListener("pointerdown", handleFirstInteraction);
      window.removeEventListener("keydown", handleFirstInteraction);
    };
  }, []);

  const toggleAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!globalAudioInstance) {
      globalAudioInstance = new Audio("/assets/bg.mpeg");
      globalAudioInstance.loop = true;
      globalAudioInstance.volume = 0.4;
    }

    const audio = globalAudioInstance;
    if (!audio.paused) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.log("Audio play error:", err));
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 pointer-events-auto">
      <button
        onClick={toggleAudio}
        aria-label={isPlaying ? "Mute Background Music" : "Play Background Music"}
        title={isPlaying ? "Mute Audio" : "Play Audio"}
        className="group relative flex items-center justify-center w-12 h-12 rounded-full bg-black/85 text-white border border-white/20 shadow-[0_8px_25px_rgba(0,0,0,0.35)] backdrop-blur-md hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer overflow-hidden"
      >
        {isPlaying ? (
          // Playing animation: Soundwave equalizer bars
          <div className="flex items-end gap-1 h-4">
            <span className="w-1 bg-white rounded-full animate-bounce [animation-duration:600ms] [animation-delay:0ms] h-3.5" />
            <span className="w-1 bg-white rounded-full animate-bounce [animation-duration:600ms] [animation-delay:200ms] h-4" />
            <span className="w-1 bg-white rounded-full animate-bounce [animation-duration:600ms] [animation-delay:400ms] h-2.5" />
            <span className="w-1 bg-white rounded-full animate-bounce [animation-duration:600ms] [animation-delay:150ms] h-3.5" />
          </div>
        ) : (
          // Muted state icon: Speaker with slash
          <svg
            className="w-5 h-5 text-neutral-400 group-hover:text-white transition-colors"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
            />
          </svg>
        )}
      </button>
    </div>
  );
}

"use client";

import React from "react";

export interface HeroHeaderProps {
  title?: string;
  descriptionLines?: string[];
  className?: string;
}

export const HeroHeader: React.FC<HeroHeaderProps> = ({
  title = "EthixWeb",
  descriptionLines = [
    "We run the tech.",
    "You run the business.",
    "We manage your digital operation, from AI booking agents and CRM integrations to websites, SEO and ads.",
  ],
  className = "",
}) => {
  return (
    <div
      className={`header absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[95vw] md:max-w-5xl text-center pointer-events-none select-none z-20 flex flex-col items-center justify-center gap-4 md:gap-6 ${className}`}
    >
      {/* Title */}
      <h1 className="uppercase font-fascinate text-[13vw] sm:text-[10vw] md:text-[8vw] font-normal text-[#FFFFFF] leading-[0.95] clip-header flex justify-center items-center overflow-hidden tracking-normal drop-shadow-[0_4px_30px_rgba(0,0,0,0.9)]">
        {title.split("").map((char, index) => (
          <span
            key={index}
            className="char-span inline-block relative translate-y-[400px] will-change-transform"
          >
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </h1>

      {/* Description centered right under the title */}
      <div className="hero-desc flex flex-col items-center justify-center gap-2 md:gap-3 px-4 text-center max-w-3xl">
        <p className="font-[family-name:var(--font-bebas)] text-2xl sm:text-3xl md:text-4xl uppercase tracking-[0.2em] text-[#FFFFFF] drop-shadow-[0_2px_14px_rgba(0,0,0,0.95)]">
          {descriptionLines[0]} {descriptionLines[1]}
        </p>
        <p className="font-[family-name:var(--font-host-grotesk)] text-sm sm:text-base md:text-lg font-light text-neutral-100/90 leading-relaxed drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)] max-w-2xl">
          {descriptionLines[2]}
        </p>
      </div>
    </div>
  );
};

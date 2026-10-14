"use client";

import StackedHeading from "@/components/StackedHeading";

interface ParagraphProps {
  heading?: string;
  subtitle?: string;
  supportingText?: string;
  pill?: string;
  eyebrow?: string;
}

export default function Paragraph({
  heading = "Robust Solutions",
  subtitle = "Senior operators for the systems that grow the revenue.",
  supportingText,
  pill,
  eyebrow,
}: ParagraphProps) {
  const words = (heading || "").trim().split(/\s+/).filter(Boolean);
  let top = "";
  let italic = "";
  let bottom = "";

  if (words.length === 1) {
    top = words[0];
    italic = "";
    bottom = "";
  } else if (words.length === 2) {
    top = words[0];
    italic = words[1];
    bottom = "";
  } else if (words.length === 3) {
    top = words[0];
    italic = words[1];
    bottom = words[2];
  } else if (words.length > 3) {
    top = words[0];
    italic = words.slice(1, -1).join(" ");
    bottom = words[words.length - 1];
  }

  return (
    <section className="relative w-full min-h-[45vh] sm:min-h-[55vh] py-10 sm:py-16 md:py-24 px-4 sm:px-6 bg-[#FFFFFE] text-[#000] flex flex-col items-center justify-center border-t border-black/10 overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-neutral-200 via-transparent to-transparent" />

      <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col items-center text-center">
        {/* StackedHeading */}
        <StackedHeading
          pill={pill || "ETHIXWEB"}
          top={top}
          italic={italic}
          bottom={bottom}
          tagline={subtitle || undefined}
          eyebrow={eyebrow || (supportingText ? undefined : "INTERNATIONALLY RECOGNISED")}
        />

        {/* Supporting description if provided */}
        {supportingText && (
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-[#000]/70 max-w-3xl leading-relaxed mt-1 sm:mt-2 font-normal px-2">
            {supportingText}
          </p>
        )}
      </div>
    </section>
  );
}

export { Paragraph };

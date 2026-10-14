import React from "react";
import type { Metadata } from "next";
import Paragraph from "@/components/Paragraph";
import PaperCurlDemo from "@/components/ui/paper-curl-demo";

export const metadata: Metadata = {
  title: "About Us — Ethixweb",
  description:
    "A small, senior team. No account managers. Ethixweb is a digital marketing & web development agency built for businesses that want measurable growth, not marketing noise.",
};

export default function AboutPage() {
  return (
    <main className="w-full min-h-screen bg-[#FFFFFE] text-[#09090b]">
      {/* 1. Sole Hero Section: Paragraph with 'About' heading and full description */}
      <section className="relative w-full">
        <Paragraph
          heading="About"
          subtitle="A small, senior team. No account managers."
          supportingText="Ethixweb is a digital marketing & web development agency built for businesses that want measurable growth, not marketing noise."
        />
      </section>

      {/* 2. Paper Curl Carousel Section: Text-only slides */}
      <section className="relative w-full border-t border-black/10 bg-[#FFFFFE] py-8 sm:py-12 md:py-20">
        <div className="w-full max-w-6xl mx-auto px-3 sm:px-6 md:px-8">
          <div className="rounded-2xl sm:rounded-3xl overflow-hidden border border-black/10 shadow-2xl bg-[#FFFFFE]">
            <PaperCurlDemo />
          </div>
        </div>
      </section>
    </main>
  );
}

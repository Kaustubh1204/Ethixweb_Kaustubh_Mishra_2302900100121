import React from "react";
import type { Metadata } from "next";
import Paragraph from "@/components/Paragraph";
import ServicesGlassFolders from "@/components/ServicesGlassFolders";
import ServicesProcessSection from "@/components/ServicesProcessSection";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Services & Operations — Ethixweb",
  description:
    "Everything your business needs to grow. From high-performing websites and AI-powered solutions to digital marketing, analytics, and ongoing technical support.",
};

export default function ServicesPage() {
  return (
    <main className="w-full min-h-screen bg-[#FFFFFE] text-[#09090b]">
      {/* =========================================================
          Section 1 — Sole Hero Section: Paragraph
          Heading: "Services"
          Subtitle: "Everything Your Business Needs to Grow."
          Description: "From high-performing websites and AI-powered solutions to digital marketing, analytics, and ongoing technical support — six connected service areas, one experienced team to build, manage, and scale your digital presence."
          Buttons: "Start a Project" and "Explore Services"
      ========================================================= */}
      <section className="relative w-full pb-14">
        <Paragraph
          heading="Services"
          subtitle="Everything Your Business Needs to Grow."
          supportingText="From high-performing websites and AI-powered solutions to digital marketing, analytics, and ongoing technical support — six connected service areas, one experienced team to build, manage, and scale your digital presence."
        />

        <div className="flex flex-wrap items-center justify-center gap-4 -mt-10 mb-8 z-20 relative">
          <a
            href="https://calendly.com/ethixweb-agency/30min?month=2026-06"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3.5 rounded-full bg-[#09090b] text-[#FFFFFE] text-xs font-mono font-semibold uppercase tracking-wider hover:bg-neutral-800 active:scale-[0.98] transition-all shadow-md cursor-pointer"
          >
            Start a Project ↗
          </a>
          <a
            href="#service-overview"
            className="px-8 py-3.5 rounded-full bg-black/5 border border-black/10 text-[#09090b] text-xs font-mono font-semibold uppercase tracking-wider hover:bg-black/10 active:scale-[0.98] transition-all cursor-pointer"
          >
            Explore Services ↓
          </a>
        </div>
      </section>

      {/* =========================================================
          Section 2 — Interactive Service Overview
          Interactive Glass Folder Cards: 6 folders
      ========================================================= */}
      <section id="service-overview" className="relative w-full border-t border-black/10 bg-[#FFFFFE] pt-12 pb-12">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/5 border border-black/10 text-xs font-mono font-medium tracking-wider uppercase text-neutral-600 mb-3">
            <span>Service Catalog</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-[#09090b]">
            Everything Under One Roof.
          </h2>
          <p className="mt-3 text-base sm:text-lg text-neutral-600 max-w-2xl mx-auto leading-relaxed">
            Six connected service areas. One experienced team. Everything you need to build, attract, measure, and maintain your digital presence.
          </p>
        </div>

        <div className="w-full">
          <ServicesGlassFolders />
        </div>
      </section>

      {/* =========================================================
          Section 3 — Our Process
      ========================================================= */}
      <ServicesProcessSection />
    </main>
  );
}

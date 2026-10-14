import React from "react";
import { HeroApp } from "@/components/HeroApp";
import AboutUS from "@/components/AboutUS";
import Paragraph from "@/components/Paragraph";
import Robust from "@/components/ui/robust";
import WorksWheelDemo from "@/components/ui/works-wheel-demo";
import GlobalOperationsNetwork from "@/components/ui/global-operations-network";
import Testimonials from "@/components/ui/testimonials-demo";

export default function Home() {
  return (
    <main className="w-full min-h-screen bg-[#141414]">
      {/* 0. HeroApp Section (Dark background) */}
      <section data-theme="dark" className="relative w-full">
        <HeroApp />
      </section>

      {/* 1. AboutUS Section (Light background #FFFFFE) */}
      <section data-theme="light" className="relative w-full">
        <AboutUS />
      </section>

      {/* 2. First Canvas Text Section: Robust Solutions (Light background #FFFFFE) */}
      <section data-theme="light" className="relative w-full">
        <Paragraph
          heading="Robust Solutions"
          subtitle="Senior operators for the systems that grow the revenue."
        />
      </section>

      {/* 3. Demo Frames Section: Robust (Light background #FFFFFE) */}
      <section data-theme="light" className="relative w-full">
        <Robust />
      </section>

      {/* 4. Second Canvas Text Section: Full service catalog (Light background #FFFFFE) */}
      <section data-theme="light" className="relative w-full">
        <Paragraph
          heading="Full service catalog"
          subtitle="22 services catalog, one accountable team."
          supportingText="From website builds to AI receptionists, ad campaigns, reporting, accessibility, and ongoing support - every capability we run, grouped by category."
        />
      </section>

      {/* 5. Portfolio Works Wheel (Light background #FFFFFE) */}
      <section data-theme="light" className="relative w-full">
        <WorksWheelDemo />
      </section>

      {/* 6. Canvas Text Section: Global Operations Network (Light background #FFFFFE) */}
      <section data-theme="light" className="relative w-full">
        <Paragraph
          heading="Global Operations Network"
          subtitle="Built for fast moving teams across time zones."
          supportingText="Seattle, Utah, New York, Canada, the United Kingdom, and India stay connected through one responsive digital operations layer."
        />
      </section>

      {/* 7. MacBook Frame Sequence: GlobalOperationsNetwork (Light background #FFFFFE) */}
      <section data-theme="light" className="relative w-full">
        <GlobalOperationsNetwork />
      </section>

      {/* 8. Canvas Text Section: Client Reviews (Light background #FFFFFE) */}
      <section data-theme="light" className="relative w-full">
        <Paragraph
          heading="Client Reviews"
          subtitle="Trusted by businesses worldwide."
          supportingText="Real feedback from clients who trusted Ethixweb to design, build, and grow their digital presence."
        />
      </section>

      {/* 9. Infinite Scrolling Testimonials (Light background #FFFFFE) */}
      <section data-theme="light" className="relative w-full">
        <Testimonials />
      </section>
    </main>
  );
}
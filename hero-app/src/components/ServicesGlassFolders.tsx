"use client";

import React from "react";
import GlassFolder from "@/components/ui/glass-folder-cards";

/**
 * Six interactive service category folders for Ethixweb Services Page:
 * 1. Website Development
 * 2. AI Solutions
 * 3. Digital Marketing
 * 4. Analytics & Tracking
 * 5. Accessibility
 * 6. Technical Support
 */
export default function ServicesGlassFolders() {
  const [folderWidth, setFolderWidth] = React.useState(340);

  React.useEffect(() => {
    const update = () => {
      if (typeof window !== "undefined") {
        const available = window.innerWidth - 36;
        setFolderWidth(Math.min(340, Math.max(260, available)));
      }
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return (
    <div className="relative w-full flex flex-col items-center justify-center overflow-hidden px-4 sm:px-6 md:px-12 py-8 sm:py-12">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 text-foreground opacity-[0.04]"
        style={{
          backgroundImage: "radial-gradient(currentColor 1.1px, transparent 1.4px)",
          backgroundSize: "22px 22px",
        }}
      />

      <div className="relative grid max-w-7xl grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-end justify-items-center gap-x-8 lg:gap-x-12 gap-y-12 sm:gap-y-16">
        {/* Folder 1: Website Development */}
        <GlassFolder
          width={folderWidth}
          label="Website Development"
          meta="Digital experiences built for performance, usability, and growth."
          art="aurora"
          seed={1}
          action="more"
          appearDelay={0}
          files={[
            {
              name: "Website Redesign",
              meta: "Modern high-converting designs",
              art: "aurora",
            },
            {
              name: "Headless Architecture",
              meta: "Next.js, React, modern web stacks",
            },
            {
              name: "Landing Pages",
              meta: "Fast, conversion-focused landing funnels",
            },
            {
              name: "Maintenance & Security",
              meta: "Uptime care, patching & speed audits",
            },
          ]}
          menu={[
            { label: "Website Redesign" },
            { label: "Headless Architecture" },
            { label: "Landing Pages" },
            { label: "Maintenance & Security" },
          ]}
        />

        {/* Folder 2: AI Solutions */}
        <GlassFolder
          width={folderWidth}
          label="AI Solutions"
          meta="Practical AI solutions that improve customer experience and operations."
          art="ember"
          seed={2}
          action="more"
          appearDelay={100}
          files={[
            {
              name: "Knowledge Chatbot",
              meta: "Trained on internal documents & SOPs",
              art: "ember",
            },
            {
              name: "LLM Chatbot",
              meta: "Custom reasoning & tailored workflows",
            },
            {
              name: "AI Receptionist / CSR",
              meta: "24/7 Voice & chat lead qualification",
            },
            {
              name: "Human Handoff",
              meta: "Seamless transition to live specialists",
            },
          ]}
          menu={[
            { label: "Knowledge Chatbot" },
            { label: "LLM Chatbot" },
            { label: "AI Receptionist / CSR" },
            { label: "Human Handoff" },
          ]}
        />

        {/* Folder 3: Digital Marketing */}
        <GlassFolder
          width={folderWidth}
          label="Digital Marketing"
          meta="Reach the right audience, generate qualified leads, and improve conversions."
          art="dusk"
          seed={3}
          action="more"
          appearDelay={200}
          files={[
            {
              name: "SEO",
              meta: "Organic rankings & localized reach",
              art: "dusk",
            },
            {
              name: "Google Ads + LSA",
              meta: "High-intent search & verified local leads",
            },
            {
              name: "Meta Ads",
              meta: "Targeted campaigns on FB & Instagram",
            },
            {
              name: "Social Media + Reels",
              meta: "Short-form video & brand engagement",
            },
            {
              name: "Email Marketing",
              meta: "Automated nurture sequences & retention",
            },
            {
              name: "CRM Integration",
              meta: "HubSpot, GHL, Zapier pipelines",
            },
          ]}
          menu={[
            { label: "SEO" },
            { label: "Google Ads + LSA" },
            { label: "Meta Ads" },
            { label: "Social Media + Reels" },
            { label: "Email Marketing" },
            { label: "CRM Integration" },
          ]}
        />

        {/* Folder 4: Analytics & Tracking */}
        <GlassFolder
          width={folderWidth}
          label="Analytics & Tracking"
          meta="Understand performance through connected data and actionable reporting."
          art="glacier"
          seed={4}
          action="more"
          appearDelay={300}
          files={[
            {
              name: "Performance Dashboard",
              meta: "Real-time visibility on key metrics",
              art: "glacier",
            },
            {
              name: "Analytics & Tracking",
              meta: "Server-side GA4, CAPI & pixel setup",
            },
            {
              name: "Monthly Reporting",
              meta: "Transparent metrics, ROI & review calls",
            },
          ]}
          menu={[
            { label: "Performance Dashboard" },
            { label: "Analytics & Tracking" },
            { label: "Monthly Reporting" },
          ]}
        />

        {/* Folder 5: Accessibility */}
        <GlassFolder
          width={folderWidth}
          label="Accessibility"
          meta="Make digital experiences more accessible, usable, and inclusive."
          art="verdant"
          seed={5}
          action="more"
          appearDelay={400}
          files={[
            {
              name: "Accessibility Improvements",
              meta: "WCAG 2.1 AA compliant remediation",
              art: "verdant",
            },
            {
              name: "Accessibility Testing",
              meta: "Screen reader & keyboard navigation audits",
            },
          ]}
          menu={[
            { label: "Accessibility Improvements" },
            { label: "Accessibility Testing" },
          ]}
        />

        {/* Folder 6: Technical Support */}
        <GlassFolder
          width={folderWidth}
          label="Technical Support"
          meta="Keep your digital infrastructure, content, and integrations reliable."
          art="aurora"
          seed={6}
          action="more"
          appearDelay={500}
          files={[
            {
              name: "Technical Support",
              meta: "Rapid bug fixes & developer on-call",
              art: "aurora",
            },
            {
              name: "AI + Content Updates",
              meta: "Prompt updates, model tuning & assets",
            },
            {
              name: "API Maintenance",
              meta: "Webhook monitoring & version upgrades",
            },
          ]}
          menu={[
            { label: "Technical Support" },
            { label: "AI + Content Updates" },
            { label: "API Maintenance" },
          ]}
        />
      </div>

      <p className="relative mt-12 font-mono text-[11px] tracking-[0.18em] text-neutral-500 uppercase">
        Hover to lean · Click to open folder · Click items to explore
      </p>
    </div>
  );
}

export { ServicesGlassFolders };

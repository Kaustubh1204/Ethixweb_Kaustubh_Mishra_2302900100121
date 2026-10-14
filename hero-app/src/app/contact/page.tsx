import React from "react";
import type { Metadata } from "next";
import ContactSection from "@/components/ContactSection";

export const metadata: Metadata = {
  title: "Contact Us — EthixWeb",
  description: "Have a project in mind or want to say hi? Connect with our senior engineering and design team.",
};

export default function ContactPage() {
  return (
    <main className="w-full min-h-screen bg-[#FFFFFE] text-[#09090b]">
      <ContactSection />
    </main>
  );
}

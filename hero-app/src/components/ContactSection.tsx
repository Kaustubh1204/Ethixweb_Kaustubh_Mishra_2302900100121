"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

const TECH_STACK = [
  "MySQL",
  "Android",
  "React",
  "Node.js",
  "MongoDB",
  "Firebase",
  "Figma",
  "PHP",
  "Next.js",
  "TypeScript",
  "Tailwind CSS",
  "Python",
  "GraphQL",
  "AWS",
];

export default function ContactSection() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setErrorMessage(null);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

    try {
      const response = await fetch(`${apiUrl}/api/leads`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.fullName,
          email: formData.email,
          projectSubject: formData.subject,
          message: formData.message,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        let msg = "Failed to submit enquiry. Please try again.";
        if (data?.error?.details && Array.isArray(data.error.details)) {
          msg = data.error.details.map((d: any) => d.message).join(", ");
        } else if (data?.error?.message) {
          msg = data.error.message;
        }
        setErrorMessage(msg);
        setLoading(false);
        return;
      }

      setSubmitted(true);
      setFormData({
        fullName: "",
        email: "",
        subject: "",
        message: "",
      });
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err: any) {
      setErrorMessage(
        "Network connection error. Please check your internet or try again shortly."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative w-full min-h-screen bg-[#FFFFFE] text-[#09090b] flex flex-col justify-between overflow-hidden selection:bg-black selection:text-white pt-12 pb-4">
      {/* 2. Main Two-Column Layout */}
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-6 sm:py-8 md:py-16 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start flex-1 z-10">
        {/* Left Column: Heading, Subtitle, & Details */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-5 flex flex-col justify-between space-y-8 sm:space-y-12 md:space-y-16"
        >
          <div className="space-y-4 sm:space-y-6">
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-[5rem] font-serif font-normal tracking-tight text-[#09090b] leading-[1.05]">
              Let&apos;s <br />
              <span className="italic font-normal">Connect.</span>
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-neutral-600 leading-relaxed max-w-md pt-1 sm:pt-2">
              Have a project in mind or just want to say hi? We&apos;re always
              open to discussing new ideas and creative collaborations.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 pt-2 sm:pt-4">
            <div>
              <span className="block font-mono text-[10px] sm:text-[11px] uppercase tracking-widest text-neutral-400 font-semibold mb-1.5 sm:mb-2">
                EMAIL
              </span>
              <a
                href="mailto:testuser@gmail.com"
                className="text-base sm:text-lg font-bold text-[#09090b] hover:opacity-75 transition-opacity break-all sm:break-normal"
              >
                testuser@gmail.com
              </a>
            </div>

            <div>
              <span className="block font-mono text-[10px] sm:text-[11px] uppercase tracking-widest text-neutral-400 font-semibold mb-1.5 sm:mb-2">
                OFFICE
              </span>
              <span className="text-base sm:text-lg font-bold text-[#09090b]">
                New Delhi, India
              </span>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Contact Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-7 w-full"
        >
          <div className="relative rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-12 border border-black/10 bg-black/[0.02] shadow-[0_20px_50px_rgba(0,0,0,0.03)] backdrop-blur-sm">
            <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8 md:space-y-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                {/* Full Name */}
                <div className="space-y-2">
                  <label
                    htmlFor="fullName"
                    className="block font-mono text-[11px] uppercase tracking-widest text-neutral-500 font-medium"
                  >
                    FULL NAME
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    required
                    placeholder="John Doe"
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                    className="w-full bg-transparent border-b border-black/20 focus:border-black py-2.5 text-base text-[#09090b] placeholder:text-neutral-400 focus:outline-none transition-colors"
                  />
                </div>

                {/* Email Address */}
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="block font-mono text-[11px] uppercase tracking-widest text-neutral-500 font-medium"
                  >
                    EMAIL ADDRESS
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full bg-transparent border-b border-black/20 focus:border-black py-2.5 text-base text-[#09090b] placeholder:text-neutral-400 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Project Subject */}
              <div className="space-y-2">
                <label
                  htmlFor="subject"
                  className="block font-mono text-[11px] uppercase tracking-widest text-neutral-500 font-medium"
                >
                  PROJECT SUBJECT
                </label>
                <input
                  id="subject"
                  type="text"
                  required
                  placeholder="e.g. Web Development"
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData({ ...formData, subject: e.target.value })
                  }
                  className="w-full bg-transparent border-b border-black/20 focus:border-black py-2.5 text-base text-[#09090b] placeholder:text-neutral-400 focus:outline-none transition-colors"
                />
              </div>

              {/* Your Message */}
              <div className="space-y-2">
                <label
                  htmlFor="message"
                  className="block font-mono text-[11px] uppercase tracking-widest text-neutral-500 font-medium"
                >
                  YOUR MESSAGE
                </label>
                <textarea
                  id="message"
                  rows={4}
                  required
                  placeholder="Tell us about your project..."
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  className="w-full bg-transparent border-b border-black/20 focus:border-black py-2.5 text-base text-[#09090b] placeholder:text-neutral-400 focus:outline-none transition-colors resize-none"
                />
              </div>

              {/* Error Alert */}
              {errorMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-mono leading-relaxed"
                  role="alert"
                >
                  <span className="font-semibold">Error:</span> {errorMessage}
                </motion.div>
              )}

              {/* Submit Button & Feedback */}
              <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full sm:w-auto px-8 py-3.5 rounded-full text-xs font-mono font-semibold uppercase tracking-wider transition-all duration-200 shadow-md text-center ${
                    loading
                      ? "bg-neutral-400 text-white cursor-not-allowed"
                      : "bg-[#09090b] text-[#FFFFFE] hover:bg-neutral-800 active:scale-[0.98] cursor-pointer"
                  }`}
                >
                  {loading
                    ? "SENDING..."
                    : submitted
                    ? "MESSAGE SENT ✓"
                    : "SEND MESSAGE"}
                </button>

                {submitted && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-xs font-mono text-emerald-600 font-semibold"
                    role="status"
                  >
                    Thank you! We will get back to you shortly.
                  </motion.span>
                )}
              </div>
            </form>
          </div>
        </motion.div>
      </main>

      {/* 3. Bottom Tech Stack Infinite Marquee Ticker */}
      <footer className="w-full border-t border-black/10 py-6 overflow-hidden mt-12 bg-black/[0.01]">
        <div className="flex select-none">
          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear",
            }}
            className="flex items-center gap-10 whitespace-nowrap will-change-transform"
          >
            {[...TECH_STACK, ...TECH_STACK, ...TECH_STACK, ...TECH_STACK].map(
              (tech, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
                  <span className="font-serif italic text-base md:text-lg text-neutral-800 tracking-tight">
                    {tech}
                  </span>
                </div>
              )
            )}
          </motion.div>
        </div>
      </footer>
    </section>
  );
}

import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-[#FFFFFE] text-[#09090b] border-t border-black/10 pt-16 pb-12 selection:bg-black selection:text-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Top Callout / Headline Banner */}
        <div className="pb-14 border-b border-black/10 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
          <div className="max-w-2xl">
            <span className="font-mono text-xs uppercase tracking-widest text-neutral-500 font-semibold mb-3 block">
              Ethixweb Digital Operations
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-[#09090b] leading-tight">
              Revamp your online presence with bespoke designs crafted for your
              business success.
            </h2>
          </div>

          <a
            href="https://calendly.com/ethixweb-agency/30min?month=2026-06"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-7 py-3.5 rounded-full bg-[#09090b] text-[#FFFFFE] text-xs font-mono font-semibold uppercase tracking-wider hover:bg-neutral-800 active:scale-[0.98] transition-all shadow-sm"
          >
            Book an appointment ↗
          </a>
        </div>

        {/* Multi-column Navigation & Contact Details */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8 py-14 border-b border-black/10 text-sm">
          {/* Column 1: Contact Details */}
          <div className="md:col-span-2 space-y-4">
            <h3 className="font-mono text-xs uppercase tracking-widest text-neutral-500 font-semibold">
              Contact
            </h3>
            <div className="space-y-2 text-neutral-700">
              <p className="font-semibold text-base text-[#09090b]">
                Ethixweb USA LLC
              </p>
              <p className="text-neutral-600">Registered in Wyoming, United States</p>
              <p>
                <a
                  href="https://www.ethixweb.com/locations/kent-wa"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-black transition-colors"
                >
                  Serving Kent, WA
                </a>
              </p>
              <p>
                <a
                  href="mailto:info@ethixweb.com"
                  className="font-medium text-[#09090b] hover:opacity-75 transition-opacity"
                >
                  info@ethixweb.com
                </a>
              </p>
              <p className="text-xs font-mono text-neutral-500 pt-1">
                Mon-Fri · 9:00 AM - 5:00 PM
              </p>
            </div>
          </div>

          {/* Column 2: Company Links */}
          <div className="space-y-4">
            <h3 className="font-mono text-xs uppercase tracking-widest text-neutral-500 font-semibold">
              Company
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/about"
                  className="text-neutral-600 hover:text-black transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="text-neutral-600 hover:text-black transition-colors"
                >
                  Services
                </Link>
              </li>
              <li>
                <a
                  href="https://www.ethixweb.com/industries"
                  className="text-neutral-600 hover:text-black transition-colors"
                >
                  Industries
                </a>
              </li>
              <li>
                <a
                  href="https://www.ethixweb.com/our-work"
                  className="text-neutral-600 hover:text-black transition-colors"
                >
                  Our Work
                </a>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-neutral-600 hover:text-black transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Useful Links */}
          <div className="space-y-4">
            <h3 className="font-mono text-xs uppercase tracking-widest text-neutral-500 font-semibold">
              Useful Links
            </h3>
            <ul className="space-y-2.5">
              <li>
                <a
                  href="https://www.ethixweb.com/policies/refunds"
                  className="text-neutral-600 hover:text-black transition-colors"
                >
                  Cancellation & Refunds
                </a>
              </li>
              <li>
                <a
                  href="https://www.ethixweb.com/policies/terms"
                  className="text-neutral-600 hover:text-black transition-colors"
                >
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a
                  href="https://www.ethixweb.com/policies/privacy"
                  className="text-neutral-600 hover:text-black transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <Link
                  href="/admin"
                  className="text-neutral-500 hover:text-black transition-colors font-mono text-xs"
                >
                  Admin Portal ↗
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Sub-footer */}
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-neutral-500">
          <div>
            © 2026 Ethixweb. All rights reserved. Ethixweb USA LLC | Registered in
            Wyoming, United States
          </div>

          <a
            href="https://calendly.com/ethixweb-agency/30min?month=2026-06"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-[#09090b] underline hover:opacity-75"
          >
            Book an appointment
          </a>
        </div>
      </div>
    </footer>
  );
}

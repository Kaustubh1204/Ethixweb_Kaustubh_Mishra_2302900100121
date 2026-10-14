"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";

export const Navbar: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDarkBg, setIsDarkBg] = useState(false); // default to false (light bg = black text)
  const navRef = useRef<HTMLElement>(null);
  const lastScrollY = useRef(0);

  useEffect(() => {
    // Helper to determine whether an RGB color is dark
    const checkDarkBrightness = (r: number, g: number, b: number) => {
      // Perceived luminance formula (ITU-R BT.709)
      const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      return luminance < 140;
    };

    const detectBackgroundTheme = () => {
      if (typeof window === "undefined") return;

      // Sample a few points below the navbar
      const navEl = navRef.current;
      const navRect = navEl?.getBoundingClientRect();
      const sampleY = (navRect ? navRect.top + navRect.height / 2 : 40) + 10;
      const sampleX = window.innerWidth / 2;

      // Temporarily hide pointer-events or query elements below
      const elements = document.elementsFromPoint(sampleX, sampleY);
      let foundDark = false;

      for (const el of elements) {
        if (el === navEl || navEl?.contains(el)) continue;

        // Check explicit data-theme or dark classes
        const themeAttr = el.getAttribute("data-theme");
        if (themeAttr === "dark") {
          foundDark = true;
          break;
        }
        if (themeAttr === "light") {
          foundDark = false;
          break;
        }

        const compStyle = window.getComputedStyle(el);
        const bg = compStyle.backgroundColor;

        // Parse rgba / rgb
        const match = bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
        if (match) {
          const r = parseInt(match[1], 10);
          const g = parseInt(match[2], 10);
          const b = parseInt(match[3], 10);
          const a = match[4] !== undefined ? parseFloat(match[4]) : 1;

          // If element has significant background opacity
          if (a > 0.4) {
            foundDark = checkDarkBrightness(r, g, b);
            break;
          }
        }
      }

      setIsDarkBg(foundDark);
    };

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY.current;

      // Determine scroll direction with minimum movement threshold
      if (currentScrollY <= 40) {
        setIsVisible(true);
      } else if (delta > 8 && currentScrollY > 80) {
        // Scrolling down -> hide navbar (slides up)
        setIsVisible(false);
      } else if (delta < -8) {
        // Scrolling up -> reveal navbar (slides down)
        setIsVisible(true);
      }

      setIsScrolled(currentScrollY > 40);
      lastScrollY.current = currentScrollY;
      detectBackgroundTheme();
    };

    detectBackgroundTheme();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", detectBackgroundTheme, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", detectBackgroundTheme);
    };
  }, []);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Theme-derived classes
  // On dark bg: white text (#FFFFFF)
  // On light/white bg: black text (#000000)
  const textColorClass = isDarkBg ? "text-[#FFFFFF]" : "text-[#000000]";
  const hoverColorClass = isDarkBg ? "hover:text-neutral-300" : "hover:text-neutral-600";
  const scrolledBgClass = isDarkBg
    ? "bg-black/80 backdrop-blur-md border-b border-white/10 shadow-lg py-3 md:py-4"
    : "bg-white/80 backdrop-blur-md border-b border-black/10 shadow-sm py-3 md:py-4";

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 z-50 flex w-full justify-center px-4 sm:px-8 lg:px-12 py-3.5 md:py-5 pointer-events-auto transition-all duration-300 ease-out ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      } ${isScrolled || mobileMenuOpen ? scrolledBgClass : "bg-transparent"}`}
    >
      {/* Centered navigation container with balanced, equal horizontal spacing */}
      <div className="relative w-full max-w-6xl mx-auto flex items-center justify-between transition-colors duration-300">
        {/* Brand: EthixWeb linking to / */}
        <div>
          <Link
            href="/"
            onClick={() => {
              setMobileMenuOpen(false);
              if (typeof window !== "undefined" && window.location.pathname === "/") {
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
            className={`font-brand text-2xl sm:text-3xl font-bold tracking-tight cursor-pointer transition-colors duration-200 ${textColorClass} ${hoverColorClass}`}
          >
            EthixWeb
          </Link>
        </div>

        {/* Desktop Navigation Group: About, Services, svgDemo, Contact */}
        <div className={`hidden md:flex items-center gap-6 sm:gap-8 md:gap-10 font-nav text-lg sm:text-xl md:text-2xl font-light uppercase tracking-widest transition-colors duration-300 ${textColorClass}`}>
          <Link
            href="/about"
            className={`cursor-pointer transition-colors duration-200 ${hoverColorClass}`}
          >
            About
          </Link>

          <Link
            href="/services"
            className={`cursor-pointer transition-colors duration-200 ${hoverColorClass}`}
          >
            Services
          </Link>

          <Link
            href="/admin"
            title="Protected Demo Dashboard (Requires Login)"
            className={`flex items-center gap-2 cursor-pointer transition-colors duration-200 ${hoverColorClass}`}
          >
            <svg
              className="w-4 h-4 mb-0.5 opacity-90"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            <span>svgDemo</span>
          </Link>

          <Link
            href="/contact"
            className={`cursor-pointer transition-colors duration-200 ${hoverColorClass}`}
          >
            Contact
          </Link>
        </div>

        {/* Mobile Hamburger Button (Accessible, toggles expanded state) */}
        <button
          type="button"
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          className={`md:hidden p-2 rounded-lg transition-colors cursor-pointer ${textColorClass}`}
        >
          {mobileMenuOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Drawer Dropdown */}
      {mobileMenuOpen && (
        <div
          className={`md:hidden absolute top-full left-0 w-full px-6 py-6 border-b transition-all duration-300 ${
            isDarkBg
              ? "bg-black/95 text-white border-white/10 shadow-2xl"
              : "bg-white/95 text-black border-black/10 shadow-xl"
          }`}
        >
          <div className="flex flex-col gap-5 font-nav text-xl font-light uppercase tracking-widest">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:opacity-70 transition-opacity"
            >
              Home
            </Link>
            <Link
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:opacity-70 transition-opacity"
            >
              About
            </Link>
            <Link
              href="/services"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:opacity-70 transition-opacity"
            >
              Services
            </Link>
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 py-1 hover:opacity-70 transition-opacity"
            >
              <svg
                className="w-4 h-4 opacity-90"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              <span>svgDemo</span>
            </Link>
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:opacity-70 transition-opacity"
            >
              Contact
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

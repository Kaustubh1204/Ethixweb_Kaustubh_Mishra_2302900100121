import type { Metadata } from "next";
import { Bebas_Neue, Playfair_Display, Host_Grotesk } from "next/font/google";
import "./globals.css";

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
  display: "swap",
  preload: true,
});

const playfairDisplay = Playfair_Display({
  weight: ["400", "600"],
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const hostGrotesk = Host_Grotesk({
  variable: "--font-host-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "EthixWeb — Digital Operations, Web Development & AI Solutions",
  description: "Senior web development, digital operations, custom engineering, and AI solutions built for real business growth.",
};

import { Navbar } from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${bebasNeue.variable} ${playfairDisplay.variable} ${hostGrotesk.variable}`}
    >
      <body className="antialiased overflow-x-hidden bg-[#ebdc0b]">
        {/* Universal Navbar */}
        <Navbar />
        {children}
        {/* Universal Global Footer */}
        <Footer />
      </body>
    </html>
  );
}

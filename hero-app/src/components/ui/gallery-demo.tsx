"use client";

import * as React from "react";
import { Gallery, GalleryGrid, GalleryImage } from "@/components/ui/shared-element-gallery";

const IMAGES = [
  { id: "1", src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80", alt: "Modern architectural luxury home" },
  { id: "2", src: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80", alt: "Contemporary hillside villa" },
  { id: "3", src: "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80", alt: "Minimalist open-plan living room" },
  { id: "4", src: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80", alt: "Modern interior aesthetic lounge" },
  { id: "5", src: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80", alt: "Minimalist dining room with panoramic glass" },
  { id: "6", src: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80", alt: "Luxury bathroom with freestanding tub" },
  { id: "7", src: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80", alt: "Warm twilight architectural facade" },
  { id: "8", src: "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?auto=format&fit=crop&w=1200&q=80", alt: "Serene terrace patio with evening lighting" },
  { id: "9", src: "https://images.unsplash.com/photo-1502005229762-ee1b2da97e06?auto=format&fit=crop&w=1200&q=80", alt: "Sunlit Scandinavian interior" },
  { id: "10", src: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80", alt: "Chic modern bedroom" },
  { id: "11", src: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80", alt: "Contemporary estate exterior pool" },
  { id: "12", src: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80", alt: "Designer kitchen with marble island" },
];

export function GalleryDemo() {
  React.useEffect(() => {
    document.documentElement.style.overflowX = "hidden";
    document.body.style.overflowX = "hidden";
    return () => {
      document.documentElement.style.overflowX = "";
      document.body.style.overflowX = "";
    };
  }, []);

  return (
    <section className="w-full self-start min-h-screen bg-[#141414] text-[#e3e3db] border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-24">
        <header className="mb-16 space-y-4">
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-white">
            Curated Spaces
          </h2>
          <p className="text-lg sm:text-xl text-white/70 max-w-2xl">
            A premium photo experience with seamless shared-element transitions. 
            Tap any image to expand, drag vertically to dismiss.
          </p>
        </header>

        <Gallery>
          <GalleryGrid>
            {IMAGES.map((image) => (
              <GalleryImage 
                key={image.id} 
                id={image.id} 
                src={image.src} 
                alt={image.alt || `Premium photography ${image.id}`} 
              />
            ))}
          </GalleryGrid>
        </Gallery>
      </div>
    </section>
  );
}

export default GalleryDemo;

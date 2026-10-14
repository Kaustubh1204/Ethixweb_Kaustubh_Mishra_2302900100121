"use client";

import React from "react";
import { TestimonialsColumn, type TestimonialItem } from "@/components/ui/testimonials-columns-1";
import { motion } from "framer-motion";

const testimonials: TestimonialItem[] = [
  {
    text: "I have been contacted by many people/companies that want to build a website for my business, but I'm always skeptical about it. I decided to give Ethixweb that chance and they have proven themselves! I have been with them 2 years and within that first year my business had doubled. The second year my business had doubled again. My website is easy to follow, has everything on it I asked for, it loads fast and it's easy to maintain. The folks at Ethixweb are very professional, schedule meetings via video when I need something fixed and are on top of it. My computer skills are absolute garbage, so I am very lucky to have Ethixweb a part of my business!",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80",
    name: "Ryan Taylor",
    role: "Verified Client",
  },
  {
    text: "I had Ethixweb.com create me a website not only did they do it extremely professional, but they did it extremely fast and it came out fabulous they are very professional and they communicate great. I would highly recommend this company to create your next website. They are exceptional.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80",
    name: "Clinton Mcculloch",
    role: "Verified Client",
  },
  {
    text: "Amar is very thorough and quick to make changes on our website. Over the years that has been my biggest issue with web designers. Small changes can take way too long. Thankfully that is not the case here. Good service! Very happy customer!!",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&h=120&q=80",
    name: "Leslie Whitehurst-Manners",
    role: "Verified Client",
  },
  {
    text: "Ethixweb did an incredible job on our business website. It is very sharp, modern looking and has all the extra bells and whistles we need. The team was easy to work with, great communication and done in efficient time. They provided all details from start to finish and gave details to us moving forward with our website. I'd highly recommend them!!",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&h=120&q=80",
    name: "Kayla Kjl",
    role: "Verified Client",
  },
];

const firstColumn = [testimonials[0], testimonials[1]];
const secondColumn = [testimonials[2], testimonials[3]];
const thirdColumn = [testimonials[0], testimonials[3]];

export function Testimonials() {
  return (
    <section className="bg-[#FFFFFE] text-[#09090b] py-24 relative overflow-hidden border-t border-black/10">
      <div className="container z-10 mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="flex flex-col items-center justify-center max-w-[540px] mx-auto text-center"
        >
          <div className="flex justify-center">
            <div className="border border-black/10 bg-black/5 py-1 px-4 rounded-full text-xs font-mono tracking-widest uppercase text-amber-600 font-medium">
              Testimonials
            </div>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-[#09090b] mt-5">
            What our users say
          </h2>
          <p className="text-center mt-4 text-black/60 text-base md:text-lg max-w-md">
            See what our customers have to say about us.
          </p>
        </motion.div>

        <div className="flex justify-center gap-6 mt-16 [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)] max-h-[740px] overflow-hidden">
          <TestimonialsColumn testimonials={firstColumn} duration={15} />
          <TestimonialsColumn testimonials={secondColumn} className="hidden md:block" duration={19} />
          <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block" duration={17} />
        </div>
      </div>
    </section>
  );
}

export default Testimonials;

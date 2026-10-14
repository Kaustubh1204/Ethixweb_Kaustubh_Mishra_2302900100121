"use client";

import * as React from "react";
import PaperCurlCarousel, { type PaperCurlItem } from "@/components/ui/paper-curl-carousel";

const W = 1440;
const H = 836;
const SHEET_H = 1080;
const INSET = (SHEET_H - H) / 2;

type Ctx = CanvasRenderingContext2D;

function wrapText(
  ctx: Ctx,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
): number {
  const words = text.split(" ");
  let line = "";
  let currentY = y;

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + " ";
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line, x, currentY);
      line = words[n] + " ";
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, currentY);
  return currentY + lineHeight;
}

const SLIDES_DATA = [
  // Slide 1 — Our Story
  {
    slideNum: "01",
    tag: "OUR STORY",
    title: "Our Story",
    caption: "Built for contractors tired of big agency theater.",
    draw: (c: Ctx) => {
      // Header tag
      c.font = "600 14px monospace";
      c.fillStyle = "#71717A";
      c.fillText("SLIDE 01 · OUR STORY", 110, 110);

      // Main Heading
      c.font = "bold 52px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
      c.fillStyle = "#09090B";
      let y = wrapText(
        c,
        "Built for contractors tired of big agency theater.",
        110,
        180,
        1220,
        64
      );

      // Separator rule
      c.fillStyle = "#E4E4E7";
      c.fillRect(110, y + 10, 1220, 2);
      y += 50;

      // Paragraph 1
      c.font = "400 24px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
      c.fillStyle = "#27272A";
      y = wrapText(
        c,
        "We started Ethixweb because we were tired of watching good businesses get mediocre results from agencies that overpromise and underdeliver.",
        110,
        y,
        1220,
        40
      );

      y += 24;

      // Paragraph 2
      y = wrapText(
        c,
        "We're a tight knit team of developers, designers, and strategists, each senior in their craft. When you work with Ethixweb, you work directly with the people building your project. No account managers passing messages. No juniors learning on your budget.",
        110,
        y,
        1220,
        40
      );
    },
  },

  // Slide 2 — Mission & Vision
  {
    slideNum: "02",
    tag: "MISSION & VISION",
    title: "Mission & Vision",
    caption: "What drives us.",
    draw: (c: Ctx) => {
      c.font = "600 14px monospace";
      c.fillStyle = "#71717A";
      c.fillText("SLIDE 02 · MISSION & VISION", 110, 100);

      c.font = "bold 52px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
      c.fillStyle = "#09090B";
      c.fillText("What drives us.", 110, 165);

      c.fillStyle = "#E4E4E7";
      c.fillRect(110, 195, 1220, 2);

      // Subheading 1: Mission
      c.font = "700 18px monospace";
      c.fillStyle = "#EA580C"; // orange accent
      c.fillText("OUR MISSION", 110, 245);

      c.font = "bold 32px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
      c.fillStyle = "#09090B";
      c.fillText("Turn marketing spend into measurable revenue.", 110, 288);

      c.font = "400 22px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
      c.fillStyle = "#3F3F46";
      wrapText(
        c,
        "Every project we take on is judged the same way: did it move the needle on bookings, leads, and revenue? We build websites and systems that earn their place in your budget.",
        110,
        330,
        1220,
        36
      );

      // Subheading 2: Vision
      c.font = "700 18px monospace";
      c.fillStyle = "#EA580C";
      c.fillText("OUR VISION", 110, 470);

      c.font = "bold 32px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
      c.fillStyle = "#09090B";
      c.fillText("The senior team contractors call first.", 110, 512);

      c.font = "400 22px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
      c.fillStyle = "#3F3F46";
      wrapText(
        c,
        "We're building Ethixweb into the go-to growth partner for home service businesses — known for senior craftsmanship, straight talk, and results you can point to.",
        110,
        554,
        1220,
        36
      );
    },
  },

  // Slide 3 — How We Work
  {
    slideNum: "03",
    tag: "HOW WE WORK",
    title: "How We Work",
    caption: "A clear process. Zero guesswork.",
    draw: (c: Ctx) => {
      c.font = "600 14px monospace";
      c.fillStyle = "#71717A";
      c.fillText("SLIDE 03 · HOW WE WORK", 110, 80);

      c.font = "bold 44px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
      c.fillStyle = "#09090B";
      c.fillText("A clear process. Zero guesswork.", 110, 135);

      c.font = "400 20px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
      c.fillStyle = "#3F3F46";
      c.fillText(
        "From the first call to launch day, you'll always know what's happening, why, and what's next. No black boxes, no surprise invoices.",
        110,
        175
      );

      // Weekly accountability callout banner
      c.fillStyle = "#F4F4F5";
      c.beginPath();
      c.roundRect(110, 205, 1220, 95, 12);
      c.fill();

      c.font = "700 14px monospace";
      c.fillStyle = "#18181B";
      c.fillText("WEEKLY ACCOUNTABILITY (Typical time to launch: 2–4 weeks)", 140, 238);

      c.font = "400 17px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
      c.fillStyle = "#52525B";
      c.fillText("• You know what's shipping.      • You know why it's prioritized.      • You see what it moved.", 140, 272);

      // 4 Process steps
      const steps = [
        {
          num: "01",
          title: "Discover & Strategize",
          desc: "We dig into your business, customers, and competitors to build a plan focused on revenue, not vanity metrics.",
        },
        {
          num: "02",
          title: "Design & Build",
          desc: "Senior designers and developers create a fast, conversion-focused site or system, built right the first time.",
        },
        {
          num: "03",
          title: "Launch & Optimize",
          desc: "We ship in weeks, not months, then track real data to refine messaging, design, and performance.",
        },
        {
          num: "04",
          title: "Grow & Scale",
          desc: "Once the foundation works, we double down on what's driving results and scale it across channels.",
        },
      ];

      const startY = 325;
      steps.forEach((step, i) => {
        const sy = startY + i * 115;
        // Step number badge
        c.font = "bold 20px monospace";
        c.fillStyle = "#09090B";
        c.fillText(step.num, 110, sy + 30);

        // Step title
        c.font = "bold 22px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
        c.fillStyle = "#09090B";
        c.fillText(step.title, 160, sy + 30);

        // Step description
        c.font = "400 18px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
        c.fillStyle = "#52525B";
        wrapText(c, step.desc, 160, sy + 60, 1170, 28);
      });
    },
  },

  // Slide 4 — Core Values
  {
    slideNum: "04",
    tag: "CORE VALUES",
    title: "Core Values",
    caption: "Core values that shape everything we build.",
    draw: (c: Ctx) => {
      c.font = "600 14px monospace";
      c.fillStyle = "#71717A";
      c.fillText("SLIDE 04 · CORE VALUES", 110, 100);

      c.font = "bold 48px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
      c.fillStyle = "#09090B";
      c.fillText("Core values that shape everything we build.", 110, 165);

      c.fillStyle = "#E4E4E7";
      c.fillRect(110, 195, 1220, 2);

      const values = [
        {
          num: "1",
          title: "Revenue Obsessed",
          desc: "We measure success in booked jobs and revenue, not impressions, clicks, or awards.",
        },
        {
          num: "2",
          title: "Senior Team Only",
          desc: "You talk directly to the people doing the work. No layers, no handoffs, no jargon.",
        },
        {
          num: "3",
          title: "Move Fast, Ship Clean",
          desc: "Lean process, weekly iteration. We launch in weeks and optimize forever.",
        },
      ];

      values.forEach((v, idx) => {
        const vy = 250 + idx * 160;

        // Card frame
        c.fillStyle = "#FAFAFA";
        c.beginPath();
        c.roundRect(110, vy, 1220, 125, 16);
        c.fill();
        c.strokeStyle = "#E4E4E7";
        c.lineWidth = 1.5;
        c.stroke();

        // Value number badge
        c.font = "bold 24px monospace";
        c.fillStyle = "#EA580C";
        c.fillText(`0${v.num}`, 145, vy + 50);

        // Value title
        c.font = "bold 28px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
        c.fillStyle = "#09090B";
        c.fillText(v.title, 210, vy + 50);

        // Value description
        c.font = "400 20px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
        c.fillStyle = "#52525B";
        wrapText(c, v.desc, 210, vy + 88, 1080, 30);
      });
    },
  },

  // Slide 5 — Why Ethixweb
  {
    slideNum: "05",
    tag: "WHY ETHIXWEB",
    title: "Why Ethixweb",
    caption: "Why clients choose us and stay.",
    draw: (c: Ctx) => {
      c.font = "600 14px monospace";
      c.fillStyle = "#71717A";
      c.fillText("SLIDE 05 · WHY ETHIXWEB", 110, 90);

      c.font = "bold 48px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
      c.fillStyle = "#09090B";
      c.fillText("Why clients choose us and stay.", 110, 150);

      // 4 Key Statistics cards
      const stats = [
        { val: "2–4 wks", label: "Typical time to launch" },
        { val: "100%", label: "Senior-led delivery" },
        { val: "24/7", label: "Global availability" },
        { val: "4.0", label: "Average client rating" },
      ];

      stats.forEach((st, i) => {
        const sx = 110 + i * 315;
        c.fillStyle = "#F4F4F5";
        c.beginPath();
        c.roundRect(sx, 185, 290, 100, 12);
        c.fill();

        c.font = "bold 32px monospace";
        c.fillStyle = "#09090B";
        c.fillText(st.val, sx + 24, 232);

        c.font = "500 14px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
        c.fillStyle = "#71717A";
        c.fillText(st.label, sx + 24, 262);
      });

      // Reasons clients choose Ethixweb
      c.font = "bold 20px monospace";
      c.fillStyle = "#09090B";
      c.fillText("REASONS CLIENTS CHOOSE ETHIXWEB", 110, 330);

      const reasons = [
        "• Direct access to senior developers and strategists",
        "• Transparent pricing, no hidden retainers",
        "• Decisions backed by data, not guesswork",
        "• Fast turnarounds without cutting corners",
        "• Ongoing support after launch",
        "• US-focused communication and operations",
      ];

      reasons.slice(0, 3).forEach((r, idx) => {
        c.font = "400 19px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
        c.fillStyle = "#3F3F46";
        c.fillText(r, 110, 370 + idx * 36);
      });

      reasons.slice(3, 6).forEach((r, idx) => {
        c.font = "400 19px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
        c.fillStyle = "#3F3F46";
        c.fillText(r, 680, 370 + idx * 36);
      });

      // Testimonial box
      c.fillStyle = "#FAFAFA";
      c.beginPath();
      c.roundRect(110, 500, 1220, 150, 16);
      c.fill();
      c.strokeStyle = "#E4E4E7";
      c.lineWidth = 1.5;
      c.stroke();

      c.font = "italic 400 24px Georgia, serif";
      c.fillStyle = "#18181B";
      wrapText(
        c,
        '"The team was easy to work with, great communication and done in efficient time."',
        150,
        555,
        1140,
        36
      );

      c.font = "bold 16px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
      c.fillStyle = "#09090B";
      c.fillText("— Kayla Kjl", 150, 615);

      c.font = "500 14px monospace";
      c.fillStyle = "#71717A";
      c.fillText(" · Verified client", 260, 615);
    },
  },

  // Slide 6 — Ethixweb vs. the Typical Agency
  {
    slideNum: "06",
    tag: "ETHIXWEB VS TYPICAL AGENCY",
    title: "Ethixweb vs. Typical Agency",
    caption: "Ethixweb vs. the typical agency.",
    draw: (c: Ctx) => {
      c.font = "600 14px monospace";
      c.fillStyle = "#71717A";
      c.fillText("SLIDE 06 · COMPARISON", 110, 80);

      c.font = "bold 44px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
      c.fillStyle = "#09090B";
      c.fillText("Ethixweb vs. the typical agency.", 110, 135);

      const rows = [
        {
          label: "Who does the work",
          ethix: "The senior team on your kickoff call.",
          typical: "Juniors behind an account manager.",
        },
        {
          label: "Pricing",
          ethix: "Fixed scope, agreed in writing upfront.",
          typical: "Open-ended retainers and surprise invoices.",
        },
        {
          label: "What gets reported",
          ethix: "Calls, bookings, and revenue.",
          typical: "Impressions, clicks, and vanity dashboards.",
        },
        {
          label: "Time to launch",
          ethix: "2–4 weeks.",
          typical: "A quarter of discovery theater.",
        },
        {
          label: "Getting answers",
          ethix: "A direct line to the people building.",
          typical: "Ticket queues and message relays.",
        },
      ];

      // Table headers
      c.font = "bold 13px monospace";
      c.fillStyle = "#71717A";
      c.fillText("CATEGORY", 110, 175);
      c.fillStyle = "#09090B";
      c.fillText("ETHIXWEB", 380, 175);
      c.fillStyle = "#71717A";
      c.fillText("TYPICAL AGENCY", 820, 175);

      c.fillStyle = "#E4E4E7";
      c.fillRect(110, 190, 1220, 1.5);

      rows.forEach((row, i) => {
        const ry = 225 + i * 65;

        c.font = "600 17px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
        c.fillStyle = "#09090B";
        c.fillText(row.label, 110, ry);

        c.font = "500 17px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
        c.fillStyle = "#09090B";
        c.fillText(row.ethix, 380, ry);

        c.font = "400 17px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
        c.fillStyle = "#71717A";
        c.fillText(row.typical, 820, ry);

        c.fillStyle = "#F4F4F5";
        c.fillRect(110, ry + 16, 1220, 1);
      });

      // US Business Entity note
      const entityY = 560;
      c.fillStyle = "#FAFAFA";
      c.beginPath();
      c.roundRect(110, entityY, 1220, 120, 14);
      c.fill();
      c.strokeStyle = "#E4E4E7";
      c.lineWidth = 1;
      c.stroke();

      c.font = "bold 16px monospace";
      c.fillStyle = "#09090B";
      c.fillText("US BUSINESS ENTITY: ETHIXWEB USA LLC", 140, entityY + 38);

      c.font = "400 17px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
      c.fillStyle = "#52525B";
      wrapText(
        c,
        "Ethixweb operates in the United States through Ethixweb USA LLC, a Wyoming-registered company. When you work with us, you're contracting with a US business entity, providing additional confidence, transparency, and accountability.",
        140,
        entityY + 70,
        1160,
        26
      );
    },
  },
];

function paintTextSlides(): PaperCurlItem[] {
  if (typeof document === "undefined") return [];
  const canvas = document.createElement("canvas");
  canvas.width = W * 2;
  canvas.height = SHEET_H * 2;
  const c = canvas.getContext("2d");
  if (!c) return [];

  return SLIDES_DATA.map((slide) => {
    c.setTransform(2, 0, 0, 2, 0, 0);

    // Clean pure background with subtle warm paper tone #FFFFFE / #FAFAFA
    c.fillStyle = "#FFFFFE";
    c.fillRect(0, 0, W, SHEET_H);

    c.translate(0, INSET);
    slide.draw(c);

    return {
      title: slide.title,
      caption: slide.caption,
      alt: slide.caption,
      src: canvas.toDataURL("image/png"),
    };
  });
}

export function PaperCurlDemo() {
  const [items, setItems] = React.useState<PaperCurlItem[]>([]);

  React.useEffect(() => {
    setItems(paintTextSlides());
  }, []);

  if (items.length === 0) {
    return (
      <div className="w-full h-[75vh] md:h-[90vh] bg-[#FFFFFE] animate-pulse border border-black/10 rounded-2xl" />
    );
  }

  return (
    <div className="w-full h-[65vh] min-h-[460px] sm:h-[75vh] md:h-[90vh] bg-[#FFFFFE]">
      <PaperCurlCarousel items={items} height="100%" paper="#FFFFFE" autoplay={0} />
    </div>
  );
}

export default PaperCurlDemo;

"use client";

import React, { forwardRef } from "react";

// Exact digit sequences to achieve 000 -> 100 without DOM mutations
const DIGIT_3_NUMBERS: number[] = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
  0
];

const DIGIT_2_NUMBERS: number[] = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0
];

export const Preloader = forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <div
      ref={ref}
      className="pre-loader-overlay pre-loader fixed inset-0 w-screen h-screen bg-[#1a1a1a] z-50 flex justify-end items-end p-4 sm:p-8 md:p-12 overflow-hidden pointer-events-none select-none"
    >
      {/* 
        Single content wrapper anchored to bottom-right:
        width: fit-content ensures the progress bar underneath matches the exact width of "LOADING 100%"
      */}
      <div className="preloader-content flex flex-col items-end w-fit gap-1 sm:gap-1.5">
        {/* 
          Text Row:
          One single horizontal flex row holding "LOADING" on the left,
          the 3-digit counter, and the "%" symbol.
        */}
        <div className="preloader-row flex flex-row items-end gap-1.5 sm:gap-3 md:gap-4 whitespace-nowrap">
          {/* "LOADING" label */}
          <span className="loading-label loading-text font-[family-name:var(--font-bebas)] text-3xl sm:text-5xl md:text-6xl leading-none uppercase text-white m-0 pb-1 sm:pb-2 tracking-[0.05em]">
            Loading
          </span>

          {/* 
            Counter Window:
            Responsive clipping window holding digit-1, digit-2, digit-3.
          */}
          <div className="counter clip-counter flex flex-row items-start h-[52px] sm:h-[80px] md:h-[100px] leading-[80px] sm:leading-[120px] md:leading-[150px] font-[family-name:var(--font-bebas)] text-[52px] sm:text-[80px] md:text-[100px] text-white overflow-hidden select-none">
            {/* Digit 1 (0 -> 1) */}
            <div className="digit-1 relative -top-2 sm:-top-3 md:-top-4 flex flex-col items-center w-6 sm:w-10 md:w-12 text-white">
              <div className="num h-[80px] sm:h-[120px] md:h-[150px] leading-[80px] sm:leading-[120px] md:leading-[150px] text-center text-white">0</div>
              <div className="num h-[80px] sm:h-[120px] md:h-[150px] leading-[80px] sm:leading-[120px] md:leading-[150px] text-center text-white">1</div>
            </div>

            {/* Digit 2 (0 -> 9 -> 0) */}
            <div className="digit-2 relative -top-2 sm:-top-3 md:-top-4 flex flex-col items-center w-6 sm:w-10 md:w-12 text-white">
              {DIGIT_2_NUMBERS.map((num, i) => (
                <div
                  key={i}
                  className="num h-[80px] sm:h-[120px] md:h-[150px] leading-[80px] sm:leading-[120px] md:leading-[150px] text-center text-white"
                >
                  {num}
                </div>
              ))}
            </div>

            {/* Digit 3 (Fast ticker) */}
            <div className="digit-3 relative -top-2 sm:-top-3 md:-top-4 flex flex-col items-center w-6 sm:w-10 md:w-12 text-white">
              {DIGIT_3_NUMBERS.map((num, i) => (
                <div
                  key={i}
                  className="num h-[80px] sm:h-[120px] md:h-[150px] leading-[80px] sm:leading-[120px] md:leading-[150px] text-center text-white"
                >
                  {num}
                </div>
              ))}
            </div>
          </div>

          {/* 
            Percent symbol "%":
          */}
          <span className="percent-symbol font-[family-name:var(--font-bebas)] text-3xl sm:text-5xl md:text-[65px] leading-none text-white m-0 pb-1 sm:pb-2">
            %
          </span>
        </div>

        {/* 
          Progress Bar Container / Track:
        */}
        <div className="progress-bar-container progress-bar-track relative w-full h-[3px] sm:h-[4px] bg-white/10 overflow-hidden mt-0.5 sm:mt-1 rounded-full">
          <div className="progress-bar absolute right-0 top-0 w-full h-full bg-white scale-x-0 origin-right rounded-full" />
        </div>
      </div>
    </div>
  );
});

Preloader.displayName = "Preloader";
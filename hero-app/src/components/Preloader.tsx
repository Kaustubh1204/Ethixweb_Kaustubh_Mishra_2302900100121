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
      className="pre-loader-overlay pre-loader"
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "#1a1a1a",
        zIndex: 50,
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "flex-end",
        padding: "3rem",
        overflow: "hidden",
        pointerEvents: "none",
        userSelect: "none",
      }}
    >
      {/* 
        Single content wrapper anchored to bottom-right:
        width: fit-content ensures the progress bar underneath matches the exact width of "LOADING 100%"
      */}
      <div
        className="preloader-content"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          width: "fit-content",
        }}
      >
        {/* 
          Text Row:
          One single horizontal flex row holding "LOADING" on the left,
          the 3-digit counter, and the "%" symbol.
        */}
        <div
          className="preloader-row"
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "flex-end",
            gap: "1rem",
            whiteSpace: "nowrap",
          }}
        >
          {/* "LOADING" label */}
          <span
            className="loading-label loading-text"
            style={{
              fontFamily: "var(--font-bebas), sans-serif",
              fontSize: "60px",
              lineHeight: "60px",
              textTransform: "uppercase",
              color: "#ffffff",
              letterSpacing: "0.05em",
              margin: 0,
              paddingBottom: "8px",
            }}
          >
            Loading
          </span>

          {/* 
            Counter Window:
            Fixed 100px clipping window. Holds digit-1, digit-2, digit-3 side by side.
          */}
          <div
            className="counter clip-counter"
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "flex-start",
              height: "100px",
              lineHeight: "150px",
              fontFamily: "var(--font-bebas), sans-serif",
              fontSize: "100px",
              color: "#ffffff",
              clipPath: "polygon(0 0, 100% 0, 100% 100px, 0 100px)",
              overflow: "hidden",
            }}
          >
            {/* Digit 1 (0 -> 1) */}
            <div
              className="digit-1"
              style={{
                position: "relative",
                top: "-15px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: "48px",
              }}
            >
              <div className="num" style={{ height: "150px", lineHeight: "150px", textAlign: "center", color: "#ffffff" }}>0</div>
              <div className="num" style={{ height: "150px", lineHeight: "150px", textAlign: "center", color: "#ffffff" }}>1</div>
            </div>

            {/* Digit 2 (0 -> 9 -> 0) */}
            <div
              className="digit-2"
              style={{
                position: "relative",
                top: "-15px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: "48px",
              }}
            >
              {DIGIT_2_NUMBERS.map((num, i) => (
                <div
                  key={i}
                  className="num"
                  style={{ height: "150px", lineHeight: "150px", textAlign: "center", color: "#ffffff" }}
                >
                  {num}
                </div>
              ))}
            </div>

            {/* Digit 3 (Fast ticker) */}
            <div
              className="digit-3"
              style={{
                position: "relative",
                top: "-15px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: "48px",
              }}
            >
              {DIGIT_3_NUMBERS.map((num, i) => (
                <div
                  key={i}
                  className="num"
                  style={{ height: "150px", lineHeight: "150px", textAlign: "center", color: "#ffffff" }}
                >
                  {num}
                </div>
              ))}
            </div>
          </div>

          {/* 
            Percent symbol "%":
            Placed immediately after the animated digits in the same horizontal row,
            aligned along the baseline.
          */}
          <span
            className="percent-symbol"
            style={{
              fontFamily: "var(--font-bebas), sans-serif",
              fontSize: "65px",
              lineHeight: "65px",
              color: "#ffffff",
              margin: 0,
              paddingBottom: "8px",
            }}
          >
            %
          </span>
        </div>

        {/* 
          Progress Bar Container / Track:
          Directly underneath the text row, spans the exact width of the content.
        */}
        <div
          className="progress-bar-container progress-bar-track"
          style={{
            position: "relative",
            width: "100%",
            height: "4px",
            background: "transparent",
            overflow: "hidden",
            marginTop: "2px",
          }}
        >
          <div
            className="progress-bar"
            style={{
              position: "absolute",
              right: 0,
              top: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "#ffffff",
              transform: "scaleX(0)",
              transformOrigin: "right center",
            }}
          />
        </div>
      </div>
    </div>
  );
});

Preloader.displayName = "Preloader";
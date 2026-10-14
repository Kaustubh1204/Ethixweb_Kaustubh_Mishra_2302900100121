"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "motion/react"

export interface Frame {
  id: number
  video: string
  title?: string
  description?: string
  defaultPos: { x: number; y: number; w: number; h: number }
  corner?: string
  edgeHorizontal?: string
  edgeVertical?: string
  mediaSize: number
  borderThickness?: number
  borderSize?: number
  isHovered: boolean
}

interface FrameComponentProps {
  video: string
  title?: string
  description?: string
  width: number | string
  height: number | string
  className?: string
  corner?: string
  edgeHorizontal?: string
  edgeVertical?: string
  mediaSize: number
  borderThickness?: number
  borderSize?: number
  showFrame: boolean
  isHovered: boolean
}

function FrameComponent({
  video,
  title,
  description,
  width,
  height,
  className = "",
  corner = "",
  edgeHorizontal = "",
  edgeVertical = "",
  mediaSize,
  borderThickness = 0,
  borderSize = 100,
  showFrame,
  isHovered,
}: FrameComponentProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting)
      },
      { rootMargin: "250px" }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!inView) {
      videoRef.current?.pause()
      return
    }
    if (isHovered) {
      videoRef.current?.pause()
    } else {
      videoRef.current?.play().catch(() => {})
    }
  }, [isHovered, inView])

  return (
    <div
      ref={containerRef}
      className={`relative ${className}`}
      style={{
        width,
        height,
        transition: "width 0.3s ease-in-out, height 0.3s ease-in-out",
      }}
    >
      <div className="relative w-full h-full overflow-hidden">
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            zIndex: 1,
            transition: "all 0.3s ease-in-out",
            padding: showFrame ? `${borderThickness}px` : "0",
            width: showFrame ? `${borderSize}%` : "100%",
            height: showFrame ? `${borderSize}%` : "100%",
            left: showFrame ? `${(100 - borderSize) / 2}%` : "0",
            top: showFrame ? `${(100 - borderSize) / 2}%` : "0",
          }}
        >
          <div
            className="w-full h-full overflow-hidden relative"
            style={{
              transform: `scale(${mediaSize})`,
              transformOrigin: "center",
              transition: "transform 0.3s ease-in-out",
            }}
          >
            <video
              className={`w-full h-full object-cover transition-opacity duration-300 ${
                isHovered ? "opacity-0" : "opacity-100"
              }`}
              src={inView ? video : undefined}
              preload="none"
              loop
              muted
              playsInline
              ref={videoRef}
            />

            {/* Hover State: Display description in place of video */}
            <div
              className={`absolute inset-0 bg-black/90 p-5 md:p-6 flex flex-col justify-center items-center text-center transition-opacity duration-300 ${
                isHovered ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
              }`}
            >
              {title && (
                <h3 className="text-lg md:text-xl font-bold tracking-tight text-white mb-2">
                  {title}
                </h3>
              )}
              {description && (
                <p className="text-xs md:text-sm text-white/80 leading-relaxed max-w-sm">
                  {description}
                </p>
              )}
            </div>
          </div>
        </div>

        {showFrame && (
          <div className="absolute inset-0" style={{ zIndex: 2 }}>
            <div
              className="absolute top-0 left-0 w-16 h-16 bg-contain bg-no-repeat"
              style={{ backgroundImage: `url(${corner})` }}
            />
            <div
              className="absolute top-0 right-0 w-16 h-16 bg-contain bg-no-repeat"
              style={{ backgroundImage: `url(${corner})`, transform: "scaleX(-1)" }}
            />
            <div
              className="absolute bottom-0 left-0 w-16 h-16 bg-contain bg-no-repeat"
              style={{ backgroundImage: `url(${corner})`, transform: "scaleY(-1)" }}
            />
            <div
              className="absolute bottom-0 right-0 w-16 h-16 bg-contain bg-no-repeat"
              style={{ backgroundImage: `url(${corner})`, transform: "scale(-1, -1)" }}
            />

            <div
              className="absolute top-0 left-16 right-16 h-16"
              style={{
                backgroundImage: `url(${edgeHorizontal})`,
                backgroundSize: "auto 64px",
                backgroundRepeat: "repeat-x",
              }}
            />
            <div
              className="absolute bottom-0 left-16 right-16 h-16"
              style={{
                backgroundImage: `url(${edgeHorizontal})`,
                backgroundSize: "auto 64px",
                backgroundRepeat: "repeat-x",
                transform: "rotate(180deg)",
              }}
            />
            <div
              className="absolute left-0 top-16 bottom-16 w-16"
              style={{
                backgroundImage: `url(${edgeVertical})`,
                backgroundSize: "64px auto",
                backgroundRepeat: "repeat-y",
              }}
            />
            <div
              className="absolute right-0 top-16 bottom-16 w-16"
              style={{
                backgroundImage: `url(${edgeVertical})`,
                backgroundSize: "64px auto",
                backgroundRepeat: "repeat-y",
                transform: "scaleX(-1)",
              }}
            />
          </div>
        )}
      </div>
    </div>
  )
}

interface DynamicFrameLayoutProps {
  frames: Frame[]
  className?: string
  showFrames?: boolean
  hoverSize?: number
  gapSize?: number
}

export function DynamicFrameLayout({ 
  frames: initialFrames, 
  className,
  showFrames = false,
  hoverSize = 6,
  gapSize = 4
}: DynamicFrameLayoutProps) {
  const [frames] = useState<Frame[]>(initialFrames)
  const [hovered, setHovered] = useState<{ row: number; col: number } | null>(null)

  const maxRow = Math.max(...frames.map((f) => Math.floor(f.defaultPos.y / 4)), 0)
  const maxCol = Math.max(...frames.map((f) => Math.floor(f.defaultPos.x / 4)), 0)
  const numRows = maxRow + 1
  const numCols = maxCol + 1

  const getRowSizes = () => {
    if (hovered === null) return Array(numRows).fill("1fr").join(" ")
    const { row } = hovered
    if (numRows <= 1) return "1fr"
    const nonHoveredRatio = (numRows * 4 - hoverSize) / (numRows - 1)
    return Array.from({ length: numRows }, (_, r) => (r === row ? `${hoverSize}fr` : `${nonHoveredRatio}fr`)).join(" ")
  }

  const getColSizes = () => {
    if (hovered === null) return Array(numCols).fill("1fr").join(" ")
    const { col } = hovered
    if (numCols <= 1) return "1fr"
    const nonHoveredRatio = (numCols * 4 - hoverSize) / (numCols - 1)
    return Array.from({ length: numCols }, (_, c) => (c === col ? `${hoverSize}fr` : `${nonHoveredRatio}fr`)).join(" ")
  }

  const getTransformOrigin = (x: number, y: number) => {
    const vertical = y === 0 ? "top" : y === 4 ? "center" : "bottom"
    const horizontal = x === 0 ? "left" : x === 4 ? "center" : "right"
    return `${vertical} ${horizontal}`
  }

  return (
    <div
      className={`relative w-full h-full ${className}`}
      style={{
        display: "grid",
        gridTemplateRows: getRowSizes(),
        gridTemplateColumns: getColSizes(),
        gap: `${gapSize}px`,
        transition: "grid-template-rows 0.4s ease, grid-template-columns 0.4s ease",
      }}
    >
      {frames.map((frame) => {
        const row = Math.floor(frame.defaultPos.y / 4)
        const col = Math.floor(frame.defaultPos.x / 4)
        const transformOrigin = getTransformOrigin(frame.defaultPos.x, frame.defaultPos.y)

        return (
          <motion.div
            key={frame.id}
            className="relative"
            style={{
              transformOrigin,
              transition: "transform 0.4s ease",
            }}
            onMouseEnter={() => setHovered({ row, col })}
            onMouseLeave={() => setHovered(null)}
          >
            <FrameComponent
              video={frame.video}
              title={frame.title}
              description={frame.description}
              width="100%"
              height="100%"
              className="absolute inset-0"
              corner={frame.corner}
              edgeHorizontal={frame.edgeHorizontal}
              edgeVertical={frame.edgeVertical}
              mediaSize={frame.mediaSize}
              borderThickness={frame.borderThickness}
              borderSize={frame.borderSize}
              showFrame={showFrames}
              isHovered={hovered?.row === row && hovered?.col === col}
            />
          </motion.div>
        )
      })}
    </div>
  )
}

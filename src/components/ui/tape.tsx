import * as React from "react"
import { cn } from "@/lib/utils"

/* ──────────────────────────────────────────────
   Tape — unified 100% vector tape & sticker assets
   ────────────────────────────────────────────── */
export interface TapeProps extends React.ComponentProps<"div"> {
  variant?: "tape-1" | "tape-2" | "tape-3" | "sticker-8" | "sticker-9" | "torn" | "smooth" | "scotch"
  position?: "top-left" | "top-right" | "center" | "bottom-left" | "bottom-right" | "news" | "event"
  color?: "yellow" | "red" | "blue" | "green"
  text?: string
}

function Tape({
  className,
  variant = "tape-1",
  position = "top-left",
  color = "yellow",
  text,
  children,
  ...props
}: TapeProps) {
  const stickerColorMap = {
    yellow: { bg: "#eaff3d", text: "#0d0d0d" },
    red: { bg: "#ff505e", text: "#ffffff" },
    blue: { bg: "#603bff", text: "#eaff3d" },
    green: { bg: "#6af7ce", text: "#0d0d0d" },
  }

  const colors = stickerColorMap[color] || stickerColorMap.yellow
  const displayText = text || (variant === "torn" || variant === "sticker-9" ? "" : "ALERT!")

  // Render SVG content based on variant
  const renderSvg = () => {
    switch (variant) {
      case "sticker-9":
        return (
          <img
            src="/official/tape/sticker-9.png"
            srcSet="/official/tape/sticker-9.png 1x, /official/tape/sticker-9-2x.png 2x"
            alt=""
            className="w-full h-auto drop-shadow-[2px_2px_2px_rgba(0,0,0,0.3)]"
            draggable={false}
          />
        )
      case "torn":
        return (
          <svg
            viewBox="0 0 96 31"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-auto drop-shadow-[2px_2px_2px_rgba(0,0,0,0.3)]"
          >
            <path
              d="M 4,1.5
               Q 27,0.5 48,1.2 Q 70,0.5 92,1.5
               L 93,3 L 91.5,4.5 L 94,6 L 92,7.5 L 94.5,9 L 92.5,11 L 95,12.5 L 93,14 L 95.5,15.5 L 93.5,17 L 95,18.5 L 93,20 L 94.5,22 L 92.5,23.5 L 94,25 L 92,26.5 L 93.5,28 L 91,29.5
               Q 70,30.5 48,29.2 Q 26,30 4,29.5
               L 2.5,28 L 4,26.5 L 1.8,25 L 3.5,23.5 L 1.2,22 L 3.2,20.5 L 1,19 L 2.8,17.5 L 0.8,16 L 2.5,14.5 L 0.5,13 L 2.2,11.5 L 0.8,10 L 2.8,8.5 L 1.2,7 L 3.2,5.5 L 1.8,4 L 4,1.5
               Z"
              fill={colors.bg}
            />
            <g fill={colors.text}>
              <path
                d="M74,7 h4.5 c1.5,0 2.5,0.8 2.5,1.8 v0.2 c0,0.8 -0.6,1.4 -1.5,1.6 c1,0.2 1.7,0.8 1.7,1.7 v0.2 c0,1 -1,1.8 -2.5,1.8 h-4.7 z M76.5,8.8 v2.2 h1.8 c0.3,0 0.5,-0.2 0.5,-0.5 v-1.2 c0,-0.3 -0.2,-0.5 -0.5,-0.5 z M76.5,12.5 v2.2 h2 c0.3,0 0.5,-0.2 0.5,-0.5 v-1.2 c0,-0.3 -0.2,-0.5 -0.5,-0.5 z"
              />
              <text x="73" y="26" fontFamily="monospace" fontWeight="900" fontSize="4.5" letterSpacing="0.2">VALK</text>
            </g>
            <g fill={colors.text}>
              <rect x="11" y="9" width="3" height="13" />
              <circle cx="21" cy="15" r="5" stroke={colors.text} strokeWidth="1.8" fill="none" />
              <line x1="26.5" y1="9" x2="26.5" y2="22" stroke={colors.text} strokeWidth="1.8" />
              <rect x="36" y="10" width="5.5" height="1" />
              <rect x="36" y="15" width="5.5" height="1" />
              <rect x="36" y="20" width="5.5" height="1" />
              <rect x="46" y="20" width="5.5" height="1" />
            </g>
            <g fill={colors.text}>
              {displayText && displayText !== "NEWS!" && displayText !== "8W-157" ? (
                <text
                  x="8"
                  y="19.5"
                  fontFamily="sans-serif"
                  fontWeight="900"
                  fontSize={displayText.length > 12 ? "6.5" : displayText.length > 9 ? "7.5" : "8.5"}
                  letterSpacing="0.3"
                >
                  {displayText.toUpperCase()}
                </text>
              ) : (
                <path
                  d="M10,21 L16,11 H22 L16,21 H10 Z M20,21 L26,11 H32 L26,21 H20 Z M30,21 L36,11 H42 L36,21 H30 Z M40,21 L46,11 H52 L46,21 H40 Z"
                  opacity="0.85"
                />
              )}
            </g>
          </svg>
        )
      case "smooth":
        return (
          <svg
            viewBox="0 0 96 31"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-auto drop-shadow-[2px_2px_2px_rgba(0,0,0,0.3)]"
          >
            <rect width="96" height="31" rx="5" fill={colors.bg} />
            {/* Right logo */}
            <g fill={colors.text}>
              <path
                d="M74,7 h4.5 c1.5,0 2.5,0.8 2.5,1.8 v0.2 c0,0.8 -0.6,1.4 -1.5,1.6 c1,0.2 1.7,0.8 1.7,1.7 v0.2 c0,1 -1,1.8 -2.5,1.8 h-4.7 z M76.5,8.8 v2.2 h1.8 c0.3,0 0.5,-0.2 0.5,-0.5 v-1.2 c0,-0.3 -0.2,-0.5 -0.5,-0.5 z M76.5,12.5 v2.2 h2 c0.3,0 0.5,-0.2 0.5,-0.5 v-1.2 c0,-0.3 -0.2,-0.5 -0.5,-0.5 z"
              />
              <text
                x="73"
                y="26"
                fontFamily="monospace"
                fontWeight="900"
                fontSize="4.5"
                letterSpacing="0.2"
              >
                VALK
              </text>
            </g>
            {/* Text content */}
            <g fill={colors.text}>
              <text
                x="8"
                y="19.5"
                fontFamily="sans-serif"
                fontWeight="900"
                fontSize={displayText.length > 12 ? "6.5" : displayText.length > 9 ? "7.5" : "8.5"}
                letterSpacing="0.3"
              >
                {displayText.toUpperCase()}
              </text>
            </g>
          </svg>
        )
      case "scotch":
        return (
          <svg
            viewBox="0 0 100 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-auto"
          >
            <path d="M5 6 L95 2 L93 24 L3 28 Z" fill="#0d0d0d" opacity="0.15" />
            <path
              d="M3 4 L93 0 L91 22 L1 26 Z"
              fill="#f4f4f4"
              fillOpacity="0.65"
              stroke="#18181b"
              strokeWidth="1.5"
              strokeDasharray="4 2"
            />
            <path
              d="M3 4 L1.5 8 L2.5 12 L0.5 16 L2 20 L0.5 24 L1 26 M93 0 L91.5 4 L92.5 8 L90.5 12 L92 16 L90.5 20 L91 22"
              stroke="#18181b"
              strokeWidth="1.2"
            />
          </svg>
        )
      case "tape-1":
        return (
          <svg
            viewBox="0 0 120 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-auto drop-shadow-[1px_1.5px_1.5px_rgba(0,0,0,0.2)]"
          >
            <defs>
              <linearGradient id="duct-tape-grad" x1="0" y1="0" x2="1" y2="0.3">
                <stop offset="0%" stopColor="#8e94a0" stopOpacity="0.85" />
                <stop offset="50%" stopColor="#a3a8b4" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#7a808c" stopOpacity="0.85" />
              </linearGradient>
            </defs>
            <path
              d="M 5,2 
                 Q 30,1 60,1.5 Q 90,1 115,2.5
                 L 116,4 L 114,6 L 115,9 L 113,12 L 115,15 L 113,18 L 114,21 L 112,24 L 114,27 L 112,30
                 Q 90,29.5 60,30.5 Q 30,29.8 4,30
                 L 5,27 L 3,24 L 5,21 L 3,18 L 4,15 L 2,12 L 4,9 L 2,6 L 5,2
                 Z"
              fill="url(#duct-tape-grad)"
            />
            <path
              d="M 6,5 H 113 M 5,9 H 114 M 4,13 H 113 M 4,17 H 113 M 4,21 H 113 M 5,25 H 112 M 5,27 H 112"
              stroke="#ffffff"
              strokeWidth="0.4"
              opacity="0.3"
            />
            <path
              d="M 15,2 V 30 M 30,2 V 30 M 45,2 V 30 M 60,2 V 30 M 75,2 V 30 M 90,2 V 30 M 105,2 V 30"
              stroke="#000000"
              strokeWidth="0.4"
              strokeDasharray="1 1"
              opacity="0.15"
            />
          </svg>
        )
      case "tape-2":
        return (
          <svg
            viewBox="0 0 60 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-auto"
          >
            <path
              d="M 3,2 L 57,1 L 56,22 L 2,23 Z"
              fill="#ffffff"
              fillOpacity="0.22"
              stroke="#18181b"
              strokeWidth="0.8"
              strokeDasharray="2 1.5"
              opacity="0.75"
            />
          </svg>
        )
      case "tape-3":
        return (
          <svg
            viewBox="0 0 100 36"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-auto drop-shadow-[1px_1.5px_1.5px_rgba(0,0,0,0.2)]"
          >
            <defs>
              <linearGradient id="duct-tape-wavy-grad" x1="0" y1="0" x2="0.8" y2="1">
                <stop offset="0%" stopColor="#7a808c" stopOpacity="0.85" />
                <stop offset="35%" stopColor="#a3a8b4" stopOpacity="0.9" />
                <stop offset="70%" stopColor="#b5bac4" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#676c75" stopOpacity="0.85" />
              </linearGradient>
            </defs>
            <path
              d="M 4,4
                 C 25,1 50,8 75,2 Q 96,1 97,4
                 L 95,7 L 96,10 L 94,14 L 96,18 L 94,22 L 95,26 L 93,29 L 94,32
                 C 75,34 50,28 25,33 Q 3,34 3,31
                 L 5,28 L 3,24 L 5,20 L 4,16 L 5,12 L 3,8 L 4,4
                 Z"
              fill="url(#duct-tape-wavy-grad)"
            />
            <path
              d="M 5,8 Q 50,12 95,6 M 5,14 Q 50,18 95,12 M 4,20 Q 50,24 94,18 M 4,26 Q 50,30 94,24"
              stroke="#ffffff"
              strokeWidth="0.4"
              opacity="0.25"
            />
          </svg>
        )
      case "sticker-8":
        return (
          <svg
            viewBox="0 0 160 36"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-auto drop-shadow-[1px_2px_1.5px_rgba(0,0,0,0.25)]"
          >
            <rect x="1" y="1" width="158" height="34" rx="4" fill="#fafafa" stroke="#0d0d0d" strokeWidth="2" />
            <rect x="4.5" y="4.5" width="27" height="27" rx="2" fill="#ff3847" />
            <path
              d="M 9,10 h 18 v 2 h -18 z M 9,15 h 12 v 2 h -12 z M 9,20 h 15 v 2 h -15 z M 9,25 h 8 v 1.5 h -8 z"
              fill="#ffffff"
            />
            <path
              d="M 36,4.5 v 27 M 44,4.5 v 27 M 52,4.5 v 27 M 60,4.5 v 27 M 68,4.5 v 27 M 76,4.5 v 27 M 84,4.5 v 27 M 92,4.5 v 27 M 100,4.5 v 27 M 108,4.5 v 27 M 116,4.5 v 27 M 124,4.5 v 27"
              stroke="#e2e8f0"
              strokeWidth="0.8"
            />
            <rect x="131" y="4.5" width="24.5" height="27" rx="2" fill="#0d0d0d" />
            <path d="M 137,9 v 18 M 143,9 v 18 M 149,9 v 18" stroke="#00e5ff" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        )
      default:
        return null
    }
  }

  // Determine static layout positioning if no custom classes override it
  const hasCustomPositioning =
    className?.includes("top-") ||
    className?.includes("bottom-") ||
    className?.includes("left-") ||
    className?.includes("right-") ||
    className?.includes("translate-")

  return (
    <div
      data-slot="tape"
      data-variant={variant}
      data-position={position}
      className={cn(
        "absolute z-20 pointer-events-none select-none",
        !hasCustomPositioning && [
          "data-[position=top-left]:-top-3 data-[position=top-left]:-left-2 data-[position=top-left]:rotate-[-8deg] w-[35%] max-w-[120px]",
          "data-[position=top-right]:-top-3 data-[position=top-right]:-right-2 data-[position=top-right]:rotate-[6deg] w-[35%] max-w-[120px]",
          "data-[position=center]:top-1/2 data-[position=center]:left-1/2 data-[position=center]:-translate-x-1/2 data-[position=center]:-translate-y-1/2 data-[position=center]:rotate-[-3deg] w-[35%] max-w-[120px]",
          "data-[position=bottom-left]:-bottom-3 data-[position=bottom-left]:-left-2 data-[position=bottom-left]:rotate-[4deg] w-[35%] max-w-[120px]",
          "data-[position=bottom-right]:-bottom-3 data-[position=bottom-right]:-right-2 data-[position=bottom-right]:rotate-[-5deg] w-[35%] max-w-[120px]",
          "data-[position=news]:left-6 data-[position=news]:-top-5 data-[position=news]:origin-center data-[position=news]:[transform:translate(0,-50%)_rotate(-12deg)] w-[35%] max-w-[120px]",
          "data-[position=event]:right-6 data-[position=event]:-top-5 data-[position=event]:origin-center data-[position=event]:[transform:translate(0,-50%)_rotate(12deg)] w-[35%] max-w-[120px]",
        ],
        className
      )}
      {...props}
    >
      {renderSvg()}
      {children}
    </div>
  )
}

/* ──────────────────────────────────────────────
   Staple — unified 100% vector metal staple pin
   ────────────────────────────────────────────── */
export interface StapleProps extends React.ComponentProps<"div"> {
  position?: "left" | "right" | "top" | "bottom"
}

function Staple({ className, position = "left", ...props }: StapleProps) {
  // Check if custom positioning classes are passed
  const hasCustomPositioning =
    className?.includes("top-") ||
    className?.includes("bottom-") ||
    className?.includes("left-") ||
    className?.includes("right-") ||
    className?.includes("translate-")

  return (
    <div
      data-slot="staple"
      data-position={position}
      className={cn(
        "absolute z-30 pointer-events-none select-none",
        !hasCustomPositioning && [
          "data-[position=left]:bottom-0 data-[position=left]:left-[20px] w-[14%] max-w-[90px]",
          "data-[position=right]:bottom-0 data-[position=right]:right-[20px] w-[10%] max-w-[90px]",
          "data-[position=top]:top-0 data-[position=top]:left-[20px] w-[10%] max-w-[90px] rotate-90",
          "data-[position=bottom]:bottom-0 data-[position=bottom]:left-[20px] w-[10%] max-w-[90px] rotate-90",
        ],
        className
      )}
      {...props}
    >
      {position === "left" ? (
        // Left larger staple with papery warning badge next to it
        <svg
          viewBox="0 0 75 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-auto w-full drop-shadow-[1px_2px_2px_rgba(0,0,0,0.25)]"
        >
          <defs>
            <linearGradient id="metal-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#737d8c" />
              <stop offset="25%" stopColor="#d5dee7" />
              <stop offset="45%" stopColor="#ffffff" />
              <stop offset="70%" stopColor="#838d9c" />
              <stop offset="100%" stopColor="#404652" />
            </linearGradient>
          </defs>

          {/* Papery warning badge, rotated */}
          <g transform="translate(14, 2) rotate(-8)">
            <rect x="0" y="0" width="42" height="32" rx="3" fill="#eeeeee" stroke="#878a8f" strokeWidth="1.5" />
            <rect x="1.5" y="1.5" width="39" height="29" rx="1.5" fill="none" stroke="#b1b5bd" strokeWidth="0.8" strokeDasharray="1.5 1.5" />
            <circle cx="21" cy="15" r="9.5" fill="none" stroke="#797d84" strokeWidth="1.8" />
            <line x1="14.3" y1="8.3" x2="27.7" y2="21.7" stroke="#797d84" strokeWidth="1.8" />
            <path
              d="M 19,10.5 
                       C 21.5,10.5 23.5,11.5 23.5,14 
                       C 23.5,15.5 22.5,17 21,17.5
                       C 20.5,17.7 20,18.5 19,18.5
                       C 17.5,18.5 16.5,17.8 16.5,17
                       L 15.5,17
                       C 14.8,17 14,16.5 14,15.5
                       C 14,14 15.5,12 17,11.5
                       Z"
              fill="#797d84"
            />
            <circle cx="15.5" cy="18.5" r="0.8" fill="#797d84" />
            <path
              d="M 7,26 h 3.5 M 12.5,26 h 16 M 30,26 h 5 M 8,29 h 10 M 20,29 h 15"
              stroke="#797d84"
              strokeWidth="1.2"
              strokeLinecap="square"
            />
          </g>

          {/* Punch Holes Shadow */}
          <ellipse cx="14" cy="40.5" rx="3.5" ry="2" fill="#1b1c1e" opacity="0.8" />
          <ellipse cx="64" cy="33.5" rx="3.5" ry="2" fill="#1b1c1e" opacity="0.8" />

          {/* Staples Metal Pin */}
          <g transform="translate(10, 39) rotate(-8)">
            <rect x="0" y="0" width="55" height="6.5" rx="3.2" fill="url(#metal-grad)" stroke="#2f343d" strokeWidth="0.8" />
          </g>
        </svg>
      ) : (
        // Right simple metal staple pin
        <svg
          viewBox="0 0 45 17"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-auto w-full drop-shadow-[1px_1.5px_1.5px_rgba(0,0,0,0.25)]"
        >
          <defs>
            <linearGradient id="metal-grad-sm" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#737d8c" />
              <stop offset="25%" stopColor="#d5dee7" />
              <stop offset="45%" stopColor="#ffffff" />
              <stop offset="70%" stopColor="#838d9c" />
              <stop offset="100%" stopColor="#404652" />
            </linearGradient>
          </defs>

          {/* Punch Holes Shadow */}
          <ellipse cx="6" cy="13.5" rx="2.2" ry="1.2" fill="#1b1c1e" opacity="0.8" />
          <ellipse cx="39" cy="8.2" rx="2.2" ry="1.2" fill="#1b1c1e" opacity="0.8" />

          {/* Metal Pin */}
          <g transform="translate(4, 12.8) rotate(-9)">
            <rect x="0" y="0" width="36" height="4" rx="2" fill="url(#metal-grad-sm)" stroke="#2b2f36" strokeWidth="0.5" />
          </g>
        </svg>
      )}
    </div>
  )
}

export { Tape, Staple }

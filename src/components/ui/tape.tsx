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
    red: { bg: "#ff585e", text: "#ffffff" },
    blue: { bg: "#603bff", text: "#eaff3d" },
    green: { bg: "#00c8b4", text: "#0d0d0d" },
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

/* ──────────────────────────────────────────────
   InkSplat — large organic paint splatter
   ────────────────────────────────────────────── */
interface InkSplatProps extends React.ComponentProps<"div"> {
  color?: "blue" | "yellow" | "red" | "green" | "pink" | "cyan"
  size?: "sm" | "md" | "lg" | "xl"
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right" | "center"
  variant?: "splash-1" | "splash-2" | "splash-3" | "drip" | "splash-4"
}

// Splatter paths
const splatSvgPaths: Record<string, { path: string; viewBox: string }> = {
  "splash-1": {
    viewBox: "0 0 1000 1000",
    path: "m311.748694 27.1685099h-55.497388c-2.987542 0-5.410583-2.41764-5.410583-5.3985227s2.423041-5.3985227 5.410583-5.3985227h21.676089v-.3817326c0-3.3457742 2.719357-6.05906986 6.072605-6.05906986s6.072605 2.71329566 6.072605 6.05906986v.3817326h21.676089c2.987542 0 5.410583 2.41764 5.410583 5.3985227s-2.423041 5.3985227-5.410583 5.3985227m248.671936-18.68057264c-.480108-.68300201-2.89002-2.0040963-2.89002-2.0040963l-1.911052.14595659-1.860415.76907897-1.714133-.13285792-.783925-.39108882.146283-.75785154-.517616-1.52880175s.94146-3.10064198.495111-3.26343972c-.590757-.21332118-1.194642-.40418749-1.807904-.56885647-.613262-.16279774-1.237776-.30314061-1.869792-.41354368-1.265908-.2245486-2.569324-.34243662-3.900871-.34243662h-18.062157l-2.473677.86451213-1.468453 1.75896407-1.665371-.48839322-1.860416.87948204-2.449296-.97865767-1.470329-1.07409083-4.774815-.96181652h-79.04702l-5.950703 1.25560095-4.701675 2.53927047-3.011922-1.63546234h-2.938781l-3.141326 1.01795368 1.157133-1.3847164 2.741862-1.79264636-2.473677.86451213-1.468453 1.75896407-1.665371-.48839322-.748292.35366405-2.361152-1.23314608-3.730208-.5071056-3.715204-.74849535.857066.35927777-2.64434-.35927777h-170.15566l-8.4 1.76832026-6.856531 1.75896407-5.877561-2.34653292-3.91775.39108882-4.309712.97865767-4.506631.19460879-1.762893-1.17326646-8.251842-1.57184023h-160.507435c-1.2377763 0-2.4511722.10104687-3.6345613.29565566-1.1833892.19460879-2.3330208.4827795-3.445144.85515594-.6301407.40231625-1.8266578 1.5213168-1.8266578 1.5213168l-1.106497.78966259-2.39490954.72416925-1.49845948 1.15268284-1.29778968 1.64107605.03563295 1.39220135-.43884796.7952763-1.3596785.87012582-1.02960482 1.6822433s-1.64849297.60441-2.13047555 1.0797046c-1.32592096 2.8405398-2.06671132 6.0066751-2.06671132 9.3449644v499.9200981l3.31949096 13.242754 4.13904889 7.183684 5.48559945 4.300106 5.680643 1.270571 9.5027462 2.640317 11.1906229.658676 6.9784327 1.758964 8.3756195.51272 7.6892164 1.367875h109.36852l6.269524-.877611 1.714133-.245132 1.665372-1.221919 2.154856 1.173267 6.61085 1.171395h175.446216l6.83215-.890709 1.640991-1.307996 1.468453-.097304 3.465774 1.111515 14.361955.258231 31.591427.926263 18.022773-1.074091 7.933021-2.93223 3.268854 2.350275 6.367047-.40793 4.309712-.959945 2.927528.495878 4.712927-.301269 3.233222-1.270571 14.300067-.976787 6.155124.351793 5.6.233905 6.843402-.851414 3.718955-.185252 9.125787.351793 10.446082-1.322966 4.714802-4.27578 5.12927-1.58681 2.839384-2.640317 2.303014-4.739847 1.957937-1.367875 4.017147.19648 4.667917-6.259292 1.370931-5.013048 2.434293-3.925858 1.370931-5.570677 1.370931-5.473372 1.907301-5.600616v-480.0999421c0-4.0287762-1.078366-7.8068065-2.963161-11.0627613-.324448-.5595002-2.246752-2.06771836-2.616209-2.59353634z",
  },
  "splash-2": {
    viewBox: "0 0 1000 1000",
    path: "m165.004 8.838c-1.522 0-2.488-1.165-2.488-2.687 0-1.523.966-2.749 2.488-2.749s2.696 1.226 2.696 2.749c0 1.522-1.174 2.687-2.696 2.687m0-7.46c-2.625 0-4.825 2.148-4.825 4.773s2.2 4.834 4.825 4.834 5.033-2.209 5.033-4.834-2.408-4.773-5.033-4.773m26.621 3.639c-.655 0-1.148.479-1.148 1.134 0 .654.493 1.291 1.148 1.291.654 0 1.129-.637 1.129-1.291 0-.655-.475-1.134-1.129-1.134m0 3.45c-1.523 0-2.626-.794-2.626-2.316 0-1.523 1.103-3.01 2.626-3.01 1.522 0 2.766 1.487 2.766 3.01 0 1.522-1.244 2.316-2.766 2.316m0-6.828c-2.625 0-4.755 1.887-4.755 4.512s2.13 5.205 4.755 5.205 4.895-2.58 4.895-5.205-2.27-4.512-4.895-4.512m26.62 7.277c-1.522 0-2.973-1.243-2.973-2.765 0-1.523 1.451-2.72 2.973-2.72 1.523 0 2.864 1.197 2.864 2.72 0 1.522-1.341 2.765-2.864 2.765m0-7.567c-2.625 0-4.658 2.177-4.658 4.802s2.033 4.757 4.658 4.757 4.549-2.132 4.549-4.757-1.924-4.802-4.549-4.802m26.62 3.603c-.654 0-1.177.544-1.177 1.199 0 .654.523 1.234 1.177 1.234.655 0 1.199-.58 1.199-1.234 0-.655-.544-1.199-1.199-1.199m0 3.994c-1.522 0-3.011-1.273-3.011-2.795 0-1.523 1.489-2.869 3.011-2.869 1.523 0 2.483 1.346 2.483 2.869 0 1.522-.96 2.795-2.483 2.795m0-7.448c-2.625 0-5.038 2.028-5.038 4.653s2.413 4.727 5.038 4.727 4.51-2.102 4.51-4.727-1.885-4.653-4.51-4.653m26.621 6.983c-1.523 0-2.903-.808-2.903-2.33 0-1.523 1.38-2.576 2.903-2.576 1.522 0 3.051 1.053 3.051 2.576 0 1.522-1.529 2.33-3.051 2.33m0-7.276c-2.625 0-4.471 2.321-4.471 4.946s1.846 5.192 4.471 5.192 4.618-2.567 4.618-5.192-1.993-4.946-4.618-4.946m-265.48 7.712c-1.522 0-2.653-1.244-2.653-2.766 0-1.523 1.131-2.622 2.653-2.622 1.523 0 2.515 1.099 2.515 2.622 0 1.522-.992 2.766-2.515 2.766m0-7.666c-2.625 0-5.006 2.275-5.006 4.9s2.381 4.755 5.006 4.755 4.869-2.13 4.869-4.755-2.244-4.9-4.869-4.9m26.621 3.651c-.655 0-1.11.594-1.11 1.249 0 .654.455 1.285 1.11 1.285s1.188-.631 1.188-1.285c0-.655-.533-1.249-1.188-1.249m0 3.62c-1.522 0-2.406-.849-2.406-2.371 0-1.523.884-2.371 2.406-2.371 1.523 0 2.511.848 2.511 2.371 0 1.522-.988 2.371-2.511 2.371m0-7.522c-2.625 0-5.011 2.526-5.011 5.151s2.386 5.15 5.011 5.15 5.116-2.525 5.116-5.15-2.491-5.151-5.116-5.151m26.621 8.094c-1.523 0-2.836-1.421-2.836-2.943 0-1.523 1.313-2.866 2.836-2.866 1.522 0 3.112 1.343 3.112 2.866 0 1.522-1.59 2.943-3.112 2.943m0-7.599c-2.625 0-4.41 2.031-4.41 4.656s1.785 4.578 4.41 4.578 4.686-1.953 4.686-4.578-2.061-4.656-4.686-4.656m26.62 3.468c-.655 0-1.278.533-1.278 1.188 0 .654.623 1.128 1.278 1.128s1.295-.474 1.295-1.128c0-.655-.64-1.188-1.295-1.188m0 3.689c-1.523 0-2.474-.979-2.474-2.501 0-1.523.951-3.035 2.474-3.035 1.522 0 2.569 1.512 2.569 3.035 0 1.522-1.047 2.501-2.569 2.501m0-6.987c-2.625 0-4.952 1.861-4.952 4.486s2.327 5.021 4.952 5.021 5.047-2.396 5.047-5.021-2.422-4.486-5.047-4.486m53.241 3.246c-.655 0-1.093.585-1.093 1.24 0 .654.438 1.148 1.093 1.148s1.105-.494 1.105-1.148c0-.655-.45-1.24-1.105-1.24m-26.621 3.573c-1.522 0-3.183-.811-3.183-2.333 0-1.523 1.661-3.171 3.183-3.171 1.523 0 2.811 1.648 2.811 3.171 0 1.522-1.288 2.333-2.811 2.333m0-6.683c-2.625 0-4.711 1.725-4.711 4.35s2.086 5.189 4.711 5.189 4.338-2.564 4.338-5.189-1.713-4.35-4.338-4.35m26.621 6.972c-1.522 0-2.762-1.1-2.762-2.622 0-1.523 1.24-2.554 2.762-2.554s3.194 1.031 3.194 2.554c0 1.522-1.672 2.622-3.194 2.622m0-7.59c-2.625 0-4.328 2.343-4.328 4.968s1.703 4.899 4.328 4.899 4.76-2.274 4.76-4.899-2.135-4.968-4.76-4.968"
  },
  "splash-3": {
    viewBox: "0 0 1000 1000",
    path: "M668.733 13.05a1.677 1.677 0 1 1-3.355.002 1.677 1.677 0 0 1 3.355-.002zm-1.677 4.298a4.3 4.3 0 0 1-4.292-4.298 4.3 4.3 0 0 1 4.292-4.298 4.3 4.3 0 0 1 4.294 4.298 4.3 4.3 0 0 1-4.294 4.298zm0-10.247c-2.995 0-5.473 2.232-5.878 5.121-1.475-.004-303.277-.202-304.952-.207.006-2.333-1.007-4.63-2.875-6.069-1.484-.898-2.843 1.287-1.401 2.23 1.577.915 2.559 2.848 2.584 4.66a.824.824 0 0 0 .821.828l305.823.21c.403 2.891 2.881 5.126 5.878 5.126 3.278 0 5.944-2.67 5.944-5.95 0-3.28-2.666-5.95-5.944-5.95zM7.618 13.05a1.677 1.677 0 1 1-1.676-1.679c.926 0 1.676.752 1.676 1.678zm336.478-.772a1.206 1.206 0 0 1 0-2.41 1.206 1.206 0 0 1 0 2.41zm-7.546-2.032a4.3 4.3 0 0 1-4.293-4.298 4.3 4.3 0 0 1 4.293-4.297 4.3 4.3 0 0 1 4.292 4.297 4.3 4.3 0 0 1-4.292 4.298zm-6.123 2.152a.63.63 0 0 1-.38.067l-1.925-.259c-.01-.002-.018-.01-.016-.02a.02.02 0 0 1 .01-.015l1.72-.902a.637.637 0 0 1 .591 1.129zm.055 1.117a.636.636 0 0 1-1.092.293l-1.31-1.438a.018.018 0 0 1 .002-.025.017.017 0 0 1 .017-.004l1.897.415a.638.638 0 0 1 .486.76zm-1.434 1.378a.636.636 0 0 1-1.025-.48l-.08-1.943c0-.01.008-.019.018-.019.006 0 .012.003.015.008l1.187 1.54a.64.64 0 0 1-.115.894zm-1.178-2.897a.019.019 0 0 1-.012-.012l-.59-1.853a.637.637 0 1 1 1.214 0l-.589 1.853c-.003.01-.014.016-.023.012zm-.143 2.418a.637.637 0 1 1-1.14-.416l1.187-1.54a.018.018 0 0 1 .026-.003.02.02 0 0 1 .007.015l-.08 1.944zm-2.265-.564a.638.638 0 0 1 .293-1.094l1.897-.415c.01-.003.02.004.022.014a.02.02 0 0 1-.004.015l-1.309 1.438a.635.635 0 0 1-.899.042zm-.474-1.932a.638.638 0 0 1 .926-.65l1.72.903c.01.005.013.016.008.025-.002.006-.007.01-.014.01l-1.925.259a.636.636 0 0 1-.715-.547zm.877-1.785a.636.636 0 0 1 1.126.098l.739 1.8c.004.01-.001.02-.01.024a.017.017 0 0 1-.017-.002l-1.64-1.04a.638.638 0 0 1-.197-.88zm2.895.098a.636.636 0 1 1 .929.782l-1.64 1.04c-.01.006-.021.004-.026-.005a.017.017 0 0 1-.002-.017l.74-1.8zm15.336-2.908c-.708 0-1.364.209-1.929.551a5.934 5.934 0 0 0 .325-1.926c0-3.28-2.665-5.95-5.942-5.95s-5.943 2.67-5.943 5.95c0 .563.083 1.105.23 1.622a5.908 5.908 0 0 0-2.314-.47c-3.278 0-5.943 2.669-5.943 5.95 0 3.28 2.665 5.949 5.943 5.949 3.276 0 5.942-2.67 5.942-5.95 0-.562-.083-1.105-.23-1.62a5.906 5.906 0 0 0 6.175-.966c-.032.199-.06.4-.06.61 0 2.067 1.68 3.75 3.746 3.75a3.752 3.752 0 0 0 3.746-3.75c0-2.069-1.68-3.75-3.746-3.75zM5.942 17.348A4.3 4.3 0 0 1 1.65 13.05a4.3 4.3 0 0 1 4.292-4.298 4.3 4.3 0 0 1 4.293 4.298 4.3 4.3 0 0 1-4.293 4.298zm313.589-.712a1.406 1.406 0 0 0-1.922-.516c-.878.507-2.04.19-2.745-.535-.709-.721-.996-1.886-.466-2.747.749-1.162-.48-2.71-1.792-2.208-.624.219-.96.782-.98 1.382h-20.78c-1.814-1.884-4.258-2.895-6.793-2.766-2.257.11-4.295 1.114-5.654 2.769l-266.58.205C11.415 9.332 8.938 7.1 5.943 7.1 2.665 7.1 0 9.77 0 13.05 0 16.33 2.665 19 5.942 19c2.998 0 5.478-2.236 5.88-5.129l266.988-.207a.826.826 0 0 0 .662-.339c1.056-1.45 2.756-2.336 4.661-2.43 2.139-.107 4.234.803 5.737 2.492a.824.824 0 0 0 .616.277h21.627c1.013 2.408 2.94 4.145 5.496 4.922 1.248.641 2.633-.694 1.922-1.95z"
  },
  "drip": {
    viewBox: "0 0 1000 1000",
    path: "M199.067 11.372c-.925 0-1.674.752-1.674 1.678 0 .927.749 1.678 1.674 1.678.924 0 1.673-.751 1.673-1.678 0-.926-.75-1.678-1.673-1.678zm0 5.976a4.297 4.297 0 0 1-4.287-4.298 4.297 4.297 0 0 1 4.287-4.297 4.297 4.297 0 0 1 4.286 4.297 4.297 4.297 0 0 1-4.286 4.298zm0-10.247c-2.99 0-5.465 2.232-5.87 5.121l-71-.207c.005-2.332-1.006-4.63-2.871-6.069-1.483-.9-2.84 1.287-1.399 2.23 1.574.915 2.554 2.848 2.58 4.66a.824.824 0 0 0 .82.828l71.87.21c.402 2.891 2.877 5.126 5.87 5.126 3.272 0 5.933-2.67 5.933-5.95 0-3.28-2.66-5.95-5.933-5.95zM5.934 11.372c-.925 0-1.674.752-1.674 1.678 0 .927.75 1.678 1.674 1.678.924 0 1.673-.751 1.673-1.678 0-.926-.75-1.678-1.673-1.678zm104.15.906a1.205 1.205 0 1 1 0-2.41 1.205 1.205 0 0 1 0 2.41zm-7.534-2.03a4.297 4.297 0 0 1-4.286-4.298 4.297 4.297 0 0 1 4.286-4.298c2.364 0 4.286 1.928 4.286 4.298 0 2.369-1.922 4.297-4.286 4.297zm-6.113 2.15a.627.627 0 0 1-.379.068l-1.922-.259a.02.02 0 0 1-.017-.02c.001-.007.005-.012.01-.014l1.72-.903a.634.634 0 0 1 .857.268.638.638 0 0 1-.269.86zm.055 1.118a.636.636 0 0 1-1.09.293l-1.308-1.437a.018.018 0 0 1 .002-.026.02.02 0 0 1 .016-.005l1.894.416c.344.075.56.416.486.76zm-1.432 1.377a.634.634 0 0 1-1.023-.478l-.08-1.944c0-.01.008-.019.018-.019.006 0 .012.003.015.007L95.175 14a.639.639 0 0 1-.115.894zm-1.176-2.896c-.006-.002-.01-.006-.012-.012l-.589-1.853a.638.638 0 0 1 .414-.8.634.634 0 0 1 .798.8l-.588 1.853a.019.019 0 0 1-.023.012zm-.143 2.418a.635.635 0 1 1-1.27-.052.64.64 0 0 1 .132-.364l1.185-1.54a.02.02 0 0 1 .026-.003.02.02 0 0 1 .007.015l-.08 1.944zm-2.261-.564a.64.64 0 0 1 .292-1.094l1.894-.416a.02.02 0 0 1 .023.014c0 .007-.001.012-.004.017l-1.308 1.437a.634.634 0 0 1-.897.042zm-.474-1.932a.636.636 0 0 1 .925-.65l1.718.904c.01.004.013.015.008.024a.016.016 0 0 1-.014.01l-1.923.259a.636.636 0 0 1-.714-.547zm.876-1.785a.635.635 0 0 1 1.124.099l.738 1.8c.004.008 0 .019-.01.023a.017.017 0 0 1-.016-.002l-1.64-1.041a.638.638 0 0 1-.196-.879zm2.89.099a.635.635 0 1 1 1.176.484.633.633 0 0 1-.248.297l-1.638 1.04a.018.018 0 0 1-.026-.005.017.017 0 0 1-.001-.017l.738-1.8zm15.312-2.91c-.706 0-1.361.209-1.925.553a5.943 5.943 0 0 0 .324-1.926c0-3.28-2.661-5.95-5.933-5.95-3.271 0-5.933 2.67-5.933 5.95 0 .562.084 1.105.23 1.62a5.891 5.891 0 0 0-2.312-.47c-3.272 0-5.933 2.67-5.933 5.95 0 3.28 2.661 5.95 5.933 5.95 3.273 0 5.934-2.67 5.934-5.95 0-.562-.083-1.105-.23-1.622a5.892 5.892 0 0 0 6.166-.965c-.033.2-.06.401-.06.61a3.749 3.749 0 0 0 3.74 3.75 3.749 3.749 0 0 0 3.74-3.75 3.75 3.75 0 0 0-3.74-3.75zM5.934 17.348a4.297 4.297 0 0 1-4.287-4.298 4.296 4.296 0 0 1 4.287-4.297 4.297 4.297 0 0 1 4.286 4.297 4.297 4.297 0 0 1-4.286 4.298zm77.704-1.229c-.876.507-2.036.191-2.74-.534-.707-.721-.994-1.886-.465-2.747.748-1.162-.479-2.711-1.79-2.208-.623.218-.957.782-.979 1.382H56.918c-1.812-1.885-4.252-2.895-6.783-2.766-2.254.11-4.288 1.114-5.645 2.769l-32.688.205C11.397 9.332 8.924 7.1 5.934 7.1 2.662 7.1 0 9.77 0 13.05 0 16.33 2.662 19 5.934 19c2.993 0 5.469-2.236 5.87-5.129l33.096-.207a.821.821 0 0 0 .66-.34c1.056-1.45 2.753-2.335 4.655-2.428 2.135-.108 4.227.802 5.728 2.491.157.176.38.277.615.277h21.593c1.012 2.407 2.935 4.145 5.487 4.922 1.247.641 2.63-.694 1.92-1.95a1.403 1.403 0 0 0-1.92-.517z"
  },
  "splash-4": {
    viewBox: "0 0 500 500",
    path: "M250,5 C285,-5 320,18 350,8 C375,28 405,12 430,38 C450,22 480,42 490,72 C505,58 520,88 510,118 C525,138 518,172 500,192 C515,218 505,252 485,272 C498,298 485,332 465,352 C478,378 458,408 435,422 C448,448 422,475 398,485 C372,498 338,492 315,475 C292,492 258,498 235,482 C212,498 178,492 155,472 C132,488 98,478 75,458 C52,472 22,455 8,432 C-5,448 -18,422 -8,402 C-22,382 -12,352 5,335 C-8,318 -2,288 12,272 C-2,255 5,225 20,210 C8,192 12,162 28,148 C15,130 20,100 35,85 C22,65 32,35 55,22 C72,8 105,2 128,15 C148,0 178,5 200,20 C218,5 238,12 250,5 Z",
  },
}

function InkSplat({
  className,
  color = "blue",
  size = "md",
  position = "top-right",
  variant = "splash-1",
  ...props
}: InkSplatProps) {
  const colorMap = {
    blue: "#4100FF",
    yellow: "#eaff3d",
    red: "#DC2626",
    green: "#10B981",
    pink: "#FF0080",
    cyan: "#00E5FF",
  }
  const sizeMap = {
    sm: "h-32 w-32",
    md: "h-64 w-64",
    lg: "h-[500px] w-[500px]",
    xl: "h-[700px] w-[700px]",
  }
  const svgData = splatSvgPaths[variant] || splatSvgPaths["splash-1"]

  return (
    <div
      data-slot="ink-splat"
      data-color={color}
      data-position={position}
      className={cn(
        "absolute z-0 pointer-events-none",
        "data-[position=top-left]:top-4 data-[position=top-left]:left-4",
        "data-[position=top-right]:top-4 data-[position=top-right]:right-4",
        "data-[position=bottom-left]:bottom-4 data-[position=bottom-left]:left-4",
        "data-[position=bottom-right]:bottom-4 data-[position=bottom-right]:right-4",
        "data-[position=center]:top-1/2 data-[position=center]:left-1/2 data-[position=center]:-translate-x-1/2 data-[position=center]:-translate-y-1/2",
        "opacity-20",
        "animate-in zoom-in-50 fade-in-0 duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
        sizeMap[size],
        className
      )}
      {...props}
    >
      <svg
        viewBox={svgData.viewBox}
        className="h-full w-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d={svgData.path} fill={colorMap[color]} />
      </svg>
    </div>
  )
}

/* ──────────────────────────────────────────────
   WavyDivider — colorful wavy section separator
   ────────────────────────────────────────────── */
interface WavyDividerProps extends React.ComponentProps<"div"> {
  color?: "pink" | "cyan" | "yellow" | "green"
  height?: number
}

function WavyDivider({
  className,
  color = "pink",
  height = 24,
  ...props
}: WavyDividerProps) {
  const colorMap = {
    pink: "#FF0080",
    cyan: "#00E5FF",
    yellow: "#eaff3d",
    green: "#10B981",
  }
  const fillColor = colorMap[color]

  return (
    <div
      data-slot="wavy-divider"
      className={cn("w-full overflow-hidden leading-[0]", className)}
      style={{ height }}
      {...props}
    >
      <svg
        viewBox="0 0 1200 40"
        preserveAspectRatio="none"
        className="h-full w-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0,20 C50,5 100,35 150,20 C200,5 250,35 300,20 C350,5 400,35 450,20 C500,5 550,35 600,20 C650,5 700,35 750,20 C800,5 850,35 900,20 C950,5 1000,35 1050,20 C1100,5 1150,35 1200,20 L1200,40 L0,40 Z"
          fill={fillColor}
          opacity="0.8"
        />
        <path
          d="M0,25 C60,10 120,40 180,25 C240,10 300,40 360,25 C420,10 480,40 540,25 C600,10 660,40 720,25 C780,10 840,40 900,25 C960,10 1020,40 1080,25 C1140,10 1200,40 1200,25 L1200,40 L0,40 Z"
          fill={fillColor}
          opacity="0.5"
        />
      </svg>
    </div>
  )
}

/* ──────────────────────────────────────────────
   Sticker — scattered decorative emoji
   ────────────────────────────────────────────── */
interface StickerProps extends React.ComponentProps<"div"> {
  emoji?: string
  rotation?: number
}

function Sticker({
  className,
  emoji = "⭐",
  rotation = -12,
  ...props
}: StickerProps) {
  return (
    <div
      data-slot="sticker"
      className={cn(
        "absolute z-20 pointer-events-none select-none text-2xl",
        "drop-shadow-[2px_2px_0px_var(--chaos-black)]",
        className
      )}
      style={{ transform: `rotate(${rotation}deg)` }}
      {...props}
    >
      {emoji}
    </div>
  )
}

export { Tape, Staple, InkSplat, Sticker, WavyDivider }

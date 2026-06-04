import * as React from "react"
import { cn } from "@/lib/utils"

export function Sticker2Red({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <svg
      viewBox="0 0 120 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("w-full h-auto drop-shadow-[2px_3px_2px_rgba(0,0,0,0.35)]", className)}
      {...props}
    >
      {/* Dark outline/card base */}
      <rect x="2" y="2" width="116" height="156" rx="12" fill="#0d0d0d" />
      {/* Red inner card */}
      <rect x="5" y="5" width="110" height="150" rx="9" fill="#FE391B" />

      {/* Top Splatoon Glyphs (Black bold) */}
      <g fill="#0d0d0d">
        {/* Glyph 1 (E-like) */}
        <path d="M 15 15 h 14 v 3 h -10 v 2 h 8 v 3 h -8 v 2 h 10 v 3 h -14 Z" />
        {/* Glyph 2 (A-like) */}
        <path d="M 33 28 L 39 15 h 4 L 49 28 h -4.5 L 43 24 h -4.5 L 37 28 Z M 39.5 21 h 3 L 41 18 Z" />
        {/* Glyph 3 (W-like) */}
        <path d="M 53 15 h 3 v 7 h 2 v -7 h 3 v 7 h 2 v -7 h 3 v 10 L 63 28 H 56 L 53 25 Z" />
        {/* Glyph 4 (Hook-like) */}
        <path d="M 74 15 h 9 v 3 h -6 v 7 Q 77 28 74 28 Q 71 28 71 25 h 3 Z" />
        {/* Glyph 5 (n-like) */}
        <path d="M 87 15 h 10 v 13 h -3 v -10 h -4 v 10 h -3 Z" />
        
        {/* Sub-glyphs (smaller black glyphs centered below) */}
        <path d="M 36 31 h 8 v 3 h -8 Z M 48 31 h 6 v 3 h -6 Z M 58 31 h 6 v 3 h -6 Z M 68 31 h 8 v 3 h -8 Z M 80 31 h 6 v 3 h -6 Z" />
      </g>

      {/* Middle White/Grey Panel with Rounded Corners and no black stroke */}
      <g strokeLinejoin="round">
        <rect x="10" y="39" width="100" height="71" rx="6" fill="#ececec" />
        {/* Division Line */}
        <line x1="10" y1="62" x2="110" y2="62" stroke="#FE391B" strokeWidth="1.5" />
      </g>

      {/* Small Red Pixelated Glyphs Inside White Panel */}
      <g fill="#FE391B">
        {/* Upper section glyphs */}
        <path d="M 18 47 h 10 v 2 h -7 v 1.5 h 7 v 2 h -7 v 1.5 h 7 v 2 h -10 Z" />
        <path d="M 32 47 h 8 v 9 h -2.5 v -6.5 h -5.5 Z" />
        
        {/* Lower section glyphs */}
        <path d="M 18 70 h 10 v 2 h -7 v 1.5 h 7 v 2 h -7 v 1.5 h 7 v 2 h -10 Z" />
        <path d="M 32 70 h 8 v 9 h -2.5 v -6.5 h -5.5 Z" />
      </g>

      {/* Bottom Blocky White Text (STiYEE) */}
      <g fill="#ffffff">
        {/* S */}
        <path d="M 10 119 h 13 v 3.5 h -9.5 v 2 h 9.5 v 8.5 h -13 v -3.5 h 9.5 v -2 h -9.5 Z" />
        {/* T */}
        <path d="M 26 119 h 11 v 3.5 h -4 v 10.5 h -3 v -10.5 h -4 Z" />
        {/* i */}
        <path d="M 40 119 h 3 v 3 h -3 Z M 40 124 h 3 v 10 h -3 Z" />
        {/* Y */}
        <path d="M 46 119 h 3 l 2.5 5.5 l 2.5 -5.5 h 3 l -4 8.5 v 5.5 h -3 v -5.5 Z" />
        {/* E */}
        <path d="M 60 119 h 12 v 3.5 h -9 v 2 h 7.5 v 3 h -7.5 v 2 h 9 v 3.5 h -12 Z" />
        {/* E */}
        <path d="M 75 119 h 12 v 3.5 h -9 v 2 h 7.5 v 3 h -7.5 v 2 h 9 v 3.5 h -12 Z" />

        {/* Thick white horizontal line */}
        <rect x="10" y="138" width="100" height="3" rx="1.5" />

        {/* Small white Splatoon characters at the very bottom */}
        <path d="M 12 146 h 8 v 6 h -2.5 v -3.5 h -3 v 3.5 h -2.5 Z" />
        <path d="M 23 146 h 6 v 6 h -6 Z M 32 146 h 8 v 3.5 h -5.5 v 2.5 h 5.5 Z" />
        <path d="M 43 146 h 8 v 6 h -8 Z M 54 146 h 7 v 2 h -4.5 v 1 h 4.5 v 3 h -7 Z" />
        <path d="M 64 146 h 5 v 6 h -5 Z" />
        <path d="M 72 146 h 7 v 6 h -7 Z M 82 146 h 8 v 6 h -8 Z" />
        <path d="M 93 146 h 6 v 2.5 h -3.5 v 1 h 3.5 v 2.5 h -6 Z" />
      </g>
    </svg>
  )
}
Sticker2Red.displayName = "Sticker2Red"

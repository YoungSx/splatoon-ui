import * as React from "react"
import { cn } from "@/lib/utils"

export function Sticker10({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <svg
      viewBox="0 0 160 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("w-full h-auto drop-shadow-[1px_2.5px_1.5px_rgba(0,0,0,0.35)]", className)}
      {...props}
    >
      <defs>
        {/* Diamond/Grid pattern for ticket background */}
        <pattern id="lime-ticket-grid" width="8" height="8" patternUnits="userSpaceOnUse">
          <path d="M 4 0 L 8 4 L 4 8 L 0 4 Z" fill="none" stroke="#b3e61c" strokeWidth="0.8" opacity="0.4" />
        </pattern>
      </defs>

      {/* Ticket outer shape with black border */}
      <rect x="1.5" y="1.5" width="157" height="33" rx="4" fill="#cfff3d" stroke="#0d0d0d" strokeWidth="2.2" strokeLinejoin="round" />
      
      {/* Grid Pattern Background */}
      <rect x="3" y="3" width="154" height="30" rx="2" fill="url(#lime-ticket-grid)" />
      
      {/* Dashed green inner border */}
      <rect x="4" y="4" width="152" height="28" rx="2" fill="none" stroke="#7b9613" strokeWidth="0.8" strokeDasharray="3 2" />

      {/* Left side small vertical characters */}
      <g fill="#0d0d0d" transform="rotate(-90 8 18)">
        <path d="M 3 13 h 1.5 v 6 h -1.5 Z M 6 13 h 2 v 4 h -2 Z M 9 13 h 1.5 v 6 h -1.5 Z M 12 13 h 2 v 6 h -2 Z" />
      </g>

      {/* Middle Top Black Splatoon Characters (SEOUGLY SEYE style) */}
      <g fill="#0d0d0d">
        {/* Glyph 1 (S) */}
        <path d="M 24 7 h 8 v 2 h -6 v 1 h 6 v 4 h -8 v -2 h 6 v -1 h -6 Z" />
        {/* Glyph 2 (E) */}
        <path d="M 34 7 h 8 v 2 h -6 v 1 h 5 v 2 h -5 v 1 h 6 v 2 h -8 Z" />
        {/* Glyph 3 (O/D) */}
        <path d="M 44 7 h 8 v 8 h -8 Z M 46.5 9.5 v 3 h 3 v -3 Z" />
        {/* Glyph 4 (U) */}
        <path d="M 54 7 h 2.5 v 5.5 h 3 v -5.5 h 2.5 v 8 h -8 Z" />
        {/* Glyph 5 (G) */}
        <path d="M 64 7 h 8 v 2 h -5.5 v 4 h 5.5 v -2 h -3 v -1.5 h 3 v 3.5 h -8 Z" />
        {/* Glyph 6 (L) */}
        <path d="M 74 7 h 2.5 v 5.5 h 5.5 v 2.5 h -8 Z" />
        {/* Glyph 7 (Y) */}
        <path d="M 84 7 h 2 l 1.5 3 l 1.5 -3 h 2 L 88.5 12 v 3 h -2.5 v -3 Z" />

        {/* Space */}

        {/* Glyph 8 (S) */}
        <path d="M 97 7 h 8 v 2 h -6 v 1 h 6 v 4 h -8 v -2 h 6 v -1 h -6 Z" />
        {/* Glyph 9 (E) */}
        <path d="M 107 7 h 8 v 2 h -6 v 1 h 5 v 2 h -5 v 1 h 6 v 2 h -8 Z" />
        {/* Glyph 10 (Y) */}
        <path d="M 117 7 h 2 l 1.5 3 l 1.5 -3 h 2 L 121.5 12 v 3 h -2.5 v -3 Z" />
        {/* Glyph 11 (E) */}
        <path d="M 127 7 h 8 v 2 h -6 v 1 h 5 v 2 h -5 v 1 h 6 v 2 h -8 Z" />
      </g>

      {/* Middle Bottom Black Border Box */}
      <rect x="23" y="19" width="112" height="10" rx="1.5" fill="none" stroke="#0d0d0d" strokeWidth="2" />
      
      {/* Small white glyph shapes inside the black border box */}
      <g fill="#0d0d0d">
        <path d="M 28 22 h 4 v 4 h -4 Z M 36 22 h 2 v 4 h -2 Z" />
        <path d="M 52 22 h 6 v 4 h -6 Z" />
        <path d="M 74 22 h 2 v 4 h -2 Z M 80 22 h 4 v 4 h -4 Z" />
        <path d="M 104 22 h 6 v 4 h -6 Z" />
        <path d="M 124 22 h 2 v 4 h -2 Z" />
      </g>

      {/* Right side barcode-like graphics & ticket text (Z8R and 010-73) */}
      {/* Vertical divider line */}
      <line x1="140" y1="2.5" x2="140" y2="33.5" stroke="#0d0d0d" strokeWidth="1.5" strokeDasharray="3 2" />

      {/* Z8R Vertical blocky characters */}
      <g fill="#0d0d0d" transform="rotate(90 146 18)">
        <path d="M 8 143 h 8 v 2 L 11 149 h 5 v 2 h -8 v -2 L 13 145 h -5 Z" />
        <path d="M 19 143 h 8 v 8 h -8 Z M 21.5 145 h 3 v 1.5 h -3 Z M 21.5 148 h 3 v 1.5 h -3 Z" />
        <path d="M 30 143 h 8 v 5 h -5.5 v 1 h 5.5 v 2 h -8 Z M 32.5 145 h 3 v 1.5 h -3 Z" />
      </g>

      {/* 010-73 vertical font */}
      <g fill="#0d0d0d" transform="rotate(90 154 18)">
        <text
          x="7"
          y="156.5"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontWeight="900"
          fontSize="9"
          letterSpacing="0.5"
        >
          010-73
        </text>
      </g>
    </svg>
  )
}
Sticker10.displayName = "Sticker10"

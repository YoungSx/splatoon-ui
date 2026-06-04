import * as React from "react"
import { cn } from "@/lib/utils"

export function Sticker5({ className, ...props }: React.ComponentProps<"svg">) {
  // SVG paths for the orange polygon layers and white brush script
  const renderStickerContent = (strokeColor?: string, strokeWidth?: number, fillColorSpecial?: string) => {
    const mainOrange = fillColorSpecial || "#ff505e" // Splatoon vibrant orange/red
    const scriptColor = strokeColor ? strokeColor : "#ffffff"

    return (
      <g stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        {/* Outer Orange/Red Parallelogram */}
        <polygon
          points="80,10 240,10 200,70 40,70"
          fill={mainOrange}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
        />
        
        {/* Inner Orange/Red Nested Parallelogram (creates the cut-out shape) */}
        <polygon
          points="110,22 215,22 185,58 80,58"
          fill="#ff505e"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          opacity={strokeColor ? 1 : 0.8}
        />

        {/* Circular emblem mark on the right */}
        <circle cx="238" cy="40" r="14" fill={strokeColor ? strokeColor : "#ffffff"} stroke={strokeColor} strokeWidth={strokeWidth} />
        {/* Inner smiley face details in circular mark */}
        {!strokeColor && (
          <path d="M 233,40 Q 238,36 243,40 L 238,45 Z" fill="#ff505e" />
        )}

        {/* White Brush Script Text: "ハaJンi" */}
        {/* Stroke 1: "ハ" */}
        <path d="M 50,42 Q 62,32 78,35" fill="none" stroke={scriptColor} strokeWidth={strokeWidth ? strokeWidth + 6 : 7} />
        <path d="M 64,25 Q 70,55 58,58" fill="none" stroke={scriptColor} strokeWidth={strokeWidth ? strokeWidth + 6 : 7} />
        
        {/* Stroke 2: "a" */}
        <path d="M 92,26 Q 112,24 130,34 L 122,58 Q 102,56 92,26 Z" fill={scriptColor} stroke={scriptColor} strokeWidth={strokeWidth ? strokeWidth : 1} />
        
        {/* Stroke 3: "J" / "ン" */}
        <path d="M 142,24 C 154,22 172,34 164,54 C 156,66 140,62 138,46 Q 152,42 178,48" fill="none" stroke={scriptColor} strokeWidth={strokeWidth ? strokeWidth + 6 : 7} />
        
        {/* Stroke 4: "i" */}
        <path d="M 186,30 h 12" fill="none" stroke={scriptColor} strokeWidth={strokeWidth ? strokeWidth + 6 : 7} />
        <path d="M 189,37 h 8" fill="none" stroke={scriptColor} strokeWidth={strokeWidth ? strokeWidth + 6 : 7} />
      </g>
    )
  }

  return (
    <svg
      viewBox="0 0 280 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("w-full h-auto drop-shadow-[3px_4px_3.5px_rgba(0,0,0,0.45)]", className)}
      {...props}
    >
      {/* 
        Die-Cut Outline Effect:
        We render the content twice. First, with a thick white outline to act as the sticker backing,
        and then on top with the actual colors.
      */}
      {renderStickerContent("#ffffff", 10, "#ffffff")}
      
      {/* Dark shadow stroke underneath to separate the layers */}
      {renderStickerContent("#0d0d0d", 2, "#0d0d0d")}

      {/* Actual colored sticker on top */}
      {renderStickerContent()}
    </svg>
  )
}
Sticker5.displayName = "Sticker5"

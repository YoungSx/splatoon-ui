import * as React from "react"
import { cn } from "@/lib/utils"

/* ──────────────────────────────────────────────
   WavyDivider — colorful wavy section separator
   ────────────────────────────────────────────── */
export interface WavyDividerProps extends React.ComponentProps<"div"> {
  color?: "pink" | "cyan" | "yellow" | "green"
  height?: number
}

export function WavyDivider({
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

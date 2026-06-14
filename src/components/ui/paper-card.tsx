import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"

import { cn } from "@/lib/utils"
import { Tape, Staple } from "./tape"

// ── Shared types (also exported from card.tsx) ──────────────────

export type PaperLabelColor = "yellow" | "red" | "blue" | "green"
export type PaperLabelPlacement = "left" | "right"

export interface PaperLabelConfig {
  text?: string
  color?: PaperLabelColor
  placement?: PaperLabelPlacement
}

// ── News surface variants & fill map ────────────────────────────

const newsSurfaceVariants = cva("flex h-full flex-col pt-0 px-8 pb-6 relative z-10", {
  variants: {
    surface: {
      paper: "bg-white text-[#0d0d0d]",
      cream: "bg-[#f5f0e8] text-[#0d0d0d]",
      danger: "bg-[#ff585e] text-white",
    },
  },
  defaultVariants: {
    surface: "paper",
  },
})

export type NewsSurface = NonNullable<VariantProps<typeof newsSurfaceVariants>["surface"]>

const STAGGER_ROTATIONS = ['4deg', '-3deg', '2deg', '0deg']

const newsSurfaceFillMap = {
  paper: { light: "#ffffff", dark: "#1a1a1a" },
  cream: { light: "#f5f0e8", dark: "#1e1b15" },
  danger: { light: "#ff585e", dark: "#ff585e" },
} as const satisfies Record<NewsSurface, { light: string; dark: string }>

// ── Paper Card Top Border SVG ───────────────────────────────────

function PaperCardTopBorder({ fill }: { fill: string }) {
  return (
    <svg
      aria-hidden="true"
      className="relative z-10 mb-[-2px] w-full pointer-events-none select-none"
      style={{ fill }}
      viewBox="0 0 448 60"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
    >
      <path
        d="M253.96 23.774a4.711 4.711 0 0 1-4.693 4.328h-49.535c-.131 0-.255-.027-.384-.038-2.431-.198-4.348-2.205-4.348-4.68a4.724 4.724 0 0 1 4.732-4.716h18.204c-.006-.106-.017-.21-.017-.315 0-3.452 2.808-6.25 6.27-6.25h.62a6.26 6.26 0 0 1 5.038 2.54 6.194 6.194 0 0 1 1.233 3.71c0 .106-.01.21-.016.315H249.267c2.614 0 4.733 2.111 4.733 4.717 0 .133-.029.258-.04.389M53.446.102H9.693C4.34.102 0 4.437 0 9.782v50.044h448V9.783c0-5.346-4.338-9.68-9.693-9.68H53.445Z"
        fillRule="evenodd"
      />
    </svg>
  )
}

// ── Paper Card Bottom Border SVG ────────────────────────────────

function PaperCardBottomBorder({ fill }: { fill: string }) {
  return (
    <svg
      aria-hidden="true"
      className="relative z-10 mt-[-2px] w-full pointer-events-none select-none"
      style={{ fill }}
      viewBox="0 0 448 24"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
    >
      <path
        d="M0 .826c0 9.527 5.976 17.64 14.378 20.862 2.49.955 5.184 1.5 8.01 1.5h403.223c4.635 0 8.94-1.407 12.514-3.816C444.082 15.354 448 8.548 448 .826H0Z"
        fillRule="evenodd"
      />
    </svg>
  )
}

// ── PaperCard ──────────────────────────────────────────────────

interface PaperCardProps {
  className?: string
  dataVariant: "news"
  surface: NewsSurface
  paperLabel?: PaperLabelConfig
  paperFasteners: boolean
  showSticker9?: boolean
  staggerIndex?: number
  children: React.ReactNode
  forwardedRef?: React.ForwardedRef<HTMLDivElement>
  props?: Omit<React.ComponentProps<"div">, "children" | "className">
}

export function PaperCard({
  className,
  dataVariant,
  surface,
  paperLabel,
  paperFasteners,
  showSticker9,
  staggerIndex,
  children,
  forwardedRef,
  props,
}: PaperCardProps) {
  const svgFills = newsSurfaceFillMap[surface]
  const { style: propStyle, ...restProps } = props ?? {}

  const staggerTransform = staggerIndex !== undefined
    ? `rotate(${STAGGER_ROTATIONS[staggerIndex % 4]})`
    : undefined

  const cardStyle = {
    "--card-svg-fill": svgFills.light,
    "--card-svg-fill-dark": svgFills.dark,
    ...(staggerTransform ? { transform: staggerTransform } : {}),
    ...propStyle,
  } as React.CSSProperties

  return (
    <div
      ref={forwardedRef}
      data-slot="card"
      data-variant={dataVariant}
      style={cardStyle}
      className={cn(
        "group/card relative flex h-full flex-col cursor-pointer transition-transform duration-300 [transition-timing-function:var(--ease-in-out-quart)]",
        staggerIndex !== undefined && "hover:rotate-0 hover:scale-[1.025]",
        className
      )}
      {...restProps}
    >
      <PaperCardTopBorder fill="var(--card-svg-fill)" />

      <div className={cn(newsSurfaceVariants({ surface }))}>
        {paperLabel && (
          <Tape
            variant="torn"
            color={paperLabel.color ?? "yellow"}
            text={paperLabel.text ?? "NEWS!"}
            className={cn(
              "absolute z-30 select-none pointer-events-none w-[45%] max-w-[150px]",
              (paperLabel.placement ?? "left") === "left"
                ? "left-0 top-0 origin-center [transform:translate(10%,-130%)_rotate(-10deg)]"
                : "right-0 top-0 origin-center [transform:translate(-10%,-130%)_rotate(10deg)]"
            )}
          />
        )}
        {paperFasteners && (
          <Staple
            position="left"
            className="pointer-events-none absolute bottom-0 left-[20px] z-30 w-[20%] max-w-[140px] select-none"
          />
        )}
        {paperFasteners && (
          <Staple
            position="right"
            className="pointer-events-none absolute bottom-0 right-[20px] z-30 w-[10%] max-w-[90px] select-none"
          />
        )}

        <div className="relative flex h-full w-full flex-col gap-0">
          {children}
        </div>
      </div>

      <PaperCardBottomBorder fill="var(--card-svg-fill)" />

      {showSticker9 && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src="/official/tape/sticker-9.png"
          srcSet="/official/tape/sticker-9.png 1x, /official/tape/sticker-9-2x.png 2x"
          alt=""
          className="absolute -top-3 -right-3 w-20 h-auto pointer-events-none select-none z-20 rotate-[-8deg]"
        />
      )}
    </div>
  )
}

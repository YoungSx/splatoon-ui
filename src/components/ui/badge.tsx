"use client"

import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "group/badge inline-flex w-fit shrink-0 items-center justify-center gap-1 whitespace-nowrap font-alt font-black italic uppercase skew-x-[-2deg] transition-all focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        yellow:
          "bg-[var(--neon-yellow)] text-[var(--chaos-black)] px-2.5 py-0.5 text-[11px] tracking-wide hover:brightness-110",
        blue:
          "bg-[var(--ink-blue)] text-[var(--neon-yellow)] px-2.5 py-0.5 text-[11px] tracking-wide hover:brightness-110",
        green:
          "bg-[var(--ink-green)] text-[var(--chaos-black)] px-2.5 py-0.5 text-[11px] tracking-wide hover:brightness-110",
        red:
          "bg-[var(--ink-red)] text-white px-2.5 py-0.5 text-[11px] tracking-wide hover:brightness-110",
        purple:
          "bg-[var(--ink-purple)] text-white px-2.5 py-0.5 text-[11px] tracking-wide hover:brightness-110",
        monochrome:
          "bg-[var(--chaos-black)] text-[var(--tape-white)] px-2.5 py-0.5 text-[11px] tracking-wide hover:brightness-110",
        sticker:
          "bg-[var(--neon-yellow)] text-[var(--chaos-black)] px-3 py-1 text-xs tracking-wide rotate-[-3deg] hover:brightness-110",
      },
    },
    defaultVariants: {
      variant: "yellow",
    },
  }
)

function Badge({
  className,
  variant = "yellow",
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant }), className),
      },
      props
    ),
    render,
    state: {
      slot: "badge",
      variant,
    },
  })
}

export { Badge, badgeVariants }

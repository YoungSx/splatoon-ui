import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button relative inline-flex shrink-0 items-center justify-center whitespace-nowrap transition-all outline-none select-none disabled:pointer-events-none disabled:opacity-50 overflow-hidden [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground rounded-none font-bold text-[24px] leading-none py-3 px-11 shadow-none hover:rotate-[2deg] active:scale-95",
        outline:
          "border-2 border-foreground bg-transparent text-foreground rounded-none font-bold text-[24px] leading-none py-3 px-11 shadow-none hover:rotate-[2deg] active:scale-95",
        secondary:
          "bg-secondary text-secondary-foreground rounded-none font-bold text-[24px] leading-none py-3 px-11 shadow-none hover:rotate-[2deg] active:scale-95",
        ghost:
          "text-foreground hover:bg-foreground/10 hover:text-foreground active:bg-foreground/20 rounded-none font-bold text-[24px] leading-none py-3 px-11",
        destructive:
          "bg-destructive text-white rounded-none font-bold text-[24px] leading-none py-3 px-11 shadow-none hover:rotate-[2deg] active:scale-95",
        link: "text-primary underline-offset-4 hover:underline",
        orange:
          "bg-ink-orange text-chaos-black rounded-none font-bold text-[24px] leading-none py-3 px-11 shadow-none hover:rotate-[2deg] active:scale-95",
        blue:
          "bg-ink-blue text-white rounded-none font-bold text-[24px] leading-none py-3 px-11 shadow-none hover:rotate-[2deg] active:scale-95",
        green:
          "bg-ink-green text-chaos-black rounded-none font-bold text-[24px] leading-none py-3 px-11 shadow-none hover:rotate-[2deg] active:scale-95",
      },
      size: {
        default: "h-auto",
        sm: "h-auto text-base py-2 px-6",
        lg: "h-auto text-[28px] py-4 px-14",
        icon: "size-10",
        "icon-sm": "size-8",
        "icon-lg": "size-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  children,
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  // Only the primary/colored variants get the exact drip effect, to match Splatoon's aesthetic
  const hasDrip = ["default", "secondary", "destructive", "orange", "blue", "green"].includes(variant || "")
  
  // Drip color logic based on variant
  let hoverBgColor = "fill-ink-blue"
  let hoverTextColor = "text-white"
  
  if (variant === "secondary") hoverBgColor = "fill-primary"
  if (variant === "destructive") hoverBgColor = "fill-chaos-black"
  if (variant === "blue") hoverBgColor = "fill-primary"
  if (variant === "orange") hoverBgColor = "fill-ink-blue"
  if (variant === "green") hoverBgColor = "fill-ink-purple"
  if (variant === "secondary") hoverTextColor = "text-chaos-black"
  if (variant === "blue") hoverTextColor = "text-chaos-black"

  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    >
      {hasDrip && (
        <>
          <svg 
            className="absolute inset-0 h-full w-full pointer-events-none z-0" 
            preserveAspectRatio="none" 
            viewBox="0 0 100 100"
          >
            <path 
              className={cn(
                hoverBgColor, 
                "transition-all duration-400 ease-[cubic-bezier(0.77,0,0.175,1)]",
                "[d:path('M0,0_L100,0_L100,0_C75,0_25,0_0,0_Z')]",
                "group-hover/button:[d:path('M0,0_L100,0_L100,100_C75,120_25,110_0,100_Z')]"
              )} 
            />
          </svg>
          <span className={cn(
            "absolute inset-0 z-10 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover/button:opacity-100",
            hoverTextColor
          )}>
            {children}
          </span>
          <span className="relative z-10 transition-opacity duration-300 group-hover/button:opacity-0">
            {children}
          </span>
        </>
      )}
      {!hasDrip && <span className="relative z-10">{children}</span>}
    </ButtonPrimitive>
  )
}

export { Button, buttonVariants }

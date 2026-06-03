import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center text-sm font-black uppercase tracking-wider whitespace-nowrap transition-all outline-none select-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-solid hover:bg-foreground hover:text-background hover:shadow-solid-lg hover:rotate-[2deg] active:translate-y-[2px] active:shadow-solid-sm",
        outline:
          "border-2 border-foreground bg-transparent text-foreground shadow-solid hover:bg-foreground hover:text-background hover:shadow-solid-lg hover:rotate-[2deg] active:translate-y-[2px] active:shadow-solid-sm",
        secondary:
          "bg-secondary text-secondary-foreground shadow-solid hover:brightness-110 hover:shadow-solid-lg hover:rotate-[2deg] active:translate-y-[2px] active:shadow-solid-sm",
        ghost:
          "text-foreground hover:bg-foreground/10 hover:text-foreground active:bg-foreground/20",
        destructive:
          "bg-destructive text-white shadow-solid hover:brightness-110 hover:shadow-solid-lg hover:rotate-[2deg] active:translate-y-[2px] active:shadow-solid-sm",
        link: "text-primary underline-offset-4 hover:underline",
        tape:
          "bg-primary text-primary-foreground clip-tape shadow-solid hover:bg-foreground hover:text-background hover:shadow-solid-lg hover:rotate-[2deg] active:translate-y-[2px]",
      },
      size: {
        default: "h-10 gap-2 px-6 text-sm",
        sm: "h-8 gap-1.5 px-4 text-xs",
        lg: "h-12 gap-2.5 px-8 text-base",
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
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }

import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "group/badge inline-flex h-6 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden border-2 border-foreground px-2.5 py-0.5 text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-solid-sm hover:shadow-solid hover:-translate-y-0.5",
        secondary:
          "bg-secondary text-secondary-foreground shadow-solid-sm hover:shadow-solid hover:-translate-y-0.5",
        destructive:
          "bg-destructive text-white shadow-solid-sm hover:shadow-solid hover:-translate-y-0.5",
        outline:
          "bg-transparent text-foreground shadow-solid-sm hover:shadow-solid hover:-translate-y-0.5",
        ghost:
          "border-transparent text-foreground hover:bg-foreground/10",
        link: "border-transparent text-primary underline-offset-4 hover:underline",
        sticker:
          "bg-primary text-primary-foreground clip-tape shadow-solid-sm hover:shadow-solid rotate-[-2deg] hover:rotate-0",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
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

import * as React from "react"

import { cn } from "@/lib/utils"
import { WideTornPaper } from "./wide-torn-paper"
import styles from "./torn-card.module.css"

export interface TornCardProps extends React.ComponentProps<"div"> {
  tornRotation?: string
  tornBackground?: React.ReactNode
  /** Show decorative tape at the top edge (default: true) */
  showTape?: boolean
}

export function TornCard({
  ref,
  className,
  tornRotation = "2deg",
  tornBackground,
  showTape = true,
  children,
  ...props
}: TornCardProps & { ref?: React.Ref<HTMLDivElement> }) {
  return (
    <div
      ref={ref}
      data-slot="card"
      data-variant="torn"
      style={{ transform: `rotate(${tornRotation})`, padding: "calc(var(--base-space, 8px) * 6) calc(var(--base-space, 8px) * 4)" } as React.CSSProperties}
      className={cn(
        "group/card relative w-full select-none text-center flex flex-col justify-between gap-4 z-10 text-black",
        className
      )}
      {...props}
    >
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-none select-none text-[#efefef]">
        {tornBackground ?? <WideTornPaper />}
      </div>

      {showTape && (
        <picture>
          <source media="(min-width: 640px)" srcSet="/official/save-data-bonus/tape-3-medium-up.webp 1x, /official/save-data-bonus/tape-3-medium-up-2x.webp 2x" width={202} height={77.5} type="image/webp" />
          <source media="(min-width: 640px)" srcSet="/official/save-data-bonus/tape-3-medium-up.png 1x, /official/save-data-bonus/tape-3-medium-up-2x.png 2x" width={202} height={77.5} type="image/png" />
          <source srcSet="/official/save-data-bonus/tape-3.webp 1x, /official/save-data-bonus/tape-3-2x.webp 2x" type="image/webp" width={97} height={37.5} />
          <source srcSet="/official/save-data-bonus/tape-3.png 1x, /official/save-data-bonus/tape-3-2x.png 2x" type="image/png" width={97} height={37.5} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className={cn(styles.cardTape, styles.cardTapeTopRight)} alt="" src="/official/save-data-bonus/tape-3.png" />
        </picture>
      )}

      <div className="relative h-full flex flex-col justify-between gap-4 z-10 text-center">
        {children}
      </div>
    </div>
  )
}

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
      style={{ transform: `rotate(${tornRotation})` } as React.CSSProperties}
      className={cn(
        "group/card relative w-full select-none text-center z-10 text-black",
        className
      )}
      {...props}
    >
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-none select-none">
        {tornBackground ?? <WideTornPaper bgColor="#efefef" />}
      </div>

      <div className="@container w-full">
        {showTape && (
          <picture className={cn(styles.cardTape, styles.cardTapeTopRight)}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className={styles.imgMobile}
              alt=""
              src="/official/save-data-bonus/tape-3.png"
              width={97}
              height={38}
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className={styles.imgDesktop}
              alt=""
              src="/official/save-data-bonus/tape-3-medium-up.png"
              width={202}
              height={78}
            />
          </picture>
        )}

        <div
          style={{ padding: "calc(var(--base-space, 8px) * 6) calc(var(--base-space, 8px) * 4)" } as React.CSSProperties}
          className="relative h-full flex flex-col justify-between gap-4 z-10 text-center"
        >
          {children}
        </div>
      </div>
    </div>
  )
}

import * as React from "react"

import { cn } from "@/lib/utils"
import { WideTornPaper } from "./wide-torn-paper"
import styles from "./torn-card.module.css"

export interface TornCardProps extends React.ComponentProps<"div"> {
  rotation?: string
  background?: string
  /** Show decorative tape at the top edge (default: true) */
  showTape?: boolean
  /** Show decorative sticker (default: false) */
  showSticker?: boolean
}

export function TornCard({
  ref,
  className,
  rotation = "2deg",
  background = "#efefef",
  showTape = true,
  showSticker = false,
  children,
  ...props
}: TornCardProps & { ref?: React.Ref<HTMLDivElement> }) {
  return (
    <div
      ref={ref}
      data-slot="card"
      data-variant="torn"
      style={{
        transform: `rotate(${rotation})`,
        filter: "drop-shadow(2px 2px 2px rgba(0,0,0,.3))",
      } as React.CSSProperties}
      className={cn(
        "group/card relative w-full select-none text-center z-10 text-chaos-black",
        className
      )}
      {...props}
    >
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-none select-none">
        <WideTornPaper bgColor={background} />
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

        {showSticker && (
          <picture className={cn(styles.cardDecoration, styles.cardDecorationTopRight)}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className={styles.imgMobile}
              alt=""
              src="/official/tape-assets/sticker-10.png"
              width={113}
              height={26}
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className={styles.imgDesktop}
              alt=""
              src="/official/tape-assets/sticker-10-medium-up.png"
              width={225}
              height={51}
            />
          </picture>
        )}

        <div
          className={cn(styles.alertContent, "relative h-full flex flex-col justify-between gap-4 z-10 text-center")}
        >
          {children}
        </div>
      </div>
    </div>
  )
}

function TornCardTitle({ className, ...props }: React.ComponentProps<"h2">) {
  return (
    <h2
      data-slot="card-title"
      className={cn("splat-heading text-2xl text-blue", className)}
      {...props}
    />
  )
}

function TornCardDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="card-description"
      className={cn("text-sm opacity-90", className)}
      {...props}
    />
  )
}

export { TornCardTitle, TornCardDescription }

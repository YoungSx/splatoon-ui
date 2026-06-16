import * as React from "react"

import { cn } from "@/lib/utils"
import { WideTornPaper } from "./wide-torn-paper"
import styles from "./torn-card.module.css"

export interface AlertProps extends React.ComponentProps<"div"> {
  rotation?: string
  background?: string
  /** Show decorative tape (default: true) */
  showTape?: boolean
  /** Show decorative sticker (default: false) */
  showSticker?: boolean
  /** Tape position at card edge */
  tapePosition?: "top-right" | "bottom-center"
}

export function Alert({
  ref,
  className,
  rotation = "-1.5deg",
  background = "#efefef",
  showTape = true,
  showSticker = false,
  tapePosition = "top-right",
  children,
  ...props
}: AlertProps & { ref?: React.Ref<HTMLDivElement> }) {
  const tapePositionClass =
    tapePosition === "bottom-center" ? styles.cardTapeBottomCenter : styles.cardTapeTopRight

  return (
    <div
      ref={ref}
      data-slot="alert"
      role="alert"
      style={{
        transform: `rotate(${rotation})`,
        filter: "drop-shadow(2px 2px 2px rgba(0,0,0,.3))",
      } as React.CSSProperties}
      className={cn(
        "group/alert relative w-full select-none text-center z-10 text-chaos-black",
        className
      )}
      {...props}
    >
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-none select-none">
        <WideTornPaper bgColor={background} />
      </div>

      <div className="@container w-full">
        {showTape && (
          <picture className={cn(styles.cardTape, tapePositionClass)}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className={styles.imgMobile}
              alt=""
              src="/official/tape-assets/tape-2.png"
              width={82}
              height={36}
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className={styles.imgDesktop}
              alt=""
              src="/official/tape-assets/tape-2-medium-up.png"
              width={166}
              height={74}
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
          className={cn(styles.alertContent, "relative z-10 flex flex-col gap-4")}
        >
          <div className="flex flex-col gap-2">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

function AlertTitle({ className, ...props }: React.ComponentProps<"h2">) {
  return (
    <h2
      data-slot="alert-title"
      className={cn("splat-heading text-2xl text-blue", className)}
      {...props}
    />
  )
}

function AlertDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="alert-description"
      className={cn("text-sm opacity-90", className)}
      {...props}
    />
  )
}

export { AlertTitle, AlertDescription }

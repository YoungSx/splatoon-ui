import * as React from "react"

import { cn } from "@/lib/utils"
import { WideTornPaper } from "./wide-torn-paper"
import styles from "./torn-card.module.css"

type AlertVariant = "basic" | "decorated"

const AlertContext = React.createContext<AlertVariant>("basic")

export interface AlertProps extends React.ComponentProps<"div"> {
  /** Card variant matching official Inkling/Octoling styles */
  variant?: AlertVariant
  /** Show decorative tape (default: true) */
  showTape?: boolean
  /** Show decorative sticker (default: true for octoling) */
  showSticker?: boolean
}

const VARIANT_CONFIG = {
  basic: {
    rotation: "-1.5deg",
    bgColor: "#efefef",
    tapePosition: styles.cardTapeTopRight,
    showStickerDefault: false,
  },
  decorated: {
    rotation: "3deg",
    bgColor: "#efefef",
    tapePosition: styles.cardTapeBottomCenter,
    showStickerDefault: true,
  },
} as const

export function Alert({
  ref,
  className,
  variant = "basic",
  showTape = true,
  showSticker,
  children,
  ...props
}: AlertProps & { ref?: React.Ref<HTMLDivElement> }) {
  const config = VARIANT_CONFIG[variant]
  const shouldShowSticker = showSticker ?? config.showStickerDefault

  return (
    <div
      ref={ref}
      data-slot="alert"
      role="alert"
      style={{
        transform: `rotate(${config.rotation})`,
        filter: "drop-shadow(2px 2px 2px rgba(0,0,0,.3))",
      } as React.CSSProperties}
      className={cn(
        "group/alert relative w-full select-none text-center z-10 text-chaos-black",
        className
      )}
      {...props}
    >
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-none select-none">
        <WideTornPaper bgColor={config.bgColor} />
      </div>

      <div className="@container w-full">
        {showTape && (
          <picture className={cn(styles.cardTape, config.tapePosition)}>
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

        {shouldShowSticker && (
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
          <AlertContext.Provider value={variant}>
            <div className="flex flex-col gap-2">
              {children}
            </div>
          </AlertContext.Provider>
        </div>
      </div>
    </div>
  )
}

function AlertTitle({ className, ...props }: React.ComponentProps<"h2">) {
  const variant = React.useContext(AlertContext)
  return (
    <h2
      data-slot="alert-title"
      data-variant={variant}
      className={cn("splat-heading text-2xl text-blue", className)}
      {...props}
    />
  )
}

function AlertDescription({ className, ...props }: React.ComponentProps<"p">) {
  const variant = React.useContext(AlertContext)
  return (
    <p
      data-slot="alert-description"
      data-variant={variant}
      className={cn("text-sm opacity-90", className)}
      {...props}
    />
  )
}

export { AlertTitle, AlertDescription }
export type { AlertVariant }

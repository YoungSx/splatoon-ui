"use client"

import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"

import { cn } from "@/lib/utils"
import styles from "./button.module.css"

const buttonVariants = cva(
  "group/button relative inline-flex shrink-0 items-center justify-center select-none overflow-hidden rounded-[8px] font-heading font-black uppercase tracking-wider transition-[transform,box-shadow] ease-[cubic-bezier(0.34,1.56,0.64,1)] duration-300 outline-none disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        yellow: "",
        blue: "",
        green: "",
        orange: "",
        purple: "",
        destructive: "",
        outline: "",
        ghost:
          "bg-transparent text-current shadow-none hover:bg-current/10 active:bg-current/20 hover:rotate-0 hover:scale-100 active:scale-95 active:translate-x-0 active:translate-y-0 active:shadow-none",
        arrow: "",
      },
      size: {
        default: "text-[22px]",
        sm: "text-base",
        lg: "text-[26px]",
        icon: "size-11 p-0",
        "icon-sm": "size-8 p-0",
        "icon-lg": "size-14 p-0",
      },
    },
    defaultVariants: {
      variant: "yellow",
      size: "default",
    },
  }
)

const sizePaddingMap = {
  default: "pt-3 pb-5 px-11",
  sm: "pt-2 pb-3.5 px-6",
  lg: "pt-4 pb-6.5 px-14",
  icon: "p-0",
  "icon-sm": "p-0",
  "icon-lg": "p-0",
}

const sizeContentLineHeightMap = {
  default: "leading-[24px]",
  sm: "leading-[20px]",
  lg: "leading-[28px]",
  icon: "leading-none",
  "icon-sm": "leading-none",
  "icon-lg": "leading-none",
}

const arrowButtonClassName =
  "group/button relative inline-block shrink-0 select-none bg-transparent p-0 font-heading text-[26px] font-medium normal-case tracking-normal leading-[26px] text-current transition-colors duration-200 outline-none disabled:pointer-events-none disabled:opacity-50 hover:text-[var(--ink-blue)] active:text-current"

const solidButtonEffectsClassName = "active:scale-[0.98] active:translate-x-[1px] active:translate-y-[1px]"

interface DripControlPoint {
  y1: number // leave amplitude offset
  y2: number // enter amplitude offset
}

type OfficialButtonTheme =
  | "dark"
  | "light"
  | "yellow"
  | "dark-yellow"
  | "dark-red"
  | "dark-purple"
  | "dark-purpleOrange"
  | "dark-green"
  | "dark-blue"
  | "light-blue"
  | "light-green"
  | "light-purple"
  | "light-red"
  | "black"

type OfficialButtonColor =
  | "yellow"
  | "blue"
  | "green"
  | "purple"
  | "orange"
  | "red"
  | "white"
  | "black"

interface ButtonSurfaceConfig {
  bgColor: string
  hoverBgColor: string
  outlineBorderColor?: string
}

interface ButtonTextThemeConfig {
  textColor: string
  hoverTextColor: string
}

const officialColorVarMap: Record<OfficialButtonColor, string> = {
  yellow: "var(--neon-yellow)",
  blue: "var(--ink-blue)",
  green: "var(--ink-green)",
  purple: "var(--ink-purple)",
  orange: "var(--ink-orange)",
  red: "var(--ink-red)",
  white: "#ffffff",
  black: "var(--chaos-black)",
}

const officialVariantSurfacePresets: Record<
  NonNullable<VariantProps<typeof buttonVariants>["variant"]>,
  ButtonSurfaceConfig | null
> = {
  yellow: {
    bgColor: officialColorVarMap.yellow,
    hoverBgColor: officialColorVarMap.blue,
  },
  blue: {
    bgColor: officialColorVarMap.blue,
    hoverBgColor: officialColorVarMap.yellow,
  },
  green: {
    bgColor: officialColorVarMap.green,
    hoverBgColor: officialColorVarMap.red,
  },
  orange: {
    bgColor: officialColorVarMap.orange,
    hoverBgColor: officialColorVarMap.purple,
  },
  purple: {
    bgColor: officialColorVarMap.purple,
    hoverBgColor: officialColorVarMap.blue,
  },
  destructive: {
    bgColor: officialColorVarMap.red,
    hoverBgColor: officialColorVarMap.green,
  },
  outline: {
    bgColor: officialColorVarMap.white,
    hoverBgColor: officialColorVarMap.yellow,
    outlineBorderColor: officialColorVarMap.black,
  },
  ghost: null,
  arrow: null,
}

// Keep a legacy fallback for callers that only specify `variant`.
const officialVariantFallbackTextPresets: Record<
  NonNullable<VariantProps<typeof buttonVariants>["variant"]>,
  ButtonTextThemeConfig | null
> = {
  yellow: {
    textColor: officialColorVarMap.black,
    hoverTextColor: officialColorVarMap.white,
  },
  blue: {
    textColor: officialColorVarMap.white,
    hoverTextColor: officialColorVarMap.black,
  },
  green: {
    textColor: officialColorVarMap.black,
    hoverTextColor: officialColorVarMap.black,
  },
  orange: {
    textColor: officialColorVarMap.black,
    hoverTextColor: officialColorVarMap.black,
  },
  purple: {
    textColor: officialColorVarMap.black,
    hoverTextColor: officialColorVarMap.white,
  },
  destructive: {
    textColor: officialColorVarMap.black,
    hoverTextColor: officialColorVarMap.white,
  },
  outline: {
    textColor: officialColorVarMap.black,
    hoverTextColor: officialColorVarMap.black,
  },
  ghost: null,
  arrow: null,
}

// These map to the official theme classes and only influence text contrast.
const officialButtonThemeTextPresets: Record<OfficialButtonTheme, ButtonTextThemeConfig> = {
  dark: {
    textColor: officialColorVarMap.black,
    hoverTextColor: officialColorVarMap.black,
  },
  light: {
    textColor: officialColorVarMap.white,
    hoverTextColor: officialColorVarMap.white,
  },
  yellow: {
    textColor: officialColorVarMap.black,
    hoverTextColor: officialColorVarMap.black,
  },
  "dark-yellow": {
    textColor: officialColorVarMap.black,
    hoverTextColor: officialColorVarMap.white,
  },
  "dark-red": {
    textColor: officialColorVarMap.black,
    hoverTextColor: officialColorVarMap.white,
  },
  "dark-purple": {
    textColor: officialColorVarMap.black,
    hoverTextColor: officialColorVarMap.white,
  },
  "dark-purpleOrange": {
    textColor: officialColorVarMap.black,
    hoverTextColor: officialColorVarMap.black,
  },
  "dark-green": {
    textColor: officialColorVarMap.black,
    hoverTextColor: officialColorVarMap.black,
  },
  "dark-blue": {
    textColor: officialColorVarMap.black,
    hoverTextColor: officialColorVarMap.black,
  },
  "light-blue": {
    textColor: officialColorVarMap.white,
    hoverTextColor: officialColorVarMap.black,
  },
  "light-green": {
    textColor: officialColorVarMap.white,
    hoverTextColor: officialColorVarMap.black,
  },
  "light-purple": {
    textColor: officialColorVarMap.white,
    hoverTextColor: officialColorVarMap.white,
  },
  "light-red": {
    textColor: officialColorVarMap.white,
    hoverTextColor: officialColorVarMap.white,
  },
  black: {
    textColor: officialColorVarMap.black,
    hoverTextColor: officialColorVarMap.black,
  },
}

export interface ButtonProps
  extends React.ComponentPropsWithoutRef<typeof ButtonPrimitive>,
    VariantProps<typeof buttonVariants> {
  hasChevron?: boolean
  asChild?: boolean
  color?: OfficialButtonColor
  hoverColor?: OfficialButtonColor
  textColor?: OfficialButtonColor
  textHoverColor?: OfficialButtonColor
  theme?: OfficialButtonTheme
}

type ButtonMouseEnterEvent = Parameters<NonNullable<ButtonProps["onMouseEnter"]>>[0]
type ButtonMouseLeaveEvent = Parameters<NonNullable<ButtonProps["onMouseLeave"]>>[0]
type ButtonClickEvent = Parameters<NonNullable<ButtonProps["onClick"]>>[0]

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "yellow",
      size = "default",
      children,
      hasChevron = true,
      onClick,
      onMouseEnter,
      onMouseLeave,
      asChild = false,
      color,
      hoverColor,
      textColor,
      textHoverColor,
      theme,
      ...props
    },
    ref
  ) => {
    const localRef = React.useRef<HTMLButtonElement>(null)
    const activeRef = (ref as React.RefObject<HTMLButtonElement>) || localRef

    // Component mounting state to guard against SSR hydration mismatch
    const [mounted, setMounted] = React.useState(false)
    const [dimensions, setDimensions] = React.useState({ width: 100, height: 50 })
    const [controlPoints, setControlPoints] = React.useState<DripControlPoint[]>([])
    const [speedFactorActive, setSpeedFactorActive] = React.useState(false)
    const [hovered, setHovered] = React.useState(false)

    const stepSize = 30
    const maxAmplitude = 80
    const hasDrip = variant !== "ghost" && variant !== "arrow"

    React.useEffect(() => {
      setMounted(true)

      const handleResize = () => {
        if (!activeRef.current) return
        const width = activeRef.current.clientWidth
        // 2px extra height to cover fully when clipping
        const height = activeRef.current.clientHeight + 2
        setDimensions({ width, height })

        const points: DripControlPoint[] = []
        const count = Math.ceil(width / stepSize)

        for (let r = 0; r < count; r++) {
          const amplitude = r % 2 === 0 ? -80 : maxAmplitude
          const y1 = 0.1 * amplitude + Math.random() * (0.9 * amplitude)
          const y2 = 0.1 * amplitude + Math.random() * (0.9 * amplitude)

          points.push({ y1, y2 })
        }
        setControlPoints(points)
      }

      window.addEventListener("resize", handleResize)
      handleResize()

      // Delay animation activation slightly to prevent initial load transition snap
      const timer = setTimeout(() => {
        setSpeedFactorActive(true)
      }, 500)

      return () => {
        window.removeEventListener("resize", handleResize)
        clearTimeout(timer)
      }
    }, [activeRef])

    // Path generation function corresponding to the official F(index, isOut)
    const getDripPath = (index: number, isOut: boolean) => {
      if (!dimensions.width || !dimensions.height || controlPoints.length === 0) return ""

      const r = index === 0 ? -8 : dimensions.height + maxAmplitude
      let path = `M0 ${r}`

      for (let o = 0; o < controlPoints.length; o++) {
        const pt = controlPoints[o]
        const offset = index === 0 ? 0 : isOut ? pt.y1 : pt.y2
        const a = o * stepSize + (Math.random() * 12 - 6)
        path += `C${a + 6} ${r + offset},${a + 24} ${r + offset},${a + stepSize} ${r}`
      }

      if (isOut) {
        path += `L${dimensions.width} ${dimensions.height}, 0 ${dimensions.height}`
      } else {
        path += `L${dimensions.width} -8, 0 -8`
      }
      path += "Z"
      return path
    }

    const paddingKey = size
    const paddingClass = paddingKey && paddingKey in sizePaddingMap
      ? sizePaddingMap[paddingKey as keyof typeof sizePaddingMap]
      : sizePaddingMap.default
    const contentLineHeightClass = paddingKey && paddingKey in sizeContentLineHeightMap
      ? sizeContentLineHeightMap[paddingKey as keyof typeof sizeContentLineHeightMap]
      : sizeContentLineHeightMap.default
    const variantKey = (variant ?? "yellow") as NonNullable<VariantProps<typeof buttonVariants>["variant"]>
    const surfacePreset = officialVariantSurfacePresets[variantKey]
    const fallbackTextPreset = officialVariantFallbackTextPresets[variantKey]
    const themeTextPreset = theme ? officialButtonThemeTextPresets[theme] : null

    const resolvedColorConfig = surfacePreset
      ? {
          bgColor: color ? officialColorVarMap[color] : surfacePreset.bgColor,
          textColor: textColor
            ? officialColorVarMap[textColor]
            : themeTextPreset?.textColor ?? fallbackTextPreset?.textColor ?? officialColorVarMap.black,
          hoverBgColor: hoverColor ? officialColorVarMap[hoverColor] : surfacePreset.hoverBgColor,
          hoverTextColor: textHoverColor
            ? officialColorVarMap[textHoverColor]
            : themeTextPreset?.hoverTextColor ?? fallbackTextPreset?.hoverTextColor ?? officialColorVarMap.white,
          outlineBorderColor: surfacePreset.outlineBorderColor,
        }
      : null
    const colorStyle = {
      ...(resolvedColorConfig
        ? {
            "--bg-color": resolvedColorConfig.bgColor,
            "--text-color": resolvedColorConfig.textColor,
            "--hover-bg-color": resolvedColorConfig.hoverBgColor,
            "--hover-text-color": resolvedColorConfig.hoverTextColor,
            ...(resolvedColorConfig.outlineBorderColor
              ? {
                  "--outline-border-color": resolvedColorConfig.outlineBorderColor,
                }
              : {}),
          }
        : {}),
      ...(variant === "ghost"
        ? {
            boxShadow: "none",
          }
        : {}),
    } as React.CSSProperties

    const dripStyle = mounted && dimensions.width > 0
      ? ({
          ...(hasDrip
            ? {
                "--drip-in-start": `path("${getDripPath(0, false)}")`,
                "--drip-in-end": `path("${getDripPath(1, false)}")`,
                "--drip-out-start": `path("${getDripPath(0, true)}")`,
                "--drip-out-end": `path("${getDripPath(1, true)}")`,
                "--drip-speed-factor": speedFactorActive ? "1" : "0",
              }
            : {}),
        } as React.CSSProperties)
      : undefined

    const splatChevron = (
      <svg
        aria-hidden="true"
        role="img"
        className={cn(
          "shrink-0 overflow-visible",
          variant === "arrow"
            ? "ml-0 inline h-[16px] w-[8px] overflow-hidden align-baseline"
            : "ml-1.5 h-[13px] w-[8px] self-end overflow-hidden"
        )}
        viewBox="0 0 7 12"
      >
        <path
          d="M0,11.23.12,11l.32-.47.3-.12-.16-.35.18-.49.4-.21L1.09,9l.23-.35.26-.21.32-.21L2,7.84l.2-.38v-.3l.47-.47-.05-.38L3,6.08l-.19-.77,0-.26-.26-.3-.1-.31-.42-.25,0-.38-.32-.23L1.5,3.25l0-.32-.05-.26L1,2.37.94,2,.66,1.76.51,1.41.23,1.08.3.66.14.41,0,.13l.7,0L1,.08l.14.14L1.68,0,2,.12,2.21,0l.66.21.26,0h.42l.33.14L4.3.69l0,.38.29.27.14.4L5,2l.07.37,0,.14L5.48,3l.07.09.42.3.1.33L6,4.07l.24.33.42.25,0,.35.1.4.16.47-.11.42-.21.33L6.41,7,6.2,7.2,6,7.6,6,7.93l-.28.31-.3.3,0,.19-.16.37L5,9.43l-.18.14-.23.33-.21.38.09.42-.3.33,0,.18-.66.24-.39.1-.52.09,0-.09-.5-.09-.46.07-.26.09-.4,0-.39-.07-.45.17L0,11.23Z"
          stroke="none"
          fill="currentColor"
        />
      </svg>
    )

    const isTextChildren = typeof children === "string" || typeof children === "number"
    const Comp = asChild ? Slot : ButtonPrimitive

    return (
        <Comp
        ref={activeRef}
        data-slot="button"
        data-drip-hovered={hasDrip && hovered ? "true" : undefined}
        style={dripStyle ? ({ ...colorStyle, ...dripStyle } as React.CSSProperties) : colorStyle}
        className={cn(
          variant === "arrow"
            ? arrowButtonClassName
            : buttonVariants({ variant, size }),
          hasDrip ? styles.dripRoot : undefined,
          variant !== "arrow" && variant !== "ghost" ? solidButtonEffectsClassName : undefined,
          variant === "arrow" || (hasDrip && isTextChildren) ? undefined : paddingClass,
          className
        )}
        onClick={(event) => {
          if (hasDrip) {
            setHovered(true)
          }
          onClick?.(event as ButtonClickEvent)
        }}
        onMouseEnter={(event: ButtonMouseEnterEvent) => {
          if (hasDrip) {
            setHovered(true)
          }
          onMouseEnter?.(event)
        }}
        onMouseLeave={(event: ButtonMouseLeaveEvent) => {
          onMouseLeave?.(event)
        }}
        {...props}
      >
        {hasDrip ? (
          isTextChildren ? (
            <>
              {/* Official structure: overlay sits above a square base layer; the root provides the corner clip. */}
              <span
                aria-hidden="true"
                className={cn(
                  "absolute left-0 top-0 z-20 flex h-full w-full items-center justify-center rounded-[8px] text-[var(--hover-text-color)]",
                  styles.dripHoverContent,
                  paddingClass
                )}
              >
                <span aria-hidden="true" className={styles.dripFill} />
                <span aria-hidden="true" className={styles.dripFrame} />
                <span className={cn("relative z-10 flex items-center justify-center whitespace-nowrap", contentLineHeightClass)}>
                  {children}
                  {hasChevron && size !== "icon" && splatChevron}
                </span>
              </span>

              <span
                className={cn(
                  "flex h-full w-full items-center justify-center bg-[var(--bg-color)] text-[var(--text-color)]",
                  paddingClass
                )}
              >
                <span className={cn("relative z-10 flex items-center justify-center whitespace-nowrap", contentLineHeightClass)}>
                  {children}
                  {hasChevron && size !== "icon" && splatChevron}
                </span>
              </span>
            </>
          ) : (
            <>
              {/* Base surface layer keeps the root transparent, like the official button shell. */}
              <span
                aria-hidden="true"
                className="absolute left-0 top-0 z-10 h-full w-full bg-[var(--bg-color)]"
              />

              {/* Pure Drip Liquid Background Mask Layer */}
              <span
                aria-hidden="true"
                className={cn(
                  "absolute left-0 top-0 z-20 h-full w-full rounded-[8px]",
                  styles.dripHoverContent
                )}
              >
                <span aria-hidden="true" className={styles.dripFill} />
                <span aria-hidden="true" className={styles.dripFrame} />
              </span>

              {/* Unified content wrapper placed on top, transitions text colors */}
              <span className="relative z-30 flex items-center justify-center w-full h-full text-[var(--text-color)] group-hover/button:text-[var(--hover-text-color)] transition-colors duration-200">
                <span className={cn("relative z-10 flex items-center justify-center whitespace-nowrap", contentLineHeightClass)}>
                  {children}
                  {hasChevron && size !== "icon" && splatChevron}
                </span>
              </span>
            </>
          )
        ) : (
          <span
            className={cn(
              "relative z-10 whitespace-nowrap",
              variant === "arrow"
                ? "inline-block leading-[26px]"
                : cn("inline-flex items-center justify-center", contentLineHeightClass)
            )}
          >
            {children}
            {hasChevron && size !== "icon" && splatChevron}
          </span>
        )}
      </Comp>
    )
  }
)

Button.displayName = "Button"

export { Button, buttonVariants }

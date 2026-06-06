"use client"

import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"

import { cn } from "@/lib/utils"
import { Tape, Staple } from "./tape"

// CardContext for variant-sharing among sub-components (like CardImage)
type CardVariant = "news" | "tag"
type PaperLabelColor = "yellow" | "red" | "blue" | "green"
type PaperLabelPlacement = "left" | "right"

interface PaperLabelConfig {
  text?: string
  color?: PaperLabelColor
  placement?: PaperLabelPlacement
}

const CardContext = React.createContext<{ variant?: CardVariant; surface?: "paper" | "cream" | "danger" }>({
  variant: "news",
  surface: "paper",
})

const newsSurfaceVariants = cva("flex h-full flex-col pt-0 px-8 pb-6 relative z-10", {
  variants: {
    surface: {
      paper: "bg-white text-[#0d0d0d]",
      cream: "bg-[#f5f0e8] text-[#0d0d0d]",
      danger: "bg-[#ff505e] text-white",
    },
  },
  defaultVariants: {
    surface: "paper",
  },
})

type NewsSurface = NonNullable<VariantProps<typeof newsSurfaceVariants>["surface"]>

const newsSurfaceFillMap = {
  paper: { light: "#ffffff", dark: "#ffffff" },
  cream: { light: "#f5f0e8", dark: "#f5f0e8" },
  danger: { light: "#ff505e", dark: "#ff505e" },
} as const satisfies Record<NewsSurface, { light: string; dark: string }>

export interface CardProps extends React.ComponentProps<"div"> {
  asChild?: boolean
  variant?: CardVariant
  paperFasteners?: boolean
  paperLabel?: PaperLabelConfig
  surface?: NewsSurface
  // For tag variant
  tagTheme?: "yellow" | "blue" | "purple" | "orange" | "green"
  tagRotation?: string
}

const tagThemeMap = {
  yellow: "text-[#eaff3d] text-[#0d0d0d]",
  blue: "text-[#603bff] text-[#ffffff]",
  purple: "text-[#af50ff] text-[#ffffff]",
  orange: "text-[#ff9750] text-[#ffffff]",
  green: "text-[#6af7ce] text-[#0d0d0d]",
}

interface PaperCardFrameProps {
  asChild?: boolean
  className?: string
  dataVariant: "news"
  surface: NewsSurface
  paperLabel?: PaperLabelConfig
  paperFasteners: boolean
  children: React.ReactNode
  forwardedRef?: React.ForwardedRef<HTMLDivElement>
  props?: Omit<React.ComponentProps<"div">, "children" | "className">
}

function PaperCardFrame({
  asChild = false,
  className,
  dataVariant,
  surface,
  paperLabel,
  paperFasteners,
  children,
  forwardedRef,
  props,
}: PaperCardFrameProps) {
  const Comp = asChild ? Slot : "div"
  const svgFills = newsSurfaceFillMap[surface]
  const { style: propStyle, ...restProps } = props ?? {}

  const cardStyle = {
    "--card-svg-fill": svgFills.light,
    "--card-svg-fill-dark": svgFills.dark,
    ...propStyle,
  } as React.CSSProperties

  return (
    <Comp
      ref={forwardedRef}
      data-slot="card"
      data-variant={dataVariant}
      style={cardStyle}
      className={cn(
        "group/card relative flex h-full flex-col cursor-pointer transition-transform duration-300 [transition-timing-function:var(--ease-in-out-quart)]",
        className
      )}
      {...restProps}
    >
      <svg
        aria-hidden="true"
        className="relative z-10 mb-[-2px] w-full pointer-events-none select-none"
        style={{ fill: "var(--card-svg-fill)" }}
        viewBox="0 0 448 60"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <path
          d="M253.96 23.774a4.711 4.711 0 0 1-4.693 4.328h-49.535c-.131 0-.255-.027-.384-.038-2.431-.198-4.348-2.205-4.348-4.68a4.724 4.724 0 0 1 4.732-4.716h18.204c-.006-.106-.017-.21-.017-.315 0-3.452 2.808-6.25 6.27-6.25h.62a6.26 6.26 0 0 1 5.038 2.54 6.194 6.194 0 0 1 1.233 3.71c0 .106-.01.21-.016.315H249.267c2.614 0 4.733 2.111 4.733 4.717 0 .133-.029.258-.04.389M53.446.102H9.693C4.34.102 0 4.437 0 9.782v50.044h448V9.783c0-5.346-4.338-9.68-9.693-9.68H53.445Z"
          fillRule="evenodd"
        />
      </svg>

      <div className={cn(newsSurfaceVariants({ surface }))}>
        {paperLabel && (
          <Tape
            variant="torn"
            color={paperLabel.color ?? "yellow"}
            text={paperLabel.text ?? "NEWS!"}
            className={cn(
              "absolute z-30 select-none pointer-events-none w-[45%] max-w-[150px]",
              (paperLabel.placement ?? "left") === "left"
                ? "left-0 top-0 origin-center [transform:translate(10%,-130%)_rotate(-10deg)]"
                : "right-0 top-0 origin-center [transform:translate(-10%,-130%)_rotate(10deg)]"
            )}
          />
        )}
        {paperFasteners && (
          <Staple
            position="left"
            className="pointer-events-none absolute bottom-0 left-[20px] z-30 w-[20%] max-w-[140px] select-none"
          />
        )}
        {paperFasteners && (
          <Staple
            position="right"
            className="pointer-events-none absolute bottom-0 right-[20px] z-30 w-[10%] max-w-[90px] select-none"
          />
        )}

        <div className="relative flex h-full w-full flex-col gap-0">
          {children}
        </div>
      </div>

      <svg
        aria-hidden="true"
        className="relative z-10 mt-[-2px] w-full pointer-events-none select-none"
        style={{ fill: "var(--card-svg-fill)" }}
        viewBox="0 0 448 24"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <path
          d="M0 .826c0 9.527 5.976 17.64 14.378 20.862 2.49.955 5.184 1.5 8.01 1.5h403.223c4.635 0 8.94-1.407 12.514-3.816C444.082 15.354 448 8.548 448 .826H0Z"
          fillRule="evenodd"
        />
      </svg>
    </Comp>
  )
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      asChild = false,
      variant = "news",
      paperFasteners,
      paperLabel,
      surface = "paper",
      // For tag
      tagTheme = "yellow",
      tagRotation = "2deg",
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "div"

    // Tag Hanger Background SVG path
    const tagBgSvg = (
      <svg
        viewBox="0 0 566 555"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full"
        preserveAspectRatio="none"
      >
        <path
          d="m311.748694 27.1685099h-55.497388c-2.987542 0-5.410583-2.41764-5.410583-5.3985227s2.423041-5.3985227 5.410583-5.3985227h21.676089v-.3817326c0-3.3457742 2.719357-6.05906986 6.072605-6.05906986s6.072605 2.71329566 6.072605 6.05906986v.3817326h21.676089c2.987542 0 5.410583 2.41764 5.410583 5.3985227s-2.423041 5.3985227-5.410583 5.3985227m248.671936-18.68057264c-.480108-.68300201-2.89002-2.0040963-2.89002-2.0040963l-1.911052.14595659-1.860415.76907897-1.714133-.13285792-.783925-.39108882.146283-.75785154-.517616-1.52880175s.94146-3.10064198.495111-3.26343972c-.590757-.21332118-1.194642-.40418749-1.807904-.56885647-.613262-.16279774-1.237776-.30314061-1.869792-.41354368-1.265908-.2245486-2.569324-.34243662-3.900871-.34243662h-18.062157l-2.473677.86451213-1.468453 1.75896407-1.665371-.48839322-1.860416.87948204-2.449296-.97865767-1.470329-1.07409083-4.774815-.96181652h-79.04702l-5.950703 1.25560095-4.701675 2.53927047-3.011922-1.63546234h-2.938781l-3.141326 1.01795368 1.157133-1.3847164 2.741862-1.79264636-2.473677.86451213-1.468453 1.75896407-1.665371-.48839322-.748292.35366405-2.361152-1.23314608-3.730208-.5071056-3.715204-.74849535.857066.35927777-2.64434-.35927777h-170.15566l-8.4 1.76832026-6.856531 1.75896407-5.877561-2.34653292-3.91775.39108882-4.309712.97865767-4.506631.19460879-1.762893-1.17326646-8.251842-1.57184023h-160.507435c-1.2377763 0-2.4511722.10104687-3.6345613.29565566-1.1833892.19460879-2.3330208.4827795-3.445144.85515594-.6301407.40231625-1.8266578 1.5213168-1.8266578 1.5213168l-1.106497.78966259-2.39490954.72416925-1.49845948 1.15268284-1.29778968 1.64107605.03563295 1.39220135-.43884796.7952763-1.3596785.87012582-1.02960482 1.6822433s-1.64849297.60441-2.13047555 1.0797046c-1.32592096 2.8405398-2.06671132 6.0066751-2.06671132 9.3449644v499.9200981l3.31949096 13.242754 4.13904889 7.183684 5.48559945 4.300106 5.680643 1.270571 9.5027462 2.640317 11.1906229.658676 6.9784327 1.758964 8.3756195.51272 7.6892164 1.367875h109.36852l6.269524-.877611 1.714133-.245132 1.665372-1.221919 2.154856 1.173267 6.61085 1.171395h175.446216l6.83215-.890709 1.640991-1.307996 1.468453-.097304 3.465774 1.111515 14.361955.258231 31.591427.926263 18.022773-1.074091 7.933021-2.93223 3.268854 2.350275 6.367047-.40793 4.309712-.959945 2.927528.495878 4.712927-.301269 3.233222-1.270571 14.300067-.976787 6.155124.351793 5.6.233905 6.843402-.851414 3.718955-.185252 9.125787.351793 10.446082-1.322966 4.714802-4.27578 5.12927-1.58681 2.839384-2.640317 2.303014-4.739847 1.957937-1.367875 4.017147.19648 4.667917-6.259292 1.370931-5.013048 2.434293-3.925858 1.370931-5.570677 1.370931-5.473372 1.907301-5.600616v-480.0999421c0-4.0287762-1.078366-7.8068065-2.963161-11.0627613-.324448-.5595002-2.246752-2.06771836-2.616209-2.59353634z"
          fill="currentColor"
          fillRule="evenodd"
        />
      </svg>
    )

    if (variant === "tag") {
      const themeClasses = tagThemeMap[tagTheme] || tagThemeMap.yellow
      const [bgColorClass, fgColorClass] = themeClasses.split(" ")

      return (
        <CardContext.Provider value={{ variant, surface }}>
          <Comp
            ref={ref}
            data-slot="card"
            data-variant="tag"
            style={{
              transform: `rotate(${tagRotation})`,
            } as React.CSSProperties}
            className={cn(
              "group/card relative w-full pt-[12%] px-[6%] pb-[8%] transition-transform duration-300 ease-out hover:scale-[1.025] select-none text-center flex flex-col justify-between gap-4 z-10",
              fgColorClass,
              className
            )}
            {...props}
          >
            {/* Tag Hanger Background SVG */}
            <div className={cn("absolute inset-0 w-full h-full z-0 pointer-events-none select-none", bgColorClass)}>
              {tagBgSvg}
            </div>

            {/* Inner Content Area */}
            <div className="relative h-full flex flex-col justify-between gap-4 z-10 text-center">
              {children}
            </div>
          </Comp>
        </CardContext.Provider>
      )
    }

    return (
      <CardContext.Provider value={{ variant, surface }}>
        <PaperCardFrame
          asChild={asChild}
          className={className}
          dataVariant="news"
          surface={surface}
          paperLabel={paperLabel}
          paperFasteners={paperFasteners ?? false}
          forwardedRef={ref}
          props={props}
        >
          {children}
        </PaperCardFrame>
      </CardContext.Provider>
    )
  }
)
Card.displayName = "Card"

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "group/card-header grid auto-rows-min items-start gap-1.5 border-b-2 border-dashed border-current/20 pb-4 group-data-[size=sm]/card:pb-3",
        className
      )}
      {...props}
    />
  )
}
CardHeader.displayName = "CardHeader"

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn(
        "splat-skew text-2xl font-black uppercase tracking-wider leading-none text-current",
        className
      )}
      {...props}
    />
  )
}
CardTitle.displayName = "CardTitle"

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-[15px] font-medium opacity-80 leading-snug", className)}
      {...props}
    />
  )
}
CardDescription.displayName = "CardDescription"

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  )
}
CardAction.displayName = "CardAction"

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("relative z-20 flex flex-col font-medium text-[16px] text-current leading-relaxed", className)}
      {...props}
    />
  )
}
CardContent.displayName = "CardContent"

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        "flex items-center justify-between border-t-2 border-dashed border-current/20 pt-4 mt-2 group-data-[size=sm]/card:pt-3 group-data-[size=sm]/card:mt-1",
        className
      )}
      {...props}
    />
  )
}
CardFooter.displayName = "CardFooter"

export interface CardImageProps extends React.ComponentProps<"div"> {
  src?: string
  alt?: string
  asChild?: boolean
}

const CardImage = React.forwardRef<HTMLDivElement, CardImageProps>(
  ({ className, src, alt, asChild = false, children, ...props }, ref) => {
    const { variant } = React.useContext(CardContext)
    const Comp = asChild ? Slot : "div"

    if (variant === "tag") {
      // Polaroid style photo frame inside tag card
      return (
        <div
          ref={ref}
          data-slot="card-image-tag-wrapper"
          className="relative w-full py-4 flex justify-center"
        >
          {/* Scotch tape on top center */}
          <svg
            className="absolute -top-[6px] left-1/2 -translate-x-1/2 z-30 select-none pointer-events-none rotate-[-3deg] opacity-90"
            width="100"
            height="28"
            viewBox="0 0 100 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5 6 L95 2 L93 24 L3 28 Z"
              fill="#0d0d0d"
              opacity="0.15"
            />
            <path
              d="M3 4 L93 0 L91 22 L1 26 Z"
              fill="#f4f4f4"
              fillOpacity="0.65"
              stroke="#18181b"
              strokeWidth="1.5"
              strokeDasharray="4 2"
            />
            <path
              d="M3 4 L1.5 8 L2.5 12 L0.5 16 L2 20 L0.5 24 L1 26 Z"
              fill="#d1d1d6"
              fillOpacity="0.5"
            />
            <path
              d="M93 0 L94.5 4 L92.5 8 L95 12 L93 16 L94.5 20 L91 22 Z"
              fill="#d1d1d6"
              fillOpacity="0.5"
            />
          </svg>

          {/* Photo Polaroid Frame */}
          <div
            className={cn(
              "shadow-soft-splat-sm relative z-10 w-full bg-white p-3 pb-8 text-chaos-black border-2 border-chaos-black [transform:rotate(2deg)] transition-transform duration-300 hover:rotate-0",
              className
            )}
            {...props}
          >
            {src ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={src}
                alt={alt}
                className="w-full h-auto object-contain border-2 border-chaos-black"
              />
            ) : (
              children
            )}
          </div>
        </div>
      )
    }

    // Default: news variant rotated photo
    return (
      <Comp
        ref={ref}
        data-slot="card-image"
        className={cn(
          "grid-news-card_image relative w-full flex items-center justify-center [transform:rotate(-1deg)] overflow-hidden",
          className
        )}
        {...props}
      >
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt={alt} className="w-full h-auto object-contain" />
        ) : (
          children
        )}
      </Comp>
    )
  }
)
CardImage.displayName = "CardImage"

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
  CardImage,
}

export type { NewsSurface, PaperLabelConfig }

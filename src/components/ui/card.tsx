"use client"

import { Slot } from "@radix-ui/react-slot"
import * as React from "react"

import { cn } from "@/lib/utils"

// CardContext for variant-sharing among sub-components (like CardImage)
const CardContext = React.createContext<{ variant?: "news" | "tag" }>({ variant: "news" })

export interface CardProps extends React.ComponentProps<"div"> {
  asChild?: boolean
  variant?: "news" | "tag"
  // For news variant
  hasStaples?: boolean
  hasTape?: boolean
  tapeText?: string
  tapeColor?: "yellow" | "red" | "blue" | "green"
  tapePosition?: "news" | "event"
  cardBgColor?: string
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

// Safelist of text color classes mapped from background colors to ensure Tailwind compile retains them
const _tailwindCardSafelist = [
  "text-white",
  "dark:text-[#1e1e1e]",
  "text-[#ff505e]",
  "text-[#f5f0e8]",
  "dark:text-[#111111]",
  "text-[#603bff]",
  "text-[#ff9750]",
  "text-[#6af7ce]",
]

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      asChild = false,
      variant = "news",
      // For news
      hasStaples = false,
      hasTape = false,
      tapeText = "NEWS!",
      tapeColor = "yellow",
      tapePosition = "news",
      cardBgColor = "bg-white dark:bg-[#1e1e1e] text-chaos-black dark:text-white",
      // For tag
      tagTheme = "yellow",
      tagRotation = "2deg",
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "div"
    const [mounted, setMounted] = React.useState(false)
    const [hoverRotate, setHoverRotate] = React.useState("0deg")

    React.useEffect(() => {
      setMounted(true)
      // Random rotation angle on hover: -2.0deg ~ -1.0deg or 1.0deg ~ 2.0deg
      const angle = (Math.random() > 0.5 ? 1 : -1) * (1.0 + Math.random() * 1.0)
      setHoverRotate(`${angle.toFixed(2)}deg`)
    }, [])

    const inlineStyle = mounted
      ? ({
          "--hover-rotate": hoverRotate,
        } as React.CSSProperties)
      : undefined

    // Exact high-quality metallic staples SVG with paper entry holes & drop shadows
    const stapleLeft = (
      <svg
        className="absolute bottom-0 left-[20px] z-30 select-none pointer-events-none rotate-[-18deg] w-[20%]"
        viewBox="0 0 55 22"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="5" y="6" width="44" height="8" rx="2" fill="#0d0d0d" opacity="0.35" />
        <rect x="3" y="2" width="44" height="8" rx="2" fill="#a1a1aa" stroke="#18181b" strokeWidth="2" />
        <rect x="5" y="4" width="40" height="2" fill="#f4f4f5" />
        <rect x="4" y="4" width="3" height="4" fill="#18181b" />
        <rect x="42" y="4" width="3" height="4" fill="#18181b" />
      </svg>
    )

    const stapleRight = (
      <svg
        className="absolute bottom-0 right-[20px] z-30 select-none pointer-events-none rotate-[28deg] w-[10%]"
        viewBox="0 0 55 22"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="5" y="6" width="44" height="8" rx="2" fill="#0d0d0d" opacity="0.35" />
        <rect x="3" y="2" width="44" height="8" rx="2" fill="#a1a1aa" stroke="#18181b" strokeWidth="2" />
        <rect x="5" y="4" width="40" height="2" fill="#f4f4f5" />
        <rect x="4" y="4" width="3" height="4" fill="#18181b" />
        <rect x="42" y="4" width="3" height="4" fill="#18181b" />
      </svg>
    )

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
        <CardContext.Provider value={{ variant }}>
          <Comp
            ref={ref}
            data-slot="card"
            data-variant="tag"
            style={{
              transform: `rotate(${tagRotation})`,
              ...inlineStyle,
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

    // Default: variant === "news" (Polaroid News style card)
    const stickerColorMap = {
      yellow: { bg: "#eaff3d", text: "#0d0d0d" },
      red: { bg: "#ff505e", text: "#ffffff" },
      blue: { bg: "#603bff", text: "#eaff3d" },
      green: { bg: "#6af7ce", text: "#0d0d0d" },
    }

    const stickerColors = stickerColorMap[tapeColor] || stickerColorMap.yellow

    const adhesiveTape = (
      <div
        aria-hidden="true"
        className={cn(
          "absolute z-30 select-none pointer-events-none w-[45%] max-w-[150px]",
          tapePosition === "news"
            ? "left-0 top-0 origin-center [transform:translate(10%,-130%)_rotate(-10deg)]"
            : "right-0 top-0 origin-center [transform:translate(-10%,-130%)_rotate(10deg)]"
        )}
      >
        <svg
          viewBox="0 0 96 31"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto drop-shadow-[2px_2px_2px_rgba(0,0,0,0.3)]"
        >
          <rect width="96" height="31" rx="5" fill={stickerColors.bg} />
          
          {/* Logo B on the right */}
          <g fill={stickerColors.text}>
            <path
              d="M74,7 h4.5 c1.5,0 2.5,0.8 2.5,1.8 v0.2 c0,0.8 -0.6,1.4 -1.5,1.6 c1,0.2 1.7,0.8 1.7,1.7 v0.2 c0,1 -1,1.8 -2.5,1.8 h-4.7 z M76.5,8.8 v2.2 h1.8 c0.3,0 0.5,-0.2 0.5,-0.5 v-1.2 c0,-0.3 -0.2,-0.5 -0.5,-0.5 z M76.5,12.5 v2.2 h2 c0.3,0 0.5,-0.2 0.5,-0.5 v-1.2 c0,-0.3 -0.2,-0.5 -0.5,-0.5 z"
            />
            <text
              x="73"
              y="26"
              fontFamily="monospace"
              fontWeight="900"
              fontSize="4.5"
              letterSpacing="0.2"
            >
              VALK
            </text>
          </g>

          {/* Left Text / Markings */}
          <g fill={stickerColors.text}>
            {tapeText && tapeText !== "NEWS!" && tapeText !== "8W-157" ? (
              <text
                x="8"
                y="19.5"
                fontFamily="'obviously-narrow', 'fooregular', 'Montserrat', sans-serif"
                fontWeight="900"
                fontSize={tapeText.length > 12 ? "6.5" : tapeText.length > 9 ? "7.5" : "8.5"}
                letterSpacing="0.3"
              >
                {tapeText.toUpperCase()}
              </text>
            ) : (
              // Default 8W-157 path
              <path
                d="M8,11 h3.5 v5.5 h-3.5 z M9,12 h1.5 v1 h-1.5 z M9,14 h1.5 v1.5 h-1.5 z M13,11 l1,4.5 h1 l1,-4.5 h1.2 l-1.5,5.5 h-1.2 l-1,-3.5 l-1,3.5 h-1.2 l-1.5,-5.5 z M19.5,13.5 h2.5 v1.5 h-2.5 z M24,11.5 h1.5 v5 h-1.5 z M23,12.5 l1.5,-1.5 v1.5 z M27,11 h4.5 v1.8 h-3 v1.2 h2.5 c0.8,0 1.2,0.4 1.2,1.2 v1.8 c0,0.8 -0.4,1.2 -1.2,1.2 h-3.5 c-0.8,0 -1,-0.4 -1,-0.8 h1.2 c0,0.2 0.1,0.3 0.3,0.3 h2 c0.2,0 0.3,-0.1 0.3,-0.3 v-1.4 c0,-0.2 -0.1,-0.3 -0.3,-0.3 h-3.5 z M33,11 h5.5 l-3,5.5 h-1.5 l2.2,-4 h-3.2 z"
              />
            )}
          </g>

          {/* Center detail markings */}
          <g fill={stickerColors.text} opacity="0.6">
            <rect x="48" y="11" width="1.5" height="4" />
            <rect x="48" y="17" width="1.5" height="1.5" />
            <rect x="46" y="20" width="5.5" height="1" />
          </g>
        </svg>
      </div>
    )

    // Determine SVG fill colors for light and dark modes by parsing cardBgColor
    // We need actual hex values since CSS classes won't reliably propagate dark: variants to SVG fill
    const parseSvgFill = () => {
      // Extract light bg color (bg-xxx without dark: prefix)
      const lightBg = cardBgColor.split(" ").find(c => c.startsWith("bg-") && !c.startsWith("bg-transparent"))
      // Extract dark bg color (dark:bg-xxx)
      const darkBg = cardBgColor.split(" ").find(c => c.startsWith("dark:bg-"))

      const extractColor = (cls?: string) => {
        if (!cls) return null
        const stripped = cls.replace(/^dark:/, "").replace("bg-", "")
        if (stripped === "white") return "#ffffff"
        if (stripped === "black") return "#0d0d0d"
        // Match [#hexvalue] or [color]
        const match = stripped.match(/^\[(.+)\]$/)
        return match ? match[1] : null
      }

      return {
        light: extractColor(lightBg) ?? "#ffffff",
        dark: extractColor(darkBg) ?? (extractColor(lightBg) ?? "#ffffff"),
      }
    }

    const svgFills = parseSvgFill()

    // Use CSS custom property on parent so SVG can inherit it
    // The actual switching is done via a CSS variable that Tailwind's dark mode toggles
    const cardStyle = {
      ...inlineStyle,
      // These two CSS vars are used by the SVG via light-dark() — each card has its own values
      "--card-svg-fill": svgFills.light,
      "--card-svg-fill-dark": svgFills.dark,
    } as React.CSSProperties

    return (
      <CardContext.Provider value={{ variant }}>
        <Comp
          ref={ref}
          data-slot="card"
          data-variant="news"
          style={cardStyle}
          className={cn(
            "group/card relative flex flex-col cursor-pointer transition-[transform,box-shadow] duration-300 ease-out hover:scale-[1.025] hover:rotate-[var(--hover-rotate)] active:scale-[0.985] active:rotate-[var(--hover-rotate)]",
            className
          )}
          {...props}
        >
          {/* Top Paper Tear SVG — fill via CSS vars per card (dark mode aware) */}
          <svg
            aria-hidden="true"
            className="w-full mb-[-4px] z-10 relative pointer-events-none select-none"
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

          {/* Card Layout Content Area */}
          <div className={cn("flex flex-col h-full pt-0 px-8 pb-6 relative z-10", cardBgColor)}>
            {hasTape && adhesiveTape}
            {hasStaples && stapleLeft}
            {hasStaples && stapleRight}
            
            {/* The rest of the children */}
            <div className="flex flex-col gap-4 w-full h-full relative">
              {children}
            </div>
          </div>

          {/* Bottom Paper Tear SVG — fill via CSS var to support dark mode */}
          <svg
            aria-hidden="true"
            className="w-full mt-[-4px] z-10 relative pointer-events-none select-none"
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
              "w-full bg-white text-chaos-black p-3 pb-8 border-2 border-chaos-black shadow-solid-sm [transform:rotate(2deg)] hover:rotate-0 transition-transform duration-300 relative z-10",
              className
            )}
            {...props}
          >
            {src ? (
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

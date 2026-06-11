import { type VariantProps } from "class-variance-authority"
import type { buttonVariants } from "@/components/ui/button"

export type OfficialButtonTheme =
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

export type OfficialButtonColor =
  | "yellow"
  | "blue"
  | "green"
  | "purple"
  | "orange"
  | "red"
  | "white"
  | "black"

export interface ButtonSurfaceConfig {
  bgColor: string
  hoverBgColor: string
  outlineBorderColor?: string
}

export interface ButtonTextThemeConfig {
  textColor: string
  hoverTextColor: string
}

export const officialColorVarMap: Record<OfficialButtonColor, string> = {
  yellow: "var(--neon-yellow)",
  blue: "var(--ink-blue)",
  green: "var(--ink-green)",
  purple: "var(--ink-purple)",
  orange: "var(--ink-orange)",
  red: "var(--ink-red)",
  white: "#ffffff",
  black: "var(--chaos-black)",
}

export const officialVariantSurfacePresets: Record<
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

export const officialVariantFallbackTextPresets: Record<
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

export const officialButtonThemeTextPresets: Record<OfficialButtonTheme, ButtonTextThemeConfig> = {
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

export interface ResolvedButtonColors {
  bgColor: string
  textColor: string
  hoverBgColor: string
  hoverTextColor: string
  outlineBorderColor?: string
}

export function resolveButtonColors(params: {
  variant: NonNullable<VariantProps<typeof buttonVariants>["variant"]>
  color?: OfficialButtonColor
  hoverColor?: OfficialButtonColor
  textColor?: OfficialButtonColor
  textHoverColor?: OfficialButtonColor
  theme?: OfficialButtonTheme
}): ResolvedButtonColors | null {
  const { variant, color, hoverColor, textColor, textHoverColor, theme } = params
  const surfacePreset = officialVariantSurfacePresets[variant]
  if (!surfacePreset) return null

  const fallbackTextPreset = officialVariantFallbackTextPresets[variant]
  const themeTextPreset = theme ? officialButtonThemeTextPresets[theme] : null

  return {
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
}

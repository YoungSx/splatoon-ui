import { type VariantProps } from 'class-variance-authority'
import type { buttonVariants } from '@/components/ui/button'
import { splatoonColorVars } from '@/lib/splatoon-color-tokens'

export type ButtonThemePreset =
  | 'dark'
  | 'light'
  | 'yellow'
  | 'dark-yellow'
  | 'dark-red'
  | 'dark-purple'
  | 'dark-purpleOrange'
  | 'dark-green'
  | 'dark-blue'
  | 'light-blue'
  | 'light-green'
  | 'light-purple'
  | 'light-red'
  | 'black'

export type ButtonColorToken =
  | 'yellow'
  | 'blue'
  | 'green'
  | 'purple'
  | 'orange'
  | 'red'
  | 'white'
  | 'black'

export interface ButtonSurfaceConfig {
  bgColor: string
  hoverBgColor: string
  outlineBorderColor?: string
}

export interface ButtonTextThemeConfig {
  textColor: string
  hoverTextColor: string
}

export const buttonColorVarMap: Record<ButtonColorToken, string> = {
  yellow: splatoonColorVars.yellow,
  blue: splatoonColorVars.blue,
  green: splatoonColorVars.green,
  purple: splatoonColorVars.purple,
  orange: splatoonColorVars.orange,
  red: splatoonColorVars.red,
  white: splatoonColorVars.white,
  black: splatoonColorVars.black,
}

export const variantSurfacePresets: Record<
  NonNullable<VariantProps<typeof buttonVariants>['variant']>,
  ButtonSurfaceConfig | null
> = {
  yellow: {
    bgColor: buttonColorVarMap.yellow,
    hoverBgColor: buttonColorVarMap.blue,
  },
  blue: {
    bgColor: buttonColorVarMap.blue,
    hoverBgColor: buttonColorVarMap.yellow,
  },
  green: {
    bgColor: buttonColorVarMap.green,
    hoverBgColor: buttonColorVarMap.red,
  },
  orange: {
    bgColor: buttonColorVarMap.orange,
    hoverBgColor: buttonColorVarMap.purple,
  },
  purple: {
    bgColor: buttonColorVarMap.purple,
    hoverBgColor: buttonColorVarMap.blue,
  },
  destructive: {
    bgColor: buttonColorVarMap.red,
    hoverBgColor: buttonColorVarMap.green,
  },
  outline: {
    bgColor: buttonColorVarMap.white,
    hoverBgColor: buttonColorVarMap.white,
    outlineBorderColor: buttonColorVarMap.black,
  },
  ghost: null,
  arrow: null,
}

export const variantFallbackTextPresets: Record<
  NonNullable<VariantProps<typeof buttonVariants>['variant']>,
  ButtonTextThemeConfig | null
> = {
  yellow: {
    textColor: buttonColorVarMap.black,
    hoverTextColor: buttonColorVarMap.white,
  },
  blue: {
    textColor: buttonColorVarMap.white,
    hoverTextColor: buttonColorVarMap.black,
  },
  green: {
    textColor: buttonColorVarMap.black,
    hoverTextColor: buttonColorVarMap.black,
  },
  orange: {
    textColor: buttonColorVarMap.black,
    hoverTextColor: buttonColorVarMap.black,
  },
  purple: {
    textColor: buttonColorVarMap.black,
    hoverTextColor: buttonColorVarMap.white,
  },
  destructive: {
    textColor: buttonColorVarMap.black,
    hoverTextColor: buttonColorVarMap.white,
  },
  outline: {
    textColor: buttonColorVarMap.black,
    hoverTextColor: buttonColorVarMap.black,
  },
  ghost: null,
  arrow: null,
}

export const buttonThemeTextPresets: Record<ButtonThemePreset, ButtonTextThemeConfig> = {
  dark: {
    textColor: buttonColorVarMap.black,
    hoverTextColor: buttonColorVarMap.black,
  },
  light: {
    textColor: buttonColorVarMap.white,
    hoverTextColor: buttonColorVarMap.white,
  },
  yellow: {
    textColor: buttonColorVarMap.black,
    hoverTextColor: buttonColorVarMap.black,
  },
  'dark-yellow': {
    textColor: buttonColorVarMap.black,
    hoverTextColor: buttonColorVarMap.white,
  },
  'dark-red': {
    textColor: buttonColorVarMap.black,
    hoverTextColor: buttonColorVarMap.white,
  },
  'dark-purple': {
    textColor: buttonColorVarMap.black,
    hoverTextColor: buttonColorVarMap.white,
  },
  'dark-purpleOrange': {
    textColor: buttonColorVarMap.black,
    hoverTextColor: buttonColorVarMap.black,
  },
  'dark-green': {
    textColor: buttonColorVarMap.black,
    hoverTextColor: buttonColorVarMap.black,
  },
  'dark-blue': {
    textColor: buttonColorVarMap.black,
    hoverTextColor: buttonColorVarMap.black,
  },
  'light-blue': {
    textColor: buttonColorVarMap.white,
    hoverTextColor: buttonColorVarMap.black,
  },
  'light-green': {
    textColor: buttonColorVarMap.white,
    hoverTextColor: buttonColorVarMap.black,
  },
  'light-purple': {
    textColor: buttonColorVarMap.white,
    hoverTextColor: buttonColorVarMap.white,
  },
  'light-red': {
    textColor: buttonColorVarMap.white,
    hoverTextColor: buttonColorVarMap.white,
  },
  black: {
    textColor: buttonColorVarMap.black,
    hoverTextColor: buttonColorVarMap.black,
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
  variant: NonNullable<VariantProps<typeof buttonVariants>['variant']>
  color?: ButtonColorToken
  hoverColor?: ButtonColorToken
  textColor?: ButtonColorToken
  textHoverColor?: ButtonColorToken
  theme?: ButtonThemePreset
}): ResolvedButtonColors | null {
  const { variant, color, hoverColor, textColor, textHoverColor, theme } = params
  const surfacePreset = variantSurfacePresets[variant]
  if (!surfacePreset) return null

  const fallbackTextPreset = variantFallbackTextPresets[variant]
  const themeTextPreset = theme ? buttonThemeTextPresets[theme] : null

  return {
    bgColor: color ? buttonColorVarMap[color] : surfacePreset.bgColor,
    textColor: textColor
      ? buttonColorVarMap[textColor]
      : (themeTextPreset?.textColor ?? fallbackTextPreset?.textColor ?? buttonColorVarMap.black),
    hoverBgColor: hoverColor ? buttonColorVarMap[hoverColor] : surfacePreset.hoverBgColor,
    hoverTextColor: textHoverColor
      ? buttonColorVarMap[textHoverColor]
      : (themeTextPreset?.hoverTextColor ??
        fallbackTextPreset?.hoverTextColor ??
        buttonColorVarMap.white),
    outlineBorderColor: surfacePreset.outlineBorderColor,
  }
}

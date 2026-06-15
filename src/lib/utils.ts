import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Resolve CSS var() references to computed values (for Canvas/WebGL contexts). */
export function resolveCSSColor(color: string, el: HTMLElement): string {
  if (!color.startsWith("var(")) return color
  const prop = color.replace(/^var\(/, "").replace(/\)$/, "").trim()
  return getComputedStyle(el).getPropertyValue(prop).trim()
}

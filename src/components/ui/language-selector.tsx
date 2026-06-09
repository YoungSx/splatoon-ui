"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

type Lang = "en" | "jp"

const STORAGE_KEY = "splat-lang"

function LanguageSelector({ className, ...props }: React.ComponentProps<"button">) {
  const [lang, setLang] = React.useState<Lang>("en")
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Lang | null
    if (stored === "en" || stored === "jp") {
      setLang(stored)
    }
    setMounted(true)
  }, [])

  const toggle = React.useCallback(() => {
    setLang((prev) => {
      const next = prev === "en" ? "jp" : "en"
      localStorage.setItem(STORAGE_KEY, next)
      return next
    })
  }, [])

  // Prevent hydration mismatch by rendering a neutral state until mounted
  if (!mounted) {
    return (
      <button
        data-slot="language-selector"
        type="button"
        className={cn(
          "inline-flex h-8 items-center rounded-full px-3 text-xs font-alt font-black uppercase tracking-wider transition-colors",
          "bg-[#1a1a1a] text-white/50",
          className
        )}
        aria-label="Language selector"
        {...props}
      >
        EN
      </button>
    )
  }

  return (
    <button
      data-slot="language-selector"
      type="button"
      onClick={toggle}
      className={cn(
        "inline-flex h-8 items-center rounded-full px-3 text-xs font-alt font-black uppercase tracking-wider transition-colors cursor-pointer",
        lang === "en"
          ? "bg-[#eaff3d] text-[#0d0d0d]"
          : "bg-[#1a1a1a] text-white hover:bg-[#2a2a2a]",
        className
      )}
      aria-label={`Switch language, currently ${lang.toUpperCase()}`}
      {...props}
    >
      {lang === "en" ? "EN" : "JP"}
    </button>
  )
}

export { LanguageSelector }

"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

function usePortraitMobile() {
  const [isPortraitMobile, setIsPortraitMobile] = React.useState(false)

  React.useEffect(() => {
    const portraitQuery = window.matchMedia("(orientation: portrait)")
    const mobileQuery = window.matchMedia("(max-width: 767px)")

    const update = () => {
      setIsPortraitMobile(portraitQuery.matches && mobileQuery.matches)
    }

    update()

    portraitQuery.addEventListener("change", update)
    mobileQuery.addEventListener("change", update)

    return () => {
      portraitQuery.removeEventListener("change", update)
      mobileQuery.removeEventListener("change", update)
    }
  }, [])

  return isPortraitMobile
}

function OrientationPrompt({ className, ...props }: React.ComponentProps<"div">) {
  const isPortraitMobile = usePortraitMobile()

  if (!isPortraitMobile) return null

  return (
    <div
      data-slot="orientation-prompt"
      className={cn(
        "fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-[#0d0d0d] text-[#eaff3d]",
        className
      )}
      {...props}
    >
      <svg
        aria-hidden="true"
        width="80"
        height="80"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="animate-[spin_3s_linear_infinite]"
      >
        <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
        <line x1="12" y1="18" x2="12.01" y2="18" />
      </svg>

      <svg
        aria-hidden="true"
        width="48"
        height="48"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="1 4 1 10 7 10" />
        <polyline points="23 20 23 14 17 14" />
        <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" />
      </svg>

      <p className="font-alt text-lg font-black uppercase tracking-wider text-center px-8">
        Please rotate your device
      </p>
    </div>
  )
}

export { OrientationPrompt }

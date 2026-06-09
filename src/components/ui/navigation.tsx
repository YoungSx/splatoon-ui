'use client'

import * as React from 'react'

import { NavigationDialog } from '@/components/ui/navigation-dialog'
import { cn } from '@/lib/utils'
import styles from '@/components/ui/navigation.module.css'

const REDUCED_MOTION_KEY = 'splat-reduced-motion'

export function Navigation() {
  const [isCollapsed, setIsCollapsed] = React.useState(false)
  const [isReducedMotion, setIsReducedMotion] = React.useState(false)

  React.useEffect(() => {
    const handleScroll = () => {
      setIsCollapsed(window.scrollY > 40)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

    const syncReducedMotion = () => {
      const storedValue = localStorage.getItem(REDUCED_MOTION_KEY)
      const nextValue = storedValue === 'true' || (storedValue === null && mediaQuery.matches)
      setIsReducedMotion(nextValue)
      document.documentElement.classList.toggle('reduced-motion', nextValue)
    }

    syncReducedMotion()
    mediaQuery.addEventListener('change', syncReducedMotion)

    return () => {
      mediaQuery.removeEventListener('change', syncReducedMotion)
    }
  }, [])

  const toggleReducedMotion = React.useCallback(() => {
    setIsReducedMotion((previous) => {
      const nextValue = !previous
      localStorage.setItem(REDUCED_MOTION_KEY, String(nextValue))
      document.documentElement.classList.toggle('reduced-motion', nextValue)
      return nextValue
    })
  }, [])

  return (
    <>
      <a
        href="#main-content"
        className="font-alt focus:border-chaos-black focus:bg-primary focus:text-primary-foreground focus:shadow-solid-sm sr-only text-sm font-black tracking-wider uppercase transition-all focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[9999] focus:border-2 focus:px-4 focus:py-2"
      >
        Skip to main content
      </a>

      <header
        className={cn(
          'fixed top-0 right-0 left-0 z-[100] w-full bg-black text-white transition-all duration-300 select-none',
          isCollapsed ? 'h-[36px]' : 'h-[40px]'
        )}
      >
        <div
          aria-hidden="true"
          className={cn(
            'pointer-events-none absolute left-0 z-[1] overflow-hidden transition-all duration-300',
            isCollapsed ? 'top-[35px] h-[136px] w-[224px]' : 'top-[39px] h-[140px] w-[228px]'
          )}
        >
          <svg
            className="h-full w-full fill-black"
            viewBox="0 0 226 138"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M0,76.3515281 C4.72248572,74.7212575 12.0010363,76.6320718 14.737896,81.3919634 C21.8013631,93.6673091 6.44938808,110.867755 12.5995295,121.562705 C16.6019531,128.523306 25.585586,128.183536 27.7021324,118.018503 C29.2045998,110.799178 19.3107584,91.7564947 26.2962967,81.4200178 C29.659704,76.4450427 37.2562041,76.7661094 41.3926652,83.390058 C45.4761347,89.9329607 54.3600187,86.460453 52.5458361,77.966213 C51.8382425,74.6651488 53.1318607,71.6726826 55.3855619,69.8086255 C57.3368992,68.3996727 59.4440941,67.7232506 61.4795946,67.8884597 C61.5014146,67.8915768 61.5263519,67.8884597 61.5512891,67.8915768 C67.813648,68.4557814 73.340359,76.9469042 71.3516159,96.1984368 C70.064232,108.682632 63.7270614,115.194363 66.7039418,128.682281 C69.3472869,140.649028 80.0141821,141.487542 84.7460193,128.875544 C88.6237567,118.539067 84.0415428,105.372216 82.8102677,95.6030607 C79.7367555,71.1739382 97.8692304,66.2550719 108.822904,70.1889181 C118.931828,73.8204005 115.686873,82.592067 121.141889,86.1362692 C126.989667,89.9360778 135.212715,83.040937 127.020839,72.9663008 C121.603228,66.3080635 125.870609,55.0582609 134.433427,57.8169406 C146.95191,61.8505357 151.668162,54.0483035 150.879522,46.9661335 C150.165694,40.5666199 154.97546,33.8304538 167.578107,42.2249449 C179.105336,49.902491 186.134515,32.2531747 174.130361,27.4028858 C159.526503,21.5021165 156.746003,5.67633432 180.514289,6.26859325 C186.48987,6.41821656 205.036926,11.3464343 215.326646,9.69122646 C223.219275,8.41942833 226.314608,4.12399248 225.669357,0 L0,0 L0,76.3515281 Z"
            />
          </svg>
        </div>

        <div className="relative flex h-full w-full flex-col items-center justify-center">
          <button
            onClick={toggleReducedMotion}
            aria-pressed={isReducedMotion}
            className={styles.reducedMotion}
            title="Toggle Reduced Motion"
          >
            <span aria-hidden="true" className={styles.reducedMotionIcon}>
              {isReducedMotion ? <span className={styles.reducedMotionIconInner} /> : null}
            </span>
            <span className={styles.reducedMotionLabel}>Reduced motion</span>
          </button>
        </div>

        <div
          className={cn(
            'absolute left-0 z-10 transition-all duration-300',
            isCollapsed ? 'top-[35px]' : 'top-[39px]'
          )}
        >
          <NavigationDialog isReducedMotion={isReducedMotion} />
        </div>
      </header>
    </>
  )
}

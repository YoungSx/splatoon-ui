import * as React from 'react'

const STORAGE_KEY = 'splat-reduced-motion'

/**
 * Unified reduced-motion detection.
 *
 * Priority: localStorage override > media query.
 * Syncs the `.reduced-motion` class on <html> as a side effect so CSS
 * can key off it without JS coupling.
 */
export function useReducedMotion(): [boolean, () => void] {
  const mediaQuery = React.useMemo(
    () => typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)') : null,
    [],
  )

  const [value, setValue] = React.useState(false)

  React.useEffect(() => {
    if (!mediaQuery) return

    const stored = localStorage.getItem(STORAGE_KEY)
    const initial = stored === 'true' || (stored === null && mediaQuery.matches)
    setValue(initial)
    document.documentElement.classList.toggle('reduced-motion', initial)

    const onChange = () => {
      const stored = localStorage.getItem(STORAGE_KEY)
      const next = stored === 'true' || (stored === null && mediaQuery.matches)
      setValue(next)
      document.documentElement.classList.toggle('reduced-motion', next)
    }

    mediaQuery.addEventListener('change', onChange)
    return () => mediaQuery.removeEventListener('change', onChange)
  }, [mediaQuery])

  const toggle = React.useCallback(() => {
    setValue((prev) => {
      const next = !prev
      localStorage.setItem(STORAGE_KEY, String(next))
      document.documentElement.classList.toggle('reduced-motion', next)
      return next
    })
  }, [])

  return [value, toggle]
}

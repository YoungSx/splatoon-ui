import * as React from 'react'

const STORAGE_KEY = 'splat-reduced-motion'
const CHANGE_EVENT = 'splat-reduced-motion-change'

function getReducedMotionSnapshot() {
  if (typeof window === 'undefined') return false

  const stored = localStorage.getItem(STORAGE_KEY)
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  return stored === 'true' || (stored === null && mediaQuery.matches)
}

function subscribeToReducedMotion(onStoreChange: () => void) {
  if (typeof window === 'undefined') return () => {}

  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  mediaQuery.addEventListener('change', onStoreChange)
  window.addEventListener('storage', onStoreChange)
  window.addEventListener(CHANGE_EVENT, onStoreChange)

  return () => {
    mediaQuery.removeEventListener('change', onStoreChange)
    window.removeEventListener('storage', onStoreChange)
    window.removeEventListener(CHANGE_EVENT, onStoreChange)
  }
}

/**
 * Unified reduced-motion detection.
 *
 * Priority: localStorage override > media query.
 * Syncs the `.reduced-motion` class on <html> as a side effect so CSS
 * can key off it without JS coupling.
 */
export function useReducedMotion(): [boolean, () => void] {
  const value = React.useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionSnapshot,
    () => false
  )

  React.useEffect(() => {
    document.documentElement.classList.toggle('reduced-motion', value)
  }, [value])

  const toggle = React.useCallback(() => {
    const next = !getReducedMotionSnapshot()
    localStorage.setItem(STORAGE_KEY, String(next))
    document.documentElement.classList.toggle('reduced-motion', next)
    window.dispatchEvent(new Event(CHANGE_EVENT))
  }, [])

  return [value, toggle]
}

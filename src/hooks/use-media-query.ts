import { useSyncExternalStore } from 'react'

function subscribe(query: string, callback: () => void) {
  const mql = matchMedia(query)
  mql.addEventListener('change', callback)
  return () => mql.removeEventListener('change', callback)
}

export function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (callback) => subscribe(query, callback),
    () => matchMedia(query).matches,
    () => false
  )
}

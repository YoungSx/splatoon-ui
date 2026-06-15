'use client'

import * as React from 'react'

function getCurrentSelectedNavKey(
  navLinks: Array<{ selectedKey?: string }>,
  defaultKey: string,
  rootKey?: string,
) {
  if (typeof window === 'undefined') {
    return defaultKey
  }

  const currentPath = window.location.pathname.toLowerCase()
  const currentHash = window.location.hash.replace(/^#/, '').toLowerCase()
  const matchedLink = navLinks.find((link) => {
    if (!link.selectedKey) return false
    if (currentHash) {
      return currentHash === link.selectedKey
    }
    if (rootKey && link.selectedKey === rootKey) {
      return currentPath === '/' || currentPath === ''
    }
    return currentPath.includes(link.selectedKey)
  })

  return matchedLink?.selectedKey ?? defaultKey
}

export function useSyncSelectedNavKey(
  navLinks: Array<{ selectedKey?: string }>,
  options?: { defaultKey?: string; rootKey?: string },
) {
  const defaultKey = options?.defaultKey ?? 'home'
  const rootKey = options?.rootKey

  const getNavKey = React.useCallback(
    () => getCurrentSelectedNavKey(navLinks, defaultKey, rootKey),
    [navLinks, defaultKey, rootKey],
  )

  const [selectedNavKey, setSelectedNavKey] = React.useState(getNavKey)

  React.useEffect(() => {
    const syncSelectedNavKey = () => {
      setSelectedNavKey(getCurrentSelectedNavKey(navLinks, defaultKey, rootKey))
    }

    window.addEventListener('hashchange', syncSelectedNavKey)
    window.addEventListener('popstate', syncSelectedNavKey)

    return () => {
      window.removeEventListener('hashchange', syncSelectedNavKey)
      window.removeEventListener('popstate', syncSelectedNavKey)
    }
  }, [navLinks, defaultKey, rootKey])

  return selectedNavKey
}

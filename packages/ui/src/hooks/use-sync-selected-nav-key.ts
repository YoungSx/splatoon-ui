'use client'

import * as React from 'react'

function getCurrentSelectedNavKey(
  navLinks: Array<{ selectedKey?: string }>,
  defaultKey: string,
  rootKey?: string
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
  options?: { defaultKey?: string; rootKey?: string }
) {
  const defaultKey = options?.defaultKey ?? 'home'
  const rootKey = options?.rootKey

  const getSnapshot = React.useCallback(
    () => getCurrentSelectedNavKey(navLinks, defaultKey, rootKey),
    [navLinks, defaultKey, rootKey]
  )

  const getServerSnapshot = React.useCallback(() => defaultKey, [defaultKey])

  const subscribe = React.useCallback((onStoreChange: () => void) => {
    window.addEventListener('hashchange', onStoreChange)
    window.addEventListener('popstate', onStoreChange)

    return () => {
      window.removeEventListener('hashchange', onStoreChange)
      window.removeEventListener('popstate', onStoreChange)
    }
  }, [])

  return React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}

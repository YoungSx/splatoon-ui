'use client'

import * as React from 'react'
import { navLinks } from './navigation-config'

function getCurrentSelectedNavKey() {
  if (typeof window === 'undefined') {
    return 'home'
  }

  const currentPath = window.location.pathname.toLowerCase()
  const currentHash = window.location.hash.replace(/^#/, '').toLowerCase()
  const matchedLink = navLinks.find((link) => {
    if (!link.selectedKey) return false
    if (currentHash) {
      return currentHash === link.selectedKey
    }
    if (link.selectedKey === 'home') {
      return currentPath === '/' || currentPath === ''
    }
    return currentPath.includes(link.selectedKey)
  })

  return matchedLink?.selectedKey ?? 'home'
}

export function useSyncSelectedNavKey() {
  const [selectedNavKey, setSelectedNavKey] = React.useState(getCurrentSelectedNavKey)

  React.useEffect(() => {
    const syncSelectedNavKey = () => {
      setSelectedNavKey(getCurrentSelectedNavKey())
    }

    window.addEventListener('hashchange', syncSelectedNavKey)
    window.addEventListener('popstate', syncSelectedNavKey)

    return () => {
      window.removeEventListener('hashchange', syncSelectedNavKey)
      window.removeEventListener('popstate', syncSelectedNavKey)
    }
  }, [])

  return selectedNavKey
}

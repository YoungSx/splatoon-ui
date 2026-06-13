import * as React from 'react'

export interface UseInViewOptions {
  rootMargin?: string
  once?: boolean
}

/**
 * Observe an element's intersection with the viewport.
 * Returns `[isInView, ref]` — attach `ref` to the target element.
 */
export function useInView<T extends HTMLElement = HTMLElement>({
  rootMargin = '0px',
  once = true,
}: UseInViewOptions = {}): [boolean, React.RefObject<T | null>] {
  const ref = React.useRef<T>(null)
  const [isInView, setIsInView] = React.useState(false)

  React.useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          if (once) observer.unobserve(el)
        } else if (!once) {
          setIsInView(false)
        }
      },
      { rootMargin },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [rootMargin, once])

  return [isInView, ref]
}

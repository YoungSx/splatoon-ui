export function observeElementResize(element: Element, callback: () => void) {
  let frame = 0

  const schedule = () => {
    if (frame) return
    frame = window.requestAnimationFrame(() => {
      frame = 0
      callback()
    })
  }

  schedule()

  let observer: ResizeObserver | null = null
  if (typeof ResizeObserver !== 'undefined') {
    observer = new ResizeObserver(schedule)
    observer.observe(element)
  } else {
    window.addEventListener('resize', schedule)
  }

  return () => {
    observer?.disconnect()
    window.removeEventListener('resize', schedule)
    if (frame) {
      window.cancelAnimationFrame(frame)
    }
  }
}

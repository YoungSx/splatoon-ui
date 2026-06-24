type ClientPointEvent = Pick<MouseEvent | PointerEvent, 'clientX' | 'clientY'>

export function getLocalPoint(element: HTMLElement, event: ClientPointEvent) {
  const rect = element.getBoundingClientRect()
  const scaleX = rect.width > 0 ? element.clientWidth / rect.width : 1
  const scaleY = rect.height > 0 ? element.clientHeight / rect.height : 1

  return {
    x: (event.clientX - rect.left) * scaleX,
    y: (event.clientY - rect.top) * scaleY,
  }
}

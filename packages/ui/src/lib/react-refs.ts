import * as React from 'react'

export function assignRef<T>(ref: React.Ref<T> | undefined, value: T | null) {
  if (!ref) return

  if (typeof ref === 'function') {
    ref(value)
    return
  }

  ref.current = value
}

export function composeRefs<T>(...refs: Array<React.Ref<T> | undefined>) {
  return (value: T | null) => {
    refs.forEach((ref) => assignRef(ref, value))
  }
}

import type * as React from 'react'

export type PrimitiveRenderProps<TElement extends HTMLElement = HTMLElement> =
  React.HTMLAttributes<TElement> & {
    ref?: React.Ref<TElement>
  }

export type PrimitiveRender<
  TElement extends HTMLElement = HTMLElement,
  TState extends object = object,
> =
  | React.ReactElement
  | ((props: PrimitiveRenderProps<TElement>, state: TState) => React.ReactElement)

export interface PrimitiveChangeDetails {
  reason: string
  event: Event
  cancel: () => void
  allowPropagation: () => void
  readonly isCanceled: boolean
  readonly isPropagationAllowed: boolean
  trigger: Element | undefined
}

export interface PrimitiveOpenChangeDetails extends PrimitiveChangeDetails {
  preventUnmountOnClose?: () => void
}

export type PrimitivePopupSide = 'top' | 'right' | 'bottom' | 'left' | 'inline-end' | 'inline-start'
export type PrimitivePopupAlign = 'start' | 'center' | 'end'
export type PrimitivePopupOffset =
  | number
  | ((data: {
      side: PrimitivePopupSide
      align: PrimitivePopupAlign
      anchor: {
        width: number
        height: number
      }
      positioner: {
        width: number
        height: number
      }
    }) => number)
export type PrimitiveInteractionType = '' | 'mouse' | 'touch' | 'pen' | 'keyboard'
export type PrimitiveFocusTarget =
  | boolean
  | React.RefObject<HTMLElement | null>
  | ((interactionType: PrimitiveInteractionType) => boolean | HTMLElement | null | void)
export type PrimitivePortalContainer =
  | HTMLElement
  | ShadowRoot
  | null
  | React.RefObject<HTMLElement | ShadowRoot | null>

export interface PrimitiveButtonRenderState {
  disabled: boolean
}

export interface PrimitiveCheckedRenderState {
  checked: boolean
  disabled: boolean
  readOnly: boolean
  required: boolean
}

export interface PrimitiveOpenRenderState {
  open: boolean
  disabled?: boolean
}

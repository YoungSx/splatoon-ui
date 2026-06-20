"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"

type ButtonProps = React.ComponentProps<typeof Button>

type TriggerButtonOwnProps = Pick<
  ButtonProps,
  | "children"
  | "variant"
  | "size"
  | "theme"
  | "hasChevron"
  | "color"
  | "hoverColor"
  | "textColor"
  | "textHoverColor"
>

type TriggerButtonRenderProps = Record<string, unknown> & {
  ref?: React.Ref<HTMLButtonElement>
}

export function assignRef<T>(ref: React.Ref<T> | undefined, value: T | null) {
  if (!ref) return
  if (typeof ref === "function") {
    ref(value)
    return
  }
  ref.current = value
}

export function mergeRefs<T>(...refs: Array<React.Ref<T> | undefined>) {
  return (value: T | null) => {
    refs.forEach((ref) => assignRef(ref, value))
  }
}

/**
 * Factory: creates a TriggerButton component that renders a Base UI trigger
 * with a Button as its `render` output.
 *
 * Usage:
 *   const DialogTriggerButton = createTriggerButton(DialogPrimitive.Trigger, "dialog-trigger")
 */
export function createTriggerButton<TTrigger extends React.ComponentType<Record<string, unknown>>>(
  Trigger: TTrigger,
  dataSlot: string,
  options?: {
    useRegisterRef?: () => React.Ref<HTMLButtonElement> | undefined
  }
) {
  type TriggerProps = React.ComponentProps<TTrigger>
  type Props = Omit<TriggerProps, "render" | "children"> & TriggerButtonOwnProps

  function TriggerButton({
    ref,
    children,
    variant = "yellow",
    size = "default",
    theme,
    hasChevron = true,
    color,
    hoverColor,
    textColor,
    textHoverColor,
    ...props
  }: Props & { ref?: React.Ref<HTMLButtonElement> }) {
    const TriggerComp = Trigger as React.ComponentType<Record<string, unknown>>
    const registerRef = options?.useRegisterRef?.()

    return (
      <TriggerComp
        data-slot={dataSlot}
        render={(triggerProps: Record<string, unknown>) => {
          const { ref: triggerRef, ...buttonProps } = triggerProps as TriggerButtonRenderProps

          return (
            <Button
              {...buttonProps}
              ref={mergeRefs(registerRef, triggerRef, ref)}
              variant={variant}
              size={size}
              theme={theme}
              hasChevron={hasChevron}
              color={color}
              hoverColor={hoverColor}
              textColor={textColor}
              textHoverColor={textHoverColor}
            >
              {children}
            </Button>
          )
        }}
        {...(props as Record<string, unknown>)}
      />
    )
  }

  return TriggerButton
}

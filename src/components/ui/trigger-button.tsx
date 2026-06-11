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

/**
 * Factory: creates a TriggerButton component that renders a Base UI trigger
 * with a Button as its `render` output.
 *
 * Usage:
 *   const DialogTriggerButton = createTriggerButton(DialogPrimitive.Trigger, "dialog-trigger")
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createTriggerButton<TTrigger extends React.ComponentType<any>>(
  Trigger: TTrigger,
  dataSlot: string
) {
  type TriggerProps = React.ComponentProps<TTrigger>
  type Props = Omit<TriggerProps, "render" | "children"> & TriggerButtonOwnProps

  function TriggerButton({
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
  }: Props) {
    const TriggerComp = Trigger as React.ComponentType<Record<string, unknown>>

    return (
      <TriggerComp
        data-slot={dataSlot}
        render={(triggerProps: Record<string, unknown>) => {
          const { ref, ...buttonProps } = triggerProps as typeof triggerProps & {
            ref?: React.Ref<HTMLButtonElement>
          }

          return (
            <Button
              {...buttonProps}
              ref={ref}
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

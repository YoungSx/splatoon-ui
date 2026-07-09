'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { composeRefs } from '@/lib/react-refs'

type ButtonProps = React.ComponentProps<typeof Button>

type TriggerButtonOwnProps = Pick<
  ButtonProps,
  | 'children'
  | 'variant'
  | 'size'
  | 'theme'
  | 'hasChevron'
  | 'color'
  | 'hoverColor'
  | 'textColor'
  | 'textHoverColor'
>

type TriggerButtonRenderProps = React.HTMLAttributes<HTMLButtonElement> & {
  ref?: React.Ref<HTMLButtonElement>
}

type TriggerRenderProp = {
  render?: unknown
  children?: React.ReactNode
}

type TriggerButtonProps<TTrigger extends React.ElementType> = Omit<
  React.ComponentProps<TTrigger>,
  'render' | 'children'
> &
  TriggerButtonOwnProps & {
    ref?: React.Ref<HTMLButtonElement>
  }

/**
 * Factory: creates a TriggerButton component that renders a Base UI trigger
 * with a Button as its `render` output.
 *
 * Usage:
 *   const DialogTriggerButton = createTriggerButton(DialogPrimitive.Trigger, "dialog-trigger")
 */
export function createTriggerButton<TTrigger extends React.ElementType>(
  Trigger: TTrigger,
  dataSlot: string,
  options?: {
    useRegisterRef?: () => React.Ref<HTMLButtonElement> | undefined
  }
) {
  type Props = TriggerButtonProps<TTrigger>

  function TriggerButton({
    ref,
    children,
    variant = 'yellow',
    size = 'default',
    theme,
    hasChevron = true,
    color,
    hoverColor,
    textColor,
    textHoverColor,
    ...props
  }: Props) {
    const TriggerComp = Trigger as React.ElementType<TriggerRenderProp>
    const registerRef = options?.useRegisterRef?.()

    return (
      <TriggerComp
        data-slot={dataSlot}
        render={(triggerProps: TriggerButtonRenderProps) => {
          const { ref: triggerRef, ...buttonProps } = triggerProps

          return (
            <Button
              {...buttonProps}
              ref={composeRefs(registerRef, triggerRef, ref)}
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
        {...props}
      />
    )
  }

  return TriggerButton
}

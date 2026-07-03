'use client'

import { Button as ButtonPrimitive } from '@base-ui/react/button'
import { cva } from 'class-variance-authority'
import * as React from 'react'

import { useDripAnimation } from '@/hooks/use-drip-animation'
import {
  type ButtonColorToken,
  type ButtonVariant,
  type ButtonThemePreset,
  resolveButtonColors,
} from '@/lib/resolve-button-colors'
import { cn } from '@/lib/utils'
import styles from './button.module.css'

const buttonVariants = cva(
  'group/button relative inline-flex shrink-0 items-center justify-center cursor-pointer select-none overflow-hidden rounded-[var(--button-radius,8px)] font-alt font-black tracking-wider transition-[transform,box-shadow] ease-[var(--ease-back-out)] duration-300 outline-none disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        yellow: '',
        blue: '',
        green: '',
        orange: '',
        purple: '',
        destructive: '',
        outline: '',
        ghost:
          'bg-transparent text-current shadow-none hover:bg-current/10 active:bg-current/20 hover:rotate-0 hover:scale-100 active:scale-95 active:translate-x-0 active:translate-y-0 active:shadow-none',
        arrow: '',
      },
      size: {
        default: 'text-[22px] pt-3 pb-5 px-11 leading-[24px]',
        sm: 'text-base pt-2 pb-3.5 px-6 leading-[20px]',
        lg: 'text-[26px] pt-4 pb-6.5 px-14 leading-[28px]',
        icon: 'size-11 p-0 leading-none',
        'icon-sm': 'size-8 p-0 leading-none',
        'icon-lg': 'size-14 p-0 leading-none',
      },
    },
    defaultVariants: {
      variant: 'yellow',
      size: 'default',
    },
  }
)

export type ButtonSize = 'default' | 'sm' | 'lg' | 'icon' | 'icon-sm' | 'icon-lg'
export type { ButtonColorToken, ButtonThemePreset, ButtonVariant }

const arrowButtonClassName =
  'group/button relative inline-block shrink-0 cursor-pointer select-none bg-transparent p-0 font-alt text-[26px] font-medium normal-case tracking-normal leading-[26px] text-current transition-colors duration-200 outline-none disabled:pointer-events-none disabled:opacity-50 hover:text-[var(--color-blue)] active:text-current'

const solidButtonEffectsClassName =
  'active:scale-[0.98] active:translate-x-[1px] active:translate-y-[1px]'

const buttonInlineContentClassName =
  'relative z-10 flex items-center justify-center whitespace-nowrap'

const buttonIconClassName =
  'mr-1.5 inline-flex shrink-0 items-center justify-center leading-none [&_svg]:block [&_svg]:shrink-0'

export interface ButtonProps extends React.ComponentPropsWithoutRef<typeof ButtonPrimitive> {
  variant?: ButtonVariant
  size?: ButtonSize
  hasChevron?: boolean
  leftIcon?: React.ReactNode
  color?: ButtonColorToken
  hoverColor?: ButtonColorToken
  textColor?: ButtonColorToken
  textHoverColor?: ButtonColorToken
  theme?: ButtonThemePreset
}

type ButtonMouseEnterEvent = Parameters<NonNullable<ButtonProps['onMouseEnter']>>[0]
type ButtonMouseLeaveEvent = Parameters<NonNullable<ButtonProps['onMouseLeave']>>[0]
type ButtonClickEvent = Parameters<NonNullable<ButtonProps['onClick']>>[0]

function Button({
  ref,
  className,
  variant = 'yellow',
  size = 'default',
  children,
  hasChevron = true,
  leftIcon,
  onClick,
  onMouseEnter,
  onMouseLeave,
  color,
  hoverColor,
  textColor,
  textHoverColor,
  theme,
  render,
  nativeButton,
  ...props
}: ButtonProps & { ref?: React.Ref<HTMLElement> }) {
  const localRef = React.useRef<HTMLElement>(null)
  const setButtonRef = React.useCallback(
    (node: HTMLElement | null) => {
      localRef.current = node

      if (typeof ref === 'function') {
        ref(node)
        return
      }

      if (ref) {
        ;(ref as React.MutableRefObject<HTMLElement | null>).current = node
      }
    },
    [ref]
  )

  const dripSizeClasses = {
    default: { padding: 'pt-3 pb-5 px-11', leading: 'leading-[24px]' },
    sm: { padding: 'pt-2 pb-3.5 px-6', leading: 'leading-[20px]' },
    lg: { padding: 'pt-4 pb-6.5 px-14', leading: 'leading-[28px]' },
  } as const
  const sizeDrip = dripSizeClasses[size as keyof typeof dripSizeClasses] ?? dripSizeClasses.default

  const hasDrip = variant !== 'ghost' && variant !== 'arrow'
  const { dripAnimationState, dripStyle, startDripEnter, startDripLeave, handleDripAnimationEnd } =
    useDripAnimation(localRef, hasDrip)

  const variantKey = (variant ?? 'yellow') as ButtonVariant

  const resolvedColorConfig = resolveButtonColors({
    variant: variantKey,
    color,
    hoverColor,
    textColor,
    textHoverColor,
    theme,
  })

  const colorStyle: Record<string, string> | undefined = resolvedColorConfig
    ? {
        '--bg-color': resolvedColorConfig.bgColor,
        '--text-color': resolvedColorConfig.textColor,
        '--hover-bg-color': resolvedColorConfig.hoverBgColor,
        '--hover-text-color': resolvedColorConfig.hoverTextColor,
        ...(resolvedColorConfig.outlineBorderColor
          ? { '--outline-border-color': resolvedColorConfig.outlineBorderColor }
          : {}),
        ...(variant === 'ghost' ? { boxShadow: 'none' } : {}),
      }
    : variant === 'ghost'
      ? { boxShadow: 'none' }
      : undefined

  const splatChevron = (
    <svg
      aria-hidden="true"
      className={cn(
        'shrink-0 overflow-visible',
        variant === 'arrow'
          ? 'ml-0 inline h-[16px] w-[8px] overflow-hidden align-baseline'
          : 'ml-1.5 h-[13px] w-[8px] self-end overflow-hidden'
      )}
      viewBox="0 0 7 12"
    >
      <path
        d="M0,11.23.12,11l.32-.47.3-.12-.16-.35.18-.49.4-.21L1.09,9l.23-.35.26-.21.32-.21L2,7.84l.2-.38v-.3l.47-.47-.05-.38L3,6.08l-.19-.77,0-.26-.26-.3-.1-.31-.42-.25,0-.38-.32-.23L1.5,3.25l0-.32-.05-.26L1,2.37.94,2,.66,1.76.51,1.41.23,1.08.3.66.14.41,0,.13l.7,0L1,.08l.14.14L1.68,0,2,.12,2.21,0l.66.21.26,0h.42l.33.14L4.3.69l0,.38.29.27.14.4L5,2l.07.37,0,.14L5.48,3l.07.09.42.3.1.33L6,4.07l.24.33.42.25,0,.35.1.4.16.47-.11.42-.21.33L6.41,7,6.2,7.2,6,7.6,6,7.93l-.28.31-.3.3,0,.19-.16.37L5,9.43l-.18.14-.23.33-.21.38.09.42-.3.33,0,.18-.66.24-.39.1-.52.09,0-.09-.5-.09-.46.07-.26.09-.4,0-.39-.07-.45.17L0,11.23Z"
        stroke="none"
        fill="currentColor"
      />
    </svg>
  )

  const isTextChildren = typeof children === 'string' || typeof children === 'number'
  const renderedLeftIcon = leftIcon ? <span className={buttonIconClassName}>{leftIcon}</span> : null
  const isAnchorRender =
    React.isValidElement(render) && typeof render.type === 'string' && render.type === 'a'
  const shouldRenderNativeButton = nativeButton ?? !isAnchorRender
  const renderWithLinkRole =
    isAnchorRender && (render.props as React.AnchorHTMLAttributes<HTMLAnchorElement>).role == null
      ? React.cloneElement(
          render as React.ReactElement<React.AnchorHTMLAttributes<HTMLAnchorElement>>,
          {
            role: 'link',
          }
        )
      : render

  return (
    <ButtonPrimitive
      ref={setButtonRef}
      render={renderWithLinkRole}
      nativeButton={shouldRenderNativeButton}
      data-slot="button"
      data-drip-state={hasDrip ? dripAnimationState : undefined}
      style={
        dripStyle
          ? ({ ...colorStyle, ...dripStyle } as React.CSSProperties)
          : (colorStyle as React.CSSProperties)
      }
      className={cn(
        variant === 'arrow' ? arrowButtonClassName : buttonVariants({ variant, size }),
        hasDrip ? styles.dripRoot : undefined,
        variant !== 'arrow' && variant !== 'ghost' ? solidButtonEffectsClassName : undefined,
        variant !== 'arrow' && hasDrip && isTextChildren ? 'p-0' : undefined,
        className
      )}
      onClick={(event) => {
        if (hasDrip) {
          startDripEnter()
        }
        onClick?.(event as ButtonClickEvent)
      }}
      onMouseEnter={(event: ButtonMouseEnterEvent) => {
        if (hasDrip) {
          startDripEnter()
        }
        onMouseEnter?.(event)
      }}
      onMouseLeave={(event: ButtonMouseLeaveEvent) => {
        if (hasDrip) {
          startDripLeave()
        }
        onMouseLeave?.(event)
      }}
      {...props}
    >
      {hasDrip ? (
        isTextChildren ? (
          <>
            <span
              aria-hidden="true"
              onAnimationEnd={handleDripAnimationEnd}
              className={cn(
                'absolute top-0 left-0 z-20 flex h-full w-full items-center justify-center rounded-[var(--button-radius,8px)] text-[var(--hover-text-color)]',
                sizeDrip.padding,
                styles.dripHoverContent
              )}
            >
              <span aria-hidden="true" className={styles.dripFill} />
              <span aria-hidden="true" className={styles.dripFrame} />
              <span className={cn(buttonInlineContentClassName, sizeDrip.leading)}>
                {renderedLeftIcon}
                {children}
                {hasChevron && size !== 'icon' && splatChevron}
              </span>
            </span>

            <span
              className={cn(
                'flex h-full w-full items-center justify-center bg-[var(--bg-color)] text-[var(--text-color)]',
                sizeDrip.padding
              )}
            >
              <span className={cn(buttonInlineContentClassName, sizeDrip.leading)}>
                {renderedLeftIcon}
                {children}
                {hasChevron && size !== 'icon' && splatChevron}
              </span>
            </span>
          </>
        ) : (
          <>
            <span
              aria-hidden="true"
              className="absolute top-0 left-0 z-10 h-full w-full bg-[var(--bg-color)]"
            />

            <span
              aria-hidden="true"
              onAnimationEnd={handleDripAnimationEnd}
              className={cn(
                'absolute top-0 left-0 z-20 h-full w-full rounded-[var(--button-radius,8px)]',
                styles.dripHoverContent
              )}
            >
              <span aria-hidden="true" className={styles.dripFill} />
              <span aria-hidden="true" className={styles.dripFrame} />
            </span>

            <span className="relative z-30 flex h-full w-full items-center justify-center text-[var(--text-color)] transition-colors duration-200 group-hover/button:text-[var(--hover-text-color)]">
              <span className={buttonInlineContentClassName}>
                {renderedLeftIcon}
                {children}
                {hasChevron && size !== 'icon' && splatChevron}
              </span>
            </span>
          </>
        )
      ) : (
        <span
          className={cn(
            buttonInlineContentClassName,
            variant === 'arrow'
              ? 'inline-block leading-[26px]'
              : 'inline-flex items-center justify-center'
          )}
        >
          {renderedLeftIcon}
          {children}
          {hasChevron && size !== 'icon' && splatChevron}
        </span>
      )}
    </ButtonPrimitive>
  )
}

export { Button }

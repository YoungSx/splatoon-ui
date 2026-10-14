'use client'

import * as React from 'react'
import { Eye, EyeOff, X } from 'lucide-react'

import { composeRefs } from '@/lib/react-refs'
import { splatoonColorVars } from '@/lib/splatoon-color-tokens'
import { cn } from '@/lib/utils'
import styles from './input.module.css'

export type InputVariant = 'field-cut'
export type InputSize = 'sm' | 'default' | 'lg'
export type InputColor = 'yellow' | 'blue' | 'green' | 'purple' | 'orange' | 'red'

export interface InputProps extends Omit<React.ComponentProps<'input'>, 'size' | 'ref'> {
  ref?: React.Ref<HTMLInputElement>
  /** Visual variant style. Defaults to 'field-cut' matching Splatoon 3 Lobby Terminal. */
  variant?: InputVariant
  /** Sizing tier. Defaults to 'default'. */
  size?: InputSize
  /** Color theme for focus ring & accent highlights. Defaults to 'yellow'. */
  focusColor?: InputColor
  /** Left slot for leading icon or label */
  prefixIcon?: React.ReactNode
  /** Right slot for trailing icon */
  suffixIcon?: React.ReactNode
  /** Whether to show a clear button when input has value. Defaults to false. */
  clearable?: boolean
  /** Callback fired when clear button is clicked. */
  onClear?: () => void
  /** For type="password", automatically toggle password visibility with eye icon. */
  showPasswordToggle?: boolean
  /** Whether the field is in an invalid/error state. */
  invalid?: boolean
  /** Error message displayed below input in an ink alert label. */
  errorMessage?: React.ReactNode
  /** Helper text displayed below input. */
  helperText?: React.ReactNode
  /** Container wrapper className if wrapper exists */
  containerClassName?: string
}

function Input({
  ref,
  className,
  containerClassName,
  variant = 'field-cut',
  size = 'default',
  focusColor = 'yellow',
  prefixIcon,
  suffixIcon,
  clearable = false,
  onClear,
  showPasswordToggle = false,
  invalid = false,
  errorMessage,
  helperText,
  type = 'text',
  disabled,
  readOnly,
  id,
  value,
  defaultValue,
  onChange,
  style,
  ...props
}: InputProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const combinedRef = React.useMemo(() => composeRefs(inputRef, ref), [ref])

  // Track value for controlled / uncontrolled clearable button visibility
  const isControlled = value !== undefined
  const [internalValue, setInternalValue] = React.useState<string>(() =>
    defaultValue !== undefined ? String(defaultValue) : ''
  )
  const currentValue = isControlled ? String(value ?? '') : internalValue
  const hasValue = currentValue.length > 0

  // Password visibility toggle
  const isPassword = type === 'password'
  const [passwordVisible, setPasswordVisible] = React.useState(false)
  const resolvedType =
    isPassword && showPasswordToggle ? (passwordVisible ? 'text' : 'password') : type

  const handleClear = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()
      e.stopPropagation()

      if (!inputRef.current) return

      const nativeSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        'value'
      )?.set

      if (nativeSetter) {
        nativeSetter.call(inputRef.current, '')
      } else {
        inputRef.current.value = ''
      }

      const inputEvent = new Event('input', { bubbles: true })
      inputRef.current.dispatchEvent(inputEvent)

      const changeEvent = new Event('change', { bubbles: true })
      inputRef.current.dispatchEvent(changeEvent)

      if (!isControlled) {
        setInternalValue('')
      }

      onClear?.()
      inputRef.current.focus()
    },
    [isControlled, onClear]
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isControlled) {
      setInternalValue(e.target.value)
    }
    onChange?.(e)
  }

  // Accessible IDs
  const generatedId = React.useId()
  const inputId = id ?? generatedId
  const errorId = `${inputId}-error`
  const helperId = `${inputId}-helper`
  const describedBy =
    [
      invalid && errorMessage ? errorId : null,
      helperText ? helperId : null,
      props['aria-describedby'],
    ]
      .filter(Boolean)
      .join(' ') || undefined

  // Variant Classes (Authentic Splatoon 3 Lobby Terminal Pool Keyword input)
  const variantClasses: Record<InputVariant, string> = {
    'field-cut':
      'field-cut border-[2.5px] border-chaos-black/40 bg-card text-foreground shadow-[2px_2px_0px_rgba(13,13,13,0.08)]',
  }

  // Size Configuration & Strict Slot Bounds
  const sizeClasses: Record<
    InputSize,
    {
      input: string
      prefix: string
      suffix: string
      iconBox: string
      clearBtn: string
      paddingLeft: string
      plDefault: string
      paddingRightSingle: string
      paddingRightDouble: string
      paddingRightTriple: string
      prDefault: string
      placeholderSize: string
    }
  > = {
    sm: {
      input: 'h-8 text-sm',
      prefix: 'left-2.5',
      suffix: 'right-2',
      iconBox: 'size-4 [&_svg]:size-full [&_svg]:shrink-0',
      clearBtn: 'size-4 [&_svg]:size-2.5',
      paddingLeft: 'pl-9',
      plDefault: 'pl-2.5',
      paddingRightSingle: 'pr-8',
      paddingRightDouble: 'pr-14',
      paddingRightTriple: 'pr-20',
      prDefault: 'pr-2.5',
      placeholderSize: 'placeholder:text-xs',
    },
    default: {
      input: 'h-10 text-base md:text-sm',
      prefix: 'left-3',
      suffix: 'right-2.5',
      iconBox: 'size-5 [&_svg]:size-full [&_svg]:shrink-0',
      clearBtn: 'size-5 [&_svg]:size-3',
      paddingLeft: 'pl-11',
      plDefault: 'pl-3.5',
      paddingRightSingle: 'pr-11',
      paddingRightDouble: 'pr-18',
      paddingRightTriple: 'pr-24',
      prDefault: 'pr-3.5',
      placeholderSize: 'placeholder:text-sm',
    },
    lg: {
      input: 'h-12 text-lg md:text-base',
      prefix: 'left-3.5',
      suffix: 'right-3',
      iconBox: 'size-6 [&_svg]:size-full [&_svg]:shrink-0',
      clearBtn: 'size-6 [&_svg]:size-3.5',
      paddingLeft: 'pl-14',
      plDefault: 'pl-4',
      paddingRightSingle: 'pr-14',
      paddingRightDouble: 'pr-22',
      paddingRightTriple: 'pr-30',
      prDefault: 'pr-4',
      placeholderSize: 'placeholder:text-base',
    },
  }

  const activeSize = sizeClasses[size]

  // Dynamic Horizontal Padding based on slots
  const hasPrefix = Boolean(prefixIcon)
  const showClear = clearable && hasValue && !disabled && !readOnly
  const showToggle = isPassword && showPasswordToggle && !disabled

  let suffixItemCount = 0
  if (showClear) suffixItemCount++
  if (showToggle) suffixItemCount++
  if (suffixIcon) suffixItemCount++

  // Independent left and right padding so tailwind-merge never collides
  const paddingLeftClass = hasPrefix ? activeSize.paddingLeft : activeSize.plDefault

  const paddingRightClass =
    suffixItemCount >= 3
      ? activeSize.paddingRightTriple
      : suffixItemCount === 2
        ? activeSize.paddingRightDouble
        : suffixItemCount === 1
          ? activeSize.paddingRightSingle
          : activeSize.prDefault

  const focusColorValue = splatoonColorVars[focusColor] ?? 'var(--color-yellow)'

  return (
    <div className={cn(styles.inputRoot, containerClassName)}>
      <div className="relative flex w-full items-center">
        {hasPrefix && (
          <span
            className={cn(
              'text-muted-foreground pointer-events-none absolute top-1/2 z-10 flex shrink-0 -translate-y-1/2 items-center justify-center select-none',
              activeSize.prefix,
              activeSize.iconBox
            )}
            aria-hidden="true"
          >
            {prefixIcon}
          </span>
        )}

        <input
          ref={combinedRef}
          id={inputId}
          type={resolvedType}
          disabled={disabled}
          readOnly={readOnly}
          value={value}
          defaultValue={defaultValue}
          onChange={handleChange}
          aria-invalid={invalid ? true : undefined}
          aria-describedby={describedBy}
          data-slot="input"
          data-variant={variant}
          data-size={size}
          data-invalid={invalid ? true : undefined}
          className={cn(
            styles.inputField,
            variantClasses[variant],
            activeSize.input,
            paddingLeftClass,
            paddingRightClass,
            'placeholder:text-muted-foreground/60 font-medium transition-all file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:font-normal placeholder:tracking-normal disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
            activeSize.placeholderSize,
            invalid && styles.invalid,
            className
          )}
          style={
            {
              '--input-focus-color': focusColorValue,
              ...style,
            } as React.CSSProperties
          }
          {...props}
        />

        {suffixItemCount > 0 && (
          <div
            className={cn(
              'absolute top-1/2 z-10 flex shrink-0 -translate-y-1/2 items-center gap-1.5 select-none',
              activeSize.suffix
            )}
          >
            {showClear && (
              <button
                type="button"
                onClick={handleClear}
                aria-label="Clear input"
                className={cn(styles.clearBlobButton, activeSize.clearBtn)}
              >
                <X className="stroke-[3]" />
              </button>
            )}

            {showToggle && (
              <button
                type="button"
                onClick={() => setPasswordVisible((v) => !v)}
                aria-label={passwordVisible ? 'Hide password' : 'Show password'}
                className={cn(styles.togglePasswordButton, activeSize.iconBox)}
              >
                {passwordVisible ? <EyeOff className="size-full" /> : <Eye className="size-full" />}
              </button>
            )}

            {suffixIcon && (
              <span
                className={cn(
                  'text-muted-foreground flex shrink-0 items-center justify-center',
                  activeSize.iconBox
                )}
              >
                {suffixIcon}
              </span>
            )}
          </div>
        )}
      </div>

      {invalid && errorMessage && (
        <div
          id={errorId}
          role="alert"
          className="text-red animate-in fade-in slide-in-from-top-1 mt-1.5 flex items-center gap-1.5 text-xs font-bold"
        >
          <span className="bg-red inline-block size-1.5 shrink-0 rounded-full" aria-hidden="true" />
          <span>{errorMessage}</span>
        </div>
      )}

      {!invalid && helperText && (
        <p id={helperId} className="text-muted-foreground mt-1 text-xs font-medium">
          {helperText}
        </p>
      )}
    </div>
  )
}

export { Input }

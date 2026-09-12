import {
  type ButtonHTMLAttributes,
  type ReactNode,
  forwardRef,
} from 'react'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
export type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  /** Shows a spinner and disables the button */
  loading?: boolean
  /** Icon rendered to the left of children */
  iconLeft?: ReactNode
  /** Icon rendered to the right of children */
  iconRight?: ReactNode
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: [
    'bg-accent-600 text-white border border-accent-600',
    'hover:bg-accent-700 hover:border-accent-700',
    'active:bg-accent-800',
    'disabled:bg-accent-300 disabled:border-accent-300 disabled:cursor-not-allowed',
    'shadow-sm',
  ].join(' '),

  secondary: [
    'bg-transparent text-accent-700 border border-accent-600',
    'hover:bg-accent-50 hover:border-accent-700',
    'active:bg-accent-100',
    'disabled:text-accent-300 disabled:border-accent-200 disabled:cursor-not-allowed',
  ].join(' '),

  ghost: [
    'bg-transparent text-nav-700 border border-transparent',
    'hover:bg-paper-200 hover:text-nav-900',
    'active:bg-paper-300',
    'disabled:text-ink-400 disabled:cursor-not-allowed',
  ].join(' '),

  danger: [
    'bg-danger-600 text-white border border-danger-600',
    'hover:bg-danger-700 hover:border-danger-700',
    'active:bg-danger-800',
    'disabled:bg-danger-200 disabled:border-danger-200 disabled:cursor-not-allowed',
    'shadow-sm',
  ].join(' '),
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-7 px-3 text-xs gap-1.5 rounded',
  md: 'h-9 px-4 text-sm gap-2 rounded-md',
  lg: 'h-11 px-5 text-base gap-2.5 rounded-lg',
}

const iconSizeClasses: Record<ButtonSize, string> = {
  sm: 'size-3.5',
  md: 'size-4',
  lg: 'size-5',
}

function Spinner({ className }: { className?: string }) {
  return (
    <svg
      className={`animate-spin ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  )
}

/**
 * PeopleFlow Button
 *
 * Variants: primary (teal fill) | secondary (teal outline) | ghost (transparent) | danger (red fill)
 * Sizes: sm | md | lg
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'primary',
    size = 'md',
    loading = false,
    iconLeft,
    iconRight,
    children,
    disabled,
    className = '',
    ...rest
  },
  ref,
) {
  const iconCls = iconSizeClasses[size]

  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={[
        'inline-flex items-center justify-center font-medium transition-colors duration-150 select-none whitespace-nowrap',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500',
        variantClasses[variant],
        sizeClasses[size],
        className,
      ].join(' ')}
      {...rest}
    >
      {loading ? (
        <Spinner className={iconCls} />
      ) : (
        iconLeft && <span className={`shrink-0 ${iconCls}`}>{iconLeft}</span>
      )}
      {children && <span>{children}</span>}
      {!loading && iconRight && <span className={`shrink-0 ${iconCls}`}>{iconRight}</span>}
    </button>
  )
})

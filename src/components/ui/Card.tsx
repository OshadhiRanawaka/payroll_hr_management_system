import { type HTMLAttributes, type ReactNode } from 'react'

export type CardVariant = 'default' | 'ghost' | 'nav'
export type CardPadding = 'none' | 'sm' | 'md' | 'lg'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * default — white background, subtle border + shadow (most common, use for content areas)
   * ghost  — paper-tinted bg with border only (secondary grouping, less prominent)
   * nav    — dark navy bg (for sidebar panels, dark-surface content blocks)
   */
  variant?: CardVariant
  /** Controls inner padding. 'none' lets you manage padding in children. */
  padding?: CardPadding
  /** Optional header section rendered above the padded content */
  header?: ReactNode
  /** Optional footer section rendered below the padded content */
  footer?: ReactNode
}

const variantClasses: Record<CardVariant, string> = {
  default: 'bg-white border border-paper-300 shadow-card',
  ghost: 'bg-paper-50 border border-paper-200',
  nav: 'bg-nav-800 border border-nav-700',
}

const paddingClasses: Record<CardPadding, string> = {
  none: '',
  sm: 'p-3',
  md: 'p-5',
  lg: 'p-7',
}

/**
 * PeopleFlow Card
 *
 * Base container for content sections. The default variant uses white + a soft shadow,
 * matching the "warm paper + white card" visual model.
 */
export function Card({
  variant = 'default',
  padding = 'md',
  header,
  footer,
  children,
  className = '',
  ...rest
}: CardProps) {
  const hasHeaderOrFooter = Boolean(header || footer)

  return (
    <div
      className={[
        'rounded-lg overflow-hidden',
        variantClasses[variant],
        !hasHeaderOrFooter ? paddingClasses[padding] : '',
        className,
      ].join(' ')}
      {...rest}
    >
      {header && (
        <div
          className={[
            'border-b',
            variant === 'nav' ? 'border-nav-700 px-5 py-3.5' : 'border-paper-200 px-5 py-3.5',
          ].join(' ')}
        >
          {header}
        </div>
      )}
      {children && (
        <div className={hasHeaderOrFooter ? paddingClasses[padding] : ''}>{children}</div>
      )}
      {footer && (
        <div
          className={[
            'border-t',
            variant === 'nav'
              ? 'border-nav-700 px-5 py-3'
              : 'border-paper-200 bg-paper-50 px-5 py-3',
          ].join(' ')}
        >
          {footer}
        </div>
      )}
    </div>
  )
}

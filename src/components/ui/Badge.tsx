import { type ReactNode } from 'react'

export type BadgeVariant =
  | 'success'   // Active, Approved, Present, Paid
  | 'warning'   // Pending, Late, At-Risk, Needs Action
  | 'danger'    // Rejected, Absent, Error, Overdue
  | 'info'      // Submitted, Locked, In-Progress, Draft
  | 'neutral'   // Inactive, Closed, N/A
  | 'accent'    // Highlighted / selected states

export type BadgeSize = 'sm' | 'md'

export interface BadgeProps {
  variant?: BadgeVariant
  size?: BadgeSize
  /** Shows a small colored dot before the label */
  dot?: boolean
  children: ReactNode
  className?: string
}

const variantClasses: Record<BadgeVariant, { badge: string; dot: string }> = {
  success: {
    badge: 'bg-success-50 text-success-700 border border-success-200 ring-0',
    dot: 'bg-success-500',
  },
  warning: {
    badge: 'bg-warning-50 text-warning-700 border border-warning-200',
    dot: 'bg-warning-500',
  },
  danger: {
    badge: 'bg-danger-50 text-danger-700 border border-danger-200',
    dot: 'bg-danger-500',
  },
  info: {
    badge: 'bg-info-50 text-info-700 border border-info-200',
    dot: 'bg-info-500',
  },
  neutral: {
    badge: 'bg-ink-100 text-ink-600 border border-ink-200',
    dot: 'bg-ink-400',
  },
  accent: {
    badge: 'bg-accent-50 text-accent-700 border border-accent-200',
    dot: 'bg-accent-500',
  },
}

const sizeClasses: Record<BadgeSize, string> = {
  sm: 'px-1.5 py-0.5 text-[11px] font-medium tracking-wide gap-1',
  md: 'px-2 py-1 text-xs font-medium tracking-wide gap-1.5',
}

const dotSizeClasses: Record<BadgeSize, string> = {
  sm: 'size-1.5',
  md: 'size-2',
}

/**
 * PeopleFlow Badge / Status Chip
 *
 * Use these semantic variants consistently throughout the app:
 *   success → Active, Approved, Present, Paid, On-Time
 *   warning → Pending, Late, At-Risk, Needs-Action
 *   danger  → Rejected, Absent, Error, Overdue
 *   info    → Submitted, Locked, In-Progress, Draft
 *   neutral → Inactive, Closed, N/A
 *   accent  → Highlighted / Featured
 */
export function Badge({
  variant = 'neutral',
  size = 'md',
  dot = false,
  children,
  className = '',
}: BadgeProps) {
  const { badge, dot: dotColor } = variantClasses[variant]

  return (
    <span
      className={[
        'inline-flex items-center rounded-full leading-none uppercase',
        badge,
        sizeClasses[size],
        className,
      ].join(' ')}
    >
      {dot && (
        <span
          className={['shrink-0 rounded-full', dotColor, dotSizeClasses[size]].join(' ')}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  )
}

/* ─── Convenience pre-configured status badges ──────────────────────────── */

/** Common HR/payroll status badges — use these for consistency */
export const StatusBadge = {
  Active: () => <Badge variant="success" dot>Active</Badge>,
  Inactive: () => <Badge variant="neutral" dot>Inactive</Badge>,
  Pending: () => <Badge variant="warning" dot>Pending</Badge>,
  Approved: () => <Badge variant="success" dot>Approved</Badge>,
  Rejected: () => <Badge variant="danger" dot>Rejected</Badge>,
  Draft: () => <Badge variant="info" dot>Draft</Badge>,
  Submitted: () => <Badge variant="info" dot>Submitted</Badge>,
  Locked: () => <Badge variant="info" dot>Locked</Badge>,
  Late: () => <Badge variant="warning" dot>Late</Badge>,
  Absent: () => <Badge variant="danger" dot>Absent</Badge>,
  Present: () => <Badge variant="success" dot>Present</Badge>,
  OnLeave: () => <Badge variant="accent" dot>On Leave</Badge>,
  Paid: () => <Badge variant="success" dot>Paid</Badge>,
  Overdue: () => <Badge variant="danger" dot>Overdue</Badge>,
} as const

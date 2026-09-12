import { type ReactNode } from 'react'

export interface TrendData {
  /** Signed percentage, e.g. 4.2 for +4.2%, -3.1 for −3.1% */
  value: number
  /** Context label, e.g. "vs last month" */
  label?: string
}

export interface StatCardProps {
  /** Short descriptor above the value, e.g. "Total Employees" */
  label: string
  /** The primary KPI value, e.g. "247" or "$124,800" */
  value: string | number
  /** Trend indicator. Positive → green, negative → red. */
  trend?: TrendData
  /** Optional icon rendered in the top-right corner */
  icon?: ReactNode
  /** Optional mini sparkline data — array of relative numeric values */
  sparkline?: number[]
  /** 'default' (white card) | 'accent' (teal-tinted card for highlighted metrics) */
  variant?: 'default' | 'accent'
  /** Optional sub-label beneath the value, e.g. "of 30 working days" */
  subLabel?: string
  className?: string
}

function Sparkline({ data, positive }: { data: number[]; positive: boolean }) {
  if (data.length < 2) return null

  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const width = 80
  const height = 28
  const step = width / (data.length - 1)

  const points = data
    .map((v, i) => {
      const x = i * step
      const y = height - ((v - min) / range) * height
      return `${x},${y}`
    })
    .join(' ')

  const strokeColor = positive ? '#16a34a' : '#dc2626'
  const fillStart = positive ? '#16a34a' : '#dc2626'

  // Build path for area fill
  const pathD = data
    .map((v, i) => {
      const x = i * step
      const y = height - ((v - min) / range) * height
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`
    })
    .join(' ')
  const areaD = `${pathD} L ${width} ${height} L 0 ${height} Z`

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      aria-hidden="true"
      className="overflow-visible"
    >
      <defs>
        <linearGradient id={`sg-${positive ? 'pos' : 'neg'}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={fillStart} stopOpacity="0.15" />
          <stop offset="100%" stopColor={fillStart} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d={areaD}
        fill={`url(#sg-${positive ? 'pos' : 'neg'})`}
      />
      <polyline
        points={points}
        fill="none"
        stroke={strokeColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function TrendArrow({ value }: { value: number }) {
  const positive = value >= 0
  const color = positive ? 'text-success-600' : 'text-danger-600'
  const bg = positive ? 'bg-success-50' : 'bg-danger-50'
  const arrow = positive ? '↑' : '↓'
  const abs = Math.abs(value).toFixed(1)

  return (
    <span
      className={[
        'inline-flex items-center gap-0.5 rounded px-1.5 py-0.5',
        'text-xs font-semibold font-tabular',
        color,
        bg,
      ].join(' ')}
    >
      <span>{arrow}</span>
      <span>{abs}%</span>
    </span>
  )
}

/**
 * PeopleFlow StatCard — KPI card for dashboards.
 *
 * Shows a label, a large primary value, an optional trend indicator,
 * an optional icon, and an optional mini sparkline chart.
 */
export function StatCard({
  label,
  value,
  trend,
  icon,
  sparkline,
  variant = 'default',
  subLabel,
  className = '',
}: StatCardProps) {
  const isAccent = variant === 'accent'
  const trendPositive = (trend?.value ?? 0) >= 0

  return (
    <div
      className={[
        'relative rounded-lg border overflow-hidden',
        isAccent
          ? 'bg-accent-600 border-accent-700 text-white'
          : 'bg-white border-paper-300 shadow-card',
        className,
      ].join(' ')}
    >
      {/* Top section */}
      <div className="flex items-start justify-between gap-3 px-5 pt-5 pb-3">
        <div className="min-w-0 flex-1">
          <p
            className={[
              'text-xs font-semibold uppercase tracking-widest mb-2',
              isAccent ? 'text-accent-200' : 'text-ink-500',
            ].join(' ')}
          >
            {label}
          </p>
          <p
            className={[
              'text-3xl font-bold tracking-tight leading-none font-tabular',
              isAccent ? 'text-white' : 'text-nav-900',
            ].join(' ')}
          >
            {value}
          </p>
          {subLabel && (
            <p
              className={[
                'text-xs mt-1.5',
                isAccent ? 'text-accent-200' : 'text-ink-400',
              ].join(' ')}
            >
              {subLabel}
            </p>
          )}
        </div>

        {icon && (
          <div
            className={[
              'shrink-0 flex items-center justify-center size-10 rounded-lg',
              isAccent ? 'bg-white/15' : 'bg-paper-100 text-accent-600',
            ].join(' ')}
          >
            <span className="size-5">{icon}</span>
          </div>
        )}
      </div>

      {/* Bottom section: trend + sparkline */}
      <div
        className={[
          'flex items-end justify-between px-5 pb-4',
          isAccent ? 'border-t border-accent-500/40 pt-3' : 'border-t border-paper-100 pt-3',
        ].join(' ')}
      >
        <div className="flex items-center gap-2">
          {trend !== undefined && <TrendArrow value={trend.value} />}
          {trend?.label && (
            <span
              className={[
                'text-xs',
                isAccent ? 'text-accent-200' : 'text-ink-400',
              ].join(' ')}
            >
              {trend.label}
            </span>
          )}
          {!trend && (
            <span className={['text-xs', isAccent ? 'text-accent-200' : 'text-ink-400'].join(' ')}>
              &nbsp;
            </span>
          )}
        </div>

        {sparkline && sparkline.length >= 2 && (
          <div className="opacity-80">
            <Sparkline data={sparkline} positive={trendPositive} />
          </div>
        )}
      </div>
    </div>
  )
}

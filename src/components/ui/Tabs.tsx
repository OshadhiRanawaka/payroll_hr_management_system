import { type ReactNode } from 'react'

export interface TabItem {
  id: string
  label: string
  /** Optional count badge shown beside the label */
  count?: number
  disabled?: boolean
}

export interface TabsProps {
  tabs: TabItem[]
  activeTab: string
  onChange: (id: string) => void
  /**
   * underline — bottom-border indicator, suits page-level navigation
   * pill      — filled rounded pill, suits in-card filtering
   */
  variant?: 'underline' | 'pill'
  className?: string
  /** Content rendered to the right of the tab list */
  actions?: ReactNode
}

/**
 * PeopleFlow Tabs
 *
 * underline variant: classic bottom-border style for page-level tabs
 * pill variant: compact filled pill style for in-card or filter tabs
 */
export function Tabs({
  tabs,
  activeTab,
  onChange,
  variant = 'underline',
  className = '',
  actions,
}: TabsProps) {
  if (variant === 'pill') {
    return (
      <div className={['flex items-center justify-between gap-4', className].join(' ')}>
        <div className="inline-flex items-center gap-1 rounded-lg bg-paper-100 p-1">
          {tabs.map((tab) => {
            const isActive = tab.id === activeTab
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => !tab.disabled && onChange(tab.id)}
                disabled={tab.disabled}
                role="tab"
                aria-selected={isActive}
                className={[
                  'inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-all duration-150',
                  isActive
                    ? 'bg-white text-nav-900 shadow-card'
                    : 'text-ink-500 hover:text-nav-700',
                  tab.disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
                ].join(' ')}
              >
                {tab.label}
                {tab.count !== undefined && (
                  <span
                    className={[
                      'inline-flex items-center justify-center rounded-full px-1.5 py-0.5 text-[11px] font-semibold leading-none min-w-[18px]',
                      isActive
                        ? 'bg-accent-600 text-white'
                        : 'bg-ink-200 text-ink-600',
                    ].join(' ')}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            )
          })}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    )
  }

  // underline variant
  return (
    <div
      className={[
        'flex items-end justify-between border-b border-paper-200',
        className,
      ].join(' ')}
      role="tablist"
    >
      <div className="flex items-end gap-0">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => !tab.disabled && onChange(tab.id)}
              disabled={tab.disabled}
              role="tab"
              aria-selected={isActive}
              className={[
                'inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors duration-150',
                'border-b-2 -mb-px',
                isActive
                  ? 'border-accent-600 text-accent-700'
                  : 'border-transparent text-ink-500 hover:text-nav-700 hover:border-ink-300',
                tab.disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
              ].join(' ')}
            >
              {tab.label}
              {tab.count !== undefined && (
                <span
                  className={[
                    'inline-flex items-center justify-center rounded-full px-1.5 py-0.5 text-[11px] font-semibold leading-none min-w-[18px]',
                    isActive
                      ? 'bg-accent-100 text-accent-700'
                      : 'bg-ink-100 text-ink-500',
                  ].join(' ')}
                >
                  {tab.count}
                </span>
              )}
            </button>
          )
        })}
      </div>
      {actions && <div className="flex items-center gap-2 pb-2">{actions}</div>}
    </div>
  )
}

import { type ReactNode } from 'react'

export interface TableColumn<T = Record<string, unknown>> {
  /** Unique key for this column */
  key: string
  /** Column header label */
  header: string
  /** Custom render function. Receives the full row object. */
  render?: (row: T) => ReactNode
  /** Text alignment for both header and cells */
  align?: 'left' | 'right' | 'center'
  /** Apply JetBrains Mono font for numeric/tabular data (amounts, IDs, timestamps) */
  mono?: boolean
  /** Fixed column width, e.g. '120px' or '10%' */
  width?: string
  /** Hide this column — useful for responsive breakpoints */
  hidden?: boolean
}

export interface TableProps<T = Record<string, unknown>> {
  columns: TableColumn<T>[]
  data: T[]
  /** Must return a unique key for each row */
  keyExtractor: (row: T) => string | number
  /** Message shown when data array is empty */
  emptyMessage?: string
  /** Shows skeleton rows while loading */
  loading?: boolean
  /** Number of skeleton rows to show when loading */
  loadingRows?: number
  /** Optional caption for accessibility */
  caption?: string
  /** Called when a row is clicked */
  onRowClick?: (row: T) => void
  className?: string
}

const alignClass: Record<NonNullable<TableColumn['align']>, string> = {
  left: 'text-left',
  right: 'text-right',
  center: 'text-center',
}

function SkeletonRow({ columns }: { columns: TableColumn[] }) {
  return (
    <tr>
      {columns
        .filter((c) => !c.hidden)
        .map((col) => (
          <td key={col.key} className="px-4 py-3">
            <div className="h-4 animate-pulse rounded bg-ink-100" style={{ width: '60%' }} />
          </td>
        ))}
    </tr>
  )
}

/**
 * PeopleFlow Table
 *
 * A generic, strongly-typed table for dense data. Key features:
 *   - Sticky header with navy-tinted surface
 *   - Row hover highlight
 *   - `mono` column prop: renders values in JetBrains Mono for financials/IDs
 *   - `onRowClick` for navigable rows
 *   - Built-in loading skeleton and empty state
 */
export function Table<T extends object>({
  columns,
  data,
  keyExtractor,
  emptyMessage = 'No records found.',
  loading = false,
  loadingRows = 5,
  caption,
  onRowClick,
  className = '',
}: TableProps<T>) {
  const visibleCols = columns.filter((c) => !c.hidden)

  return (
    <div className={['w-full overflow-x-auto rounded-lg border border-paper-200', className].join(' ')}>
      <table className="w-full border-collapse text-sm">
        {caption && (
          <caption className="sr-only">{caption}</caption>
        )}

        {/* ── Header ── */}
        <thead>
          <tr className="bg-paper-50 border-b border-paper-200">
            {visibleCols.map((col) => (
              <th
                key={col.key}
                scope="col"
                style={col.width ? { width: col.width } : undefined}
                className={[
                  'px-4 py-2.5',
                  'text-[11px] font-semibold uppercase tracking-wider text-ink-500',
                  'whitespace-nowrap select-none',
                  alignClass[col.align ?? 'left'],
                ].join(' ')}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>

        {/* ── Body ── */}
        <tbody className="bg-white divide-y divide-paper-100">
          {loading ? (
            Array.from({ length: loadingRows }, (_, i) => (
              <SkeletonRow key={i} columns={visibleCols} />
            ))
          ) : data.length === 0 ? (
            <tr>
              <td
                colSpan={visibleCols.length}
                className="px-4 py-12 text-center text-sm text-ink-400"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr
                key={keyExtractor(row)}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                className={[
                  'transition-colors duration-100',
                  onRowClick
                    ? 'cursor-pointer hover:bg-accent-50'
                    : 'hover:bg-paper-50',
                ].join(' ')}
              >
                {visibleCols.map((col) => {
                  const value = (row as Record<string, unknown>)[col.key]
                  return (
                    <td
                      key={col.key}
                      className={[
                        'px-4 py-3 whitespace-nowrap text-nav-800',
                        alignClass[col.align ?? 'left'],
                        col.mono ? 'font-tabular text-[13px]' : '',
                      ].join(' ')}
                    >
                      {col.render
                        ? col.render(row)
                        : value !== null && value !== undefined
                          ? String(value)
                          : '—'}
                    </td>
                  )
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

import { Link } from 'react-router-dom'
import { Badge, Button, Card } from './ui'
import { useRole } from '../lib'
import type { NavSection } from '../types'

interface PlaceholderPageProps {
  title: string
  section: NavSection
  description: string
  specReference: string
  sampleCountText?: string
  icon?: JSX.Element
}

export default function PlaceholderPage({
  title,
  section,
  description,
  specReference,
  sampleCountText,
  icon,
}: PlaceholderPageProps) {
  const { activeRole, getSectionAccess } = useRole()
  const access = getSectionAccess(section)

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-paper-border shadow-xs">
        <div className="flex items-start gap-4">
          {icon && (
            <div className="p-3 bg-accent-subtle text-accent rounded-xl shrink-0">
              {icon}
            </div>
          )}
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold text-ink">{title}</h1>
              <Badge variant="info">Coming Soon</Badge>
              <span className="text-xs font-mono bg-paper text-ink-muted px-2 py-0.5 rounded border border-paper-border">
                {specReference}
              </span>
            </div>
            <p className="text-sm text-ink-muted mt-1">{description}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="text-ink-muted">Access Level:</span>
          <Badge variant={access === 'full' ? 'success' : access === 'none' ? 'danger' : 'warning'}>
            {access.toUpperCase()} ({activeRole.name})
          </Badge>
        </div>
      </div>

      {/* Main Feature Preview Card */}
      <Card>
        <div className="py-8 px-4 text-center space-y-4 max-w-lg mx-auto">
          <div className="size-12 rounded-full bg-paper text-ink-muted mx-auto flex items-center justify-center border border-paper-border">
            <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>

          <div>
            <h3 className="text-lg font-bold text-ink">{title} Module Prototype</h3>
            <p className="text-xs text-ink-muted mt-1 leading-relaxed">
              This route is registered in the application shell with active role permission gating.
              The mock data layer for this domain is already populated and ready in memory.
            </p>
          </div>

          {sampleCountText && (
            <div className="p-3 bg-paper rounded-lg border border-paper-border text-xs font-mono text-ink">
              {sampleCountText}
            </div>
          )}

          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Link to="/data-check">
              <Button variant="secondary" size="sm">
                View Domain Data (/data-check)
              </Button>
            </Link>
            <Link to="/">
              <Button variant="primary" size="sm">
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  )
}

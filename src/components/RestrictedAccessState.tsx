import { Link } from 'react-router-dom'
import { Badge, Button, Card } from './ui'
import { useRole } from '../lib'
import type { NavSection } from '../types'

export default function RestrictedAccessState({ section }: { section: NavSection }) {
  const { activeRole } = useRole()

  return (
    <div className="p-8 max-w-2xl mx-auto space-y-6">
      <Card>
        <div className="py-10 px-6 text-center space-y-4">
          <div className="size-14 rounded-full bg-danger-subtle text-danger-text mx-auto flex items-center justify-center border border-danger/20">
            <svg className="size-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>

          <div>
            <div className="flex items-center justify-center gap-2 mb-2">
              <Badge variant="danger">Access Restricted</Badge>
              <span className="text-xs font-mono text-ink-muted">Section: {section}</span>
            </div>
            <h2 className="text-xl font-bold text-ink">Role Permission Conflict</h2>
            <p className="text-sm text-ink-muted mt-2 max-w-md mx-auto">
              Your active role (<strong className="text-ink">{activeRole.name}</strong>) does not have permission to view the <span className="font-mono text-ink font-semibold">{section}</span> module according to Section 9 of the PeopleFlow HR Specification.
            </p>
          </div>

          <div className="p-3 bg-paper rounded-lg border border-paper-border text-xs font-mono text-ink-muted max-w-md mx-auto">
            Tip: Use the <strong className="text-accent">Role Switcher</strong> dropdown in the top bar to test another role (e.g. Super Admin or HR Manager).
          </div>

          <div className="pt-2">
            <Link to="/">
              <Button variant="primary" size="sm">
                Return to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  )
}

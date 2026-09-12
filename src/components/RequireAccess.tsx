import type { ReactNode } from 'react'
import { useRole } from '../lib'
import type { NavSection } from '../types'
import RestrictedAccessState from './RestrictedAccessState'

interface RequireAccessProps {
  section: NavSection
  children: ReactNode
}

/**
 * Reusable Role-Guard Component
 * Wraps page routes and verifies that the currently selected mock role has permission
 * to view the requested section. Renders RestrictedAccessState if permission is denied.
 */
export function RequireAccess({ section, children }: RequireAccessProps) {
  const { isSectionVisible, getSectionAccess } = useRole()

  const visible = isSectionVisible(section)
  const access = getSectionAccess(section)

  if (!visible || access === 'none') {
    return <RestrictedAccessState section={section} />
  }

  return <>{children}</>
}

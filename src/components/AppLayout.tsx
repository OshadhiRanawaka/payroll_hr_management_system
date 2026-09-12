import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import TopBar from './TopBar'
import RestrictedAccessState from './RestrictedAccessState'
import { useRole } from '../lib'
import type { NavSection } from '../types'

const pathToSectionMap: Record<string, NavSection> = {
  '/': 'dashboard',
  '/employees': 'employees',
  '/attendance': 'attendance',
  '/shifts': 'shifts',
  '/leave': 'leave',
  '/payroll': 'payroll',
  '/recruitment': 'recruitment',
  '/performance': 'performance',
  '/loans': 'loans',
  '/expenses': 'expenses',
  '/reports': 'reports',
  '/devices': 'devices',
  '/settings': 'settings',
}

export default function AppLayout() {
  const location = useLocation()
  const { isSectionVisible } = useRole()

  const currentSection = pathToSectionMap[location.pathname]

  // Allow unrestricted access to /data-check and /style-guide regardless of role section
  const isUtilityRoute = location.pathname === '/data-check' || location.pathname === '/style-guide'

  const hasAccess = isUtilityRoute || !currentSection || isSectionVisible(currentSection)

  return (
    <div className="flex h-screen bg-paper overflow-hidden">
      {/* 1. Left Sidebar */}
      <Sidebar />

      {/* 2. Main Content Column */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Bar */}
        <TopBar />

        {/* Page Content Viewport */}
        <main className="flex-1 overflow-y-auto bg-paper">
          {hasAccess ? <Outlet /> : <RestrictedAccessState section={currentSection} />}
        </main>
      </div>
    </div>
  )
}

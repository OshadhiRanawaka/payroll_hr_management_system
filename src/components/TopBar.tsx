import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRole } from '../lib'
import type { RoleId } from '../types'

export default function TopBar() {
  const { activeRoleId, setActiveRoleId, currentUser, activeRole, allRoles, logout } = useRole()
  const navigate = useNavigate()
  const [showNotifications, setShowNotifications] = useState(false)

  const notifications = [
    { id: 1, title: 'Payroll Run August 2026', time: '10m ago', unread: true },
    { id: 2, title: 'Device DEV-HOR-GATE-B degraded', time: '1h ago', unread: true },
    { id: 3, title: 'New Leave Request from Dilini W.', time: '2h ago', unread: true },
  ]

  return (
    <header className="h-16 bg-white border-b border-paper-border px-6 flex items-center justify-between gap-4 sticky top-0 z-30 shadow-xs">
      {/* 1. Global Search Input */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-ink-muted">
            <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search employees, runs, devices..."
            className="w-full pl-9 pr-8 py-2 text-xs bg-paper border border-paper-border rounded-lg text-ink placeholder-ink-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
          />
          <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none">
            <kbd className="text-[10px] font-mono font-medium text-ink-muted bg-paper-hover px-1.5 py-0.5 rounded border border-paper-border">
              ⌘K
            </kbd>
          </div>
        </div>
      </div>

      {/* Right Controls: Role Switcher, Notifications, User Identity */}
      <div className="flex items-center gap-4">
        {/* 2. Role Switcher Dropdown (Frontend Demo RBAC Simulation) */}
        <div className="flex items-center gap-2 bg-paper px-3 py-1.5 rounded-lg border border-paper-border">
          <span className="text-[11px] font-medium text-ink-muted font-mono hidden lg:inline">
            Role Switcher:
          </span>
          <select
            value={activeRoleId}
            onChange={(e) => setActiveRoleId(e.target.value as RoleId)}
            className="text-xs font-semibold text-accent bg-transparent focus:outline-none cursor-pointer"
            aria-label="Switch Role (Demo)"
          >
            {allRoles.map((role) => (
              <option key={role.id} value={role.id} className="text-ink bg-white">
                {role.name}
              </option>
            ))}
          </select>
        </div>

        {/* 3. Notification Bell */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-lg text-ink-muted hover:text-ink hover:bg-paper-hover relative transition-colors"
            title="Notifications"
          >
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute top-1.5 right-1.5 size-2.5 rounded-full bg-danger animate-pulse" />
          </button>

          {/* Notification Popover */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-paper-border p-4 z-50 space-y-3">
              <div className="flex items-center justify-between border-b border-paper-border pb-2">
                <h4 className="text-xs font-bold text-ink">Notifications</h4>
                <span className="text-[10px] font-mono bg-accent-subtle text-accent px-1.5 py-0.5 rounded font-semibold">
                  3 New
                </span>
              </div>
              <div className="space-y-2">
                {notifications.map((n) => (
                  <div key={n.id} className="p-2 rounded-lg bg-paper hover:bg-paper-hover text-xs space-y-1">
                    <div className="flex justify-between font-medium text-ink">
                      <span>{n.title}</span>
                      <span className="text-[10px] font-mono text-ink-muted">{n.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="h-6 w-px bg-paper-border" aria-hidden="true" />

        {/* 4. User Identity Block */}
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-full bg-accent-subtle text-accent font-bold text-xs flex items-center justify-center border border-accent/20">
            {currentUser.firstName[0]}
            {currentUser.lastName[0]}
          </div>

          <div className="hidden sm:block text-left">
            <div className="text-xs font-bold text-ink leading-none">{currentUser.fullName}</div>
            <div className="text-[10px] font-mono text-ink-muted mt-1 leading-none">
              {activeRole.name}
            </div>
          </div>

          <div className="pl-3 border-l border-paper-border ml-1">
            <button
              onClick={() => {
                logout()
                navigate('/sign-in')
              }}
              className="text-xs text-danger-text hover:text-danger hover:bg-danger-subtle px-2 py-1.5 rounded transition-colors font-medium"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

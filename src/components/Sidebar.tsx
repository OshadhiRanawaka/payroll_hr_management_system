import { Link, useLocation } from 'react-router-dom'
import { useRole } from '../lib'
import type { NavSection } from '../types'

interface NavItemConfig {
  id: NavSection
  label: string
  path: string
  icon: JSX.Element
}

export default function Sidebar() {
  const location = useLocation()
  const { isSectionVisible, activeRole } = useRole()

  const navItems: NavItemConfig[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      path: '/',
      icon: (
        <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 00-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      id: 'employees',
      label: 'Employees',
      path: '/employees',
      icon: (
        <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
    },
    {
      id: 'attendance',
      label: 'Attendance',
      path: '/attendance',
      icon: (
        <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      id: 'shifts',
      label: 'Shifts',
      path: '/shifts',
      icon: (
        <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      id: 'leave',
      label: 'Leave',
      path: '/leave',
      icon: (
        <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
    {
      id: 'payroll',
      label: 'Payroll',
      path: '/payroll',
      icon: (
        <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      id: 'recruitment',
      label: 'Recruitment',
      path: '/recruitment',
      icon: (
        <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      id: 'performance',
      label: 'Performance',
      path: '/performance',
      icon: (
        <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
    },
    {
      id: 'loans',
      label: 'Loans & Advances',
      path: '/loans',
      icon: (
        <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      id: 'expenses',
      label: 'Expenses',
      path: '/expenses',
      icon: (
        <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z" />
        </svg>
      ),
    },
    {
      id: 'reports',
      label: 'Reports',
      path: '/reports',
      icon: (
        <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      id: 'devices',
      label: 'Devices',
      path: '/devices',
      icon: (
        <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
        </svg>
      ),
    },
    {
      id: 'settings',
      label: 'Settings',
      path: '/settings',
      icon: (
        <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
  ]

  const visibleNavItems = navItems.filter((item) => isSectionVisible(item.id))

  return (
    <aside className="w-64 bg-nav-950 text-nav-100 flex flex-col h-screen border-r border-nav-800 shrink-0 sticky top-0">
      {/* Brand Header */}
      <div className="p-5 border-b border-nav-800 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="size-9 rounded-lg bg-accent-600 flex items-center justify-center text-white shadow-xs group-hover:bg-accent-500 transition-colors">
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div>
            <div className="font-bold text-white tracking-tight leading-none text-base">
              PeopleFlow <span className="text-accent-400">HR</span>
            </div>
            <div className="text-[10px] text-nav-400 font-mono mt-1 tracking-wider uppercase">
              Nimbus HRMS
            </div>
          </div>
        </Link>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1">
        <div className="px-3 py-1.5 text-[10px] font-mono font-semibold uppercase tracking-wider text-nav-400 flex items-center justify-between">
          <span>Main Menu</span>
          <span className="text-[9px] bg-nav-800 text-nav-300 px-1.5 py-0.5 rounded">
            {visibleNavItems.length} Visible
          </span>
        </div>

        {visibleNavItems.map((item) => {
          const isActive =
            item.path === '/'
              ? location.pathname === '/'
              : location.pathname.startsWith(item.path)

          return (
            <Link
              key={item.id}
              to={item.path}
              className={[
                'flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all',
                isActive
                  ? 'bg-accent-600 text-white font-semibold shadow-xs'
                  : 'text-nav-300 hover:text-white hover:bg-nav-900',
              ].join(' ')}
            >
              <span className={isActive ? 'text-white' : 'text-nav-400'}>{item.icon}</span>
              <span className="flex-1">{item.label}</span>
              {isActive && (
                <span className="size-1.5 rounded-full bg-white animate-pulse" aria-hidden="true" />
              )}
            </Link>
          )
        })}
      </div>

      {/* Footer Role Info & Tools */}
      <div className="p-3 border-t border-nav-800 bg-nav-900/60 space-y-2">
        <div className="px-2 py-1 flex items-center justify-between text-[11px] font-mono text-nav-400">
          <span>Role View:</span>
          <span className="text-accent-400 font-semibold truncate max-w-[120px]">
            {activeRole.name}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-1.5 text-[10px]">
          <Link
            to="/data-check"
            className="flex items-center justify-center gap-1 py-1.5 px-2 rounded bg-nav-800 text-nav-200 hover:bg-nav-700 hover:text-white transition-colors"
          >
            <span>Data Check</span>
          </Link>
          <Link
            to="/style-guide"
            className="flex items-center justify-center gap-1 py-1.5 px-2 rounded bg-nav-800 text-nav-200 hover:bg-nav-700 hover:text-white transition-colors"
          >
            <span>Style Guide</span>
          </Link>
        </div>
      </div>
    </aside>
  )
}

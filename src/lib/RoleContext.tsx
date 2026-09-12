import { useState, type ReactNode } from 'react'
import { RoleContext } from './RoleContextDef'
import { employees, roles } from '../data'
import type { AccessLevel, NavSection, RoleId } from '../types'

const roleUserMap: Record<RoleId, string> = {
  super_admin: 'emp-001', // Oshadhi Ranawaka (GM)
  hr_admin: 'emp-007', // Sanduni Liyanage (HR Executive)
  payroll_officer: 'emp-006', // Dilini Wickramasinghe (Payroll Officer - Maker)
  hr_manager: 'emp-002', // Kasun Perera (HR Manager - Checker)
  department_manager: 'emp-004', // Dhammika Silva (Plant Operations Manager)
  employee: 'emp-005', // Ruwan Fernando (Lead Engineer)
  auditor: 'emp-003', // Nalaka Jayawardena (Finance Manager)
  device_operator: 'emp-009', // Mahesh Senanayake (IT / Device Specialist)
}

export function RoleProvider({ children }: { children: ReactNode }) {
  const [activeRoleId, setActiveRoleId] = useState<RoleId>('super_admin')

  const activeRole = roles.find((r) => r.id === activeRoleId) || roles[0]

  const userId = roleUserMap[activeRoleId] || 'emp-001'
  const currentUser = employees.find((e) => e.id === userId) || employees[0]

  const isSectionVisible = (section: NavSection): boolean => {
    const permission = activeRole.permissions.find((p) => p.section === section)
    return permission ? permission.visible : false
  }

  const getSectionAccess = (section: NavSection): AccessLevel => {
    const permission = activeRole.permissions.find((p) => p.section === section)
    return permission ? permission.access : 'none'
  }

  return (
    <RoleContext.Provider
      value={{
        activeRole,
        activeRoleId,
        setActiveRoleId,
        currentUser,
        isSectionVisible,
        getSectionAccess,
        allRoles: roles,
      }}
    >
      {children}
    </RoleContext.Provider>
  )
}

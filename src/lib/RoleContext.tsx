import { useState, type ReactNode } from 'react'
import { RoleContext } from './RoleContextDef'
import { employees, roles } from '../data'
import type { AccessLevel, Employee, NavSection, RoleId } from '../types'

const roleUserMap: Record<RoleId, string> = {
  super_admin: 'emp-001',
  hr_admin: 'emp-007',
  payroll_officer: 'emp-006',
  hr_manager: 'emp-002',
  department_manager: 'emp-004',
  employee: 'emp-005',
  auditor: 'emp-003',
  device_operator: 'emp-009',
}

export function RoleProvider({ children }: { children: ReactNode }) {
  const [activeRoleId, setRoleIdState] = useState<RoleId>(() => {
    return (localStorage.getItem('activeRoleId') as RoleId) || 'super_admin'
  })
  const [activeUserId, setUserIdState] = useState<string | null>(() => {
    return localStorage.getItem('activeUserId')
  })
  const [mockUsers, setMockUsers] = useState<Employee[]>(() => {
    return JSON.parse(localStorage.getItem('mockUsers') || '[]')
  })

  // Synchronize active role to local storage whenever it changes (like from Role Switcher)
  const setActiveRoleId = (roleId: RoleId) => {
    setRoleIdState(roleId)
    localStorage.setItem('activeRoleId', roleId)
    setUserIdState(null)
    localStorage.removeItem('activeUserId')
  }

  const loginAsNewUser = (user: Employee) => {
    const newUsers = [...mockUsers, user]
    setMockUsers(newUsers)
    localStorage.setItem('mockUsers', JSON.stringify(newUsers))
    
    setRoleIdState('employee')
    localStorage.setItem('activeRoleId', 'employee')
    
    setUserIdState(user.id)
    localStorage.setItem('activeUserId', user.id)
  }

  const logout = () => {
    localStorage.removeItem('activeRoleId')
    localStorage.removeItem('activeUserId')
    setRoleIdState('super_admin')
    setUserIdState(null)
  }

  const activeRole = roles.find((r) => r.id === activeRoleId) || roles[0]

  const resolvedUserId = activeUserId || roleUserMap[activeRoleId] || 'emp-001'
  const allEmployees = [...employees, ...mockUsers]
  const currentUser = allEmployees.find((e) => e.id === resolvedUserId) || allEmployees[0]

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
        loginAsNewUser,
        logout,
      }}
    >
      {children}
    </RoleContext.Provider>
  )
}

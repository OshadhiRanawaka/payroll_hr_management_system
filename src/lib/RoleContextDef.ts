import { createContext } from 'react'
import type { AccessLevel, Employee, NavSection, RoleDefinition, RoleId } from '../types'

export interface RoleContextType {
  activeRole: RoleDefinition
  activeRoleId: RoleId
  setActiveRoleId: (roleId: RoleId) => void
  currentUser: Employee
  isSectionVisible: (section: NavSection) => boolean
  getSectionAccess: (section: NavSection) => AccessLevel
  allRoles: RoleDefinition[]
}

export const RoleContext = createContext<RoleContextType | undefined>(undefined)

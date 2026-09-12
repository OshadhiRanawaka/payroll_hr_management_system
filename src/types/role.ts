export type RoleId =
  | 'super_admin'
  | 'hr_admin'
  | 'payroll_officer'
  | 'hr_manager'
  | 'department_manager'
  | 'employee'
  | 'auditor'
  | 'device_operator'

export type NavSection =
  | 'dashboard'
  | 'employees'
  | 'attendance'
  | 'shifts'
  | 'leave'
  | 'payroll'
  | 'recruitment'
  | 'performance'
  | 'loans'
  | 'expenses'
  | 'reports'
  | 'devices'
  | 'self_service'
  | 'settings'

export type AccessLevel = 'full' | 'own_dept' | 'own_records' | 'read_only' | 'device_only' | 'none'

export interface RolePermission {
  section: NavSection
  access: AccessLevel
  visible: boolean
}

export interface RoleDefinition {
  id: RoleId
  name: string
  description: string
  permissions: RolePermission[]
}

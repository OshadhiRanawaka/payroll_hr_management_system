export type EmploymentType = 'full_time' | 'part_time' | 'contract' | 'intern'
export type EmployeeStatus = 'active' | 'probation' | 'on_leave' | 'resigned'

export interface BankDetails {
  bankName: string
  accountNumber: string
  accountName: string
  branchCode: string
  swiftCode: string
}

export interface Employee {
  id: string
  employeeCode: string
  firstName: string
  lastName: string
  fullName: string
  email: string
  phone: string
  avatarUrl?: string
  gender: 'male' | 'female' | 'other'
  dateOfBirth: string
  departmentId: string
  branchId: string
  designationId: string
  grade: string
  employmentType: EmploymentType
  status: EmployeeStatus
  hireDate: string
  basicSalary: number
  fixedAllowance: number
  grossSalary: number
  bankDetails: BankDetails
}

export interface Company {
  id: string
  name: string
  code: string
  taxId: string
  registrationNumber: string
  address: string
  city: string
  country: string
  currency: string
  contactEmail: string
  phone: string
  website: string
  totalHeadcount: number
}

export interface Branch {
  id: string
  companyId: string
  name: string
  code: string
  type: 'head_office' | 'manufacturing' | 'sales' | 'service'
  address: string
  city: string
  contactNumber: string
  managerId: string
  headcount: number
}

export interface Department {
  id: string
  name: string
  code: string
  costCenter: string
  headEmployeeId: string
  description: string
  employeeCount: number
}

export interface Designation {
  id: string
  title: string
  code: string
  departmentId: string
  grade: string
  level: number
}

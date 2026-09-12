export type PayrollRunStatus = 'draft' | 'submitted' | 'approved' | 'locked' | 'paid'

export interface PayrollRun {
  id: string
  periodName: string
  startDate: string
  endDate: string
  payDate: string
  status: PayrollRunStatus
  employeeCount: number
  grossTotal: number
  deductionsTotal: number
  netTotal: number
  createdBy: string
  createdAt: string
  approvedBy?: string
  approvedAt?: string
  lockedAt?: string
}

export interface Payslip {
  id: string
  payrollRunId: string
  employeeId: string
  basicSalary: number
  housingAllowance: number
  transportAllowance: number
  attendanceBonus: number
  overtimePay: number
  grossPay: number
  epfEmployee: number
  etfEmployer: number
  epfEmployer: number
  payeTax: number
  loanDeduction: number
  totalDeductions: number
  netPay: number
  paymentStatus: 'pending' | 'processed' | 'paid'
}

export type LoanType = 'personal_loan' | 'salary_advance' | 'equipment_loan'
export type LoanStatus = 'active' | 'completed' | 'defaulted'

export interface EmployeeLoan {
  id: string
  employeeId: string
  loanType: LoanType
  principalAmount: number
  outstandingBalance: number
  installmentAmount: number
  installmentsRemaining: number
  startDate: string
  status: LoanStatus
}

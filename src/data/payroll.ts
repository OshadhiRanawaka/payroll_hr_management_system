import type { EmployeeLoan, PayrollRun, Payslip } from '../types'

export const payrollRuns: PayrollRun[] = [
  {
    id: 'payrun-2026-06',
    periodName: 'June 2026 Payroll',
    startDate: '2026-06-01',
    endDate: '2026-06-30',
    payDate: '2026-06-30',
    status: 'paid',
    employeeCount: 1380,
    grossTotal: 235450000,
    deductionsTotal: 37672000,
    netTotal: 197778000,
    createdBy: 'emp-006', // Dilini (Payroll Officer - Maker)
    createdAt: '2026-06-22T10:00:00Z',
    approvedBy: 'emp-003', // Nalaka (Finance Head - Checker)
    approvedAt: '2026-06-25T14:30:00Z',
    lockedAt: '2026-06-26T09:00:00Z',
  },
  {
    id: 'payrun-2026-07',
    periodName: 'July 2026 Payroll',
    startDate: '2026-07-01',
    endDate: '2026-07-31',
    payDate: '2026-07-31',
    status: 'locked',
    employeeCount: 1382,
    grossTotal: 236800000,
    deductionsTotal: 37888000,
    netTotal: 198912000,
    createdBy: 'emp-006', // Dilini (Payroll Officer - Maker)
    createdAt: '2026-07-21T09:30:00Z',
    approvedBy: 'emp-002', // Kasun (HR Manager - Checker)
    approvedAt: '2026-07-24T16:00:00Z',
    lockedAt: '2026-07-25T08:30:00Z',
  },
  {
    id: 'payrun-2026-08',
    periodName: 'August 2026 Payroll',
    startDate: '2026-08-01',
    endDate: '2026-08-31',
    payDate: '2026-08-31',
    status: 'submitted', // Under Checker review (Maker: Dilini, waiting for Kasun/Nalaka)
    employeeCount: 1385,
    grossTotal: 238150000,
    deductionsTotal: 38104000,
    netTotal: 200046000,
    createdBy: 'emp-006', // Dilini (Payroll Officer - Maker)
    createdAt: '2026-08-22T11:15:00Z',
  },
  {
    id: 'payrun-2026-09',
    periodName: 'September 2026 Payroll (Current)',
    startDate: '2026-09-01',
    endDate: '2026-09-30',
    payDate: '2026-09-30',
    status: 'draft', // Active calculation draft
    employeeCount: 1385,
    grossTotal: 239000000,
    deductionsTotal: 38240000,
    netTotal: 200760000,
    createdBy: 'emp-006',
    createdAt: '2026-09-02T09:00:00Z',
  },
]

export const payslips: Payslip[] = [
  // EMP-001 (Oshadhi Ranawaka - GM) - August 2026
  {
    id: 'ps-202608-001',
    payrollRunId: 'payrun-2026-08',
    employeeId: 'emp-001',
    basicSalary: 380000,
    housingAllowance: 40000,
    transportAllowance: 30000,
    attendanceBonus: 0,
    overtimePay: 0,
    grossPay: 450000,
    epfEmployee: 30400, // 8% of 380k
    etfEmployer: 11400, // 3% of 380k
    epfEmployer: 45600, // 12% of 380k
    payeTax: 42500,
    loanDeduction: 0,
    totalDeductions: 72900,
    netPay: 377100,
    paymentStatus: 'pending',
  },
  // EMP-002 (Kasun Perera - HR Manager) - August 2026
  {
    id: 'ps-202608-002',
    payrollRunId: 'payrun-2026-08',
    employeeId: 'emp-002',
    basicSalary: 260000,
    housingAllowance: 25000,
    transportAllowance: 15000,
    attendanceBonus: 0,
    overtimePay: 0,
    grossPay: 300000,
    epfEmployee: 20800,
    etfEmployer: 7800,
    epfEmployer: 31200,
    payeTax: 21000,
    loanDeduction: 15000, // Active Personal Loan
    totalDeductions: 56800,
    netPay: 243200,
    paymentStatus: 'pending',
  },
  // EMP-005 (Ruwan Fernando - Lead Engineer) - August 2026
  {
    id: 'ps-202608-005',
    payrollRunId: 'payrun-2026-08',
    employeeId: 'emp-005',
    basicSalary: 190000,
    housingAllowance: 20000,
    transportAllowance: 10000,
    attendanceBonus: 5000,
    overtimePay: 18500,
    grossPay: 243500,
    epfEmployee: 15200,
    etfEmployer: 5700,
    epfEmployer: 22800,
    payeTax: 12500,
    loanDeduction: 10000,
    totalDeductions: 37700,
    netPay: 205800,
    paymentStatus: 'pending',
  },
  // EMP-010 (Saman Kumara - Supervisor Horana) - August 2026
  {
    id: 'ps-202608-010',
    payrollRunId: 'payrun-2026-08',
    employeeId: 'emp-010',
    basicSalary: 150000,
    housingAllowance: 15000,
    transportAllowance: 10000,
    attendanceBonus: 7500,
    overtimePay: 24000,
    grossPay: 206500,
    epfEmployee: 12000,
    etfEmployer: 4500,
    epfEmployer: 18000,
    payeTax: 6500,
    loanDeduction: 8000,
    totalDeductions: 26500,
    netPay: 180000,
    paymentStatus: 'pending',
  },
  // EMP-011 (Sunil Shantha - Operative) - August 2026
  {
    id: 'ps-202608-011',
    payrollRunId: 'payrun-2026-08',
    employeeId: 'emp-011',
    basicSalary: 75000,
    housingAllowance: 10000,
    transportAllowance: 5000,
    attendanceBonus: 4000,
    overtimePay: 14200,
    grossPay: 108200,
    epfEmployee: 6000,
    etfEmployer: 2250,
    epfEmployer: 9000,
    payeTax: 0,
    loanDeduction: 5000,
    totalDeductions: 11000,
    netPay: 97200,
    paymentStatus: 'pending',
  },
]

export const employeeLoans: EmployeeLoan[] = [
  {
    id: 'loan-101',
    employeeId: 'emp-002', // Kasun Perera
    loanType: 'personal_loan',
    principalAmount: 360000,
    outstandingBalance: 180000,
    installmentAmount: 15000,
    installmentsRemaining: 12,
    startDate: '2025-09-01',
    status: 'active',
  },
  {
    id: 'loan-102',
    employeeId: 'emp-005', // Ruwan Fernando
    loanType: 'equipment_loan',
    principalAmount: 120000,
    outstandingBalance: 40000,
    installmentAmount: 10000,
    installmentsRemaining: 4,
    startDate: '2026-01-15',
    status: 'active',
  },
  {
    id: 'loan-103',
    employeeId: 'emp-010', // Saman Kumara
    loanType: 'salary_advance',
    principalAmount: 48000,
    outstandingBalance: 16000,
    installmentAmount: 8000,
    installmentsRemaining: 2,
    startDate: '2026-07-01',
    status: 'active',
  },
  {
    id: 'loan-104',
    employeeId: 'emp-011', // Sunil Shantha
    loanType: 'salary_advance',
    principalAmount: 30000,
    outstandingBalance: 15000,
    installmentAmount: 5000,
    installmentsRemaining: 3,
    startDate: '2026-06-15',
    status: 'active',
  },
]

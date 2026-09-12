/**
 * src/data/index.ts
 *
 * Barrel export for all mock/seed data modules in PeopleFlow HR.
 * This project is frontend-only — all data lives here as static, typed TypeScript models.
 */

// 1. Organization Domain
export { company, branches, departments, designations } from './organization'

// 2. Employee Domain
export { employees } from './employees'

// 3. Biometric / Devices Domain
export { biometricDevices, syncLogs } from './biometrics'

// 4. Attendance Domain
export {
  shiftDefinitions,
  attendanceEvents,
  attendanceDays,
  attendanceExceptions,
} from './attendance'

// 5. Leave Domain
export { leaveTypes, leaveRequests, leaveBalances } from './leaves'

// 6. Payroll Domain
export { payrollRuns, payslips, employeeLoans } from './payroll'

// 7. Roles Domain
export { roles } from './roles'

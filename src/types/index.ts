/**
 * src/types/index.ts
 *
 * Barrel export for all shared TypeScript types and interfaces across PeopleFlow HR domains.
 * Types here have zero runtime dependencies and zero data imports.
 */

// Shared Primitives
export type ISODate = string
export type MonetaryAmount = number
export type ID = string | number

// Organization Domain
export type { Company, Branch, Department, Designation } from './organization'

// Employee Domain
export type { Employee, EmploymentType, EmployeeStatus, BankDetails } from './employee'

// Biometric Domain
export type { BiometricDevice, DeviceHealthStatus, SyncLog } from './biometric'

// Attendance Domain
export type {
  AttendanceEvent,
  PunchSource,
  PunchType,
  VerificationMethod,
  ShiftDefinition,
  AttendanceCorrection,
  AttendanceDay,
  DayAttendanceStatus,
  AttendanceException,
  ExceptionType,
  ExceptionSeverity,
  ExceptionStatus,
} from './attendance'

// Leave Domain
export type {
  LeaveType,
  AccrualRule,
  ApprovalStatus,
  ApprovalStep,
  LeaveRequest,
  LeaveBalance,
} from './leave'

// Payroll Domain
export type {
  PayrollRun,
  PayrollRunStatus,
  Payslip,
  EmployeeLoan,
  LoanType,
  LoanStatus,
} from './payroll'

// Roles Domain
export type { RoleId, NavSection, AccessLevel, RolePermission, RoleDefinition } from './role'

/**
 * src/types/index.ts
 *
 * Barrel export for all shared TypeScript types and interfaces.
 *
 * Example types to add as the project grows:
 *
 *   export type { Employee, EmployeeStatus } from './employee'
 *   export type { PayrollRun, PayslipLine } from './payroll'
 *   export type { Department } from './department'
 *   export type { LeaveRequest, LeaveType } from './leave'
 */

// ---------------------------------------------------------------------------
// Shared primitive types
// ---------------------------------------------------------------------------

/** ISO 8601 date string, e.g. "2024-01-31" */
export type ISODate = string

/** Monetary amount in the system's base currency (e.g. USD cents or a float) */
export type MonetaryAmount = number

/** Generic ID type — keeps the door open to switch from number → string (UUID) */
export type ID = string | number

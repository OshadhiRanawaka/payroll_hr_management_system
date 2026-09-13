export type PunchSource = 'biometric' | 'mobile' | 'manual'
export type PunchType = 'in' | 'out'
export type VerificationMethod = 'fingerprint' | 'face' | 'card' | 'gps' | 'web'

/** Raw Biometric Attendance Event — IMMUTABLE as per spec §19, §6 */
export interface AttendanceEvent {
  id: string
  employeeId: string
  biometricUserId: string
  deviceId: string
  branchId: string
  timestamp: string // ISO string
  type: PunchType
  source: PunchSource
  verificationMethod: VerificationMethod
}

export interface ShiftDefinition {
  id: string
  name: string
  code: string
  type: 'fixed' | 'rotating' | 'flexible' | 'overnight'
  startTime: string // "08:30"
  endTime: string // "17:00"
  crossMidnight: boolean
  gracePeriodMinutes: number
  breakDurationMinutes: number
  requiredWorkHours: number
}

export type CorrectionStatus = 'pending' | 'approved' | 'rejected'

export interface AttendanceCorrection {
  id: string
  attendanceDayId?: string
  employeeId: string
  originalTime: string
  correctedTime: string
  correctedBy: string
  reason: string
  status: CorrectionStatus
  createdAt: string
}

export type DayAttendanceStatus = 'present' | 'absent' | 'late' | 'half_day' | 'on_leave'

export interface AttendanceDay {
  id: string
  date: string // ISO Date "YYYY-MM-DD"
  employeeId: string
  shiftId: string
  firstIn?: string
  lastOut?: string
  totalWorkHours: number
  regularHours: number
  overtimeHours: number
  lateMinutes: number
  earlyDepartureMinutes: number
  status: DayAttendanceStatus
  source?: PunchSource
  deviceId?: string
  corrections?: AttendanceCorrection[]
}

export type ExceptionType =
  | 'missing_punch'
  | 'unexcused_absence'
  | 'late_arrival'
  | 'duplicate_punch'
  | 'overtime_over_limit'

export type ExceptionSeverity = 'low' | 'medium' | 'high'
export type ExceptionStatus = 'open' | 'resolved' | 'dismissed'

export interface AttendanceException {
  id: string
  date: string
  employeeId: string
  exceptionType: ExceptionType
  severity: ExceptionSeverity
  description: string
  status: ExceptionStatus
  resolvedBy?: string
  resolutionNote?: string
}

export interface WeeklyOffPattern {
  id: string
  name: string
  daysOff: number[] // 0 = Sunday, 1 = Monday, etc.
  branchId?: string
  departmentId?: string
}

export interface BranchShiftRule {
  id: string
  shiftId: string
  branchId: string
  gracePeriodMinutes?: number
  breakDurationMinutes?: number
}

export interface RosterAssignment {
  id: string
  employeeId: string
  shiftId: string
  startDate: string // YYYY-MM-DD
  endDate?: string // YYYY-MM-DD, optional if ongoing
}

export interface Holiday {
  id: string
  date: string // YYYY-MM-DD
  name: string
  type: 'public' | 'company'
  branchIds?: string[] // If undefined, applies globally
}

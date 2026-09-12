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

export interface AttendanceCorrection {
  id: string
  originalTime: string
  correctedTime: string
  correctedBy: string
  reason: string
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
  status: DayAttendanceStatus
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

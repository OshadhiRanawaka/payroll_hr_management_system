export type AccrualRule = 'annual_grant' | 'monthly_accrual' | 'immediate'

export interface LeaveType {
  id: string
  name: string
  code: string
  entitlementDays: number
  accrualRule: AccrualRule
  carryForwardLimit: number
  encashmentAllowed: boolean
  description: string
}

export type ApprovalStatus = 'pending' | 'approved' | 'rejected'

export interface ApprovalStep {
  status: ApprovalStatus
  approvedBy?: string
  approvedAt?: string
  comment?: string
}

export interface LeaveRequest {
  id: string
  employeeId: string
  leaveTypeId: string
  startDate: string
  endDate: string
  totalDays: number
  reason: string
  managerApproval: ApprovalStep
  hrApproval: ApprovalStep
  overallStatus: ApprovalStatus | 'cancelled'
  createdAt: string
}

export interface LeaveBalance {
  employeeId: string
  leaveTypeId: string
  totalEntitlement: number
  usedDays: number
  pendingDays: number
  remainingDays: number
}

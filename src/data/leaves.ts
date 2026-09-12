import type { LeaveBalance, LeaveRequest, LeaveType } from '../types'

export const leaveTypes: LeaveType[] = [
  {
    id: 'leave-annual',
    name: 'Annual Leave',
    code: 'AL',
    entitlementDays: 14,
    accrualRule: 'annual_grant',
    carryForwardLimit: 7,
    encashmentAllowed: true,
    description: 'Standard paid annual leave granted at the beginning of each calendar year.',
  },
  {
    id: 'leave-casual',
    name: 'Casual Leave',
    code: 'CL',
    entitlementDays: 7,
    accrualRule: 'annual_grant',
    carryForwardLimit: 0,
    encashmentAllowed: false,
    description: 'Short-notice paid leave for personal affairs or unexpected matters.',
  },
  {
    id: 'leave-medical',
    name: 'Medical / Sick Leave',
    code: 'ML',
    entitlementDays: 14,
    accrualRule: 'annual_grant',
    carryForwardLimit: 0,
    encashmentAllowed: false,
    description: 'Paid medical leave supported by a qualified medical practitioner certificate.',
  },
  {
    id: 'leave-maternity',
    name: 'Maternity Leave',
    code: 'MTL',
    entitlementDays: 84,
    accrualRule: 'immediate',
    carryForwardLimit: 0,
    encashmentAllowed: false,
    description: 'Statutory paid maternity leave for female employees under Shop & Office Act.',
  },
  {
    id: 'leave-nopay',
    name: 'No-Pay Leave',
    code: 'NPL',
    entitlementDays: 30,
    accrualRule: 'immediate',
    carryForwardLimit: 0,
    encashmentAllowed: false,
    description: 'Unpaid leave subject to prior approval from Department Manager and HR.',
  },
]

export const leaveRequests: LeaveRequest[] = [
  {
    id: 'lvr-2026-001',
    employeeId: 'emp-014', // Nirosha Priyangani
    leaveTypeId: 'leave-maternity',
    startDate: '2026-09-01',
    endDate: '2026-11-23',
    totalDays: 84,
    reason: 'Maternity leave for second child.',
    managerApproval: {
      status: 'approved',
      approvedBy: 'emp-004', // Dhammika Silva (Plant Manager)
      approvedAt: '2026-08-20T10:30:00Z',
      comment: 'Approved. Replacement supervisor assigned.',
    },
    hrApproval: {
      status: 'approved',
      approvedBy: 'emp-002', // Kasun Perera (HR Manager)
      approvedAt: '2026-08-21T14:15:00Z',
      comment: 'Statutory maternity leave documents verified.',
    },
    overallStatus: 'approved',
    createdAt: '2026-08-19T09:00:00Z',
  },
  {
    id: 'lvr-2026-002',
    employeeId: 'emp-006', // Dilini Wickramasinghe
    leaveTypeId: 'leave-annual',
    startDate: '2026-09-18',
    endDate: '2026-09-22',
    totalDays: 3,
    reason: 'Family vacation to Nuwara Eliya.',
    managerApproval: {
      status: 'approved',
      approvedBy: 'emp-003', // Nalaka Jayawardena (Finance Manager)
      approvedAt: '2026-09-10T11:00:00Z',
      comment: 'Approved. Payroll cutoff work completed early.',
    },
    hrApproval: {
      status: 'pending',
    },
    overallStatus: 'pending',
    createdAt: '2026-09-09T16:20:00Z',
  },
  {
    id: 'lvr-2026-003',
    employeeId: 'emp-008', // Tharindu Gunaratne
    leaveTypeId: 'leave-casual',
    startDate: '2026-09-15',
    endDate: '2026-09-15',
    totalDays: 1,
    reason: 'Personal urgent bank transaction in Kandy.',
    managerApproval: {
      status: 'pending',
    },
    hrApproval: {
      status: 'pending',
    },
    overallStatus: 'pending',
    createdAt: '2026-09-11T13:45:00Z',
  },
  {
    id: 'lvr-2026-004',
    employeeId: 'emp-009', // Mahesh Senanayake
    leaveTypeId: 'leave-medical',
    startDate: '2026-09-08',
    endDate: '2026-09-09',
    totalDays: 2,
    reason: 'Viral fever rest recommended by doctor.',
    managerApproval: {
      status: 'approved',
      approvedBy: 'emp-001', // Oshadhi Ranawaka (GM)
      approvedAt: '2026-09-08T09:10:00Z',
      comment: 'Get well soon.',
    },
    hrApproval: {
      status: 'approved',
      approvedBy: 'emp-007', // Sanduni Liyanage (HR Exec)
      approvedAt: '2026-09-08T10:00:00Z',
      comment: 'Medical certificate uploaded and verified.',
    },
    overallStatus: 'approved',
    createdAt: '2026-09-08T08:30:00Z',
  },
  {
    id: 'lvr-2026-005',
    employeeId: 'emp-018', // Buddhika Mendis
    leaveTypeId: 'leave-nopay',
    startDate: '2026-09-25',
    endDate: '2026-09-30',
    totalDays: 4,
    reason: 'Attending relative wedding abroad.',
    managerApproval: {
      status: 'rejected',
      approvedBy: 'emp-010', // Saman Kumara (Supervisor)
      approvedAt: '2026-09-10T15:00:00Z',
      comment: 'High production volume scheduled during peak line assembly.',
    },
    hrApproval: {
      status: 'rejected',
      approvedBy: 'emp-002',
      approvedAt: '2026-09-10T16:00:00Z',
      comment: 'Rejected per department manager recommendation.',
    },
    overallStatus: 'rejected',
    createdAt: '2026-09-09T10:00:00Z',
  },
]

export const leaveBalances: LeaveBalance[] = [
  {
    employeeId: 'emp-001',
    leaveTypeId: 'leave-annual',
    totalEntitlement: 14,
    usedDays: 4,
    pendingDays: 0,
    remainingDays: 10,
  },
  {
    employeeId: 'emp-001',
    leaveTypeId: 'leave-casual',
    totalEntitlement: 7,
    usedDays: 2,
    pendingDays: 0,
    remainingDays: 5,
  },
  {
    employeeId: 'emp-001',
    leaveTypeId: 'leave-medical',
    totalEntitlement: 14,
    usedDays: 1,
    pendingDays: 0,
    remainingDays: 13,
  },
  {
    employeeId: 'emp-006',
    leaveTypeId: 'leave-annual',
    totalEntitlement: 14,
    usedDays: 6,
    pendingDays: 3,
    remainingDays: 5,
  },
  {
    employeeId: 'emp-008',
    leaveTypeId: 'leave-casual',
    totalEntitlement: 7,
    usedDays: 4,
    pendingDays: 1,
    remainingDays: 2,
  },
  {
    employeeId: 'emp-014',
    leaveTypeId: 'leave-maternity',
    totalEntitlement: 84,
    usedDays: 84,
    pendingDays: 0,
    remainingDays: 0,
  },
]

import type { BranchShiftRule, Holiday, RosterAssignment, WeeklyOffPattern } from '../types'

export const weeklyOffPatterns: WeeklyOffPattern[] = [
  {
    id: 'wo-standard',
    name: 'Standard Weekend (Sat/Sun)',
    daysOff: [0, 6], // Sunday, Saturday
  },
  {
    id: 'wo-manufacturing',
    name: 'Plant Operations (Sunday only)',
    daysOff: [0], // Sunday
    departmentId: 'dept-mfg',
  },
  {
    id: 'wo-retail',
    name: 'Retail Branches (Monday off)',
    daysOff: [1], // Monday
  }
]

export const branchShiftRules: BranchShiftRule[] = [
  {
    id: 'bsr-kandy-grace',
    shiftId: 'shift-fixed-day',
    branchId: 'br-kandy',
    gracePeriodMinutes: 30, // Kandy has worse traffic, longer grace period
  },
  {
    id: 'bsr-horana-break',
    shiftId: 'shift-mfg-night',
    branchId: 'br-horana',
    breakDurationMinutes: 60, // Horana night shift gets longer break
  }
]

export const rosterAssignments: RosterAssignment[] = [
  {
    id: 'roster-001',
    employeeId: 'emp-001', // Oshadhi
    shiftId: 'shift-flex',
    startDate: '2026-01-01',
  },
  {
    id: 'roster-002',
    employeeId: 'emp-002', // Kasun
    shiftId: 'shift-fixed-day',
    startDate: '2026-01-01',
  },
  {
    id: 'roster-003',
    employeeId: 'emp-004', // Dhammika
    shiftId: 'shift-fixed-day',
    startDate: '2026-01-01',
  },
  {
    id: 'roster-004',
    employeeId: 'emp-005', // Ruwan
    shiftId: 'shift-fixed-day',
    startDate: '2026-01-01',
  },
  {
    id: 'roster-005',
    employeeId: 'emp-010', // Saman
    shiftId: 'shift-mfg-night',
    startDate: '2026-09-01',
    endDate: '2026-09-30', // Rotating month-to-month
  },
  {
    id: 'roster-006',
    employeeId: 'emp-011', // Sunil
    shiftId: 'shift-mfg-morning',
    startDate: '2026-09-01',
    endDate: '2026-09-30',
  },
  {
    id: 'roster-007',
    employeeId: 'emp-014', // Anura
    shiftId: 'shift-mfg-morning',
    startDate: '2026-09-01',
    endDate: '2026-09-30',
  },
  {
    id: 'roster-008',
    employeeId: 'emp-008', // Tharindu (Sales)
    shiftId: 'shift-flex',
    startDate: '2026-01-01',
  }
]

export const holidays: Holiday[] = [
  {
    id: 'hol-1',
    date: '2026-01-01',
    name: 'New Year\'s Day',
    type: 'public',
  },
  {
    id: 'hol-2',
    date: '2026-01-14',
    name: 'Tamil Thai Pongal Day',
    type: 'public',
  },
  {
    id: 'hol-3',
    date: '2026-02-04',
    name: 'Independence Day',
    type: 'public',
  },
  {
    id: 'hol-4',
    date: '2026-04-13',
    name: 'Sinhala & Tamil New Year (Eve)',
    type: 'public',
  },
  {
    id: 'hol-5',
    date: '2026-04-14',
    name: 'Sinhala & Tamil New Year',
    type: 'public',
  },
  {
    id: 'hol-6',
    date: '2026-05-01',
    name: 'May Day',
    type: 'public',
  },
  {
    id: 'hol-7',
    date: '2026-05-02',
    name: 'Company Annual Retreat',
    type: 'company',
  },
  {
    id: 'hol-8',
    date: '2026-05-24',
    name: 'Vesak Full Moon Poya Day',
    type: 'public',
  },
  {
    id: 'hol-9',
    date: '2026-08-25',
    name: 'Kandy Esala Perahera Special Holiday',
    type: 'company',
    branchIds: ['br-kandy'], // Only for Kandy branch
  },
  {
    id: 'hol-10',
    date: '2026-12-25',
    name: 'Christmas Day',
    type: 'public',
  }
]

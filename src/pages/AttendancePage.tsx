import { useState } from 'react'
import { Badge, Button, Card, Table, Tabs } from '../components/ui'
import type { TableColumn } from '../components/ui'
import {
  attendanceDays as initialDays,
  attendanceExceptions as initialExceptions,
  shiftDefinitions,
  employees,
  departments,
  branches,
  biometricDevices,
} from '../data'
import { useRole } from '../lib'
import type { AttendanceDay, AttendanceException } from '../types'
import { CorrectionModal } from './Attendance/CorrectionModal'
import { ShiftSummary } from './Attendance/ShiftSummary'

export default function AttendancePage() {
  const { activeRoleId, currentUser, getSectionAccess } = useRole()
  const access = getSectionAccess('attendance')
  const isReadOnly = access === 'read_only'
  
  const isDepartmentManager = activeRoleId === 'department_manager'
  const managerDeptId = currentUser.departmentId || 'dept-mfg'
  const managerDept = departments.find((d) => d.id === managerDeptId)

  const [days, setDays] = useState<AttendanceDay[]>(initialDays)
  const [exceptions, setExceptions] = useState<AttendanceException[]>(initialExceptions)

  const [mainTab, setMainTab] = useState('register')
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDept, setSelectedDept] = useState<string>('all')
  const [selectedBranch, setSelectedBranch] = useState<string>('all')
  const [selectedDate, setSelectedDate] = useState<string>('2026-09-11')

  const [correctionTarget, setCorrectionTarget] = useState<{ type: 'day' | 'exception', id: string } | null>(null)

  // Filtering Logic
  const getEmployee = (empId: string) => employees.find((e) => e.id === empId)

  const isVisibleEmployee = (empId: string) => {
    const emp = getEmployee(empId)
    if (!emp) return false

    if (isDepartmentManager && emp.departmentId !== managerDeptId) return false
    
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      if (!emp.fullName.toLowerCase().includes(q) && !emp.employeeCode.toLowerCase().includes(q)) {
        return false
      }
    }
    if (!isDepartmentManager && selectedDept !== 'all' && emp.departmentId !== selectedDept) return false
    if (selectedBranch !== 'all' && emp.branchId !== selectedBranch) return false
    return true
  }

  const filteredDays = days.filter((d) => {
    if (selectedDate && d.date !== selectedDate) return false
    return isVisibleEmployee(d.employeeId)
  })

  const filteredExceptions = exceptions.filter((e) => {
    if (selectedDate && e.date !== selectedDate) return false
    return isVisibleEmployee(e.employeeId)
  })

  const handleCorrectDay = (dayId: string) => {
    setCorrectionTarget({ type: 'day', id: dayId })
  }

  const handleCorrectException = (excId: string) => {
    setCorrectionTarget({ type: 'exception', id: excId })
  }

  const handleSubmitCorrection = (data: any) => {
    if (correctionTarget?.type === 'day') {
      setDays(prev => prev.map(d => {
        if (d.id === correctionTarget.id) {
          return {
            ...d,
            corrections: [
              ...(d.corrections || []),
              {
                id: `corr-${Date.now()}`,
                employeeId: d.employeeId,
                originalTime: data.originalTime,
                correctedTime: data.correctedTime,
                correctedBy: currentUser.id,
                reason: data.reason,
                status: 'pending',
                createdAt: new Date().toISOString()
              }
            ]
          }
        }
        return d
      }))
    } else if (correctionTarget?.type === 'exception') {
      setExceptions(prev => prev.map(e => {
        if (e.id === correctionTarget.id) {
          return {
            ...e,
            status: 'resolved',
            resolvedBy: currentUser.id,
            resolutionNote: data.reason
          }
        }
        return e
      }))
    }
    setCorrectionTarget(null)
  }

  // Columns for Register
  const dayCols: TableColumn<AttendanceDay>[] = [
    {
      key: 'employee',
      header: 'Employee',
      render: (d) => {
        const emp = getEmployee(d.employeeId)
        return (
          <div className="flex flex-col">
            <span className="font-bold text-ink">{emp?.fullName}</span>
            <span className="text-xs text-ink-muted">{emp?.employeeCode}</span>
          </div>
        )
      }
    },
    {
      key: 'shift',
      header: 'Shift',
      render: (d) => {
        const shift = shiftDefinitions.find(s => s.id === d.shiftId)
        return <span className="text-xs font-mono">{shift?.code || 'N/A'}</span>
      }
    },
    {
      key: 'inOut',
      header: 'In / Out',
      render: (d) => {
        const hasCorrection = d.corrections && d.corrections.length > 0
        const latestCorrection = hasCorrection ? d.corrections![d.corrections!.length - 1] : null
        
        return (
          <div className="flex flex-col space-y-1 font-mono text-xs">
            <div className="flex items-center gap-1">
              <span className="text-success-text">IN:</span> 
              <span className={latestCorrection ? 'line-through text-ink-muted' : ''}>{d.firstIn || '--:--'}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-warning-text">OUT:</span> 
              <span>{d.lastOut || '--:--'}</span>
            </div>
            {latestCorrection && (
              <div className="text-[10px] text-info bg-info-subtle px-1 py-0.5 rounded mt-0.5">
                Corr: {latestCorrection.correctedTime} ({latestCorrection.status})
              </div>
            )}
          </div>
        )
      }
    },
    {
      key: 'source',
      header: 'Source',
      render: (d) => (
        <Badge variant="neutral" className="capitalize">
          {d.source || 'N/A'}
        </Badge>
      )
    },
    {
      key: 'device',
      header: 'Device',
      render: (d) => {
        if (!d.deviceId) return <span className="text-xs text-ink-muted">--</span>
        const device = biometricDevices.find(dev => dev.id === d.deviceId)
        return (
          <div className="flex flex-col">
            <span className="text-xs font-bold text-ink">{device?.deviceName || d.deviceId}</span>
            {device?.locationName && <span className="text-[10px] text-ink-muted">{device.locationName}</span>}
          </div>
        )
      }
    },
    {
      key: 'hours',
      header: 'Hours (Reg/OT/Late/Early)',
      render: (d) => (
        <div className="flex items-center gap-2 font-mono text-xs">
          <Badge variant="neutral">{d.regularHours.toFixed(1)}h</Badge>
          {d.overtimeHours > 0 && <Badge variant="success">+{d.overtimeHours.toFixed(1)}h</Badge>}
          {d.lateMinutes > 0 && <Badge variant="warning">{d.lateMinutes}m L</Badge>}
          {d.earlyDepartureMinutes > 0 && <Badge variant="danger">{d.earlyDepartureMinutes}m E</Badge>}
        </div>
      )
    },
    {
      key: 'status',
      header: 'Status',
      render: (d) => {
        const variant = d.status === 'present' ? 'success' : d.status === 'late' ? 'warning' : d.status === 'absent' ? 'danger' : 'info'
        return <Badge variant={variant}>{d.status.replace('_', ' ').toUpperCase()}</Badge>
      }
    },
    {
      key: 'actions',
      header: 'Action',
      align: 'right',
      render: (d) => !isReadOnly && (
        <Button size="sm" variant="ghost" onClick={() => handleCorrectDay(d.id)}>
          Correct
        </Button>
      )
    }
  ]

  // Columns for Exceptions
  const excCols: TableColumn<AttendanceException>[] = [
    {
      key: 'employee',
      header: 'Employee',
      render: (e) => {
        const emp = getEmployee(e.employeeId)
        return (
          <div className="flex flex-col">
            <span className="font-bold text-ink">{emp?.fullName}</span>
            <span className="text-xs text-ink-muted">{emp?.employeeCode}</span>
          </div>
        )
      }
    },
    {
      key: 'type',
      header: 'Type & Severity',
      render: (e) => (
        <div className="flex flex-col items-start gap-1">
          <span className="text-xs font-bold text-ink uppercase">{e.exceptionType.replace(/_/g, ' ')}</span>
          <Badge variant={e.severity === 'high' ? 'danger' : e.severity === 'medium' ? 'warning' : 'neutral'}>
            {e.severity}
          </Badge>
        </div>
      )
    },
    {
      key: 'desc',
      header: 'Description',
      render: (e) => <div className="text-xs text-ink max-w-sm">{e.description}</div>
    },
    {
      key: 'status',
      header: 'Status',
      render: (e) => (
        <Badge variant={e.status === 'open' ? 'warning' : 'success'}>{e.status}</Badge>
      )
    },
    {
      key: 'actions',
      header: 'Action',
      align: 'right',
      render: (e) => (!isReadOnly && e.status === 'open') ? (
        <Button size="sm" variant="ghost" onClick={() => handleCorrectException(e.id)}>
          Resolve
        </Button>
      ) : null
    }
  ]

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-paper-border shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-accent uppercase bg-accent-subtle px-2 py-0.5 rounded">
              Attendance
            </span>
          </div>
          <h1 className="text-2xl font-bold text-ink mt-1">Attendance & Exceptions</h1>
          <p className="text-xs text-ink-muted mt-0.5">
            Process daily attendance, resolve exceptions, and manage corrections safely.
          </p>
        </div>
      </div>

      {isDepartmentManager && (
        <div className="p-4 rounded-xl bg-info-subtle border border-info/20 text-info-text text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg className="size-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <strong className="font-bold">Department Manager Scope Enforced:</strong> Viewing records for <span className="font-semibold underline">{managerDept?.name}</span> only.
            </div>
          </div>
          <Badge variant="info">Own Dept Scope</Badge>
        </div>
      )}

      {isReadOnly && (
        <div className="p-4 rounded-xl bg-paper border border-paper-border text-ink-muted text-xs flex items-center justify-between font-mono">
          <div className="flex items-center gap-2">
            <svg className="size-5 text-accent shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span><strong>Read-Only Mode:</strong> Actions are disabled.</span>
          </div>
          <Badge variant="neutral">Read-Only</Badge>
        </div>
      )}

      <Card padding="none">
        <div className="p-4 border-b border-paper-border">
          <Tabs
            tabs={[
              { id: 'register', label: 'Daily Register', count: filteredDays.length },
              { id: 'exceptions', label: 'Exceptions', count: filteredExceptions.length },
              { id: 'shifts', label: 'Shift Summary' }
            ]}
            activeTab={mainTab}
            onChange={setMainTab}
            variant="underline"
          />
        </div>

        {mainTab !== 'shifts' && (
          <div className="p-6 pb-2 border-b border-paper-border">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="py-2 px-3 text-xs bg-white border border-paper-border rounded-lg text-ink focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <input
                type="text"
                placeholder="Search employee..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="py-2 px-3 text-xs bg-white border border-paper-border rounded-lg text-ink focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <select
                value={isDepartmentManager ? managerDeptId : selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                disabled={isDepartmentManager}
                className="py-2 px-3 text-xs bg-white border border-paper-border rounded-lg text-ink focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-60 cursor-pointer"
              >
                <option value="all">All Departments</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className="py-2 px-3 text-xs bg-white border border-paper-border rounded-lg text-ink focus:outline-none focus:ring-2 focus:ring-accent cursor-pointer"
              >
                <option value="all">All Branches</option>
                {branches.map((b) => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {mainTab === 'register' && (
          <div className="p-6">
            <Table
              columns={dayCols}
              data={filteredDays}
              keyExtractor={(d) => d.id}
              emptyMessage="No attendance records for selected criteria."
            />
          </div>
        )}

        {mainTab === 'exceptions' && (
          <div className="p-6">
            <Table
              columns={excCols}
              data={filteredExceptions}
              keyExtractor={(e) => e.id}
              emptyMessage="No exceptions found."
            />
          </div>
        )}

        {mainTab === 'shifts' && (
          <div className="p-6">
            <ShiftSummary />
          </div>
        )}
      </Card>

      {correctionTarget && (
        <CorrectionModal
          target={correctionTarget}
          targetData={correctionTarget.type === 'day' 
            ? days.find(d => d.id === correctionTarget.id) 
            : exceptions.find(e => e.id === correctionTarget.id)
          }
          onClose={() => setCorrectionTarget(null)}
          onSubmit={handleSubmitCorrection}
        />
      )}
    </div>
  )
}

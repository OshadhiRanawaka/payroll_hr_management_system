import { useState, useMemo } from 'react'
import { RequireAccess } from '../components/RequireAccess'
import { Badge, Button, Card, Table, Tabs } from '../components/ui'
import type { TableColumn } from '../components/ui'
import { 
  departments, 
  employees, 
  leaveTypes, 
  leaveRequests as initialLeaveRequests, 
  leaveBalances 
} from '../data'
import { useRole } from '../lib'
import type { LeaveRequest, LeaveBalance, LeaveType, Employee } from '../types'

export default function LeavePage() {
  const { activeRoleId, currentUser, getSectionAccess } = useRole()
  const access = getSectionAccess('leave')
  const isReadOnly = access === 'read_only'
  
  const isDepartmentManager = activeRoleId === 'department_manager'
  const isHR = activeRoleId === 'hr_admin' || activeRoleId === 'hr_manager' || activeRoleId === 'super_admin'
  const managerDeptId = currentUser.departmentId || 'dept-mfg'
  const managerDept = departments.find((d) => d.id === managerDeptId)

  const [mainTab, setMainTab] = useState('requests')
  
  // State for mock request processing
  const [requests, setRequests] = useState<LeaveRequest[]>(initialLeaveRequests)
  const [searchQuery, setSearchQuery] = useState('')

  // Helpers
  const getEmployee = (empId: string) => employees.find((e) => e.id === empId)
  const getLeaveType = (ltId: string) => leaveTypes.find((lt) => lt.id === ltId)

  // Request Scoping
  const isVisibleRequest = (req: LeaveRequest) => {
    const emp = getEmployee(req.employeeId)
    if (!emp) return false

    if (isDepartmentManager && emp.departmentId !== managerDeptId) return false
    
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      if (!emp.fullName.toLowerCase().includes(q) && !emp.employeeCode.toLowerCase().includes(q)) {
        return false
      }
    }
    return true
  }

  const filteredRequests = requests.filter(isVisibleRequest)

  // Two-stage Action Handlers
  const handleAction = (reqId: string, action: 'approve' | 'reject') => {
    setRequests(current => current.map(req => {
      if (req.id !== reqId) return req

      const now = new Date().toISOString()
      const newReq = { ...req }

      if (req.managerApproval.status === 'pending') {
        // Manager Stage Action
        newReq.managerApproval = {
          status: action === 'approve' ? 'approved' : 'rejected',
          approvedBy: currentUser.id,
          approvedAt: now,
          comment: `Action by ${activeRoleId}`
        }
        if (action === 'reject') {
          newReq.overallStatus = 'rejected'
          newReq.hrApproval = { status: 'rejected' } // short-circuit
        }
      } else if (req.managerApproval.status === 'approved' && req.hrApproval.status === 'pending') {
        // HR Stage Action
        newReq.hrApproval = {
          status: action === 'approve' ? 'approved' : 'rejected',
          approvedBy: currentUser.id,
          approvedAt: now,
          comment: `Action by ${activeRoleId}`
        }
        if (action === 'reject') {
          newReq.overallStatus = 'rejected'
        } else {
          newReq.overallStatus = 'approved'
        }
      }
      return newReq
    }))
  }

  // Request Columns
  const requestCols: TableColumn<LeaveRequest>[] = [
    {
      key: 'employee',
      header: 'Employee',
      render: (r) => {
        const emp = getEmployee(r.employeeId)
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
      header: 'Leave Type',
      render: (r) => {
        const lt = getLeaveType(r.leaveTypeId)
        return <Badge variant="neutral">{lt?.name}</Badge>
      }
    },
    {
      key: 'dates',
      header: 'Date Range & Duration',
      render: (r) => (
        <div className="flex flex-col text-xs font-mono">
          <span className="text-ink">{r.startDate} to {r.endDate}</span>
          <span className="text-ink-muted">{r.totalDays} Days</span>
        </div>
      )
    },
    {
      key: 'reason',
      header: 'Reason',
      render: (r) => (
        <div className="max-w-[200px] truncate text-xs text-ink-muted" title={r.reason}>
          {r.reason}
        </div>
      )
    },
    {
      key: 'stage',
      header: 'Approval Stage',
      render: (r) => {
        if (r.overallStatus === 'approved') return <Badge variant="success">Fully Approved</Badge>
        if (r.overallStatus === 'rejected') return <Badge variant="danger">Rejected</Badge>
        if (r.managerApproval.status === 'pending') return <Badge variant="warning">Mgr Stage</Badge>
        if (r.managerApproval.status === 'approved' && r.hrApproval.status === 'pending') return <Badge variant="info">HR Stage</Badge>
        return <Badge variant="neutral">Unknown</Badge>
      }
    },
    {
      key: 'actions',
      header: '',
      align: 'right',
      render: (r) => {
        if (isReadOnly) return null
        if (r.overallStatus !== 'pending') return null

        const isManagerStage = r.managerApproval.status === 'pending'
        const isHrStage = r.managerApproval.status === 'approved' && r.hrApproval.status === 'pending'

        // Access checks
        const canActAsManager = isManagerStage && (isDepartmentManager || isHR)
        const canActAsHR = isHrStage && isHR

        if (!canActAsManager && !canActAsHR) {
           return <span className="text-[10px] text-ink-muted italic">Awaiting other role</span>
        }

        return (
          <div className="flex items-center justify-end gap-2">
            <Button variant="danger" size="sm" onClick={() => handleAction(r.id, 'reject')}>Reject</Button>
            <Button variant="success" size="sm" onClick={() => handleAction(r.id, 'approve')}>Approve</Button>
          </div>
        )
      }
    }
  ]

  // Leave Balances Columns
  type GroupedBalance = { employee: Employee; balances: LeaveBalance[] }
  const groupedBalances: GroupedBalance[] = useMemo(() => {
    const map = new Map<string, GroupedBalance>()
    leaveBalances.forEach(lb => {
      const emp = getEmployee(lb.employeeId)
      if (!emp) return
      if (isDepartmentManager && emp.departmentId !== managerDeptId) return

      if (!map.has(emp.id)) map.set(emp.id, { employee: emp, balances: [] })
      map.get(emp.id)!.balances.push(lb)
    })
    return Array.from(map.values())
  }, [isDepartmentManager, managerDeptId])

  const balanceCols: TableColumn<GroupedBalance>[] = [
    {
      key: 'employee',
      header: 'Employee',
      render: (gb) => (
        <div className="flex flex-col">
          <span className="font-bold text-ink">{gb.employee.fullName}</span>
          <span className="text-xs text-ink-muted">{gb.employee.employeeCode}</span>
        </div>
      )
    },
    {
      key: 'balances',
      header: 'Balances (Type: Remainder / Entitlement)',
      render: (gb) => (
        <div className="flex flex-wrap gap-2">
          {gb.balances.map(b => {
            const lt = getLeaveType(b.leaveTypeId)
            const isLow = b.remainingDays === 0
            return (
              <div key={b.leaveTypeId} className={`px-2 py-1 rounded text-[10px] border ${isLow ? 'bg-danger-subtle border-danger/20 text-danger-text' : 'bg-paper border-paper-border text-ink'}`}>
                <strong>{lt?.code}:</strong> {b.remainingDays} / {b.totalEntitlement}
              </div>
            )
          })}
        </div>
      )
    }
  ]

  // Leave Policies Columns
  const policyCols: TableColumn<LeaveType>[] = [
    {
      key: 'policy',
      header: 'Policy',
      render: (lt) => (
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <Badge variant="accent">{lt.code}</Badge>
            <span className="font-bold text-ink">{lt.name}</span>
          </div>
          <span className="text-[10px] text-ink-muted mt-1 max-w-[200px] truncate" title={lt.description}>
            {lt.description}
          </span>
        </div>
      )
    },
    {
      key: 'entitlement',
      header: 'Entitlement',
      render: (lt) => <span className="font-mono">{lt.entitlementDays} Days</span>
    },
    {
      key: 'accrual',
      header: 'Accrual Rule',
      render: (lt) => <span className="capitalize">{lt.accrualRule.replace('_', ' ')}</span>
    },
    {
      key: 'carryForward',
      header: 'Carry Forward',
      render: (lt) => lt.carryForwardLimit > 0 ? <span className="font-mono">{lt.carryForwardLimit} Days</span> : <span className="text-ink-muted">Not applicable</span>
    },
    {
      key: 'encashment',
      header: 'Encashment',
      render: (lt) => lt.encashmentAllowed ? <Badge variant="success">Allowed</Badge> : <Badge variant="neutral">No</Badge>
    }
  ]

  // Utilization by Department
  const utilizationByDept = useMemo(() => {
    const stats = departments.map(d => ({ id: d.id, name: d.name, totalEntitled: 0, totalUsed: 0 }))
    leaveBalances.forEach(lb => {
      const emp = getEmployee(lb.employeeId)
      if (!emp) return
      const s = stats.find(d => d.id === emp.departmentId)
      if (s) {
        s.totalEntitled += lb.totalEntitlement
        s.totalUsed += lb.usedDays
      }
    })
    return stats.map(s => ({
      ...s,
      percentage: s.totalEntitled > 0 ? Math.round((s.totalUsed / s.totalEntitled) * 100) : 0
    }))
  }, [])

  return (
    <RequireAccess section="leave">
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-paper-border shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-accent uppercase bg-accent-subtle px-2 py-0.5 rounded">
                Attendance & Leave
              </span>
            </div>
            <h1 className="text-2xl font-bold text-ink mt-1">Leave Management</h1>
            <p className="text-xs text-ink-muted mt-0.5">
              Leave requests, approvals, employee balances, and policy configurations.
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
                <strong className="font-bold">Department Scope:</strong> Viewing leaves for <span className="font-semibold underline">{managerDept?.name}</span> only. You can act on requests at the <strong>Manager Stage</strong>.
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
              <span><strong>Read-Only Mode:</strong> Approvals are disabled.</span>
            </div>
            <Badge variant="neutral">Read-Only</Badge>
          </div>
        )}

        <Card padding="none">
          <div className="p-4 border-b border-paper-border">
            <Tabs
              tabs={[
                { id: 'requests', label: 'Leave Requests', count: filteredRequests.filter(r => r.overallStatus === 'pending').length },
                { id: 'balances', label: 'Employee Balances' },
                { id: 'policies', label: 'Leave Policies', count: leaveTypes.length },
                { id: 'utilization', label: 'Dept Utilization' }
              ]}
              activeTab={mainTab}
              onChange={setMainTab}
              variant="underline"
            />
          </div>

          {mainTab === 'requests' && (
            <>
              <div className="p-6 pb-2 border-b border-paper-border">
                <input
                  type="text"
                  placeholder="Search by employee name or code..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="py-2 px-3 text-xs bg-white border border-paper-border rounded-lg text-ink focus:outline-none focus:ring-2 focus:ring-accent max-w-sm w-full"
                />
              </div>
              <div className="p-6">
                <Table
                  columns={requestCols}
                  data={filteredRequests}
                  keyExtractor={(r) => r.id}
                  emptyMessage="No leave requests found."
                />
              </div>
            </>
          )}

          {mainTab === 'balances' && (
            <div className="p-6">
              <Table
                columns={balanceCols}
                data={groupedBalances}
                keyExtractor={(gb) => gb.employee.id}
                emptyMessage="No leave balances found."
              />
            </div>
          )}

          {mainTab === 'policies' && (
            <div className="p-6">
              <Table
                columns={policyCols}
                data={leaveTypes}
                keyExtractor={(lt) => lt.id}
                emptyMessage="No leave policies defined."
              />
            </div>
          )}

          {mainTab === 'utilization' && (
            <div className="p-6 max-w-3xl mx-auto space-y-6">
              <h3 className="text-sm font-bold text-ink border-b border-paper-border pb-2">Leave Utilization by Department</h3>
              {utilizationByDept.map(dept => (
                <div key={dept.id} className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-ink">{dept.name}</span>
                    <span className="font-mono text-ink-muted">{dept.totalUsed} of {dept.totalEntitled} days ({dept.percentage}%)</span>
                  </div>
                  <div className="w-full h-2 bg-paper-border rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${dept.percentage > 80 ? 'bg-danger' : dept.percentage > 50 ? 'bg-warning' : 'bg-success'}`}
                      style={{ width: `${Math.min(dept.percentage, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
              <p className="text-xs text-ink-muted italic mt-4">
                Note: Percentages above 80% indicate high utilization and potential staffing constraints.
              </p>
            </div>
          )}

        </Card>
      </div>
    </RequireAccess>
  )
}

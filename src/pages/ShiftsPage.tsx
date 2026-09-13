import { useState } from 'react'
import { RequireAccess } from '../components/RequireAccess'
import { Badge, Card, Table, Tabs } from '../components/ui'
import type { TableColumn } from '../components/ui'
import { 
  branches, 
  departments, 
  employees, 
  shiftDefinitions, 
  weeklyOffPatterns, 
  branchShiftRules, 
  rosterAssignments, 
  holidays 
} from '../data'
import { useRole } from '../lib'
import type { ShiftDefinition, RosterAssignment, Holiday } from '../types'

export default function ShiftsPage() {
  const { activeRoleId, currentUser, getSectionAccess } = useRole()
  const access = getSectionAccess('shifts')
  const isReadOnly = access === 'read_only'
  
  const isDepartmentManager = activeRoleId === 'department_manager'
  const managerDeptId = currentUser.departmentId || 'dept-mfg'
  const managerDept = departments.find((d) => d.id === managerDeptId)

  const [mainTab, setMainTab] = useState('definitions')
  
  // Roster Filters
  const [selectedDept, setSelectedDept] = useState<string>('all')
  const [selectedBranch, setSelectedBranch] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Roster Scope Filtering
  const getEmployee = (empId: string) => employees.find((e) => e.id === empId)
  
  const isVisibleAssignment = (assign: RosterAssignment) => {
    const emp = getEmployee(assign.employeeId)
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

  const filteredAssignments = rosterAssignments.filter(isVisibleAssignment)

  // Columns for Shift Definitions
  const shiftCols: TableColumn<ShiftDefinition>[] = [
    {
      key: 'code',
      header: 'Shift Code',
      accessor: 'code',
      mono: true,
      width: '120px'
    },
    {
      key: 'name',
      header: 'Shift Name & Type',
      render: (s) => (
        <div className="flex flex-col">
          <span className="font-bold text-ink">{s.name}</span>
          <span className="text-[10px] text-ink-muted uppercase">{s.type}</span>
        </div>
      )
    },
    {
      key: 'timing',
      header: 'Timing',
      render: (s) => (
        <div className="flex items-center gap-2 font-mono text-xs">
          <span>{s.startTime} - {s.endTime}</span>
          {s.crossMidnight && <Badge variant="warning">Cross Midnight</Badge>}
        </div>
      )
    },
    {
      key: 'rules',
      header: 'Rules (Grace / Break)',
      render: (s) => (
        <div className="text-xs text-ink-muted">
          Grace: {s.gracePeriodMinutes}m | Break: {s.breakDurationMinutes}m
        </div>
      )
    },
    {
      key: 'assigned',
      header: 'Assigned Emp.',
      align: 'right',
      render: (s) => {
        // Count active roster assignments
        const count = rosterAssignments.filter(r => r.shiftId === s.id).length
        return <Badge variant="info">{count} Staff</Badge>
      }
    }
  ]

  // Columns for Roster Assignments
  const rosterCols: TableColumn<RosterAssignment>[] = [
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
      key: 'department',
      header: 'Department',
      render: (r) => {
        const emp = getEmployee(r.employeeId)
        const dept = departments.find(d => d.id === emp?.departmentId)
        return <span className="text-xs text-ink-muted">{dept?.name || 'N/A'}</span>
      }
    },
    {
      key: 'shift',
      header: 'Assigned Shift',
      render: (r) => {
        const shift = shiftDefinitions.find(s => s.id === r.shiftId)
        return (
          <div className="flex items-center gap-2">
            <Badge variant="neutral">{shift?.code}</Badge>
            <span className="text-xs text-ink">{shift?.name}</span>
          </div>
        )
      }
    },
    {
      key: 'validity',
      header: 'Validity Period',
      render: (r) => (
        <span className="text-xs font-mono text-ink-muted">
          {r.startDate} to {r.endDate || 'Ongoing'}
        </span>
      )
    }
  ]

  // Columns for Holidays
  const holidayCols: TableColumn<Holiday>[] = [
    {
      key: 'date',
      header: 'Date',
      accessor: 'date',
      mono: true,
      width: '120px'
    },
    {
      key: 'name',
      header: 'Holiday Name',
      accessor: 'name'
    },
    {
      key: 'type',
      header: 'Type',
      render: (h) => (
        <Badge variant={h.type === 'public' ? 'info' : 'success'}>
          {h.type.toUpperCase()}
        </Badge>
      )
    },
    {
      key: 'scope',
      header: 'Applicable Scope',
      render: (h) => {
        if (!h.branchIds || h.branchIds.length === 0) return <span className="text-xs text-ink-muted">Global (All Branches)</span>
        const bNames = h.branchIds.map(id => branches.find(b => b.id === id)?.name).join(', ')
        return <span className="text-xs font-bold text-ink">{bNames} Only</span>
      }
    }
  ]

  const formatDaysOff = (days: number[]) => {
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    return days.map(d => dayNames[d]).join(' & ')
  }

  return (
    <RequireAccess section="shifts">
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-paper-border shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-accent uppercase bg-accent-subtle px-2 py-0.5 rounded">
                Attendance
              </span>
            </div>
            <h1 className="text-2xl font-bold text-ink mt-1">Shift & Roster Management</h1>
            <p className="text-xs text-ink-muted mt-0.5">
              Manage shift definitions, employee rosters, weekly offs, and holidays.
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
                <strong className="font-bold">Department Manager Scope Enforced:</strong> Viewing rosters for <span className="font-semibold underline">{managerDept?.name}</span> only.
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
                { id: 'definitions', label: 'Shift Definitions', count: shiftDefinitions.length },
                { id: 'roster', label: 'Employee Roster', count: filteredAssignments.length },
                { id: 'rules', label: 'Rules & Weekly Offs' },
                { id: 'holidays', label: 'Holiday Calendar', count: holidays.length }
              ]}
              activeTab={mainTab}
              onChange={setMainTab}
              variant="underline"
            />
          </div>

          {mainTab === 'definitions' && (
            <div className="p-6">
              <Table
                columns={shiftCols}
                data={shiftDefinitions}
                keyExtractor={(s) => s.id}
                emptyMessage="No shift definitions found."
              />
            </div>
          )}

          {mainTab === 'roster' && (
            <>
              <div className="p-6 pb-2 border-b border-paper-border">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
              <div className="p-6">
                <Table
                  columns={rosterCols}
                  data={filteredAssignments}
                  keyExtractor={(r) => r.id}
                  emptyMessage="No roster assignments found for the selected criteria."
                />
              </div>
            </>
          )}

          {mainTab === 'rules' && (
            <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Weekly Offs */}
              <div>
                <h3 className="text-sm font-bold text-ink mb-4 border-b border-paper-border pb-2">Weekly Off Patterns</h3>
                <div className="space-y-3">
                  {weeklyOffPatterns.map(wo => (
                    <div key={wo.id} className="p-3 border border-paper-border rounded-xl flex items-center justify-between bg-paper">
                      <div>
                        <div className="text-xs font-bold text-ink">{wo.name}</div>
                        <div className="text-[10px] text-ink-muted mt-1">
                          {wo.departmentId && <span className="mr-2">Dept: {departments.find(d => d.id === wo.departmentId)?.name}</span>}
                          {wo.branchId && <span>Branch: {branches.find(b => b.id === wo.branchId)?.name}</span>}
                          {!wo.departmentId && !wo.branchId && <span>Global Default</span>}
                        </div>
                      </div>
                      <Badge variant="neutral">{formatDaysOff(wo.daysOff)}</Badge>
                    </div>
                  ))}
                </div>
              </div>

              {/* Branch Overrides */}
              <div>
                <h3 className="text-sm font-bold text-ink mb-4 border-b border-paper-border pb-2">Branch-Specific Shift Overrides</h3>
                <div className="space-y-3">
                  {branchShiftRules.map(rule => {
                    const shift = shiftDefinitions.find(s => s.id === rule.shiftId)
                    const branch = branches.find(b => b.id === rule.branchId)
                    return (
                      <div key={rule.id} className="p-3 border border-warning/20 bg-warning-subtle rounded-xl text-xs">
                        <div className="flex items-center gap-2 mb-2">
                          <svg className="size-4 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                          <span className="font-bold text-warning-text">{branch?.name} Rule Override</span>
                        </div>
                        <div className="text-ink-muted mb-1">Shift: <span className="font-bold text-ink">{shift?.name} ({shift?.code})</span></div>
                        <ul className="list-disc pl-5 space-y-0.5 font-mono text-[10px] text-ink">
                          {rule.gracePeriodMinutes !== undefined && (
                            <li>Grace Period: {rule.gracePeriodMinutes}m (Default: {shift?.gracePeriodMinutes}m)</li>
                          )}
                          {rule.breakDurationMinutes !== undefined && (
                            <li>Break Duration: {rule.breakDurationMinutes}m (Default: {shift?.breakDurationMinutes}m)</li>
                          )}
                        </ul>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {mainTab === 'holidays' && (
            <div className="p-6">
              <Table
                columns={holidayCols}
                data={holidays}
                keyExtractor={(h) => h.id}
                emptyMessage="No holidays configured."
              />
            </div>
          )}

        </Card>
      </div>
    </RequireAccess>
  )
}

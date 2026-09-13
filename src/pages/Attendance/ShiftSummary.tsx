import { useRole } from '../../lib'
import { employees, shiftDefinitions, departments } from '../../data'
import { Table, Badge } from '../../components/ui'
import type { TableColumn } from '../../components/ui'
import type { Employee } from '../../types'

export function ShiftSummary() {
  const { activeRoleId, currentUser } = useRole()
  
  const isDepartmentManager = activeRoleId === 'department_manager'
  const managerDeptId = currentUser.departmentId || 'dept-mfg'

  const filteredEmployees = employees.filter((emp) => {
    if (isDepartmentManager && emp.departmentId !== managerDeptId) return false
    return true
  })

  const cols: TableColumn<Employee>[] = [
    {
      key: 'emp',
      header: 'Employee',
      render: (emp) => (
        <div className="flex flex-col">
          <span className="font-bold text-ink">{emp.fullName}</span>
          <span className="text-xs text-ink-muted">{emp.employeeCode}</span>
        </div>
      )
    },
    {
      key: 'dept',
      header: 'Department',
      render: (emp) => <span className="text-xs text-ink">{departments.find(d => d.id === emp.departmentId)?.name}</span>
    },
    {
      key: 'shift',
      header: 'Assigned Shift',
      render: (emp) => {
        // Mock shift assignment based on employmentType or department just for display
        const shiftId = emp.departmentId === 'dept-mfg' 
          ? (emp.id.endsWith('1') ? 'shift-mfg-morning' : 'shift-mfg-night')
          : 'shift-fixed-day'
        const shift = shiftDefinitions.find(s => s.id === shiftId)
        
        return (
          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold text-ink">{shift?.name}</span>
            <span className="text-[10px] text-ink-muted font-mono">{shift?.startTime} - {shift?.endTime}</span>
          </div>
        )
      }
    },
    {
      key: 'status',
      header: 'Status',
      render: () => <Badge variant="success">Active</Badge>
    }
  ]

  return (
    <div className="space-y-4">
      <div className="p-4 bg-paper rounded-xl border border-paper-border flex items-center gap-2">
        <svg className="size-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="text-xs text-ink font-medium">
          Showing shift assignments for visible employees. Full shift definitions and rules are managed in the <strong className="font-bold">Shifts</strong> module.
        </span>
      </div>

      <Table
        columns={cols}
        data={filteredEmployees}
        keyExtractor={e => e.id}
      />
    </div>
  )
}

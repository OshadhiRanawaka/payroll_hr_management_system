import { useState } from 'react'
import { Badge, Button, Card, Table, Tabs } from '../components/ui'
import type { TableColumn } from '../components/ui'
import { branches, departments, designations, employees } from '../data'
import { useRole } from '../lib'
import type { Employee } from '../types'
import { EmployeeProfileModal } from './Employees/EmployeeProfileModal'
import { OrgStructureView } from './Employees/OrgStructureView'

export default function EmployeesPage() {
  const { activeRoleId, currentUser } = useRole()
  const [mainTab, setMainTab] = useState('directory')
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)

  // Filter States
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDept, setSelectedDept] = useState<string>('all')
  const [selectedBranch, setSelectedBranch] = useState<string>('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [selectedType, setSelectedType] = useState<string>('all')

  const isDepartmentManager = activeRoleId === 'department_manager'
  const isAuditor = activeRoleId === 'auditor'

  // Department Manager's department scope
  const managerDeptId = currentUser.departmentId || 'dept-mfg'
  const managerDept = departments.find((d) => d.id === managerDeptId)

  // Apply Role Scope + Filters
  const filteredEmployees = employees.filter((emp) => {
    // 1. Role Scope Restriction: Department Manager sees only their department
    if (isDepartmentManager && emp.departmentId !== managerDeptId) {
      return false
    }

    // 2. Search query (name or code)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      const matchName = emp.fullName.toLowerCase().includes(q)
      const matchCode = emp.employeeCode.toLowerCase().includes(q)
      if (!matchName && !matchCode) return false
    }

    // 3. Department Filter
    if (!isDepartmentManager && selectedDept !== 'all' && emp.departmentId !== selectedDept) {
      return false
    }

    // 4. Branch Filter
    if (selectedBranch !== 'all' && emp.branchId !== selectedBranch) {
      return false
    }

    // 5. Status Filter
    if (selectedStatus !== 'all' && emp.status !== selectedStatus) {
      return false
    }

    // 6. Type Filter
    if (selectedType !== 'all' && emp.employmentType !== selectedType) {
      return false
    }

    return true
  })

  // Table Columns
  const employeeCols: TableColumn<Employee>[] = [
    {
      key: 'code',
      header: 'Emp Code',
      accessor: 'employeeCode',
      mono: true,
      width: '110px',
    },
    {
      key: 'name',
      header: 'Employee Name',
      render: (emp) => (
        <div className="flex items-center gap-3">
          <div className="size-8 rounded-full bg-accent-subtle text-accent font-bold text-xs flex items-center justify-center shrink-0 border border-accent/20">
            {emp.firstName[0]}
            {emp.lastName[0]}
          </div>
          <div>
            <div className="font-bold text-ink hover:text-accent transition-colors">{emp.fullName}</div>
            <div className="text-[10px] text-ink-muted">{emp.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'dept',
      header: 'Department',
      render: (emp) => departments.find((d) => d.id === emp.departmentId)?.name || 'N/A',
    },
    {
      key: 'branch',
      header: 'Branch Location',
      render: (emp) => branches.find((b) => b.id === emp.branchId)?.name || 'N/A',
    },
    {
      key: 'desig',
      header: 'Designation & Grade',
      render: (emp) => {
        const title = designations.find((d) => d.id === emp.designationId)?.title || 'Staff'
        return (
          <div className="space-y-0.5">
            <div className="text-xs text-ink">{title}</div>
            <Badge variant="info">Grade {emp.grade}</Badge>
          </div>
        )
      },
    },
    {
      key: 'type',
      header: 'Type',
      render: (emp) => (
        <span className="capitalize text-xs text-ink font-mono">
          {emp.employmentType.replace('_', ' ')}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (emp) => {
        const variant =
          emp.status === 'active'
            ? 'success'
            : emp.status === 'probation'
              ? 'warning'
              : emp.status === 'on_leave'
                ? 'info'
                : 'neutral'
        return <Badge variant={variant}>{emp.status.replace('_', ' ')}</Badge>
      },
    },
    {
      key: 'salary',
      header: 'Gross Salary (LKR)',
      accessor: (emp) => `LKR ${emp.grossSalary.toLocaleString()}`,
      align: 'right',
      mono: true,
    },
    {
      key: 'actions',
      header: 'Action',
      align: 'center',
      render: (emp) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation()
            setSelectedEmployee(emp)
          }}
        >
          View Profile
        </Button>
      ),
    },
  ]

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-paper-border shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-accent uppercase bg-accent-subtle px-2 py-0.5 rounded">
              Employee Management
            </span>
            <span className="text-xs text-ink-muted font-mono">• Specification §4.2 & §8</span>
          </div>
          <h1 className="text-2xl font-bold text-ink mt-1">Employees Directory & Organization</h1>
          <p className="text-xs text-ink-muted mt-0.5">
            Centralized employee profiles, compensation details, bank info, and departmental structure.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {!isAuditor && (
            <Button variant="primary" size="sm" onClick={() => alert('New Employee onboarding flow.')}>
              + Add Employee
            </Button>
          )}
        </div>
      </div>

      {/* Role Data-Scope Banners */}
      {isDepartmentManager && (
        <div className="p-4 rounded-xl bg-info-subtle border border-info/20 text-info-text text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg className="size-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <strong className="font-bold">Department Manager Scope Enforced (§9):</strong> Directory automatically restricted to your department (<span className="font-semibold underline">{managerDept?.name}</span>).
            </div>
          </div>
          <Badge variant="info">Own Dept Scope</Badge>
        </div>
      )}

      {isAuditor && (
        <div className="p-4 rounded-xl bg-paper border border-paper-border text-ink-muted text-xs flex items-center justify-between font-mono">
          <div className="flex items-center gap-2">
            <svg className="size-5 text-accent shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span><strong>Auditor Read-Only Mode:</strong> Displaying audited records. Profile editing controls are disabled for compliance.</span>
          </div>
          <Badge variant="neutral">Read-Only</Badge>
        </div>
      )}

      {/* Main Tabs (Directory vs Organization Structure) */}
      <Card padding="none">
        <div className="p-4 border-b border-paper-border">
          <Tabs
            tabs={[
              { id: 'directory', label: 'Employee Directory', count: filteredEmployees.length },
              { id: 'organization', label: 'Organization Structure', count: departments.length },
            ]}
            activeTab={mainTab}
            onChange={setMainTab}
            variant="underline"
          />
        </div>

        {mainTab === 'directory' && (
          <div className="p-6 space-y-4">
            {/* Search & Filter Controls Toolbar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 bg-paper p-4 rounded-xl border border-paper-border">
              {/* Search input */}
              <div className="lg:col-span-2 relative">
                <input
                  type="text"
                  placeholder="Search by name or EMP code..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-3 pr-8 py-2 text-xs bg-white border border-paper-border rounded-lg text-ink focus:outline-none focus:ring-2 focus:ring-accent"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-2.5 text-ink-muted hover:text-ink text-xs"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Dept filter (disabled for Dept Manager) */}
              <select
                value={isDepartmentManager ? managerDeptId : selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                disabled={isDepartmentManager}
                className="py-2 px-3 text-xs bg-white border border-paper-border rounded-lg text-ink focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-60 cursor-pointer"
              >
                <option value="all">All Departments</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>

              {/* Branch filter */}
              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className="py-2 px-3 text-xs bg-white border border-paper-border rounded-lg text-ink focus:outline-none focus:ring-2 focus:ring-accent cursor-pointer"
              >
                <option value="all">All Branches</option>
                {branches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>

              {/* Status filter */}
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="py-2 px-3 text-xs bg-white border border-paper-border rounded-lg text-ink focus:outline-none focus:ring-2 focus:ring-accent cursor-pointer"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="probation">Probation</option>
                <option value="on_leave">On Leave</option>
                <option value="resigned">Resigned</option>
              </select>

              {/* Employment Type filter */}
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="py-2 px-3 text-xs bg-white border border-paper-border rounded-lg text-ink focus:outline-none focus:ring-2 focus:ring-accent cursor-pointer"
              >
                <option value="all">All Types</option>
                <option value="full_time">Full-Time</option>
                <option value="contract">Contract</option>
                <option value="probation">Probation</option>
                <option value="intern">Intern</option>
              </select>
            </div>

            {/* Employee Directory Table */}
            <Table
              columns={employeeCols}
              data={filteredEmployees}
              keyExtractor={(emp) => emp.id}
              onRowClick={(emp) => setSelectedEmployee(emp)}
              emptyMessage="No employees found matching your filter criteria."
            />
          </div>
        )}

        {mainTab === 'organization' && (
          <div className="p-6">
            <OrgStructureView />
          </div>
        )}
      </Card>

      {/* Employee Profile View Modal */}
      <EmployeeProfileModal
        employee={selectedEmployee}
        onClose={() => setSelectedEmployee(null)}
      />
    </div>
  )
}

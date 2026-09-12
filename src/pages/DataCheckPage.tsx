import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Badge, Button, Card, StatCard, StatusBadge, Table, Tabs } from '../components/ui'
import type { TableColumn } from '../components/ui'
import {
  attendanceDays,
  attendanceEvents,
  attendanceExceptions,
  biometricDevices,
  branches,
  company,
  departments,
  designations,
  employeeLoans,
  employees,
  leaveRequests,
  leaveTypes,
  payrollRuns,
  payslips,
  roles,
  shiftDefinitions,
  syncLogs,
} from '../data'
import type { Employee, BiometricDevice, PayrollRun, LeaveRequest } from '../types'

export default function DataCheckPage() {
  const [activeTab, setActiveTab] = useState('overview')

  const domainTabs = [
    { id: 'overview', label: 'Summary Overview', count: 7 },
    { id: 'org', label: '1. Organization', count: branches.length + departments.length },
    { id: 'employees', label: '2. Employees', count: employees.length },
    { id: 'biometrics', label: '3. Biometrics', count: biometricDevices.length },
    { id: 'attendance', label: '4. Attendance', count: attendanceDays.length },
    { id: 'leave', label: '5. Leave', count: leaveRequests.length },
    { id: 'payroll', label: '6. Payroll', count: payrollRuns.length },
    { id: 'roles', label: '7. Roles & Access', count: roles.length },
  ]

  // Employee table columns
  const employeeCols: TableColumn<Employee>[] = [
    { key: 'code', header: 'Emp Code', accessor: 'employeeCode', mono: true },
    { key: 'name', header: 'Full Name', accessor: 'fullName' },
    {
      key: 'dept',
      header: 'Department',
      render: (emp) => departments.find((d) => d.id === emp.departmentId)?.name || 'N/A',
    },
    {
      key: 'branch',
      header: 'Branch',
      render: (emp) => branches.find((b) => b.id === emp.branchId)?.name || 'N/A',
    },
    { key: 'type', header: 'Type', accessor: 'employmentType' },
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
      accessor: (emp) => emp.grossSalary.toLocaleString(),
      align: 'right',
      mono: true,
    },
  ]

  // Device table columns
  const deviceCols: TableColumn<BiometricDevice>[] = [
    { key: 'code', header: 'Code', accessor: 'deviceCode', mono: true },
    { key: 'name', header: 'Device Name', accessor: 'deviceName' },
    {
      key: 'branch',
      header: 'Branch',
      render: (dev) => branches.find((b) => b.id === dev.branchId)?.name || 'N/A',
    },
    { key: 'location', header: 'Location', accessor: 'locationName' },
    { key: 'ip', header: 'IP Address', accessor: 'ipAddress', mono: true },
    {
      key: 'status',
      header: 'Health Status',
      render: (dev) => {
        const variant =
          dev.healthStatus === 'online'
            ? 'success'
            : dev.healthStatus === 'degraded'
              ? 'warning'
              : 'danger'
        return <Badge variant={variant} dot>{dev.healthStatus}</Badge>
      },
    },
    { key: 'queued', header: 'Queued Punches', accessor: 'queuedUnsyncedCount', align: 'right', mono: true },
  ]

  // Payroll table columns
  const payrollCols: TableColumn<PayrollRun>[] = [
    { key: 'period', header: 'Period Name', accessor: 'periodName' },
    { key: 'dates', header: 'Dates', render: (p) => `${p.startDate} → ${p.endDate}`, mono: true },
    { key: 'count', header: 'Employees', accessor: 'employeeCount', align: 'right', mono: true },
    {
      key: 'gross',
      header: 'Gross Total (LKR)',
      accessor: (p) => `LKR ${p.grossTotal.toLocaleString()}`,
      align: 'right',
      mono: true,
    },
    {
      key: 'net',
      header: 'Net Total (LKR)',
      accessor: (p) => `LKR ${p.netTotal.toLocaleString()}`,
      align: 'right',
      mono: true,
    },
    {
      key: 'status',
      header: 'Maker-Checker Status',
      render: (p) => {
        const variant =
          p.status === 'paid'
            ? 'success'
            : p.status === 'locked'
              ? 'info'
              : p.status === 'approved'
                ? 'success'
                : p.status === 'submitted'
                  ? 'warning'
                  : 'neutral'
        return <StatusBadge status={p.status} customVariant={variant} />
      },
    },
    { key: 'maker', header: 'Maker (Created By)', accessor: 'createdBy', mono: true },
    { key: 'checker', header: 'Checker (Approved By)', render: (p) => p.approvedBy || '—', mono: true },
  ]

  // Leave table columns
  const leaveCols: TableColumn<LeaveRequest>[] = [
    {
      key: 'emp',
      header: 'Employee',
      render: (lvr) => employees.find((e) => e.id === lvr.employeeId)?.fullName || lvr.employeeId,
    },
    {
      key: 'type',
      header: 'Leave Type',
      render: (lvr) => leaveTypes.find((t) => t.id === lvr.leaveTypeId)?.name || lvr.leaveTypeId,
    },
    { key: 'dates', header: 'Dates', render: (lvr) => `${lvr.startDate} to ${lvr.endDate}`, mono: true },
    { key: 'days', header: 'Days', accessor: 'totalDays', align: 'right', mono: true },
    { key: 'reason', header: 'Reason', accessor: 'reason' },
    {
      key: 'mgr',
      header: 'Manager Gate',
      render: (lvr) => (
        <Badge variant={lvr.managerApproval.status === 'approved' ? 'success' : lvr.managerApproval.status === 'rejected' ? 'danger' : 'warning'}>
          {lvr.managerApproval.status}
        </Badge>
      ),
    },
    {
      key: 'hr',
      header: 'HR Gate',
      render: (lvr) => (
        <Badge variant={lvr.hrApproval.status === 'approved' ? 'success' : lvr.hrApproval.status === 'rejected' ? 'danger' : 'warning'}>
          {lvr.hrApproval.status}
        </Badge>
      ),
    },
    {
      key: 'overall',
      header: 'Overall Status',
      render: (lvr) => <StatusBadge status={lvr.overallStatus} />,
    },
  ]

  return (
    <div className="min-h-screen bg-paper text-ink p-6 space-y-6">
      {/* Top Header & Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-paper-border shadow-xs">
        <div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-accent-subtle text-accent font-mono">
              DATA LAYER INSPECTION
            </span>
            <span className="text-xs text-ink-muted font-mono">v1.0.0-mock</span>
          </div>
          <h1 className="text-2xl font-bold text-ink mt-1">
            PeopleFlow HR Mock Data Validation
          </h1>
          <p className="text-sm text-ink-muted mt-1">
            Verification view for <strong className="text-ink">{company.name}</strong> mock dataset across 7 database domains.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/style-guide">
            <Button variant="secondary" size="sm">
              Design System Style Guide
            </Button>
          </Link>
          <Link to="/">
            <Button variant="primary" size="sm">
              Home
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Company Headcount"
          value={company.totalHeadcount.toLocaleString()}
          subtitle={`${branches.length} Branches • ${departments.length} Departments`}
          icon={
            <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          }
        />
        <StatCard
          title="Loaded Employees"
          value={employees.length}
          subtitle={`${employees.filter((e) => e.status === 'active').length} Active • ${employees.filter((e) => e.status === 'probation').length} Probation`}
          icon={
            <svg className="w-5 h-5 text-info" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          }
        />
        <StatCard
          title="Biometric Devices"
          value={biometricDevices.length}
          subtitle={`${biometricDevices.filter((d) => d.healthStatus === 'online').length} Online • ${biometricDevices.filter((d) => d.healthStatus === 'offline').length} Offline`}
          icon={
            <svg className="w-5 h-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 004 11c0 2.473.345 4.866.99 7.132M13 11a1 1 0 11-2 0 1 1 0 012 0z" />
            </svg>
          }
        />
        <StatCard
          title="Latest Gross Payroll"
          value="LKR 238.1M"
          subtitle="August 2026 Run (Submitted State)"
          accent
          icon={
            <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
      </div>

      {/* Tabs Navigation */}
      <Card padding="none">
        <div className="p-4 border-b border-paper-border">
          <Tabs tabs={domainTabs} activeTab={activeTab} onChange={setActiveTab} />
        </div>

        <div className="p-6">
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                  <div className="flex items-center justify-between pb-3 border-b border-paper-border">
                    <h3 className="font-semibold text-ink">1. Organization Domain</h3>
                    <Badge variant="info">{branches.length} Branches</Badge>
                  </div>
                  <ul className="mt-3 space-y-2 text-sm">
                    <li className="flex justify-between text-ink-muted">
                      <span>Company Name:</span>
                      <strong className="text-ink">{company.name}</strong>
                    </li>
                    <li className="flex justify-between text-ink-muted">
                      <span>Registration / Tax ID:</span>
                      <span className="font-mono text-ink">{company.taxId}</span>
                    </li>
                    <li className="flex justify-between text-ink-muted">
                      <span>Departments:</span>
                      <strong className="text-ink">{departments.length} Depts</strong>
                    </li>
                    <li className="flex justify-between text-ink-muted">
                      <span>Designations & Grades:</span>
                      <strong className="text-ink">{designations.length} Roles</strong>
                    </li>
                  </ul>
                </Card>

                <Card>
                  <div className="flex items-center justify-between pb-3 border-b border-paper-border">
                    <h3 className="font-semibold text-ink">2. Employee Domain</h3>
                    <Badge variant="success">{employees.length} Records</Badge>
                  </div>
                  <ul className="mt-3 space-y-2 text-sm">
                    <li className="flex justify-between text-ink-muted">
                      <span>Total Seeded Profiles:</span>
                      <strong className="text-ink font-mono">{employees.length} employees</strong>
                    </li>
                    <li className="flex justify-between text-ink-muted">
                      <span>Full-Time Staff:</span>
                      <span className="font-mono text-ink">
                        {employees.filter((e) => e.employmentType === 'full_time').length}
                      </span>
                    </li>
                    <li className="flex justify-between text-ink-muted">
                      <span>Probation / Intern / Contract:</span>
                      <span className="font-mono text-ink">
                        {employees.filter((e) => e.employmentType !== 'full_time').length}
                      </span>
                    </li>
                    <li className="flex justify-between text-ink-muted">
                      <span>Avg Gross Salary:</span>
                      <span className="font-mono text-ink">
                        LKR {Math.round(employees.reduce((acc, e) => acc + e.grossSalary, 0) / employees.length).toLocaleString()}
                      </span>
                    </li>
                  </ul>
                </Card>

                <Card>
                  <div className="flex items-center justify-between pb-3 border-b border-paper-border">
                    <h3 className="font-semibold text-ink">3. Biometric Domain</h3>
                    <Badge variant="warning">{biometricDevices.length} Terminals</Badge>
                  </div>
                  <ul className="mt-3 space-y-2 text-sm">
                    <li className="flex justify-between text-ink-muted">
                      <span>Hardware Terminals:</span>
                      <strong className="text-ink font-mono">{biometricDevices.length} devices</strong>
                    </li>
                    <li className="flex justify-between text-ink-muted">
                      <span>Online Status:</span>
                      <span className="text-success-text font-medium">
                        {biometricDevices.filter((d) => d.healthStatus === 'online').length} online
                      </span>
                    </li>
                    <li className="flex justify-between text-ink-muted">
                      <span>Degraded / Offline:</span>
                      <span className="text-danger-text font-medium">
                        {biometricDevices.filter((d) => d.healthStatus !== 'online').length} attention
                      </span>
                    </li>
                    <li className="flex justify-between text-ink-muted">
                      <span>Queued Unsynced Punches:</span>
                      <span className="font-mono text-ink">
                        {biometricDevices.reduce((acc, d) => acc + d.queuedUnsyncedCount, 0)} records
                      </span>
                    </li>
                  </ul>
                </Card>

                <Card>
                  <div className="flex items-center justify-between pb-3 border-b border-paper-border">
                    <h3 className="font-semibold text-ink">4. Attendance Domain</h3>
                    <Badge variant="info">{attendanceDays.length} Processed</Badge>
                  </div>
                  <ul className="mt-3 space-y-2 text-sm">
                    <li className="flex justify-between text-ink-muted">
                      <span>Shift Definitions:</span>
                      <strong className="text-ink">{shiftDefinitions.length} Shifts (incl overnight)</strong>
                    </li>
                    <li className="flex justify-between text-ink-muted">
                      <span>Raw Biometric Events:</span>
                      <span className="font-mono text-ink">{attendanceEvents.length} events (Immutable)</span>
                    </li>
                    <li className="flex justify-between text-ink-muted">
                      <span>Processed Day Logs:</span>
                      <span className="font-mono text-ink">{attendanceDays.length} records</span>
                    </li>
                    <li className="flex justify-between text-ink-muted">
                      <span>Exceptions Flagged:</span>
                      <span className="font-mono text-warning-text font-medium">
                        {attendanceExceptions.length} exceptions
                      </span>
                    </li>
                  </ul>
                </Card>

                <Card>
                  <div className="flex items-center justify-between pb-3 border-b border-paper-border">
                    <h3 className="font-semibold text-ink">5. Leave Domain</h3>
                    <Badge variant="info">{leaveTypes.length} Types</Badge>
                  </div>
                  <ul className="mt-3 space-y-2 text-sm">
                    <li className="flex justify-between text-ink-muted">
                      <span>Leave Types Defined:</span>
                      <strong className="text-ink">{leaveTypes.length} categories</strong>
                    </li>
                    <li className="flex justify-between text-ink-muted">
                      <span>Total Requests:</span>
                      <span className="font-mono text-ink">{leaveRequests.length} requests</span>
                    </li>
                    <li className="flex justify-between text-ink-muted">
                      <span>Two-Stage Approvals:</span>
                      <span className="text-ink">Manager → HR chain</span>
                    </li>
                    <li className="flex justify-between text-ink-muted">
                      <span>Approved / Pending:</span>
                      <span className="font-mono text-ink">
                        {leaveRequests.filter((l) => l.overallStatus === 'approved').length} Appr / {leaveRequests.filter((l) => l.overallStatus === 'pending').length} Pend
                      </span>
                    </li>
                  </ul>
                </Card>

                <Card>
                  <div className="flex items-center justify-between pb-3 border-b border-paper-border">
                    <h3 className="font-semibold text-ink">6. Payroll Domain</h3>
                    <Badge variant="success">{payrollRuns.length} Runs</Badge>
                  </div>
                  <ul className="mt-3 space-y-2 text-sm">
                    <li className="flex justify-between text-ink-muted">
                      <span>Payroll Runs Loaded:</span>
                      <strong className="text-ink">{payrollRuns.length} monthly runs</strong>
                    </li>
                    <li className="flex justify-between text-ink-muted">
                      <span>Maker-Checker Gate:</span>
                      <span className="text-success-text font-medium">Enforced (§4.2)</span>
                    </li>
                    <li className="flex justify-between text-ink-muted">
                      <span>Sample Payslips:</span>
                      <span className="font-mono text-ink">{payslips.length} items</span>
                    </li>
                    <li className="flex justify-between text-ink-muted">
                      <span>Active Employee Loans:</span>
                      <span className="font-mono text-ink">{employeeLoans.length} active loans</span>
                    </li>
                  </ul>
                </Card>
              </div>

              <Card>
                <div className="flex items-center justify-between pb-3 border-b border-paper-border">
                  <h3 className="font-semibold text-ink">7. Role-Based Access Control (RBAC) Matrix</h3>
                  <Badge variant="neutral">{roles.length} Roles</Badge>
                </div>
                <p className="text-xs text-ink-muted mt-2 mb-4">
                  Navigation section visibility matrix according to Section 4.3 & 9 of the PeopleFlow HR Specification.
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs font-mono">
                    <thead>
                      <tr className="border-b border-paper-border bg-paper text-left text-ink-muted">
                        <th className="p-2">Role Name</th>
                        <th className="p-2">Dash</th>
                        <th className="p-2">Emp</th>
                        <th className="p-2">Att</th>
                        <th className="p-2">Shift</th>
                        <th className="p-2">Leave</th>
                        <th className="p-2">Pay</th>
                        <th className="p-2">Dev</th>
                        <th className="p-2">Rep</th>
                        <th className="p-2">ESS</th>
                        <th className="p-2">Set</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-paper-border">
                      {roles.map((r) => (
                        <tr key={r.id} className="hover:bg-paper-hover">
                          <td className="p-2 font-sans font-medium text-ink">{r.name}</td>
                          {['dashboard', 'employees', 'attendance', 'shifts', 'leave', 'payroll', 'devices', 'reports', 'self_service', 'settings'].map((sec) => {
                            const p = r.permissions.find((perm) => perm.section === sec)
                            if (!p || !p.visible) return <td key={sec} className="p-2 text-ink-muted">—</td>
                            return (
                              <td key={sec} className="p-2 text-success-text font-bold">
                                {p.access === 'full'
                                  ? '✅'
                                  : p.access === 'own_dept'
                                    ? '👥'
                                    : p.access === 'own_records'
                                      ? '👤'
                                      : p.access === 'read_only'
                                        ? '👁'
                                        : '✅'}
                              </td>
                            )
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          )}

          {/* ORGANIZATION TAB */}
          {activeTab === 'org' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-ink">Company Context</h3>
                <div className="mt-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                  <div className="bg-paper p-3 rounded-lg border border-paper-border">
                    <span className="text-xs text-ink-muted block">Company Name</span>
                    <strong className="text-ink">{company.name}</strong>
                  </div>
                  <div className="bg-paper p-3 rounded-lg border border-paper-border">
                    <span className="text-xs text-ink-muted block">Tax Registration</span>
                    <strong className="text-ink font-mono">{company.taxId}</strong>
                  </div>
                  <div className="bg-paper p-3 rounded-lg border border-paper-border">
                    <span className="text-xs text-ink-muted block">Head Office</span>
                    <strong className="text-ink">{company.address}</strong>
                  </div>
                  <div className="bg-paper p-3 rounded-lg border border-paper-border">
                    <span className="text-xs text-ink-muted block">Total Headcount Target</span>
                    <strong className="text-ink font-mono">{company.totalHeadcount} employees</strong>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-ink mb-3">Branches ({branches.length})</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {branches.map((b) => (
                    <Card key={b.id}>
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-bold text-ink">{b.name}</h4>
                          <span className="text-xs font-mono text-ink-muted">{b.code} • {b.type}</span>
                        </div>
                        <Badge variant="info">{b.headcount} Staff</Badge>
                      </div>
                      <p className="text-xs text-ink-muted mt-2">{b.address}</p>
                      <div className="mt-3 pt-3 border-t border-paper-border flex justify-between text-xs font-mono text-ink-muted">
                        <span>Contact: {b.contactNumber}</span>
                        <span>City: {b.city}</span>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-ink mb-3">Departments ({departments.length})</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {departments.map((d) => (
                    <Card key={d.id}>
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-ink">{d.name}</h4>
                        <span className="text-xs font-mono px-2 py-0.5 rounded bg-accent-subtle text-accent font-semibold">
                          {d.costCenter}
                        </span>
                      </div>
                      <p className="text-xs text-ink-muted mt-2">{d.description}</p>
                      <div className="mt-3 pt-3 border-t border-paper-border flex justify-between text-xs font-mono">
                        <span className="text-ink-muted">Dept Head: {d.headEmployeeId}</span>
                        <strong className="text-ink">{d.employeeCount} employees</strong>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* EMPLOYEES TAB */}
          {activeTab === 'employees' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-ink">Employee Directory Records</h3>
                  <p className="text-xs text-ink-muted">
                    Displaying {employees.length} seeded employee profiles with Sri Lankan banking & payroll metadata.
                  </p>
                </div>
                <Badge variant="success">{employees.length} Total Loaded</Badge>
              </div>

              <Table columns={employeeCols} data={employees} />
            </div>
          )}

          {/* BIOMETRICS TAB */}
          {activeTab === 'biometrics' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-ink mb-2">Branch Biometric Terminals</h3>
                <Table columns={deviceCols} data={biometricDevices} />
              </div>

              <div>
                <h3 className="text-lg font-bold text-ink mb-3">Device Sync Event Logs</h3>
                <div className="space-y-2">
                  {syncLogs.map((log) => (
                    <div
                      key={log.id}
                      className="p-3 rounded-lg border border-paper-border bg-paper flex items-center justify-between text-xs font-mono"
                    >
                      <div className="flex items-center gap-3">
                        <Badge
                          variant={
                            log.status === 'success'
                              ? 'success'
                              : log.status === 'partial'
                                ? 'warning'
                                : 'danger'
                          }
                        >
                          {log.status}
                        </Badge>
                        <span className="text-ink font-bold">{log.deviceId}</span>
                        <span className="text-ink-muted">{log.syncTimestamp}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-ink">{log.eventsSynced} events synced</span>
                        {log.errorMessage && (
                          <span className="text-danger-text max-w-md truncate">{log.errorMessage}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ATTENDANCE TAB */}
          {activeTab === 'attendance' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-ink mb-3">Shift Definitions ({shiftDefinitions.length})</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {shiftDefinitions.map((s) => (
                    <Card key={s.id}>
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-ink">{s.name}</h4>
                        <Badge variant={s.crossMidnight ? 'warning' : 'info'}>
                          {s.type}
                        </Badge>
                      </div>
                      <div className="mt-3 space-y-1 text-xs font-mono text-ink-muted">
                        <div className="flex justify-between">
                          <span>Hours:</span>
                          <strong className="text-ink">{s.startTime} → {s.endTime}</strong>
                        </div>
                        <div className="flex justify-between">
                          <span>Grace Period:</span>
                          <span>{s.gracePeriodMinutes} mins</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Break Duration:</span>
                          <span>{s.breakDurationMinutes} mins</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Cross Midnight:</span>
                          <strong className={s.crossMidnight ? 'text-warning-text' : 'text-ink-muted'}>
                            {s.crossMidnight ? 'YES (Night Shift)' : 'NO'}
                          </strong>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-bold text-ink">Attendance Exceptions Log</h3>
                  <Badge variant="warning">{attendanceExceptions.length} Active Exceptions</Badge>
                </div>
                <div className="space-y-3">
                  {attendanceExceptions.map((exc) => (
                    <Card key={exc.id}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Badge variant={exc.severity === 'high' ? 'danger' : exc.severity === 'medium' ? 'warning' : 'info'}>
                            {exc.severity.toUpperCase()}
                          </Badge>
                          <span className="font-bold text-sm text-ink">{exc.exceptionType.replace(/_/g, ' ')}</span>
                          <span className="text-xs font-mono text-ink-muted">Emp: {exc.employeeId} • Date: {exc.date}</span>
                        </div>
                        <Badge variant={exc.status === 'resolved' ? 'success' : 'warning'}>
                          {exc.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-ink-muted mt-2">{exc.description}</p>
                      {exc.resolutionNote && (
                        <p className="text-xs text-success-text bg-success-subtle p-2 rounded mt-2 font-mono">
                          Resolution: {exc.resolutionNote} (by {exc.resolvedBy})
                        </p>
                      )}
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* LEAVE TAB */}
          {activeTab === 'leave' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-ink mb-3">Leave Categories ({leaveTypes.length})</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {leaveTypes.map((t) => (
                    <Card key={t.id}>
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-ink">{t.name} ({t.code})</h4>
                        <Badge variant="info">{t.entitlementDays} Days/Yr</Badge>
                      </div>
                      <p className="text-xs text-ink-muted mt-2">{t.description}</p>
                      <div className="mt-3 pt-3 border-t border-paper-border flex justify-between text-xs font-mono text-ink-muted">
                        <span>Encashment: {t.encashmentAllowed ? 'Yes' : 'No'}</span>
                        <span>Carry Fwd: {t.carryForwardLimit} days</span>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-ink mb-3">Leave Requests & Two-Stage Approval Chains</h3>
                <Table columns={leaveCols} data={leaveRequests} />
              </div>
            </div>
          )}

          {/* PAYROLL TAB */}
          {activeTab === 'payroll' && (
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-bold text-ink">Payroll Runs (Maker-Checker Flow)</h3>
                  <Badge variant="success">Maker-Checker Gate Enforced</Badge>
                </div>
                <Table columns={payrollCols} data={payrollRuns} />
              </div>

              <div>
                <h3 className="text-lg font-bold text-ink mb-3">Active Employee Loan Recoveries</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {employeeLoans.map((loan) => (
                    <Card key={loan.id}>
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-ink">{loan.loanType.replace('_', ' ').toUpperCase()}</h4>
                        <Badge variant="info">Emp: {loan.employeeId}</Badge>
                      </div>
                      <div className="mt-3 grid grid-cols-2 gap-2 text-xs font-mono">
                        <div>
                          <span className="text-ink-muted block">Principal:</span>
                          <strong className="text-ink">LKR {loan.principalAmount.toLocaleString()}</strong>
                        </div>
                        <div>
                          <span className="text-ink-muted block">Outstanding Balance:</span>
                          <strong className="text-danger-text">LKR {loan.outstandingBalance.toLocaleString()}</strong>
                        </div>
                        <div>
                          <span className="text-ink-muted block">Monthly Deduction:</span>
                          <strong className="text-ink">LKR {loan.installmentAmount.toLocaleString()}</strong>
                        </div>
                        <div>
                          <span className="text-ink-muted block">Remaining:</span>
                          <strong className="text-ink">{loan.installmentsRemaining} months</strong>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ROLES TAB */}
          {activeTab === 'roles' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-ink">System Role Definitions ({roles.length})</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {roles.map((r) => (
                  <Card key={r.id}>
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-ink">{r.name}</h4>
                      <span className="text-xs font-mono bg-paper-border px-2 py-0.5 rounded text-ink font-semibold">
                        {r.id}
                      </span>
                    </div>
                    <p className="text-xs text-ink-muted mt-2">{r.description}</p>
                    <div className="mt-3 pt-3 border-t border-paper-border">
                      <span className="text-xs font-semibold text-ink block mb-1">Visible Nav Sections:</span>
                      <div className="flex flex-wrap gap-1">
                        {r.permissions
                          .filter((p) => p.visible)
                          .map((p) => (
                            <span
                              key={p.section}
                              className="text-[10px] font-mono px-2 py-0.5 rounded bg-accent-subtle text-accent font-medium"
                            >
                              {p.section} ({p.access})
                            </span>
                          ))}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}

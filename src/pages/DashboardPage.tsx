import { Link } from 'react-router-dom'
import { Badge, Button, Card, StatCard, StatusBadge } from '../components/ui'
import {
  attendanceDays,
  attendanceExceptions,
  biometricDevices,
  company,
  employees,
  leaveRequests,
  leaveTypes,
  payrollRuns,
  payslips,
} from '../data'
import { useRole } from '../lib'

export default function DashboardPage() {
  const { activeRole, currentUser } = useRole()

  // 1. Calculations from Mock Data
  const activeHeadcount = employees.filter((e) => e.status === 'active').length
  const recentJoiners = employees.filter((e) => e.hireDate.startsWith('2026')).length
  const resignedCount = employees.filter((e) => e.status === 'resigned').length

  // Attendance metrics
  const totalDays = attendanceDays.length
  const presentDays = attendanceDays.filter((d) => d.status === 'present' || d.status === 'late').length
  const attendanceRate = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 94
  const absentDays = attendanceDays.filter((d) => d.status === 'absent').length
  const absenteeismRate = totalDays > 0 ? (absentDays / totalDays) * 100 : 3.2

  // Payroll metrics (Latest run: August 2026)
  const latestRun = payrollRuns.find((r) => r.id === 'payrun-2026-08') || payrollRuns[0]
  const currentGrossPayroll = latestRun.grossTotal
  const totalOvertimePay = payslips.reduce((acc, p) => acc + p.overtimePay, 0)

  // Open Exceptions & Pending Approvals
  const openAttendanceExceptions = attendanceExceptions.filter((e) => e.status === 'open')
  const pendingLeaveRequests = leaveRequests.filter((l) => l.overallStatus === 'pending')
  const totalOpenExceptions = openAttendanceExceptions.length + pendingLeaveRequests.length

  // Attention Devices (degraded or offline)
  const attentionDevices = biometricDevices.filter((d) => d.healthStatus !== 'online')

  // Payroll Maker-Checker Stage Index (1: Draft, 2: Submitted, 3: Approved, 4: Locked, 5: Paid)
  const payrollStages = [
    { key: 'draft', label: 'Draft' },
    { key: 'submitted', label: 'Submitted (Maker)' },
    { key: 'approved', label: 'Approved (Checker)' },
    { key: 'locked', label: 'Locked' },
    { key: 'paid', label: 'Paid' },
  ]
  const currentStageIndex = payrollStages.findIndex((s) => s.key === latestRun.status)

  // SVG Chart points for Payroll Cost Trend (Last 4 periods from mock data)
  const maxPayroll = Math.max(...payrollRuns.map((r) => r.grossTotal))
  const chartHeight = 120
  const chartWidth = 500

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-paper-border shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-accent-subtle text-accent uppercase">
              Operations Control Room
            </span>
            <span className="text-xs text-ink-muted font-mono">• {company.name}</span>
          </div>
          <h1 className="text-2xl font-bold text-ink mt-1">
            Welcome back, {currentUser.firstName}!
          </h1>
          <p className="text-xs text-ink-muted mt-0.5">
            Viewing workspace as <strong className="text-ink font-semibold">{activeRole.name}</strong>. Here is the operational summary for Nimbus Holdings.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/data-check">
            <Button variant="secondary" size="sm">
              Inspect Data Layer
            </Button>
          </Link>
          <Link to="/payroll">
            <Button variant="primary" size="sm">
              Manage Payroll Runs
            </Button>
          </Link>
        </div>
      </div>

      {/* Row 1: KPI Stat Cards Grid (6 Metrics) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* 1. Active Headcount */}
        <StatCard
          label="Active Headcount"
          value={activeHeadcount}
          subLabel={`${recentJoiners} new hires • ${resignedCount} exit`}
          trend={{ value: 3.2, label: 'vs last month' }}
          sparkline={[1340, 1355, 1360, 1372, 1380, 1385]}
          icon={
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          }
        />

        {/* 2. Today's Attendance Rate */}
        <StatCard
          label="Attendance Rate"
          value={`${attendanceRate}%`}
          subLabel={`${presentDays} present of ${totalDays} tracked`}
          trend={{ value: 1.5, label: 'on-time average' }}
          sparkline={[88, 90, 92, 91, 93, 94]}
          icon={
            <svg className="size-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />

        {/* 3. This Month's Gross Payroll */}
        <StatCard
          label="Gross Payroll"
          value={`LKR ${(currentGrossPayroll / 1000000).toFixed(1)}M`}
          subLabel="August 2026 period"
          trend={{ value: 0.6, label: 'vs July run' }}
          sparkline={[235, 236.8, 238.15]}
          variant="accent"
          icon={
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />

        {/* 4. Overtime Cost */}
        <StatCard
          label="Overtime Cost"
          value={`LKR ${(totalOvertimePay / 1000).toFixed(0)}k`}
          subLabel="Plant & maintenance shift OT"
          trend={{ value: -2.1, label: 'controlled' }}
          sparkline={[65, 61, 58, 56.7]}
          icon={
            <svg className="size-5 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          }
        />

        {/* 5. Absenteeism Rate */}
        <StatCard
          label="Absenteeism Rate"
          value={`${absenteeismRate.toFixed(1)}%`}
          subLabel="Unexcused & missing punch"
          trend={{ value: -0.4, label: 'vs last week' }}
          sparkline={[4.2, 3.8, 3.5, 3.2]}
          icon={
            <svg className="size-5 text-danger" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
          }
        />

        {/* 6. Open Exceptions Count */}
        <StatCard
          label="Open Exceptions"
          value={totalOpenExceptions}
          subLabel={`${openAttendanceExceptions.length} punch • ${pendingLeaveRequests.length} leave`}
          icon={
            <svg className="size-5 text-info" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          }
        />
      </div>

      {/* Row 2: Charts & Current Payroll Run Approval Gate */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Payroll Cost Trend SVG Chart */}
        <Card
          className="lg:col-span-2"
          header={
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-ink">Payroll Cost Trend</h3>
                <p className="text-xs text-ink-muted">Gross payroll disbursements over recent periods (LKR Millions)</p>
              </div>
              <Badge variant="info">6-Period View</Badge>
            </div>
          }
        >
          <div className="pt-2 pb-4 space-y-4">
            <div className="relative w-full h-44 flex items-end">
              <svg className="w-full h-full overflow-visible" viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
                {/* Horizontal Grid lines */}
                {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
                  const y = chartHeight - ratio * chartHeight
                  return (
                    <line
                      key={i}
                      x1="0"
                      y1={y}
                      x2={chartWidth}
                      y2={y}
                      stroke="var(--color-paper-border)"
                      strokeDasharray="4 4"
                    />
                  )
                })}

                {/* Area Gradient Fill & Path */}
                {(() => {
                  const points = payrollRuns.map((r, i) => {
                    const x = (i / (payrollRuns.length - 1)) * chartWidth
                    const y = chartHeight - (r.grossTotal / maxPayroll) * (chartHeight * 0.7)
                    return { x, y, r }
                  })

                  const pathD = points.reduce((acc, p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`), '')
                  const areaD = `${pathD} L ${chartWidth} ${chartHeight} L 0 ${chartHeight} Z`

                  return (
                    <>
                      <defs>
                        <linearGradient id="payrollGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#0d9488" stopOpacity="0.25" />
                          <stop offset="100%" stopColor="#0d9488" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      <path d={areaD} fill="url(#payrollGradient)" />
                      <path d={pathD} fill="none" stroke="#0d9488" strokeWidth="2.5" strokeLinecap="round" />

                      {/* Data dots */}
                      {points.map((p, i) => (
                        <g key={i} className="group cursor-pointer">
                          <circle cx={p.x} cy={p.y} r="4" fill="#0d9488" stroke="#ffffff" strokeWidth="2" />
                          <text
                            x={p.x}
                            y={p.y - 10}
                            textAnchor="middle"
                            className="text-[10px] font-mono font-bold fill-ink"
                          >
                            {(p.r.grossTotal / 1000000).toFixed(1)}M
                          </text>
                        </g>
                      ))}
                    </>
                  )
                })()}
              </svg>
            </div>

            {/* X-Axis Labels */}
            <div className="flex justify-between text-xs font-mono text-ink-muted border-t border-paper-border pt-2">
              {payrollRuns.map((r) => (
                <div key={r.id} className="text-center">
                  <span className="block font-medium text-ink">{r.periodName.split(' ')[0]}</span>
                  <span className="text-[10px]">{r.periodName.split(' ')[1]}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Current Payroll Run & Maker-Checker Progress Card */}
        <Card
          header={
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-ink">Current Payroll Run</h3>
              <StatusBadge status={latestRun.status} />
            </div>
          }
        >
          <div className="space-y-4">
            <div className="bg-paper p-3 rounded-lg border border-paper-border">
              <div className="text-xs font-semibold text-ink">{latestRun.periodName}</div>
              <div className="text-[11px] font-mono text-ink-muted mt-0.5">
                Pay Date: {latestRun.payDate} • {latestRun.employeeCount} Employees
              </div>
            </div>

            {/* Figures Grid */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
              <div className="bg-paper p-2 rounded border border-paper-border">
                <span className="text-[10px] text-ink-muted block">Gross Total</span>
                <strong className="text-ink font-bold">LKR {(latestRun.grossTotal / 1000000).toFixed(1)}M</strong>
              </div>
              <div className="bg-paper p-2 rounded border border-paper-border">
                <span className="text-[10px] text-ink-muted block">Deductions</span>
                <strong className="text-danger-text font-bold">LKR {(latestRun.deductionsTotal / 1000000).toFixed(1)}M</strong>
              </div>
              <div className="bg-paper p-2 rounded border border-paper-border">
                <span className="text-[10px] text-ink-muted block">Net Total</span>
                <strong className="text-success-text font-bold">LKR {(latestRun.netTotal / 1000000).toFixed(1)}M</strong>
              </div>
            </div>

            {/* Maker-Checker Progress Indicator */}
            <div className="space-y-2 pt-2 border-t border-paper-border">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-ink">Maker-Checker Gate (§4.2)</span>
                <span className="font-mono text-xs font-semibold text-accent">
                  Stage {currentStageIndex + 1} of 5
                </span>
              </div>

              {/* Progress Steps Bar */}
              <div className="flex items-center gap-1">
                {payrollStages.map((stage, idx) => {
                  const isCompleted = idx < currentStageIndex
                  const isCurrent = idx === currentStageIndex
                  return (
                    <div
                      key={stage.key}
                      className={[
                        'h-2 flex-1 rounded-full transition-all',
                        isCompleted
                          ? 'bg-success'
                          : isCurrent
                            ? 'bg-accent animate-pulse'
                            : 'bg-paper-border',
                      ].join(' ')}
                      title={stage.label}
                    />
                  )
                })}
              </div>

              <div className="text-[11px] font-mono text-ink-muted pt-1 space-y-1">
                <div className="flex justify-between">
                  <span>Maker (Created By):</span>
                  <strong className="text-ink">{latestRun.createdBy} (Dilini W.)</strong>
                </div>
                <div className="flex justify-between">
                  <span>Checker Approval:</span>
                  <strong className={latestRun.approvedBy ? 'text-success-text' : 'text-warning-text'}>
                    {latestRun.approvedBy ? `${latestRun.approvedBy}` : 'Pending Checker Sign-Off'}
                  </strong>
                </div>
              </div>
            </div>

            <Link to="/payroll" className="block pt-1">
              <Button variant="secondary" size="sm" className="w-full">
                Review & Action Payroll Run
              </Button>
            </Link>
          </div>
        </Card>
      </div>

      {/* Row 3: Previews Grid (Attendance Exceptions, Pending Approvals, Device Health) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* 1. Attendance Exceptions Preview */}
        <Card
          header={
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-ink">High-Severity Exceptions</h3>
                <p className="text-xs text-ink-muted">Punch missing, late arrivals & OT over-limit</p>
              </div>
              <Badge variant="warning">{openAttendanceExceptions.length} Open</Badge>
            </div>
          }
        >
          <div className="space-y-3">
            {attendanceExceptions.slice(0, 3).map((exc) => (
              <div
                key={exc.id}
                className="p-3 rounded-lg bg-paper border border-paper-border hover:border-paper-border-hover transition-colors space-y-1"
              >
                <div className="flex items-center justify-between">
                  <Badge variant={exc.severity === 'high' ? 'danger' : exc.severity === 'medium' ? 'warning' : 'info'}>
                    {exc.severity.toUpperCase()}
                  </Badge>
                  <span className="text-[10px] font-mono text-ink-muted">{exc.date}</span>
                </div>
                <div className="text-xs font-semibold text-ink mt-1">{exc.description}</div>
                <div className="flex items-center justify-between text-[11px] font-mono text-ink-muted pt-1">
                  <span>Employee: {exc.employeeId}</span>
                  <Badge variant={exc.status === 'resolved' ? 'success' : 'warning'}>
                    {exc.status}
                  </Badge>
                </div>
              </div>
            ))}

            <Link to="/attendance" className="block text-center pt-1">
              <Button variant="ghost" size="sm" className="w-full">
                View All Attendance Exceptions →
              </Button>
            </Link>
          </div>
        </Card>

        {/* 2. Pending Approvals Preview */}
        <Card
          header={
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-ink">Pending Leave Approvals</h3>
                <p className="text-xs text-ink-muted">Two-stage approval pipeline (Manager → HR)</p>
              </div>
              <Badge variant="info">{pendingLeaveRequests.length} Pending</Badge>
            </div>
          }
        >
          <div className="space-y-3">
            {leaveRequests.slice(0, 3).map((lvr) => {
              const emp = employees.find((e) => e.id === lvr.employeeId)
              const type = leaveTypes.find((t) => t.id === lvr.leaveTypeId)
              return (
                <div
                  key={lvr.id}
                  className="p-3 rounded-lg bg-paper border border-paper-border space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-ink">{emp?.fullName || lvr.employeeId}</span>
                    <Badge variant="accent">{type?.name || lvr.leaveTypeId}</Badge>
                  </div>
                  <div className="text-[11px] font-mono text-ink-muted flex justify-between">
                    <span>{lvr.startDate} → {lvr.endDate}</span>
                    <strong className="text-ink">{lvr.totalDays} Days</strong>
                  </div>
                  <div className="flex items-center gap-2 pt-1 border-t border-paper-border text-[10px]">
                    <span className="text-ink-muted">Approval Chain:</span>
                    <Badge variant={lvr.managerApproval.status === 'approved' ? 'success' : 'warning'}>
                      Mgr: {lvr.managerApproval.status}
                    </Badge>
                    <Badge variant={lvr.hrApproval.status === 'approved' ? 'success' : 'warning'}>
                      HR: {lvr.hrApproval.status}
                    </Badge>
                  </div>
                </div>
              )
            })}

            <Link to="/leave" className="block text-center pt-1">
              <Button variant="ghost" size="sm" className="w-full">
                Go to Leave Approval Desk →
              </Button>
            </Link>
          </div>
        </Card>

        {/* 3. Device Health Preview */}
        <Card
          header={
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-ink">Terminal Health Alerts</h3>
                <p className="text-xs text-ink-muted">Biometric hardware needing sync/network attention</p>
              </div>
              <Badge variant={attentionDevices.length > 0 ? 'warning' : 'success'}>
                {attentionDevices.length} Alerts
              </Badge>
            </div>
          }
        >
          <div className="space-y-3">
            {attentionDevices.map((dev) => (
              <div
                key={dev.id}
                className="p-3 rounded-lg bg-paper border border-paper-border space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-ink">{dev.deviceName}</span>
                  <Badge variant={dev.healthStatus === 'degraded' ? 'warning' : 'danger'} dot>
                    {dev.healthStatus}
                  </Badge>
                </div>
                <div className="text-[11px] font-mono text-ink-muted">{dev.locationName}</div>
                <div className="flex items-center justify-between text-[10px] font-mono pt-1 text-ink-muted">
                  <span>Queued: <strong className="text-danger-text">{dev.queuedUnsyncedCount} punches</strong></span>
                  <span>IP: {dev.ipAddress}</span>
                </div>
              </div>
            ))}

            {attentionDevices.length === 0 && (
              <div className="p-4 text-center text-xs text-success-text font-mono bg-success-subtle rounded-lg">
                All biometric terminals are online and fully synchronized.
              </div>
            )}

            <Link to="/devices" className="block text-center pt-1">
              <Button variant="ghost" size="sm" className="w-full">
                View Hardware Diagnostics →
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  )
}

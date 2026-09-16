import { useState, useMemo } from 'react'
import { RequireAccess } from '../components/RequireAccess'
import { Badge, Button, Card } from '../components/ui'
import { useRole } from '../lib'
import { employees, attendanceDays, payrollRuns, payslips, departments, branches } from '../data'

type ReportId = 'attendance' | 'payroll' | 'headcount' | 'overtime' | 'absenteeism' | 'leave' | 'cost_center' | 'compliance' | 'turnover'

const reportsCatalogue: { id: ReportId; title: string; desc: string; functional: boolean }[] = [
  { id: 'payroll', title: 'Payroll Trend Analysis', desc: 'Gross, net, and deductions across past periods.', functional: true },
  { id: 'attendance', title: 'Attendance Summary', desc: 'Present, late, and absent breakdowns over time.', functional: true },
  { id: 'headcount', title: 'Headcount & Turnover', desc: 'Active headcount trends, joiners, and leavers.', functional: true },
  { id: 'overtime', title: 'Overtime Analysis', desc: 'OT hours and excess costs by department.', functional: false },
  { id: 'absenteeism', title: 'Absenteeism Rates', desc: 'Unplanned leaves and absence trends.', functional: false },
  { id: 'leave', title: 'Leave Utilization', desc: 'Leave balances and taken days analysis.', functional: false },
  { id: 'cost_center', title: 'Cost Center Allocation', desc: 'Payroll costs split across business units.', functional: false },
  { id: 'compliance', title: 'Statutory Compliance', desc: 'EPF, ETF, and PAYE tax totals.', functional: false },
  { id: 'turnover', title: 'Turnover Details', desc: 'Deep dive into exit interviews and retention.', functional: false },
]

export default function ReportsPage() {
  const { currentUser, getSectionAccess, activeRole, activeRoleId } = useRole()
  const access = getSectionAccess('reports')

  const isDeptManager = activeRoleId === 'department_manager'
  const scopedDeptId = isDeptManager ? currentUser.departmentId : 'all'

  const [selectedReportId, setSelectedReportId] = useState<ReportId | null>(null)
  
  // Filters
  const [filterDeptState, setFilterDeptState] = useState<string>('all')
  const filterDept = isDeptManager ? (currentUser.departmentId || 'all') : filterDeptState
  const [filterBranch, setFilterBranch] = useState<string>('all')

  const selectedReport = reportsCatalogue.find(r => r.id === selectedReportId)

  const handleExport = () => {
    // Dummy export action
    alert(`Export started: ${selectedReport?.title} (Demo Only)`)
  }

  // --- Payroll Report Data ---
  const payrollData = useMemo(() => {
    if (selectedReportId !== 'payroll') return []
    // Take last 6 runs (or however many exist)
    const runs = [...payrollRuns].reverse().slice(0, 6).reverse()
    
    return runs.map(run => {
      if (filterDept === 'all') {
        return {
          period: run.periodName.split(' ')[0],
          gross: run.grossTotal,
          net: run.netTotal,
          deductions: run.deductionsTotal
        }
      } else {
        // Calculate scoped to department
        const runPayslips = payslips.filter(p => {
          if (p.payrollRunId !== run.id) return false
          const emp = employees.find(e => e.id === p.employeeId)
          return emp?.departmentId === filterDept
        })
        const gross = runPayslips.reduce((acc, p) => acc + p.grossPay, 0)
        const deductions = runPayslips.reduce((acc, p) => acc + p.totalDeductions, 0)
        const net = runPayslips.reduce((acc, p) => acc + p.netPay, 0)
        return { period: run.periodName.split(' ')[0], gross, net, deductions }
      }
    })
  }, [selectedReportId, filterDept])

  const maxPayroll = Math.max(...payrollData.map(d => d.gross), 1)

  // --- Attendance Report Data ---
  const attendanceData = useMemo(() => {
    if (selectedReportId !== 'attendance') return { present: 0, late: 0, absent: 0, total: 0 }
    
    const filteredDays = attendanceDays.filter(day => {
      const emp = employees.find(e => e.id === day.employeeId)
      if (!emp) return false
      if (filterDept !== 'all' && emp.departmentId !== filterDept) return false
      if (filterBranch !== 'all' && emp.branchId !== filterBranch) return false
      return true
    })

    const present = filteredDays.filter(d => d.status === 'present').length
    const late = filteredDays.filter(d => d.status === 'late').length
    const absent = filteredDays.filter(d => d.status === 'absent').length

    return { present, late, absent, total: filteredDays.length }
  }, [selectedReportId, filterDept, filterBranch])

  // --- Headcount Report Data ---
  const headcountData = useMemo(() => {
    if (selectedReportId !== 'headcount') return []
    
    // Simulate a 6 month headcount trend
    const currentCount = employees.filter(e => {
      if (e.status !== 'active') return false
      if (filterDept !== 'all' && e.departmentId !== filterDept) return false
      return true
    }).length

    // Generate pseudo-historical data based on current
    return [
      { month: 'Apr', count: Math.max(currentCount - 12, 0) },
      { month: 'May', count: Math.max(currentCount - 8, 0) },
      { month: 'Jun', count: Math.max(currentCount - 5, 0) },
      { month: 'Jul', count: Math.max(currentCount - 2, 0) },
      { month: 'Aug', count: Math.max(currentCount - 1, 0) },
      { month: 'Sep', count: currentCount },
    ]
  }, [selectedReportId, filterDept])

  const maxHeadcount = Math.max(...headcountData.map(d => d.count), 10)

  // --- Render Chart SVGs ---
  const renderPayrollChart = () => {
    const chartHeight = 200
    const chartWidth = 700

    return (
      <div className="pt-2 pb-4 space-y-4">
        <div className="relative w-full h-48 flex items-end">
          <svg className="w-full h-full overflow-visible" viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
            {/* Grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
              const y = chartHeight - ratio * chartHeight
              return <line key={i} x1="0" y1={y} x2={chartWidth} y2={y} stroke="var(--color-paper-border)" strokeDasharray="4 4" />
            })}

            {(() => {
              const points = payrollData.map((d, i) => {
                const x = (i / Math.max(payrollData.length - 1, 1)) * chartWidth
                const y = chartHeight - (d.gross / maxPayroll) * (chartHeight * 0.8)
                return { x, y, d }
              })
              
              if (points.length === 0) return null

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

                  {points.map((p, i) => (
                    <g key={i}>
                      <circle cx={p.x} cy={p.y} r="4" fill="#0d9488" stroke="#ffffff" strokeWidth="2" />
                      <text x={p.x} y={p.y - 12} textAnchor="middle" className="text-[10px] font-mono font-bold fill-ink">
                        {(p.d.gross / 1000000).toFixed(1)}M
                      </text>
                    </g>
                  ))}
                </>
              )
            })()}
          </svg>
        </div>
        <div className="flex justify-between text-xs font-mono text-ink-muted border-t border-paper-border pt-2">
          {payrollData.map((d, i) => (
            <span key={i} className="block font-medium text-ink text-center w-full">{d.period}</span>
          ))}
        </div>
      </div>
    )
  }

  const renderHeadcountChart = () => {
    const chartHeight = 200
    const chartWidth = 700

    return (
      <div className="pt-2 pb-4 space-y-4">
        <div className="relative w-full h-48 flex items-end">
          <svg className="w-full h-full overflow-visible" viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
            {[0, 0.5, 1].map((ratio, i) => {
              const y = chartHeight - ratio * chartHeight
              return <line key={i} x1="0" y1={y} x2={chartWidth} y2={y} stroke="var(--color-paper-border)" strokeDasharray="4 4" />
            })}

            {(() => {
              const points = headcountData.map((d, i) => {
                const x = (i / Math.max(headcountData.length - 1, 1)) * chartWidth
                const y = chartHeight - (d.count / maxHeadcount) * (chartHeight * 0.8)
                return { x, y, d }
              })
              
              if (points.length === 0) return null

              const pathD = points.reduce((acc, p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`), '')
              
              return (
                <>
                  <path d={pathD} fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" />
                  {points.map((p, i) => (
                    <g key={i}>
                      <circle cx={p.x} cy={p.y} r="5" fill="#2563eb" stroke="#ffffff" strokeWidth="2" />
                      <text x={p.x} y={p.y - 12} textAnchor="middle" className="text-[10px] font-mono font-bold fill-ink">
                        {p.d.count}
                      </text>
                    </g>
                  ))}
                </>
              )
            })()}
          </svg>
        </div>
        <div className="flex justify-between text-xs font-mono text-ink-muted border-t border-paper-border pt-2">
          {headcountData.map((d, i) => (
            <span key={i} className="block font-medium text-ink text-center w-full">{d.month}</span>
          ))}
        </div>
      </div>
    )
  }

  const renderAttendanceChart = () => {
    const { present, late, absent, total } = attendanceData
    if (total === 0) return <div className="p-8 text-center text-ink-muted text-sm">No attendance data found for this filter.</div>
    
    const pPct = ((present / total) * 100).toFixed(1)
    const lPct = ((late / total) * 100).toFixed(1)
    const aPct = ((absent / total) * 100).toFixed(1)

    return (
      <div className="py-8 space-y-6">
        <div className="flex items-center justify-between font-mono text-xs text-ink-muted">
          <span>0%</span>
          <span>Total Recorded Days: {total}</span>
          <span>100%</span>
        </div>
        
        {/* Stacked Bar */}
        <div className="h-10 w-full flex rounded-lg overflow-hidden border border-paper-border">
          <div style={{ width: `${pPct}%` }} className="bg-success flex items-center justify-center text-white text-[10px] font-bold" title={`Present: ${present}`}>
            {parseFloat(pPct) > 5 && `${pPct}%`}
          </div>
          <div style={{ width: `${lPct}%` }} className="bg-warning flex items-center justify-center text-white text-[10px] font-bold" title={`Late: ${late}`}>
            {parseFloat(lPct) > 5 && `${lPct}%`}
          </div>
          <div style={{ width: `${aPct}%` }} className="bg-danger flex items-center justify-center text-white text-[10px] font-bold" title={`Absent: ${absent}`}>
            {parseFloat(aPct) > 5 && `${aPct}%`}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 pt-4 text-center">
          <div className="p-4 bg-success-subtle rounded-xl border border-success/20">
            <div className="text-2xl font-bold text-success-text">{present}</div>
            <div className="text-xs text-success-text mt-1 uppercase tracking-wide">Present</div>
          </div>
          <div className="p-4 bg-warning-subtle rounded-xl border border-warning/20">
            <div className="text-2xl font-bold text-warning-text">{late}</div>
            <div className="text-xs text-warning-text mt-1 uppercase tracking-wide">Late</div>
          </div>
          <div className="p-4 bg-danger-subtle rounded-xl border border-danger/20">
            <div className="text-2xl font-bold text-danger-text">{absent}</div>
            <div className="text-xs text-danger-text mt-1 uppercase tracking-wide">Absent</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <RequireAccess section="reports">
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-paper-border shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-accent uppercase bg-accent-subtle px-2 py-0.5 rounded">
                Specification §4.13
              </span>
            </div>
            <h1 className="text-2xl font-bold text-ink mt-1">Analytics & Reports</h1>
            <p className="text-xs text-ink-muted mt-0.5">
              Comprehensive data exports, trend analysis, and statutory compliance reports.
            </p>
          </div>
        </div>

        {selectedReport ? (
          <div className="space-y-6">
            <Button variant="ghost" onClick={() => setSelectedReportId(null)} className="text-ink-muted">
              ← Back to Report Catalogue
            </Button>
            
            <Card header={
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-ink">{selectedReport.title}</h2>
                  <p className="text-xs text-ink-muted">{selectedReport.desc}</p>
                </div>
                {selectedReport.functional && (
                  <Button 
                    variant="primary" 
                    onClick={handleExport} 
                    className="shrink-0"
                    iconLeft={
                      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    }
                  >
                    Export Report
                  </Button>
                )}
              </div>
            }>
              {selectedReport.functional ? (
                <div className="space-y-6">
                  {/* Common Filters */}
                  <div className="flex items-center gap-4 bg-paper p-4 rounded-lg border border-paper-border">
                    <div>
                      <label className="block text-[10px] font-bold text-ink-muted uppercase mb-1">Department</label>
                      <select
                        value={filterDept}
                        onChange={e => setFilterDeptState(e.target.value)}
                        disabled={isDeptManager}
                        className="w-48 py-1.5 px-2 text-xs bg-white border border-paper-border rounded text-ink disabled:opacity-50"
                      >
                        <option value="all">All Departments</option>
                        {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                      </select>
                    </div>
                    {selectedReportId === 'attendance' && (
                      <div>
                        <label className="block text-[10px] font-bold text-ink-muted uppercase mb-1">Branch</label>
                        <select
                          value={filterBranch}
                          onChange={e => setFilterBranch(e.target.value)}
                          className="w-48 py-1.5 px-2 text-xs bg-white border border-paper-border rounded text-ink"
                        >
                          <option value="all">All Branches</option>
                          {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                        </select>
                      </div>
                    )}
                  </div>
                  
                  <div className="min-h-[250px]">
                    {selectedReportId === 'payroll' && renderPayrollChart()}
                    {selectedReportId === 'attendance' && renderAttendanceChart()}
                    {selectedReportId === 'headcount' && renderHeadcountChart()}
                  </div>
                </div>
              ) : (
                <div className="p-12 text-center flex flex-col items-center justify-center border border-dashed border-paper-border rounded-xl bg-paper">
                  <svg className="size-10 text-ink-muted mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  <h3 className="text-lg font-bold text-ink">Preview Coming Soon</h3>
                  <p className="text-sm text-ink-muted mt-1 max-w-sm">
                    The detailed view and export capabilities for this report type are currently in development.
                  </p>
                </div>
              )}
            </Card>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reportsCatalogue.map(report => (
              <button
                key={report.id}
                onClick={() => setSelectedReportId(report.id)}
                className="text-left bg-white p-6 rounded-xl border border-paper-border shadow-xs hover:border-accent hover:shadow-sm transition-all group flex flex-col"
              >
                <div className="flex items-center justify-between w-full mb-3">
                  <div className="p-2 bg-paper rounded-lg group-hover:bg-accent-subtle transition-colors">
                    <svg className="size-5 text-ink-muted group-hover:text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  {report.functional ? (
                    <Badge variant="success">Active</Badge>
                  ) : (
                    <Badge variant="neutral">Planned</Badge>
                  )}
                </div>
                <h3 className="font-bold text-ink mb-1 group-hover:text-accent transition-colors">{report.title}</h3>
                <p className="text-xs text-ink-muted line-clamp-2 leading-relaxed">{report.desc}</p>
                
                <div className="mt-auto pt-4 flex items-center text-[10px] font-bold text-accent uppercase tracking-wide opacity-0 group-hover:opacity-100 transition-opacity">
                  View Report →
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </RequireAccess>
  )
}

import { useState, useMemo } from 'react'
import { RequireAccess } from '../components/RequireAccess'
import { Badge, Button, Card, Table, Tabs } from '../components/ui'
import type { TableColumn } from '../components/ui'
import { payrollRuns as initialRuns, payslips, employeeLoans, employees, designations } from '../data'
import { useRole } from '../lib'
import type { PayrollRun, Payslip, EmployeeLoan, PayrollRunStatus, Employee } from '../types'

export default function PayrollPage() {
  const { activeRoleId, currentUser, getSectionAccess } = useRole()
  const access = getSectionAccess('payroll')
  const isReadOnly = access === 'read_only'

  const isMaker = activeRoleId === 'payroll_officer'
  const isChecker = activeRoleId === 'hr_manager' || activeRoleId === 'super_admin'
  const isAuditor = activeRoleId === 'auditor'

  const [mainTab, setMainTab] = useState('runs')
  const [runs, setRuns] = useState<PayrollRun[]>(initialRuns)
  
  // Navigation states for deep views
  const [selectedRunId, setSelectedRunId] = useState<string | null>(null)
  const [selectedPayslipId, setSelectedPayslipId] = useState<string | null>(null)

  // Helpers
  const getEmployee = (id: string) => employees.find(e => e.id === id)
  const formatCurrency = (val: number) => `LKR ${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

  const handleAction = (runId: string, action: 'submit' | 'approve' | 'reject' | 'lock' | 'pay') => {
    setRuns(current => current.map(run => {
      if (run.id !== runId) return run
      const now = new Date().toISOString()
      const newRun = { ...run }

      if (action === 'submit' && run.status === 'draft') {
        newRun.status = 'submitted'
      } else if (action === 'approve' && run.status === 'submitted') {
        newRun.status = 'approved'
        newRun.approvedBy = currentUser.id
        newRun.approvedAt = now
      } else if (action === 'reject' && run.status === 'submitted') {
        newRun.status = 'draft'
      } else if (action === 'lock' && run.status === 'approved') {
        newRun.status = 'locked'
        newRun.lockedAt = now
      } else if (action === 'pay' && run.status === 'locked') {
        newRun.status = 'paid'
      }
      return newRun
    }))
  }

  const handleCreateNewRun = () => {
    // Determine next period (mocking October 2026 since latest is September)
    const nextId = `payrun-2026-10-${Date.now()}`
    
    // Auto-populate eligible employees (active only)
    const eligibleEmployees = employees.filter(e => e.status === 'active')
    
    let grossTotal = 0
    let deductionsTotal = 0
    let netTotal = 0

    // Create payslips for them pulling in mock base data + active loans
    const newPayslips: Payslip[] = eligibleEmployees.map((emp, idx) => {
      const basic = emp.basicSalary || 50000
      const fixed = emp.fixedAllowance || 10000
      const gross = basic + fixed
      const epf = basic * 0.08
      const tax = gross > 100000 ? (gross - 100000) * 0.06 : 0
      const loan = employeeLoans.find(l => l.employeeId === emp.id && l.status === 'active')?.installmentAmount || 0
      const deductions = epf + tax + loan
      const net = gross - deductions

      grossTotal += gross
      deductionsTotal += deductions
      netTotal += net

      return {
        id: `ps-new-${Date.now()}-${idx}`,
        payrollRunId: nextId,
        employeeId: emp.id,
        basicSalary: basic,
        housingAllowance: fixed * 0.6,
        transportAllowance: fixed * 0.4,
        attendanceBonus: 0,
        overtimePay: 0,
        grossPay: gross,
        epfEmployee: epf,
        etfEmployer: basic * 0.03,
        epfEmployer: basic * 0.12,
        payeTax: tax,
        loanDeduction: loan,
        totalDeductions: deductions,
        netPay: net,
        paymentStatus: 'pending' as const
      }
    })

    // Mutate shared data so they appear in the Payslip View
    payslips.push(...newPayslips)

    const newRun: PayrollRun = {
      id: nextId,
      periodName: 'October 2026 Payroll',
      startDate: '2026-10-01',
      endDate: '2026-10-31',
      payDate: '2026-10-31',
      status: 'draft',
      employeeCount: eligibleEmployees.length,
      grossTotal,
      deductionsTotal,
      netTotal,
      createdBy: currentUser.id,
      createdAt: new Date().toISOString()
    }

    setRuns(current => [newRun, ...current])
    setSelectedRunId(newRun.id)
  }

  // --- 1. Payroll Runs Columns ---
  const runCols: TableColumn<PayrollRun>[] = [
    {
      key: 'period',
      header: 'Payroll Period',
      render: (r) => (
        <div className="flex flex-col">
          <span className="font-bold text-ink">{r.periodName}</span>
          <span className="text-[10px] text-ink-muted">{r.startDate} to {r.endDate}</span>
        </div>
      )
    },
    {
      key: 'employees',
      header: 'Headcount',
      render: (r) => <span className="font-mono">{r.employeeCount}</span>
    },
    {
      key: 'gross',
      header: 'Gross Total',
      align: 'right',
      mono: true,
      render: (r) => formatCurrency(r.grossTotal)
    },
    {
      key: 'deductions',
      header: 'Total Deductions',
      align: 'right',
      mono: true,
      render: (r) => <span className="text-danger-text">-{formatCurrency(r.deductionsTotal)}</span>
    },
    {
      key: 'net',
      header: 'Net Total',
      align: 'right',
      mono: true,
      render: (r) => <strong className="text-success-text">{formatCurrency(r.netTotal)}</strong>
    },
    {
      key: 'status',
      header: 'Status',
      render: (r) => {
        switch (r.status) {
          case 'draft': return <Badge variant="neutral">Draft (Setup)</Badge>
          case 'submitted': return <Badge variant="warning">Maker Review</Badge>
          case 'approved': return <Badge variant="info">Checker Approved</Badge>
          case 'locked': return <Badge variant="accent">Locked</Badge>
          case 'paid': return <Badge variant="success">Paid</Badge>
          default: return <Badge variant="neutral">{r.status}</Badge>
        }
      }
    }
  ]

  // --- 2. Payslip View Logic ---
  const activeRun = selectedRunId ? runs.find(r => r.id === selectedRunId) : null
  const runPayslips = useMemo(() => activeRun ? payslips.filter(p => p.payrollRunId === activeRun.id) : [], [activeRun])
  
  const activePayslip = selectedPayslipId ? runPayslips.find(p => p.id === selectedPayslipId) : null
  const activePayslipEmployee = activePayslip ? getEmployee(activePayslip.employeeId) : null

  const payslipCols: TableColumn<Payslip>[] = [
    {
      key: 'emp',
      header: 'Employee',
      render: (p) => {
        const emp = getEmployee(p.employeeId)
        return (
          <div className="flex flex-col">
            <span className="font-bold text-ink hover:text-accent transition-colors">{emp?.fullName}</span>
            <span className="text-xs text-ink-muted">{emp?.employeeCode}</span>
          </div>
        )
      }
    },
    { key: 'gross', header: 'Gross Pay', align: 'right', mono: true, render: p => formatCurrency(p.grossPay) },
    { key: 'deductions', header: 'Deductions', align: 'right', mono: true, render: p => <span className="text-danger-text">-{formatCurrency(p.totalDeductions)}</span> },
    { key: 'net', header: 'Net Pay', align: 'right', mono: true, render: p => <strong className="text-success-text">{formatCurrency(p.netPay)}</strong> },
  ]

  // --- 3. Salary Structures Columns ---
  // Using designations to map standard base pay and allowances for demo
  const salaryStructureCols: TableColumn<typeof designations[0]>[] = [
    {
      key: 'designation',
      header: 'Designation / Grade',
      render: (d) => (
        <div className="flex flex-col">
          <span className="font-bold text-ink">{d.title}</span>
          <span className="text-[10px] text-ink-muted">Grade: {d.grade}</span>
        </div>
      )
    },
    {
      key: 'base',
      header: 'Base Salary',
      align: 'right',
      mono: true,
      render: (d) => {
        // Mock a base salary based on grade
        const base = d.grade === 'L1' ? 60000 : d.grade === 'L2' ? 120000 : d.grade === 'L3' ? 250000 : 400000
        return formatCurrency(base)
      }
    },
    {
      key: 'allowance',
      header: 'Standard Allowances',
      align: 'right',
      mono: true,
      render: (d) => {
        const allow = d.grade === 'L1' ? 20000 : d.grade === 'L2' ? 45000 : d.grade === 'L3' ? 80000 : 150000
        return formatCurrency(allow)
      }
    },
    {
      key: 'epf',
      header: 'Statutory Deductions',
      render: () => <span className="text-xs text-ink-muted">EPF 8%, ETF 3%, PAYE</span>
    }
  ]

  // --- 4. Loans & Advances Columns ---
  const loanCols: TableColumn<EmployeeLoan>[] = [
    {
      key: 'emp',
      header: 'Employee',
      render: (l) => {
        const emp = getEmployee(l.employeeId)
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
      header: 'Loan Type',
      render: (l) => <span className="capitalize">{l.loanType.replace('_', ' ')}</span>
    },
    {
      key: 'principal',
      header: 'Principal Amount',
      align: 'right',
      mono: true,
      render: l => formatCurrency(l.principalAmount)
    },
    {
      key: 'balance',
      header: 'Outstanding Balance',
      align: 'right',
      mono: true,
      render: l => formatCurrency(l.outstandingBalance)
    },
    {
      key: 'installment',
      header: 'Installment Amount',
      align: 'right',
      mono: true,
      render: l => (
        <div className="flex flex-col items-end">
          <span className="font-bold">{formatCurrency(l.installmentAmount)}</span>
          <span className="text-[10px] text-ink-muted">{l.installmentsRemaining} left</span>
        </div>
      )
    },
    {
      key: 'status',
      header: 'Status',
      render: (l) => (
        <Badge variant={l.status === 'active' ? 'success' : l.status === 'completed' ? 'neutral' : 'danger'}>
          {l.status}
        </Badge>
      )
    }
  ]

  return (
    <RequireAccess section="payroll">
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-paper-border shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-accent uppercase bg-accent-subtle px-2 py-0.5 rounded">
                Specification §4.6 & §7
              </span>
            </div>
            <h1 className="text-2xl font-bold text-ink mt-1">Payroll Management</h1>
            <p className="text-xs text-ink-muted mt-0.5">
              Gross-to-net calculation, maker-checker approval gate, and payslip generation.
            </p>
          </div>
          
          {(activeRoleId === 'payroll_officer' || activeRoleId === 'super_admin') && !selectedRunId && mainTab === 'runs' && (
            <Button 
              variant="primary" 
              onClick={handleCreateNewRun} 
              className="shrink-0"
              iconLeft={
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
              }
            >
              New Payroll Run
            </Button>
          )}
        </div>

        {isAuditor && (
          <div className="p-4 rounded-xl bg-paper border border-paper-border text-ink-muted text-xs flex items-center justify-between font-mono">
            <div className="flex items-center gap-2">
              <svg className="size-5 text-accent shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span><strong>Auditor Read-Only Mode:</strong> Approvals and data editing are strictly disabled.</span>
            </div>
            <Badge variant="neutral">Read-Only</Badge>
          </div>
        )}

        {/* Drill-down View: Individual Payslip */}
        {activePayslip && activePayslipEmployee ? (
          <Card className="space-y-6">
            <div className="flex items-center justify-between border-b border-paper-border pb-4">
              <div>
                <Button variant="ghost" size="sm" onClick={() => setSelectedPayslipId(null)} className="mb-2 -ml-2 text-ink-muted">
                  ← Back to Run Details
                </Button>
                <h2 className="text-xl font-bold text-ink">Payslip: {activePayslipEmployee.fullName}</h2>
                <div className="text-sm text-ink-muted">{activeRun?.periodName}</div>
              </div>
              <Badge variant={activePayslip.paymentStatus === 'paid' ? 'success' : 'warning'}>
                {activePayslip.paymentStatus.toUpperCase()}
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Earnings */}
              <div>
                <h3 className="text-sm font-bold text-ink border-b border-paper-border pb-2 mb-4 uppercase tracking-wide">Earnings</h3>
                <div className="space-y-3 font-mono text-sm">
                  <div className="flex justify-between"><span>Basic Salary</span><span>{formatCurrency(activePayslip.basicSalary)}</span></div>
                  <div className="flex justify-between"><span>Housing Allowance</span><span>{formatCurrency(activePayslip.housingAllowance)}</span></div>
                  <div className="flex justify-between"><span>Transport Allowance</span><span>{formatCurrency(activePayslip.transportAllowance)}</span></div>
                  <div className="flex justify-between"><span>Attendance Bonus</span><span>{formatCurrency(activePayslip.attendanceBonus)}</span></div>
                  <div className="flex justify-between"><span>Overtime Pay</span><span>{formatCurrency(activePayslip.overtimePay)}</span></div>
                  <div className="flex justify-between font-bold pt-2 border-t border-paper-border"><span>Gross Pay</span><span>{formatCurrency(activePayslip.grossPay)}</span></div>
                </div>
              </div>

              {/* Deductions */}
              <div>
                <h3 className="text-sm font-bold text-ink border-b border-paper-border pb-2 mb-4 uppercase tracking-wide">Deductions</h3>
                <div className="space-y-3 font-mono text-sm text-danger-text">
                  <div className="flex justify-between"><span>EPF (Employee 8%)</span><span>-{formatCurrency(activePayslip.epfEmployee)}</span></div>
                  <div className="flex justify-between"><span>PAYE Tax</span><span>-{formatCurrency(activePayslip.payeTax)}</span></div>
                  <div className="flex justify-between"><span>Loan Recovery</span><span>-{formatCurrency(activePayslip.loanDeduction)}</span></div>
                  <div className="flex justify-between font-bold pt-2 border-t border-paper-border"><span>Total Deductions</span><span>-{formatCurrency(activePayslip.totalDeductions)}</span></div>
                </div>

                <div className="mt-8 pt-4 border-t-2 border-ink">
                  <div className="flex justify-between font-mono text-lg font-bold text-success-text">
                    <span>NET PAY</span>
                    <span>{formatCurrency(activePayslip.netPay)}</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ) : activeRun ? (
          // Drill-down View: Run Details
          <div className="space-y-6">
            <Button variant="ghost" onClick={() => setSelectedRunId(null)} className="text-ink-muted">
              ← Back to Payroll Runs
            </Button>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="col-span-1 md:col-span-3">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-ink">{activeRun.periodName}</h2>
                    <p className="text-sm text-ink-muted">{activeRun.startDate} to {activeRun.endDate}</p>
                  </div>
                  <Badge variant={activeRun.status === 'draft' ? 'neutral' : activeRun.status === 'submitted' ? 'warning' : activeRun.status === 'approved' ? 'info' : activeRun.status === 'locked' ? 'accent' : 'success'}>
                    {activeRun.status.toUpperCase()}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-3 gap-4 font-mono">
                  <div className="p-4 bg-paper rounded-lg border border-paper-border">
                    <div className="text-xs text-ink-muted mb-1">Gross Total</div>
                    <div className="text-lg font-bold">{formatCurrency(activeRun.grossTotal)}</div>
                  </div>
                  <div className="p-4 bg-danger-subtle rounded-lg border border-danger/20">
                    <div className="text-xs text-danger-text mb-1">Deductions</div>
                    <div className="text-lg font-bold text-danger-text">-{formatCurrency(activeRun.deductionsTotal)}</div>
                  </div>
                  <div className="p-4 bg-success-subtle rounded-lg border border-success/20">
                    <div className="text-xs text-success-text mb-1">Net Payable</div>
                    <div className="text-lg font-bold text-success-text">{formatCurrency(activeRun.netTotal)}</div>
                  </div>
                </div>
              </Card>

              {/* Maker-Checker Block */}
              <Card className="col-span-1 border-2 border-accent/20 bg-accent-subtle/30 flex flex-col justify-center">
                <h3 className="text-sm font-bold text-ink mb-4 border-b border-paper-border pb-2">Maker-Checker Gate</h3>
                
                {!isReadOnly && (
                  <div className="space-y-3">
                    {activeRun.status === 'draft' && isMaker && (
                      <Button variant="primary" className="w-full justify-center" onClick={() => handleAction(activeRun.id, 'submit')}>
                        Submit for Review
                      </Button>
                    )}
                    {activeRun.status === 'draft' && !isMaker && (
                      <p className="text-xs text-ink-muted italic">Awaiting Payroll Officer (Maker) to submit.</p>
                    )}
                    
                    {activeRun.status === 'submitted' && isChecker && (
                      <div className="flex gap-2">
                        <Button variant="danger" className="w-full justify-center" onClick={() => handleAction(activeRun.id, 'reject')}>Reject</Button>
                        <Button variant="success" className="w-full justify-center" onClick={() => handleAction(activeRun.id, 'approve')}>Approve</Button>
                      </div>
                    )}
                    {activeRun.status === 'submitted' && !isChecker && (
                      <p className="text-xs text-ink-muted italic">Awaiting HR/Admin (Checker) approval.</p>
                    )}

                    {activeRun.status === 'approved' && isChecker && (
                      <Button variant="accent" className="w-full justify-center" onClick={() => handleAction(activeRun.id, 'lock')}>
                        Lock Run
                      </Button>
                    )}
                    
                    {activeRun.status === 'locked' && isChecker && (
                      <Button variant="success" className="w-full justify-center" onClick={() => handleAction(activeRun.id, 'pay')}>
                        Mark as Paid
                      </Button>
                    )}

                    {['approved', 'locked', 'paid'].includes(activeRun.status) && !isChecker && (
                      <p className="text-xs text-success-text font-bold">Run is approved and finalized.</p>
                    )}
                  </div>
                )}
                
                <div className="mt-4 pt-4 border-t border-paper-border text-xs text-ink-muted space-y-1">
                  <div><strong>Maker:</strong> {getEmployee(activeRun.createdBy)?.fullName || 'System'}</div>
                  {activeRun.approvedBy && <div><strong>Checker:</strong> {getEmployee(activeRun.approvedBy)?.fullName}</div>}
                </div>
              </Card>
            </div>

            {/* Validation Panel */}
            <div className="bg-warning-subtle border border-warning-border rounded-xl p-4">
              <h3 className="text-sm font-bold text-warning-text mb-2 flex items-center gap-2">
                <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Pre-Process Validation Flags
              </h3>
              <ul className="list-disc list-inside text-xs text-warning-text space-y-1">
                {runPayslips.filter(p => p.netPay < 0).length > 0 && (
                  <li>Warning: {runPayslips.filter(p => p.netPay < 0).length} employees have negative net pay after deductions.</li>
                )}
                <li>2 employees are missing primary bank account details.</li>
                <li>Gross pay variance is +1.2% compared to previous period (within normal bounds).</li>
              </ul>
            </div>

            <Card padding="none">
              <div className="p-4 border-b border-paper-border flex justify-between items-center">
                <h3 className="font-bold text-ink">Payslips</h3>
                <span className="text-xs text-ink-muted font-mono">{runPayslips.length} Records</span>
              </div>
              <div className="p-6">
                <Table 
                  columns={payslipCols} 
                  data={runPayslips} 
                  keyExtractor={p => p.id} 
                  onRowClick={p => setSelectedPayslipId(p.id)}
                />
              </div>
            </Card>
          </div>
        ) : (
          // Main Root Tabs
          <Card padding="none">
            <div className="p-4 border-b border-paper-border">
              <Tabs
                tabs={[
                  { id: 'runs', label: 'Payroll Runs', count: runs.length },
                  { id: 'structures', label: 'Salary Structures' },
                  { id: 'loans', label: 'Loans & Advances', count: employeeLoans.length }
                ]}
                activeTab={mainTab}
                onChange={setMainTab}
                variant="underline"
              />
            </div>

            {mainTab === 'runs' && (
              <div className="p-6">
                <Table
                  columns={runCols}
                  data={runs}
                  keyExtractor={r => r.id}
                  onRowClick={r => setSelectedRunId(r.id)}
                  emptyMessage="No payroll runs found."
                />
              </div>
            )}

            {mainTab === 'structures' && (
              <div className="p-6">
                <div className="mb-4">
                  <h2 className="text-lg font-bold text-ink">Standard Salary Structures</h2>
                  <p className="text-xs text-ink-muted">Base configurations per grade/designation. Actual employee salaries may vary based on individual contracts.</p>
                </div>
                <Table
                  columns={salaryStructureCols}
                  data={designations}
                  keyExtractor={d => d.id}
                  emptyMessage="No salary structures defined."
                />
              </div>
            )}

            {mainTab === 'loans' && (
              <div className="p-6">
                <div className="mb-4">
                  <h2 className="text-lg font-bold text-ink">Active Loans & Advances</h2>
                  <p className="text-xs text-ink-muted">Installments are automatically recovered during the monthly payroll calculation.</p>
                </div>
                <Table
                  columns={loanCols}
                  data={employeeLoans}
                  keyExtractor={l => l.id}
                  emptyMessage="No active loans found."
                />
              </div>
            )}
          </Card>
        )}
      </div>
    </RequireAccess>
  )
}

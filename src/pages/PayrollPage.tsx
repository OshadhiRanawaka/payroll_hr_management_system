import PlaceholderPage from '../components/PlaceholderPage'
import { payrollRuns, payslips } from '../data'

export default function PayrollPage() {
  return (
    <PlaceholderPage
      title="Payroll Processing & Maker-Checker Engine"
      section="payroll"
      description="Gross-to-net calculation, statutory EPF/ETF/PAYE deductions, payslip generation, and strict Maker-Checker approval gate."
      sampleCountText={`Mock data: ${payrollRuns.length} monthly payroll runs (Draft → Submitted → Approved → Locked → Paid), ${payslips.length} detailed payslip records.`}
      icon={
        <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      }
    />
  )
}

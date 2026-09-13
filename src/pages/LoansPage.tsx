import PlaceholderPage from '../components/PlaceholderPage'
import { employeeLoans } from '../data'

export default function LoansPage() {
  return (
    <PlaceholderPage
      title="Loans & Salary Advances"
      section="loans"
      description="Employee loan requests, approval workflows, repayment schedules, and automated payroll recovery."
      sampleCountText={`Mock data: ${employeeLoans.length} active employee loan schedules with monthly installment recovery.`}
      icon={
        <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      }
    />
  )
}

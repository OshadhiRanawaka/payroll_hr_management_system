import PlaceholderPage from '../components/PlaceholderPage'

export default function ExpensesPage() {
  return (
    <PlaceholderPage
      title="Expenses & Claims"
      section="expenses"
      description="Employee expense claims, receipt attachments, travel allowance approvals, and reimbursement integration."
      sampleCountText="Mock data domain ready for expense policy enforcement and claim tracking."
      icon={
        <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z" />
        </svg>
      }
    />
  )
}

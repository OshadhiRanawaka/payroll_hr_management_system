import PlaceholderPage from '../components/PlaceholderPage'

export default function ReportsPage() {
  return (
    <PlaceholderPage
      title="Reports & Analytics"
      section="reports"
      description="Attendance summary reports, payroll cost breakdowns, overtime analytics, absenteeism rates, and statutory tax compliance exports."
      sampleCountText="Mock data reporting engine ready for multi-branch cost-center filtering."
      icon={
        <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      }
    />
  )
}

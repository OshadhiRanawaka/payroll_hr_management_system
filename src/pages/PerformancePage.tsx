import PlaceholderPage from '../components/PlaceholderPage'

export default function PerformancePage() {
  return (
    <PlaceholderPage
      title="Performance Management"
      section="performance"
      description="Goal tracking, KPI scorecards, appraisal cycles, self-evaluations, and manager review calibrations."
      specReference="Specification §4.10"
      sampleCountText="Mock data domain ready for annual appraisal cycles and rating matrices."
      icon={
        <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      }
    />
  )
}

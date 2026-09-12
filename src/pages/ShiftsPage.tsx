import PlaceholderPage from '../components/PlaceholderPage'
import { shiftDefinitions } from '../data'

export default function ShiftsPage() {
  return (
    <PlaceholderPage
      title="Shift & Roster Management"
      section="shifts"
      description="Shift definitions (fixed, rotating, flex, overnight), break durations, grace periods, and roster planning."
      specReference="Specification §4.4 & §8 Attendance Domain"
      sampleCountText={`Mock data: ${shiftDefinitions.length} shift rules defined (including cross-midnight overnight shift).`}
      icon={
        <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      }
    />
  )
}

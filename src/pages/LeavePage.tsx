import PlaceholderPage from '../components/PlaceholderPage'
import { leaveRequests, leaveTypes } from '../data'

export default function LeavePage() {
  return (
    <PlaceholderPage
      title="Leave Management & Approval Flow"
      section="leave"
      description="Leave policy definitions, balances, employee applications, and two-stage approval chains (Manager → HR)."
      specReference="Specification §4.5 & §8 Leave Domain"
      sampleCountText={`Mock data: ${leaveTypes.length} leave types configured, ${leaveRequests.length} active requests in approval pipeline.`}
      icon={
        <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      }
    />
  )
}

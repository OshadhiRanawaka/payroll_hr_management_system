import PlaceholderPage from '../components/PlaceholderPage'
import { attendanceDays, attendanceEvents, attendanceExceptions } from '../data'

export default function AttendancePage() {
  return (
    <PlaceholderPage
      title="Biometric Attendance Management"
      section="attendance"
      description="Raw biometric punch log, processed attendance days layer, corrections audit trail, and exception engine."
      specReference="Specification §4.3, §6 & §19 (Immutable Events)"
      sampleCountText={`Mock data: ${attendanceEvents.length} immutable raw punches, ${attendanceDays.length} processed days, ${attendanceExceptions.length} active exceptions.`}
      icon={
        <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      }
    />
  )
}

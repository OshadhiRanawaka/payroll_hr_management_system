import PlaceholderPage from '../components/PlaceholderPage'
import { biometricDevices, syncLogs } from '../data'

export default function DevicesPage() {
  return (
    <PlaceholderPage
      title="Biometric Devices & Health Monitoring"
      section="devices"
      description="Fingerprint terminal management, IP configuration, sync log audit, and offline queue backlog inspection."
      specReference="Specification §4.3, §5 & §8 Biometric Domain"
      sampleCountText={`Mock data: ${biometricDevices.length} hardware terminals across 4 branches, ${syncLogs.length} sync logs buffered.`}
      icon={
        <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
        </svg>
      }
    />
  )
}

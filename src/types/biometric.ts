export type DeviceHealthStatus = 'online' | 'degraded' | 'offline'

export interface BiometricDevice {
  id: string
  deviceCode: string
  deviceName: string
  serialNumber: string
  branchId: string
  locationName: string
  ipAddress: string
  healthStatus: DeviceHealthStatus
  lastSyncTime: string
  queuedUnsyncedCount: number
  firmwareVersion: string
  enrolledUserCount: number
}

export interface SyncLog {
  id: string
  deviceId: string
  syncTimestamp: string
  eventsSynced: number
  status: 'success' | 'failed' | 'partial'
  errorMessage?: string
}

import type { BiometricDevice, SyncLog } from '../types'

export const biometricDevices: BiometricDevice[] = [
  // Colombo Head Office Devices
  {
    id: 'dev-col-01',
    deviceCode: 'DEV-COL-MAIN',
    deviceName: 'Colombo Lobby Fingerprint Terminal',
    serialNumber: 'ZKT-90412-COL1',
    branchId: 'br-colombo',
    locationName: 'Level 18 - Main Reception',
    ipAddress: '192.168.10.201',
    healthStatus: 'online',
    lastSyncTime: '2026-09-12T09:41:20Z',
    queuedUnsyncedCount: 0,
    firmwareVersion: 'v4.1.8-build92',
    enrolledUserCount: 240,
  },
  {
    id: 'dev-col-02',
    deviceCode: 'DEV-COL-EXEC',
    deviceName: 'Executive Suite Biometric Gate',
    serialNumber: 'ZKT-90412-COL2',
    branchId: 'br-colombo',
    locationName: 'Level 18 - Executive Boardroom Wing',
    ipAddress: '192.168.10.202',
    healthStatus: 'online',
    lastSyncTime: '2026-09-12T09:40:05Z',
    queuedUnsyncedCount: 0,
    firmwareVersion: 'v4.1.8-build92',
    enrolledUserCount: 45,
  },

  // Horana Manufacturing Complex Devices
  {
    id: 'dev-hor-01',
    deviceCode: 'DEV-HOR-GATE-A',
    deviceName: 'Horana Gate A Main Turnstile',
    serialNumber: 'ZKT-90415-HOR1',
    branchId: 'br-horana',
    locationName: 'Main Entrance Gate A',
    ipAddress: '10.20.40.101',
    healthStatus: 'online',
    lastSyncTime: '2026-09-12T09:42:00Z',
    queuedUnsyncedCount: 3,
    firmwareVersion: 'v4.2.1-build104',
    enrolledUserCount: 720,
  },
  {
    id: 'dev-hor-02',
    deviceCode: 'DEV-HOR-GATE-B',
    deviceName: 'Horana Plant Floor Entry B',
    serialNumber: 'ZKT-90415-HOR2',
    branchId: 'br-horana',
    locationName: 'Production Line 1 Hall',
    ipAddress: '10.20.40.102',
    healthStatus: 'degraded',
    lastSyncTime: '2026-09-12T08:15:44Z',
    queuedUnsyncedCount: 48,
    firmwareVersion: 'v4.1.5-build77',
    enrolledUserCount: 510,
  },
  {
    id: 'dev-hor-03',
    deviceCode: 'DEV-HOR-ENG',
    deviceName: 'Maintenance Workshop Terminal',
    serialNumber: 'ZKT-90415-HOR3',
    branchId: 'br-horana',
    locationName: 'Engineering Workshop 02',
    ipAddress: '10.20.40.103',
    healthStatus: 'online',
    lastSyncTime: '2026-09-12T09:35:10Z',
    queuedUnsyncedCount: 0,
    firmwareVersion: 'v4.2.1-build104',
    enrolledUserCount: 140,
  },

  // Kandy Sales Hub Devices
  {
    id: 'dev-kdy-01',
    deviceCode: 'DEV-KDY-FRONT',
    deviceName: 'Kandy Sales Hub Terminal',
    serialNumber: 'SUP-7712-KDY1',
    branchId: 'br-kandy',
    locationName: 'Front Showroom & Offices',
    ipAddress: '192.168.30.50',
    healthStatus: 'online',
    lastSyncTime: '2026-09-12T09:38:50Z',
    queuedUnsyncedCount: 0,
    firmwareVersion: 'v3.9.2-build12',
    enrolledUserCount: 260,
  },
  {
    id: 'dev-kdy-02',
    deviceCode: 'DEV-KDY-WH',
    deviceName: 'Kandy Logistics Warehouse Gate',
    serialNumber: 'SUP-7712-KDY2',
    branchId: 'br-kandy',
    locationName: 'Warehouse Loading Bay 1',
    ipAddress: '192.168.30.51',
    healthStatus: 'offline',
    lastSyncTime: '2026-09-11T18:30:00Z',
    queuedUnsyncedCount: 124,
    firmwareVersion: 'v3.9.2-build12',
    enrolledUserCount: 120,
  },

  // Galle Service Center Devices
  {
    id: 'dev-gal-01',
    deviceCode: 'DEV-GAL-MAIN',
    deviceName: 'Galle Service Center Punch Terminal',
    serialNumber: 'SUP-7714-GAL1',
    branchId: 'br-galle',
    locationName: 'Service Bay Reception',
    ipAddress: '192.168.40.88',
    healthStatus: 'online',
    lastSyncTime: '2026-09-12T09:39:15Z',
    queuedUnsyncedCount: 0,
    firmwareVersion: 'v4.0.1-build55',
    enrolledUserCount: 165,
  },
]

export const syncLogs: SyncLog[] = [
  // dev-col-01 (Online)
  { id: 'sync-log-101-1', deviceId: 'dev-col-01', syncTimestamp: '2026-09-12T09:41:20Z', eventsSynced: 68, status: 'success' },
  { id: 'sync-log-101-2', deviceId: 'dev-col-01', syncTimestamp: '2026-09-12T08:41:20Z', eventsSynced: 45, status: 'success' },
  { id: 'sync-log-101-3', deviceId: 'dev-col-01', syncTimestamp: '2026-09-12T07:41:20Z', eventsSynced: 89, status: 'success' },
  { id: 'sync-log-101-4', deviceId: 'dev-col-01', syncTimestamp: '2026-09-12T06:41:20Z', eventsSynced: 12, status: 'success' },

  // dev-col-02 (Online)
  { id: 'sync-log-102-1', deviceId: 'dev-col-02', syncTimestamp: '2026-09-12T09:40:05Z', eventsSynced: 14, status: 'success' },
  { id: 'sync-log-102-2', deviceId: 'dev-col-02', syncTimestamp: '2026-09-12T08:40:05Z', eventsSynced: 5, status: 'success' },
  { id: 'sync-log-102-3', deviceId: 'dev-col-02', syncTimestamp: '2026-09-12T07:40:05Z', eventsSynced: 22, status: 'success' },

  // dev-hor-01 (Online)
  { id: 'sync-log-103-1', deviceId: 'dev-hor-01', syncTimestamp: '2026-09-12T09:42:00Z', eventsSynced: 142, status: 'success' },
  { id: 'sync-log-103-2', deviceId: 'dev-hor-01', syncTimestamp: '2026-09-12T08:42:00Z', eventsSynced: 90, status: 'success' },
  { id: 'sync-log-103-3', deviceId: 'dev-hor-01', syncTimestamp: '2026-09-12T07:42:00Z', eventsSynced: 210, status: 'success' },

  // dev-hor-02 (Degraded)
  { id: 'sync-log-104-1', deviceId: 'dev-hor-02', syncTimestamp: '2026-09-12T08:15:44Z', eventsSynced: 22, status: 'partial', errorMessage: 'Network timeout during bulk packet transmission — 48 records queued.' },
  { id: 'sync-log-104-2', deviceId: 'dev-hor-02', syncTimestamp: '2026-09-12T07:15:44Z', eventsSynced: 15, status: 'partial', errorMessage: 'Network timeout during bulk packet transmission — 70 records queued.' },
  { id: 'sync-log-104-3', deviceId: 'dev-hor-02', syncTimestamp: '2026-09-12T06:15:44Z', eventsSynced: 85, status: 'success' },
  { id: 'sync-log-104-4', deviceId: 'dev-hor-02', syncTimestamp: '2026-09-12T05:15:44Z', eventsSynced: 110, status: 'success' },

  // dev-hor-03 (Online)
  { id: 'sync-log-105-1', deviceId: 'dev-hor-03', syncTimestamp: '2026-09-12T09:35:10Z', eventsSynced: 34, status: 'success' },
  { id: 'sync-log-105-2', deviceId: 'dev-hor-03', syncTimestamp: '2026-09-12T08:35:10Z', eventsSynced: 21, status: 'success' },
  { id: 'sync-log-105-3', deviceId: 'dev-hor-03', syncTimestamp: '2026-09-12T07:35:10Z', eventsSynced: 56, status: 'success' },

  // dev-kdy-01 (Online)
  { id: 'sync-log-106-1', deviceId: 'dev-kdy-01', syncTimestamp: '2026-09-12T09:38:50Z', eventsSynced: 44, status: 'success' },
  { id: 'sync-log-106-2', deviceId: 'dev-kdy-01', syncTimestamp: '2026-09-12T08:38:50Z', eventsSynced: 30, status: 'success' },
  { id: 'sync-log-106-3', deviceId: 'dev-kdy-01', syncTimestamp: '2026-09-12T07:38:50Z', eventsSynced: 75, status: 'success' },

  // dev-kdy-02 (Offline)
  { id: 'sync-log-107-1', deviceId: 'dev-kdy-02', syncTimestamp: '2026-09-11T18:30:00Z', eventsSynced: 0, status: 'failed', errorMessage: 'Device unreachable at IP 192.168.30.51 — Gateway unreachable.' },
  { id: 'sync-log-107-2', deviceId: 'dev-kdy-02', syncTimestamp: '2026-09-11T17:30:00Z', eventsSynced: 0, status: 'failed', errorMessage: 'Device unreachable at IP 192.168.30.51 — Connection refused.' },
  { id: 'sync-log-107-3', deviceId: 'dev-kdy-02', syncTimestamp: '2026-09-11T16:30:00Z', eventsSynced: 0, status: 'failed', errorMessage: 'Device unreachable at IP 192.168.30.51 — Connection timeout.' },
  { id: 'sync-log-107-4', deviceId: 'dev-kdy-02', syncTimestamp: '2026-09-11T15:30:00Z', eventsSynced: 45, status: 'success' },

  // dev-gal-01 (Online)
  { id: 'sync-log-108-1', deviceId: 'dev-gal-01', syncTimestamp: '2026-09-12T09:39:15Z', eventsSynced: 28, status: 'success' },
  { id: 'sync-log-108-2', deviceId: 'dev-gal-01', syncTimestamp: '2026-09-12T08:39:15Z', eventsSynced: 15, status: 'success' },
  { id: 'sync-log-108-3', deviceId: 'dev-gal-01', syncTimestamp: '2026-09-12T07:39:15Z', eventsSynced: 42, status: 'success' },
]

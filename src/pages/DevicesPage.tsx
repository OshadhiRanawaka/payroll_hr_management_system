import { useState } from 'react'
import { RequireAccess } from '../components/RequireAccess'
import { Badge, Button, Card, StatCard } from '../components/ui'
import { biometricDevices, syncLogs as initialSyncLogs, branches } from '../data'

export default function DevicesPage() {
  const [devices, setDevices] = useState(biometricDevices)
  const [logs, setLogs] = useState(initialSyncLogs)
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null)

  const selectedDevice = devices.find((d) => d.id === selectedDeviceId)
  const deviceLogs = logs.filter((l) => l.deviceId === selectedDeviceId).reverse()

  // Summary Metrics
  const totalDevices = devices.length
  const attentionNeeded = devices.filter((d) => d.healthStatus !== 'online').length
  const queuedCount = devices.reduce((sum, d) => sum + d.queuedUnsyncedCount, 0)

  // Handlers
  const handleRetrySync = () => {
    if (!selectedDevice) return

    // Update device state
    setDevices((prev) =>
      prev.map((dev) => {
        if (dev.id === selectedDevice.id) {
          return {
            ...dev,
            healthStatus: 'online',
            queuedUnsyncedCount: 0,
            lastSyncTime: new Date().toISOString(),
          }
        }
        return dev
      })
    )

    // Append successful sync log
    const newLog = {
      id: `sync-log-${Date.now()}`,
      deviceId: selectedDevice.id,
      syncTimestamp: new Date().toISOString(),
      eventsSynced: selectedDevice.queuedUnsyncedCount,
      status: 'success' as const,
    }

    setLogs((prev) => [...prev, newLog])
  }

  // Helpers
  const getBranchName = (branchId: string) => {
    return branches.find((b) => b.id === branchId)?.name || branchId
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'online':
        return <Badge variant="success" dot>Online</Badge>
      case 'degraded':
        return <Badge variant="warning" dot>Degraded</Badge>
      case 'offline':
        return <Badge variant="danger" dot>Offline</Badge>
      default:
        return <Badge variant="neutral">{status}</Badge>
    }
  }

  return (
    <RequireAccess section="devices">
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-paper-border shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-accent uppercase bg-accent-subtle px-2 py-0.5 rounded">
                Specification §5
              </span>
            </div>
            <h1 className="text-2xl font-bold text-ink mt-1">Biometric Devices</h1>
            <p className="text-xs text-ink-muted mt-0.5">
              Hardware status, punch synchronization, and network diagnostics.
            </p>
          </div>
        </div>

        {selectedDevice ? (
          /* Detail View */
          <div className="space-y-6">
            <Button variant="ghost" onClick={() => setSelectedDeviceId(null)} className="text-ink-muted">
              ← Back to Device Directory
            </Button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column: Device Info & Actions */}
              <div className="space-y-6 lg:col-span-1">
                <Card
                  header={
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-ink">Terminal Details</h3>
                      {getStatusBadge(selectedDevice.healthStatus)}
                    </div>
                  }
                >
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-lg font-bold text-ink">{selectedDevice.deviceName}</h4>
                      <p className="text-xs font-mono text-ink-muted mt-1">{selectedDevice.deviceCode}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-paper-border">
                      <div>
                        <div className="text-[10px] uppercase font-bold text-ink-muted">Location</div>
                        <div className="text-xs text-ink mt-1">{selectedDevice.locationName}</div>
                      </div>
                      <div>
                        <div className="text-[10px] uppercase font-bold text-ink-muted">Branch</div>
                        <div className="text-xs text-ink mt-1">{getBranchName(selectedDevice.branchId)}</div>
                      </div>
                      <div>
                        <div className="text-[10px] uppercase font-bold text-ink-muted">IP Address</div>
                        <div className="text-xs font-mono text-ink mt-1">{selectedDevice.ipAddress}</div>
                      </div>
                      <div>
                        <div className="text-[10px] uppercase font-bold text-ink-muted">Serial No.</div>
                        <div className="text-xs font-mono text-ink mt-1">{selectedDevice.serialNumber}</div>
                      </div>
                      <div>
                        <div className="text-[10px] uppercase font-bold text-ink-muted">Firmware</div>
                        <div className="text-xs font-mono text-ink mt-1">{selectedDevice.firmwareVersion}</div>
                      </div>
                      <div>
                        <div className="text-[10px] uppercase font-bold text-ink-muted">Enrolled Users</div>
                        <div className="text-xs text-ink mt-1">{selectedDevice.enrolledUserCount}</div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-paper-border space-y-3">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-ink-muted">Queued Punches:</span>
                        <Badge variant={selectedDevice.queuedUnsyncedCount > 0 ? 'warning' : 'success'}>
                          {selectedDevice.queuedUnsyncedCount} queued
                        </Badge>
                      </div>

                      <Button
                        variant={selectedDevice.healthStatus !== 'online' ? 'primary' : 'secondary'}
                        className="w-full"
                        disabled={selectedDevice.healthStatus === 'online'}
                        onClick={handleRetrySync}
                      >
                        {selectedDevice.healthStatus !== 'online' ? 'Retry Sync Now' : 'Sync Up To Date'}
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Right Column: Sync Logs */}
              <div className="lg:col-span-2">
                <Card header={<h3 className="font-bold text-ink">Recent Synchronization Logs</h3>}>
                  <div className="space-y-4">
                    {deviceLogs.length > 0 ? (
                      deviceLogs.map((log) => (
                        <div
                          key={log.id}
                          className="p-4 rounded-lg bg-paper border border-paper-border space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-mono font-bold text-ink">
                              {new Date(log.syncTimestamp).toLocaleString()}
                            </span>
                            <Badge
                              variant={
                                log.status === 'success'
                                  ? 'success'
                                  : log.status === 'partial'
                                    ? 'warning'
                                    : 'danger'
                              }
                            >
                              {log.status.toUpperCase()}
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-ink-muted">Events Synchronized:</span>
                            <strong className="text-ink">{log.eventsSynced}</strong>
                          </div>
                          {log.errorMessage && (
                            <div className="mt-2 p-2 bg-danger-subtle border border-danger/20 rounded text-xs text-danger-text">
                              <strong>Diagnostic:</strong> {log.errorMessage}
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-center text-ink-muted py-8">
                        No synchronization history available.
                      </div>
                    )}
                  </div>
                </Card>
              </div>
            </div>
          </div>
        ) : (
          /* Directory View */
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <StatCard
                label="Total Terminals"
                value={totalDevices}
                icon={
                  <svg className="size-5 text-ink-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                }
              />
              <StatCard
                label="Attention Required"
                value={attentionNeeded}
                variant={attentionNeeded > 0 ? 'danger' : 'default'}
                icon={
                  <svg className={`size-5 ${attentionNeeded > 0 ? 'text-danger' : 'text-ink-muted'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                }
              />
              <StatCard
                label="Queued Punches"
                value={queuedCount}
                variant={queuedCount > 0 ? 'warning' : 'default'}
                icon={
                  <svg className={`size-5 ${queuedCount > 0 ? 'text-warning' : 'text-ink-muted'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                }
              />
            </div>

            {/* Device Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {devices.map((device) => (
                <button
                  key={device.id}
                  onClick={() => setSelectedDeviceId(device.id)}
                  className="text-left bg-white p-5 rounded-xl border border-paper-border shadow-xs hover:border-accent hover:shadow-sm transition-all group flex flex-col"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="p-2 bg-paper rounded-lg group-hover:bg-accent-subtle transition-colors">
                      <svg className="size-5 text-ink-muted group-hover:text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                    {getStatusBadge(device.healthStatus)}
                  </div>

                  <h3 className="font-bold text-ink mb-1 group-hover:text-accent transition-colors line-clamp-1">
                    {device.deviceName}
                  </h3>
                  <p className="text-xs text-ink-muted font-mono mb-4">{device.deviceCode}</p>

                  <div className="space-y-2 mt-auto w-full pt-4 border-t border-paper-border">
                    <div className="flex justify-between text-[11px] font-mono">
                      <span className="text-ink-muted">Location:</span>
                      <span className="text-ink truncate ml-2">{device.locationName}</span>
                    </div>
                    <div className="flex justify-between text-[11px] font-mono">
                      <span className="text-ink-muted">Queued:</span>
                      <span className={device.queuedUnsyncedCount > 0 ? 'text-danger font-bold' : 'text-ink'}>
                        {device.queuedUnsyncedCount}
                      </span>
                    </div>
                    <div className="flex justify-between text-[11px] font-mono">
                      <span className="text-ink-muted">Last Sync:</span>
                      <span className="text-ink">{new Date(device.lastSyncTime).toLocaleTimeString()}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </RequireAccess>
  )
}

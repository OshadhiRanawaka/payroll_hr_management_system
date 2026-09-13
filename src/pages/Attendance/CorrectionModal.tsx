import { useState } from 'react'
import { Button, Card } from '../../components/ui'
import type { AttendanceDay, AttendanceException } from '../../types'
import { employees } from '../../data'

interface CorrectionModalProps {
  target: { type: 'day' | 'exception', id: string }
  targetData: any
  onClose: () => void
  onSubmit: (data: any) => void
}

export function CorrectionModal({ target, targetData, onClose, onSubmit }: CorrectionModalProps) {
  const [correctedTime, setCorrectedTime] = useState('')
  const [reason, setReason] = useState('')

  if (!targetData) return null

  const isDay = target.type === 'day'
  const dayData = targetData as AttendanceDay
  const excData = targetData as AttendanceException
  const emp = employees.find(e => e.id === targetData.employeeId)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/50 backdrop-blur-sm">
      <Card className="w-full max-w-md shadow-2xl relative bg-white border border-paper-border">
        <div className="p-6 space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-lg font-bold text-ink">
                {isDay ? 'Correct Attendance Record' : 'Resolve Exception'}
              </h2>
              <p className="text-xs text-ink-muted mt-1">
                For: <strong className="text-ink">{emp?.fullName}</strong> ({emp?.employeeCode})
              </p>
            </div>
            <button onClick={onClose} className="text-ink-muted hover:text-ink">
              <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="bg-warning-subtle text-warning-text p-3 rounded text-xs border border-warning/20 flex gap-2">
            <svg className="size-4 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>
              <strong>Immutable Event Policy:</strong> Original event logs will remain untouched. This action creates a traceable correction record requiring approval.
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-ink mb-1">Original Detail</label>
              <div className="p-3 bg-paper rounded border border-paper-border text-xs font-mono text-ink-muted">
                {isDay ? `IN: ${dayData.firstIn || '--:--'} | OUT: ${dayData.lastOut || '--:--'}` : excData.description}
              </div>
            </div>

            {isDay && (
              <div>
                <label className="block text-xs font-bold text-ink mb-1">Corrected Value (e.g. 09:00 IN)</label>
                <input 
                  type="text" 
                  value={correctedTime}
                  onChange={e => setCorrectedTime(e.target.value)}
                  placeholder="e.g. IN at 08:30"
                  className="w-full py-2 px-3 text-xs bg-white border border-paper-border rounded-lg text-ink focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-ink mb-1">Reason for Correction</label>
              <textarea 
                value={reason}
                onChange={e => setReason(e.target.value)}
                placeholder="Provide a detailed reason..."
                className="w-full py-2 px-3 text-xs bg-white border border-paper-border rounded-lg text-ink focus:outline-none focus:ring-2 focus:ring-accent min-h-[80px]"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
            <Button 
              variant="primary" 
              onClick={() => {
                onSubmit({ 
                  originalTime: isDay ? dayData.firstIn : null, 
                  correctedTime, 
                  reason 
                })
              }}
              disabled={!reason || (isDay && !correctedTime)}
            >
              Submit Correction
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}

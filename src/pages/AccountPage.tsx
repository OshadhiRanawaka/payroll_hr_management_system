import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Badge, Button, Card, Tabs } from '../components/ui'
import { useRole } from '../lib'
import { branches, departments } from '../data'

export default function AccountPage() {
  const { currentUser, activeRole, logout } = useRole()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('profile')

  const department = departments.find(d => d.id === currentUser.departmentId)
  const branch = branches.find(b => b.id === currentUser.branchId)

  // Mock session time logic
  const sessionTime = new Date().toLocaleString('en-US', { 
    dateStyle: 'medium', 
    timeStyle: 'short' 
  })

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl border border-paper-border shadow-xs">
        <h1 className="text-2xl font-bold text-ink">My Account</h1>
        <p className="text-xs text-ink-muted mt-0.5">
          Account settings — coming soon. This is a UI placeholder.
        </p>
      </div>

      <Card padding="none">
        <div className="p-4 border-b border-paper-border">
          <Tabs
            tabs={[
              { id: 'profile', label: 'Profile' },
              { id: 'security', label: 'Security' },
              { id: 'notifications', label: 'Notifications' },
              { id: 'sessions', label: 'Sessions' }
            ]}
            activeTab={activeTab}
            onChange={setActiveTab}
            variant="underline"
          />
        </div>

        <div className="p-6">
          {activeTab === 'profile' && (
            <div className="space-y-6 max-w-lg">
              <div className="flex items-center gap-4">
                <div className="size-16 rounded-full bg-accent-subtle text-accent font-bold text-xl flex items-center justify-center border border-accent/20 shrink-0">
                  {currentUser.firstName[0]}
                  {currentUser.lastName[0]}
                </div>
                <div>
                  <div className="text-lg font-bold text-ink">{currentUser.fullName}</div>
                  <div className="text-xs font-mono text-ink-muted">{activeRole.name}</div>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-paper-border">
                <div>
                  <label className="block text-xs font-bold text-ink mb-1">Email Address</label>
                  <input type="text" readOnly value={currentUser.email} className="w-full py-2 px-3 text-xs bg-paper border border-paper-border rounded-lg text-ink-muted cursor-not-allowed" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-ink mb-1">Employee Code</label>
                  <input type="text" readOnly value={currentUser.employeeCode} className="w-full py-2 px-3 text-xs bg-paper border border-paper-border rounded-lg text-ink-muted cursor-not-allowed" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-ink mb-1">Department</label>
                    <input type="text" readOnly value={department?.name || 'N/A'} className="w-full py-2 px-3 text-xs bg-paper border border-paper-border rounded-lg text-ink-muted cursor-not-allowed" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-ink mb-1">Branch</label>
                    <input type="text" readOnly value={branch?.name || 'N/A'} className="w-full py-2 px-3 text-xs bg-paper border border-paper-border rounded-lg text-ink-muted cursor-not-allowed" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6 max-w-md">
              <div className="p-3 bg-info-subtle border border-info/20 rounded-lg text-xs text-info-text">
                <strong>Note:</strong> This is a UI placeholder with no real backend. Passwords are not actually saved.
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-ink mb-1">Current Password</label>
                  <input type="password" placeholder="••••••••" className="w-full py-2 px-3 text-xs bg-white border border-paper-border rounded-lg text-ink focus:outline-none focus:ring-2 focus:ring-accent" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-ink mb-1">New Password</label>
                  <input type="password" placeholder="••••••••" className="w-full py-2 px-3 text-xs bg-white border border-paper-border rounded-lg text-ink focus:outline-none focus:ring-2 focus:ring-accent" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-ink mb-1">Confirm New Password</label>
                  <input type="password" placeholder="••••••••" className="w-full py-2 px-3 text-xs bg-white border border-paper-border rounded-lg text-ink focus:outline-none focus:ring-2 focus:ring-accent" />
                </div>
                <Button variant="primary">Change Password</Button>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6 max-w-md">
              <p className="text-xs text-ink-muted border-b border-paper-border pb-4">
                Configure how you want to be notified. These toggles are purely visual in the demo.
              </p>

              <div className="space-y-4">
                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <div className="text-sm font-bold text-ink">Leave Approvals</div>
                    <div className="text-xs text-ink-muted">Email me when my leave is approved or rejected</div>
                  </div>
                  <input type="checkbox" defaultChecked className="size-4 accent-accent cursor-pointer" />
                </label>
                
                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <div className="text-sm font-bold text-ink">Payroll Run Status</div>
                    <div className="text-xs text-ink-muted">Notify me when a payroll run requires approval</div>
                  </div>
                  <input type="checkbox" defaultChecked className="size-4 accent-accent cursor-pointer" />
                </label>

                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <div className="text-sm font-bold text-ink">System Alerts</div>
                    <div className="text-xs text-ink-muted">Receive alerts about device sync issues</div>
                  </div>
                  <input type="checkbox" className="size-4 accent-accent cursor-pointer" />
                </label>
              </div>
            </div>
          )}

          {activeTab === 'sessions' && (
            <div className="space-y-6 max-w-md">
              <div className="p-4 border border-paper-border rounded-xl bg-paper">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-bold text-ink">Current Session</div>
                    <div className="text-xs text-ink-muted mt-1">Signed in since {sessionTime}</div>
                  </div>
                  <Badge variant="success">Active</Badge>
                </div>
              </div>

              <div className="pt-4 border-t border-paper-border">
                <Button 
                  variant="danger" 
                  onClick={() => {
                    logout()
                    navigate('/sign-in')
                  }}
                >
                  Sign out of this device
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}

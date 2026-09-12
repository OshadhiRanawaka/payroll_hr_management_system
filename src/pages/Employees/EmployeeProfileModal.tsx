import { useState } from 'react'
import { Badge, Button, Card, Tabs } from '../../components/ui'
import { branches, departments, designations } from '../../data'
import { useRole } from '../../lib'
import type { Employee } from '../../types'

interface EmployeeProfileModalProps {
  employee: Employee | null
  onClose: () => void
}

export function EmployeeProfileModal({ employee, onClose }: EmployeeProfileModalProps) {
  const { activeRoleId } = useRole()
  const [activeTab, setActiveTab] = useState('overview')

  if (!employee) return null

  const isAuditor = activeRoleId === 'auditor'

  const dept = departments.find((d) => d.id === employee.departmentId)
  const branch = branches.find((b) => b.id === employee.branchId)
  const desig = designations.find((d) => d.id === employee.designationId)

  const profileTabs = [
    { id: 'overview', label: 'Personal Details' },
    { id: 'employment', label: 'Employment History' },
    { id: 'financial', label: 'Salary & Bank Details' },
    { id: 'documents', label: 'Documents (4)' },
  ]

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-3xl rounded-xl shadow-2xl border border-paper-border overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="p-6 bg-nav-950 text-white flex items-start justify-between border-b border-nav-800">
          <div className="flex items-center gap-4">
            <div className="size-14 rounded-full bg-accent-600 text-white font-bold text-lg flex items-center justify-center border-2 border-white/20">
              {employee.firstName[0]}
              {employee.lastName[0]}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white">{employee.fullName}</h2>
                <Badge variant={employee.status === 'active' ? 'success' : employee.status === 'probation' ? 'warning' : 'neutral'}>
                  {employee.status.replace('_', ' ')}
                </Badge>
              </div>
              <p className="text-xs text-nav-300 font-mono mt-1">
                {employee.employeeCode} • {desig?.title || 'Staff'} (Grade {employee.grade})
              </p>
              <p className="text-xs text-accent-400 mt-0.5">
                {dept?.name} • {branch?.name}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-nav-400 hover:text-white p-1 rounded-lg hover:bg-nav-800 transition-colors"
          >
            <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Tabs Navigation */}
        <div className="border-b border-paper-border px-6 pt-3 bg-paper">
          <Tabs tabs={profileTabs} activeTab={activeTab} onChange={setActiveTab} variant="underline" />
        </div>

        {/* Modal Body Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-paper">
          {/* TAB 1: Personal & Contact Details */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
              <Card header={<span className="font-sans font-bold text-ink text-sm">Contact Information</span>}>
                <div className="space-y-3">
                  <div>
                    <span className="text-ink-muted block text-[10px]">Email Address</span>
                    <strong className="text-ink text-xs">{employee.email}</strong>
                  </div>
                  <div>
                    <span className="text-ink-muted block text-[10px]">Phone Number</span>
                    <strong className="text-ink text-xs">{employee.phone}</strong>
                  </div>
                  <div>
                    <span className="text-ink-muted block text-[10px]">Work Location</span>
                    <span className="text-ink">{branch?.address}</span>
                  </div>
                </div>
              </Card>

              <Card header={<span className="font-sans font-bold text-ink text-sm">Personal Data</span>}>
                <div className="space-y-3">
                  <div>
                    <span className="text-ink-muted block text-[10px]">Gender</span>
                    <strong className="text-ink capitalize text-xs">{employee.gender}</strong>
                  </div>
                  <div>
                    <span className="text-ink-muted block text-[10px]">Date of Birth</span>
                    <strong className="text-ink text-xs">{employee.dateOfBirth}</strong>
                  </div>
                  <div>
                    <span className="text-ink-muted block text-[10px]">Emergency Contact</span>
                    <span className="text-ink">Primary Next of Kin (On file in HR)</span>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* TAB 2: Employment History */}
          {activeTab === 'employment' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
              <Card header={<span className="font-sans font-bold text-ink text-sm">Position Details</span>}>
                <div className="space-y-3">
                  <div>
                    <span className="text-ink-muted block text-[10px]">Designation Title</span>
                    <strong className="text-ink text-xs">{desig?.title}</strong>
                  </div>
                  <div>
                    <span className="text-ink-muted block text-[10px]">Job Grade Level</span>
                    <strong className="text-ink text-xs">Grade {employee.grade} (Level {desig?.level || 1})</strong>
                  </div>
                  <div>
                    <span className="text-ink-muted block text-[10px]">Cost Center</span>
                    <span className="text-accent font-bold">{dept?.costCenter}</span>
                  </div>
                </div>
              </Card>

              <Card header={<span className="font-sans font-bold text-ink text-sm">Lifecycle & Status</span>}>
                <div className="space-y-3">
                  <div>
                    <span className="text-ink-muted block text-[10px]">Date Joined</span>
                    <strong className="text-ink text-xs">{employee.hireDate}</strong>
                  </div>
                  <div>
                    <span className="text-ink-muted block text-[10px]">Employment Type</span>
                    <strong className="text-ink capitalize text-xs">{employee.employmentType.replace('_', ' ')}</strong>
                  </div>
                  <div>
                    <span className="text-ink-muted block text-[10px]">Current Status</span>
                    <Badge variant="success">{employee.status}</Badge>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* TAB 3: Salary & Bank Details */}
          {activeTab === 'financial' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
                <Card className="bg-white">
                  <span className="text-ink-muted text-[10px] block">Basic Salary</span>
                  <strong className="text-sm font-bold text-ink">LKR {employee.basicSalary.toLocaleString()}</strong>
                </Card>
                <Card className="bg-white">
                  <span className="text-ink-muted text-[10px] block">Fixed Allowance</span>
                  <strong className="text-sm font-bold text-ink">LKR {employee.fixedAllowance.toLocaleString()}</strong>
                </Card>
                <Card className="bg-accent-subtle border-accent/30">
                  <span className="text-accent text-[10px] font-bold block">Gross Monthly Salary</span>
                  <strong className="text-base font-bold text-accent">LKR {employee.grossSalary.toLocaleString()}</strong>
                </Card>
              </div>

              <Card header={<span className="font-sans font-bold text-ink text-sm">Bank Disbursement Details</span>}>
                <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                  <div>
                    <span className="text-ink-muted block text-[10px]">Bank Name</span>
                    <strong className="text-ink">{employee.bankDetails.bankName}</strong>
                  </div>
                  <div>
                    <span className="text-ink-muted block text-[10px]">Account Name</span>
                    <strong className="text-ink">{employee.bankDetails.accountName}</strong>
                  </div>
                  <div>
                    <span className="text-ink-muted block text-[10px]">Account Number</span>
                    <strong className="text-ink font-bold">{employee.bankDetails.accountNumber}</strong>
                  </div>
                  <div>
                    <span className="text-ink-muted block text-[10px]">Branch & SWIFT</span>
                    <span className="text-ink">Code: {employee.bankDetails.branchCode} • SWIFT: {employee.bankDetails.swiftCode}</span>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* TAB 4: Documents Placeholder */}
          {activeTab === 'documents' && (
            <div className="space-y-3">
              {[
                { name: 'Employment_Contract_Signed.pdf', date: employee.hireDate, size: '1.4 MB', type: 'PDF Contract' },
                { name: 'National_ID_Copy.pdf', date: 'Verified', size: '850 KB', type: 'Identification' },
                { name: 'Bank_Account_Confirmation_Letter.pdf', date: 'Verified', size: '420 KB', type: 'Bank Record' },
                { name: 'Educational_Certificates_Verified.pdf', date: 'Verified', size: '2.8 MB', type: 'Qualifications' },
              ].map((doc, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-white border border-paper-border flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded bg-accent-subtle text-accent flex items-center justify-center shrink-0">
                      <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-bold text-ink">{doc.name}</div>
                      <div className="text-[10px] text-ink-muted">{doc.type} • {doc.size}</div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => alert(`Downloading placeholder file: ${doc.name}`)}>
                    Download
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-white border-t border-paper-border flex items-center justify-between">
          <span className="text-xs font-mono text-ink-muted">
            {isAuditor ? 'Read-only mode active for Auditor role.' : 'Profile changes audited in system log.'}
          </span>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={onClose}>
              Close View
            </Button>
            {!isAuditor && (
              <Button variant="primary" size="sm" onClick={() => alert('Edit Employee drawer will open in full HR module.')}>
                Edit Profile
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

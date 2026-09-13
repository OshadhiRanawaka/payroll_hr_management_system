import { useState } from 'react'
import { Button, Card } from '../../components/ui'
import { branches, departments, designations } from '../../data'
import type { Employee, EmploymentType } from '../../types'

interface AddEmployeeModalProps {
  onClose: () => void
  onAdd: (emp: Employee) => void
}

export function AddEmployeeModal({ onClose, onAdd }: AddEmployeeModalProps) {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [departmentId, setDepartmentId] = useState(departments[0]?.id || '')
  const [branchId, setBranchId] = useState(branches[0]?.id || '')
  const [designationId, setDesignationId] = useState(designations[0]?.id || '')
  const [employmentType, setEmploymentType] = useState<EmploymentType>('full_time')
  const [grossSalary, setGrossSalary] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!firstName || !lastName || !grossSalary) return

    const desig = designations.find(d => d.id === designationId)
    const grade = desig ? desig.grade : 'L1'

    const newEmp: Employee = {
      id: `emp-new-${Date.now()}`,
      employeeCode: `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
      firstName,
      lastName,
      fullName: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@nimbus.lk`,
      phone: '+94 77 000 0000',
      gender: 'other',
      dateOfBirth: '1990-01-01',
      departmentId,
      branchId,
      designationId,
      grade,
      employmentType,
      status: 'active',
      hireDate: new Date().toISOString().split('T')[0],
      basicSalary: Number(grossSalary) * 0.6,
      fixedAllowance: Number(grossSalary) * 0.4,
      grossSalary: Number(grossSalary),
      bankDetails: {
        bankName: 'Commercial Bank',
        accountNumber: '1234567890',
        accountName: `${firstName} ${lastName}`,
        branchCode: '001',
        swiftCode: 'CCOM'
      }
    }

    onAdd(newEmp)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/50 backdrop-blur-sm">
      <Card className="w-full max-w-lg shadow-2xl relative bg-white border border-paper-border overflow-y-auto max-h-[90vh]">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-lg font-bold text-ink">Add New Employee</h2>
              <p className="text-xs text-ink-muted mt-1">
                Enter details to provision a new team member.
              </p>
            </div>
            <button type="button" onClick={onClose} className="text-ink-muted hover:text-ink">
              <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-ink mb-1">First Name</label>
              <input 
                required
                type="text" 
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                className="w-full py-2 px-3 text-xs bg-white border border-paper-border rounded-lg text-ink focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-ink mb-1">Last Name</label>
              <input 
                required
                type="text" 
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                className="w-full py-2 px-3 text-xs bg-white border border-paper-border rounded-lg text-ink focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-ink mb-1">Department</label>
              <select 
                value={departmentId}
                onChange={e => setDepartmentId(e.target.value)}
                className="w-full py-2 px-3 text-xs bg-white border border-paper-border rounded-lg text-ink focus:outline-none focus:ring-2 focus:ring-accent"
              >
                {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-ink mb-1">Branch</label>
              <select 
                value={branchId}
                onChange={e => setBranchId(e.target.value)}
                className="w-full py-2 px-3 text-xs bg-white border border-paper-border rounded-lg text-ink focus:outline-none focus:ring-2 focus:ring-accent"
              >
                {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-ink mb-1">Designation</label>
              <select 
                value={designationId}
                onChange={e => setDesignationId(e.target.value)}
                className="w-full py-2 px-3 text-xs bg-white border border-paper-border rounded-lg text-ink focus:outline-none focus:ring-2 focus:ring-accent"
              >
                {designations.map(d => <option key={d.id} value={d.id}>{d.title}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-ink mb-1">Employment Type</label>
              <select 
                value={employmentType}
                onChange={e => setEmploymentType(e.target.value as EmploymentType)}
                className="w-full py-2 px-3 text-xs bg-white border border-paper-border rounded-lg text-ink focus:outline-none focus:ring-2 focus:ring-accent"
              >
                <option value="full_time">Full-Time</option>
                <option value="part_time">Part-Time</option>
                <option value="contract">Contract</option>
                <option value="intern">Intern</option>
              </select>
            </div>

            <div className="col-span-2">
              <label className="block text-xs font-bold text-ink mb-1">Gross Salary (LKR)</label>
              <input 
                required
                type="number" 
                min="0"
                value={grossSalary}
                onChange={e => setGrossSalary(e.target.value)}
                placeholder="e.g. 150000"
                className="w-full py-2 px-3 text-xs bg-white border border-paper-border rounded-lg text-ink focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="primary">Add Employee</Button>
          </div>
        </form>
      </Card>
    </div>
  )
}

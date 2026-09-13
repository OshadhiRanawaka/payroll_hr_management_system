import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button, Card } from '../components/ui'
import { useRole } from '../lib'
import type { Employee } from '../types'

export default function SignUpPage() {
  const { loginAsNewUser } = useRole()
  const navigate = useNavigate()
  
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!firstName || !lastName || !email) return
    
    const newEmp: Employee = {
      id: `emp-new-${Date.now()}`,
      employeeCode: `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
      firstName,
      lastName,
      fullName: `${firstName} ${lastName}`,
      email,
      phone: '+94 77 000 0000',
      gender: 'other',
      dateOfBirth: '1990-01-01',
      departmentId: 'dept-mfg', // default mock dept
      branchId: 'br-colombo',
      designationId: 'desig-staff',
      grade: 'L1',
      employmentType: 'full_time',
      status: 'active',
      hireDate: new Date().toISOString().split('T')[0],
      basicSalary: 60000,
      fixedAllowance: 40000,
      grossSalary: 100000,
      bankDetails: {
        bankName: 'Commercial Bank',
        accountNumber: '1234567890',
        accountName: `${firstName} ${lastName}`,
        branchCode: '001',
        swiftCode: 'CCOM'
      }
    }
    
    loginAsNewUser(newEmp)
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-paper flex items-center justify-center p-6">
      <Card className="w-full max-w-md p-8 shadow-sm border border-paper-border">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-ink">Join PeopleFlow HR</h1>
          <p className="text-xs text-ink-muted mt-1">Create your self-service account</p>
        </div>
        
        <div className="bg-info-subtle border border-info/20 text-info-text text-xs p-3 rounded-lg mb-6 flex gap-2">
          <svg className="size-4 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <strong>Your account will be created as: Employee (Self-Service access only).</strong>
            <p className="mt-1 opacity-80">New sign-ups are provisioned as basic Employees. Other operational roles (e.g. Payroll Officer, HR Admin) are securely assigned internally by HR/IT after review.</p>
          </div>
        </div>

        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-ink mb-1">First Name</label>
              <input required value={firstName} onChange={e => setFirstName(e.target.value)} type="text" placeholder="Jane" className="w-full py-2 px-3 text-sm bg-white border border-paper-border rounded-lg text-ink focus:outline-none focus:ring-2 focus:ring-accent" />
            </div>
            <div>
              <label className="block text-xs font-bold text-ink mb-1">Last Name</label>
              <input required value={lastName} onChange={e => setLastName(e.target.value)} type="text" placeholder="Doe" className="w-full py-2 px-3 text-sm bg-white border border-paper-border rounded-lg text-ink focus:outline-none focus:ring-2 focus:ring-accent" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-ink mb-1">Work Email</label>
            <input required value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="jane.doe@nimbus.lk" className="w-full py-2 px-3 text-sm bg-white border border-paper-border rounded-lg text-ink focus:outline-none focus:ring-2 focus:ring-accent" />
          </div>
          <div>
            <label className="block text-xs font-bold text-ink mb-1">Password</label>
            <input type="password" placeholder="••••••••" className="w-full py-2 px-3 text-sm bg-white border border-paper-border rounded-lg text-ink focus:outline-none focus:ring-2 focus:ring-accent" />
          </div>
          <Button type="submit" variant="primary" className="w-full justify-center py-2.5">Create Account</Button>
        </form>

        <div className="mt-6 text-center text-xs text-ink-muted">
          Already have an account? <Link to="/sign-in" className="text-accent font-semibold hover:underline">Sign in</Link>
        </div>
      </Card>
    </div>
  )
}

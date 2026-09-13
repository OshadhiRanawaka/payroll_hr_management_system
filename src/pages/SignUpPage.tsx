import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button, Card } from '../components/ui'
import { useRole } from '../lib'
import type { Employee, EmploymentType } from '../types'
import { branches, departments, employees } from '../data'

export default function SignUpPage() {
  const { loginAsNewUser } = useRole()
  const navigate = useNavigate()
  
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [departmentId, setDepartmentId] = useState(departments[0]?.id || '')
  const [branchId, setBranchId] = useState(branches[0]?.id || '')
  const [jobTitle, setJobTitle] = useState('')
  const [employmentType, setEmploymentType] = useState<EmploymentType>('full_time')
  const [agreed, setAgreed] = useState(false)

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!fullName || !email || !password || password !== confirmPassword || !agreed) return
    
    // Auto-generate employee code (EMP-XXX)
    const highestCode = employees.reduce((max, emp) => {
      const match = emp.employeeCode.match(/^EMP-(\d+)$/)
      if (match) {
        const num = parseInt(match[1], 10)
        return num > max ? num : max
      }
      return max
    }, 0)
    const nextCode = `EMP-${String(highestCode + 1).padStart(3, '0')}`

    // Split full name
    const nameParts = fullName.trim().split(' ')
    const firstName = nameParts[0]
    const lastName = nameParts.slice(1).join(' ') || ' '

    const newEmp: Employee = {
      id: `emp-new-${Date.now()}`,
      employeeCode: nextCode,
      firstName,
      lastName,
      fullName: fullName.trim(),
      email,
      phone: '+94 77 000 0000',
      gender: 'other',
      dateOfBirth: '1990-01-01',
      departmentId,
      branchId,
      designationId: jobTitle || 'desig-staff', // Fallback or store free-text title
      grade: 'L1', // Default grade (assigned by HR later)
      employmentType,
      status: 'active',
      hireDate: new Date().toISOString().split('T')[0],
      basicSalary: 60000,
      fixedAllowance: 40000,
      grossSalary: 100000,
      bankDetails: {
        bankName: 'Commercial Bank',
        accountNumber: '1234567890',
        accountName: fullName.trim(),
        branchCode: '001',
        swiftCode: 'CCOM'
      }
    }
    
    // Add to shared mock data
    employees.push(newEmp)

    // Log in scoped to the department
    loginAsNewUser(newEmp)
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-paper flex items-center justify-center p-6 py-12">
      <Card className="w-full max-w-lg shadow-2xl relative bg-white border border-paper-border">
        <form onSubmit={handleFormSubmit} className="p-6 space-y-6">
          <div className="text-center mb-2">
            <h1 className="text-2xl font-bold text-ink">Join PeopleFlow HR</h1>
            <p className="text-xs text-ink-muted mt-1">Create your self-service account</p>
          </div>
          
          <div className="bg-info-subtle border border-info/20 text-info-text text-xs p-3 rounded-lg flex gap-2">
            <svg className="size-4 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <strong>Your account will be created as: Employee (Self-Service access only).</strong>
              <p className="mt-1 opacity-80">New sign-ups are provisioned as basic Employees. Other operational roles (e.g. Payroll Officer, HR Admin) are securely assigned internally by HR/IT after review.</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-bold text-ink mb-1">Full Name</label>
              <input 
                required 
                value={fullName} 
                onChange={e => setFullName(e.target.value)} 
                type="text" 
                placeholder="e.g. Jane Doe" 
                className="w-full py-2 px-3 text-xs bg-white border border-paper-border rounded-lg text-ink focus:outline-none focus:ring-2 focus:ring-accent" 
              />
            </div>

            <div className="col-span-2">
              <label className="block text-xs font-bold text-ink mb-1">Work Email</label>
              <input 
                required 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                type="email" 
                placeholder="jane.doe@nimbus.lk" 
                className="w-full py-2 px-3 text-xs bg-white border border-paper-border rounded-lg text-ink focus:outline-none focus:ring-2 focus:ring-accent" 
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-ink mb-1">Password</label>
              <input 
                required 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                type="password" 
                placeholder="••••••••" 
                className="w-full py-2 px-3 text-xs bg-white border border-paper-border rounded-lg text-ink focus:outline-none focus:ring-2 focus:ring-accent" 
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-ink mb-1">Confirm Password</label>
              <input 
                required 
                value={confirmPassword} 
                onChange={e => setConfirmPassword(e.target.value)} 
                type="password" 
                placeholder="••••••••" 
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
              <label className="block text-xs font-bold text-ink mb-1">Job Title</label>
              <input 
                required 
                value={jobTitle} 
                onChange={e => setJobTitle(e.target.value)} 
                type="text" 
                placeholder="e.g. Software Engineer" 
                className="w-full py-2 px-3 text-xs bg-white border border-paper-border rounded-lg text-ink focus:outline-none focus:ring-2 focus:ring-accent" 
              />
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
            
            <div className="col-span-2 pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={agreed}
                  onChange={e => setAgreed(e.target.checked)}
                  required 
                  className="size-4 accent-accent cursor-pointer" 
                />
                <span className="text-xs text-ink">I agree to the Terms of Service and Privacy Policy</span>
              </label>
            </div>
          </div>

          <Button 
            type="submit" 
            variant="primary" 
            disabled={!agreed || password !== confirmPassword || password.length === 0} 
            className="w-full justify-center py-2.5"
          >
            Create Account
          </Button>

          <div className="text-center text-[10px] text-ink-muted">
            Demo preview — not connected to a live authentication system
          </div>

          <div className="text-center text-xs text-ink-muted pt-2 border-t border-paper-border">
            Already have an account? <Link to="/sign-in" className="text-accent font-semibold hover:underline">Sign in</Link>
          </div>
        </form>
      </Card>
    </div>
  )
}

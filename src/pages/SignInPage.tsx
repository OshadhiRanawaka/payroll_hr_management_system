import { Link, useNavigate } from 'react-router-dom'
import { Button, Card } from '../components/ui'
import { useRole } from '../lib'
import type { RoleId } from '../types'

export default function SignInPage() {
  const { allRoles, setActiveRoleId } = useRole()
  const navigate = useNavigate()

  const handlePersonaClick = (roleId: RoleId) => {
    setActiveRoleId(roleId)
    navigate('/')
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setActiveRoleId('super_admin')
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-paper flex items-center justify-center p-6">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Left: Email/Password Form */}
        <Card className="p-8 border border-paper-border shadow-sm">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-ink">PeopleFlow HR</h1>
            <p className="text-xs text-ink-muted mt-1">Sign in to your account</p>
          </div>
          
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-ink mb-1">Email</label>
              <input type="email" placeholder="admin@nimbus.lk" className="w-full py-2 px-3 text-sm bg-white border border-paper-border rounded-lg text-ink focus:outline-none focus:ring-2 focus:ring-accent" />
            </div>
            <div>
              <label className="block text-xs font-bold text-ink mb-1">Password</label>
              <input type="password" placeholder="••••••••" className="w-full py-2 px-3 text-sm bg-white border border-paper-border rounded-lg text-ink focus:outline-none focus:ring-2 focus:ring-accent" />
            </div>
            <Button type="submit" variant="primary" className="w-full justify-center py-2.5">Sign In</Button>
          </form>

          <div className="mt-6 text-center text-xs text-ink-muted">
            Don't have an account? <Link to="/sign-up" className="text-accent font-semibold hover:underline">Sign up</Link>
          </div>
        </Card>

        {/* Right: Personas */}
        <div className="space-y-4">
          <div className="mb-2">
            <h2 className="text-lg font-bold text-ink">Quick sign in as persona</h2>
            <p className="text-xs text-ink-muted">Since this is a demo, you can instantly log in as any role.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {allRoles.map(role => (
              <button 
                key={role.id}
                onClick={() => handlePersonaClick(role.id)}
                className="text-left bg-white border border-paper-border p-3 rounded-xl hover:border-accent hover:shadow-sm transition-all"
              >
                <div className="text-sm font-bold text-ink">{role.name}</div>
                <div className="text-[10px] font-mono text-ink-muted mt-1 truncate">
                  Role ID: {role.id}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

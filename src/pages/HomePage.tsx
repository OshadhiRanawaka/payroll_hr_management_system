import { Link } from 'react-router-dom'
import { Badge, Button, Card } from '../components/ui'
import { company, employees, biometricDevices, payrollRuns } from '../data'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-paper text-ink flex flex-col items-center justify-center p-6 space-y-8">
      {/* Top Tag */}
      <div className="flex items-center gap-2">
        <Badge variant="info">Enterprise HR & Payroll Prototype</Badge>
        <span className="text-xs font-mono text-ink-muted">Nimbus Holdings (Pvt) Ltd</span>
      </div>

      {/* Main Hero Header */}
      <div className="text-center space-y-3 max-w-2xl">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-ink tracking-tight">
          PeopleFlow <span className="text-accent">HR</span>
        </h1>
        <p className="text-sm sm:text-base text-ink-muted leading-relaxed">
          Biometric Attendance • Gross-to-Net Payroll • Employee Self-Service • Multi-Branch Operations
        </p>
      </div>

      {/* Quick Action Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl">
        <Card className="hover:border-accent transition-colors">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Badge variant="success" dot>Mock Data Layer Ready</Badge>
              <span className="text-xs font-mono text-ink-muted">/data-check</span>
            </div>
            <h3 className="text-lg font-bold text-ink">Inspect Mock Data Layer</h3>
            <p className="text-xs text-ink-muted">
              Verify all 7 database domains ({company.totalHeadcount.toLocaleString()} headcount context, {employees.length} seeded employees, {biometricDevices.length} devices, {payrollRuns.length} payroll periods).
            </p>
            <Link to="/data-check" className="block pt-2">
              <Button variant="primary" size="md" className="w-full">
                Open /data-check Page
              </Button>
            </Link>
          </div>
        </Card>

        <Card className="hover:border-accent transition-colors">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Badge variant="info">Control Room Design System</Badge>
              <span className="text-xs font-mono text-ink-muted">/style-guide</span>
            </div>
            <h3 className="text-lg font-bold text-ink">UI Component Style Guide</h3>
            <p className="text-xs text-ink-muted">
              Explore theme colors (dark navy nav, warm paper background, teal accent), buttons, cards, status badges, tabular numerics, and KPI metrics.
            </p>
            <Link to="/style-guide" className="block pt-2">
              <Button variant="secondary" size="md" className="w-full">
                Open Component Style Guide
              </Button>
            </Link>
          </div>
        </Card>
      </div>

      {/* Footer Info */}
      <div className="flex flex-wrap justify-center gap-2 text-xs font-mono text-ink-muted pt-4">
        <span>Vite 8</span> • <span>React 19</span> • <span>TypeScript 6</span> • <span>Tailwind CSS v4</span>
      </div>
    </main>
  )
}

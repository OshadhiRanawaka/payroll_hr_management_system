import { useState } from 'react'
import { Badge, Button, Card, StatCard, StatusBadge, Table, Tabs } from '../components/ui'
import type { TableColumn } from '../components/ui'

/* ── Sample data for Table demo ─────────────────────────────────────────── */
interface EmployeeRow {
  id: string
  name: string
  department: string
  status: 'Active' | 'Inactive' | 'On Leave'
  salary: number
  joined: string
}

const SAMPLE_EMPLOYEES: EmployeeRow[] = [
  { id: 'EMP-001', name: 'Amara Okonkwo', department: 'Engineering', status: 'Active', salary: 85000, joined: '2022-03-14' },
  { id: 'EMP-002', name: 'Rajiv Menon', department: 'HR', status: 'Active', salary: 62000, joined: '2021-07-01' },
  { id: 'EMP-003', name: 'Sofia Patel', department: 'Finance', status: 'On Leave', salary: 74500, joined: '2020-11-22' },
  { id: 'EMP-004', name: 'Daniel Ferreira', department: 'Engineering', status: 'Active', salary: 91000, joined: '2023-01-09' },
  { id: 'EMP-005', name: 'Priya Anand', department: 'Operations', status: 'Inactive', salary: 55000, joined: '2019-05-30' },
]

const EMPLOYEE_COLS: TableColumn<EmployeeRow>[] = [
  {
    key: 'id',
    header: 'Employee ID',
    mono: true,
    width: '120px',
    render: (row) => (
      <span className="font-tabular text-accent-700 text-[13px]">{row.id}</span>
    ),
  },
  {
    key: 'name',
    header: 'Name',
    render: (row) => (
      <div className="flex items-center gap-2.5">
        <div className="size-7 rounded-full bg-accent-100 flex items-center justify-center text-xs font-semibold text-accent-700 shrink-0">
          {row.name.split(' ').map((n) => n[0]).join('')}
        </div>
        <span className="font-medium text-nav-900">{row.name}</span>
      </div>
    ),
  },
  { key: 'department', header: 'Department' },
  {
    key: 'status',
    header: 'Status',
    render: (row) => <StatusBadge status={row.status} />,
  },
  {
    key: 'salary',
    header: 'Annual Salary',
    align: 'right',
    mono: true,
    render: (row) => (
      <span className="font-tabular text-nav-900">
        ${row.salary.toLocaleString('en-US')}
      </span>
    ),
  },
  {
    key: 'joined',
    header: 'Date Joined',
    mono: true,
    align: 'right',
  },
]

/* ── Color swatch data ───────────────────────────────────────────────────── */
interface SwatchGroup {
  label: string
  description: string
  shades: { shade: string; hex: string; textClass: string }[]
}

const COLOR_PALETTE: SwatchGroup[] = [
  {
    label: 'Navigation',
    description: 'Sidebar, topbar, and navigation shell surfaces.',
    shades: [
      { shade: '950', hex: '#06091a', textClass: 'text-white' },
      { shade: '900', hex: '#0c1228', textClass: 'text-white' },
      { shade: '800', hex: '#131b38', textClass: 'text-white' },
      { shade: '700', hex: '#1c2848', textClass: 'text-white' },
      { shade: '600', hex: '#273659', textClass: 'text-white' },
      { shade: '400', hex: '#5a6f96', textClass: 'text-white' },
      { shade: '200', hex: '#b8c3d8', textClass: 'text-nav-900' },
      { shade: '100', hex: '#dde3ee', textClass: 'text-nav-900' },
    ],
  },
  {
    label: 'Paper',
    description: 'Content area backgrounds, page body, card fills.',
    shades: [
      { shade: '300', hex: '#dbd6ce', textClass: 'text-paper-900' },
      { shade: '200', hex: '#eae7e1', textClass: 'text-paper-900' },
      { shade: '100', hex: '#f4f2ee', textClass: 'text-paper-900' },
      { shade: '50', hex: '#faf9f6', textClass: 'text-paper-900' },
    ],
  },
  {
    label: 'Accent — Teal',
    description: 'Primary actions, active states, links, focus rings.',
    shades: [
      { shade: '800', hex: '#115e59', textClass: 'text-white' },
      { shade: '700', hex: '#0f766e', textClass: 'text-white' },
      { shade: '600', hex: '#0d9488', textClass: 'text-white' },
      { shade: '500', hex: '#14b8a6', textClass: 'text-white' },
      { shade: '400', hex: '#2dd4bf', textClass: 'text-accent-900' },
      { shade: '100', hex: '#ccfbf1', textClass: 'text-accent-800' },
      { shade: '50', hex: '#f0fdfa', textClass: 'text-accent-800' },
    ],
  },
  {
    label: 'Success',
    description: 'Active, Approved, Present, Paid, On-Time.',
    shades: [
      { shade: '700', hex: '#15803d', textClass: 'text-white' },
      { shade: '600', hex: '#16a34a', textClass: 'text-white' },
      { shade: '500', hex: '#22c55e', textClass: 'text-white' },
      { shade: '100', hex: '#dcfce7', textClass: 'text-success-800' },
      { shade: '50', hex: '#f0fdf4', textClass: 'text-success-800' },
    ],
  },
  {
    label: 'Warning',
    description: 'Pending, Late, At-Risk, Needs Action.',
    shades: [
      { shade: '700', hex: '#b45309', textClass: 'text-white' },
      { shade: '600', hex: '#d97706', textClass: 'text-white' },
      { shade: '500', hex: '#f59e0b', textClass: 'text-warning-900' },
      { shade: '100', hex: '#fef3c7', textClass: 'text-warning-800' },
      { shade: '50', hex: '#fffbeb', textClass: 'text-warning-800' },
    ],
  },
  {
    label: 'Danger',
    description: 'Rejected, Absent, Error, Overdue, Negative variance.',
    shades: [
      { shade: '700', hex: '#b91c1c', textClass: 'text-white' },
      { shade: '600', hex: '#dc2626', textClass: 'text-white' },
      { shade: '500', hex: '#ef4444', textClass: 'text-white' },
      { shade: '100', hex: '#fee2e2', textClass: 'text-danger-800' },
      { shade: '50', hex: '#fef2f2', textClass: 'text-danger-800' },
    ],
  },
  {
    label: 'Info',
    description: 'Submitted, Locked, In-Progress, Draft, Informational.',
    shades: [
      { shade: '700', hex: '#1d4ed8', textClass: 'text-white' },
      { shade: '600', hex: '#2563eb', textClass: 'text-white' },
      { shade: '500', hex: '#3b82f6', textClass: 'text-white' },
      { shade: '100', hex: '#dbeafe', textClass: 'text-info-800' },
      { shade: '50', hex: '#eff6ff', textClass: 'text-info-800' },
    ],
  },
]

/* ── Section wrapper ─────────────────────────────────────────────────────── */
function Section({ id, title, description, children }: {
  id: string
  title: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <section id={id} className="scroll-mt-20">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-nav-900">{title}</h2>
        {description && <p className="mt-1 text-sm text-ink-500">{description}</p>}
      </div>
      {children}
    </section>
  )
}

/* ── Divider ─────────────────────────────────────────────────────────────── */
function Divider() {
  return <hr className="border-paper-200 my-12" />
}

/* ── Nav sections ───────────────────────────────────────────────────────── */
const NAV_SECTIONS = [
  { id: 'colors', label: 'Colors' },
  { id: 'typography', label: 'Typography' },
  { id: 'buttons', label: 'Buttons' },
  { id: 'badges', label: 'Badges' },
  { id: 'stat-cards', label: 'Stat Cards' },
  { id: 'cards', label: 'Cards' },
  { id: 'tables', label: 'Tables' },
  { id: 'tabs', label: 'Tabs' },
]

/* ══════════════════════════════════════════════════════════════════════════
   StyleGuidePage — renders all design system components for review
   ══════════════════════════════════════════════════════════════════════════ */
export default function StyleGuidePage() {
  const [activeTab, setActiveTab] = useState('overview')
  const [activePillTab, setActivePillTab] = useState('all')

  return (
    <div className="min-h-screen bg-paper-100">
      {/* ── Sticky header ── */}
      <header className="sticky top-0 z-40 bg-nav-900 border-b border-nav-700 shadow-overlay">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="size-7 rounded-md bg-accent-600 flex items-center justify-center shrink-0">
              <svg className="size-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
              </svg>
            </div>
            <div>
              <span className="text-sm font-semibold text-white">PeopleFlow HR</span>
              <span className="ml-2 text-[11px] font-medium text-nav-400 uppercase tracking-widest">Design System</span>
            </div>
          </div>
          <nav className="flex items-center gap-1 overflow-x-auto">
            {NAV_SECTIONS.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="px-3 py-1.5 text-xs font-medium text-nav-300 hover:text-white rounded transition-colors whitespace-nowrap"
              >
                {s.label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      {/* ── Page hero ── */}
      <div className="bg-nav-900 border-b border-nav-700">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <Badge variant="accent" size="sm">v1.0 · Internal</Badge>
          <h1 className="mt-3 text-3xl font-bold text-white tracking-tight">Design System</h1>
          <p className="mt-2 text-nav-300 text-sm max-w-xl">
            Color tokens, typography, and reusable components for PeopleFlow HR. Build all pages
            from these primitives to ensure visual consistency across every module.
          </p>
        </div>
      </div>

      {/* ── Main content ── */}
      <main className="max-w-6xl mx-auto px-6 py-12 space-y-0">

        {/* ══ COLORS ══════════════════════════════════════════════════════ */}
        <Section
          id="colors"
          title="Color Palette"
          description="All colors are defined as Tailwind v4 @theme tokens. They become utilities automatically: bg-nav-900, text-accent-600, border-success-200, etc."
        >
          <div className="space-y-8">
            {COLOR_PALETTE.map((group) => (
              <div key={group.label}>
                <div className="mb-3">
                  <h3 className="text-sm font-semibold text-nav-800">{group.label}</h3>
                  <p className="text-xs text-ink-400 mt-0.5">{group.description}</p>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {group.shades.map(({ shade, hex, textClass }) => (
                    <div key={shade} className="flex flex-col items-center gap-1">
                      <div
                        className={`size-16 rounded-lg border border-black/10 flex flex-col items-center justify-center gap-0.5 ${textClass}`}
                        style={{ backgroundColor: hex }}
                      >
                        <span className="text-[10px] font-semibold opacity-80">{shade}</span>
                      </div>
                      <span className="text-[10px] font-tabular text-ink-500">{hex}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Divider />

        {/* ══ TYPOGRAPHY ══════════════════════════════════════════════════ */}
        <Section
          id="typography"
          title="Typography"
          description="Inter for all UI text. JetBrains Mono (via .font-tabular) for financial figures, IDs, and timestamps."
        >
          <div className="space-y-6">
            <Card>
              <div className="space-y-5">
                <div className="flex items-baseline gap-4 border-b border-paper-100 pb-5">
                  <span className="text-xs text-ink-400 w-20 shrink-0">text-3xl</span>
                  <span className="text-3xl font-bold text-nav-900 tracking-tight">Page Heading — HR Dashboard</span>
                </div>
                <div className="flex items-baseline gap-4 border-b border-paper-100 pb-5">
                  <span className="text-xs text-ink-400 w-20 shrink-0">text-xl</span>
                  <span className="text-xl font-semibold text-nav-900">Section Heading</span>
                </div>
                <div className="flex items-baseline gap-4 border-b border-paper-100 pb-5">
                  <span className="text-xs text-ink-400 w-20 shrink-0">text-base</span>
                  <span className="text-base text-nav-800">Body text used for descriptions, labels, and general prose content in the application.</span>
                </div>
                <div className="flex items-baseline gap-4 border-b border-paper-100 pb-5">
                  <span className="text-xs text-ink-400 w-20 shrink-0">text-sm</span>
                  <span className="text-sm text-ink-600">Small UI text — table cells, form labels, secondary descriptions and metadata.</span>
                </div>
                <div className="flex items-baseline gap-4 border-b border-paper-100 pb-5">
                  <span className="text-xs text-ink-400 w-20 shrink-0">text-xs</span>
                  <span className="text-xs text-ink-500 uppercase tracking-widest font-semibold">Column Header / Badge Label</span>
                </div>
                <div className="flex items-baseline gap-4">
                  <span className="text-xs text-ink-400 w-20 shrink-0">font-tabular</span>
                  <div className="space-y-1">
                    <p className="font-tabular text-nav-900 text-lg font-semibold">$124,850.00</p>
                    <p className="font-tabular text-sm text-ink-600">EMP-00247 · 2024-09-01T08:32:11Z</p>
                    <p className="font-tabular text-xs text-ink-400">JetBrains Mono — amounts, IDs, timestamps, codes</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </Section>

        <Divider />

        {/* ══ BUTTONS ═════════════════════════════════════════════════════ */}
        <Section
          id="buttons"
          title="Buttons"
          description="Four variants × three sizes. Use primary for the one key action per view; secondary for secondary actions; ghost for tertiary/inline; danger for destructive actions."
        >
          <div className="space-y-6">
            {/* Variants */}
            <Card header={<p className="text-xs font-semibold text-ink-500 uppercase tracking-wider">Variants — medium size</p>}>
              <div className="flex flex-wrap gap-3 items-center">
                <Button variant="primary">Primary Action</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="danger">Delete</Button>
                <Button variant="primary" loading>Loading…</Button>
                <Button variant="primary" disabled>Disabled</Button>
              </div>
            </Card>

            {/* Sizes */}
            <Card header={<p className="text-xs font-semibold text-ink-500 uppercase tracking-wider">Sizes — primary variant</p>}>
              <div className="flex flex-wrap gap-3 items-center">
                <Button size="sm">Small</Button>
                <Button size="md">Medium</Button>
                <Button size="lg">Large</Button>
              </div>
            </Card>

            {/* With icons */}
            <Card header={<p className="text-xs font-semibold text-ink-500 uppercase tracking-wider">With icons</p>}>
              <div className="flex flex-wrap gap-3 items-center">
                <Button
                  variant="primary"
                  iconLeft={
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                  }
                >
                  Add Employee
                </Button>
                <Button
                  variant="secondary"
                  iconLeft={
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  }
                >
                  Export
                </Button>
                <Button
                  variant="ghost"
                  iconRight={
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  }
                >
                  View Details
                </Button>
              </div>
            </Card>
          </div>
        </Section>

        <Divider />

        {/* ══ BADGES ══════════════════════════════════════════════════════ */}
        <Section
          id="badges"
          title="Badges & Status Chips"
          description="Use these semantic variants consistently — never use a color for a meaning it isn't assigned to."
        >
          <div className="space-y-6">
            {/* Semantic variants */}
            <Card header={<p className="text-xs font-semibold text-ink-500 uppercase tracking-wider">Semantic variants</p>}>
              <div className="flex flex-wrap gap-3 items-center">
                <Badge variant="success">Success</Badge>
                <Badge variant="warning">Warning</Badge>
                <Badge variant="danger">Danger</Badge>
                <Badge variant="info">Info</Badge>
                <Badge variant="neutral">Neutral</Badge>
                <Badge variant="accent">Accent</Badge>
              </div>
            </Card>

            {/* With dot */}
            <Card header={<p className="text-xs font-semibold text-ink-500 uppercase tracking-wider">With dot indicator</p>}>
              <div className="flex flex-wrap gap-3 items-center">
                <Badge variant="success" dot>Active</Badge>
                <Badge variant="warning" dot>Pending</Badge>
                <Badge variant="danger" dot>Rejected</Badge>
                <Badge variant="info" dot>Submitted</Badge>
                <Badge variant="neutral" dot>Inactive</Badge>
                <Badge variant="accent" dot>On Leave</Badge>
              </div>
            </Card>

            {/* Pre-configured StatusBadge shortcuts */}
            <Card header={<p className="text-xs font-semibold text-ink-500 uppercase tracking-wider">StatusBadge presets — use these for common HR/payroll statuses</p>}>
              <div className="flex flex-wrap gap-3 items-center">
                <StatusBadge status="Active" />
                <StatusBadge status="Inactive" />
                <StatusBadge status="Pending" />
                <StatusBadge status="Approved" />
                <StatusBadge status="Rejected" />
                <StatusBadge status="Draft" />
                <StatusBadge status="Submitted" />
                <StatusBadge status="Locked" />
                <StatusBadge status="Late" />
                <StatusBadge status="Absent" />
                <StatusBadge status="Present" />
                <StatusBadge status="On Leave" />
                <StatusBadge status="Paid" />
                <StatusBadge status="Overdue" />
              </div>
            </Card>

            {/* Size comparison */}
            <Card header={<p className="text-xs font-semibold text-ink-500 uppercase tracking-wider">Sizes</p>}>
              <div className="flex flex-wrap gap-3 items-center">
                <Badge variant="success" size="sm" dot>Active · sm</Badge>
                <Badge variant="success" size="md" dot>Active · md</Badge>
              </div>
            </Card>
          </div>
        </Section>

        <Divider />

        {/* ══ STAT CARDS ══════════════════════════════════════════════════ */}
        <Section
          id="stat-cards"
          title="Stat Cards"
          description="KPI cards for dashboards. The sparkline uses the trend color automatically. The accent variant highlights a primary metric."
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <StatCard
              label="Total Employees"
              value="247"
              trend={{ value: 4.2, label: 'vs last month' }}
              sparkline={[180, 195, 210, 205, 220, 230, 247]}
              icon={
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              }
            />
            <StatCard
              label="Gross Payroll"
              value="$124,800"
              trend={{ value: 2.1, label: 'vs Sep' }}
              sparkline={[112000, 118000, 121000, 119000, 123000, 124800]}
              icon={
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              variant="accent"
            />
            <StatCard
              label="Absent Today"
              value="12"
              subLabel="of 247 employees"
              trend={{ value: -3.0, label: 'vs yesterday' }}
              sparkline={[18, 14, 12, 16, 11, 15, 12]}
              icon={
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
              }
            />
            <StatCard
              label="Leave Pending"
              value="8"
              subLabel="awaiting approval"
              icon={
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              }
            />
          </div>
        </Section>

        <Divider />

        {/* ══ CARDS ═══════════════════════════════════════════════════════ */}
        <Section
          id="cards"
          title="Cards"
          description="Three variants for different surface depths. Use 'default' (white) for primary content, 'ghost' for secondary groupings, 'nav' for dark-surface blocks."
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card variant="default">
              <p className="text-xs font-semibold text-ink-500 uppercase tracking-wider mb-2">Default Card</p>
              <p className="text-sm text-ink-600">White background with a subtle border and shadow. Use for primary content containers.</p>
            </Card>
            <Card variant="ghost">
              <p className="text-xs font-semibold text-ink-500 uppercase tracking-wider mb-2">Ghost Card</p>
              <p className="text-sm text-ink-600">Paper-tinted background with a soft border. Use for secondary groupings or less prominent content.</p>
            </Card>
            <Card variant="nav">
              <p className="text-xs font-semibold text-nav-300 uppercase tracking-wider mb-2">Nav Card</p>
              <p className="text-sm text-nav-300">Dark navy background. Use for sidebar panels, dark-mode content blocks, or inline tooltips on dark surfaces.</p>
            </Card>
          </div>

          {/* Card with header + footer */}
          <div className="mt-4">
            <Card
              variant="default"
              header={
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-nav-900">Card with Header & Footer</p>
                  <Badge variant="info">Draft</Badge>
                </div>
              }
              footer={
                <div className="flex items-center justify-end gap-2">
                  <Button variant="ghost" size="sm">Cancel</Button>
                  <Button variant="primary" size="sm">Save Changes</Button>
                </div>
              }
            >
              <p className="text-sm text-ink-600">
                Cards support optional <code className="font-tabular text-xs bg-paper-100 px-1 py-0.5 rounded text-accent-700">header</code> and{' '}
                <code className="font-tabular text-xs bg-paper-100 px-1 py-0.5 rounded text-accent-700">footer</code> props that automatically
                get dividers matching the card variant.
              </p>
            </Card>
          </div>

          {/* Padding variants */}
          <div className="grid grid-cols-3 gap-4 mt-4">
            {(['sm', 'md', 'lg'] as const).map((p) => (
              <Card key={p} padding={p}>
                <p className="text-xs font-semibold text-ink-500 uppercase tracking-wider">padding="{p}"</p>
              </Card>
            ))}
          </div>
        </Section>

        <Divider />

        {/* ══ TABLES ══════════════════════════════════════════════════════ */}
        <Section
          id="tables"
          title="Tables"
          description="Dense data table with mono columns for financials, status badges, and row-click support. Includes built-in loading skeleton and empty state."
        >
          <div className="space-y-4">
            <Table
              columns={EMPLOYEE_COLS}
              data={SAMPLE_EMPLOYEES}
              keyExtractor={(row) => row.id}
              caption="Sample employee listing"
            />

            {/* Loading state */}
            <div>
              <p className="text-xs text-ink-400 mb-2 font-medium">Loading skeleton:</p>
              <Table
                columns={EMPLOYEE_COLS}
                data={[]}
                keyExtractor={(row) => row.id}
                loading
                loadingRows={3}
              />
            </div>

            {/* Empty state */}
            <div>
              <p className="text-xs text-ink-400 mb-2 font-medium">Empty state:</p>
              <Table
                columns={EMPLOYEE_COLS}
                data={[]}
                keyExtractor={(row) => row.id}
                emptyMessage="No employees found matching your filters."
              />
            </div>
          </div>
        </Section>

        <Divider />

        {/* ══ TABS ════════════════════════════════════════════════════════ */}
        <Section
          id="tabs"
          title="Tabs"
          description="Two variants: 'underline' for page-level navigation, 'pill' for in-card filtering. Both support count badges and a right-side actions slot."
        >
          <div className="space-y-8">
            {/* Underline tabs */}
            <div>
              <p className="text-xs font-medium text-ink-400 mb-3">Underline variant — page-level navigation</p>
              <Card padding="none">
                <Tabs
                  tabs={[
                    { id: 'overview', label: 'Overview' },
                    { id: 'attendance', label: 'Attendance', count: 3 },
                    { id: 'payroll', label: 'Payroll' },
                    { id: 'leave', label: 'Leave', count: 8 },
                    { id: 'documents', label: 'Documents', disabled: true },
                  ]}
                  activeTab={activeTab}
                  onChange={setActiveTab}
                  variant="underline"
                  className="px-2 pt-1"
                  actions={
                    <Button variant="secondary" size="sm">Export</Button>
                  }
                />
                <div className="p-5">
                  <p className="text-sm text-ink-500">
                    Active tab: <span className="font-semibold text-nav-800">{activeTab}</span>
                  </p>
                </div>
              </Card>
            </div>

            {/* Pill tabs */}
            <div>
              <p className="text-xs font-medium text-ink-400 mb-3">Pill variant — in-card filtering</p>
              <Card>
                <Tabs
                  tabs={[
                    { id: 'all', label: 'All', count: 247 },
                    { id: 'active', label: 'Active', count: 218 },
                    { id: 'on-leave', label: 'On Leave', count: 17 },
                    { id: 'inactive', label: 'Inactive', count: 12 },
                  ]}
                  activeTab={activePillTab}
                  onChange={setActivePillTab}
                  variant="pill"
                  actions={
                    <Button variant="primary" size="sm">+ Add</Button>
                  }
                />
                <div className="mt-4">
                  <p className="text-sm text-ink-500">
                    Active filter: <span className="font-semibold text-nav-800">{activePillTab}</span>
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </Section>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-paper-200">
          <p className="text-xs text-ink-400 text-center">
            PeopleFlow HR Design System · All components in{' '}
            <code className="font-tabular">src/components/ui/</code> · Tokens in{' '}
            <code className="font-tabular">src/index.css</code> · Documented in{' '}
            <code className="font-tabular">DESIGN.md</code>
          </p>
        </div>
      </main>
    </div>
  )
}

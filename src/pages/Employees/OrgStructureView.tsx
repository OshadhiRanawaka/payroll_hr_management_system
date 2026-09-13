import { useState } from 'react'
import { Badge, Card, Table, Tabs } from '../../components/ui'
import type { TableColumn } from '../../components/ui'
import { branches, company, departments, designations, employees } from '../../data'
import type { Branch, Department, Designation } from '../../types'

export function OrgStructureView() {
  const [subTab, setSubTab] = useState('departments')

  const subTabs = [
    { id: 'departments', label: 'Departments & Cost Centers', count: departments.length },
    { id: 'branches', label: 'Company Branches', count: branches.length },
    { id: 'designations', label: 'Designations & Grades', count: designations.length },
  ]

  // Columns for Departments
  const deptCols: TableColumn<Department>[] = [
    { key: 'code', header: 'Dept Code', accessor: 'code', mono: true },
    { key: 'name', header: 'Department Name', accessor: 'name' },
    {
      key: 'costCenter',
      header: 'Cost Center',
      render: (d) => (
        <span className="font-mono text-xs font-bold text-accent px-2 py-0.5 rounded bg-accent-subtle">
          {d.costCenter}
        </span>
      ),
    },
    {
      key: 'head',
      header: 'Head of Department',
      render: (d) => {
        const head = employees.find((e) => e.id === d.headEmployeeId)
        return head ? head.fullName : d.headEmployeeId
      },
    },
    { key: 'description', header: 'Description', accessor: 'description' },
    { key: 'count', header: 'Headcount', accessor: 'employeeCount', align: 'right', mono: true },
  ]

  // Columns for Branches
  const branchCols: TableColumn<Branch>[] = [
    { key: 'code', header: 'Branch Code', accessor: 'code', mono: true },
    { key: 'name', header: 'Branch Name', accessor: 'name' },
    { key: 'type', header: 'Facility Type', accessor: 'type' },
    { key: 'city', header: 'City', accessor: 'city' },
    { key: 'address', header: 'Address Location', accessor: 'address' },
    { key: 'contact', header: 'Contact Number', accessor: 'contactNumber', mono: true },
    { key: 'count', header: 'Headcount Target', accessor: 'headcount', align: 'right', mono: true },
  ]

  // Columns for Designations
  const desigCols: TableColumn<Designation>[] = [
    { key: 'code', header: 'Code', accessor: 'code', mono: true },
    { key: 'title', header: 'Designation Title', accessor: 'title' },
    {
      key: 'dept',
      header: 'Department',
      render: (d) => departments.find((dept) => dept.id === d.departmentId)?.name || 'General',
    },
    {
      key: 'grade',
      header: 'Grade Code',
      render: (d) => <Badge variant="info">{d.grade}</Badge>,
    },
    { key: 'level', header: 'Hierarchy Level', accessor: 'level', align: 'right', mono: true },
  ]

  return (
    <div className="space-y-6">
      {/* Top Company Metadata Card */}
      <Card>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-accent uppercase bg-accent-subtle px-2 py-0.5 rounded">
                Entity Structure
              </span>
              <span className="text-xs text-ink-muted font-mono">{company.code}</span>
            </div>
            <h3 className="text-xl font-bold text-ink mt-1">{company.name}</h3>
            <p className="text-xs text-ink-muted mt-0.5">{company.address}</p>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="bg-paper p-2.5 rounded-lg border border-paper-border text-center">
              <span className="text-ink-muted text-[10px] block">Branches</span>
              <strong className="text-ink text-sm">{branches.length} Locations</strong>
            </div>
            <div className="bg-paper p-2.5 rounded-lg border border-paper-border text-center">
              <span className="text-ink-muted text-[10px] block">Departments</span>
              <strong className="text-ink text-sm">{departments.length} Depts</strong>
            </div>
            <div className="bg-paper p-2.5 rounded-lg border border-paper-border text-center">
              <span className="text-ink-muted text-[10px] block">Total Target</span>
              <strong className="text-ink text-sm">{company.totalHeadcount} Staff</strong>
            </div>
          </div>
        </div>
      </Card>

      {/* Sub-tabs Navigation */}
      <Card padding="none">
        <div className="p-4 border-b border-paper-border">
          <Tabs tabs={subTabs} activeTab={subTab} onChange={setSubTab} variant="pill" />
        </div>

        <div className="p-6">
          {subTab === 'departments' && <Table columns={deptCols} data={departments} keyExtractor={(d) => d.id} />}
          {subTab === 'branches' && <Table columns={branchCols} data={branches} keyExtractor={(b) => b.id} />}
          {subTab === 'designations' && <Table columns={desigCols} data={designations} keyExtractor={(d) => d.id} />}
        </div>
      </Card>
    </div>
  )
}

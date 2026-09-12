# AGENTS.md — PeopleFlow HR

> **Read this file before writing or modifying any code in this repository.**

---

## 1. What This Project Is

**PeopleFlow HR** is a **frontend-only demo** of the enterprise HR & Payroll management system
described in [`docs/hrms-specification.md`](./docs/hrms-specification.md).

- There is **no backend and no database**. All data is static TypeScript mock data that lives in
  `src/data/`.
- The UI demonstrates real workflows, screens, and role-based views as a design and prototype
  artefact. When a real backend is eventually connected, the mock data modules in `src/data/`
  should be replaceable by API calls without restructuring the rest of the codebase.
- Do **not** introduce any server-side dependencies, ORMs, database drivers, or network calls to
  a real API. Keep everything client-side.

---

## 2. Authoritative Source of Truth

**`docs/hrms-specification.md` is the single source of truth for every feature, workflow, field
name, and design decision in this project.**

Before implementing a new module, page, component, or data shape, always read the relevant
sections of that document:

| What you need to know | Where to look |
|---|---|
| What each module must do | **Section 4** — Main Functional Modules |
| Data shapes and field names for mock data | **Section 8** — Suggested Database Domains |
| What each role can see and do | **Section 9** — User Roles & Access Control |
| Navigation structure and UI conventions | **Section 18** — Recommended UI Structure |
| Non-negotiable architectural rules | **Section 19** — Critical Design Decisions |
| End-to-end workflows (onboarding, payroll, leave, attendance) | **Section 14** — Important Workflows |
| Dashboard content per role | **Section 10** — Modern Dashboard Design |

When the spec and any other instruction conflict, **the spec wins** unless the user explicitly
overrides it for this repository.

---

## 3. Build Order & Priority

Implement modules in the following order. Do not skip ahead unless the user explicitly asks:

| Priority | Module | Notes |
|---|---|---|
| 1 | **Dashboard** | Role-aware KPI cards, charts per §10. Build this first so there is always a landing page to return to. |
| 2 | **Employees** | Directory, profile view, employment history per §4.2 & §8 Employee domain. |
| 3 | **Attendance** | Raw event log + processed attendance day view per §4.3, §6, §8 Biometric & Attendance domains. |
| 4 | **Shifts** | Shift definitions and roster calendar per §4.4 & §8 Attendance domain. |
| 5 | **Leave** | Leave types, balances, request list and approval flow per §4.5 & §8 Leave domain. |
| 6 | **Payroll** | Payroll runs with full maker-checker gate per §4.6, §7, §8 Payroll domain. |
| 7 | **Devices** | Device list and sync-log view per §4.3 & §8 Biometric domain. |
| 8 | **Reports** | Attendance, payroll, headcount, overtime and leave reports per §4.13 & §8 Analytics domain. |
| 9 | **Self-Service** | Employee portal (ESS) and manager portal (MSS) per §4.7 & §4.8. |
| 10 | **Settings** | Organization setup, salary structures, leave policies, payroll calendars per §4.1. |

Modules not yet built should have a visible placeholder page (route exists, "Coming soon" or
skeleton content) rather than a 404 or broken nav link.

---

## 4. Critical Design Decisions — Do Not Violate

These three rules from **Section 19 of the spec** are the most likely to be accidentally broken
during implementation. Treat them as hard constraints:

### 4.1 Raw Attendance Events Are Immutable

> *"Keep raw device events immutable and maintain a separate processed attendance layer."*
> — spec §19, §6

- In mock data, the `attendance_events` array (§8 Biometric domain) must **never be mutated**
  when a correction is applied.
- A correction is a **new record** (e.g. an `attendance_corrections` or `attendance_days` override
  entry) that references the original event by ID.
- In the UI, the raw event and the correction must both be **visible and distinguishable** — for
  example, showing the original punch time struck through and the corrected time alongside it, with
  the correcting user and timestamp.
- Never display only the "corrected" version without any indication that a correction was made.

### 4.2 Payroll Runs Require a Genuine Maker-Checker Gate

> *"Never allow a payroll finalization action to silently change after approval; corrections should
> create controlled adjustment records."*
> — spec §19, §7 (Stage 8 Approval)

- In the UI, a payroll run must pass through at least two distinct states before it can be
  considered finalized: **Draft → Submitted (Maker) → Approved (Checker) → Locked**.
- The maker (Payroll Officer) and checker (HR Manager or senior role) **must be different
  roles**. The same role should not be able to both submit and approve.
- A locked payroll run must display as read-only. Any post-lock adjustment must generate a
  visible **adjustment/supplementary run**, not silently edit the locked figures.
- In the mock data model, `payroll_runs` must carry a `status` field
  (`draft | submitted | approved | locked`) and an `approved_by` field distinct from
  `created_by`.

### 4.3 Navigation Is Role-Aware — Hide What a Role Cannot Access

> *"Use least privilege, role-based permissions."* — spec §9

- The left sidebar must only show navigation items the active role is permitted to access.
- The mock role switcher (already planned in the UI) controls which nav items are visible.
- Reference the role-permission matrix in §9 when deciding visibility:

  | Nav item | Super Admin | HR Admin | Payroll Officer | HR Manager | Dept Manager | Employee | Auditor | Device Operator |
  |---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
  | Dashboard | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | — |
  | Employees | ✅ | ✅ | — | ✅ | 👥 own dept | — | 👁 RO | — |
  | Attendance | ✅ | ✅ | — | ✅ | 👥 own dept | 👤 own | 👁 RO | ✅ |
  | Shifts | ✅ | ✅ | — | ✅ | 👥 own dept | — | 👁 RO | — |
  | Leave | ✅ | ✅ | — | ✅ | 👥 own dept | 👤 own | 👁 RO | — |
  | Payroll | ✅ | — | ✅ | ✅ (approve) | — | — | 👁 RO | — |
  | Devices | ✅ | — | — | — | — | — | — | ✅ |
  | Reports | ✅ | ✅ | ✅ | ✅ | 👥 own dept | — | ✅ | — |
  | Self-Service | — | — | — | — | — | ✅ | — | — |
  | Settings | ✅ | — | — | — | — | — | — | — |

  *(👤 = own records only, 👥 = own department only, 👁 RO = read-only, — = hidden)*

- Do not rely on the route being "hard to guess" as a security measure — the role check must be
  applied at the component level too (show an "Unauthorized" state if a role navigates directly to
  a restricted URL).

---

## 5. Mock Data Conventions

- All mock data lives in `src/data/`. Each domain gets its own file, e.g.
  `src/data/employees.ts`, `src/data/attendanceEvents.ts`, `src/data/payrollRuns.ts`.
- Field names must match the entity names in **Section 8** of the spec (snake_case for data,
  camelCase acceptable in TypeScript interfaces — just be consistent within a file).
- TypeScript types for every entity go in `src/types/`. Keep domain types grouped by the §8
  database domain (e.g. `src/types/employee.ts`, `src/types/payroll.ts`).
- Seed enough records to make the UI look realistic: aim for ≥ 20 employees across ≥ 3
  departments, ≥ 2 branches, ≥ 3 months of attendance data, and at least one complete payroll run
  per month.
- Never import from `src/data/` inside `src/types/` — types must have zero runtime dependencies.

---

## 6. Tech Stack Reminder

| Tool | Version | Notes |
|---|---|---|
| Vite | 8+ | Dev server and build tool |
| React | 19 | UI framework |
| TypeScript | 6 | Strict mode preferred |
| Tailwind CSS | 4 | Via `@tailwindcss/vite` — no `tailwind.config.js` needed |
| React Router | 7 | `BrowserRouter` + `<Routes>` in `src/App.tsx` |
| oxlint | 1+ | Primary linter (`npm run lint`) |
| ESLint | 9 | React-specific rules (`npm run lint:eslint`) |
| Prettier | 3 | With `prettier-plugin-tailwindcss` for class sorting |

No backend. No database. No server-side rendering. Frontend only.

---

## 7. Code Style & Quality

- Run `npm run format` before committing to ensure consistent formatting.
- Run `npm run lint` (oxlint) and `npm run lint:eslint` and fix reported issues before opening a PR.
- Prefer named exports for components; default export only for page-level components.
- Use `src/lib/` for shared utility functions (formatters, date helpers, class-name merging, etc.).
- Use `src/components/` for generic, reusable UI primitives (Button, Badge, Card, Table, Modal…).
- Use `src/pages/` for full page components that map to a route.
- Keep components focused. If a page component exceeds ~200 lines, split it into sub-components
  in a folder: `src/pages/Payroll/PayrollRunDetail.tsx`, etc.

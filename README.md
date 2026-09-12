# PeopleFlow HR

> A modern, frontend-only demo of an HR & Payroll management system.

![Stack](https://img.shields.io/badge/stack-React%20%2B%20TypeScript%20%2B%20Tailwind-6366f1?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-22c55e?style=flat-square)
![Status](https://img.shields.io/badge/status-In%20Development-f59e0b?style=flat-square)

---

## About

**PeopleFlow HR** is a frontend-only demo application showcasing a modern HR & Payroll management system. It runs entirely on mock/static data — there is no backend or database. All data lives in `src/data/` as TypeScript modules.

This project is intended as a design and UI prototype, demonstrating how an HR platform might look and function before a backend is integrated.

### Planned Modules

| Module | Description |
|---|---|
| 👥 **Employees** | Directory, profiles, onboarding/offboarding |
| 💰 **Payroll** | Pay runs, payslips, deductions & allowances |
| 🏖️ **Leave** | Leave requests, approvals, balance tracker |
| 📊 **Reports** | Payroll summaries, headcount, attrition |
| ⚙️ **Settings** | Departments, roles, pay grades |

---

## Tech Stack

| Tool | Version | Purpose |
|---|---|---|
| [Vite](https://vite.dev) | v8+ | Build tool & dev server |
| [React](https://react.dev) | v19 | UI framework |
| [TypeScript](https://typescriptlang.org) | v6 | Type safety |
| [Tailwind CSS](https://tailwindcss.com) | v4 | Utility-first styling |
| [React Router](https://reactrouter.com) | v7 | Client-side routing |
| [oxlint](https://oxc.rs/docs/guide/usage/linter) | v1+ | Fast JS/TS linter |
| [ESLint](https://eslint.org) | v9 | React-specific lint rules |
| [Prettier](https://prettier.io) | v3 | Code formatting |

---

## Getting Started

### Prerequisites

- **Node.js** v18 or later
- **npm** v9 or later

### Install & Run

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd payroll_hr_management_system

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

The app will be available at **http://localhost:5173** by default.

---

## Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start the Vite development server |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run oxlint (fast JS/TS linting) |
| `npm run lint:eslint` | Run ESLint (React-specific rules) |
| `npm run format` | Format all source files with Prettier |
| `npm run format:check` | Check formatting without writing |

---

## Project Structure

```
src/
├── components/     # Shared, reusable UI components
├── pages/          # Page-level components (one per route)
├── lib/            # Utility functions and helpers
├── data/           # Mock/seed data (static TypeScript modules)
├── types/          # Shared TypeScript types and interfaces
├── App.tsx         # Root component with router configuration
├── main.tsx        # Application entry point
└── index.css       # Global styles + Tailwind CSS v4 import
```

---

## Contributing

This is a demo project. Fork it, build on it, break it — it's all good. Open a PR if you want to contribute UI modules or mock data.

---

## License

MIT © PeopleFlow HR

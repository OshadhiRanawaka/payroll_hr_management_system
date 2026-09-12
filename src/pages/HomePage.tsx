/**
 * PeopleFlow HR – HomePage
 *
 * Placeholder home page confirming the dev server is running.
 * Replace this with a proper dashboard layout as the project grows.
 */
export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 p-8">
      {/* Hero badge */}
      <span className="rounded-full border border-indigo-500/40 bg-indigo-500/10 px-4 py-1 text-sm font-medium text-indigo-400">
        Frontend Demo · v0.1.0
      </span>

      {/* Logo + title */}
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/30">
          <svg
            className="h-8 w-8 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.8}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </div>

        <h1 className="text-5xl font-bold tracking-tight text-slate-100">
          PeopleFlow{' '}
          <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
            HR
          </span>
        </h1>

        <p className="max-w-md text-lg text-slate-400">
          A modern HR &amp; Payroll management system. Built with React, TypeScript, and Tailwind CSS.
        </p>
      </div>

      {/* Status card */}
      <div className="w-full max-w-sm rounded-2xl border border-slate-700/60 bg-slate-800/50 p-6 shadow-xl backdrop-blur-sm">
        <div className="mb-4 flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500" />
          </span>
          <span className="text-sm font-medium text-emerald-400">Dev server running</span>
        </div>
        <p className="text-sm text-slate-500">
          Router is configured. Start building your pages inside{' '}
          <code className="rounded bg-slate-700 px-1.5 py-0.5 font-mono text-xs text-slate-300">
            src/pages/
          </code>
          .
        </p>
      </div>

      {/* Stack chips */}
      <div className="flex flex-wrap justify-center gap-2">
        {['Vite', 'React 19', 'TypeScript', 'Tailwind CSS v4', 'React Router v7'].map((tech) => (
          <span
            key={tech}
            className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1 text-xs font-medium text-slate-400"
          >
            {tech}
          </span>
        ))}
      </div>
    </main>
  )
}

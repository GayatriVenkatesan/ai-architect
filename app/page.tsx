import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* Navbar */}
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">ArchiFlow AI</h1>
            <p className="text-sm text-slate-400">
              AI Operating System for Architecture Firms
            </p>
          </div>

          <nav className="hidden items-center gap-6 md:flex">
            <a href="#features" className="text-sm text-slate-300 hover:text-white">
              Features
            </a>
            <a href="#modules" className="text-sm text-slate-300 hover:text-white">
              Modules
            </a>
            <a href="#workflow" className="text-sm text-slate-300 hover:text-white">
              Workflow
            </a>
            <Link
              href="/login"
              className="rounded-xl border border-white/20 px-4 py-2 text-sm font-medium text-white hover:bg-white hover:text-slate-950"
            >
              Login
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="mx-auto grid min-h-[80vh] max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-2">
        <div>
          <p className="mb-4 inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm font-medium text-cyan-300">
            AI-powered architecture workflow platform
          </p>

          <h2 className="mb-6 text-5xl font-bold leading-tight md:text-6xl">
            Design, manage, and monitor architecture projects with AI.
          </h2>

          <p className="mb-8 max-w-2xl text-lg leading-8 text-slate-300">
            ArchiFlow AI helps architecture firms handle client requirements,
            design intelligence, interior planning, construction monitoring,
            workflow automation, and client collaboration from one centralized
            workspace.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              href="/signup"
              className="rounded-xl bg-cyan-400 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300"
            >
              Start Free Workspace
            </Link>

            <Link
              href="/dashboard"
              className="rounded-xl border border-white/20 px-6 py-3 font-semibold text-white transition hover:bg-white hover:text-slate-950"
            >
              View Demo Dashboard
            </Link>
          </div>
        </div>

        {/* Dashboard Preview Card */}
        <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-2xl">
          <div className="rounded-2xl bg-slate-900 p-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold">Project Intelligence</h3>
                <p className="text-sm text-slate-400">
                  Live overview of architecture operations
                </p>
              </div>
              <span className="rounded-full bg-green-400/10 px-3 py-1 text-sm text-green-300">
                Active
              </span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-slate-800 p-4">
                <p className="text-sm text-slate-400">Active Projects</p>
                <h4 className="mt-2 text-3xl font-bold">12</h4>
              </div>

              <div className="rounded-2xl bg-slate-800 p-4">
                <p className="text-sm text-slate-400">AI Reports</p>
                <h4 className="mt-2 text-3xl font-bold">28</h4>
              </div>

              <div className="rounded-2xl bg-slate-800 p-4">
                <p className="text-sm text-slate-400">Site Progress</p>
                <h4 className="mt-2 text-3xl font-bold">74%</h4>
              </div>

              <div className="rounded-2xl bg-slate-800 p-4">
                <p className="text-sm text-slate-400">Delay Risk</p>
                <h4 className="mt-2 text-3xl font-bold text-orange-300">
                  Medium
                </h4>
              </div>
            </div>

            <div className="mt-6 rounded-2xl bg-cyan-400/10 p-4">
              <p className="text-sm font-medium text-cyan-200">
                AI Insight
              </p>
              <p className="mt-2 text-sm text-slate-300">
                Material cost may increase by 12% for the Luxury Villa project.
                Review budget forecast before approval.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-7xl px-6 py-20">
        <div className="mb-12 max-w-3xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">
            Why ArchiFlow AI
          </p>
          <h2 className="text-4xl font-bold">
            One workspace for the full architecture lifecycle.
          </h2>
          <p className="mt-4 text-slate-300">
            Instead of managing clients, documents, approvals, construction
            updates, and design decisions separately, ArchiFlow AI connects
            everything in one intelligent platform.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h3 className="mb-3 text-xl font-bold">
              AI Requirement Analyzer
            </h3>
            <p className="text-slate-400">
              Convert client conversations into project summaries, budget
              forecasts, feasibility reports, and scope documents.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h3 className="mb-3 text-xl font-bold">
              Workflow Automation
            </h3>
            <p className="text-slate-400">
              Track requirement collection, concept design, approvals, interior
              design, construction, inspection, and handover.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h3 className="mb-3 text-xl font-bold">
              Construction Monitoring
            </h3>
            <p className="text-slate-400">
              Upload site photos, track progress, predict delays, and generate
              weekly construction reports.
            </p>
          </div>
        </div>
      </section>

      {/* Modules */}
      <section id="modules" className="border-y border-white/10 bg-white/5">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="mb-12">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">
              Core Modules
            </p>
            <h2 className="text-4xl font-bold">
              Built for clients, architects, designers, and construction teams.
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              "Client Requirement AI",
              "Architecture Design Intelligence",
              "Interior Design Automation",
              "Workflow Builder",
              "Construction Site Monitoring",
              "Client Experience Portal",
              "RAG Knowledge System",
              "3D Visualization Ready",
            ].map((module) => (
              <div
                key={module}
                className="rounded-2xl border border-white/10 bg-slate-950 p-5"
              >
                <p className="font-semibold text-white">{module}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow */}
      <section id="workflow" className="mx-auto max-w-7xl px-6 py-20">
        <div className="mb-12 max-w-3xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">
            Project Workflow
          </p>
          <h2 className="text-4xl font-bold">
            From requirement collection to project handover.
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-4">
          {[
            "Requirement Collection",
            "Concept Design",
            "Client Approval",
            "Interior Planning",
            "Construction Monitoring",
            "Quality Inspection",
            "Client Feedback",
            "Final Handover",
          ].map((step, index) => (
            <div
              key={step}
              className="rounded-2xl border border-white/10 bg-white/5 p-6"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-cyan-400 font-bold text-slate-950">
                {index + 1}
              </div>
              <h3 className="font-bold">{step}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 px-6 py-8 text-center text-sm text-slate-500">
        © 2026 ArchiFlow AI. Built as an AI-first architecture SaaS platform.
      </footer>
    </main>
  );
}
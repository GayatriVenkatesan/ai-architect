import Link from "next/link";

type Stat = {
  title: string;
  value: string;
  description: string;
  icon: "projects" | "approvals" | "reports" | "progress";
};

type Project = {
  name: string;
  stage: string;
  budget: string;
  progress: number;
  status: string;
};

const stats: Stat[] = [
  {
    title: "Active Projects",
    value: "12",
    description: "3 new projects added this month",
    icon: "projects",
  },
  {
    title: "Pending Approvals",
    value: "5",
    description: "Client confirmations required",
    icon: "approvals",
  },
  {
    title: "AI Reports Generated",
    value: "28",
    description: "Feasibility and budget reports",
    icon: "reports",
  },
  {
    title: "Average Site Progress",
    value: "74%",
    description: "Across active construction projects",
    icon: "progress",
  },
];

const projects: Project[] = [
  {
    name: "Luxury Villa Design",
    stage: "Concept Design",
    budget: "₹85L",
    progress: 42,
    status: "Design Review",
  },
  {
    name: "Apartment Interior Plan",
    stage: "Interior Automation",
    budget: "₹18L",
    progress: 68,
    status: "Client Approval",
  },
  {
    name: "Commercial Workspace",
    stage: "Construction Monitoring",
    budget: "₹1.2Cr",
    progress: 74,
    status: "On Track",
  },
];

const activities = [
  "AI generated a feasibility report for Luxury Villa Design.",
  "Client approved the Apartment Interior Plan mood board.",
  "Site supervisor uploaded new construction progress photos.",
  "Budget risk detected for Commercial Workspace material planning.",
];

const lifecycle = [
  "Requirement Collection",
  "Concept Design",
  "Client Approval",
  "Interior Design",
  "Construction",
  "Quality Inspection",
  "Final Handover",
];

function DashboardIcon({ type }: { type: Stat["icon"] }) {
  if (type === "projects") {
    return (
      <svg
        className="h-6 w-6"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path d="M4 19V5a2 2 0 0 1 2-2h8l6 6v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z" />
        <path d="M14 3v6h6" />
        <path d="M8 13h8" />
        <path d="M8 17h5" />
      </svg>
    );
  }

  if (type === "approvals") {
    return (
      <svg
        className="h-6 w-6"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path d="M9 12.5l2 2 4-5" />
        <path d="M5 4h14v16H5z" />
        <path d="M8 7h8" />
        <path d="M8 17h8" />
      </svg>
    );
  }

  if (type === "reports") {
    return (
      <svg
        className="h-6 w-6"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path d="M4 19V5a2 2 0 0 1 2-2h7l7 7v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z" />
        <path d="M13 3v7h7" />
        <path d="M8 16h8" />
        <path d="M8 12h3" />
      </svg>
    );
  }

  return (
    <svg
      className="h-6 w-6"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M4 19h16" />
      <path d="M7 16V9" />
      <path d="M12 16V5" />
      <path d="M17 16v-4" />
    </svg>
  );
}

export default function DashboardPage() {
  return (
    <>
      <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-start">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.35em] text-cyan-300">
            Dashboard
          </p>

          <h2 className="mt-4 text-4xl font-bold tracking-tight text-white">
            Welcome to ArchiFlow AI
          </h2>

          <p className="mt-3 max-w-3xl text-base leading-7 text-slate-300">
            Manage architecture projects, AI reports, approvals, client
            requirements, and construction progress from one intelligent
            workspace.
          </p>
        </div>

        <Link
          href="/"
          className="rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:border-cyan-400 hover:text-cyan-300"
        >
          Back to Home
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl shadow-black/20 transition hover:border-cyan-400/40"
          >
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-300">
              <DashboardIcon type={stat.icon} />
            </div>

            <p className="text-sm font-medium text-slate-300">{stat.title}</p>

            <h3 className="mt-3 text-4xl font-bold text-white">
              {stat.value}
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              {stat.description}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-3">
        <div className="rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl shadow-black/20 xl:col-span-2">
          <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h3 className="text-2xl font-bold text-white">
                Project Overview
              </h3>

              <p className="mt-2 text-sm text-slate-400">
                Current architecture projects handled by your team
              </p>
            </div>

            <button className="rounded-xl bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-300">
              New Project
            </button>
          </div>

          <div className="space-y-4">
            {projects.map((project) => (
              <div
                key={project.name}
                className="rounded-2xl border border-white/10 bg-slate-950/70 p-5"
              >
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                  <div>
                    <h4 className="text-lg font-bold text-white">
                      {project.name}
                    </h4>

                    <p className="mt-1 text-sm text-slate-400">
                      {project.stage} · Budget {project.budget}
                    </p>
                  </div>

                  <div className="text-left md:text-right">
                    <p className="text-sm font-semibold text-cyan-300">
                      {project.status}
                    </p>

                    <p className="mt-1 text-sm text-slate-400">
                      {project.progress}% complete
                    </p>
                  </div>
                </div>

                <div className="mt-5 h-2 rounded-full bg-slate-800">
                  <div
                    className="h-2 rounded-full bg-cyan-400"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl shadow-black/20">
          <h3 className="text-2xl font-bold text-white">AI Insights</h3>

          <p className="mt-2 text-sm text-slate-400">
            Smart suggestions from ArchiFlow AI
          </p>

          <div className="mt-6 space-y-4">
            <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4">
              <p className="font-semibold text-cyan-300">Budget Warning</p>

              <p className="mt-2 text-sm leading-6 text-slate-300">
                Material cost may increase by 12% for Luxury Villa Design.
                Review the budget forecast before approval.
              </p>
            </div>

            <div className="rounded-2xl border border-orange-400/20 bg-orange-400/10 p-4">
              <p className="font-semibold text-orange-300">Approval Delay</p>

              <p className="mt-2 text-sm leading-6 text-slate-300">
                5 approvals are waiting for client confirmation. Follow-up
                reminders should be triggered.
              </p>
            </div>

            <div className="rounded-2xl border border-green-400/20 bg-green-400/10 p-4">
              <p className="font-semibold text-green-300">
                Site Progress Healthy
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-300">
                Commercial Workspace is currently on track with the planned
                construction timeline.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl shadow-black/20">
          <h3 className="text-2xl font-bold text-white">Recent Activity</h3>

          <p className="mt-2 text-sm text-slate-400">
            Latest workspace actions and AI updates
          </p>

          <div className="mt-6 space-y-5">
            {activities.map((activity, index) => (
              <div key={activity} className="flex gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cyan-400 text-sm font-bold text-slate-950">
                  {index + 1}
                </div>

                <p className="text-sm leading-6 text-slate-300">{activity}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl shadow-black/20">
          <h3 className="text-2xl font-bold text-white">Project Lifecycle</h3>

          <p className="mt-2 text-sm text-slate-400">
            Standard workflow followed by architecture teams
          </p>

          <div className="mt-6 grid gap-3">
            {lifecycle.map((step, index) => (
              <div
                key={step}
                className="flex items-center gap-4 rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-sm font-bold text-cyan-300">
                  {index + 1}
                </span>

                <p className="text-sm font-medium text-slate-300">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
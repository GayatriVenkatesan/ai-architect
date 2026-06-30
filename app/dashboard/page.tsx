"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getAnalyticsSummary, getProjects } from "../lib/api";

type Project = {
  id: number;
  name: string;
  client: string;
  project_type: string;
  location: string;
  status: string;
  stage: string;
  progress: number;
  budget: number;
  deadline: string;
  description?: string;
  delay_risk: "Low" | "Medium" | "High";
  client_satisfaction: number;
};

type ProjectsResponse = {
  total: number;
  projects: Project[];
};

type AnalyticsSummary = {
  total_projects: number;
  total_budget: number;
  average_progress: number;
  high_risk_projects: number;
  completed_projects: number;
  planning_projects: number;
  project_type_breakdown: Record<string, number>;
};

type Activity = {
  id: number;
  title: string;
  description: string;
  time: string;
};

type Insight = {
  id: number;
  title: string;
  description: string;
  priority: "High" | "Medium" | "Low";
};

const activities: Activity[] = [
  {
    id: 1,
    title: "Backend connected",
    description: "Dashboard project data is fetched from FastAPI and SQLite.",
    time: "Live",
  },
  {
    id: 2,
    title: "Analytics API active",
    description: "Dashboard statistics are loaded from /analytics/summary.",
    time: "Live",
  },
  {
    id: 3,
    title: "Project portfolio loaded",
    description: "Architecture project records are displayed from /projects.",
    time: "Live",
  },
  {
    id: 4,
    title: "Next milestone",
    description: "Connect Projects, Requirements, Interior, Documents, and Feedback pages.",
    time: "Next",
  },
];

const insights: Insight[] = [
  {
    id: 1,
    title: "Backend foundation is stable",
    description:
      "FastAPI, SQLite, and Next.js are now working together through live API calls.",
    priority: "High",
  },
  {
    id: 2,
    title: "Frontend integration started",
    description:
      "The dashboard is the first page connected to backend project and analytics data.",
    priority: "Medium",
  },
  {
    id: 3,
    title: "Portfolio readiness improving",
    description:
      "After connecting all pages, the project becomes a strong MVP for GitHub and LinkedIn.",
    priority: "Low",
  },
];

function formatCurrency(amount?: number | string | null) {
  const numericAmount = typeof amount === "string" ? Number(amount) : amount;

  if (typeof numericAmount !== "number" || Number.isNaN(numericAmount)) {
    return "₹0";
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(numericAmount);
}

function getPriorityStyle(priority: Insight["priority"]) {
  if (priority === "High") {
    return "border-red-400/30 bg-red-400/10 text-red-200";
  }

  if (priority === "Medium") {
    return "border-amber-400/30 bg-amber-400/10 text-amber-200";
  }

  return "border-emerald-400/30 bg-emerald-400/10 text-emerald-200";
}

function getRiskStyle(risk: Project["delay_risk"]) {
  if (risk === "High") {
    return "border-red-400/30 bg-red-400/10 text-red-200";
  }

  if (risk === "Medium") {
    return "border-amber-400/30 bg-amber-400/10 text-amber-200";
  }

  return "border-emerald-400/30 bg-emerald-400/10 text-emerald-200";
}

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [projectsData, analyticsData] = await Promise.all([
          getProjects() as Promise<ProjectsResponse>,
          getAnalyticsSummary() as Promise<AnalyticsSummary>,
        ]);

        setProjects(projectsData.projects || []);
        setAnalytics(analyticsData);
      } catch {
        setError("Unable to connect to FastAPI backend.");
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  const totalProjects = analytics?.total_projects ?? projects.length;
  const averageProgress = analytics?.average_progress ?? 0;
  const totalBudget = analytics?.total_budget ?? 0;
  const highRiskProjects = analytics?.high_risk_projects ?? 0;
  const planningProjects = analytics?.planning_projects ?? 0;
  const projectTypeBreakdown = analytics?.project_type_breakdown ?? {};

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-8 text-white">
      <div className="mx-auto max-w-7xl">
        <section className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-slate-900 via-slate-950 to-black p-8 shadow-2xl shadow-slate-950/60">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300">
                ArchiFlow AI Command Center
              </p>

              <h1 className="mt-4 text-3xl font-bold tracking-tight text-white md:text-4xl">
                Architecture Workflow Dashboard
              </h1>

              <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-400">
                Monitor architecture projects, design progress, budgets, AI
                insights, construction workflow status, and client engagement
                from one intelligent workspace.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/dashboard/ar-vr"
                className="rounded-2xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
              >
                Open AR/VR Module
              </Link>

              <Link
                href="/dashboard/backend-test"
                className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-cyan-400/50 hover:text-cyan-200"
              >
                Test Backend API
              </Link>
            </div>
          </div>
        </section>

        {loading && (
          <section className="mt-8 rounded-3xl border border-white/10 bg-white/[0.04] p-6 text-slate-300">
            Loading dashboard data from FastAPI backend...
          </section>
        )}

        {error && (
          <section className="mt-8 rounded-3xl border border-red-400/30 bg-red-400/10 p-6 text-red-200">
            {error}
            <p className="mt-2 text-sm text-red-100/80">
              Make sure backend is running at http://127.0.0.1:8000
            </p>
          </section>
        )}

        {!loading && !error && (
          <>
            <section className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-xl">
                <p className="text-sm text-slate-400">Total Projects</p>
                <h2 className="mt-3 text-3xl font-bold text-white">
                  {totalProjects}
                </h2>
                <p className="mt-2 text-sm text-emerald-300">
                  From Analytics API
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-xl">
                <p className="text-sm text-slate-400">Average Progress</p>
                <h2 className="mt-3 text-3xl font-bold text-white">
                  {averageProgress}%
                </h2>
                <p className="mt-2 text-sm text-cyan-300">
                  Across all projects
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-xl">
                <p className="text-sm text-slate-400">Total Budget</p>
                <h2 className="mt-3 text-3xl font-bold text-white">
                  {formatCurrency(totalBudget)}
                </h2>
                <p className="mt-2 text-sm text-amber-300">
                  Estimated portfolio value
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-xl">
                <p className="text-sm text-slate-400">High Risk Projects</p>
                <h2 className="mt-3 text-3xl font-bold text-white">
                  {highRiskProjects}
                </h2>
                <p className="mt-2 text-sm text-red-300">
                  Needs closer monitoring
                </p>
              </div>
            </section>

            <section className="mt-8 grid gap-6 xl:grid-cols-[1.6fr_1fr]">
              <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-xl">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300">
                      Project Portfolio
                    </p>

                    <h2 className="mt-2 text-2xl font-semibold text-white">
                      Active Design Projects
                    </h2>
                  </div>

                  <p className="text-sm text-slate-400">
                    {projects.length} projects from FastAPI
                  </p>
                </div>

                <div className="mt-6 grid gap-4">
                  {projects.map((project) => (
                    <article
                      key={project.id}
                      className="rounded-3xl border border-white/10 bg-slate-950/70 p-5 transition hover:border-cyan-400/40"
                    >
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div>
                          <div className="flex flex-wrap items-center gap-3">
                            <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-200">
                              {project.project_type}
                            </span>

                            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
                              {project.status}
                            </span>

                            <span
                              className={`rounded-full border px-3 py-1 text-xs font-semibold ${getRiskStyle(
                                project.delay_risk
                              )}`}
                            >
                              {project.delay_risk} Risk
                            </span>
                          </div>

                          <h3 className="mt-4 text-lg font-semibold text-white">
                            {project.name}
                          </h3>

                          <p className="mt-2 text-sm text-slate-400">
                            {project.location}
                          </p>

                          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">
                            {project.description}
                          </p>
                        </div>

                        <div className="min-w-[190px] rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                          <p className="text-xs text-slate-500">Budget</p>
                          <p className="mt-1 text-sm font-semibold text-white">
                            {formatCurrency(project.budget)}
                          </p>

                          <p className="mt-4 text-xs text-slate-500">
                            Deadline
                          </p>
                          <p className="mt-1 text-sm font-semibold text-white">
                            {project.deadline || "Not set"}
                          </p>

                          <p className="mt-4 text-xs text-slate-500">
                            Client Satisfaction
                          </p>
                          <p className="mt-1 text-sm font-semibold text-white">
                            {project.client_satisfaction}%
                          </p>
                        </div>
                      </div>

                      <div className="mt-5">
                        <div className="mb-2 flex items-center justify-between text-xs text-slate-400">
                          <span>Progress</span>
                          <span>{project.progress}%</span>
                        </div>

                        <div className="h-2 overflow-hidden rounded-full bg-white/10">
                          <div
                            className="h-full rounded-full bg-cyan-400"
                            style={{
                              width: `${project.progress}%`,
                            }}
                          />
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-xl">
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300">
                    Analytics Summary
                  </p>

                  <h2 className="mt-2 text-2xl font-semibold text-white">
                    Project Intelligence
                  </h2>

                  <div className="mt-6 grid gap-4">
                    <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-4">
                      <p className="text-sm text-slate-400">
                        Planning Projects
                      </p>
                      <h3 className="mt-2 text-2xl font-bold text-white">
                        {planningProjects}
                      </h3>
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-4">
                      <p className="text-sm text-slate-400">
                        Project Type Breakdown
                      </p>

                      <div className="mt-4 space-y-3">
                        {Object.entries(projectTypeBreakdown).map(
                          ([type, count]) => (
                            <div
                              key={type}
                              className="flex items-center justify-between rounded-2xl bg-white/[0.03] px-4 py-3 text-sm"
                            >
                              <span className="text-slate-300">{type}</span>
                              <span className="font-semibold text-white">
                                {count}
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-xl">
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300">
                    AI Insights
                  </p>

                  <h2 className="mt-2 text-2xl font-semibold text-white">
                    Design Intelligence
                  </h2>

                  <div className="mt-6 space-y-4">
                    {insights.map((insight) => (
                      <div
                        key={insight.id}
                        className="rounded-3xl border border-white/10 bg-slate-950/70 p-4"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <h3 className="text-sm font-semibold text-white">
                            {insight.title}
                          </h3>

                          <span
                            className={`rounded-full border px-3 py-1 text-[11px] font-semibold ${getPriorityStyle(
                              insight.priority
                            )}`}
                          >
                            {insight.priority}
                          </span>
                        </div>

                        <p className="mt-3 text-sm leading-6 text-slate-400">
                          {insight.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <section className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300">
                Recent Activity
              </p>

              <h2 className="mt-2 text-2xl font-semibold text-white">
                Workflow Updates
              </h2>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {activities.map((activity) => (
                  <div
                    key={activity.id}
                    className="rounded-3xl border border-white/10 bg-slate-950/70 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-sm font-semibold text-white">
                          {activity.title}
                        </h3>

                        <p className="mt-2 text-sm leading-6 text-slate-400">
                          {activity.description}
                        </p>
                      </div>

                      <span className="text-xs text-slate-500">
                        {activity.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-xl">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300">
                    Backend Status
                  </p>

                  <h2 className="mt-2 text-2xl font-semibold text-white">
                    FastAPI Dashboard Connection Active
                  </h2>

                  <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-400">
                    The main dashboard is now connected to FastAPI project and
                    analytics endpoints. This confirms the frontend-backend SaaS
                    foundation is working.
                  </p>
                </div>

                <div className="rounded-3xl border border-emerald-400/20 bg-emerald-400/10 px-5 py-4">
                  <p className="text-sm font-semibold text-emerald-200">
                    Live API Data
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    /projects + /analytics/summary
                  </p>
                </div>
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}
"use client";

import { useEffect, useState } from "react";
import { getAnalyticsSummary, getProjects } from "../../lib/api";

type AnalyticsSummary = {
  total_projects: number;
  total_budget: number;
  average_progress: number;
  high_risk_projects: number;
};

type Project = {
  id: number;
  project_name: string;
  client_name: string;
  location: string;
  project_type?: string | null;
  status?: string | null;
  budget?: number | null;
  progress?: number | null;
  risk_level?: string | null;
  created_at?: string | null;
};

type ProjectsResponse = {
  total?: number;
  projects?: Project[];
  data?: Project[];
};

export default function AnalyticsPage() {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  function normalizeProjects(response: ProjectsResponse | Project[]) {
    if (Array.isArray(response)) {
      return response;
    }

    return response.projects || response.data || [];
  }

  function calculateSummary(projectList: Project[]): AnalyticsSummary {
    const totalProjects = projectList.length;

    const totalBudget = projectList.reduce((total, project) => {
      return total + Number(project.budget || 0);
    }, 0);

    const totalProgress = projectList.reduce((total, project) => {
      return total + Number(project.progress || 0);
    }, 0);

    const averageProgress =
      totalProjects > 0 ? totalProgress / totalProjects : 0;

    const highRiskProjects = projectList.filter(
      (project) => project.risk_level?.toLowerCase() === "high"
    ).length;

    return {
      total_projects: totalProjects,
      total_budget: totalBudget,
      average_progress: averageProgress,
      high_risk_projects: highRiskProjects,
    };
  }

  async function loadAnalyticsData() {
    try {
      setLoading(true);
      setError("");

      const projectsResponse = (await getProjects()) as
        | ProjectsResponse
        | Project[];

      const projectList = normalizeProjects(projectsResponse);

      setProjects(projectList);

      try {
        const analyticsResponse =
          (await getAnalyticsSummary()) as AnalyticsSummary;

        setSummary(analyticsResponse);
      } catch (analyticsError) {
        console.error(analyticsError);
        setSummary(calculateSummary(projectList));
      }
    } catch (projectError) {
      console.error(projectError);
      setError(
        "Unable to load analytics. Please check whether backend /projects API is working."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAnalyticsData();
  }, []);

  const planningProjects = projects.filter(
    (project) => project.status?.toLowerCase() === "planning"
  ).length;

  const activeProjects = projects.filter((project) => {
    const status = project.status?.toLowerCase();

    return status === "active" || status === "in progress";
  }).length;

  const completedProjects = projects.filter(
    (project) => project.status?.toLowerCase() === "completed"
  ).length;

  const highRiskProjects = projects.filter(
    (project) => project.risk_level?.toLowerCase() === "high"
  );

  function formatCurrency(value: number) {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  }

  function getRiskStyle(riskLevel?: string | null) {
    const risk = riskLevel?.toLowerCase();

    if (risk === "high") {
      return "border-red-500/30 bg-red-500/10 text-red-300";
    }

    if (risk === "medium") {
      return "border-amber-500/30 bg-amber-500/10 text-amber-300";
    }

    return "border-emerald-500/30 bg-emerald-500/10 text-emerald-300";
  }

  function getProgressColor(progress?: number | null) {
    const value = progress || 0;

    if (value >= 75) {
      return "bg-emerald-400";
    }

    if (value >= 40) {
      return "bg-cyan-400";
    }

    return "bg-amber-400";
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 px-6 py-8 text-slate-100">
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8 text-center text-slate-400">
          Loading analytics...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-7xl space-y-8 px-6 py-8">
        <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl shadow-black/20">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.25em] text-cyan-400">
                Business Intelligence
              </p>

              <h1 className="mt-3 text-3xl font-bold tracking-tight text-white">
                Analytics Dashboard
              </h1>

              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">
                Track project performance, budget allocation, construction
                progress, and risk levels across the ArchiFlow AI workspace.
              </p>
            </div>

            <button
              onClick={loadAnalyticsData}
              className="rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-5 py-3 text-sm font-semibold text-cyan-200 transition hover:bg-cyan-500/20"
            >
              Refresh Analytics
            </button>
          </div>
        </section>

        {error && (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-sm text-red-200">
            {error}
          </div>
        )}

        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
            <p className="text-sm text-slate-400">Total Projects</p>
            <h2 className="mt-3 text-3xl font-bold text-white">
              {summary?.total_projects ?? projects.length}
            </h2>
            <p className="mt-3 text-xs text-slate-500">
              Projects stored in backend
            </p>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
            <p className="text-sm text-slate-400">Total Budget</p>
            <h2 className="mt-3 text-3xl font-bold text-white">
              {formatCurrency(summary?.total_budget ?? 0)}
            </h2>
            <p className="mt-3 text-xs text-slate-500">
              Combined project value
            </p>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
            <p className="text-sm text-slate-400">Average Progress</p>
            <h2 className="mt-3 text-3xl font-bold text-white">
              {Math.round(summary?.average_progress ?? 0)}%
            </h2>
            <p className="mt-3 text-xs text-slate-500">
              Overall completion average
            </p>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
            <p className="text-sm text-slate-400">High Risk Projects</p>
            <h2 className="mt-3 text-3xl font-bold text-white">
              {summary?.high_risk_projects ?? highRiskProjects.length}
            </h2>
            <p className="mt-3 text-xs text-slate-500">
              Needs immediate attention
            </p>
          </div>
        </section>

        <section className="grid gap-8 xl:grid-cols-[1fr_420px]">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-white">
                Project Progress Overview
              </h2>

              <p className="mt-2 text-sm text-slate-400">
                Live project progress data loaded from FastAPI backend.
              </p>
            </div>

            {projects.length === 0 ? (
              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-8 text-center">
                <h3 className="text-lg font-semibold text-white">
                  No projects found
                </h3>

                <p className="mt-2 text-sm text-slate-400">
                  Add projects first to view analytics.
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                {projects.map((project) => {
                  const progress = project.progress || 0;

                  return (
                    <article
                      key={project.id}
                      className="rounded-2xl border border-slate-800 bg-slate-950 p-5"
                    >
                      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-white">
                            {project.project_name}
                          </h3>

                          <p className="mt-1 text-sm text-slate-400">
                            {project.client_name} • {project.location}
                          </p>
                        </div>

                        <span
                          className={`rounded-full border px-3 py-1 text-xs font-semibold ${getRiskStyle(
                            project.risk_level
                          )}`}
                        >
                          {project.risk_level || "Low"} Risk
                        </span>
                      </div>

                      <div className="mt-5">
                        <div className="mb-2 flex items-center justify-between text-sm">
                          <span className="text-slate-400">Progress</span>
                          <span className="font-semibold text-white">
                            {progress}%
                          </span>
                        </div>

                        <div className="h-3 overflow-hidden rounded-full bg-slate-800">
                          <div
                            className={`h-full rounded-full ${getProgressColor(
                              progress
                            )}`}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>

                      <div className="mt-5 grid gap-4 md:grid-cols-3">
                        <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
                          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                            Type
                          </p>
                          <p className="mt-2 text-sm font-semibold text-white">
                            {project.project_type || "Architecture"}
                          </p>
                        </div>

                        <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
                          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                            Status
                          </p>
                          <p className="mt-2 text-sm font-semibold text-white">
                            {project.status || "Planning"}
                          </p>
                        </div>

                        <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
                          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                            Budget
                          </p>
                          <p className="mt-2 text-sm font-semibold text-white">
                            {formatCurrency(project.budget || 0)}
                          </p>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>

          <aside className="space-y-8">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
              <h2 className="text-xl font-semibold text-white">
                Status Summary
              </h2>

              <p className="mt-2 text-sm text-slate-400">
                Project distribution by current status.
              </p>

              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950 p-4">
                  <span className="text-sm text-slate-300">Planning</span>
                  <span className="text-lg font-bold text-white">
                    {planningProjects}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950 p-4">
                  <span className="text-sm text-slate-300">Active</span>
                  <span className="text-lg font-bold text-white">
                    {activeProjects}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950 p-4">
                  <span className="text-sm text-slate-300">Completed</span>
                  <span className="text-lg font-bold text-white">
                    {completedProjects}
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
              <h2 className="text-xl font-semibold text-white">
                Risk Intelligence
              </h2>

              <p className="mt-2 text-sm text-slate-400">
                High-risk projects that need closer review.
              </p>

              <div className="mt-6 space-y-4">
                {highRiskProjects.length === 0 ? (
                  <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-200">
                    No high-risk projects found. Current project risk looks
                    manageable.
                  </div>
                ) : (
                  highRiskProjects.map((project) => (
                    <div
                      key={project.id}
                      className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4"
                    >
                      <h3 className="text-sm font-semibold text-red-200">
                        {project.project_name}
                      </h3>

                      <p className="mt-2 text-xs leading-5 text-red-100/70">
                        Review budget, schedule, approvals, and site progress
                        for this project.
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
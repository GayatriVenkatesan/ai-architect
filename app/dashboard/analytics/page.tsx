"use client";

import { useEffect, useState } from "react";

type DelayRisk = "Low" | "Medium" | "High";

type Project = {
  id: string;
  name: string;
  client: string;
  location: string;
  stage: string;
  revenue: number;
  progress: number;
  clientSatisfaction: number;
  delayRisk: DelayRisk;
};

type AiUsage = {
  feature: string;
  usageCount: number;
  impact: string;
};

const STORAGE_KEY = "archiflow-projects";

const defaultProjects: Project[] = [
  {
    id: "project-1",
    name: "Luxury Villa Design",
    client: "Rohan Sharma",
    location: "Chennai",
    stage: "Design Planning",
    revenue: 8500000,
    progress: 42,
    clientSatisfaction: 88,
    delayRisk: "Medium",
  },
  {
    id: "project-2",
    name: "Apartment Interior Plan",
    client: "Meera Homes",
    location: "Bengaluru",
    stage: "Interior Design",
    revenue: 1800000,
    progress: 68,
    clientSatisfaction: 94,
    delayRisk: "Low",
  },
  {
    id: "project-3",
    name: "Commercial Workspace",
    client: "Nova Tech Park",
    location: "Hyderabad",
    stage: "Construction Monitoring",
    revenue: 12000000,
    progress: 74,
    clientSatisfaction: 91,
    delayRisk: "Low",
  },
];

const aiUsage: AiUsage[] = [
  {
    feature: "Requirement Analyzer",
    usageCount: 34,
    impact: "Reduced manual requirement documentation time",
  },
  {
    feature: "Interior Design Automation",
    usageCount: 21,
    impact: "Generated faster room-wise design concepts",
  },
  {
    feature: "Construction Monitoring",
    usageCount: 18,
    impact: "Improved delay tracking and weekly reports",
  },
  {
    feature: "Budget Forecasting",
    usageCount: 27,
    impact: "Helped identify early cost risks",
  },
];

function formatCurrency(amount: number) {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(1)}Cr`;
  }

  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(1)}L`;
  }

  return `₹${amount.toLocaleString("en-IN")}`;
}

function getRiskStyle(risk: DelayRisk) {
  if (risk === "Low") {
    return "border-green-400/20 bg-green-400/10 text-green-300";
  }

  if (risk === "Medium") {
    return "border-orange-400/20 bg-orange-400/10 text-orange-300";
  }

  return "border-red-400/20 bg-red-400/10 text-red-300";
}

function getAverage(projects: Project[], key: "progress" | "clientSatisfaction") {
  if (projects.length === 0) {
    return 0;
  }

  const total = projects.reduce((sum, project) => sum + project[key], 0);

  return Math.round(total / projects.length);
}

function getStageRevenue(projects: Project[]) {
  const revenueMap: Record<string, number> = {};

  projects.forEach((project) => {
    if (!revenueMap[project.stage]) {
      revenueMap[project.stage] = 0;
    }

    revenueMap[project.stage] += project.revenue;
  });

  return Object.entries(revenueMap).map(([stage, revenue]) => ({
    stage,
    revenue,
  }));
}

export default function AnalyticsPage() {
  const [projects, setProjects] = useState<Project[]>(defaultProjects);

  useEffect(() => {
    const storedProjects = localStorage.getItem(STORAGE_KEY);

    if (storedProjects) {
      setProjects(JSON.parse(storedProjects));
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultProjects));
    }
  }, []);

  const totalProjects = projects.length;

  const activeProjects = projects.filter(
    (project) => project.stage !== "Completed"
  ).length;

  const totalRevenue = projects.reduce(
    (total, project) => total + project.revenue,
    0
  );

  const averageProgress = getAverage(projects, "progress");

  const averageSatisfaction = getAverage(projects, "clientSatisfaction");

  const lowRiskProjects = projects.filter(
    (project) => project.delayRisk === "Low"
  ).length;

  const mediumRiskProjects = projects.filter(
    (project) => project.delayRisk === "Medium"
  ).length;

  const highRiskProjects = projects.filter(
    (project) => project.delayRisk === "High"
  ).length;

  const stageRevenue = getStageRevenue(projects);

  const highestStageRevenue =
    stageRevenue.length > 0
      ? Math.max(...stageRevenue.map((item) => item.revenue))
      : 1;

  return (
    <>
      {/* Page Header */}
      <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-start">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.35em] text-cyan-300">
            Analytics
          </p>

          <h1 className="mt-4 text-4xl font-bold tracking-tight text-white">
            Business Intelligence Dashboard
          </h1>

          <p className="mt-3 max-w-3xl text-base leading-7 text-slate-300">
            Track project performance, revenue, budget health, delay risk,
            client satisfaction, and AI usage from one executive dashboard. This
            page now reads project data from localStorage.
          </p>
        </div>

        <button className="rounded-xl bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-300">
          Export Report
        </button>
      </div>

      {/* Metrics */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl shadow-black/20">
          <p className="text-sm text-slate-400">Total Projects</p>

          <h2 className="mt-3 text-4xl font-bold text-white">
            {totalProjects}
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-400">
            Projects saved from Projects page
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl shadow-black/20">
          <p className="text-sm text-slate-400">Active Projects</p>

          <h2 className="mt-3 text-4xl font-bold text-white">
            {activeProjects}
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-400">
            Projects not marked completed
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl shadow-black/20">
          <p className="text-sm text-slate-400">Projected Revenue</p>

          <h2 className="mt-3 text-4xl font-bold text-white">
            {formatCurrency(totalRevenue)}
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-400">
            Total revenue from all projects
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl shadow-black/20">
          <p className="text-sm text-slate-400">Client Satisfaction</p>

          <h2 className="mt-3 text-4xl font-bold text-white">
            {averageSatisfaction}%
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-400">
            Average feedback score
          </p>
        </div>
      </div>

      {/* Progress and Budget Health */}
      <div className="mt-8 grid gap-6 xl:grid-cols-3">
        <div className="rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl shadow-black/20 xl:col-span-2">
          <h2 className="text-2xl font-bold text-white">
            Revenue by Project Stage
          </h2>

          <p className="mt-2 text-sm text-slate-400">
            This section is calculated from the projects saved in localStorage.
          </p>

          <div className="mt-6 space-y-5">
            {stageRevenue.map((item) => {
              const width = Math.round(
                (item.revenue / highestStageRevenue) * 100
              );

              return (
                <div key={item.stage}>
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="text-slate-400">{item.stage}</span>
                    <span className="font-semibold text-cyan-300">
                      {formatCurrency(item.revenue)}
                    </span>
                  </div>

                  <div className="h-3 rounded-full bg-slate-800">
                    <div
                      className="h-3 rounded-full bg-cyan-400"
                      style={{ width: `${width}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl shadow-black/20">
          <h2 className="text-2xl font-bold text-white">Risk Health</h2>

          <p className="mt-2 text-sm text-slate-400">
            Delay risk summary from all projects.
          </p>

          <div className="mt-6 space-y-4">
            <div className="rounded-2xl border border-green-400/20 bg-green-400/10 p-4">
              <p className="text-sm font-semibold text-green-300">
                Low Risk
              </p>
              <p className="mt-1 text-3xl font-bold text-white">
                {lowRiskProjects}
              </p>
            </div>

            <div className="rounded-2xl border border-orange-400/20 bg-orange-400/10 p-4">
              <p className="text-sm font-semibold text-orange-300">
                Medium Risk
              </p>
              <p className="mt-1 text-3xl font-bold text-white">
                {mediumRiskProjects}
              </p>
            </div>

            <div className="rounded-2xl border border-red-400/20 bg-red-400/10 p-4">
              <p className="text-sm font-semibold text-red-300">
                High Risk
              </p>
              <p className="mt-1 text-3xl font-bold text-white">
                {highRiskProjects}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Overall Progress */}
      <div className="mt-8 rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl shadow-black/20">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white">
            Overall Project Progress
          </h2>

          <p className="mt-2 text-sm text-slate-400">
            Average progress calculated from all saved projects.
          </p>
        </div>

        <div>
          <div className="mb-2 flex justify-between text-sm">
            <span className="text-slate-400">Average Completion</span>
            <span className="font-semibold text-cyan-300">
              {averageProgress}%
            </span>
          </div>

          <div className="h-4 rounded-full bg-slate-800">
            <div
              className="h-4 rounded-full bg-cyan-400"
              style={{ width: `${averageProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Project Performance */}
      <div className="mt-8 rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl shadow-black/20">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white">
            Project Performance
          </h2>

          <p className="mt-2 text-sm text-slate-400">
            Every project added in the Projects page will appear here.
          </p>
        </div>

        <div className="grid gap-5">
          {projects.map((project) => (
            <div
              key={project.id}
              className="rounded-2xl border border-white/10 bg-slate-950/70 p-5 transition hover:border-cyan-400/40"
            >
              <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-start">
                <div>
                  <h3 className="text-xl font-bold text-white">
                    {project.name}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    Client: {project.client} · Location: {project.location}
                  </p>

                  <p className="mt-1 text-sm leading-6 text-slate-400">
                    Stage: {project.stage} · Revenue:{" "}
                    {formatCurrency(project.revenue)}
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <span
                    className={`rounded-full border px-4 py-2 text-sm font-semibold ${getRiskStyle(
                      project.delayRisk
                    )}`}
                  >
                    {project.delayRisk} Delay Risk
                  </span>

                  <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-300">
                    {project.progress}% Complete
                  </span>
                </div>
              </div>

              <div className="mt-5 grid gap-5 md:grid-cols-2">
                <div>
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="text-slate-400">Project Progress</span>
                    <span className="font-semibold text-cyan-300">
                      {project.progress}%
                    </span>
                  </div>

                  <div className="h-2 rounded-full bg-slate-800">
                    <div
                      className="h-2 rounded-full bg-cyan-400"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="text-slate-400">Client Satisfaction</span>
                    <span className="font-semibold text-green-300">
                      {project.clientSatisfaction}%
                    </span>
                  </div>

                  <div className="h-2 rounded-full bg-slate-800">
                    <div
                      className="h-2 rounded-full bg-green-400"
                      style={{ width: `${project.clientSatisfaction}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Usage */}
      <div className="mt-8 rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl shadow-black/20">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white">
            AI Usage Analytics
          </h2>

          <p className="mt-2 text-sm text-slate-400">
            This section is still demo data. Later, it can be connected to real
            AI usage logs.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {aiUsage.map((item) => (
            <div
              key={item.feature}
              className="rounded-2xl border border-white/10 bg-slate-950/70 p-5 transition hover:border-cyan-400/40"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-cyan-300">
                    {item.feature}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-slate-300">
                    {item.impact}
                  </p>
                </div>

                <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-3 text-center">
                  <p className="text-2xl font-bold text-white">
                    {item.usageCount}
                  </p>
                  <p className="text-xs text-cyan-300">uses</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
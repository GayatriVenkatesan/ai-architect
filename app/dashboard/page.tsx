"use client";

import Link from "next/link";
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

type DocumentStatus = "Draft" | "In Review" | "Approved" | "Rejected";

type DocumentCategory =
  | "Requirement"
  | "2D Floor Plan"
  | "Interior Design"
  | "Construction"
  | "Contract"
  | "Report"
  | "Approval";

type ProjectDocument = {
  id: string;
  projectId: string;
  title: string;
  category: DocumentCategory;
  status: DocumentStatus;
  fileName: string;
  owner: string;
  createdAt: string;
};

const PROJECT_STORAGE_KEY = "archiflow-projects";
const DOCUMENT_STORAGE_KEY = "archiflow-documents";

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

const defaultDocuments: ProjectDocument[] = [
  {
    id: "doc-1",
    projectId: "project-1",
    title: "Initial Client Requirement Brief",
    category: "Requirement",
    status: "Approved",
    fileName: "client-requirement-brief.pdf",
    owner: "Project Manager",
    createdAt: "2026-06-20",
  },
  {
    id: "doc-2",
    projectId: "project-1",
    title: "Ground Floor 2D Concept Plan",
    category: "2D Floor Plan",
    status: "In Review",
    fileName: "ground-floor-plan.png",
    owner: "Architect",
    createdAt: "2026-06-20",
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

function getAverage(projects: Project[], key: "progress" | "clientSatisfaction") {
  if (projects.length === 0) {
    return 0;
  }

  const total = projects.reduce((sum, project) => sum + project[key], 0);
  return Math.round(total / projects.length);
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

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>(defaultProjects);
  const [documents, setDocuments] =
    useState<ProjectDocument[]>(defaultDocuments);

  useEffect(() => {
    const storedProjects = localStorage.getItem(PROJECT_STORAGE_KEY);
    const storedDocuments = localStorage.getItem(DOCUMENT_STORAGE_KEY);

    if (storedProjects) {
      setProjects(JSON.parse(storedProjects));
    } else {
      localStorage.setItem(PROJECT_STORAGE_KEY, JSON.stringify(defaultProjects));
    }

    if (storedDocuments) {
      setDocuments(JSON.parse(storedDocuments));
    } else {
      localStorage.setItem(
        DOCUMENT_STORAGE_KEY,
        JSON.stringify(defaultDocuments)
      );
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

  const highRiskProjects = projects.filter(
    (project) => project.delayRisk === "High"
  ).length;

  const totalDocuments = documents.length;

  const approvedDocuments = documents.filter(
    (document) => document.status === "Approved"
  ).length;

  const inReviewDocuments = documents.filter(
    (document) => document.status === "In Review"
  ).length;

  const recentProjects = projects.slice(0, 4);

  const recentDocuments = documents.slice(0, 4);

  return (
    <>
      {/* Page Header */}
      <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-start">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.35em] text-cyan-300">
            Dashboard
          </p>

          <h1 className="mt-4 text-4xl font-bold tracking-tight text-white">
            ArchiFlow AI Control Center
          </h1>

          <p className="mt-3 max-w-3xl text-base leading-7 text-slate-300">
            Monitor project performance, revenue, document status, client
            satisfaction, delay risks, and AI workflow modules from one
            connected workspace.
          </p>
        </div>

        <Link
          href="/dashboard/projects"
          className="rounded-xl bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-300"
        >
          Add New Project
        </Link>
      </div>

      {/* Main Stats */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl shadow-black/20">
          <p className="text-sm text-slate-400">Total Projects</p>
          <h2 className="mt-3 text-4xl font-bold text-white">
            {totalProjects}
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Projects saved in workspace
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl shadow-black/20">
          <p className="text-sm text-slate-400">Active Projects</p>
          <h2 className="mt-3 text-4xl font-bold text-white">
            {activeProjects}
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Projects currently running
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl shadow-black/20">
          <p className="text-sm text-slate-400">Projected Revenue</p>
          <h2 className="mt-3 text-4xl font-bold text-white">
            {formatCurrency(totalRevenue)}
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Total value of all projects
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl shadow-black/20">
          <p className="text-sm text-slate-400">Avg. Progress</p>
          <h2 className="mt-3 text-4xl font-bold text-white">
            {averageProgress}%
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Overall project completion
          </p>
        </div>
      </div>

      {/* Secondary Stats */}
      <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-3xl border border-green-400/20 bg-green-400/10 p-6 shadow-2xl shadow-black/20">
          <p className="text-sm font-semibold text-green-300">
            Client Satisfaction
          </p>
          <h2 className="mt-3 text-4xl font-bold text-white">
            {averageSatisfaction}%
          </h2>
          <p className="mt-2 text-sm text-green-200/80">
            Average feedback score
          </p>
        </div>

        <div className="rounded-3xl border border-red-400/20 bg-red-400/10 p-6 shadow-2xl shadow-black/20">
          <p className="text-sm font-semibold text-red-300">
            High Risk Projects
          </p>
          <h2 className="mt-3 text-4xl font-bold text-white">
            {highRiskProjects}
          </h2>
          <p className="mt-2 text-sm text-red-200/80">
            Need project manager review
          </p>
        </div>

        <div className="rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-6 shadow-2xl shadow-black/20">
          <p className="text-sm font-semibold text-cyan-300">
            Total Documents
          </p>
          <h2 className="mt-3 text-4xl font-bold text-white">
            {totalDocuments}
          </h2>
          <p className="mt-2 text-sm text-cyan-200/80">
            Project files and records
          </p>
        </div>

        <div className="rounded-3xl border border-orange-400/20 bg-orange-400/10 p-6 shadow-2xl shadow-black/20">
          <p className="text-sm font-semibold text-orange-300">
            Documents In Review
          </p>
          <h2 className="mt-3 text-4xl font-bold text-white">
            {inReviewDocuments}
          </h2>
          <p className="mt-2 text-sm text-orange-200/80">
            Waiting for approval
          </p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="mt-8 grid gap-6 xl:grid-cols-3">
        {/* Project Overview */}
        <div className="rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl shadow-black/20 xl:col-span-2">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-white">
                Recent Projects
              </h2>

              <p className="mt-2 text-sm text-slate-400">
                Latest projects from localStorage.
              </p>
            </div>

            <Link
              href="/dashboard/projects"
              className="text-sm font-semibold text-cyan-300 hover:text-cyan-200"
            >
              View all
            </Link>
          </div>

          {recentProjects.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/15 bg-slate-950/70 p-8 text-center">
              <p className="text-sm text-slate-400">
                No projects added yet. Add a new project from the Projects page.
              </p>
            </div>
          ) : (
            <div className="grid gap-5">
              {recentProjects.map((project) => (
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
                        Stage: {project.stage} · Value:{" "}
                        {formatCurrency(project.revenue)}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <span
                        className={`rounded-full border px-4 py-2 text-sm font-semibold ${getRiskStyle(
                          project.delayRisk
                        )}`}
                      >
                        {project.delayRisk} Risk
                      </span>

                      <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-300">
                        {project.progress}% Complete
                      </span>
                    </div>
                  </div>

                  <div className="mt-5">
                    <div className="mb-2 flex justify-between text-sm">
                      <span className="text-slate-400">Progress</span>
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
                </div>
              ))}
            </div>
          )}
        </div>

        {/* AI Workflow Shortcuts */}
        <div className="rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl shadow-black/20">
          <h2 className="text-2xl font-bold text-white">
            AI Workflow Modules
          </h2>

          <p className="mt-2 text-sm text-slate-400">
            Quick access to the main ArchiFlow AI modules.
          </p>

          <div className="mt-6 space-y-3">
            <Link
              href="/dashboard/requirements"
              className="block rounded-2xl border border-white/10 bg-slate-950/70 p-4 text-sm font-semibold text-slate-300 transition hover:border-cyan-400 hover:text-cyan-300"
            >
              Requirement Analyzer
            </Link>

            <Link
              href="/dashboard/floor-plan"
              className="block rounded-2xl border border-white/10 bg-slate-950/70 p-4 text-sm font-semibold text-slate-300 transition hover:border-cyan-400 hover:text-cyan-300"
            >
              2D Floor Plan Generator
            </Link>

            <Link
              href="/dashboard/interior"
              className="block rounded-2xl border border-white/10 bg-slate-950/70 p-4 text-sm font-semibold text-slate-300 transition hover:border-cyan-400 hover:text-cyan-300"
            >
              Interior Design Automation
            </Link>

            <Link
              href="/dashboard/visualization"
              className="block rounded-2xl border border-white/10 bg-slate-950/70 p-4 text-sm font-semibold text-slate-300 transition hover:border-cyan-400 hover:text-cyan-300"
            >
              3D Visualization
            </Link>

            <Link
              href="/dashboard/ar-vr"
              className="block rounded-2xl border border-white/10 bg-slate-950/70 p-4 text-sm font-semibold text-slate-300 transition hover:border-cyan-400 hover:text-cyan-300"
            >
              AR/VR Experience
            </Link>

            <Link
              href="/dashboard/construction"
              className="block rounded-2xl border border-white/10 bg-slate-950/70 p-4 text-sm font-semibold text-slate-300 transition hover:border-cyan-400 hover:text-cyan-300"
            >
              Construction Monitoring
            </Link>

            <Link
              href="/dashboard/documents"
              className="block rounded-2xl border border-white/10 bg-slate-950/70 p-4 text-sm font-semibold text-slate-300 transition hover:border-cyan-400 hover:text-cyan-300"
            >
              Documents Management
            </Link>

            <Link
              href="/dashboard/analytics"
              className="block rounded-2xl border border-white/10 bg-slate-950/70 p-4 text-sm font-semibold text-slate-300 transition hover:border-cyan-400 hover:text-cyan-300"
            >
              Analytics
            </Link>

            <Link
              href="/dashboard/chatbot"
              className="block rounded-2xl border border-white/10 bg-slate-950/70 p-4 text-sm font-semibold text-slate-300 transition hover:border-cyan-400 hover:text-cyan-300"
            >
              AI Client Chatbot
            </Link>
          </div>
        </div>
      </div>

      {/* Documents and Activity */}
      <div className="mt-8 grid gap-6 xl:grid-cols-2">
        <div className="rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl shadow-black/20">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-white">
                Recent Documents
              </h2>

              <p className="mt-2 text-sm text-slate-400">
                Latest project documents added to the workspace.
              </p>
            </div>

            <Link
              href="/dashboard/documents"
              className="text-sm font-semibold text-cyan-300 hover:text-cyan-200"
            >
              View all
            </Link>
          </div>

          <div className="space-y-4">
            {recentDocuments.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/15 bg-slate-950/70 p-5 text-center">
                <p className="text-sm text-slate-400">
                  No documents added yet.
                </p>
              </div>
            ) : (
              recentDocuments.map((document) => (
                <div
                  key={document.id}
                  className="rounded-2xl border border-white/10 bg-slate-950/70 p-5"
                >
                  <h3 className="font-bold text-white">{document.title}</h3>

                  <p className="mt-2 text-sm text-slate-400">
                    {document.category} · {document.status}
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    File: {document.fileName}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl shadow-black/20">
          <h2 className="text-2xl font-bold text-white">Platform Summary</h2>

          <p className="mt-2 text-sm text-slate-400">
            Current connected workflow status.
          </p>

          <div className="mt-6 space-y-4">
            <div className="rounded-2xl border border-green-400/20 bg-green-400/10 p-5">
              <p className="font-bold text-green-300">Connected Data Flow</p>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                Projects, Analytics, Client Portal, Documents, Dashboard, 3D
                Visualization, and AR/VR pages now use shared localStorage data.
              </p>
            </div>

            <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-5">
              <p className="font-bold text-cyan-300">Approved Documents</p>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                {approvedDocuments} documents are approved and ready for project
                execution.
              </p>
            </div>

            <div className="rounded-2xl border border-orange-400/20 bg-orange-400/10 p-5">
              <p className="font-bold text-orange-300">Next Improvement</p>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                Final frontend cleanup, backend database integration, and real
                AI chatbot connection can be done next.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
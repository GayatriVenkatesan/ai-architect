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

type ProjectFormData = {
  name: string;
  client: string;
  location: string;
  stage: string;
  revenue: string;
  progress: string;
  clientSatisfaction: string;
  delayRisk: DelayRisk;
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

const initialFormData: ProjectFormData = {
  name: "",
  client: "",
  location: "",
  stage: "Requirement Analysis",
  revenue: "",
  progress: "",
  clientSatisfaction: "",
  delayRisk: "Low",
};

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

function getNumberValue(value: string) {
  const numberValue = Number(value);

  if (Number.isNaN(numberValue)) {
    return 0;
  }

  return numberValue;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>(defaultProjects);
  const [formData, setFormData] = useState<ProjectFormData>(initialFormData);

  useEffect(() => {
    const storedProjects = localStorage.getItem(STORAGE_KEY);

    if (storedProjects) {
      setProjects(JSON.parse(storedProjects));
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultProjects));
    }
  }, []);

  function saveProjects(updatedProjects: Project[]) {
    setProjects(updatedProjects);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProjects));
  }

  function updateField(field: keyof ProjectFormData, value: string) {
    setFormData((previousData) => ({
      ...previousData,
      [field]: value,
    }));
  }

  function handleAddProject(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!formData.name || !formData.client || !formData.revenue) {
      alert("Please enter project name, client name, and revenue.");
      return;
    }

    const newProject: Project = {
      id: `project-${Date.now()}`,
      name: formData.name,
      client: formData.client,
      location: formData.location || "Not specified",
      stage: formData.stage,
      revenue: getNumberValue(formData.revenue),
      progress: getNumberValue(formData.progress),
      clientSatisfaction: getNumberValue(formData.clientSatisfaction),
      delayRisk: formData.delayRisk,
    };

    const updatedProjects = [newProject, ...projects];

    saveProjects(updatedProjects);
    setFormData(initialFormData);
  }

  const totalRevenue = projects.reduce(
    (total, project) => total + project.revenue,
    0
  );

  const averageProgress =
    projects.length > 0
      ? Math.round(
          projects.reduce((total, project) => total + project.progress, 0) /
            projects.length
        )
      : 0;

  const highRiskProjects = projects.filter(
    (project) => project.delayRisk === "High"
  ).length;

  return (
    <>
      {/* Page Header */}
      <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-start">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.35em] text-cyan-300">
            Projects
          </p>

          <h1 className="mt-4 text-4xl font-bold tracking-tight text-white">
            Project Management
          </h1>

          <p className="mt-3 max-w-3xl text-base leading-7 text-slate-300">
            Add, track, and manage architecture projects. Newly added projects
            are saved in localStorage and will be used for Analytics in the next
            step.
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl shadow-black/20">
          <p className="text-sm text-slate-400">Total Projects</p>
          <h2 className="mt-3 text-4xl font-bold text-white">
            {projects.length}
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Projects saved in workspace
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl shadow-black/20">
          <p className="text-sm text-slate-400">Total Revenue</p>
          <h2 className="mt-3 text-4xl font-bold text-white">
            {formatCurrency(totalRevenue)}
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Combined project value
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl shadow-black/20">
          <p className="text-sm text-slate-400">Average Progress</p>
          <h2 className="mt-3 text-4xl font-bold text-white">
            {averageProgress}%
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Across all active projects
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl shadow-black/20">
          <p className="text-sm text-slate-400">High Risk Projects</p>
          <h2 className="mt-3 text-4xl font-bold text-white">
            {highRiskProjects}
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Need immediate attention
          </p>
        </div>
      </div>

      {/* Add Project Form */}
      <div className="mt-8 rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl shadow-black/20">
        <h2 className="text-2xl font-bold text-white">Add New Project</h2>

        <p className="mt-2 text-sm text-slate-400">
          Enter project details. After adding, the project will be saved in
          browser storage.
        </p>

        <form onSubmit={handleAddProject} className="mt-6 grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-300">
              Project Name
            </label>

            <input
              type="text"
              value={formData.name}
              onChange={(event) => updateField("name", event.target.value)}
              placeholder="Example: Smart Villa Project"
              className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-300">
              Client Name
            </label>

            <input
              type="text"
              value={formData.client}
              onChange={(event) => updateField("client", event.target.value)}
              placeholder="Example: Arjun Homes"
              className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-300">
              Location
            </label>

            <input
              type="text"
              value={formData.location}
              onChange={(event) => updateField("location", event.target.value)}
              placeholder="Example: Chennai"
              className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-300">
              Project Stage
            </label>

            <select
              value={formData.stage}
              onChange={(event) => updateField("stage", event.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
            >
              <option>Requirement Analysis</option>
              <option>Design Planning</option>
              <option>Interior Design</option>
              <option>Construction Monitoring</option>
              <option>Final Review</option>
              <option>Completed</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-300">
              Revenue Amount
            </label>

            <input
              type="number"
              value={formData.revenue}
              onChange={(event) => updateField("revenue", event.target.value)}
              placeholder="Example: 8500000"
              className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400"
            />

            <p className="mt-2 text-xs text-slate-500">
              Enter full amount. Example: ₹85L means 8500000.
            </p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-300">
              Progress %
            </label>

            <input
              type="number"
              value={formData.progress}
              onChange={(event) => updateField("progress", event.target.value)}
              placeholder="Example: 45"
              className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-300">
              Client Satisfaction %
            </label>

            <input
              type="number"
              value={formData.clientSatisfaction}
              onChange={(event) =>
                updateField("clientSatisfaction", event.target.value)
              }
              placeholder="Example: 90"
              className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-300">
              Delay Risk
            </label>

            <select
              value={formData.delayRisk}
              onChange={(event) =>
                updateField("delayRisk", event.target.value as DelayRisk)
              }
              className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              className="rounded-xl bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-300"
            >
              Add Project
            </button>
          </div>
        </form>
      </div>

      {/* Project List */}
      <div className="mt-8 rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl shadow-black/20">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white">All Projects</h2>

          <p className="mt-2 text-sm text-slate-400">
            These projects are saved in localStorage. Analytics will read this
            same project list in the next step.
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
                    Stage: {project.stage}
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-300">
                    {formatCurrency(project.revenue)}
                  </span>

                  <span
                    className={`rounded-full border px-4 py-2 text-sm font-semibold ${getRiskStyle(
                      project.delayRisk
                    )}`}
                  >
                    {project.delayRisk} Risk
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
    </>
  );
}
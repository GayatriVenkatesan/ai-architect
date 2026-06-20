"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";

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

function getPercentValue(value: string) {
  const numberValue = Number(value);

  if (Number.isNaN(numberValue)) {
    return 0;
  }

  if (numberValue < 0) {
    return 0;
  }

  if (numberValue > 100) {
    return 100;
  }

  return numberValue;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>(defaultProjects);
  const [formData, setFormData] = useState<ProjectFormData>(initialFormData);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);

  useEffect(() => {
    const storedProjects = localStorage.getItem(STORAGE_KEY);

    if (storedProjects) {
      const parsedProjects: Project[] = JSON.parse(storedProjects);
      setProjects(parsedProjects);
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultProjects));
    }
  }, []);

  const isEditing = editingProjectId !== null;

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

  function saveProjects(updatedProjects: Project[]) {
    setProjects(updatedProjects);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProjects));
  }

  function updateField<K extends keyof ProjectFormData>(
    field: K,
    value: ProjectFormData[K]
  ) {
    setFormData((previousData) => ({
      ...previousData,
      [field]: value,
    }));
  }

  function resetForm() {
    setFormData(initialFormData);
    setEditingProjectId(null);
  }

  function handleAddOrUpdateProject(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!formData.name.trim()) {
      alert("Please enter project name.");
      return;
    }

    if (!formData.client.trim()) {
      alert("Please enter client name.");
      return;
    }

    if (!formData.revenue.trim()) {
      alert("Please enter revenue amount.");
      return;
    }

    const projectData: Project = {
      id: editingProjectId || `project-${Date.now()}`,
      name: formData.name,
      client: formData.client,
      location: formData.location || "Not specified",
      stage: formData.stage,
      revenue: getNumberValue(formData.revenue),
      progress: getPercentValue(formData.progress),
      clientSatisfaction: getPercentValue(formData.clientSatisfaction),
      delayRisk: formData.delayRisk,
    };

    if (isEditing) {
      const updatedProjects = projects.map((project) =>
        project.id === editingProjectId ? projectData : project
      );

      saveProjects(updatedProjects);
      resetForm();
      return;
    }

    const updatedProjects = [projectData, ...projects];

    saveProjects(updatedProjects);
    resetForm();
  }

  function handleEditProject(project: Project) {
    setEditingProjectId(project.id);

    setFormData({
      name: project.name,
      client: project.client,
      location: project.location,
      stage: project.stage,
      revenue: String(project.revenue),
      progress: String(project.progress),
      clientSatisfaction: String(project.clientSatisfaction),
      delayRisk: project.delayRisk,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function handleDeleteProject(projectId: string) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this project?"
    );

    if (!confirmDelete) {
      return;
    }

    const updatedProjects = projects.filter(
      (project) => project.id !== projectId
    );

    saveProjects(updatedProjects);

    if (editingProjectId === projectId) {
      resetForm();
    }
  }

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
            Add, edit, update, and delete architecture projects. All changes are
            saved in localStorage and reflected across Dashboard, Analytics,
            Client Portal, Documents, and Chatbot.
          </p>
        </div>

        {isEditing && (
          <button
            type="button"
            onClick={resetForm}
            className="rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:border-cyan-400 hover:text-cyan-300"
          >
            Cancel Edit
          </button>
        )}
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

      {/* Add / Edit Project Form */}
      <div className="mt-8 rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl shadow-black/20">
        <h2 className="text-2xl font-bold text-white">
          {isEditing ? "Edit Project" : "Add New Project"}
        </h2>

        <p className="mt-2 text-sm text-slate-400">
          {isEditing
            ? "Update the selected project details. Other pages will reflect this update automatically."
            : "Enter project details. After adding, the project will be saved in browser storage."}
        </p>

        <form
          onSubmit={handleAddOrUpdateProject}
          className="mt-6 grid gap-5 md:grid-cols-2"
        >
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

            <p className="mt-2 text-xs text-slate-500">
              Value should be between 0 and 100.
            </p>
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

            <p className="mt-2 text-xs text-slate-500">
              Value should be between 0 and 100.
            </p>
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

          <div className="flex flex-wrap gap-4 md:col-span-2">
            <button
              type="submit"
              className="rounded-xl bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-300"
            >
              {isEditing ? "Update Project" : "Add Project"}
            </button>

            {isEditing && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:border-cyan-400 hover:text-cyan-300"
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Project List */}
      <div className="mt-8 rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl shadow-black/20">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white">All Projects</h2>

          <p className="mt-2 text-sm text-slate-400">
            Edit or delete projects from here. Changes are shared with other
            pages through localStorage.
          </p>
        </div>

        {projects.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/15 bg-slate-950/70 p-8 text-center">
            <p className="text-sm text-slate-400">
              No projects available. Add a new project above.
            </p>
          </div>
        ) : (
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
                      <span className="text-slate-400">
                        Client Satisfaction
                      </span>
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

                <div className="mt-5 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => handleEditProject(project)}
                    className="rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-300 transition hover:bg-cyan-400/20"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteProject(project.id)}
                    className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-2 text-sm font-semibold text-red-300 transition hover:bg-red-400/20"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
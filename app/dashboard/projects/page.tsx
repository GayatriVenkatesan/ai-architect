"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import {
  createProject,
  deleteProject,
  getProjects,
  updateProject,
} from "../../lib/api";

type DelayRisk = "Low" | "Medium" | "High";

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
  delay_risk: DelayRisk;
  client_satisfaction: number;
};

type ProjectsResponse = {
  total: number;
  projects: Project[];
};

type ProjectFormData = {
  name: string;
  client: string;
  project_type: string;
  location: string;
  status: string;
  stage: string;
  budget: string;
  deadline: string;
  progress: string;
  client_satisfaction: string;
  delay_risk: DelayRisk;
  description: string;
};

const initialFormData: ProjectFormData = {
  name: "",
  client: "",
  project_type: "Villa",
  location: "",
  status: "Planning",
  stage: "Requirement Analysis",
  budget: "",
  deadline: "",
  progress: "",
  client_satisfaction: "",
  delay_risk: "Low",
  description: "",
};

function getNumberValue(value: string | number | null | undefined) {
  const numberValue = Number(value ?? 0);

  if (Number.isNaN(numberValue)) {
    return 0;
  }

  return numberValue;
}

function getPercentValue(value: string | number | null | undefined) {
  const numberValue = Number(value ?? 0);

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

function formatCurrency(amount?: number | string | null) {
  const numericAmount = Number(amount ?? 0);

  if (Number.isNaN(numericAmount)) {
    return "₹0";
  }

  if (numericAmount >= 10000000) {
    return `₹${(numericAmount / 10000000).toFixed(1)}Cr`;
  }

  if (numericAmount >= 100000) {
    return `₹${(numericAmount / 100000).toFixed(1)}L`;
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(numericAmount);
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

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [formData, setFormData] = useState<ProjectFormData>(initialFormData);
  const [editingProjectId, setEditingProjectId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const isEditing = editingProjectId !== null;

  async function loadProjects() {
    try {
      setLoading(true);
      setError("");

      const data = (await getProjects()) as ProjectsResponse;
      setProjects(data.projects || []);
    } catch {
      setError("Unable to load projects from FastAPI backend.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProjects();
  }, []);

  const totalBudget = projects.reduce((total, project) => {
    return total + getNumberValue(project.budget);
  }, 0);

  const averageProgress =
    projects.length > 0
      ? Math.round(
          projects.reduce((total, project) => {
            return total + getPercentValue(project.progress);
          }, 0) / projects.length
        )
      : 0;

  const highRiskProjects = projects.filter((project) => {
    return project.delay_risk === "High";
  }).length;

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

  function buildProjectPayload() {
    return {
      name: formData.name.trim(),
      client: formData.client.trim(),
      project_type: formData.project_type,
      location: formData.location.trim() || "Not specified",
      status: formData.status,
      stage: formData.stage,
      progress: getPercentValue(formData.progress),
      budget: getNumberValue(formData.budget),
      deadline: formData.deadline.trim() || "Not set",
      description:
        formData.description.trim() ||
        "Architecture project created from frontend workspace.",
      delay_risk: formData.delay_risk,
      client_satisfaction: getPercentValue(formData.client_satisfaction),
    };
  }

  async function handleAddOrUpdateProject(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!formData.name.trim()) {
      alert("Please enter project name.");
      return;
    }

    if (!formData.client.trim()) {
      alert("Please enter client name.");
      return;
    }

    if (!formData.budget.trim()) {
      alert("Please enter budget amount.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccessMessage("");

      const payload = buildProjectPayload();

      if (isEditing && editingProjectId !== null) {
        await updateProject(editingProjectId, payload);
        setSuccessMessage("Project updated successfully.");
      } else {
        await createProject(payload);
        setSuccessMessage("Project created successfully.");
      }

      resetForm();
      await loadProjects();
    } catch {
      setError("Unable to save project. Check backend is running.");
    } finally {
      setSaving(false);
    }
  }

  function handleEditProject(project: Project) {
    setEditingProjectId(project.id);

    setFormData({
      name: project.name,
      client: project.client,
      project_type: project.project_type,
      location: project.location,
      status: project.status,
      stage: project.stage,
      budget: String(project.budget ?? 0),
      deadline: project.deadline || "",
      progress: String(project.progress ?? 0),
      client_satisfaction: String(project.client_satisfaction ?? 0),
      delay_risk: project.delay_risk,
      description: project.description || "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function handleDeleteProject(projectId: number) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this project?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      setError("");
      setSuccessMessage("");

      await deleteProject(projectId);
      setSuccessMessage("Project deleted successfully.");

      if (editingProjectId === projectId) {
        resetForm();
      }

      await loadProjects();
    } catch {
      setError("Unable to delete project. Check backend is running.");
    }
  }

  return (
    <>
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
            saved in the FastAPI backend and SQLite database.
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

      {error && (
        <div className="mb-6 rounded-2xl border border-red-400/30 bg-red-400/10 p-4 text-sm text-red-200">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="mb-6 rounded-2xl border border-emerald-400/30 bg-emerald-400/10 p-4 text-sm text-emerald-200">
          {successMessage}
        </div>
      )}

      {loading ? (
        <div className="rounded-3xl border border-white/10 bg-slate-900 p-6 text-slate-300">
          Loading projects from FastAPI backend...
        </div>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl shadow-black/20">
              <p className="text-sm text-slate-400">Total Projects</p>
              <h2 className="mt-3 text-4xl font-bold text-white">
                {projects.length}
              </h2>
              <p className="mt-2 text-sm text-slate-400">
                Loaded from FastAPI
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl shadow-black/20">
              <p className="text-sm text-slate-400">Total Budget</p>
              <h2 className="mt-3 text-4xl font-bold text-white">
                {formatCurrency(totalBudget)}
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

          <div className="mt-8 rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl shadow-black/20">
            <h2 className="text-2xl font-bold text-white">
              {isEditing ? "Edit Project" : "Add New Project"}
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              {isEditing
                ? "Update the selected project. The backend database will be updated."
                : "Enter project details. The project will be saved in SQLite through FastAPI."}
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
                  onChange={(event) =>
                    updateField("client", event.target.value)
                  }
                  placeholder="Example: Arjun Homes"
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-300">
                  Project Type
                </label>

                <select
                  value={formData.project_type}
                  onChange={(event) =>
                    updateField("project_type", event.target.value)
                  }
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
                >
                  <option>Villa</option>
                  <option>Apartment</option>
                  <option>Hospital</option>
                  <option>Mall</option>
                  <option>Campus</option>
                  <option>Office</option>
                  <option>Interior</option>
                  <option>Commercial</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-300">
                  Location
                </label>

                <input
                  type="text"
                  value={formData.location}
                  onChange={(event) =>
                    updateField("location", event.target.value)
                  }
                  placeholder="Example: Chennai"
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-300">
                  Status
                </label>

                <select
                  value={formData.status}
                  onChange={(event) =>
                    updateField("status", event.target.value)
                  }
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
                >
                  <option>Planning</option>
                  <option>Design Review</option>
                  <option>Concept Design</option>
                  <option>Design Development</option>
                  <option>Approval Pending</option>
                  <option>Construction Monitoring</option>
                  <option>Completed</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-300">
                  Project Stage
                </label>

                <select
                  value={formData.stage}
                  onChange={(event) =>
                    updateField("stage", event.target.value)
                  }
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
                  Budget Amount
                </label>

                <input
                  type="number"
                  value={formData.budget}
                  onChange={(event) =>
                    updateField("budget", event.target.value)
                  }
                  placeholder="Example: 8500000"
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400"
                />

                <p className="mt-2 text-xs text-slate-500">
                  Enter full amount. Example: ₹85L means 8500000.
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-300">
                  Deadline
                </label>

                <input
                  type="text"
                  value={formData.deadline}
                  onChange={(event) =>
                    updateField("deadline", event.target.value)
                  }
                  placeholder="Example: Dec 2026"
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-300">
                  Progress %
                </label>

                <input
                  type="number"
                  value={formData.progress}
                  onChange={(event) =>
                    updateField("progress", event.target.value)
                  }
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
                  value={formData.client_satisfaction}
                  onChange={(event) =>
                    updateField("client_satisfaction", event.target.value)
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
                  value={formData.delay_risk}
                  onChange={(event) =>
                    updateField("delay_risk", event.target.value as DelayRisk)
                  }
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-slate-300">
                  Description
                </label>

                <textarea
                  value={formData.description}
                  onChange={(event) =>
                    updateField("description", event.target.value)
                  }
                  placeholder="Brief project description"
                  rows={4}
                  className="w-full resize-none rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400"
                />
              </div>

              <div className="flex flex-wrap gap-4 md:col-span-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving
                    ? "Saving..."
                    : isEditing
                    ? "Update Project"
                    : "Add Project"}
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

          <div className="mt-8 rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl shadow-black/20">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white">All Projects</h2>

              <p className="mt-2 text-sm text-slate-400">
                Edit or delete projects from here. Changes are saved to the
                backend database.
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
                        <div className="mb-3 flex flex-wrap gap-3">
                          <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs font-semibold text-cyan-300">
                            {project.project_type}
                          </span>

                          <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-slate-300">
                            {project.status}
                          </span>
                        </div>

                        <h3 className="text-xl font-bold text-white">
                          {project.name}
                        </h3>

                        <p className="mt-2 text-sm leading-6 text-slate-400">
                          Client: {project.client} · Location:{" "}
                          {project.location}
                        </p>

                        <p className="mt-1 text-sm leading-6 text-slate-400">
                          Stage: {project.stage} · Deadline:{" "}
                          {project.deadline}
                        </p>

                        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">
                          {project.description}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-300">
                          {formatCurrency(project.budget)}
                        </span>

                        <span
                          className={`rounded-full border px-4 py-2 text-sm font-semibold ${getRiskStyle(
                            project.delay_risk
                          )}`}
                        >
                          {project.delay_risk} Risk
                        </span>
                      </div>
                    </div>

                    <div className="mt-5 grid gap-5 md:grid-cols-2">
                      <div>
                        <div className="mb-2 flex justify-between text-sm">
                          <span className="text-slate-400">
                            Project Progress
                          </span>

                          <span className="font-semibold text-cyan-300">
                            {project.progress}%
                          </span>
                        </div>

                        <div className="h-2 rounded-full bg-slate-800">
                          <div
                            className="h-2 rounded-full bg-cyan-400"
                            style={{
                              width: `${project.progress}%`,
                            }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="mb-2 flex justify-between text-sm">
                          <span className="text-slate-400">
                            Client Satisfaction
                          </span>

                          <span className="font-semibold text-green-300">
                            {project.client_satisfaction}%
                          </span>
                        </div>

                        <div className="h-2 rounded-full bg-slate-800">
                          <div
                            className="h-2 rounded-full bg-green-400"
                            style={{
                              width: `${project.client_satisfaction}%`,
                            }}
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
      )}
    </>
  );
}
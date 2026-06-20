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

type Feedback = {
  projectId: string;
  message: string;
};

const STORAGE_KEY = "archiflow-projects";
const FEEDBACK_KEY = "archiflow-client-feedback";

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
];

const approvals = [
  {
    title: "Floor Plan Approval",
    status: "Pending",
    description: "Client needs to approve the latest floor plan layout.",
  },
  {
    title: "Interior Mood Board",
    status: "In Review",
    description: "Client is reviewing colors, materials, and furniture ideas.",
  },
  {
    title: "Budget Confirmation",
    status: "Approved",
    description: "Estimated budget range has been confirmed by the client.",
  },
];

function getRiskStyle(risk: DelayRisk) {
  if (risk === "Low") {
    return "border-green-400/20 bg-green-400/10 text-green-300";
  }

  if (risk === "Medium") {
    return "border-orange-400/20 bg-orange-400/10 text-orange-300";
  }

  return "border-red-400/20 bg-red-400/10 text-red-300";
}

function getApprovalStyle(status: string) {
  if (status === "Approved") {
    return "border-green-400/20 bg-green-400/10 text-green-300";
  }

  if (status === "In Review") {
    return "border-orange-400/20 bg-orange-400/10 text-orange-300";
  }

  return "border-cyan-400/20 bg-cyan-400/10 text-cyan-300";
}

function formatCurrency(amount: number) {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(1)}Cr`;
  }

  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(1)}L`;
  }

  return `₹${amount.toLocaleString("en-IN")}`;
}

export default function ClientsPage() {
  const [projects, setProjects] = useState<Project[]>(defaultProjects);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [savedFeedback, setSavedFeedback] = useState<Feedback[]>([]);

  useEffect(() => {
    const storedProjects = localStorage.getItem(STORAGE_KEY);
    const storedFeedback = localStorage.getItem(FEEDBACK_KEY);

    if (storedProjects) {
      const parsedProjects = JSON.parse(storedProjects);
      setProjects(parsedProjects);

      if (parsedProjects.length > 0) {
        setSelectedProjectId(parsedProjects[0].id);
      }
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultProjects));
      setSelectedProjectId(defaultProjects[0].id);
    }

    if (storedFeedback) {
      setSavedFeedback(JSON.parse(storedFeedback));
    }
  }, []);

  const selectedProject =
    projects.find((project) => project.id === selectedProjectId) || projects[0];

  const projectFeedback = savedFeedback.filter(
    (feedback) => feedback.projectId === selectedProject?.id
  );

  function handleSaveFeedback() {
    if (!feedbackMessage.trim()) {
      alert("Please enter client feedback.");
      return;
    }

    const newFeedback: Feedback = {
      projectId: selectedProject.id,
      message: feedbackMessage,
    };

    const updatedFeedback = [newFeedback, ...savedFeedback];

    setSavedFeedback(updatedFeedback);
    localStorage.setItem(FEEDBACK_KEY, JSON.stringify(updatedFeedback));
    setFeedbackMessage("");
  }

  if (!selectedProject) {
    return (
      <div className="rounded-3xl border border-white/10 bg-slate-900 p-6">
        <h1 className="text-3xl font-bold text-white">No Projects Found</h1>
        <p className="mt-3 text-slate-400">
          Add a project first from the Projects page.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Page Header */}
      <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-start">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.35em] text-cyan-300">
            Client Portal
          </p>

          <h1 className="mt-4 text-4xl font-bold tracking-tight text-white">
            Client Experience Platform
          </h1>

          <p className="mt-3 max-w-3xl text-base leading-7 text-slate-300">
            Give clients a clear project view with progress status, milestones,
            approval requests, budget visibility, and feedback tracking.
          </p>
        </div>
      </div>

      {/* Project Selector */}
      <div className="rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl shadow-black/20">
        <label className="mb-2 block text-sm font-semibold text-slate-300">
          Select Client Project
        </label>

        <select
          value={selectedProjectId}
          onChange={(event) => setSelectedProjectId(event.target.value)}
          className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
        >
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name} - {project.client}
            </option>
          ))}
        </select>
      </div>

      {/* Summary Cards */}
      <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-3xl border border-white/10 bg-slate-900 p-6">
          <p className="text-sm text-slate-400">Client Name</p>
          <h2 className="mt-3 text-2xl font-bold text-white">
            {selectedProject.client}
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Project communication owner
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-slate-900 p-6">
          <p className="text-sm text-slate-400">Project Stage</p>
          <h2 className="mt-3 text-2xl font-bold text-white">
            {selectedProject.stage}
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Current workflow status
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-slate-900 p-6">
          <p className="text-sm text-slate-400">Project Value</p>
          <h2 className="mt-3 text-2xl font-bold text-white">
            {formatCurrency(selectedProject.revenue)}
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Estimated project revenue
          </p>
        </div>

        <div
          className={`rounded-3xl border p-6 ${getRiskStyle(
            selectedProject.delayRisk
          )}`}
        >
          <p className="text-sm font-semibold">Delay Risk</p>
          <h2 className="mt-3 text-2xl font-bold">
            {selectedProject.delayRisk}
          </h2>
          <p className="mt-2 text-sm">Client-facing risk status</p>
        </div>
      </div>

      {/* Progress and Milestones */}
      <div className="mt-8 grid gap-6 xl:grid-cols-3">
        <div className="rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl shadow-black/20 xl:col-span-2">
          <h2 className="text-2xl font-bold text-white">Project Progress</h2>

          <p className="mt-2 text-sm text-slate-400">
            Client-visible project progress based on current project status.
          </p>

          <div className="mt-6">
            <div className="mb-2 flex justify-between text-sm">
              <span className="text-slate-400">Overall Completion</span>
              <span className="font-semibold text-cyan-300">
                {selectedProject.progress}%
              </span>
            </div>

            <div className="h-4 rounded-full bg-slate-800">
              <div
                className="h-4 rounded-full bg-cyan-400"
                style={{ width: `${selectedProject.progress}%` }}
              />
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-green-400/20 bg-green-400/10 p-4">
              <p className="font-semibold text-green-300">Requirement</p>
              <p className="mt-2 text-sm text-slate-300">Completed</p>
            </div>

            <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4">
              <p className="font-semibold text-cyan-300">Design</p>
              <p className="mt-2 text-sm text-slate-300">In Progress</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
              <p className="font-semibold text-slate-300">Construction</p>
              <p className="mt-2 text-sm text-slate-400">Upcoming</p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl shadow-black/20">
          <h2 className="text-2xl font-bold text-white">
            Client Satisfaction
          </h2>

          <p className="mt-2 text-sm text-slate-400">
            Current feedback score from client interactions.
          </p>

          <div className="mt-6 rounded-2xl border border-green-400/20 bg-green-400/10 p-5 text-center">
            <p className="text-5xl font-bold text-white">
              {selectedProject.clientSatisfaction}%
            </p>
            <p className="mt-2 text-sm font-semibold text-green-300">
              Satisfaction Score
            </p>
          </div>
        </div>
      </div>

      {/* Approval Requests */}
      <div className="mt-8 rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl shadow-black/20">
        <h2 className="text-2xl font-bold text-white">Approval Requests</h2>

        <p className="mt-2 text-sm text-slate-400">
          Client approval items required during project execution.
        </p>

        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {approvals.map((approval) => (
            <div
              key={approval.title}
              className="rounded-2xl border border-white/10 bg-slate-950/70 p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-bold text-white">{approval.title}</h3>

                <span
                  className={`rounded-full border px-3 py-1 text-xs font-semibold ${getApprovalStyle(
                    approval.status
                  )}`}
                >
                  {approval.status}
                </span>
              </div>

              <p className="mt-4 text-sm leading-6 text-slate-400">
                {approval.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Feedback */}
      <div className="mt-8 grid gap-6 xl:grid-cols-2">
        <div className="rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl shadow-black/20">
          <h2 className="text-2xl font-bold text-white">
            Add Client Feedback
          </h2>

          <p className="mt-2 text-sm text-slate-400">
            Store client comments for the selected project.
          </p>

          <textarea
            rows={6}
            value={feedbackMessage}
            onChange={(event) => setFeedbackMessage(event.target.value)}
            placeholder="Example: Client requested a warmer color palette and larger balcony space."
            className="mt-5 w-full resize-none rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400"
          />

          <button
            type="button"
            onClick={handleSaveFeedback}
            className="mt-5 rounded-xl bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-300"
          >
            Save Feedback
          </button>
        </div>

        <div className="rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl shadow-black/20">
          <h2 className="text-2xl font-bold text-white">Feedback History</h2>

          <p className="mt-2 text-sm text-slate-400">
            Feedback saved for this selected project.
          </p>

          <div className="mt-5 space-y-4">
            {projectFeedback.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/15 bg-slate-950/70 p-5 text-center">
                <p className="text-sm text-slate-400">
                  No feedback saved for this project yet.
                </p>
              </div>
            ) : (
              projectFeedback.map((feedback, index) => (
                <div
                  key={`${feedback.projectId}-${index}`}
                  className="rounded-2xl border border-white/10 bg-slate-950/70 p-5"
                >
                  <p className="text-sm leading-6 text-slate-300">
                    {feedback.message}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}
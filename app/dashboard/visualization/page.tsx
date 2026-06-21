"use client";

import dynamic from "next/dynamic";
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

const ThreeBuildingViewer = dynamic(
  () => import("../../components/ThreeBuildingViewer"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[430px] items-center justify-center rounded-3xl border border-white/10 bg-slate-950 text-slate-400">
        Loading 3D viewer...
      </div>
    ),
  }
);

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

const modelLayers = [
  {
    name: "Structural Shell",
    status: "Visible",
    description: "Walls, slabs, columns, and base building structure.",
  },
  {
    name: "Interior Layout",
    status: "Visible",
    description: "Room partitions, furniture zones, and movement paths.",
  },
  {
    name: "Lighting Plan",
    status: "Preview",
    description: "Natural light direction and artificial lighting positions.",
  },
  {
    name: "Material Finish",
    status: "Preview",
    description: "Wall finishes, flooring, wood, glass, and surface textures.",
  },
];

const aiReviewNotes = [
  {
    title: "Space Utilization",
    description:
      "The current layout provides clear movement flow between living, dining, and private spaces.",
  },
  {
    title: "Lighting Opportunity",
    description:
      "The model can improve daylight exposure by increasing window openings near the main living area.",
  },
  {
    title: "Client Review Ready",
    description:
      "This project can be prepared for client walkthrough after adding realistic materials and furniture blocks.",
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

function formatCurrency(amount: number) {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(1)}Cr`;
  }

  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(1)}L`;
  }

  return `₹${amount.toLocaleString("en-IN")}`;
}

export default function VisualizationPage() {
  const [projects, setProjects] = useState<Project[]>(defaultProjects);
  const [selectedProjectId, setSelectedProjectId] = useState("");

  useEffect(() => {
    const storedProjects = localStorage.getItem(STORAGE_KEY);

    if (storedProjects) {
      const parsedProjects: Project[] = JSON.parse(storedProjects);
      setProjects(parsedProjects);

      if (parsedProjects.length > 0) {
        setSelectedProjectId(parsedProjects[0].id);
      }
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultProjects));
      setSelectedProjectId(defaultProjects[0].id);
    }
  }, []);

  const selectedProject =
    projects.find((project) => project.id === selectedProjectId) || projects[0];

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
            3D Visualization
          </p>

          <h1 className="mt-4 text-4xl font-bold tracking-tight text-white">
            3D Design Preview Studio
          </h1>

          <p className="mt-3 max-w-3xl text-base leading-7 text-slate-300">
            Preview architectural models, design layers, material concepts, and
            AI-generated model review notes before client presentation.
          </p>
        </div>

        <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-5 py-4">
          <p className="text-sm font-semibold text-cyan-300">
            Three.js Active
          </p>
          <p className="mt-1 text-sm text-slate-300">Interactive 3D Viewer</p>
        </div>
      </div>

      {/* Project Selector */}
      <div className="rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl shadow-black/20">
        <label className="mb-2 block text-sm font-semibold text-slate-300">
          Select Project for 3D Preview
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

      {/* Main Viewer Section */}
      <div className="mt-8 grid gap-6 xl:grid-cols-3">
        {/* Real Three.js Viewer */}
        <div className="rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl shadow-black/20 xl:col-span-2">
          <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-start">
            <div>
              <h2 className="text-2xl font-bold text-white">
                Interactive 3D Model Viewer
              </h2>

              <p className="mt-2 text-sm text-slate-400">
                Rotate, zoom, and inspect a frontend Three.js building model.
              </p>
            </div>

            <span
              className={`rounded-full border px-4 py-2 text-sm font-semibold ${getRiskStyle(
                selectedProject.delayRisk
              )}`}
            >
              {selectedProject.delayRisk} Risk
            </span>
          </div>

          <div className="rounded-3xl border border-cyan-400/20 bg-slate-950 p-2">
            <ThreeBuildingViewer
  projectName={selectedProject.name}
  projectStage={selectedProject.stage}
/>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-3 text-center text-sm font-semibold text-cyan-300">
              Drag to Rotate
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-center text-sm font-semibold text-white">
              Scroll to Zoom
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-center text-sm font-semibold text-white">
              Right Drag to Pan
            </div>
          </div>
        </div>

        {/* Project Info */}
        <div className="rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl shadow-black/20">
          <h2 className="text-2xl font-bold text-white">Project Details</h2>

          <p className="mt-2 text-sm text-slate-400">
            Selected project information connected from localStorage.
          </p>

          <div className="mt-6 space-y-4">
            <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
              <p className="text-sm text-slate-400">Project</p>
              <p className="mt-1 font-bold text-white">
                {selectedProject.name}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
              <p className="text-sm text-slate-400">Client</p>
              <p className="mt-1 font-bold text-white">
                {selectedProject.client}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
              <p className="text-sm text-slate-400">Stage</p>
              <p className="mt-1 font-bold text-white">
                {selectedProject.stage}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
              <p className="text-sm text-slate-400">Project Value</p>
              <p className="mt-1 font-bold text-white">
                {formatCurrency(selectedProject.revenue)}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
              <div className="mb-2 flex justify-between text-sm">
                <span className="text-slate-400">Completion</span>
                <span className="font-semibold text-cyan-300">
                  {selectedProject.progress}%
                </span>
              </div>

              <div className="h-2 rounded-full bg-slate-800">
                <div
                  className="h-2 rounded-full bg-cyan-400"
                  style={{ width: `${selectedProject.progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Model Layers */}
      <div className="mt-8 grid gap-6 xl:grid-cols-2">
        <div className="rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl shadow-black/20">
          <h2 className="text-2xl font-bold text-white">Design Layers</h2>

          <p className="mt-2 text-sm text-slate-400">
            Layer controls that will later be connected to real 3D objects.
          </p>

          <div className="mt-6 space-y-4">
            {modelLayers.map((layer) => (
              <div
                key={layer.name}
                className="rounded-2xl border border-white/10 bg-slate-950/70 p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-white">{layer.name}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      {layer.description}
                    </p>
                  </div>

                  <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-300">
                    {layer.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Review Notes */}
        <div className="rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl shadow-black/20">
          <h2 className="text-2xl font-bold text-white">
            AI Model Review Notes
          </h2>

          <p className="mt-2 text-sm text-slate-400">
            Simulated AI observations for the selected 3D design.
          </p>

          <div className="mt-6 space-y-4">
            {aiReviewNotes.map((note) => (
              <div
                key={note.title}
                className="rounded-2xl border border-green-400/20 bg-green-400/10 p-5"
              >
                <h3 className="font-bold text-green-300">{note.title}</h3>

                <p className="mt-2 text-sm leading-6 text-slate-300">
                  {note.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Future Roadmap */}
      <div className="mt-8 rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-6 shadow-2xl shadow-black/20">
        <h2 className="text-2xl font-bold text-white">
          Future Real 3D Integration
        </h2>

        <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-300">
          This page now includes a frontend Three.js demo viewer. Later, this
          module can be upgraded with GLTF/GLB model upload, real architecture
          file loading, material switching, room annotations, client comments,
          and AI-powered design issue detection.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
            <p className="font-bold text-cyan-300">Three.js</p>
            <p className="mt-2 text-sm text-slate-400">3D rendering engine</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
            <p className="font-bold text-cyan-300">React Three Fiber</p>
            <p className="mt-2 text-sm text-slate-400">
              React wrapper for 3D scenes
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
            <p className="font-bold text-cyan-300">Orbit Controls</p>
            <p className="mt-2 text-sm text-slate-400">Rotate, zoom, pan</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
            <p className="font-bold text-cyan-300">Future Backend</p>
            <p className="mt-2 text-sm text-slate-400">
              Upload and store 3D files
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
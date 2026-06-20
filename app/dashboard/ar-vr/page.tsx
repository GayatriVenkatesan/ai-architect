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

const experienceModes = [
  {
    title: "AR Room Preview",
    status: "Prototype Ready",
    description:
      "Clients can later preview furniture, walls, and design elements in real-world space using a mobile camera.",
  },
  {
    title: "VR Walkthrough",
    status: "Planned",
    description:
      "Clients can later enter a virtual walkthrough of the project before construction begins.",
  },
  {
    title: "Material Experience",
    status: "Concept",
    description:
      "Clients can preview flooring, wall textures, lighting, and interior finishes in an immersive view.",
  },
];

const deviceSupport = [
  {
    device: "Mobile AR",
    support: "Future",
    details: "Phone camera-based room and object preview.",
  },
  {
    device: "Web VR",
    support: "Future",
    details: "Browser-based virtual walkthrough experience.",
  },
  {
    device: "VR Headset",
    support: "Advanced",
    details: "Immersive walkthrough using VR devices.",
  },
  {
    device: "Desktop Preview",
    support: "Current",
    details: "Frontend placeholder preview available now.",
  },
];

const workflowSteps = [
  {
    step: "01",
    title: "Select Project",
    description: "Choose the architecture project for immersive preview.",
  },
  {
    step: "02",
    title: "Prepare 3D Model",
    description: "Use the 3D Visualization module as the base model.",
  },
  {
    step: "03",
    title: "Launch AR/VR Mode",
    description: "Open AR or VR preview for client walkthrough.",
  },
  {
    step: "04",
    title: "Collect Feedback",
    description: "Save client comments and design correction requests.",
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

function getSupportStyle(support: string) {
  if (support === "Current") {
    return "border-green-400/20 bg-green-400/10 text-green-300";
  }

  if (support === "Future") {
    return "border-cyan-400/20 bg-cyan-400/10 text-cyan-300";
  }

  return "border-purple-400/20 bg-purple-400/10 text-purple-300";
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

export default function ArVrPage() {
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
            AR/VR Experience
          </p>

          <h1 className="mt-4 text-4xl font-bold tracking-tight text-white">
            Immersive Client Walkthrough Studio
          </h1>

          <p className="mt-3 max-w-3xl text-base leading-7 text-slate-300">
            Prepare future augmented reality and virtual reality experiences so
            clients can understand spaces before construction starts.
          </p>
        </div>

        <div className="rounded-2xl border border-purple-400/20 bg-purple-400/10 px-5 py-4">
          <p className="text-sm font-semibold text-purple-300">
            Future Upgrade
          </p>
          <p className="mt-1 text-sm text-slate-300">WebXR / AR Viewer</p>
        </div>
      </div>

      {/* Project Selector */}
      <div className="rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl shadow-black/20">
        <label className="mb-2 block text-sm font-semibold text-slate-300">
          Select Project for AR/VR Preview
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

      {/* Main Preview */}
      <div className="mt-8 grid gap-6 xl:grid-cols-3">
        <div className="rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl shadow-black/20 xl:col-span-2">
          <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-start">
            <div>
              <h2 className="text-2xl font-bold text-white">
                Immersive Preview Area
              </h2>

              <p className="mt-2 text-sm text-slate-400">
                This section is a placeholder for future AR/VR walkthrough
                rendering.
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

          <div className="relative flex min-h-[430px] items-center justify-center overflow-hidden rounded-3xl border border-purple-400/20 bg-slate-950">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.18),transparent_55%)]" />

            <div className="relative z-10 text-center">
              <div className="mx-auto flex h-36 w-36 items-center justify-center rounded-full border border-purple-300/40 bg-purple-400/10 shadow-2xl shadow-purple-500/20">
                <div className="flex h-24 w-24 items-center justify-center rounded-full border border-cyan-300/40 bg-cyan-400/10">
                  <div className="h-12 w-12 rounded-full bg-cyan-300/30" />
                </div>
              </div>

              <h2 className="mt-8 text-3xl font-bold text-white">
                AR/VR Placeholder
              </h2>

              <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-400">
                Later, this area can launch a real immersive walkthrough using
                WebXR, Three.js, AR model placement, VR navigation, and client
                feedback tools.
              </p>

              <div className="mt-8 grid gap-4 md:grid-cols-3">
                <button
                  type="button"
                  className="rounded-xl border border-purple-400/20 bg-purple-400/10 px-4 py-3 text-sm font-semibold text-purple-300 transition hover:bg-purple-400/20"
                >
                  Launch AR Preview
                </button>

                <button
                  type="button"
                  className="rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-3 text-sm font-semibold text-cyan-300 transition hover:bg-cyan-400/20"
                >
                  Start VR Walkthrough
                </button>

                <button
                  type="button"
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:border-cyan-400 hover:text-cyan-300"
                >
                  Share With Client
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Project Info */}
        <div className="rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl shadow-black/20">
          <h2 className="text-2xl font-bold text-white">Project Details</h2>

          <p className="mt-2 text-sm text-slate-400">
            Selected project data connected from localStorage.
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

      {/* Experience Modes */}
      <div className="mt-8 rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl shadow-black/20">
        <h2 className="text-2xl font-bold text-white">Experience Modes</h2>

        <p className="mt-2 text-sm text-slate-400">
          Planned immersive modes for client design review.
        </p>

        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {experienceModes.map((mode) => (
            <div
              key={mode.title}
              className="rounded-2xl border border-white/10 bg-slate-950/70 p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <h3 className="font-bold text-white">{mode.title}</h3>

                <span className="rounded-full border border-purple-400/20 bg-purple-400/10 px-3 py-1 text-xs font-semibold text-purple-300">
                  {mode.status}
                </span>
              </div>

              <p className="mt-4 text-sm leading-6 text-slate-400">
                {mode.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Device Support and Workflow */}
      <div className="mt-8 grid gap-6 xl:grid-cols-2">
        <div className="rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl shadow-black/20">
          <h2 className="text-2xl font-bold text-white">Device Support</h2>

          <p className="mt-2 text-sm text-slate-400">
            Devices and platforms planned for future immersive access.
          </p>

          <div className="mt-6 space-y-4">
            {deviceSupport.map((item) => (
              <div
                key={item.device}
                className="rounded-2xl border border-white/10 bg-slate-950/70 p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-white">{item.device}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      {item.details}
                    </p>
                  </div>

                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-semibold ${getSupportStyle(
                      item.support
                    )}`}
                  >
                    {item.support}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl shadow-black/20">
          <h2 className="text-2xl font-bold text-white">Experience Workflow</h2>

          <p className="mt-2 text-sm text-slate-400">
            How AR/VR will fit inside the architecture workflow.
          </p>

          <div className="mt-6 space-y-4">
            {workflowSteps.map((step) => (
              <div
                key={step.step}
                className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-5"
              >
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cyan-400 text-sm font-bold text-slate-950">
                    {step.step}
                  </div>

                  <div>
                    <h3 className="font-bold text-white">{step.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-300">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Future Integration */}
      <div className="mt-8 rounded-3xl border border-purple-400/20 bg-purple-400/10 p-6 shadow-2xl shadow-black/20">
        <h2 className="text-2xl font-bold text-white">
          Future Real AR/VR Integration
        </h2>

        <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-300">
          This page is currently a frontend placeholder. Later, this module can
          be upgraded with WebXR, Three.js, React Three Fiber, GLB/GLTF model
          loading, AR object placement, VR movement controls, room annotations,
          and client walkthrough feedback.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
            <p className="font-bold text-purple-300">WebXR</p>
            <p className="mt-2 text-sm text-slate-400">
              AR/VR browser support
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
            <p className="font-bold text-purple-300">Three.js</p>
            <p className="mt-2 text-sm text-slate-400">
              3D rendering foundation
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
            <p className="font-bold text-purple-300">GLB / GLTF</p>
            <p className="mt-2 text-sm text-slate-400">3D model support</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
            <p className="font-bold text-purple-300">Client Review</p>
            <p className="mt-2 text-sm text-slate-400">
              Immersive feedback tools
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useEffect, useMemo, useState } from "react";
import { getProjects } from "../../lib/api";

type Project = {
  id: number;
  name?: string;
  project_name?: string;
  client?: string;
  client_name?: string;
  location?: string;
  type?: string;
  project_type?: string;
  status?: string;
  stage?: string;
  project_stage?: string;
  budget?: number;
  revenue?: number;
  progress?: number;
  progress_percentage?: number;
  risk_level?: string;
  delay_risk?: string;
};

type ProjectsResponse = {
  total?: number;
  projects?: Project[];
  data?: Project[];
};

function getProjectName(project: Project) {
  return project.name ?? project.project_name ?? "Untitled Project";
}

function getClientName(project: Project) {
  return project.client ?? project.client_name ?? "Not available";
}

function getProjectType(project: Project) {
  return project.type ?? project.project_type ?? "Architecture Project";
}

function getProjectStage(project: Project) {
  return project.stage ?? project.project_stage ?? project.status ?? "Planning";
}

function getProjectBudget(project: Project) {
  return Number(project.budget ?? project.revenue ?? 0);
}

function getProjectProgress(project: Project) {
  return Number(project.progress ?? project.progress_percentage ?? 0);
}

function getProjectRisk(project: Project) {
  return project.risk_level ?? project.delay_risk ?? "Medium";
}

function formatCurrency(amount: number) {
  const safeAmount = Number(amount ?? 0);

  if (safeAmount >= 10000000) {
    return `₹${(safeAmount / 10000000).toFixed(1)}Cr`;
  }

  if (safeAmount >= 100000) {
    return `₹${(safeAmount / 100000).toFixed(1)}L`;
  }

  return `₹${safeAmount.toLocaleString("en-IN")}`;
}

function getRiskStyle(risk: string) {
  const lowerRisk = risk.toLowerCase();

  if (lowerRisk.includes("low")) {
    return "border-emerald-400/30 bg-emerald-400/10 text-emerald-300";
  }

  if (lowerRisk.includes("high")) {
    return "border-red-400/30 bg-red-400/10 text-red-300";
  }

  return "border-orange-400/30 bg-orange-400/10 text-orange-300";
}

function getProjectCategory(project: Project) {
  const text = `${getProjectName(project)} ${getProjectType(project)}`.toLowerCase();

  if (text.includes("hospital") || text.includes("healthcare") || text.includes("clinic")) {
    return "hospital";
  }

  if (
    text.includes("campus") ||
    text.includes("academic") ||
    text.includes("school") ||
    text.includes("college")
  ) {
    return "campus";
  }

  if (
    text.includes("living") ||
    text.includes("residential") ||
    text.includes("apartment") ||
    text.includes("nest")
  ) {
    return "residential";
  }

  if (text.includes("villa") || text.includes("home")) {
    return "villa";
  }

  return "commercial";
}

function Box({
  position,
  scale,
  color,
}: {
  position: [number, number, number];
  scale: [number, number, number];
  color: string;
}) {
  return (
    <mesh position={position} scale={scale} castShadow receiveShadow>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={color} roughness={0.55} metalness={0.08} />
    </mesh>
  );
}

function GlassBox({
  position,
  scale,
  color = "#7dd3fc",
}: {
  position: [number, number, number];
  scale: [number, number, number];
  color?: string;
}) {
  return (
    <mesh position={position} scale={scale} castShadow>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        color={color}
        roughness={0.18}
        metalness={0.15}
        transparent
        opacity={0.75}
      />
    </mesh>
  );
}

function WindowGrid({
  startX,
  y,
  z,
  rows,
  cols,
  spacingX,
  spacingY,
}: {
  startX: number;
  y: number;
  z: number;
  rows: number;
  cols: number;
  spacingX: number;
  spacingY: number;
}) {
  const windows = [];

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      windows.push(
        <GlassBox
          key={`${row}-${col}`}
          position={[startX + col * spacingX, y + row * spacingY, z]}
          scale={[0.18, 0.22, 0.03]}
        />
      );
    }
  }

  return <>{windows}</>;
}

function Tree({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <Box position={[0, 0.25, 0]} scale={[0.12, 0.5, 0.12]} color="#854d0e" />

      <mesh position={[0, 0.8, 0]} castShadow>
        <sphereGeometry args={[0.38, 24, 24]} />
        <meshStandardMaterial color="#22c55e" roughness={0.7} />
      </mesh>
    </group>
  );
}

function StreetLights() {
  return (
    <>
      {[-3.2, -1.6, 0, 1.6, 3.2].map((x) => (
        <group key={x} position={[x, 0, 2.9]}>
          <Box position={[0, 0.35, 0]} scale={[0.05, 0.7, 0.05]} color="#475569" />

          <mesh position={[0, 0.78, 0]} castShadow>
            <sphereGeometry args={[0.09, 16, 16]} />
            <meshStandardMaterial
              color="#fde68a"
              emissive="#facc15"
              emissiveIntensity={1.5}
            />
          </mesh>
        </group>
      ))}
    </>
  );
}

function BaseScene() {
  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
        <planeGeometry args={[11, 8]} />
        <meshStandardMaterial color="#020617" roughness={0.85} />
      </mesh>

      <Box position={[0, 0.02, 0]} scale={[8.5, 0.05, 5.5]} color="#111827" />

      <Box position={[0, 0.06, 2.3]} scale={[7.5, 0.04, 0.55]} color="#334155" />
      <Box position={[0, 0.08, 2.3]} scale={[5.5, 0.03, 0.08]} color="#67e8f9" />

      <StreetLights />

      <Tree position={[-4.1, 0, -1.9]} />
      <Tree position={[4.1, 0, -1.8]} />
      <Tree position={[-4.2, 0, 1.55]} />
      <Tree position={[4.2, 0, 1.45]} />
    </>
  );
}

function HospitalModel() {
  return (
    <group>
      <BaseScene />

      <Box position={[0, 0.75, -0.3]} scale={[3.7, 1.5, 1.4]} color="#e5e7eb" />
      <Box position={[-2.6, 0.55, -0.2]} scale={[1.6, 1.1, 1.2]} color="#f8fafc" />
      <Box position={[2.6, 0.55, -0.2]} scale={[1.6, 1.1, 1.2]} color="#f8fafc" />

      <Box position={[0, 1.65, -0.3]} scale={[4.1, 0.18, 1.65]} color="#0f172a" />

      <WindowGrid startX={-1.4} y={0.45} z={0.43} rows={3} cols={6} spacingX={0.55} spacingY={0.35} />

      <Box position={[0, 0.7, 0.5]} scale={[0.18, 0.85, 0.05]} color="#dc2626" />
      <Box position={[0, 0.7, 0.52]} scale={[0.75, 0.18, 0.05]} color="#dc2626" />

      <Box position={[0, 0.2, 0.5]} scale={[0.7, 0.4, 0.08]} color="#0f172a" />

      <Box position={[0, 0.08, 1.15]} scale={[2.5, 0.05, 0.5]} color="#94a3b8" />
    </group>
  );
}

function ResidentialModel() {
  return (
    <group>
      <BaseScene />

      <Box position={[-1.4, 1.05, -0.4]} scale={[1.5, 2.1, 1.25]} color="#e2e8f0" />
      <Box position={[1.1, 0.75, -0.35]} scale={[2.3, 1.5, 1.4]} color="#cbd5e1" />
      <Box position={[0.2, 0.35, 1.0]} scale={[3.4, 0.7, 0.75]} color="#475569" />

      <GlassBox position={[1.1, 0.85, 0.38]} scale={[1.3, 0.8, 0.06]} color="#86efac" />
      <GlassBox position={[-1.4, 1.15, 0.26]} scale={[0.8, 1.45, 0.06]} color="#67e8f9" />

      <WindowGrid startX={-1.85} y={0.55} z={0.26} rows={4} cols={3} spacingX={0.42} spacingY={0.35} />

      <Box position={[0.2, 0.1, 2.0]} scale={[3.8, 0.04, 0.45]} color="#22c55e" />
      <Tree position={[-2.8, 0, 1.6]} />
      <Tree position={[2.8, 0, 1.6]} />
    </group>
  );
}

function CampusModel() {
  return (
    <group>
      <BaseScene />

      <Box position={[-1.9, 0.75, -0.4]} scale={[2.0, 1.5, 1.25]} color="#e2e8f0" />
      <Box position={[0.4, 1.0, -0.55]} scale={[1.6, 2.0, 1.2]} color="#c4b5fd" />
      <Box position={[2.3, 0.55, -0.25]} scale={[1.6, 1.1, 1.1]} color="#a7f3d0" />

      <Box position={[0.2, 1.65, -0.55]} scale={[1.7, 0.15, 1.25]} color="#0f172a" />

      <WindowGrid startX={-2.55} y={0.45} z={0.25} rows={3} cols={4} spacingX={0.45} spacingY={0.32} />
      <WindowGrid startX={-0.1} y={0.55} z={0.08} rows={4} cols={3} spacingX={0.42} spacingY={0.35} />

      <Box position={[0.2, 0.08, 1.25]} scale={[4.6, 0.04, 0.55]} color="#334155" />
      <Box position={[0.2, 0.11, 1.25]} scale={[3.2, 0.03, 0.08]} color="#67e8f9" />

      <Tree position={[-3.5, 0, 0.9]} />
      <Tree position={[3.5, 0, 0.9]} />
    </group>
  );
}

function VillaModel() {
  return (
    <group>
      <BaseScene />

      <Box position={[0, 0.45, -0.35]} scale={[3.4, 0.9, 1.6]} color="#f8fafc" />
      <Box position={[0, 1.0, -0.35]} scale={[3.65, 0.25, 1.8]} color="#334155" />

      <GlassBox position={[-0.8, 0.48, 0.47]} scale={[0.55, 0.45, 0.06]} />
      <GlassBox position={[0.8, 0.48, 0.47]} scale={[0.55, 0.45, 0.06]} />

      <Box position={[0, 0.25, 0.52]} scale={[0.45, 0.5, 0.08]} color="#0f172a" />

      <Box position={[2.5, 0.15, 0.6]} scale={[1.2, 0.3, 0.75]} color="#475569" />
      <Box position={[-2.5, 0.08, 0.6]} scale={[1.2, 0.08, 0.9]} color="#22c55e" />

      <Tree position={[-3.5, 0, -1.5]} />
      <Tree position={[3.5, 0, -1.4]} />
    </group>
  );
}

function CommercialModel() {
  return (
    <group>
      <BaseScene />

      <Box position={[0, 1.2, -0.45]} scale={[2.0, 2.4, 1.3]} color="#cbd5e1" />
      <Box position={[-2.1, 0.75, -0.25]} scale={[1.6, 1.5, 1.1]} color="#94a3b8" />
      <Box position={[2.1, 0.75, -0.25]} scale={[1.6, 1.5, 1.1]} color="#64748b" />

      <GlassBox position={[0, 1.25, 0.23]} scale={[1.2, 1.8, 0.06]} color="#67e8f9" />

      <WindowGrid startX={-0.65} y={0.55} z={0.24} rows={5} cols={3} spacingX={0.42} spacingY={0.34} />

      <Box position={[0, 0.08, 1.25]} scale={[5.0, 0.04, 0.55]} color="#334155" />
      <Tree position={[-3.5, 0, 1.5]} />
      <Tree position={[3.5, 0, 1.5]} />
    </group>
  );
}

function ProjectModel({ project }: { project: Project }) {
  const category = getProjectCategory(project);

  if (category === "hospital") {
    return <HospitalModel />;
  }

  if (category === "campus") {
    return <CampusModel />;
  }

  if (category === "residential") {
    return <ResidentialModel />;
  }

  if (category === "villa") {
    return <VillaModel />;
  }

  return <CommercialModel />;
}

export default function VisualizationPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadProjects() {
    try {
      setIsLoading(true);
      setError("");

      const response = (await getProjects()) as Project[] | ProjectsResponse;

      let projectList: Project[] = [];

      if (Array.isArray(response)) {
        projectList = response;
      } else if (Array.isArray(response.projects)) {
        projectList = response.projects;
      } else if (Array.isArray(response.data)) {
        projectList = response.data;
      }

      setProjects(projectList);

      if (projectList.length > 0) {
        setSelectedProjectId(projectList[0].id);
      }
    } catch {
      setError(
        "Unable to load projects from backend. Please check whether FastAPI backend is running."
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadProjects();
  }, []);

  const selectedProject = useMemo(() => {
    return projects.find((project) => project.id === selectedProjectId) ?? null;
  }, [projects, selectedProjectId]);

  const projectName = selectedProject
    ? getProjectName(selectedProject)
    : "No project selected";

  const clientName = selectedProject
    ? getClientName(selectedProject)
    : "Not available";

  const projectStage = selectedProject
    ? getProjectStage(selectedProject)
    : "Planning";

  const projectBudget = selectedProject ? getProjectBudget(selectedProject) : 0;

  const projectProgress = selectedProject
    ? getProjectProgress(selectedProject)
    : 0;

  const projectRisk = selectedProject ? getProjectRisk(selectedProject) : "Medium";

  return (
    <div className="min-h-screen text-white">
      <header className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">
          3D Visualization
        </p>

        <h1 className="mt-3 text-4xl font-bold tracking-tight">
          Interactive Architecture Preview
        </h1>

        <p className="mt-3 max-w-4xl text-slate-400">
          Select a backend project and inspect a real interactive 3D
          architecture model with rotate, zoom, and pan controls.
        </p>
      </header>

      <section className="mb-8 rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-2xl shadow-black/20">
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div>
            <label className="mb-3 block text-sm font-semibold text-slate-300">
              Select Project for 3D Preview
            </label>

            <select
              value={selectedProjectId ?? ""}
              onChange={(event) =>
                setSelectedProjectId(Number(event.target.value))
              }
              className="w-full rounded-2xl border border-white/10 bg-slate-950 px-5 py-4 text-white outline-none transition focus:border-cyan-400"
            >
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {getProjectName(project)} - {getClientName(project)}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={loadProjects}
            className="rounded-2xl border border-cyan-400/30 bg-cyan-400/10 px-6 py-4 text-sm font-bold text-cyan-300 transition hover:bg-cyan-400 hover:text-slate-950"
          >
            Refresh Projects
          </button>
        </div>

        <p className="mt-4 text-sm text-slate-400">
          Data source: FastAPI backend + SQLite database
        </p>
      </section>

      {isLoading && (
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-slate-300">
          Loading projects from backend...
        </div>
      )}

      {error && (
        <div className="rounded-3xl border border-red-400/30 bg-red-400/10 p-6 text-red-300">
          {error}
        </div>
      )}

      {!isLoading && !error && projects.length === 0 && (
        <div className="rounded-3xl border border-yellow-400/30 bg-yellow-400/10 p-8 text-yellow-200">
          No projects found. Add a project first from the Projects page.
        </div>
      )}

      {!isLoading && !error && selectedProject && (
        <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_380px]">
          <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-7 shadow-2xl shadow-black/20">
            <div className="mb-6 flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
              <div>
                <h2 className="text-3xl font-bold">
                  Interactive 3D Model Viewer
                </h2>

                <p className="mt-2 text-slate-400">
                  Rotate, zoom, and inspect a real frontend Three.js building
                  model.
                </p>
              </div>

              <div
                className={`rounded-full border px-5 py-2 text-sm font-bold ${getRiskStyle(
                  projectRisk
                )}`}
              >
                {projectRisk} Risk
              </div>
            </div>

            <div className="h-[580px] overflow-hidden rounded-3xl border border-cyan-400/20 bg-slate-950">
              <Canvas
                shadows
                camera={{
                  position: [6, 5, 7],
                  fov: 45,
                }}
              >
                <color attach="background" args={["#020617"]} />

                <ambientLight intensity={0.65} />

                <directionalLight
                  position={[5, 8, 5]}
                  intensity={1.6}
                  castShadow
                />

                <pointLight
                  position={[-4, 4, 3]}
                  intensity={2}
                  color="#22d3ee"
                />

                <ProjectModel project={selectedProject} />

                <OrbitControls
                  enableZoom
                  enablePan
                  enableRotate
                  minDistance={4}
                  maxDistance={12}
                  target={[0, 0.6, 0]}
                />
              </Canvas>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-5 py-4 text-center text-sm font-bold text-cyan-300">
                Drag to Rotate
              </div>

              <div className="rounded-2xl border border-white/10 bg-slate-900 px-5 py-4 text-center text-sm font-bold text-slate-300">
                Scroll to Zoom
              </div>

              <div className="rounded-2xl border border-white/10 bg-slate-900 px-5 py-4 text-center text-sm font-bold text-slate-300">
                Right Drag to Pan
              </div>
            </div>
          </section>

          <aside className="space-y-6">
            <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-7">
              <h2 className="text-2xl font-bold">Project Details</h2>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Selected project information loaded from FastAPI backend and
                SQLite database.
              </p>

              <div className="mt-6 space-y-5">
                <div className="rounded-2xl border border-white/10 bg-slate-950 p-5">
                  <p className="text-sm text-slate-400">Project</p>
                  <p className="mt-2 text-lg font-bold text-white">
                    {projectName}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-slate-950 p-5">
                  <p className="text-sm text-slate-400">Client</p>
                  <p className="mt-2 text-lg font-bold text-white">
                    {clientName}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-slate-950 p-5">
                  <p className="text-sm text-slate-400">Location</p>
                  <p className="mt-2 text-lg font-bold text-white">
                    {selectedProject.location ?? "Not available"}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-slate-950 p-5">
                  <p className="text-sm text-slate-400">Stage</p>
                  <p className="mt-2 text-lg font-bold text-white">
                    {projectStage}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-slate-950 p-5">
                  <p className="text-sm text-slate-400">Project Budget</p>
                  <p className="mt-2 text-lg font-bold text-white">
                    {formatCurrency(projectBudget)}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-slate-950 p-5">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-slate-400">Completion</p>
                    <p className="text-sm font-bold text-cyan-300">
                      {projectProgress}%
                    </p>
                  </div>

                  <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-800">
                    <div
                      className="h-full rounded-full bg-cyan-400"
                      style={{
                        width: `${Math.min(
                          Math.max(projectProgress, 0),
                          100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-7">
              <h2 className="text-xl font-bold">3D Viewer Notes</h2>

              <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
                <li>• Real Three.js 3D viewer</li>
                <li>• Different model for each project type</li>
                <li>• Hospital, campus, residential, villa, and commercial views</li>
                <li>• Connected to backend project data</li>
                <li>• Future scope: upload real GLB/GLTF architecture models</li>
              </ul>
            </section>
          </aside>
        </div>
      )}
    </div>
  );
}
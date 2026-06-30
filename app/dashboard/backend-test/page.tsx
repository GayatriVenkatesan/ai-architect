"use client";

import { useEffect, useState } from "react";
import { getProjects } from "../../lib/api";

type Project = {
  id: number;
  name: string;
  project_type: string;
  location: string;
  status: string;
  progress: number;
  description?: string;
};

export default function BackendTestPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProjects() {
      try {
        const data = await getProjects();
        setProjects(data.projects);
      } catch {
        setError("Backend connection failed");
      } finally {
        setLoading(false);
      }
    }

    loadProjects();
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 p-8 text-white">
      <div className="mx-auto max-w-6xl">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">
          ArchiFlow AI Backend Test
        </p>

        <h1 className="mt-3 text-3xl font-bold">
          Projects API Connection
        </h1>

        <p className="mt-3 text-slate-400">
          This page confirms that the Next.js frontend can fetch project data
          from the FastAPI backend.
        </p>

        {loading && (
          <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
            Loading projects from backend...
          </div>
        )}

        {error && (
          <div className="mt-8 rounded-2xl border border-red-400/30 bg-red-400/10 p-6 text-red-200">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {projects.map((project) => (
              <div
                key={project.id}
                className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-xl"
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-200">
                    {project.project_type}
                  </span>

                  <span className="text-xs text-slate-400">
                    {project.progress}%
                  </span>
                </div>

                <h2 className="mt-4 text-lg font-semibold">
                  {project.name}
                </h2>

                <p className="mt-2 text-sm text-slate-400">
                  {project.location}
                </p>

                <p className="mt-3 text-sm text-slate-300">
                  Status: {project.status}
                </p>

                <p className="mt-4 text-sm leading-6 text-slate-400">
                  {project.description}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
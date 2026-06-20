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

type DocumentFormData = {
  title: string;
  category: DocumentCategory;
  status: DocumentStatus;
  fileName: string;
  owner: string;
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
  {
    id: "doc-3",
    projectId: "project-2",
    title: "Living Room Mood Board",
    category: "Interior Design",
    status: "Draft",
    fileName: "living-room-moodboard.jpg",
    owner: "Interior Designer",
    createdAt: "2026-06-20",
  },
];

const initialFormData: DocumentFormData = {
  title: "",
  category: "Requirement",
  status: "Draft",
  fileName: "",
  owner: "",
};

function getStatusStyle(status: DocumentStatus) {
  if (status === "Approved") {
    return "border-green-400/20 bg-green-400/10 text-green-300";
  }

  if (status === "In Review") {
    return "border-orange-400/20 bg-orange-400/10 text-orange-300";
  }

  if (status === "Rejected") {
    return "border-red-400/20 bg-red-400/10 text-red-300";
  }

  return "border-cyan-400/20 bg-cyan-400/10 text-cyan-300";
}

function getCategoryStyle(category: DocumentCategory) {
  if (category === "Requirement") {
    return "border-blue-400/20 bg-blue-400/10 text-blue-300";
  }

  if (category === "2D Floor Plan") {
    return "border-cyan-400/20 bg-cyan-400/10 text-cyan-300";
  }

  if (category === "Interior Design") {
    return "border-violet-400/20 bg-violet-400/10 text-violet-300";
  }

  if (category === "Construction") {
    return "border-orange-400/20 bg-orange-400/10 text-orange-300";
  }

  if (category === "Contract") {
    return "border-pink-400/20 bg-pink-400/10 text-pink-300";
  }

  if (category === "Report") {
    return "border-green-400/20 bg-green-400/10 text-green-300";
  }

  return "border-yellow-400/20 bg-yellow-400/10 text-yellow-300";
}

export default function DocumentsPage() {
  const [projects, setProjects] = useState<Project[]>(defaultProjects);
  const [documents, setDocuments] =
    useState<ProjectDocument[]>(defaultDocuments);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [formData, setFormData] = useState<DocumentFormData>(initialFormData);

  useEffect(() => {
    const storedProjects = localStorage.getItem(PROJECT_STORAGE_KEY);
    const storedDocuments = localStorage.getItem(DOCUMENT_STORAGE_KEY);

    if (storedProjects) {
      const parsedProjects: Project[] = JSON.parse(storedProjects);
      setProjects(parsedProjects);

      if (parsedProjects.length > 0) {
        setSelectedProjectId(parsedProjects[0].id);
      }
    } else {
      localStorage.setItem(PROJECT_STORAGE_KEY, JSON.stringify(defaultProjects));
      setSelectedProjectId(defaultProjects[0].id);
    }

    if (storedDocuments) {
      const parsedDocuments: ProjectDocument[] = JSON.parse(storedDocuments);
      setDocuments(parsedDocuments);
    } else {
      localStorage.setItem(
        DOCUMENT_STORAGE_KEY,
        JSON.stringify(defaultDocuments)
      );
    }
  }, []);

  const selectedProject =
    projects.find((project) => project.id === selectedProjectId) || projects[0];

  const selectedProjectDocuments = documents.filter(
    (document) => document.projectId === selectedProject?.id
  );

  const approvedCount = selectedProjectDocuments.filter(
    (document) => document.status === "Approved"
  ).length;

  const reviewCount = selectedProjectDocuments.filter(
    (document) => document.status === "In Review"
  ).length;

  const draftCount = selectedProjectDocuments.filter(
    (document) => document.status === "Draft"
  ).length;

  function updateField<K extends keyof DocumentFormData>(
    field: K,
    value: DocumentFormData[K]
  ) {
    setFormData((previousData) => ({
      ...previousData,
      [field]: value,
    }));
  }

  function saveDocuments(updatedDocuments: ProjectDocument[]) {
    setDocuments(updatedDocuments);
    localStorage.setItem(DOCUMENT_STORAGE_KEY, JSON.stringify(updatedDocuments));
  }

  function handleAddDocument(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!formData.title.trim()) {
      alert("Please enter document title.");
      return;
    }

    if (!selectedProject) {
      alert("Please add or select a project first.");
      return;
    }

    const newDocument: ProjectDocument = {
      id: `doc-${Date.now()}`,
      projectId: selectedProject.id,
      title: formData.title,
      category: formData.category,
      status: formData.status,
      fileName: formData.fileName || "No file selected",
      owner: formData.owner || "Not assigned",
      createdAt: new Date().toISOString().slice(0, 10),
    };

    const updatedDocuments = [newDocument, ...documents];

    saveDocuments(updatedDocuments);
    setFormData(initialFormData);
  }

  function handleDeleteDocument(documentId: string) {
    const updatedDocuments = documents.filter(
      (document) => document.id !== documentId
    );

    saveDocuments(updatedDocuments);
  }

  if (!selectedProject) {
    return (
      <div className="rounded-3xl border border-white/10 bg-slate-900 p-6">
        <h1 className="text-3xl font-bold text-white">No Projects Found</h1>
        <p className="mt-3 text-slate-400">
          Add a project first from the Projects page before adding documents.
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
            Documents
          </p>

          <h1 className="mt-4 text-4xl font-bold tracking-tight text-white">
            Documents & File Management
          </h1>

          <p className="mt-3 max-w-3xl text-base leading-7 text-slate-300">
            Store and manage project-related documents such as requirements,
            floor plans, interior mood boards, contracts, approval files,
            construction reports, and client handover documents.
          </p>
        </div>
      </div>

      {/* Project Selector */}
      <div className="rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl shadow-black/20">
        <label className="mb-2 block text-sm font-semibold text-slate-300">
          Select Project
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
        <div className="rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl shadow-black/20">
          <p className="text-sm text-slate-400">Total Documents</p>
          <h2 className="mt-3 text-4xl font-bold text-white">
            {selectedProjectDocuments.length}
          </h2>
          <p className="mt-2 text-sm text-slate-400">For selected project</p>
        </div>

        <div className="rounded-3xl border border-green-400/20 bg-green-400/10 p-6 shadow-2xl shadow-black/20">
          <p className="text-sm font-semibold text-green-300">Approved</p>
          <h2 className="mt-3 text-4xl font-bold text-white">
            {approvedCount}
          </h2>
          <p className="mt-2 text-sm text-green-200/80">Ready for use</p>
        </div>

        <div className="rounded-3xl border border-orange-400/20 bg-orange-400/10 p-6 shadow-2xl shadow-black/20">
          <p className="text-sm font-semibold text-orange-300">In Review</p>
          <h2 className="mt-3 text-4xl font-bold text-white">
            {reviewCount}
          </h2>
          <p className="mt-2 text-sm text-orange-200/80">Awaiting approval</p>
        </div>

        <div className="rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-6 shadow-2xl shadow-black/20">
          <p className="text-sm font-semibold text-cyan-300">Drafts</p>
          <h2 className="mt-3 text-4xl font-bold text-white">{draftCount}</h2>
          <p className="mt-2 text-sm text-cyan-200/80">Work in progress</p>
        </div>
      </div>

      {/* Add Document Form */}
      <div className="mt-8 rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl shadow-black/20">
        <h2 className="text-2xl font-bold text-white">Add Project Document</h2>

        <p className="mt-2 text-sm text-slate-400">
          Add a document record for the selected project. For this frontend MVP,
          the uploaded file name is saved in localStorage.
        </p>

        <form
          onSubmit={handleAddDocument}
          className="mt-6 grid gap-5 md:grid-cols-2"
        >
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-300">
              Document Title
            </label>

            <input
              type="text"
              value={formData.title}
              onChange={(event) => updateField("title", event.target.value)}
              placeholder="Example: First Floor 2D Plan"
              className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-300">
              Owner / Uploaded By
            </label>

            <input
              type="text"
              value={formData.owner}
              onChange={(event) => updateField("owner", event.target.value)}
              placeholder="Example: Architect"
              className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-300">
              Document Category
            </label>

            <select
              value={formData.category}
              onChange={(event) =>
                updateField(
                  "category",
                  event.target.value as DocumentCategory
                )
              }
              className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
            >
              <option>Requirement</option>
              <option>2D Floor Plan</option>
              <option>Interior Design</option>
              <option>Construction</option>
              <option>Contract</option>
              <option>Report</option>
              <option>Approval</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-300">
              Approval Status
            </label>

            <select
              value={formData.status}
              onChange={(event) =>
                updateField("status", event.target.value as DocumentStatus)
              }
              className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
            >
              <option>Draft</option>
              <option>In Review</option>
              <option>Approved</option>
              <option>Rejected</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-semibold text-slate-300">
              Upload File
            </label>

            <input
              type="file"
              onChange={(event) => {
                const file = event.target.files?.[0];
                updateField("fileName", file ? file.name : "");
              }}
              className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-slate-300 outline-none transition file:mr-4 file:rounded-lg file:border-0 file:bg-cyan-400 file:px-3 file:py-2 file:text-sm file:font-bold file:text-slate-950 focus:border-cyan-400"
            />

            <p className="mt-2 text-xs text-slate-500">
              MVP note: this stores only the file name. Real file upload will be
              added later using backend storage.
            </p>
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              className="rounded-xl bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-300"
            >
              Add Document
            </button>
          </div>
        </form>
      </div>

      {/* Document List */}
      <div className="mt-8 rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl shadow-black/20">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white">
            Project Document Library
          </h2>

          <p className="mt-2 text-sm text-slate-400">
            Documents linked to {selectedProject.name}.
          </p>
        </div>

        {selectedProjectDocuments.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/15 bg-slate-950/70 p-8 text-center">
            <p className="text-sm leading-6 text-slate-400">
              No documents added for this project yet.
            </p>
          </div>
        ) : (
          <div className="grid gap-5">
            {selectedProjectDocuments.map((document) => (
              <div
                key={document.id}
                className="rounded-2xl border border-white/10 bg-slate-950/70 p-5 transition hover:border-cyan-400/40"
              >
                <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-start">
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      {document.title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      File: {document.fileName}
                    </p>

                    <p className="mt-1 text-sm leading-6 text-slate-400">
                      Owner: {document.owner} · Added: {document.createdAt}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <span
                      className={`rounded-full border px-4 py-2 text-sm font-semibold ${getCategoryStyle(
                        document.category
                      )}`}
                    >
                      {document.category}
                    </span>

                    <span
                      className={`rounded-full border px-4 py-2 text-sm font-semibold ${getStatusStyle(
                        document.status
                      )}`}
                    >
                      {document.status}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleDeleteDocument(document.id)}
                      className="rounded-full border border-red-400/20 bg-red-400/10 px-4 py-2 text-sm font-semibold text-red-300 transition hover:bg-red-400/20"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Workflow Explanation */}
      <div className="mt-8 rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl shadow-black/20">
        <h2 className="text-2xl font-bold text-white">Document Workflow</h2>

        <p className="mt-2 text-sm text-slate-400">
          This shows how documents move through the architecture workflow.
        </p>

        <div className="mt-6 grid gap-5 md:grid-cols-4">
          <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-5">
            <p className="font-bold text-cyan-300">Draft</p>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Architect or designer prepares the initial document.
            </p>
          </div>

          <div className="rounded-2xl border border-orange-400/20 bg-orange-400/10 p-5">
            <p className="font-bold text-orange-300">In Review</p>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Client or project manager checks the document.
            </p>
          </div>

          <div className="rounded-2xl border border-green-400/20 bg-green-400/10 p-5">
            <p className="font-bold text-green-300">Approved</p>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Document is accepted and ready for project execution.
            </p>
          </div>

          <div className="rounded-2xl border border-red-400/20 bg-red-400/10 p-5">
            <p className="font-bold text-red-300">Rejected</p>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Document needs corrections before approval.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
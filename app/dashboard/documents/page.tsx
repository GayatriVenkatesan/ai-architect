"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import {
  createDocument,
  deleteDocument,
  getDocuments,
  getProjects,
  updateDocument,
} from "../../lib/api";

type DocumentStatus = "Draft" | "In Review" | "Approved" | "Rejected";

type DocumentCategory =
  | "Requirement"
  | "2D Floor Plan"
  | "Interior Design"
  | "Construction"
  | "Contract"
  | "Report"
  | "Approval";

type BackendProject = {
  id: number;
  project_name?: string;
  name?: string;
  client_name?: string;
  client?: string;
  location?: string;
};

type ProjectResponse = {
  total: number;
  projects: BackendProject[];
};

type ProjectDocument = {
  id: number;
  project_name?: string | null;
  document_title?: string | null;
  title?: string | null;
  document_type?: string | null;
  category?: string | null;
  file_name?: string | null;
  file_url?: string | null;
  status?: string | null;
  approval_status?: string | null;
  uploaded_by?: string | null;
  owner?: string | null;
  ai_summary?: string | null;
  created_at?: string | null;
};

type DocumentsResponse = {
  total: number;
  documents: ProjectDocument[];
};

type DocumentFormData = {
  documentTitle: string;
  documentType: DocumentCategory;
  status: DocumentStatus;
  fileName: string;
  fileUrl: string;
  uploadedBy: string;
};

const initialFormData: DocumentFormData = {
  documentTitle: "",
  documentType: "Requirement",
  status: "Draft",
  fileName: "",
  fileUrl: "",
  uploadedBy: "",
};

function getProjectName(project: BackendProject) {
  return project.project_name || project.name || `Project ${project.id}`;
}

function getProjectClient(project: BackendProject) {
  return project.client_name || project.client || "Client";
}

function getDocumentTitle(document: ProjectDocument) {
  return document.document_title || document.title || "Untitled Document";
}

function getDocumentProjectName(document: ProjectDocument) {
  return document.project_name || "Unassigned Project";
}

function getDocumentCategory(document: ProjectDocument) {
  return document.document_type || document.category || "Report";
}

function getDocumentStatus(document: ProjectDocument) {
  return document.status || document.approval_status || "Draft";
}

function getDocumentFileName(document: ProjectDocument) {
  return document.file_name || "No file selected";
}

function getDocumentOwner(document: ProjectDocument) {
  return document.uploaded_by || document.owner || "Project Team";
}

function getDocumentDate(document: ProjectDocument) {
  if (!document.created_at) {
    return "Not available";
  }

  return new Date(document.created_at).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getStatusStyle(status: string) {
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

function getCategoryStyle(category: string) {
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
  const [projects, setProjects] = useState<BackendProject[]>([]);
  const [documents, setDocuments] = useState<ProjectDocument[]>([]);
  const [selectedProjectName, setSelectedProjectName] = useState("");
  const [formData, setFormData] = useState<DocumentFormData>(initialFormData);
  const [editingDocumentId, setEditingDocumentId] = useState<number | null>(
    null
  );
  const [latestDocument, setLatestDocument] =
    useState<ProjectDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const isEditing = editingDocumentId !== null;

  const selectedProjectDocuments = documents.filter(
    (document) => getDocumentProjectName(document) === selectedProjectName
  );

  const approvedCount = selectedProjectDocuments.filter(
    (document) => getDocumentStatus(document) === "Approved"
  ).length;

  const reviewCount = selectedProjectDocuments.filter(
    (document) => getDocumentStatus(document) === "In Review"
  ).length;

  const draftCount = selectedProjectDocuments.filter(
    (document) => getDocumentStatus(document) === "Draft"
  ).length;

  async function loadPageData() {
    try {
      setLoading(true);
      setError("");

      const [projectData, documentData] = await Promise.all([
        getProjects() as Promise<ProjectResponse>,
        getDocuments() as Promise<DocumentsResponse>,
      ]);

      const loadedProjects = projectData.projects || [];
      const loadedDocuments = documentData.documents || [];

      setProjects(loadedProjects);
      setDocuments(loadedDocuments);

      if (!selectedProjectName && loadedProjects.length > 0) {
        setSelectedProjectName(getProjectName(loadedProjects[0]));
      }
    } catch {
      setError("Unable to load documents from backend.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPageData();
  }, []);

  function updateField<K extends keyof DocumentFormData>(
    field: K,
    value: DocumentFormData[K]
  ) {
    setFormData((previousData) => ({
      ...previousData,
      [field]: value,
    }));

    setSuccessMessage("");
  }

  function resetForm() {
    setFormData(initialFormData);
    setEditingDocumentId(null);
    setLatestDocument(null);
    setError("");
    setSuccessMessage("");
  }

  function clearFormAfterSave() {
    setFormData(initialFormData);
    setEditingDocumentId(null);
  }

  function buildDocumentPayload() {
    const title = formData.documentTitle.trim();
    const fileName = formData.fileName.trim() || "No file selected";
    const uploadedBy = formData.uploadedBy.trim() || "Project Team";

    return {
      project_name: selectedProjectName,
      document_title: title,
      title: title,
      document_type: formData.documentType,
      category: formData.documentType,
      file_name: fileName,
      file_url: formData.fileUrl.trim() || null,
      status: formData.status,
      approval_status: formData.status,
      uploaded_by: uploadedBy,
      owner: uploadedBy,
    };
  }

  async function handleSaveDocument(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedProjectName) {
      alert("Please select a project first.");
      return;
    }

    if (!formData.documentTitle.trim()) {
      alert("Please enter document title.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccessMessage("");

      const payload = buildDocumentPayload();

      if (isEditing && editingDocumentId !== null) {
        const updatedDocument = (await updateDocument(
          editingDocumentId,
          payload
        )) as ProjectDocument;

        setLatestDocument(updatedDocument);
        setSuccessMessage("Document updated successfully.");
      } else {
        const createdDocument = (await createDocument(
          payload
        )) as ProjectDocument;

        setLatestDocument(createdDocument);
        setSuccessMessage("Document added successfully.");
      }

      clearFormAfterSave();
      await loadPageData();
    } catch {
      setError("Unable to save document. Check backend is running.");
    } finally {
      setSaving(false);
    }
  }

  function handleEditDocument(document: ProjectDocument) {
    setEditingDocumentId(document.id);
    setLatestDocument(document);
    setSelectedProjectName(getDocumentProjectName(document));
    setError("");
    setSuccessMessage("");

    setFormData({
      documentTitle: getDocumentTitle(document),
      documentType: getDocumentCategory(document) as DocumentCategory,
      status: getDocumentStatus(document) as DocumentStatus,
      fileName: getDocumentFileName(document),
      fileUrl: document.file_url || "",
      uploadedBy: getDocumentOwner(document),
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function handleDeleteDocument(documentId: number) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this document?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      setError("");
      setSuccessMessage("");

      await deleteDocument(documentId);

      if (editingDocumentId === documentId) {
        setEditingDocumentId(null);
        setFormData(initialFormData);
      }

      if (latestDocument?.id === documentId) {
        setLatestDocument(null);
      }

      setSuccessMessage("Document deleted successfully.");
      await loadPageData();
    } catch {
      setError("Unable to delete document. Check backend is running.");
    }
  }

  return (
    <>
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
            floor plans, interior files, contracts, approval files,
            construction reports, and client handover documents.
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

      <div className="rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl shadow-black/20">
        <label className="mb-2 block text-sm font-semibold text-slate-300">
          Select Project
        </label>

        <select
          value={selectedProjectName}
          onChange={(event) => setSelectedProjectName(event.target.value)}
          className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
        >
          {projects.length === 0 ? (
            <option value="">No projects found</option>
          ) : (
            projects.map((project) => {
              const projectName = getProjectName(project);

              return (
                <option key={project.id} value={projectName}>
                  {projectName} - {getProjectClient(project)}
                </option>
              );
            })
          )}
        </select>

        <p className="mt-2 text-xs text-slate-500">
          Projects are loaded from the backend Projects API.
        </p>
      </div>

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

      {latestDocument && (
        <div className="mt-8 rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-6 shadow-2xl shadow-black/20">
          <h2 className="text-2xl font-bold text-white">Latest Document</h2>

          <div className="mt-5 grid gap-5 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
              <p className="text-sm text-slate-400">Title</p>
              <p className="mt-1 font-semibold text-white">
                {getDocumentTitle(latestDocument)}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
              <p className="text-sm text-slate-400">Category</p>
              <p className="mt-1 font-semibold text-white">
                {getDocumentCategory(latestDocument)}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
              <p className="text-sm text-slate-400">Status</p>
              <p className="mt-1 font-semibold text-white">
                {getDocumentStatus(latestDocument)}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8 rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl shadow-black/20">
        <h2 className="text-2xl font-bold text-white">
          {isEditing ? "Edit Document" : "Add Project Document"}
        </h2>

        <p className="mt-2 text-sm text-slate-400">
          This stores document details in FastAPI + SQLite. For now, actual file
          upload is simulated by saving the file name.
        </p>

        <form
          onSubmit={handleSaveDocument}
          className="mt-6 grid gap-5 md:grid-cols-2"
        >
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-300">
              Document Title
            </label>

            <input
              type="text"
              value={formData.documentTitle}
              onChange={(event) =>
                updateField("documentTitle", event.target.value)
              }
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
              value={formData.uploadedBy}
              onChange={(event) =>
                updateField("uploadedBy", event.target.value)
              }
              placeholder="Example: Architect"
              className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-300">
              Document Category
            </label>

            <select
              value={formData.documentType}
              onChange={(event) =>
                updateField(
                  "documentType",
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

          <div>
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
              Current MVP saves only the file name.
            </p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-300">
              Optional File URL
            </label>

            <input
              type="text"
              value={formData.fileUrl}
              onChange={(event) => updateField("fileUrl", event.target.value)}
              placeholder="Optional document link"
              className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400"
            />
          </div>

          <div className="md:col-span-2 flex flex-wrap gap-4">
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving
                ? "Saving..."
                : isEditing
                ? "Update Document"
                : "Add Document"}
            </button>

            <button
              type="button"
              onClick={resetForm}
              className="rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:border-cyan-400 hover:text-cyan-300"
            >
              Clear
            </button>
          </div>
        </form>
      </div>

      <div className="mt-8 rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl shadow-black/20">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white">
            Project Document Library
          </h2>

          <p className="mt-2 text-sm text-slate-400">
            Documents linked to {selectedProjectName || "selected project"}.
          </p>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-6 text-sm text-slate-400">
            Loading documents...
          </div>
        ) : selectedProjectDocuments.length === 0 ? (
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
                      {getDocumentTitle(document)}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      File: {getDocumentFileName(document)}
                    </p>

                    <p className="mt-1 text-sm leading-6 text-slate-400">
                      Owner: {getDocumentOwner(document)} · Added:{" "}
                      {getDocumentDate(document)}
                    </p>

                    {document.ai_summary && (
                      <p className="mt-3 text-sm leading-6 text-slate-300">
                        {document.ai_summary}
                      </p>
                    )}

                    {document.file_url && (
                      <p className="mt-3 break-all text-sm text-cyan-300">
                        URL: {document.file_url}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <span
                      className={`rounded-full border px-4 py-2 text-sm font-semibold ${getCategoryStyle(
                        getDocumentCategory(document)
                      )}`}
                    >
                      {getDocumentCategory(document)}
                    </span>

                    <span
                      className={`rounded-full border px-4 py-2 text-sm font-semibold ${getStatusStyle(
                        getDocumentStatus(document)
                      )}`}
                    >
                      {getDocumentStatus(document)}
                    </span>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => handleEditDocument(document)}
                    className="rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-300 transition hover:bg-cyan-400/20"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteDocument(document.id)}
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
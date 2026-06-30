"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import {
  createConstructionUpdate,
  deleteConstructionUpdate,
  getConstructionUpdates,
  updateConstructionUpdate,
} from "../../lib/api";

type IssueSeverity = "Low" | "Medium" | "High";

type ConstructionFormData = {
  projectName: string;
  siteLocation: string;
  workStage: string;
  progressPercent: string;
  materialStatus: string;
  safetyStatus: string;
  issueSeverity: IssueSeverity;
  issueNotes: string;
  inspectorName: string;
};

type ConstructionUpdate = {
  id: number;
  project_name: string;
  site_location: string;
  work_stage: string;
  progress_percent: number;
  material_status: string;
  safety_status: string;
  issue_severity: IssueSeverity;
  issue_notes: string | null;
  inspector_name: string;
  ai_risk_summary: string | null;
  created_at: string;
};

type ConstructionUpdatesResponse = {
  total: number;
  updates: ConstructionUpdate[];
};

const initialFormData: ConstructionFormData = {
  projectName: "",
  siteLocation: "",
  workStage: "Foundation",
  progressPercent: "",
  materialStatus: "Available",
  safetyStatus: "Safe",
  issueSeverity: "Low",
  issueNotes: "",
  inspectorName: "",
};

function getProgressValue(value: string | number | null | undefined) {
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

function getRiskStyle(risk: IssueSeverity) {
  if (risk === "Low") {
    return "border-green-400/20 bg-green-400/10 text-green-300";
  }

  if (risk === "Medium") {
    return "border-orange-400/20 bg-orange-400/10 text-orange-300";
  }

  return "border-red-400/20 bg-red-400/10 text-red-300";
}

function getSafetyStyle(status: string) {
  const lowerStatus = status.toLowerCase();

  if (lowerStatus.includes("unsafe") || lowerStatus.includes("risk")) {
    return "border-red-400/20 bg-red-400/10 text-red-300";
  }

  if (lowerStatus.includes("review") || lowerStatus.includes("monitor")) {
    return "border-orange-400/20 bg-orange-400/10 text-orange-300";
  }

  return "border-green-400/20 bg-green-400/10 text-green-300";
}

export default function ConstructionPage() {
  const [formData, setFormData] =
    useState<ConstructionFormData>(initialFormData);
  const [updates, setUpdates] = useState<ConstructionUpdate[]>([]);
  const [latestUpdate, setLatestUpdate] = useState<ConstructionUpdate | null>(
    null
  );
  const [editingUpdateId, setEditingUpdateId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const isEditing = editingUpdateId !== null;

  async function loadConstructionUpdates() {
    try {
      setLoading(true);
      setError("");

      const data =
        (await getConstructionUpdates()) as ConstructionUpdatesResponse;

      setUpdates(data.updates || []);
    } catch {
      setError("Unable to load construction updates from backend.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadConstructionUpdates();
  }, []);

  function updateField(field: keyof ConstructionFormData, value: string) {
    setFormData((previousData) => ({
      ...previousData,
      [field]: value,
    }));

    setSuccessMessage("");
  }

  function resetForm() {
    setFormData(initialFormData);
    setEditingUpdateId(null);
    setLatestUpdate(null);
    setError("");
    setSuccessMessage("");
  }

  function clearFormAfterSave() {
    setFormData(initialFormData);
    setEditingUpdateId(null);
  }

  function buildConstructionPayload() {
    return {
      project_name: formData.projectName.trim() || "Untitled Project",
      site_location: formData.siteLocation.trim() || "Not specified",
      work_stage: formData.workStage,
      progress_percent: getProgressValue(formData.progressPercent),
      material_status: formData.materialStatus,
      safety_status: formData.safetyStatus,
      issue_severity: formData.issueSeverity,
      issue_notes:
        formData.issueNotes.trim() || "No major site issue mentioned.",
      inspector_name: formData.inspectorName.trim() || "Site Engineer",
    };
  }

  async function handleSaveConstructionUpdate(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!formData.projectName.trim()) {
      alert("Please enter project name.");
      return;
    }

    if (!formData.progressPercent.trim()) {
      alert("Please enter progress percentage.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccessMessage("");

      const payload = buildConstructionPayload();

      if (isEditing && editingUpdateId !== null) {
        const updatedData = (await updateConstructionUpdate(
          editingUpdateId,
          payload
        )) as ConstructionUpdate;

        setLatestUpdate(updatedData);
        setSuccessMessage("Construction update edited successfully.");
      } else {
        const createdData = (await createConstructionUpdate(
          payload
        )) as ConstructionUpdate;

        setLatestUpdate(createdData);
        setSuccessMessage("Construction update saved successfully.");
      }

      clearFormAfterSave();
      await loadConstructionUpdates();
    } catch {
      setError("Unable to save construction update. Check backend is running.");
    } finally {
      setSaving(false);
    }
  }

  function handleEditUpdate(update: ConstructionUpdate) {
    setEditingUpdateId(update.id);
    setLatestUpdate(update);
    setError("");
    setSuccessMessage("");

    setFormData({
      projectName: update.project_name,
      siteLocation: update.site_location,
      workStage: update.work_stage,
      progressPercent: String(update.progress_percent ?? 0),
      materialStatus: update.material_status,
      safetyStatus: update.safety_status,
      issueSeverity: update.issue_severity,
      issueNotes: update.issue_notes || "",
      inspectorName: update.inspector_name,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function handleDeleteUpdate(updateId: number) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this construction update?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      setError("");
      setSuccessMessage("");

      await deleteConstructionUpdate(updateId);

      if (editingUpdateId === updateId) {
        setEditingUpdateId(null);
        setFormData(initialFormData);
      }

      if (latestUpdate?.id === updateId) {
        setLatestUpdate(null);
      }

      setSuccessMessage("Construction update deleted successfully.");
      await loadConstructionUpdates();
    } catch {
      setError("Unable to delete construction update. Check backend is running.");
    }
  }

  return (
    <>
      <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-start">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.35em] text-cyan-300">
            Construction Monitoring
          </p>

          <h1 className="mt-4 text-4xl font-bold tracking-tight text-white">
            AI Construction Site Monitoring
          </h1>

          <p className="mt-3 max-w-3xl text-base leading-7 text-slate-300">
            Track site progress, construction stage, material availability,
            safety status, issue severity, and backend-generated risk summary.
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

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl shadow-black/20 xl:col-span-2">
          <h2 className="text-2xl font-bold text-white">
            {isEditing ? "Edit Site Update" : "Site Progress Input"}
          </h2>

          <p className="mt-2 text-sm text-slate-400">
            {isEditing
              ? "Update the selected site report. Changes will be saved in backend."
              : "Enter current site details. The update will be saved through FastAPI and SQLite."}
          </p>

          <form onSubmit={handleSaveConstructionUpdate}>
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-300">
                  Project Name
                </label>

                <input
                  type="text"
                  value={formData.projectName}
                  onChange={(event) =>
                    updateField("projectName", event.target.value)
                  }
                  placeholder="Example: Luxury Villa Design"
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-300">
                  Site Location
                </label>

                <input
                  type="text"
                  value={formData.siteLocation}
                  onChange={(event) =>
                    updateField("siteLocation", event.target.value)
                  }
                  placeholder="Example: Chennai, Tamil Nadu"
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-300">
                  Construction Stage
                </label>

                <select
                  value={formData.workStage}
                  onChange={(event) =>
                    updateField("workStage", event.target.value)
                  }
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
                >
                  <option>Foundation</option>
                  <option>Structural Work</option>
                  <option>Brickwork</option>
                  <option>Electrical and Plumbing</option>
                  <option>Interior Finishing</option>
                  <option>Quality Inspection</option>
                  <option>Handover Preparation</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-300">
                  Progress %
                </label>

                <input
                  type="number"
                  value={formData.progressPercent}
                  onChange={(event) =>
                    updateField("progressPercent", event.target.value)
                  }
                  placeholder="Example: 65"
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400"
                />

                <p className="mt-2 text-xs text-slate-500">
                  Value should be between 0 and 100.
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-300">
                  Material Status
                </label>

                <select
                  value={formData.materialStatus}
                  onChange={(event) =>
                    updateField("materialStatus", event.target.value)
                  }
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
                >
                  <option>Available</option>
                  <option>Material delay</option>
                  <option>Shortage</option>
                  <option>Procurement pending</option>
                  <option>Delivered</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-300">
                  Safety Status
                </label>

                <select
                  value={formData.safetyStatus}
                  onChange={(event) =>
                    updateField("safetyStatus", event.target.value)
                  }
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
                >
                  <option>Safe</option>
                  <option>Needs Review</option>
                  <option>Safety risk</option>
                  <option>Unsafe</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-300">
                  Issue Severity
                </label>

                <select
                  value={formData.issueSeverity}
                  onChange={(event) =>
                    updateField(
                      "issueSeverity",
                      event.target.value as IssueSeverity
                    )
                  }
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-300">
                  Inspector Name
                </label>

                <input
                  type="text"
                  value={formData.inspectorName}
                  onChange={(event) =>
                    updateField("inspectorName", event.target.value)
                  }
                  placeholder="Example: Site Engineer Demo"
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400"
                />
              </div>
            </div>

            <div className="mt-5">
              <label className="mb-2 block text-sm font-semibold text-slate-300">
                Site Observation / Issue Notes
              </label>

              <textarea
                rows={6}
                value={formData.issueNotes}
                onChange={(event) =>
                  updateField("issueNotes", event.target.value)
                }
                placeholder="Example: Material delivery was delayed by 4 days. Labour availability was lower than planned this week."
                className="w-full resize-none rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400"
              />
            </div>

            <div className="mt-6 flex flex-wrap gap-4">
              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving
                  ? "Saving..."
                  : isEditing
                  ? "Update Site Report"
                  : "Save Site Update"}
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

        <div className="rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl shadow-black/20">
          <h2 className="text-2xl font-bold text-white">
            AI Monitoring Summary
          </h2>

          <p className="mt-2 text-sm text-slate-400">
            {latestUpdate
              ? "Latest site update generated from backend."
              : "Submit site progress to generate monitoring summary."}
          </p>

          {!latestUpdate ? (
            <div className="mt-6 rounded-2xl border border-dashed border-white/15 bg-slate-950/70 p-6 text-center">
              <p className="text-sm leading-6 text-slate-400">
                No site update generated yet.
              </p>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                <p className="text-sm text-slate-400">Project</p>
                <p className="mt-1 font-semibold text-white">
                  {latestUpdate.project_name}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                <p className="text-sm text-slate-400">Actual Completion</p>
                <p className="mt-1 text-3xl font-bold text-white">
                  {latestUpdate.progress_percent}%
                </p>
              </div>

              <div
                className={`rounded-2xl border p-4 ${getRiskStyle(
                  latestUpdate.issue_severity
                )}`}
              >
                <p className="text-sm font-semibold">Issue Severity</p>
                <p className="mt-1 text-2xl font-bold">
                  {latestUpdate.issue_severity}
                </p>
              </div>

              <div
                className={`rounded-2xl border p-4 ${getSafetyStyle(
                  latestUpdate.safety_status
                )}`}
              >
                <p className="text-sm font-semibold">Safety Status</p>
                <p className="mt-1 text-xl font-bold">
                  {latestUpdate.safety_status}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {latestUpdate && (
        <div className="mt-8 rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl shadow-black/20">
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-white">
              Construction Progress
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              Latest saved progress from backend.
            </p>
          </div>

          <div>
            <div className="mb-2 flex justify-between text-sm">
              <span className="text-slate-400">Site Progress</span>
              <span className="font-semibold text-cyan-300">
                {latestUpdate.progress_percent}%
              </span>
            </div>

            <div className="h-3 rounded-full bg-slate-800">
              <div
                className="h-3 rounded-full bg-cyan-400"
                style={{ width: `${latestUpdate.progress_percent}%` }}
              />
            </div>
          </div>
        </div>
      )}

      <div className="mt-8 rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl shadow-black/20">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white">
            Backend Generated Site Intelligence
          </h2>

          <p className="mt-2 text-sm text-slate-400">
            This risk summary comes from the FastAPI construction monitoring
            logic.
          </p>
        </div>

        {!latestUpdate ? (
          <div className="rounded-2xl border border-dashed border-white/15 bg-slate-950/70 p-6 text-center">
            <p className="text-sm leading-6 text-slate-400">
              Submit construction data to generate risk summary.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-5">
              <h3 className="text-lg font-bold text-cyan-300">
                Site Observation
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-300">
                {latestUpdate.issue_notes}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-5">
              <h3 className="text-lg font-bold text-cyan-300">
                AI Risk Summary
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-300">
                {latestUpdate.ai_risk_summary}
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl shadow-black/20">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white">
            Saved Construction Updates
          </h2>

          <p className="mt-2 text-sm text-slate-400">
            These records are loaded from the backend database.
          </p>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-6 text-sm text-slate-400">
            Loading construction updates...
          </div>
        ) : updates.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/15 bg-slate-950/70 p-6 text-center">
            <p className="text-sm text-slate-400">
              No construction updates saved yet.
            </p>
          </div>
        ) : (
          <div className="grid gap-5">
            {updates.map((update) => (
              <div
                key={update.id}
                className="rounded-2xl border border-white/10 bg-slate-950/70 p-5 transition hover:border-cyan-400/40"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <div className="mb-3 flex flex-wrap gap-3">
                      <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs font-semibold text-cyan-300">
                        {update.work_stage}
                      </span>

                      <span
                        className={`rounded-full border px-4 py-2 text-xs font-semibold ${getRiskStyle(
                          update.issue_severity
                        )}`}
                      >
                        {update.issue_severity} Issue
                      </span>

                      <span
                        className={`rounded-full border px-4 py-2 text-xs font-semibold ${getSafetyStyle(
                          update.safety_status
                        )}`}
                      >
                        {update.safety_status}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-white">
                      {update.project_name}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      Location: {update.site_location} · Inspector:{" "}
                      {update.inspector_name}
                    </p>

                    <p className="mt-3 text-sm leading-6 text-slate-300">
                      {update.ai_risk_summary}
                    </p>
                  </div>

                  <div className="min-w-[160px] rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <p className="text-xs text-slate-500">Progress</p>
                    <p className="mt-1 text-2xl font-bold text-white">
                      {update.progress_percent}%
                    </p>

                    <p className="mt-4 text-xs text-slate-500">ID</p>
                    <p className="mt-1 text-sm font-semibold text-white">
                      {update.id}
                    </p>
                  </div>
                </div>

                <div className="mt-5">
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="text-slate-400">Site Progress</span>
                    <span className="font-semibold text-cyan-300">
                      {update.progress_percent}%
                    </span>
                  </div>

                  <div className="h-2 rounded-full bg-slate-800">
                    <div
                      className="h-2 rounded-full bg-cyan-400"
                      style={{
                        width: `${update.progress_percent}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => handleEditUpdate(update)}
                    className="rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-300 transition hover:bg-cyan-400/20"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteUpdate(update.id)}
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
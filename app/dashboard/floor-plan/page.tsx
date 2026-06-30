"use client";

import { useEffect, useState } from "react";
import {
  createFloorPlan,
  deleteFloorPlan,
  getFloorPlans,
  updateFloorPlan,
} from "../../lib/api";

type FloorPlan = {
  id: number;
  project_name: string;
  client_name: string;
  floor_level: string;
  plan_title: string;
  room_count: number;
  total_area: string;
  plan_status: string;
  design_notes: string;
  ai_summary?: string | null;
  created_at?: string;
};

type FloorPlansResponse = {
  total: number;
  floor_plans: FloorPlan[];
};

type FloorPlanFormData = {
  project_name: string;
  client_name: string;
  floor_level: string;
  plan_title: string;
  room_count: string;
  total_area: string;
  plan_status: string;
  design_notes: string;
  ai_summary: string;
};

const initialFormData: FloorPlanFormData = {
  project_name: "",
  client_name: "",
  floor_level: "",
  plan_title: "",
  room_count: "",
  total_area: "",
  plan_status: "Draft",
  design_notes: "",
  ai_summary: "",
};

export default function FloorPlanPage() {
  const [floorPlans, setFloorPlans] = useState<FloorPlan[]>([]);
  const [formData, setFormData] = useState<FloorPlanFormData>(initialFormData);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function loadFloorPlans() {
    try {
      setLoading(true);
      setError("");

      const response = (await getFloorPlans()) as FloorPlansResponse;

      setFloorPlans(response.floor_plans || []);
    } catch (err) {
      console.error(err);
      setError("Unable to load floor plans. Please check backend connection.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadFloorPlans();
  }, []);

  function handleChange(
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (
      !formData.project_name ||
      !formData.client_name ||
      !formData.floor_level ||
      !formData.plan_title ||
      !formData.room_count ||
      !formData.total_area ||
      !formData.design_notes
    ) {
      setError("Please fill all required fields before saving.");
      return;
    }

    const payload = {
      project_name: formData.project_name,
      client_name: formData.client_name,
      floor_level: formData.floor_level,
      plan_title: formData.plan_title,
      room_count: Number(formData.room_count),
      total_area: formData.total_area,
      plan_status: formData.plan_status,
      design_notes: formData.design_notes,
      ai_summary: formData.ai_summary,
    };

    try {
      setSaving(true);
      setError("");

      if (editingId) {
        await updateFloorPlan(editingId, payload);
      } else {
        await createFloorPlan(payload);
      }

      setFormData(initialFormData);
      setEditingId(null);
      await loadFloorPlans();
    } catch (err) {
      console.error(err);
      setError("Unable to save floor plan. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  function handleEdit(floorPlan: FloorPlan) {
    setEditingId(floorPlan.id);

    setFormData({
      project_name: floorPlan.project_name,
      client_name: floorPlan.client_name,
      floor_level: floorPlan.floor_level,
      plan_title: floorPlan.plan_title,
      room_count: String(floorPlan.room_count),
      total_area: floorPlan.total_area,
      plan_status: floorPlan.plan_status,
      design_notes: floorPlan.design_notes,
      ai_summary: floorPlan.ai_summary || "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function handleDelete(floorPlanId: number) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this floor plan?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      setError("");
      await deleteFloorPlan(floorPlanId);
      await loadFloorPlans();
    } catch (err) {
      console.error(err);
      setError("Unable to delete floor plan. Please try again.");
    }
  }

  function handleCancelEdit() {
    setEditingId(null);
    setFormData(initialFormData);
    setError("");
  }

  function getStatusStyle(status: string) {
    const normalizedStatus = status.toLowerCase();

    if (normalizedStatus.includes("approved")) {
      return "border-emerald-500/30 bg-emerald-500/10 text-emerald-300";
    }

    if (normalizedStatus.includes("review")) {
      return "border-amber-500/30 bg-amber-500/10 text-amber-300";
    }

    if (normalizedStatus.includes("revision")) {
      return "border-orange-500/30 bg-orange-500/10 text-orange-300";
    }

    return "border-slate-500/30 bg-slate-500/10 text-slate-300";
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-7xl space-y-8 px-6 py-8">
        <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl shadow-black/20">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.25em] text-cyan-400">
                Design Intelligence
              </p>
              <h1 className="mt-3 text-3xl font-bold tracking-tight text-white">
                2D Floor Plan Management
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">
                Create, review, and manage architectural floor plan records for
                client projects. This module stores plan details, room count,
                area, design notes, and AI-generated planning summaries.
              </p>
            </div>

            <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/10 px-5 py-4 text-right">
              <p className="text-sm text-cyan-200">Saved Floor Plans</p>
              <p className="mt-1 text-3xl font-bold text-white">
                {floorPlans.length}
              </p>
            </div>
          </div>
        </section>

        {error && (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-sm text-red-200">
            {error}
          </div>
        )}

        <section className="grid gap-8 xl:grid-cols-[420px_1fr]">
          <form
            onSubmit={handleSubmit}
            className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl shadow-black/20"
          >
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-white">
                {editingId ? "Update Floor Plan" : "Add New Floor Plan"}
              </h2>
              <p className="mt-2 text-sm text-slate-400">
                Fill the floor plan details and save it to the backend database.
              </p>
            </div>

            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Project Name
                </label>
                <input
                  name="project_name"
                  value={formData.project_name}
                  onChange={handleChange}
                  placeholder="Urban Nest Co-Living Hub"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Client Name
                </label>
                <input
                  name="client_name"
                  value={formData.client_name}
                  onChange={handleChange}
                  placeholder="NestSpace Developers"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Floor Level
                  </label>
                  <input
                    name="floor_level"
                    value={formData.floor_level}
                    onChange={handleChange}
                    placeholder="Ground Floor"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Room Count
                  </label>
                  <input
                    name="room_count"
                    type="number"
                    value={formData.room_count}
                    onChange={handleChange}
                    placeholder="8"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Plan Title
                </label>
                <input
                  name="plan_title"
                  value={formData.plan_title}
                  onChange={handleChange}
                  placeholder="Ground Floor Shared Living Layout"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Total Area
                  </label>
                  <input
                    name="total_area"
                    value={formData.total_area}
                    onChange={handleChange}
                    placeholder="4200 sq.ft"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Plan Status
                  </label>
                  <select
                    name="plan_status"
                    value={formData.plan_status}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400"
                  >
                    <option>Draft</option>
                    <option>In Review</option>
                    <option>Approved</option>
                    <option>Needs Revision</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Design Notes
                </label>
                <textarea
                  name="design_notes"
                  value={formData.design_notes}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Describe the rooms, zoning, circulation, ventilation, and design decisions."
                  className="w-full resize-none rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  AI Summary
                </label>
                <textarea
                  name="ai_summary"
                  value={formData.ai_summary}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Add AI planning summary or improvement suggestions."
                  className="w-full resize-none rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 rounded-xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving
                    ? "Saving..."
                    : editingId
                    ? "Update Floor Plan"
                    : "Save Floor Plan"}
                </button>

                {editingId && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="rounded-xl border border-slate-700 px-5 py-3 text-sm font-semibold text-slate-300 transition hover:border-slate-500 hover:text-white"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </form>

          <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl shadow-black/20">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-white">
                  Saved Floor Plans
                </h2>
                <p className="mt-2 text-sm text-slate-400">
                  Floor plans loaded directly from your FastAPI backend.
                </p>
              </div>
            </div>

            {loading ? (
              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-8 text-center text-sm text-slate-400">
                Loading floor plans...
              </div>
            ) : floorPlans.length === 0 ? (
              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-8 text-center">
                <h3 className="text-lg font-semibold text-white">
                  No floor plans yet
                </h3>
                <p className="mt-2 text-sm text-slate-400">
                  Add your first 2D floor plan using the form.
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                {floorPlans.map((floorPlan) => (
                  <article
                    key={floorPlan.id}
                    className="rounded-2xl border border-slate-800 bg-slate-950 p-5 transition hover:border-cyan-500/40"
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className="text-lg font-semibold text-white">
                            {floorPlan.plan_title}
                          </h3>
                          <span
                            className={`rounded-full border px-3 py-1 text-xs font-medium ${getStatusStyle(
                              floorPlan.plan_status
                            )}`}
                          >
                            {floorPlan.plan_status}
                          </span>
                        </div>

                        <p className="mt-2 text-sm text-slate-400">
                          {floorPlan.project_name} • {floorPlan.client_name}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(floorPlan)}
                          className="rounded-lg border border-slate-700 px-4 py-2 text-xs font-semibold text-slate-300 transition hover:border-cyan-400 hover:text-cyan-300"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(floorPlan.id)}
                          className="rounded-lg border border-red-500/30 px-4 py-2 text-xs font-semibold text-red-300 transition hover:border-red-400 hover:text-red-200"
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                    <div className="mt-5 grid gap-4 md:grid-cols-3">
                      <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                          Floor Level
                        </p>
                        <p className="mt-2 text-sm font-semibold text-white">
                          {floorPlan.floor_level}
                        </p>
                      </div>

                      <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                          Rooms
                        </p>
                        <p className="mt-2 text-sm font-semibold text-white">
                          {floorPlan.room_count}
                        </p>
                      </div>

                      <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                          Total Area
                        </p>
                        <p className="mt-2 text-sm font-semibold text-white">
                          {floorPlan.total_area}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 space-y-4">
                      <div>
                        <h4 className="text-sm font-semibold text-slate-200">
                          Design Notes
                        </h4>
                        <p className="mt-2 text-sm leading-6 text-slate-400">
                          {floorPlan.design_notes}
                        </p>
                      </div>

                      {floorPlan.ai_summary && (
                        <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/10 p-4">
                          <h4 className="text-sm font-semibold text-cyan-200">
                            AI Planning Summary
                          </h4>
                          <p className="mt-2 text-sm leading-6 text-cyan-50/80">
                            {floorPlan.ai_summary}
                          </p>
                        </div>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </section>
      </div>
    </main>
  );
}
"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import {
  createInteriorDesign,
  deleteInteriorDesign,
  getInteriorDesigns,
  updateInteriorDesign,
} from "../../lib/api";

type InteriorFormData = {
  projectName: string;
  roomType: string;
  designStyle: string;
  colorPalette: string;
  materialPreferences: string;
  budgetRange: string;
  walkthroughUrl: string;
};

type InteriorDesign = {
  id: number;
  project_name: string;
  room_type: string;
  design_style: string;
  color_palette: string;
  material_preferences: string | null;
  budget_range: string;
  walkthrough_url: string | null;
  ai_suggestions: string | null;
  created_at: string;
};

type InteriorDesignsResponse = {
  total: number;
  designs: InteriorDesign[];
};

const initialFormData: InteriorFormData = {
  projectName: "",
  roomType: "Living Room",
  designStyle: "Modern",
  colorPalette: "Neutral",
  materialPreferences: "",
  budgetRange: "",
  walkthroughUrl: "",
};

function getDesignStyleTag(style: string) {
  const lowerStyle = style.toLowerCase();

  if (lowerStyle.includes("luxury")) {
    return "border-amber-400/20 bg-amber-400/10 text-amber-300";
  }

  if (lowerStyle.includes("eco")) {
    return "border-green-400/20 bg-green-400/10 text-green-300";
  }

  if (lowerStyle.includes("traditional")) {
    return "border-orange-400/20 bg-orange-400/10 text-orange-300";
  }

  return "border-cyan-400/20 bg-cyan-400/10 text-cyan-300";
}

export default function InteriorPage() {
  const [formData, setFormData] = useState<InteriorFormData>(initialFormData);
  const [designs, setDesigns] = useState<InteriorDesign[]>([]);
  const [latestDesign, setLatestDesign] = useState<InteriorDesign | null>(null);
  const [editingDesignId, setEditingDesignId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const isEditing = editingDesignId !== null;

  async function loadInteriorDesigns() {
    try {
      setLoading(true);
      setError("");

      const data = (await getInteriorDesigns()) as InteriorDesignsResponse;
      setDesigns(data.designs || []);
    } catch {
      setError("Unable to load interior designs from backend.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadInteriorDesigns();
  }, []);

  function updateField(field: keyof InteriorFormData, value: string) {
    setFormData((previousData) => ({
      ...previousData,
      [field]: value,
    }));

    setSuccessMessage("");
  }

  function resetForm() {
    setFormData(initialFormData);
    setEditingDesignId(null);
    setLatestDesign(null);
    setError("");
    setSuccessMessage("");
  }

  function clearFormAfterSave() {
    setFormData(initialFormData);
    setEditingDesignId(null);
  }

  function buildDesignPayload() {
    return {
      project_name: formData.projectName.trim() || "Untitled Project",
      room_type: formData.roomType,
      design_style: formData.designStyle,
      color_palette: formData.colorPalette,
      material_preferences:
        formData.materialPreferences.trim() ||
        "No specific material preference",
      budget_range: formData.budgetRange.trim() || "Not specified",
      walkthrough_url: formData.walkthroughUrl.trim() || null,
    };
  }

  async function handleGeneratePlan(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!formData.projectName.trim()) {
      alert("Please enter project name.");
      return;
    }

    if (!formData.budgetRange.trim()) {
      alert("Please enter budget range.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccessMessage("");

      const payload = buildDesignPayload();

      if (isEditing && editingDesignId !== null) {
        const updatedDesign = (await updateInteriorDesign(
          editingDesignId,
          payload
        )) as InteriorDesign;

        setLatestDesign(updatedDesign);
        setSuccessMessage("Interior design updated successfully.");
      } else {
        const createdDesign = (await createInteriorDesign(
          payload
        )) as InteriorDesign;

        setLatestDesign(createdDesign);
        setSuccessMessage("Interior design generated and saved successfully.");
      }

      clearFormAfterSave();
      await loadInteriorDesigns();
    } catch {
      setError("Unable to save interior design. Check backend is running.");
    } finally {
      setSaving(false);
    }
  }

  function handleEditDesign(design: InteriorDesign) {
    setEditingDesignId(design.id);
    setLatestDesign(design);
    setError("");
    setSuccessMessage("");

    setFormData({
      projectName: design.project_name,
      roomType: design.room_type,
      designStyle: design.design_style,
      colorPalette: design.color_palette,
      materialPreferences: design.material_preferences || "",
      budgetRange: design.budget_range,
      walkthroughUrl: design.walkthrough_url || "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function handleDeleteDesign(designId: number) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this interior design?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      setError("");
      setSuccessMessage("");

      await deleteInteriorDesign(designId);

      if (editingDesignId === designId) {
        setEditingDesignId(null);
        setFormData(initialFormData);
      }

      if (latestDesign?.id === designId) {
        setLatestDesign(null);
      }

      setSuccessMessage("Interior design deleted successfully.");
      await loadInteriorDesigns();
    } catch {
      setError("Unable to delete interior design. Check backend is running.");
    }
  }

  return (
    <>
      <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-start">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.35em] text-cyan-300">
            Interior Design
          </p>

          <h1 className="mt-4 text-4xl font-bold tracking-tight text-white">
            AI Interior Design Automation
          </h1>

          <p className="mt-3 max-w-3xl text-base leading-7 text-slate-300">
            Generate room-wise interior concepts and save them through FastAPI
            and SQLite. Each design includes backend-generated AI suggestions.
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
            {isEditing ? "Edit Interior Design" : "Customer Interior Requirement"}
          </h2>

          <p className="mt-2 text-sm text-slate-400">
            {isEditing
              ? "Update the selected design. Changes will be saved in backend."
              : "Enter customer preferences. Backend will generate AI interior suggestions."}
          </p>

          <form onSubmit={handleGeneratePlan}>
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
                  Room Type
                </label>

                <select
                  value={formData.roomType}
                  onChange={(event) =>
                    updateField("roomType", event.target.value)
                  }
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
                >
                  <option>Living Room</option>
                  <option>Bedroom</option>
                  <option>Kitchen</option>
                  <option>Bathroom</option>
                  <option>Workspace</option>
                  <option>Dining Room</option>
                  <option>Lobby</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-300">
                  Design Style
                </label>

                <select
                  value={formData.designStyle}
                  onChange={(event) =>
                    updateField("designStyle", event.target.value)
                  }
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
                >
                  <option>Modern</option>
                  <option>Luxury Contemporary</option>
                  <option>Eco-Friendly</option>
                  <option>Traditional</option>
                  <option>Industrial</option>
                  <option>Minimal</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-300">
                  Color Palette
                </label>

                <select
                  value={formData.colorPalette}
                  onChange={(event) =>
                    updateField("colorPalette", event.target.value)
                  }
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
                >
                  <option>Neutral</option>
                  <option>Warm Beige</option>
                  <option>Dark Luxury</option>
                  <option>Pastel</option>
                  <option>Earthy</option>
                  <option>Monochrome</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-300">
                  Budget Range
                </label>

                <input
                  type="text"
                  value={formData.budgetRange}
                  onChange={(event) =>
                    updateField("budgetRange", event.target.value)
                  }
                  placeholder="Example: ₹4L - ₹6L"
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-300">
                  Walkthrough URL
                </label>

                <input
                  type="text"
                  value={formData.walkthroughUrl}
                  onChange={(event) =>
                    updateField("walkthroughUrl", event.target.value)
                  }
                  placeholder="Optional 3D/VR walkthrough link"
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400"
                />
              </div>
            </div>

            <div className="mt-5">
              <label className="mb-2 block text-sm font-semibold text-slate-300">
                Material Preferences / Special Needs
              </label>

              <textarea
                rows={7}
                value={formData.materialPreferences}
                onChange={(event) =>
                  updateField("materialPreferences", event.target.value)
                }
                placeholder="Example: Need more storage, warm lighting, eco-friendly materials, compact furniture."
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
                  ? "Update Interior Design"
                  : "Generate Interior Plan"}
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
          <h2 className="text-2xl font-bold text-white">Generated Summary</h2>

          <p className="mt-2 text-sm text-slate-400">
            {latestDesign
              ? "Latest interior design generated from backend."
              : "Submit the form to generate interior suggestions."}
          </p>

          {!latestDesign ? (
            <div className="mt-6 rounded-2xl border border-dashed border-white/15 bg-slate-950/70 p-6 text-center">
              <p className="text-sm leading-6 text-slate-400">
                No interior plan generated yet.
              </p>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                <p className="text-sm text-slate-400">Project</p>
                <p className="mt-1 font-semibold text-white">
                  {latestDesign.project_name}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                <p className="text-sm text-slate-400">Room</p>
                <p className="mt-1 font-semibold text-white">
                  {latestDesign.room_type}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                <p className="text-sm text-slate-400">Style</p>
                <p className="mt-1 font-semibold text-white">
                  {latestDesign.design_style}
                </p>
              </div>

              <div className="rounded-2xl border border-green-400/20 bg-green-400/10 p-4">
                <p className="text-sm font-semibold text-green-300">
                  Budget Range
                </p>
                <p className="mt-1 text-lg font-bold text-white">
                  {latestDesign.budget_range}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl shadow-black/20">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white">
            Backend Generated Interior Suggestions
          </h2>

          <p className="mt-2 text-sm text-slate-400">
            These suggestions come from the FastAPI interior design logic.
          </p>
        </div>

        {!latestDesign ? (
          <div className="rounded-2xl border border-dashed border-white/15 bg-slate-950/70 p-6 text-center">
            <p className="text-sm leading-6 text-slate-400">
              Submit an interior requirement to generate design suggestions.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 xl:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-5">
              <h3 className="text-lg font-bold text-cyan-300">
                Color Palette
              </h3>

              <p className="mt-4 text-sm leading-6 text-slate-300">
                {latestDesign.color_palette}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-5">
              <h3 className="text-lg font-bold text-cyan-300">
                Material Preferences
              </h3>

              <p className="mt-4 text-sm leading-6 text-slate-300">
                {latestDesign.material_preferences}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-5 xl:col-span-2">
              <h3 className="text-lg font-bold text-cyan-300">
                AI Design Suggestions
              </h3>

              <p className="mt-4 text-sm leading-6 text-slate-300">
                {latestDesign.ai_suggestions}
              </p>
            </div>

            {latestDesign.walkthrough_url && (
              <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-5 xl:col-span-2">
                <h3 className="text-lg font-bold text-cyan-300">
                  Walkthrough URL
                </h3>

                <p className="mt-4 break-all text-sm leading-6 text-slate-300">
                  {latestDesign.walkthrough_url}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-8 rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl shadow-black/20">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white">
            Saved Interior Designs
          </h2>

          <p className="mt-2 text-sm text-slate-400">
            These records are loaded from the backend database.
          </p>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-6 text-sm text-slate-400">
            Loading interior designs...
          </div>
        ) : designs.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/15 bg-slate-950/70 p-6 text-center">
            <p className="text-sm text-slate-400">
              No interior designs saved yet.
            </p>
          </div>
        ) : (
          <div className="grid gap-5">
            {designs.map((design) => (
              <div
                key={design.id}
                className="rounded-2xl border border-white/10 bg-slate-950/70 p-5 transition hover:border-cyan-400/40"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <div className="mb-3 flex flex-wrap gap-3">
                      <span
                        className={`rounded-full border px-4 py-2 text-xs font-semibold ${getDesignStyleTag(
                          design.design_style
                        )}`}
                      >
                        {design.design_style}
                      </span>

                      <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-slate-300">
                        {design.room_type}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-white">
                      {design.project_name}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      Palette: {design.color_palette} · Budget:{" "}
                      {design.budget_range}
                    </p>

                    <p className="mt-3 text-sm leading-6 text-slate-300">
                      {design.ai_suggestions}
                    </p>

                    {design.walkthrough_url && (
                      <p className="mt-3 break-all text-sm text-cyan-300">
                        Walkthrough: {design.walkthrough_url}
                      </p>
                    )}
                  </div>

                  <p className="text-xs text-slate-500">ID: {design.id}</p>
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => handleEditDesign(design)}
                    className="rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-300 transition hover:bg-cyan-400/20"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteDesign(design.id)}
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
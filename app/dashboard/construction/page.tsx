"use client";

import { useState } from "react";

type ConstructionFormData = {
  projectName: string;
  location: string;
  stage: string;
  plannedProgress: string;
  actualProgress: string;
  delayReason: string;
  safetyNotes: string;
  uploadedFileName: string;
};

type SiteReport = {
  title: string;
  description: string;
};

const initialFormData: ConstructionFormData = {
  projectName: "",
  location: "",
  stage: "Foundation Work",
  plannedProgress: "",
  actualProgress: "",
  delayReason: "",
  safetyNotes: "",
  uploadedFileName: "",
};

function getProgressNumber(value: string) {
  const numberValue = Number(value);

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

function calculateDelayRisk(planned: string, actual: string) {
  const plannedProgress = getProgressNumber(planned);
  const actualProgress = getProgressNumber(actual);
  const gap = plannedProgress - actualProgress;

  if (gap >= 20) {
    return "High";
  }

  if (gap >= 10) {
    return "Medium";
  }

  return "Low";
}

function getRiskStyle(risk: string) {
  if (risk === "Low") {
    return "border-green-400/20 bg-green-400/10 text-green-300";
  }

  if (risk === "Medium") {
    return "border-orange-400/20 bg-orange-400/10 text-orange-300";
  }

  return "border-red-400/20 bg-red-400/10 text-red-300";
}

function generateSiteReports(formData: ConstructionFormData): SiteReport[] {
  const planned = getProgressNumber(formData.plannedProgress);
  const actual = getProgressNumber(formData.actualProgress);
  const gap = planned - actual;
  const risk = calculateDelayRisk(formData.plannedProgress, formData.actualProgress);

  return [
    {
      title: "Progress Summary",
      description: `${formData.projectName || "The project"} is currently in the ${
        formData.stage
      } stage. Planned progress is ${planned}%, while actual site progress is ${actual}%.`,
    },
    {
      title: "Delay Prediction",
      description:
        gap > 0
          ? `The project is behind schedule by ${gap}%. Current delay risk is ${risk}. The team should review workforce availability, material supply, and approval timelines.`
          : `The project is on track or ahead of schedule. Current delay risk is ${risk}.`,
    },
    {
      title: "Site Observation",
      description:
        formData.delayReason.trim().length > 0
          ? formData.delayReason
          : "No major delay reason has been entered yet.",
    },
    {
      title: "Safety Review",
      description:
        formData.safetyNotes.trim().length > 0
          ? formData.safetyNotes
          : "No safety notes have been entered yet. Site supervisor should add safety observations regularly.",
    },
  ];
}

export default function ConstructionPage() {
  const [formData, setFormData] =
    useState<ConstructionFormData>(initialFormData);
  const [isAnalyzed, setIsAnalyzed] = useState(false);

  const plannedProgress = getProgressNumber(formData.plannedProgress);
  const actualProgress = getProgressNumber(formData.actualProgress);
  const delayGap = plannedProgress - actualProgress;
  const delayRisk = calculateDelayRisk(
    formData.plannedProgress,
    formData.actualProgress
  );
  const siteReports = generateSiteReports(formData);

  function updateField(field: keyof ConstructionFormData, value: string) {
    setFormData((previousData) => ({
      ...previousData,
      [field]: value,
    }));

    setIsAnalyzed(false);
  }

  function handleAnalyzeSiteProgress() {
    setIsAnalyzed(true);
  }

  return (
    <>
      {/* Page Header */}
      <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-start">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.35em] text-cyan-300">
            Construction Monitoring
          </p>

          <h1 className="mt-4 text-4xl font-bold tracking-tight text-white">
            AI Construction Site Monitoring
          </h1>

          <p className="mt-3 max-w-3xl text-base leading-7 text-slate-300">
            Track site progress, compare planned vs actual completion, identify
            delay risks, record safety notes, and generate weekly construction
            intelligence reports.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAnalyzeSiteProgress}
          className="rounded-xl bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-300"
        >
          Analyze Site Progress
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid gap-6 xl:grid-cols-3">
        {/* Input Form */}
        <div className="rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl shadow-black/20 xl:col-span-2">
          <h2 className="text-2xl font-bold text-white">
            Site Progress Input
          </h2>

          <p className="mt-2 text-sm text-slate-400">
            Enter current construction details. The AI-style report will be
            generated from these values.
          </p>

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
                value={formData.location}
                onChange={(event) => updateField("location", event.target.value)}
                placeholder="Example: Chennai"
                className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-300">
                Construction Stage
              </label>

              <select
                value={formData.stage}
                onChange={(event) => updateField("stage", event.target.value)}
                className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
              >
                <option>Foundation Work</option>
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
                Upload Site Photo
              </label>

              <input
                type="file"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  updateField("uploadedFileName", file ? file.name : "");
                }}
                className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-slate-300 outline-none transition file:mr-4 file:rounded-lg file:border-0 file:bg-cyan-400 file:px-3 file:py-2 file:text-sm file:font-bold file:text-slate-950 focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-300">
                Planned Progress %
              </label>

              <input
                type="number"
                value={formData.plannedProgress}
                onChange={(event) =>
                  updateField("plannedProgress", event.target.value)
                }
                placeholder="Example: 80"
                className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-300">
                Actual Progress %
              </label>

              <input
                type="number"
                value={formData.actualProgress}
                onChange={(event) =>
                  updateField("actualProgress", event.target.value)
                }
                placeholder="Example: 65"
                className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400"
              />
            </div>
          </div>

          <div className="mt-5">
            <label className="mb-2 block text-sm font-semibold text-slate-300">
              Delay / Site Observation Notes
            </label>

            <textarea
              rows={5}
              value={formData.delayReason}
              onChange={(event) =>
                updateField("delayReason", event.target.value)
              }
              placeholder="Example: Material delivery was delayed by 4 days. Labour availability was lower than planned this week."
              className="w-full resize-none rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400"
            />
          </div>

          <div className="mt-5">
            <label className="mb-2 block text-sm font-semibold text-slate-300">
              Safety Notes
            </label>

            <textarea
              rows={4}
              value={formData.safetyNotes}
              onChange={(event) =>
                updateField("safetyNotes", event.target.value)
              }
              placeholder="Example: Site access is clear. Workers are using safety equipment. Material stacking needs better organization."
              className="w-full resize-none rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400"
            />
          </div>

          <div className="mt-6 flex flex-wrap gap-4">
            <button
              type="button"
              onClick={handleAnalyzeSiteProgress}
              className="rounded-xl bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-300"
            >
              Analyze Site Progress
            </button>

            <button
              type="button"
              className="rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:border-cyan-400 hover:text-cyan-300"
            >
              Save Site Update
            </button>
          </div>
        </div>

        {/* AI Monitoring Summary */}
        <div className="rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl shadow-black/20">
          <h2 className="text-2xl font-bold text-white">
            AI Monitoring Summary
          </h2>

          <p className="mt-2 text-sm text-slate-400">
            {isAnalyzed
              ? "Generated from current site progress input."
              : "Fill the form and click Analyze Site Progress."}
          </p>

          {!isAnalyzed ? (
            <div className="mt-6 rounded-2xl border border-dashed border-white/15 bg-slate-950/70 p-6 text-center">
              <p className="text-sm leading-6 text-slate-400">
                No site analysis generated yet.
              </p>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                <p className="text-sm text-slate-400">Actual Completion</p>
                <p className="mt-1 text-3xl font-bold text-white">
                  {actualProgress}%
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                <p className="text-sm text-slate-400">Progress Gap</p>
                <p className="mt-1 text-2xl font-bold text-white">
                  {delayGap > 0 ? `${delayGap}% Behind` : "On Track"}
                </p>
              </div>

              <div
                className={`rounded-2xl border p-4 ${getRiskStyle(delayRisk)}`}
              >
                <p className="text-sm font-semibold">Delay Risk</p>
                <p className="mt-1 text-2xl font-bold">{delayRisk}</p>
              </div>

              <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4">
                <p className="text-sm font-semibold text-cyan-300">
                  Uploaded File
                </p>
                <p className="mt-1 text-sm text-slate-300">
                  {formData.uploadedFileName || "No file uploaded"}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      {isAnalyzed && (
        <div className="mt-8 rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl shadow-black/20">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">
                Construction Progress Comparison
              </h2>

              <p className="mt-2 text-sm text-slate-400">
                Planned vs actual site progress.
              </p>
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <div className="mb-2 flex justify-between text-sm">
                <span className="text-slate-400">Planned Progress</span>
                <span className="font-semibold text-cyan-300">
                  {plannedProgress}%
                </span>
              </div>

              <div className="h-3 rounded-full bg-slate-800">
                <div
                  className="h-3 rounded-full bg-cyan-400"
                  style={{ width: `${plannedProgress}%` }}
                />
              </div>
            </div>

            <div>
              <div className="mb-2 flex justify-between text-sm">
                <span className="text-slate-400">Actual Progress</span>
                <span className="font-semibold text-orange-300">
                  {actualProgress}%
                </span>
              </div>

              <div className="h-3 rounded-full bg-slate-800">
                <div
                  className="h-3 rounded-full bg-orange-400"
                  style={{ width: `${actualProgress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Reports */}
      <div className="mt-8 rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl shadow-black/20">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white">
            Weekly Site Intelligence Report
          </h2>

          <p className="mt-2 text-sm text-slate-400">
            {isAnalyzed
              ? "Report generated from the current construction progress input."
              : "Reports will appear after site progress analysis."}
          </p>
        </div>

        {!isAnalyzed ? (
          <div className="rounded-2xl border border-dashed border-white/15 bg-slate-950/70 p-6 text-center">
            <p className="text-sm leading-6 text-slate-400">
              Enter construction data and click Analyze Site Progress to
              generate site reports.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {siteReports.map((report) => (
              <div
                key={report.title}
                className="rounded-2xl border border-white/10 bg-slate-950/70 p-5 transition hover:border-cyan-400/40"
              >
                <h3 className="text-lg font-bold text-cyan-300">
                  {report.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-300">
                  {report.description}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
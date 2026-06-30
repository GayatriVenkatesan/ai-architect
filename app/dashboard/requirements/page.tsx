"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import {
  createRequirementAnalysis,
  getRequirements,
} from "../../lib/api";

type FormData = {
  clientName: string;
  projectType: string;
  plotSize: string;
  budgetRange: string;
  floors: string;
  style: string;
  description: string;
};

type RequirementAnalysis = {
  id: number;
  client_name: string;
  project_type: string;
  requirement_text: string;
  estimated_budget: number;
  estimated_timeline: string;
  priority_level: string;
  ai_summary: string | null;
  key_requirements: string | null;
  risk_notes: string | null;
  created_at: string;
};

type RequirementsResponse = {
  total: number;
  requirements: RequirementAnalysis[];
};

type ExtractedRequirement = {
  label: string;
  value: string;
};

const initialFormData: FormData = {
  clientName: "",
  projectType: "Residential Villa",
  plotSize: "",
  budgetRange: "",
  floors: "Ground Floor Only",
  style: "Modern Minimal",
  description: "",
};

function formatBudget(value: string | number | null | undefined) {
  const numericValue = Number(value);

  if (typeof value === "number" && !Number.isNaN(numericValue)) {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(numericValue);
  }

  const trimmedValue = String(value ?? "").trim();

  if (!trimmedValue) {
    return "Not provided";
  }

  const lowerValue = trimmedValue.toLowerCase();

  if (
    trimmedValue.includes("₹") ||
    lowerValue.includes("l") ||
    lowerValue.includes("cr")
  ) {
    return trimmedValue;
  }

  return `₹${trimmedValue}L`;
}

function parseBudgetToNumber(value: string) {
  const lowerValue = value.toLowerCase().replace(/,/g, "");
  const numberMatch = lowerValue.match(/(\d+(\.\d+)?)/);

  if (!numberMatch) {
    return 0;
  }

  const amount = Number(numberMatch[1]);

  if (Number.isNaN(amount)) {
    return 0;
  }

  if (lowerValue.includes("cr")) {
    return Math.round(amount * 10000000);
  }

  if (lowerValue.includes("l") || lowerValue.includes("lakh")) {
    return Math.round(amount * 100000);
  }

  if (amount < 10000) {
    return Math.round(amount * 100000);
  }

  return Math.round(amount);
}

function buildRequirementText(formData: FormData) {
  return `
Client Requirement Details:
Client Name: ${formData.clientName || "Not provided"}
Project Type: ${formData.projectType}
Plot Size: ${formData.plotSize || "Not provided"}
Budget Range: ${formatBudget(formData.budgetRange)}
Floors: ${formData.floors}
Architectural Style: ${formData.style}
Requirement Description: ${formData.description}
`.trim();
}

function getPriorityStyle(priority: string) {
  if (priority === "High") {
    return "border-red-400/30 bg-red-400/10 text-red-200";
  }

  if (priority === "Medium") {
    return "border-amber-400/30 bg-amber-400/10 text-amber-200";
  }

  return "border-emerald-400/30 bg-emerald-400/10 text-emerald-200";
}

function generateExtractedDetails(
  formData: FormData,
  analysis: RequirementAnalysis | null
): ExtractedRequirement[] {
  return [
    {
      label: "Client Name",
      value: analysis?.client_name || formData.clientName || "Not provided",
    },
    {
      label: "Project Type",
      value: analysis?.project_type || formData.projectType,
    },
    {
      label: "Plot Size",
      value: formData.plotSize || "Not provided",
    },
    {
      label: "Budget Range",
      value: formatBudget(analysis?.estimated_budget || formData.budgetRange),
    },
    {
      label: "Timeline / Floors",
      value: analysis?.estimated_timeline || formData.floors,
    },
    {
      label: "Architectural Style",
      value: formData.style,
    },
    {
      label: "AI Priority Level",
      value: analysis?.priority_level || "Not generated",
    },
    {
      label: "Key Requirements",
      value: analysis?.key_requirements || "Not generated",
    },
    {
      label: "Risk Notes",
      value: analysis?.risk_notes || "Not generated",
    },
  ];
}

export default function RequirementsPage() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [latestAnalysis, setLatestAnalysis] =
    useState<RequirementAnalysis | null>(null);
  const [requirements, setRequirements] = useState<RequirementAnalysis[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const isAnalyzed = latestAnalysis !== null;
  const extractedDetails = generateExtractedDetails(formData, latestAnalysis);

  async function loadRequirementHistory() {
    try {
      setLoadingHistory(true);

      const data = (await getRequirements()) as RequirementsResponse;
      setRequirements(data.requirements || []);
    } catch {
      setError("Unable to load requirement history from backend.");
    } finally {
      setLoadingHistory(false);
    }
  }

  useEffect(() => {
    loadRequirementHistory();
  }, []);

  function updateField(field: keyof FormData, value: string) {
    setFormData((previousData) => ({
      ...previousData,
      [field]: value,
    }));

    setLatestAnalysis(null);
    setSuccessMessage("");
  }

  function resetForm() {
    setFormData(initialFormData);
    setLatestAnalysis(null);
    setError("");
    setSuccessMessage("");
  }

  async function handleAnalyzeRequirement(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!formData.clientName.trim()) {
      alert("Please enter client name.");
      return;
    }

    if (!formData.description.trim()) {
      alert("Please enter client requirement description.");
      return;
    }

    try {
      setAnalyzing(true);
      setError("");
      setSuccessMessage("");

      const payload = {
        client_name: formData.clientName.trim(),
        project_type: formData.projectType,
        requirement_text: buildRequirementText(formData),
        estimated_budget: parseBudgetToNumber(formData.budgetRange),
        estimated_timeline: formData.floors,
      };

      const result = (await createRequirementAnalysis(
        payload
      )) as RequirementAnalysis;

      setLatestAnalysis(result);
      setSuccessMessage("Requirement analyzed and saved successfully.");

      await loadRequirementHistory();
    } catch {
      setError("Unable to analyze requirement. Check backend is running.");
    } finally {
      setAnalyzing(false);
    }
  }

  return (
    <>
      <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-start">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.35em] text-cyan-300">
            Requirement Analyzer
          </p>

          <h1 className="mt-4 text-4xl font-bold tracking-tight text-white">
            AI Client Requirement Analyzer
          </h1>

          <p className="mt-3 max-w-3xl text-base leading-7 text-slate-300">
            Capture client needs, budget expectations, style preferences, plot
            details, and generate backend-powered AI requirement analysis.
          </p>
        </div>

        <button
          type="button"
          onClick={resetForm}
          className="rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:border-cyan-400 hover:text-cyan-300"
        >
          Reset Form
        </button>
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
            Client Requirement Form
          </h2>

          <p className="mt-2 text-sm text-slate-400">
            Enter the client details. The result will be generated by FastAPI
            and saved in SQLite.
          </p>

          <form onSubmit={handleAnalyzeRequirement}>
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-300">
                  Client Name
                </label>

                <input
                  type="text"
                  value={formData.clientName}
                  onChange={(event) =>
                    updateField("clientName", event.target.value)
                  }
                  placeholder="Enter client name"
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-300">
                  Project Type
                </label>

                <select
                  value={formData.projectType}
                  onChange={(event) =>
                    updateField("projectType", event.target.value)
                  }
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
                >
                  <option>Residential Villa</option>
                  <option>Apartment Interior</option>
                  <option>Commercial Workspace</option>
                  <option>Retail Store</option>
                  <option>Renovation Project</option>
                  <option>Hospital</option>
                  <option>Campus</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-300">
                  Plot Size
                </label>

                <input
                  type="text"
                  value={formData.plotSize}
                  onChange={(event) =>
                    updateField("plotSize", event.target.value)
                  }
                  placeholder="Example: 50 x 70 ft"
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400"
                />
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
                  placeholder="Example: 80 or ₹75L - ₹90L"
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-300">
                  Number of Floors
                </label>

                <select
                  value={formData.floors}
                  onChange={(event) => updateField("floors", event.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
                >
                  <option>Ground Floor Only</option>
                  <option>G + 1</option>
                  <option>G + 2</option>
                  <option>G + 3</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-300">
                  Architectural Style
                </label>

                <select
                  value={formData.style}
                  onChange={(event) => updateField("style", event.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
                >
                  <option>Modern Minimal</option>
                  <option>Modern Minimal Luxury</option>
                  <option>Luxury Contemporary</option>
                  <option>Traditional</option>
                  <option>Eco-Friendly</option>
                  <option>Industrial</option>
                </select>
              </div>
            </div>

            <div className="mt-5">
              <label className="mb-2 block text-sm font-semibold text-slate-300">
                Client Requirement Description
              </label>

              <textarea
                rows={7}
                value={formData.description}
                onChange={(event) =>
                  updateField("description", event.target.value)
                }
                placeholder="Example: Client wants a modern 4BHK villa with home office, parking for 2 cars, garden space, good ventilation, and future expansion option."
                className="w-full resize-none rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400"
              />
            </div>

            <div className="mt-6 flex flex-wrap gap-4">
              <button
                type="submit"
                disabled={analyzing}
                className="rounded-xl bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {analyzing ? "Analyzing..." : "Analyze Requirement"}
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
            AI Extracted Details
          </h2>

          <p className="mt-2 text-sm text-slate-400">
            {isAnalyzed
              ? "Output generated from backend requirement analysis."
              : "Fill the form and click Analyze Requirement."}
          </p>

          {!isAnalyzed ? (
            <div className="mt-6 rounded-2xl border border-dashed border-white/15 bg-slate-950/70 p-6 text-center">
              <p className="text-sm leading-6 text-slate-400">
                No analysis generated yet. Enter client details and submit to
                backend.
              </p>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {extractedDetails.map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-white/10 bg-slate-950/70 p-4"
                >
                  <p className="text-sm text-slate-400">{item.label}</p>
                  <p className="mt-1 font-semibold text-white">{item.value}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl shadow-black/20">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white">
            Backend Generated AI Report
          </h2>

          <p className="mt-2 text-sm text-slate-400">
            This report is generated from FastAPI and stored in SQLite.
          </p>
        </div>

        {!isAnalyzed ? (
          <div className="rounded-2xl border border-dashed border-white/15 bg-slate-950/70 p-6 text-center">
            <p className="text-sm leading-6 text-slate-400">
              Submit a requirement to generate AI summary, key requirements,
              priority level, and risk notes.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-5">
              <h3 className="text-lg font-bold text-cyan-300">AI Summary</h3>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                {latestAnalysis.ai_summary}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-5">
              <h3 className="text-lg font-bold text-cyan-300">
                Key Requirements
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                {latestAnalysis.key_requirements}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-5">
              <h3 className="text-lg font-bold text-cyan-300">Risk Notes</h3>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                {latestAnalysis.risk_notes}
              </p>

              <span
                className={`mt-4 inline-flex rounded-full border px-4 py-2 text-xs font-semibold ${getPriorityStyle(
                  latestAnalysis.priority_level
                )}`}
              >
                {latestAnalysis.priority_level} Priority
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl shadow-black/20">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white">
            Previous Requirement Analyses
          </h2>

          <p className="mt-2 text-sm text-slate-400">
            These records are loaded from the backend database.
          </p>
        </div>

        {loadingHistory ? (
          <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-6 text-sm text-slate-400">
            Loading requirement history...
          </div>
        ) : requirements.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/15 bg-slate-950/70 p-6 text-center">
            <p className="text-sm text-slate-400">
              No requirement analyses saved yet.
            </p>
          </div>
        ) : (
          <div className="grid gap-5">
            {requirements.map((requirement) => (
              <div
                key={requirement.id}
                className="rounded-2xl border border-white/10 bg-slate-950/70 p-5"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <div className="flex flex-wrap gap-3">
                      <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs font-semibold text-cyan-300">
                        {requirement.project_type}
                      </span>

                      <span
                        className={`rounded-full border px-4 py-2 text-xs font-semibold ${getPriorityStyle(
                          requirement.priority_level
                        )}`}
                      >
                        {requirement.priority_level} Priority
                      </span>
                    </div>

                    <h3 className="mt-4 text-xl font-bold text-white">
                      {requirement.client_name}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      Budget: {formatBudget(requirement.estimated_budget)} ·
                      Timeline: {requirement.estimated_timeline}
                    </p>

                    <p className="mt-3 text-sm leading-6 text-slate-300">
                      {requirement.ai_summary}
                    </p>

                    <p className="mt-3 text-sm leading-6 text-slate-400">
                      <span className="font-semibold text-slate-300">
                        Key Requirements:
                      </span>{" "}
                      {requirement.key_requirements}
                    </p>

                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      <span className="font-semibold text-slate-300">
                        Risk Notes:
                      </span>{" "}
                      {requirement.risk_notes}
                    </p>
                  </div>

                  <p className="text-xs text-slate-500">
                    ID: {requirement.id}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
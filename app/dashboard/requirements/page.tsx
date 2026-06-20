"use client";

import { useState } from "react";

type FormData = {
  clientName: string;
  projectType: string;
  plotSize: string;
  budgetRange: string;
  floors: string;
  style: string;
  description: string;
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

function formatBudget(value: string) {
  const trimmedValue = value.trim();

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

function extractRoomDetails(description: string) {
  const text = description.toLowerCase();
  const roomDetails: string[] = [];

  const bhkMatch = text.match(/(\d+)\s*bhk/);
  const bedroomMatch = text.match(/(\d+)\s*bedroom/);

  if (bhkMatch) {
    roomDetails.push(`${bhkMatch[1]} Bedrooms`);
  } else if (bedroomMatch) {
    roomDetails.push(`${bedroomMatch[1]} Bedrooms`);
  }

  if (text.includes("office")) {
    roomDetails.push("Home Office");
  }

  if (text.includes("puja")) {
    roomDetails.push("Puja Room");
  }

  if (text.includes("garden")) {
    roomDetails.push("Garden Space");
  }

  if (text.includes("balcony")) {
    roomDetails.push("Balcony");
  }

  if (text.includes("terrace")) {
    roomDetails.push("Terrace Area");
  }

  if (roomDetails.length === 0) {
    return "Not clearly mentioned";
  }

  return roomDetails.join(", ");
}

function extractParking(description: string) {
  const text = description.toLowerCase();
  const parkingMatch = text.match(/parking.*?(\d+)\s*car/);

  if (parkingMatch) {
    return `${parkingMatch[1]} Cars`;
  }

  if (text.includes("parking")) {
    return "Parking required";
  }

  return "Not mentioned";
}

function extractSustainability(description: string) {
  const text = description.toLowerCase();
  const goals: string[] = [];

  if (text.includes("solar")) {
    goals.push("Solar Panel Readiness");
  }

  if (text.includes("rainwater")) {
    goals.push("Rainwater Harvesting");
  }

  if (text.includes("energy-efficient") || text.includes("energy efficient")) {
    goals.push("Energy-Efficient Lighting");
  }

  if (text.includes("ventilation")) {
    goals.push("Natural Ventilation");
  }

  if (text.includes("natural lighting")) {
    goals.push("Natural Lighting");
  }

  if (goals.length === 0) {
    return "Not mentioned";
  }

  return goals.join(", ");
}

function estimateRisk(formData: FormData) {
  const text = formData.description.toLowerCase();

  if (
    text.includes("premium") ||
    text.includes("luxury") ||
    text.includes("future expansion") ||
    text.includes("smart home")
  ) {
    return "Medium Risk";
  }

  if (!formData.budgetRange || !formData.plotSize) {
    return "High Risk";
  }

  return "Low Risk";
}

function generateExtractedDetails(formData: FormData): ExtractedRequirement[] {
  return [
    {
      label: "Client Name",
      value: formData.clientName || "Not provided",
    },
    {
      label: "Project Type",
      value: formData.projectType,
    },
    {
      label: "Plot Size",
      value: formData.plotSize || "Not provided",
    },
    {
      label: "Budget Range",
      value: formatBudget(formData.budgetRange),
    },
    {
      label: "Number of Floors",
      value: formData.floors,
    },
    {
      label: "Architectural Style",
      value: formData.style,
    },
    {
      label: "Room Requirements",
      value: extractRoomDetails(formData.description),
    },
    {
      label: "Parking Requirement",
      value: extractParking(formData.description),
    },
    {
      label: "Sustainability Goals",
      value: extractSustainability(formData.description),
    },
    {
      label: "AI Risk Level",
      value: estimateRisk(formData),
    },
  ];
}

function generateReports(formData: FormData) {
  const budget = formatBudget(formData.budgetRange);
  const rooms = extractRoomDetails(formData.description);
  const sustainability = extractSustainability(formData.description);
  const risk = estimateRisk(formData);

  return [
    {
      title: "Requirement Summary",
      description: `${formData.clientName || "The client"} is planning a ${
        formData.projectType
      } with ${formData.floors}. The preferred design style is ${
        formData.style
      }. Important requirements include ${rooms}.`,
    },
    {
      title: "Budget Forecast",
      description: `The mentioned budget is ${budget}. The budget should be reviewed based on material selection, interior scope, construction quality, and timeline expectations.`,
    },
    {
      title: "Feasibility Report",
      description: `The project is planned for a plot size of ${
        formData.plotSize || "not provided"
      }. Space planning should consider ventilation, parking, privacy, circulation, and future expansion needs.`,
    },
    {
      title: "Sustainability Analysis",
      description: `Sustainability requirements identified: ${sustainability}. These can improve long-term energy efficiency and project value.`,
    },
    {
      title: "Risk Assessment",
      description: `Current AI risk level is ${risk}. Main risk factors may include budget changes, material cost variation, design approval delay, and unclear requirements.`,
    },
  ];
}

export default function RequirementsPage() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isAnalyzed, setIsAnalyzed] = useState(false);

  const extractedDetails = generateExtractedDetails(formData);
  const aiReports = generateReports(formData);

  function updateField(field: keyof FormData, value: string) {
    setFormData((previousData) => ({
      ...previousData,
      [field]: value,
    }));

    setIsAnalyzed(false);
  }

  function handleAnalyzeRequirement() {
    setIsAnalyzed(true);
  }

  function handleSaveDraft() {
    alert("Draft saved locally for UI demo.");
  }

  return (
    <>
      {/* Page Header */}
      <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-start">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.35em] text-cyan-300">
            Requirement Analyzer
          </p>

          <h1 className="mt-4 text-4xl font-bold tracking-tight text-white">
            AI Client Requirement Analyzer
          </h1>

          <p className="mt-3 max-w-3xl text-base leading-7 text-slate-300">
            Capture client needs, plot details, room requirements, budget
            expectations, style preferences, and generate AI-powered project
            understanding.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAnalyzeRequirement}
          className="rounded-xl bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-300"
        >
          Generate AI Report
        </button>
      </div>

      {/* Main Layout */}
      <div className="grid gap-6 xl:grid-cols-3">
        {/* Requirement Form */}
        <div className="rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl shadow-black/20 xl:col-span-2">
          <h2 className="text-2xl font-bold text-white">
            Client Requirement Form
          </h2>

          <p className="mt-2 text-sm text-slate-400">
            Enter the client details. The analyzed output will update based on
            your form input.
          </p>

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
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-300">
                Plot Size
              </label>
              <input
                type="text"
                value={formData.plotSize}
                onChange={(event) => updateField("plotSize", event.target.value)}
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
              type="button"
              onClick={handleAnalyzeRequirement}
              className="rounded-xl bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-300"
            >
              Analyze Requirement
            </button>

            <button
              type="button"
              onClick={handleSaveDraft}
              className="rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:border-cyan-400 hover:text-cyan-300"
            >
              Save Draft
            </button>
          </div>
        </div>

        {/* AI Extraction Panel */}
        <div className="rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl shadow-black/20">
          <h2 className="text-2xl font-bold text-white">
            AI Extracted Details
          </h2>

          <p className="mt-2 text-sm text-slate-400">
            {isAnalyzed
              ? "Output generated from your entered client requirements."
              : "Fill the form and click Analyze Requirement."}
          </p>

          {!isAnalyzed ? (
            <div className="mt-6 rounded-2xl border border-dashed border-white/15 bg-slate-950/70 p-6 text-center">
              <p className="text-sm leading-6 text-slate-400">
                No analysis generated yet. Enter client details and click
                Analyze Requirement.
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

      {/* AI Reports */}
      <div className="mt-8 rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl shadow-black/20">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white">
            AI Generated Project Reports
          </h2>

          <p className="mt-2 text-sm text-slate-400">
            {isAnalyzed
              ? "These report previews are generated from your current form input."
              : "Reports will appear after analyzing the requirement."}
          </p>
        </div>

        {!isAnalyzed ? (
          <div className="rounded-2xl border border-dashed border-white/15 bg-slate-950/70 p-6 text-center">
            <p className="text-sm leading-6 text-slate-400">
              Click Analyze Requirement to generate requirement summary, budget
              forecast, feasibility report, sustainability analysis, and risk
              assessment.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {aiReports.map((report) => (
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
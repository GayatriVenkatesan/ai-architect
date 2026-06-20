"use client";

import { useState } from "react";

type InteriorFormData = {
  roomType: string;
  designStyle: string;
  budget: string;
  roomSize: string;
  specialNeeds: string;
};

type InteriorPlan = {
  room: string;
  theme: string;
  palette: string[];
  furniture: string[];
  materials: string[];
  lighting: string;
  estimatedCost: string;
  designNote: string;
};

const initialFormData: InteriorFormData = {
  roomType: "Living Room",
  designStyle: "Modern Minimal",
  budget: "",
  roomSize: "",
  specialNeeds: "",
};

function getPalette(style: string) {
  if (style === "Luxury Contemporary") {
    return ["Ivory", "Champagne Gold", "Charcoal Black"];
  }

  if (style === "Eco-Friendly") {
    return ["Sage Green", "Warm Beige", "Natural Wood"];
  }

  if (style === "Traditional") {
    return ["Cream", "Teak Brown", "Deep Maroon"];
  }

  if (style === "Industrial") {
    return ["Concrete Grey", "Matte Black", "Rust Brown"];
  }

  return ["Soft White", "Warm Beige", "Light Oak"];
}

function getFurniture(roomType: string, specialNeeds: string) {
  const needs = specialNeeds.toLowerCase();

  if (roomType === "Living Room") {
    const furniture = ["Comfort sofa", "Center table", "TV unit"];

    if (needs.includes("storage")) {
      furniture.push("Hidden storage cabinet");
    }

    if (needs.includes("guest")) {
      furniture.push("Convertible sofa bed");
    }

    return furniture;
  }

  if (roomType === "Bedroom") {
    const furniture = ["Bed with headboard", "Wardrobe", "Bedside tables"];

    if (needs.includes("study") || needs.includes("office")) {
      furniture.push("Compact study table");
    }

    if (needs.includes("storage")) {
      furniture.push("Under-bed storage");
    }

    return furniture;
  }

  if (roomType === "Kitchen") {
    const furniture = ["Modular cabinets", "Countertop workspace", "Tall storage unit"];

    if (needs.includes("breakfast")) {
      furniture.push("Breakfast counter");
    }

    if (needs.includes("storage")) {
      furniture.push("Pull-out pantry unit");
    }

    return furniture;
  }

  if (roomType === "Bathroom") {
    return ["Vanity unit", "Wall-mounted storage", "Glass shower partition"];
  }

  return ["Work desk", "Ergonomic chair", "Storage shelves"];
}

function getMaterials(style: string, roomType: string) {
  if (style === "Luxury Contemporary") {
    return ["Italian marble finish", "Premium veneer panels", "Matte luxury paint"];
  }

  if (style === "Eco-Friendly") {
    return ["Bamboo finish panels", "Low-VOC paint", "Natural stone texture"];
  }

  if (style === "Traditional") {
    return ["Teak wood finish", "Textured wall paint", "Patterned floor tiles"];
  }

  if (style === "Industrial") {
    return ["Concrete texture finish", "Metal accents", "Exposed brick finish"];
  }

  if (roomType === "Kitchen") {
    return ["Quartz countertop", "Acrylic cabinet shutters", "Anti-skid floor tiles"];
  }

  return ["Laminate finish", "Matte wall paint", "Wooden texture panels"];
}

function getLighting(roomType: string, style: string) {
  if (roomType === "Kitchen") {
    return "Bright ceiling lights with under-cabinet task lighting.";
  }

  if (roomType === "Bedroom") {
    return "Soft warm lighting with bedside lamps and indirect ceiling glow.";
  }

  if (roomType === "Bathroom") {
    return "Mirror lighting with waterproof ceiling lights.";
  }

  if (style === "Luxury Contemporary") {
    return "Layered lighting with chandelier accent, warm LEDs, and cove lighting.";
  }

  return "Balanced ceiling lighting with warm LED strips for a premium ambience.";
}

function formatBudget(budget: string) {
  const value = budget.trim();

  if (!value) {
    return "Budget not provided";
  }

  const lowerValue = value.toLowerCase();

  if (value.includes("₹") || lowerValue.includes("l") || lowerValue.includes("cr")) {
    return value;
  }

  return `₹${value}L approx`;
}

function generateInteriorPlan(formData: InteriorFormData): InteriorPlan {
  return {
    room: formData.roomType,
    theme: `${formData.designStyle} ${formData.roomType} Concept`,
    palette: getPalette(formData.designStyle),
    furniture: getFurniture(formData.roomType, formData.specialNeeds),
    materials: getMaterials(formData.designStyle, formData.roomType),
    lighting: getLighting(formData.roomType, formData.designStyle),
    estimatedCost: formatBudget(formData.budget),
    designNote: `This plan is generated for a ${formData.roomType.toLowerCase()} with ${
      formData.designStyle
    } style. The design considers room size ${
      formData.roomSize || "not provided"
    } and special needs such as ${
      formData.specialNeeds || "not clearly mentioned"
    }.`,
  };
}

export default function InteriorPage() {
  const [formData, setFormData] = useState<InteriorFormData>(initialFormData);
  const [isGenerated, setIsGenerated] = useState(false);

  const interiorPlan = generateInteriorPlan(formData);

  function updateField(field: keyof InteriorFormData, value: string) {
    setFormData((previousData) => ({
      ...previousData,
      [field]: value,
    }));

    setIsGenerated(false);
  }

  function handleGeneratePlan() {
    setIsGenerated(true);
  }

  return (
    <>
      {/* Page Header */}
      <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-start">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.35em] text-cyan-300">
            Interior Design
          </p>

          <h1 className="mt-4 text-4xl font-bold tracking-tight text-white">
            AI Interior Design Automation
          </h1>

          <p className="mt-3 max-w-3xl text-base leading-7 text-slate-300">
            Generate room-wise interior plans based on customer requirements,
            budget, room size, design style, and special needs.
          </p>
        </div>

        <button
          type="button"
          onClick={handleGeneratePlan}
          className="rounded-xl bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-300"
        >
          Generate Interior Plan
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid gap-6 xl:grid-cols-3">
        {/* Input Form */}
        <div className="rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl shadow-black/20 xl:col-span-2">
          <h2 className="text-2xl font-bold text-white">
            Customer Interior Requirement
          </h2>

          <p className="mt-2 text-sm text-slate-400">
            Enter customer preferences. The generated plan will change based on
            these values.
          </p>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-300">
                Room Type
              </label>

              <select
                value={formData.roomType}
                onChange={(event) => updateField("roomType", event.target.value)}
                className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
              >
                <option>Living Room</option>
                <option>Bedroom</option>
                <option>Kitchen</option>
                <option>Bathroom</option>
                <option>Workspace</option>
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
                <option>Modern Minimal</option>
                <option>Luxury Contemporary</option>
                <option>Eco-Friendly</option>
                <option>Traditional</option>
                <option>Industrial</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-300">
                Budget
              </label>

              <input
                type="text"
                value={formData.budget}
                onChange={(event) => updateField("budget", event.target.value)}
                placeholder="Example: 5 or ₹4L - ₹6L"
                className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-300">
                Room Size
              </label>

              <input
                type="text"
                value={formData.roomSize}
                onChange={(event) => updateField("roomSize", event.target.value)}
                placeholder="Example: 14 x 16 ft"
                className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400"
              />
            </div>
          </div>

          <div className="mt-5">
            <label className="mb-2 block text-sm font-semibold text-slate-300">
              Special Customer Needs
            </label>

            <textarea
              rows={7}
              value={formData.specialNeeds}
              onChange={(event) =>
                updateField("specialNeeds", event.target.value)
              }
              placeholder="Example: Need more storage, study table, guest seating, warm lighting, eco-friendly materials, compact furniture."
              className="w-full resize-none rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400"
            />
          </div>

          <div className="mt-6 flex flex-wrap gap-4">
            <button
              type="button"
              onClick={handleGeneratePlan}
              className="rounded-xl bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-300"
            >
              Generate Interior Plan
            </button>

            <button
              type="button"
              className="rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:border-cyan-400 hover:text-cyan-300"
            >
              Save Draft
            </button>
          </div>
        </div>

        {/* Output Summary */}
        <div className="rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl shadow-black/20">
          <h2 className="text-2xl font-bold text-white">Generated Summary</h2>

          <p className="mt-2 text-sm text-slate-400">
            {isGenerated
              ? "Interior plan generated from customer requirements."
              : "Fill the form and click Generate Interior Plan."}
          </p>

          {!isGenerated ? (
            <div className="mt-6 rounded-2xl border border-dashed border-white/15 bg-slate-950/70 p-6 text-center">
              <p className="text-sm leading-6 text-slate-400">
                No interior plan generated yet. Customer-based output will appear
                here.
              </p>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                <p className="text-sm text-slate-400">Room</p>
                <p className="mt-1 font-semibold text-white">
                  {interiorPlan.room}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                <p className="text-sm text-slate-400">Theme</p>
                <p className="mt-1 font-semibold text-white">
                  {interiorPlan.theme}
                </p>
              </div>

              <div className="rounded-2xl border border-green-400/20 bg-green-400/10 p-4">
                <p className="text-sm font-semibold text-green-300">
                  Estimated Cost
                </p>
                <p className="mt-1 text-lg font-bold text-white">
                  {interiorPlan.estimatedCost}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Generated Interior Plan */}
      <div className="mt-8 rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl shadow-black/20">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white">
            Customer-Based Interior Plan
          </h2>

          <p className="mt-2 text-sm text-slate-400">
            {isGenerated
              ? "Suggestions below are generated from the current customer input."
              : "Generated design suggestions will appear after submitting the form."}
          </p>
        </div>

        {!isGenerated ? (
          <div className="rounded-2xl border border-dashed border-white/15 bg-slate-950/70 p-6 text-center">
            <p className="text-sm leading-6 text-slate-400">
              Enter room requirement details and click Generate Interior Plan.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 xl:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-5">
              <h3 className="text-lg font-bold text-cyan-300">
                Color Palette
              </h3>

              <div className="mt-4 flex flex-wrap gap-2">
                {interiorPlan.palette.map((color) => (
                  <span
                    key={color}
                    className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-2 text-xs font-semibold text-cyan-300"
                  >
                    {color}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-5">
              <h3 className="text-lg font-bold text-cyan-300">
                Furniture Suggestions
              </h3>

              <ul className="mt-4 space-y-2">
                {interiorPlan.furniture.map((item) => (
                  <li key={item} className="text-sm text-slate-300">
                    • {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-5">
              <h3 className="text-lg font-bold text-cyan-300">
                Material Recommendations
              </h3>

              <ul className="mt-4 space-y-2">
                {interiorPlan.materials.map((item) => (
                  <li key={item} className="text-sm text-slate-300">
                    • {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-5">
              <h3 className="text-lg font-bold text-cyan-300">
                Lighting Plan
              </h3>

              <p className="mt-4 text-sm leading-6 text-slate-300">
                {interiorPlan.lighting}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-5 xl:col-span-2">
              <h3 className="text-lg font-bold text-cyan-300">
                AI Design Note
              </h3>

              <p className="mt-4 text-sm leading-6 text-slate-300">
                {interiorPlan.designNote}
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
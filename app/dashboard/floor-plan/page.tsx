"use client";

import { useState } from "react";

type FloorPlanFormData = {
  projectName: string;
  plotSize: string;
  floorType: string;
  bedrooms: string;
  bathrooms: string;
  kitchenType: string;
  parking: string;
  garden: string;
  designStyle: string;
  specialNeeds: string;
};

type RoomBlock = {
  name: string;
  size: string;
  type: "primary" | "private" | "service" | "outdoor" | "utility";
};

const initialFormData: FloorPlanFormData = {
  projectName: "",
  plotSize: "",
  floorType: "Ground Floor",
  bedrooms: "3",
  bathrooms: "2",
  kitchenType: "Open Kitchen",
  parking: "1 Car Parking",
  garden: "Front Garden",
  designStyle: "Modern Minimal",
  specialNeeds: "",
};

function getNumber(value: string) {
  const numberValue = Number(value);

  if (Number.isNaN(numberValue) || numberValue < 0) {
    return 0;
  }

  return numberValue;
}

function getRoomStyle(type: RoomBlock["type"]) {
  if (type === "primary") {
    return "border-cyan-400/30 bg-cyan-400/10 text-cyan-200";
  }

  if (type === "private") {
    return "border-violet-400/30 bg-violet-400/10 text-violet-200";
  }

  if (type === "service") {
    return "border-orange-400/30 bg-orange-400/10 text-orange-200";
  }

  if (type === "outdoor") {
    return "border-green-400/30 bg-green-400/10 text-green-200";
  }

  return "border-slate-400/30 bg-slate-400/10 text-slate-200";
}

function generateRooms(formData: FloorPlanFormData): RoomBlock[] {
  const bedroomCount = Math.max(1, getNumber(formData.bedrooms));
  const bathroomCount = Math.max(1, getNumber(formData.bathrooms));
  const needs = formData.specialNeeds.toLowerCase();

  const rooms: RoomBlock[] = [
    {
      name: "Living Room",
      size: "18 x 16 ft",
      type: "primary",
    },
    {
      name: "Dining Area",
      size: "12 x 10 ft",
      type: "primary",
    },
    {
      name: formData.kitchenType,
      size: "12 x 10 ft",
      type: "service",
    },
  ];

  for (let index = 1; index <= bedroomCount; index++) {
    rooms.push({
      name: `Bedroom ${index}`,
      size: index === 1 ? "14 x 14 ft" : "12 x 12 ft",
      type: "private",
    });
  }

  for (let index = 1; index <= bathroomCount; index++) {
    rooms.push({
      name: index === 1 ? "Common Bathroom" : `Bathroom ${index}`,
      size: "8 x 6 ft",
      type: "service",
    });
  }

  if (formData.parking !== "No Parking") {
    rooms.push({
      name: formData.parking,
      size: "14 x 16 ft",
      type: "outdoor",
    });
  }

  if (formData.garden !== "No Garden") {
    rooms.push({
      name: formData.garden,
      size: "Open Space",
      type: "outdoor",
    });
  }

  if (needs.includes("office") || needs.includes("study")) {
    rooms.push({
      name: "Home Office",
      size: "10 x 10 ft",
      type: "utility",
    });
  }

  if (needs.includes("puja")) {
    rooms.push({
      name: "Puja Room",
      size: "6 x 6 ft",
      type: "utility",
    });
  }

  if (needs.includes("balcony")) {
    rooms.push({
      name: "Balcony",
      size: "Open View",
      type: "outdoor",
    });
  }

  if (needs.includes("storage")) {
    rooms.push({
      name: "Storage Room",
      size: "6 x 8 ft",
      type: "utility",
    });
  }

  return rooms;
}

function generatePlanningNotes(formData: FloorPlanFormData) {
  const notes = [
    `The plan is created for ${formData.floorType.toLowerCase()} with ${formData.designStyle.toLowerCase()} style.`,
    `The layout prioritizes natural lighting, ventilation, clear movement paths, and practical room placement.`,
    `Living, dining, and kitchen zones are grouped together for better daily usage flow.`,
  ];

  if (formData.parking !== "No Parking") {
    notes.push("Parking space is planned near the entrance for easy vehicle access.");
  }

  if (formData.garden !== "No Garden") {
    notes.push("Garden/open space is included to improve outdoor experience and visual comfort.");
  }

  if (formData.specialNeeds.toLowerCase().includes("future")) {
    notes.push("Future expansion requirement is considered in the planning direction.");
  }

  return notes;
}

export default function FloorPlanPage() {
  const [formData, setFormData] =
    useState<FloorPlanFormData>(initialFormData);
  const [isGenerated, setIsGenerated] = useState(false);

  const generatedRooms = generateRooms(formData);
  const planningNotes = generatePlanningNotes(formData);

  function updateField(field: keyof FloorPlanFormData, value: string) {
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
            2D Floor Plan
          </p>

          <h1 className="mt-4 text-4xl font-bold tracking-tight text-white">
            AI 2D Floor Plan Generator
          </h1>

          <p className="mt-3 max-w-3xl text-base leading-7 text-slate-300">
            Generate a simple 2D floor plan concept from client requirements
            before moving into 3D visualization and AR/VR walkthroughs.
          </p>
        </div>

        <button
          type="button"
          onClick={handleGeneratePlan}
          className="rounded-xl bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-300"
        >
          Generate 2D Plan
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid gap-6 xl:grid-cols-3">
        {/* Requirement Form */}
        <div className="rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl shadow-black/20 xl:col-span-2">
          <h2 className="text-2xl font-bold text-white">
            Client Floor Plan Requirement
          </h2>

          <p className="mt-2 text-sm text-slate-400">
            Enter the basic client requirement. The generated plan will change
            based on these values.
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
                placeholder="Example: Smart Villa Project"
                className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-300">
                Plot Size
              </label>

              <input
                type="text"
                value={formData.plotSize}
                onChange={(event) => updateField("plotSize", event.target.value)}
                placeholder="Example: 40 x 60 ft"
                className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-300">
                Floor Type
              </label>

              <select
                value={formData.floorType}
                onChange={(event) =>
                  updateField("floorType", event.target.value)
                }
                className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
              >
                <option>Ground Floor</option>
                <option>First Floor</option>
                <option>G + 1</option>
                <option>G + 2</option>
                <option>Duplex Plan</option>
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
                <option>Traditional Indian</option>
                <option>Eco-Friendly</option>
                <option>Compact Urban</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-300">
                Bedrooms
              </label>

              <input
                type="number"
                value={formData.bedrooms}
                onChange={(event) => updateField("bedrooms", event.target.value)}
                placeholder="Example: 3"
                className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-300">
                Bathrooms
              </label>

              <input
                type="number"
                value={formData.bathrooms}
                onChange={(event) => updateField("bathrooms", event.target.value)}
                placeholder="Example: 2"
                className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-300">
                Kitchen Type
              </label>

              <select
                value={formData.kitchenType}
                onChange={(event) =>
                  updateField("kitchenType", event.target.value)
                }
                className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
              >
                <option>Open Kitchen</option>
                <option>Closed Kitchen</option>
                <option>Modular Kitchen</option>
                <option>Kitchen with Utility</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-300">
                Parking
              </label>

              <select
                value={formData.parking}
                onChange={(event) => updateField("parking", event.target.value)}
                className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
              >
                <option>No Parking</option>
                <option>1 Car Parking</option>
                <option>2 Car Parking</option>
                <option>Bike Parking</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-300">
                Garden / Open Space
              </label>

              <select
                value={formData.garden}
                onChange={(event) => updateField("garden", event.target.value)}
                className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
              >
                <option>No Garden</option>
                <option>Front Garden</option>
                <option>Backyard Garden</option>
                <option>Indoor Courtyard</option>
                <option>Terrace Garden</option>
              </select>
            </div>
          </div>

          <div className="mt-5">
            <label className="mb-2 block text-sm font-semibold text-slate-300">
              Special Requirements
            </label>

            <textarea
              rows={6}
              value={formData.specialNeeds}
              onChange={(event) =>
                updateField("specialNeeds", event.target.value)
              }
              placeholder="Example: Need home office, puja room, balcony, storage room, future expansion support, good ventilation."
              className="w-full resize-none rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400"
            />
          </div>

          <div className="mt-6 flex flex-wrap gap-4">
            <button
              type="button"
              onClick={handleGeneratePlan}
              className="rounded-xl bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-300"
            >
              Generate 2D Plan
            </button>

            <button
              type="button"
              className="rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:border-cyan-400 hover:text-cyan-300"
            >
              Save Floor Plan Draft
            </button>
          </div>
        </div>

        {/* Plan Summary */}
        <div className="rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl shadow-black/20">
          <h2 className="text-2xl font-bold text-white">Plan Summary</h2>

          <p className="mt-2 text-sm text-slate-400">
            {isGenerated
              ? "Generated from current client floor plan requirement."
              : "Fill the form and click Generate 2D Plan."}
          </p>

          {!isGenerated ? (
            <div className="mt-6 rounded-2xl border border-dashed border-white/15 bg-slate-950/70 p-6 text-center">
              <p className="text-sm leading-6 text-slate-400">
                No floor plan generated yet.
              </p>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                <p className="text-sm text-slate-400">Project</p>
                <p className="mt-1 font-semibold text-white">
                  {formData.projectName || "Untitled Floor Plan"}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                <p className="text-sm text-slate-400">Plot Size</p>
                <p className="mt-1 font-semibold text-white">
                  {formData.plotSize || "Not provided"}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                <p className="text-sm text-slate-400">Floor Type</p>
                <p className="mt-1 font-semibold text-white">
                  {formData.floorType}
                </p>
              </div>

              <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4">
                <p className="text-sm font-semibold text-cyan-300">
                  Rooms Planned
                </p>
                <p className="mt-1 text-3xl font-bold text-white">
                  {generatedRooms.length}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 2D Plan Preview */}
      <div className="mt-8 rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl shadow-black/20">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white">
            Generated 2D Layout Preview
          </h2>

          <p className="mt-2 text-sm text-slate-400">
            This is a simple frontend 2D concept layout. Later, we can connect
            real AI/CAD-style generation.
          </p>
        </div>

        {!isGenerated ? (
          <div className="rounded-2xl border border-dashed border-white/15 bg-slate-950/70 p-8 text-center">
            <p className="text-sm leading-6 text-slate-400">
              Your 2D floor plan preview will appear here after generation.
            </p>
          </div>
        ) : (
          <div className="rounded-3xl border border-cyan-400/20 bg-slate-950 p-5">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-cyan-300">
                  Concept Layout
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Not an engineering drawing. This is an MVP visual concept.
                </p>
              </div>

              <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-slate-300">
                {formData.designStyle}
              </div>
            </div>

            <div className="grid min-h-[520px] gap-3 rounded-2xl border-4 border-slate-700 bg-slate-950 p-4 md:grid-cols-4">
              {generatedRooms.map((room, index) => (
                <div
                  key={`${room.name}-${index}`}
                  className={`flex min-h-28 flex-col justify-between rounded-2xl border p-4 ${getRoomStyle(
                    room.type
                  )} ${
                    room.name === "Living Room"
                      ? "md:col-span-2 md:row-span-2"
                      : ""
                  } ${
                    room.name.includes("Bedroom 1")
                      ? "md:col-span-2"
                      : ""
                  } ${
                    room.name.includes("Parking") || room.name.includes("Garden")
                      ? "md:col-span-2"
                      : ""
                  }`}
                >
                  <div>
                    <h3 className="font-bold">{room.name}</h3>
                    <p className="mt-2 text-xs opacity-80">{room.size}</p>
                  </div>

                  <p className="mt-4 text-xs uppercase tracking-[0.2em] opacity-70">
                    {room.type}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Planning Notes */}
      <div className="mt-8 grid gap-6 xl:grid-cols-2">
        <div className="rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl shadow-black/20">
          <h2 className="text-2xl font-bold text-white">
            AI Planning Notes
          </h2>

          <p className="mt-2 text-sm text-slate-400">
            Planning explanation based on current inputs.
          </p>

          {!isGenerated ? (
            <div className="mt-6 rounded-2xl border border-dashed border-white/15 bg-slate-950/70 p-6 text-center">
              <p className="text-sm text-slate-400">
                Planning notes will appear after generating the 2D plan.
              </p>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {planningNotes.map((note, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-white/10 bg-slate-950/70 p-5"
                >
                  <p className="text-sm leading-6 text-slate-300">{note}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl shadow-black/20">
          <h2 className="text-2xl font-bold text-white">
            Area Distribution
          </h2>

          <p className="mt-2 text-sm text-slate-400">
            Approximate planning distribution for concept-level review.
          </p>

          {!isGenerated ? (
            <div className="mt-6 rounded-2xl border border-dashed border-white/15 bg-slate-950/70 p-6 text-center">
              <p className="text-sm text-slate-400">
                Area distribution will appear after generation.
              </p>
            </div>
          ) : (
            <div className="mt-6 space-y-5">
              <div>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-slate-400">Living + Dining</span>
                  <span className="font-semibold text-cyan-300">25%</span>
                </div>
                <div className="h-3 rounded-full bg-slate-800">
                  <div className="h-3 w-[25%] rounded-full bg-cyan-400" />
                </div>
              </div>

              <div>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-slate-400">Bedrooms</span>
                  <span className="font-semibold text-violet-300">35%</span>
                </div>
                <div className="h-3 rounded-full bg-slate-800">
                  <div className="h-3 w-[35%] rounded-full bg-violet-400" />
                </div>
              </div>

              <div>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-slate-400">Kitchen + Bathrooms</span>
                  <span className="font-semibold text-orange-300">20%</span>
                </div>
                <div className="h-3 rounded-full bg-slate-800">
                  <div className="h-3 w-[20%] rounded-full bg-orange-400" />
                </div>
              </div>

              <div>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-slate-400">Outdoor / Utility</span>
                  <span className="font-semibold text-green-300">20%</span>
                </div>
                <div className="h-3 rounded-full bg-slate-800">
                  <div className="h-3 w-[20%] rounded-full bg-green-400" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
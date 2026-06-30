"use client";

import { useEffect, useMemo, useState } from "react";

type ExperienceMode = "ar" | "vr" | "presentation";

type ImmersiveModePanelProps = {
  mode: ExperienceMode;
  projectName: string;
};

const walkthroughZones = [
  {
    name: "Entrance Lobby",
    description:
      "Review first impression, reception visibility, waiting area, and entry experience.",
  },
  {
    name: "Main Corridor",
    description:
      "Check movement flow, corridor width, accessibility, and circulation clarity.",
  },
  {
    name: "Room Layout",
    description:
      "Review room placement, furniture zones, usability, and space planning.",
  },
  {
    name: "Upper Floor",
    description:
      "Move to the next floor and inspect vertical circulation and zoning.",
  },
];

const presentationSteps = [
  {
    title: "Project Vision",
    detail:
      "Explain the design goal, client requirement, project purpose, and overall direction.",
  },
  {
    title: "Design Concept",
    detail:
      "Present the architectural form, spatial planning idea, and design logic.",
  },
  {
    title: "Material Direction",
    detail:
      "Show façade materials, interior palette, finishes, lighting, and visual language.",
  },
  {
    title: "Client Approval Points",
    detail:
      "Highlight decisions that need client approval before moving to the next stage.",
  },
];

export default function ImmersiveModePanel({
  mode,
  projectName,
}: ImmersiveModePanelProps) {
  const [arScale, setArScale] = useState(72);
  const [isModelLocked, setIsModelLocked] = useState(false);
  const [selectedZoneIndex, setSelectedZoneIndex] = useState(0);
  const [selectedStepIndex, setSelectedStepIndex] = useState(0);

  useEffect(() => {
    setArScale(72);
    setIsModelLocked(false);
    setSelectedZoneIndex(0);
    setSelectedStepIndex(0);
  }, [mode, projectName]);

  const selectedZone = walkthroughZones[selectedZoneIndex];
  const selectedStep = presentationSteps[selectedStepIndex];

  const modeLabel = useMemo(() => {
    if (mode === "ar") {
      return "AR Placement Controls";
    }

    if (mode === "vr") {
      return "Walkthrough Controls";
    }

    return "Client Presentation Flow";
  }, [mode]);

  if (mode === "ar") {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
        <p className="text-xs uppercase tracking-[0.25em] text-cyan-400">
          {modeLabel}
        </p>

        <h3 className="mt-3 text-lg font-semibold text-white">
          Exterior AR Preview
        </h3>

        <p className="mt-3 text-sm leading-6 text-slate-400">
          Place {projectName} on a real-world surface and review exterior form,
          scale, façade, and site placement.
        </p>

        <div className="mt-5 space-y-4">
          <div className="rounded-2xl border border-white/10 bg-slate-950 p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-300">Surface Detection</p>

              <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs text-emerald-300">
                Ready
              </span>
            </div>

            <p className="mt-2 text-xs leading-5 text-slate-500">
              Simulated real-world floor/table detection for future AR mode.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-950 p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-300">Preview Scale</p>

              <span className="text-sm font-semibold text-cyan-300">
                {arScale}%
              </span>
            </div>

            <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-cyan-400 transition-all"
                style={{ width: `${arScale}%` }}
              />
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setArScale((value) => Math.max(40, value - 10))}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300 transition hover:border-cyan-400/50"
              >
                Scale Down
              </button>

              <button
                type="button"
                onClick={() => setArScale((value) => Math.min(100, value + 10))}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300 transition hover:border-cyan-400/50"
              >
                Scale Up
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setArScale(72)}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300 transition hover:border-cyan-400/50"
            >
              Reset Position
            </button>

            <button
              type="button"
              onClick={() => setIsModelLocked((value) => !value)}
              className={`rounded-xl border px-4 py-3 text-sm transition ${
                isModelLocked
                  ? "border-cyan-400 bg-cyan-400/10 text-cyan-300"
                  : "border-white/10 bg-white/5 text-slate-300 hover:border-cyan-400/50"
              }`}
            >
              {isModelLocked ? "Model Locked" : "Lock Model"}
            </button>
          </div>

          <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4">
            <p className="text-sm font-semibold text-cyan-300">
              AR Preview Status
            </p>

            <p className="mt-2 text-sm leading-6 text-slate-300">
              {isModelLocked
                ? "The model is locked in the preview position. This simulates fixed AR placement."
                : "The model is movable. This simulates adjusting placement before client review."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (mode === "vr") {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
        <p className="text-xs uppercase tracking-[0.25em] text-purple-400">
          {modeLabel}
        </p>

        <h3 className="mt-3 text-lg font-semibold text-white">
          Interior Walkthrough
        </h3>

        <p className="mt-3 text-sm leading-6 text-slate-400">
          Explore {projectName} through lobby zones, corridors, room planning,
          and circulation paths.
        </p>

        <div className="mt-5 grid gap-3">
          {walkthroughZones.map((zone, index) => {
            const isActive = selectedZoneIndex === index;

            return (
              <button
                key={zone.name}
                type="button"
                onClick={() => setSelectedZoneIndex(index)}
                className={`rounded-2xl border px-4 py-3 text-left text-sm transition ${
                  isActive
                    ? "border-purple-400 bg-purple-400/10 text-purple-200"
                    : "border-white/10 bg-slate-950 text-slate-300 hover:border-purple-400/50 hover:bg-purple-400/10"
                }`}
              >
                {zone.name}
              </button>
            );
          })}
        </div>

        <div className="mt-5 rounded-2xl border border-white/10 bg-slate-950 p-4">
          <p className="text-sm font-semibold text-white">
            Current Walkthrough Zone
          </p>

          <p className="mt-2 text-sm font-medium text-purple-300">
            {selectedZone.name}
          </p>

          <p className="mt-2 text-sm leading-6 text-slate-400">
            {selectedZone.description}
          </p>
        </div>

        <div className="mt-5 rounded-2xl border border-purple-400/20 bg-purple-400/10 p-4">
          <p className="text-sm font-semibold text-purple-300">
            VR Simulation Status
          </p>

          <p className="mt-2 text-sm leading-6 text-slate-300">
            This is a simulated walkthrough controller. Later, each button can
            move the camera to real interior positions inside a GLB model.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
      <p className="text-xs uppercase tracking-[0.25em] text-amber-400">
        {modeLabel}
      </p>

      <h3 className="mt-3 text-lg font-semibold text-white">
        Presentation Mode
      </h3>

      <p className="mt-3 text-sm leading-6 text-slate-400">
        Present {projectName} using structured design highlights and
        approval-focused talking points.
      </p>

      <div className="mt-5 space-y-3">
        {presentationSteps.map((step, index) => {
          const isActive = selectedStepIndex === index;

          return (
            <button
              key={step.title}
              type="button"
              onClick={() => setSelectedStepIndex(index)}
              className={`w-full rounded-2xl border p-4 text-left transition ${
                isActive
                  ? "border-amber-400 bg-amber-400/10"
                  : "border-white/10 bg-slate-950 hover:border-amber-400/50"
              }`}
            >
              <p className="text-xs text-slate-500">Step {index + 1}</p>

              <p
                className={`mt-1 text-sm font-medium ${
                  isActive ? "text-amber-300" : "text-white"
                }`}
              >
                {step.title}
              </p>
            </button>
          );
        })}
      </div>

      <div className="mt-5 rounded-2xl border border-white/10 bg-slate-950 p-4">
        <p className="text-sm font-semibold text-white">
          Current Presentation Point
        </p>

        <p className="mt-2 text-sm font-medium text-amber-300">
          {selectedStep.title}
        </p>

        <p className="mt-2 text-sm leading-6 text-slate-400">
          {selectedStep.detail}
        </p>
      </div>

      <div className="mt-5 rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4">
        <p className="text-sm font-semibold text-amber-300">
          Client Review Status
        </p>

        <p className="mt-2 text-sm leading-6 text-slate-300">
          This creates a structured client presentation flow. Later, this can
          export meeting notes, approvals, and design decisions.
        </p>
      </div>
    </div>
  );
}
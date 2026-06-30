"use client";

type ExternalWalkthroughViewerProps = {
  projectName: string;
  projectType: string;
  embedUrl: string;
  attribution: string;
};

export default function ExternalWalkthroughViewer({
  projectName,
  projectType,
  embedUrl,
  attribution,
}: ExternalWalkthroughViewerProps) {
  return (
    <div className="w-full space-y-4">
      {/* Viewer Container Info Card */}
      <div className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-5 backdrop-blur-xl shadow-xl flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className={`h-2.5 w-2.5 rounded-full ${embedUrl ? "bg-emerald-400" : "bg-amber-400 animate-pulse"}`} />
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300">
              Realistic 3D Walkthrough Viewport
            </p>
          </div>
          <h3 className="text-lg font-bold text-white tracking-tight">
            {projectName}
          </h3>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-slate-300 capitalize">
          {projectType} Design
        </div>
      </div>

      {/* Main 90vh Viewing Area */}
      <div className="relative h-[90vh] min-h-[600px] w-full overflow-hidden rounded-[2.5rem] border border-white/10 bg-slate-950 shadow-2xl">
        {embedUrl ? (
          <div className="relative h-full w-full">
            {/* Embedded Walkthrough Iframe */}
            <iframe
              src={embedUrl}
              title={`${projectName} Realistic Walkthrough`}
              className="h-full w-full border-none bg-slate-950"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; vr; xr-spatial-tracking"
              allowFullScreen
            />
            {/* Live Indicator Overlay */}
            <div className="absolute left-6 top-6 flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-950/80 px-4 py-2 backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="h-2 w-2 absolute left-4 rounded-full bg-emerald-400" />
              <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                Connected Live
              </p>
            </div>

            {/* Creator / License Attribution Overlay */}
            {attribution && (
              <div className="absolute right-6 bottom-6 flex items-center gap-2 rounded-full border border-white/10 bg-slate-950/85 px-4 py-2 backdrop-blur-md shadow-lg shadow-black/40 max-w-[90%]">
                <svg className="h-3.5 w-3.5 text-cyan-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="text-[10px] text-slate-300 truncate">
                  Asset Attribution: <span className="font-semibold text-white">{attribution}</span>
                </span>
              </div>
            )}
          </div>
        ) : (
          /* Empty Placeholder State */
          <div className="flex h-full flex-col items-center justify-center bg-[radial-gradient(circle_at_center,#111827_0,#020617_75%)] px-6 text-center">
            <div className="relative mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-dashed border-cyan-400/20 bg-cyan-400/5 text-cyan-400/80">
              <svg className="h-9 w-9 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <div className="absolute inset-0 rounded-full border border-cyan-400/10 animate-ping" style={{ animationDuration: '4s' }} />
            </div>

            <div className="rounded-full border border-cyan-500/20 bg-cyan-500/5 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-300">
              Realistic walkthrough asset not connected yet
            </div>

            <h3 className="mt-6 text-xl font-bold text-white tracking-tight">
              {projectName}
            </h3>

            <p className="mt-3 max-w-md text-xs leading-relaxed text-slate-400">
              This <span className="font-medium text-cyan-200 capitalize">{projectType}</span> layout is ready for a real-time walkthrough. The high-fidelity external engine asset is not linked in the configuration.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

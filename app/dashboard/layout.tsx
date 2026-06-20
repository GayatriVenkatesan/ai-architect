"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Projects", href: "/dashboard/projects" },
    { name: "Clients", href: "/dashboard/clients" },
    { name: "Requirement Analyzer", href: "/dashboard/requirements" },
    { name: "2D Floor Plan", href: "/dashboard/floor-plan" },
    { name: "Interior Design", href: "/dashboard/interior" },
    { name: "3D Visualization", href: "/dashboard/visualization" },
    { name: "AR/VR Experience", href: "/dashboard/ar-vr" },
    { name: "Documents", href: "/dashboard/documents" },
    { name: "AI Chatbot", href: "/dashboard/chatbot" },
    { name: "Construction Monitoring", href: "/dashboard/construction" },
    { name: "Analytics", href: "/dashboard/analytics" },
    { name: "Settings", href: "/dashboard/settings" },
  ];

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="hidden w-72 shrink-0 border-r border-white/10 bg-slate-900/80 p-6 lg:block">
          <Link href="/dashboard" className="block">
            <h1 className="text-2xl font-bold tracking-tight text-white">
              ArchiFlow AI
            </h1>

            <p className="mt-2 text-sm text-slate-400">
              Architecture OS
            </p>
          </Link>

          <nav className="mt-10 space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={
                    isActive
                      ? "block rounded-xl bg-cyan-400 px-4 py-3 font-semibold text-slate-950"
                      : "block rounded-xl px-4 py-3 font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
                  }
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Mobile Top Navigation */}
        <div className="fixed left-0 right-0 top-0 z-40 border-b border-white/10 bg-slate-950/95 p-4 backdrop-blur lg:hidden">
          <div className="flex items-center justify-between gap-4">
            <Link href="/dashboard">
              <h1 className="text-lg font-bold text-white">ArchiFlow AI</h1>
            </Link>

            <select
              value={pathname}
              onChange={(event) => {
                window.location.href = event.target.value;
              }}
              className="rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white outline-none"
            >
              {navItems.map((item) => (
                <option key={item.href} value={item.href}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Page Content */}
        <section className="min-w-0 flex-1 px-5 pb-10 pt-24 lg:px-8 lg:pt-8">
          {children}
        </section>
      </div>
    </main>
  );
}
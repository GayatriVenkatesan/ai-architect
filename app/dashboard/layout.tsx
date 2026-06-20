"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
  },
  {
    name: "Projects",
    href: "/dashboard/projects",
  },
  {
    name: "Requirement Analyzer",
    href: "/dashboard/requirements",
  },
  {
    name: "Interior Design",
    href: "/dashboard/interior",
  },
  {
    name: "Construction ",
    href: "/dashboard/construction",
  },
  {
    name: "Analytics",
    href: "/dashboard/analytics ",
  },
  { name: "Clients experience platform", 
    href: "/dashboard/clients" 
  },
  { name: "2D Floor Plan",
     href: "/dashboard/floor-plan" 
  },
  { name: "AI Chatbot", 
    href: "/dashboard/chatbot" 
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="hidden w-72 border-r border-white/10 bg-slate-900/80 p-6 lg:block">
          <Link href="/" className="block">
            <h1 className="text-2xl font-bold tracking-tight text-white">
              ArchiFlow AI
            </h1>

            <p className="mt-1 text-sm text-slate-400">
              Architecture Workspace
            </p>
          </Link>

          <nav className="mt-10 space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.name}
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

          <div className="mt-10 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4">
            <p className="text-sm font-semibold text-cyan-300">
              AI System Status
            </p>

            <p className="mt-2 text-sm leading-6 text-slate-300">
              Requirement analysis, budget forecasting, and project insights are
              ready for workspace automation.
            </p>
          </div>
        </aside>

        {/* Mobile Header */}
        <div className="fixed left-0 right-0 top-0 z-20 border-b border-white/10 bg-slate-950/95 px-5 py-4 backdrop-blur lg:hidden">
          <div className="flex items-center justify-between">
            <Link href="/" className="font-bold text-white">
              ArchiFlow AI
            </Link>

            <Link
              href="/dashboard"
              className="rounded-lg bg-cyan-400 px-3 py-2 text-xs font-bold text-slate-950"
            >
              Dashboard
            </Link>
          </div>
        </div>

        {/* Page Content */}
        <section className="flex-1 px-6 pb-8 pt-24 lg:px-10 lg:py-8">
          {children}
        </section>
      </div>
    </main>
  );
}
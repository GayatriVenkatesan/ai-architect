"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

type DashboardLayoutProps = {
  children: ReactNode;
};

type SidebarLink = {
  label: string;
  href: string;
};

const sidebarLinks: SidebarLink[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
  },
  {
    label: "Projects",
    href: "/dashboard/projects",
  },
  {
    label: "Clients",
    href: "/dashboard/clients",
  },
  {
    label: "Requirement Analyzer",
    href: "/dashboard/requirements",
  },
  {
    label: "2D Floor Plan",
    href: "/dashboard/floor-plan",
  },
  {
    label: "Interior Design",
    href: "/dashboard/interior",
  },
  {
    label: "3D Visualization",
    href: "/dashboard/visualization",
  },
  {
    label: "Documents",
    href: "/dashboard/documents",
  },
  {
    label: "AI Chatbot",
    href: "/dashboard/chatbot",
  },
  {
    label: "Construction Monitoring",
    href: "/dashboard/construction",
  },
  {
    label: "Analytics",
    href: "/dashboard/analytics",
  },
  {
    label: "Settings",
    href: "/dashboard/settings",
  },
];

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();

  function isActiveLink(href: string) {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }

    return pathname.startsWith(href);
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="flex min-h-screen">
        <aside className="fixed left-0 top-0 z-40 h-screen w-80 overflow-y-auto border-r border-white/10 bg-slate-950 px-6 py-8">
          <div className="mb-10">
            <h1 className="text-2xl font-bold tracking-tight text-white">
              ArchiFlow AI
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              Architecture workflow platform
            </p>
          </div>

          <nav className="space-y-3">
            {sidebarLinks.map((link) => {
              const active = isActiveLink(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block rounded-2xl px-6 py-4 text-lg font-semibold transition ${
                    active
                      ? "bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-400/20"
                      : "text-slate-200 hover:bg-white/10 hover:text-cyan-300"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <main className="ml-80 min-h-screen flex-1 overflow-x-hidden px-10 py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
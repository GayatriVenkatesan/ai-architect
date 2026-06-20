"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";

type SettingsData = {
  workspaceName: string;
  ownerName: string;
  ownerEmail: string;
  companyType: string;
  aiMode: string;
  reportFrequency: string;
  notificationsEnabled: boolean;
  clientUpdatesEnabled: boolean;
  securityLevel: string;
};

const SETTINGS_STORAGE_KEY = "archiflow-settings";

const defaultSettings: SettingsData = {
  workspaceName: "ArchiFlow Studio",
  ownerName: "Project Admin",
  ownerEmail: "admin@archiflow.ai",
  companyType: "Architecture Firm",
  aiMode: "Balanced AI Assistance",
  reportFrequency: "Weekly",
  notificationsEnabled: true,
  clientUpdatesEnabled: true,
  securityLevel: "Standard",
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<SettingsData>(defaultSettings);
  const [savedMessage, setSavedMessage] = useState("");

  useEffect(() => {
    const storedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);

    if (storedSettings) {
      setSettings(JSON.parse(storedSettings));
    } else {
      localStorage.setItem(
        SETTINGS_STORAGE_KEY,
        JSON.stringify(defaultSettings)
      );
    }
  }, []);

  function updateField<K extends keyof SettingsData>(
    field: K,
    value: SettingsData[K]
  ) {
    setSettings((previousSettings) => ({
      ...previousSettings,
      [field]: value,
    }));
  }

  function handleSaveSettings(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    setSavedMessage("Settings saved successfully.");

    setTimeout(() => {
      setSavedMessage("");
    }, 2500);
  }

  function handleResetSettings() {
    const confirmReset = window.confirm(
      "Are you sure you want to reset settings?"
    );

    if (!confirmReset) {
      return;
    }

    setSettings(defaultSettings);
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(defaultSettings));
    setSavedMessage("Settings reset to default.");

    setTimeout(() => {
      setSavedMessage("");
    }, 2500);
  }

  return (
    <>
      {/* Page Header */}
      <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-start">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.35em] text-cyan-300">
            Settings
          </p>

          <h1 className="mt-4 text-4xl font-bold tracking-tight text-white">
            Workspace Settings
          </h1>

          <p className="mt-3 max-w-3xl text-base leading-7 text-slate-300">
            Manage workspace profile, AI preferences, notification controls, and
            security settings for ArchiFlow AI.
          </p>
        </div>

        <div className="rounded-2xl border border-green-400/20 bg-green-400/10 px-5 py-4">
          <p className="text-sm font-semibold text-green-300">
            Frontend Storage
          </p>
          <p className="mt-1 text-sm text-slate-300">localStorage enabled</p>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl shadow-black/20">
          <p className="text-sm text-slate-400">Workspace</p>
          <h2 className="mt-3 text-2xl font-bold text-white">
            {settings.workspaceName}
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Current active workspace
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl shadow-black/20">
          <p className="text-sm text-slate-400">Company Type</p>
          <h2 className="mt-3 text-2xl font-bold text-white">
            {settings.companyType}
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Business category
          </p>
        </div>

        <div className="rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-6 shadow-2xl shadow-black/20">
          <p className="text-sm font-semibold text-cyan-300">AI Mode</p>
          <h2 className="mt-3 text-2xl font-bold text-white">
            {settings.aiMode}
          </h2>
          <p className="mt-2 text-sm text-cyan-200/80">
            Current AI behavior
          </p>
        </div>

        <div className="rounded-3xl border border-purple-400/20 bg-purple-400/10 p-6 shadow-2xl shadow-black/20">
          <p className="text-sm font-semibold text-purple-300">Security</p>
          <h2 className="mt-3 text-2xl font-bold text-white">
            {settings.securityLevel}
          </h2>
          <p className="mt-2 text-sm text-purple-200/80">
            Workspace protection level
          </p>
        </div>
      </div>

      {/* Settings Form */}
      <form
        onSubmit={handleSaveSettings}
        className="mt-8 grid gap-6 xl:grid-cols-2"
      >
        {/* Workspace Profile */}
        <div className="rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl shadow-black/20">
          <h2 className="text-2xl font-bold text-white">Workspace Profile</h2>

          <p className="mt-2 text-sm text-slate-400">
            Basic details about your architecture workspace.
          </p>

          <div className="mt-6 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-300">
                Workspace Name
              </label>

              <input
                type="text"
                value={settings.workspaceName}
                onChange={(event) =>
                  updateField("workspaceName", event.target.value)
                }
                className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-300">
                Owner Name
              </label>

              <input
                type="text"
                value={settings.ownerName}
                onChange={(event) =>
                  updateField("ownerName", event.target.value)
                }
                className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-300">
                Owner Email
              </label>

              <input
                type="email"
                value={settings.ownerEmail}
                onChange={(event) =>
                  updateField("ownerEmail", event.target.value)
                }
                className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-300">
                Company Type
              </label>

              <select
                value={settings.companyType}
                onChange={(event) =>
                  updateField("companyType", event.target.value)
                }
                className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
              >
                <option>Architecture Firm</option>
                <option>Interior Design Studio</option>
                <option>Construction Company</option>
                <option>Real Estate Developer</option>
                <option>Freelance Architect</option>
              </select>
            </div>
          </div>
        </div>

        {/* AI Preferences */}
        <div className="rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl shadow-black/20">
          <h2 className="text-2xl font-bold text-white">AI Preferences</h2>

          <p className="mt-2 text-sm text-slate-400">
            Control how AI support should behave inside the platform.
          </p>

          <div className="mt-6 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-300">
                AI Assistance Mode
              </label>

              <select
                value={settings.aiMode}
                onChange={(event) => updateField("aiMode", event.target.value)}
                className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
              >
                <option>Balanced AI Assistance</option>
                <option>Creative Design Suggestions</option>
                <option>Technical Architecture Review</option>
                <option>Client-Friendly Explanations</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-300">
                Report Frequency
              </label>

              <select
                value={settings.reportFrequency}
                onChange={(event) =>
                  updateField("reportFrequency", event.target.value)
                }
                className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
              >
                <option>Daily</option>
                <option>Weekly</option>
                <option>Monthly</option>
                <option>Manual Only</option>
              </select>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-semibold text-white">
                    Project Notifications
                  </p>
                  <p className="mt-1 text-sm text-slate-400">
                    Receive updates for project progress and risk changes.
                  </p>
                </div>

                <input
                  type="checkbox"
                  checked={settings.notificationsEnabled}
                  onChange={(event) =>
                    updateField("notificationsEnabled", event.target.checked)
                  }
                  className="h-5 w-5 accent-cyan-400"
                />
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-semibold text-white">
                    Client Update Alerts
                  </p>
                  <p className="mt-1 text-sm text-slate-400">
                    Enable alerts for client feedback and approval changes.
                  </p>
                </div>

                <input
                  type="checkbox"
                  checked={settings.clientUpdatesEnabled}
                  onChange={(event) =>
                    updateField("clientUpdatesEnabled", event.target.checked)
                  }
                  className="h-5 w-5 accent-cyan-400"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl shadow-black/20">
          <h2 className="text-2xl font-bold text-white">Security Settings</h2>

          <p className="mt-2 text-sm text-slate-400">
            Placeholder security preferences for the workspace.
          </p>

          <div className="mt-6 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-300">
                Security Level
              </label>

              <select
                value={settings.securityLevel}
                onChange={(event) =>
                  updateField("securityLevel", event.target.value)
                }
                className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
              >
                <option>Standard</option>
                <option>Enhanced</option>
                <option>Enterprise</option>
              </select>
            </div>

            <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-5">
              <p className="font-bold text-cyan-300">Future Backend Features</p>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                Later, this section can include real login sessions, role-based
                access control, audit logs, password reset, and workspace
                permissions.
              </p>
            </div>
          </div>
        </div>

        {/* Subscription Placeholder */}
        <div className="rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl shadow-black/20">
          <h2 className="text-2xl font-bold text-white">Plan & Billing</h2>

          <p className="mt-2 text-sm text-slate-400">
            Placeholder for future SaaS subscription management.
          </p>

          <div className="mt-6 rounded-2xl border border-green-400/20 bg-green-400/10 p-5">
            <p className="text-sm font-semibold text-green-300">
              Current Plan
            </p>

            <h3 className="mt-2 text-3xl font-bold text-white">
              MVP Preview
            </h3>

            <p className="mt-3 text-sm leading-6 text-slate-300">
              This project is currently running as a frontend MVP. Real billing,
              organization plans, invoices, and payment integration can be added
              after backend setup.
            </p>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
              <p className="font-bold text-white">Users</p>
              <p className="mt-2 text-sm text-slate-400">
                Future team management
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
              <p className="font-bold text-white">Storage</p>
              <p className="mt-2 text-sm text-slate-400">
                Future file usage tracking
              </p>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="xl:col-span-2">
          <div className="rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl shadow-black/20">
            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  Save Workspace Settings
                </h2>

                <p className="mt-2 text-sm text-slate-400">
                  Settings are stored in browser localStorage for this MVP.
                </p>

                {savedMessage && (
                  <p className="mt-3 text-sm font-semibold text-green-300">
                    {savedMessage}
                  </p>
                )}
              </div>

              <div className="flex flex-wrap gap-4">
                <button
                  type="button"
                  onClick={handleResetSettings}
                  className="rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:border-red-400 hover:text-red-300"
                >
                  Reset
                </button>

                <button
                  type="submit"
                  className="rounded-xl bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-300"
                >
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}
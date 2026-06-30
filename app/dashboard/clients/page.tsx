"use client";

import { useEffect, useState } from "react";
import {
  createFeedback,
  deleteFeedback,
  getFeedback,
  updateFeedback,
} from "../../lib/api";

type ClientFeedback = {
  id: number;
  project_name: string;
  client_name: string;
  rating: number;
  feedback_text: string;
  approval_status: string;
  response_note?: string | null;
  sentiment_summary?: string | null;
  created_at?: string | null;
};

type FeedbackResponse = {
  total: number;
  feedback?: ClientFeedback[];
  feedbacks?: ClientFeedback[];
  client_feedback?: ClientFeedback[];
};

type FeedbackFormData = {
  project_name: string;
  client_name: string;
  rating: string;
  feedback_text: string;
  approval_status: string;
  response_note: string;
  sentiment_summary: string;
};

const initialFormData: FeedbackFormData = {
  project_name: "",
  client_name: "",
  rating: "4",
  feedback_text: "",
  approval_status: "Pending",
  response_note: "",
  sentiment_summary: "",
};

export default function ClientsPage() {
  const [feedbackList, setFeedbackList] = useState<ClientFeedback[]>([]);
  const [formData, setFormData] = useState<FeedbackFormData>(initialFormData);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function normalizeFeedback(response: FeedbackResponse) {
    return (
      response.feedback ||
      response.feedbacks ||
      response.client_feedback ||
      []
    );
  }

  async function loadFeedback() {
    try {
      setLoading(true);
      setError("");

      const response = (await getFeedback()) as FeedbackResponse;
      const feedbackData = normalizeFeedback(response);

      setFeedbackList(feedbackData);
    } catch (err) {
      console.error(err);
      setError("Unable to load client feedback. Please check backend connection.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadFeedback();
  }, []);

  function handleChange(
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (
      !formData.project_name ||
      !formData.client_name ||
      !formData.rating ||
      !formData.feedback_text ||
      !formData.approval_status
    ) {
      setError("Please fill all required fields before saving.");
      return;
    }

    const payload = {
      project_name: formData.project_name,
      client_name: formData.client_name,
      rating: Number(formData.rating),
      feedback_text: formData.feedback_text,
      approval_status: formData.approval_status,
      response_note: formData.response_note,
      sentiment_summary: formData.sentiment_summary,
    };

    try {
      setSaving(true);
      setError("");

      if (editingId) {
        await updateFeedback(editingId, payload);
      } else {
        await createFeedback(payload);
      }

      setFormData(initialFormData);
      setEditingId(null);
      await loadFeedback();
    } catch (err) {
      console.error(err);
      setError("Unable to save client feedback. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  function handleEdit(feedback: ClientFeedback) {
    setEditingId(feedback.id);

    setFormData({
      project_name: feedback.project_name,
      client_name: feedback.client_name,
      rating: String(feedback.rating),
      feedback_text: feedback.feedback_text,
      approval_status: feedback.approval_status,
      response_note: feedback.response_note || "",
      sentiment_summary: feedback.sentiment_summary || "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function handleDelete(feedbackId: number) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this client feedback?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      setError("");
      await deleteFeedback(feedbackId);
      await loadFeedback();
    } catch (err) {
      console.error(err);
      setError("Unable to delete client feedback. Please try again.");
    }
  }

  function handleCancelEdit() {
    setEditingId(null);
    setFormData(initialFormData);
    setError("");
  }

  function getApprovalStyle(status: string) {
    const normalizedStatus = status.toLowerCase();

    if (normalizedStatus.includes("approved")) {
      return "border-emerald-500/30 bg-emerald-500/10 text-emerald-300";
    }

    if (normalizedStatus.includes("pending")) {
      return "border-amber-500/30 bg-amber-500/10 text-amber-300";
    }

    if (normalizedStatus.includes("rejected")) {
      return "border-red-500/30 bg-red-500/10 text-red-300";
    }

    return "border-slate-500/30 bg-slate-500/10 text-slate-300";
  }

  function renderRating(rating: number) {
    return "★".repeat(rating) + "☆".repeat(5 - rating);
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-7xl space-y-8 px-6 py-8">
        <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl shadow-black/20">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.25em] text-cyan-400">
                Client Engagement
              </p>

              <h1 className="mt-3 text-3xl font-bold tracking-tight text-white">
                Clients & Feedback
              </h1>

              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">
                Manage client feedback, approval status, design revision notes,
                and sentiment summaries for architecture projects.
              </p>
            </div>

            <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/10 px-5 py-4 text-right">
              <p className="text-sm text-cyan-200">Saved Feedback</p>
              <p className="mt-1 text-3xl font-bold text-white">
                {feedbackList.length}
              </p>
            </div>
          </div>
        </section>

        {error && (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-sm text-red-200">
            {error}
          </div>
        )}

        <section className="grid gap-8 xl:grid-cols-[420px_1fr]">
          <form
            onSubmit={handleSubmit}
            className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl shadow-black/20"
          >
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-white">
                {editingId ? "Update Client Feedback" : "Add Client Feedback"}
              </h2>

              <p className="mt-2 text-sm text-slate-400">
                Save client feedback directly to the FastAPI backend.
              </p>
            </div>

            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Project Name
                </label>
                <input
                  name="project_name"
                  value={formData.project_name}
                  onChange={handleChange}
                  placeholder="Urban Nest Co-Living Hub"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Client Name
                </label>
                <input
                  name="client_name"
                  value={formData.client_name}
                  onChange={handleChange}
                  placeholder="NestSpace Developers"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Rating
                  </label>
                  <select
                    name="rating"
                    value={formData.rating}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400"
                  >
                    <option value="5">5 - Excellent</option>
                    <option value="4">4 - Good</option>
                    <option value="3">3 - Average</option>
                    <option value="2">2 - Poor</option>
                    <option value="1">1 - Very Poor</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Approval Status
                  </label>
                  <select
                    name="approval_status"
                    value={formData.approval_status}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400"
                  >
                    <option>Pending</option>
                    <option>Approved</option>
                    <option>Needs Revision</option>
                    <option>Rejected</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Feedback Text
                </label>
                <textarea
                  name="feedback_text"
                  value={formData.feedback_text}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Write client feedback here..."
                  className="w-full resize-none rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Response Note
                </label>
                <textarea
                  name="response_note"
                  value={formData.response_note}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Write design team response here..."
                  className="w-full resize-none rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Sentiment Summary
                </label>
                <textarea
                  name="sentiment_summary"
                  value={formData.sentiment_summary}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Client sentiment is positive..."
                  className="w-full resize-none rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 rounded-xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving
                    ? "Saving..."
                    : editingId
                    ? "Update Feedback"
                    : "Save Feedback"}
                </button>

                {editingId && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="rounded-xl border border-slate-700 px-5 py-3 text-sm font-semibold text-slate-300 transition hover:border-slate-500 hover:text-white"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </form>

          <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl shadow-black/20">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-white">
                Saved Client Feedback
              </h2>

              <p className="mt-2 text-sm text-slate-400">
                Feedback records loaded directly from your backend API.
              </p>
            </div>

            {loading ? (
              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-8 text-center text-sm text-slate-400">
                Loading client feedback...
              </div>
            ) : feedbackList.length === 0 ? (
              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-8 text-center">
                <h3 className="text-lg font-semibold text-white">
                  No feedback found
                </h3>
                <p className="mt-2 text-sm text-slate-400">
                  Add client feedback using the form.
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                {feedbackList.map((feedback) => (
                  <article
                    key={feedback.id}
                    className="rounded-2xl border border-slate-800 bg-slate-950 p-5 transition hover:border-cyan-500/40"
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className="text-lg font-semibold text-white">
                            {feedback.project_name}
                          </h3>

                          <span
                            className={`rounded-full border px-3 py-1 text-xs font-semibold ${getApprovalStyle(
                              feedback.approval_status
                            )}`}
                          >
                            {feedback.approval_status}
                          </span>
                        </div>

                        <p className="mt-2 text-sm text-slate-400">
                          Client: {feedback.client_name}
                        </p>

                        <p className="mt-2 text-sm font-semibold text-amber-300">
                          {renderRating(feedback.rating)}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(feedback)}
                          className="rounded-lg border border-slate-700 px-4 py-2 text-xs font-semibold text-slate-300 transition hover:border-cyan-400 hover:text-cyan-300"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => handleDelete(feedback.id)}
                          className="rounded-lg border border-red-500/30 px-4 py-2 text-xs font-semibold text-red-300 transition hover:border-red-400 hover:text-red-200"
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                    <div className="mt-5 space-y-4">
                      <div>
                        <h4 className="text-sm font-semibold text-slate-200">
                          Client Feedback
                        </h4>
                        <p className="mt-2 text-sm leading-6 text-slate-400">
                          {feedback.feedback_text}
                        </p>
                      </div>

                      {feedback.response_note && (
                        <div>
                          <h4 className="text-sm font-semibold text-slate-200">
                            Design Team Response
                          </h4>
                          <p className="mt-2 text-sm leading-6 text-slate-400">
                            {feedback.response_note}
                          </p>
                        </div>
                      )}

                      {feedback.sentiment_summary && (
                        <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/10 p-4">
                          <h4 className="text-sm font-semibold text-cyan-200">
                            Sentiment Summary
                          </h4>
                          <p className="mt-2 text-sm leading-6 text-cyan-50/80">
                            {feedback.sentiment_summary}
                          </p>
                        </div>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </section>
      </div>
    </main>
  );
}
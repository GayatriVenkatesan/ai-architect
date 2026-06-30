"use client";

import { FormEvent, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { sendChatMessage } from "../../lib/api";

type Message = {
  role: "user" | "assistant";
  content: string;
};

type ChatResponse = {
  reply: string;
};

function cleanMarkdown(content: string) {
  return content
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/&nbsp;/gi, " ")
    .trim();
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello, I am ArchiFlow AI Assistant. Ask me about project planning, client requirements, interiors, construction monitoring, documents, or client feedback.",
    },
  ]);

  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");

  async function handleSendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedInput = input.trim();

    if (!trimmedInput) {
      return;
    }

    const userMessage: Message = {
      role: "user",
      content: trimmedInput,
    };

    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInput("");
    setIsSending(true);
    setError("");

    try {
      const response = (await sendChatMessage({
        message: trimmedInput,
        history: messages,
      })) as ChatResponse;

      const assistantMessage: Message = {
        role: "assistant",
        content: response.reply,
      };

      setMessages([...updatedMessages, assistantMessage]);
    } catch {
      setError(
        "Unable to get AI response. Check backend server, Groq API key, and internet connection."
      );
    } finally {
      setIsSending(false);
    }
  }

  function handlePromptClick(prompt: string) {
    setInput(prompt);
  }

  const samplePrompts = [
    "Suggest improvements for Urban Nest Co-Living Hub.",
    "Create a client response note for pending feedback.",
    "List construction risks for a G+3 co-living project.",
    "Suggest interior ideas for a shared lounge area.",
    "Prepare requirement summary for a modern residential project.",
  ];

  return (
    <div className="flex h-[calc(100vh-64px)] flex-col overflow-hidden text-white">
      <header className="mb-5 shrink-0">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">
          AI Assistant
        </p>

        <div className="mt-2 flex flex-col justify-between gap-3 xl:flex-row xl:items-end">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">
              ArchiFlow AI Chatbot
            </h1>

            <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-400">
              Ask project-specific questions and get AI-powered guidance for
              architecture planning, requirements, interiors, construction,
              documents, and client feedback.
            </p>
          </div>

          <div className="hidden rounded-full border border-cyan-400/30 bg-cyan-400/10 px-5 py-2 text-sm font-semibold text-cyan-300 xl:block">
            Groq API Connected
          </div>
        </div>
      </header>

      <div className="grid min-h-0 flex-1 gap-5 xl:grid-cols-[minmax(0,1fr)_300px] 2xl:grid-cols-[minmax(0,1fr)_340px]">
        <section className="flex min-h-0 flex-col rounded-3xl border border-white/10 bg-white/[0.03] shadow-2xl shadow-black/20">
          <div className="shrink-0 border-b border-white/10 px-6 py-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold">Conversation</h2>

                <p className="mt-1 text-sm text-slate-400">
                  Powered by FastAPI backend and Groq API
                </p>
              </div>

              <div className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-300">
                Live AI
              </div>
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6">
            <div className="space-y-5">
              {messages.map((message, index) => (
                <div
                  key={`${message.role}-${index}`}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`rounded-2xl px-5 py-4 text-sm leading-6 ${
                      message.role === "user"
                        ? "max-w-[72%] bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-400/10"
                        : "max-w-[88%] border border-white/10 bg-slate-900 text-slate-200"
                    }`}
                  >
                    <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] opacity-70">
                      {message.role === "user" ? "You" : "ArchiFlow AI"}
                    </p>

                    {message.role === "assistant" ? (
                      <div className="chatbot-markdown">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            h1: ({ children }) => (
                              <h1 className="mb-3 text-2xl font-bold text-white">
                                {children}
                              </h1>
                            ),
                            h2: ({ children }) => (
                              <h2 className="mb-3 mt-4 text-xl font-bold text-white">
                                {children}
                              </h2>
                            ),
                            h3: ({ children }) => (
                              <h3 className="mb-2 mt-4 text-lg font-bold text-cyan-300">
                                {children}
                              </h3>
                            ),
                            p: ({ children }) => (
                              <p className="mb-3 text-sm leading-7 text-slate-200">
                                {children}
                              </p>
                            ),
                            strong: ({ children }) => (
                              <strong className="font-bold text-white">
                                {children}
                              </strong>
                            ),
                            ul: ({ children }) => (
                              <ul className="mb-4 ml-5 list-disc space-y-2 text-slate-200">
                                {children}
                              </ul>
                            ),
                            ol: ({ children }) => (
                              <ol className="mb-4 ml-5 list-decimal space-y-2 text-slate-200">
                                {children}
                              </ol>
                            ),
                            li: ({ children }) => (
                              <li className="text-sm leading-7">{children}</li>
                            ),
                            table: ({ children }) => (
                              <div className="my-4 max-w-full overflow-x-auto rounded-2xl border border-white/10">
                                <table className="w-full min-w-[720px] border-collapse text-left text-sm">
                                  {children}
                                </table>
                              </div>
                            ),
                            thead: ({ children }) => (
                              <thead className="bg-white/10 text-cyan-300">
                                {children}
                              </thead>
                            ),
                            tbody: ({ children }) => (
                              <tbody className="divide-y divide-white/10">
                                {children}
                              </tbody>
                            ),
                            th: ({ children }) => (
                              <th className="px-4 py-3 font-bold">
                                {children}
                              </th>
                            ),
                            td: ({ children }) => (
                              <td className="px-4 py-3 align-top text-slate-200">
                                {children}
                              </td>
                            ),
                            code: ({ children }) => (
                              <code className="rounded bg-black/30 px-2 py-1 text-cyan-300">
                                {children}
                              </code>
                            ),
                          }}
                        >
                          {cleanMarkdown(message.content)}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <p className="whitespace-pre-line text-sm leading-7">
                        {message.content}
                      </p>
                    )}
                  </div>
                </div>
              ))}

              {isSending && (
                <div className="flex justify-start">
                  <div className="rounded-2xl border border-white/10 bg-slate-900 px-5 py-4 text-sm text-slate-300">
                    ArchiFlow AI is thinking...
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="shrink-0 border-t border-white/10 bg-slate-950/80 px-6 py-5 backdrop-blur">
            {error && (
              <div className="mb-4 rounded-2xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            )}

            <form onSubmit={handleSendMessage} className="flex gap-3">
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask about Urban Nest Co-Living Hub..."
                className="min-h-14 flex-1 rounded-2xl border border-white/10 bg-slate-900 px-5 py-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400"
              />

              <button
                type="submit"
                disabled={isSending}
                className="min-h-14 rounded-2xl bg-cyan-400 px-8 py-4 text-sm font-bold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSending ? "Sending..." : "Send"}
              </button>
            </form>
          </div>
        </section>

        <aside className="hidden min-h-0 space-y-5 overflow-y-auto xl:block">
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
            <h2 className="text-lg font-bold">Try these prompts</h2>

            <div className="mt-4 space-y-3">
              {samplePrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => handlePromptClick(prompt)}
                  className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-left text-sm leading-6 text-slate-300 transition hover:border-cyan-400/60 hover:text-cyan-300"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
            <h2 className="text-lg font-bold">Connection Status</h2>

            <div className="mt-4 space-y-3 text-sm text-slate-300">
              <div className="flex items-center justify-between rounded-2xl bg-slate-900 px-4 py-3">
                <span>Frontend</span>
                <span className="font-semibold text-emerald-300">Ready</span>
              </div>

              <div className="flex items-center justify-between rounded-2xl bg-slate-900 px-4 py-3">
                <span>FastAPI</span>
                <span className="font-semibold text-emerald-300">
                  Connected
                </span>
              </div>

              <div className="flex items-center justify-between rounded-2xl bg-slate-900 px-4 py-3">
                <span>Groq API</span>
                <span className="font-semibold text-cyan-300">Live AI</span>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
            <h2 className="text-lg font-bold">Best Use Cases</h2>

            <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
              <li>• Client requirement clarification</li>
              <li>• Interior design suggestions</li>
              <li>• Construction risk explanation</li>
              <li>• Feedback response drafting</li>
              <li>• Project planning guidance</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
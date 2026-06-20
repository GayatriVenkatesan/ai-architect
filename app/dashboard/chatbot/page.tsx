"use client";

import { useEffect, useState } from "react";

type DelayRisk = "Low" | "Medium" | "High";

type Project = {
  id: string;
  name: string;
  client: string;
  location: string;
  stage: string;
  revenue: number;
  progress: number;
  clientSatisfaction: number;
  delayRisk: DelayRisk;
};

type ChatMessage = {
  id: string;
  sender: "client" | "assistant";
  text: string;
};

const STORAGE_KEY = "archiflow-projects";

const defaultProjects: Project[] = [
  {
    id: "project-1",
    name: "Luxury Villa Design",
    client: "Rohan Sharma",
    location: "Chennai",
    stage: "Design Planning",
    revenue: 8500000,
    progress: 42,
    clientSatisfaction: 88,
    delayRisk: "Medium",
  },
  {
    id: "project-2",
    name: "Apartment Interior Plan",
    client: "Meera Homes",
    location: "Bengaluru",
    stage: "Interior Design",
    revenue: 1800000,
    progress: 68,
    clientSatisfaction: 94,
    delayRisk: "Low",
  },
];

const suggestedQuestions = [
  "What is my project progress?",
  "What is the current stage?",
  "Is there any delay risk?",
  "What is my project budget?",
  "Where is my project located?",
  "Is the client satisfaction good?",
];

function formatCurrency(amount: number) {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(1)}Cr`;
  }

  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(1)}L`;
  }

  return `₹${amount.toLocaleString("en-IN")}`;
}

function createBotReply(question: string, project: Project) {
  const lowerQuestion = question.toLowerCase();

  if (
    lowerQuestion.includes("progress") ||
    lowerQuestion.includes("completion") ||
    lowerQuestion.includes("complete")
  ) {
    return `${project.name} is currently ${project.progress}% complete. The project is in the "${project.stage}" stage.`;
  }

  if (
    lowerQuestion.includes("stage") ||
    lowerQuestion.includes("status") ||
    lowerQuestion.includes("current")
  ) {
    return `The current stage of ${project.name} is "${project.stage}". The next action depends on approval, design updates, or construction progress.`;
  }

  if (
    lowerQuestion.includes("delay") ||
    lowerQuestion.includes("risk") ||
    lowerQuestion.includes("late")
  ) {
    if (project.delayRisk === "Low") {
      return `The delay risk for ${project.name} is Low. The project looks stable right now.`;
    }

    if (project.delayRisk === "Medium") {
      return `The delay risk for ${project.name} is Medium. The team should monitor progress and approvals carefully.`;
    }

    return `The delay risk for ${project.name} is High. This project needs urgent attention from the project manager.`;
  }

  if (
    lowerQuestion.includes("budget") ||
    lowerQuestion.includes("cost") ||
    lowerQuestion.includes("revenue") ||
    lowerQuestion.includes("amount")
  ) {
    return `The estimated project value for ${project.name} is ${formatCurrency(
      project.revenue
    )}. This is currently treated as the project budget/value in the MVP.`;
  }

  if (
    lowerQuestion.includes("location") ||
    lowerQuestion.includes("place") ||
    lowerQuestion.includes("site")
  ) {
    return `${project.name} is located in ${project.location}.`;
  }

  if (
    lowerQuestion.includes("satisfaction") ||
    lowerQuestion.includes("feedback") ||
    lowerQuestion.includes("happy")
  ) {
    return `The client satisfaction score for ${project.name} is ${project.clientSatisfaction}%. This indicates the current client feedback level.`;
  }

  if (
    lowerQuestion.includes("approval") ||
    lowerQuestion.includes("approve")
  ) {
    return `For ${project.name}, approval items may include floor plan approval, interior mood board approval, and budget confirmation. In the next version, we can connect this with the Client Portal approval section.`;
  }

  if (
    lowerQuestion.includes("hello") ||
    lowerQuestion.includes("hi") ||
    lowerQuestion.includes("hey")
  ) {
    return `Hello! I am ArchiFlow AI Assistant. I can help you understand the progress, stage, budget, delay risk, and client status of ${project.name}.`;
  }

  return `I understood your question. For ${project.name}, the current stage is "${project.stage}", progress is ${project.progress}%, delay risk is ${project.delayRisk}, and project value is ${formatCurrency(
    project.revenue
  )}.`;
}

export default function ChatbotPage() {
  const [projects, setProjects] = useState<Project[]>(defaultProjects);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome-message",
      sender: "assistant",
      text: "Hello! I am ArchiFlow AI Assistant. Select a project and ask me about progress, stage, delay risk, budget, or client satisfaction.",
    },
  ]);

  useEffect(() => {
    const storedProjects = localStorage.getItem(STORAGE_KEY);

    if (storedProjects) {
      const parsedProjects = JSON.parse(storedProjects);
      setProjects(parsedProjects);

      if (parsedProjects.length > 0) {
        setSelectedProjectId(parsedProjects[0].id);
      }
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultProjects));
      setSelectedProjectId(defaultProjects[0].id);
    }
  }, []);

  const selectedProject =
    projects.find((project) => project.id === selectedProjectId) || projects[0];

  function handleSendMessage(customQuestion?: string) {
    const question = customQuestion || inputMessage;

    if (!question.trim()) {
      alert("Please enter a message.");
      return;
    }

    const clientMessage: ChatMessage = {
      id: `client-${Date.now()}`,
      sender: "client",
      text: question,
    };

    const assistantMessage: ChatMessage = {
      id: `assistant-${Date.now() + 1}`,
      sender: "assistant",
      text: createBotReply(question, selectedProject),
    };

    setMessages((previousMessages) => [
      ...previousMessages,
      clientMessage,
      assistantMessage,
    ]);

    setInputMessage("");
  }

  function handleClearChat() {
    setMessages([
      {
        id: "welcome-message",
        sender: "assistant",
        text: "Chat cleared. Ask me anything about the selected project.",
      },
    ]);
  }

  if (!selectedProject) {
    return (
      <div className="rounded-3xl border border-white/10 bg-slate-900 p-6">
        <h1 className="text-3xl font-bold text-white">No Projects Found</h1>
        <p className="mt-3 text-slate-400">
          Add a project first from the Projects page.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Page Header */}
      <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-start">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.35em] text-cyan-300">
            AI Chatbot
          </p>

          <h1 className="mt-4 text-4xl font-bold tracking-tight text-white">
            AI Client Conversation Assistant
          </h1>

          <p className="mt-3 max-w-3xl text-base leading-7 text-slate-300">
            Let clients ask questions about project progress, stage, budget,
            delay risk, location, approvals, and satisfaction using project data
            from localStorage.
          </p>
        </div>

        <button
          type="button"
          onClick={handleClearChat}
          className="rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:border-cyan-400 hover:text-cyan-300"
        >
          Clear Chat
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid gap-6 xl:grid-cols-3">
        {/* Chat Section */}
        <div className="rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl shadow-black/20 xl:col-span-2">
          <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h2 className="text-2xl font-bold text-white">
                Client Chat Window
              </h2>

              <p className="mt-2 text-sm text-slate-400">
                The assistant replies based on the selected project details.
              </p>
            </div>

            <select
              value={selectedProjectId}
              onChange={(event) => setSelectedProjectId(event.target.value)}
              className="rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
            >
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name} - {project.client}
                </option>
              ))}
            </select>
          </div>

          {/* Messages */}
          <div className="h-[520px] overflow-y-auto rounded-3xl border border-white/10 bg-slate-950/70 p-5">
            <div className="space-y-5">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === "client"
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-5 py-4 text-sm leading-6 ${
                      message.sender === "client"
                        ? "bg-cyan-400 text-slate-950"
                        : "border border-white/10 bg-slate-900 text-slate-300"
                    }`}
                  >
                    <p className="mb-1 text-xs font-bold uppercase tracking-[0.2em] opacity-70">
                      {message.sender === "client" ? "Client" : "ArchiFlow AI"}
                    </p>

                    <p>{message.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="mt-5 flex flex-col gap-4 md:flex-row">
            <input
              type="text"
              value={inputMessage}
              onChange={(event) => setInputMessage(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  handleSendMessage();
                }
              }}
              placeholder="Ask about project progress, budget, delay risk..."
              className="flex-1 rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400"
            />

            <button
              type="button"
              onClick={() => handleSendMessage()}
              className="rounded-xl bg-cyan-400 px-6 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-300"
            >
              Send
            </button>
          </div>
        </div>

        {/* Project Context */}
        <div className="space-y-6">
          <div className="rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl shadow-black/20">
            <h2 className="text-2xl font-bold text-white">
              Selected Project
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              The chatbot uses this project as context.
            </p>

            <div className="mt-6 space-y-4">
              <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                <p className="text-sm text-slate-400">Project</p>
                <p className="mt-1 font-semibold text-white">
                  {selectedProject.name}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                <p className="text-sm text-slate-400">Client</p>
                <p className="mt-1 font-semibold text-white">
                  {selectedProject.client}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                <p className="text-sm text-slate-400">Stage</p>
                <p className="mt-1 font-semibold text-white">
                  {selectedProject.stage}
                </p>
              </div>

              <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4">
                <p className="text-sm font-semibold text-cyan-300">
                  Progress
                </p>
                <p className="mt-1 text-3xl font-bold text-white">
                  {selectedProject.progress}%
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                <p className="text-sm text-slate-400">Project Value</p>
                <p className="mt-1 font-semibold text-white">
                  {formatCurrency(selectedProject.revenue)}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl shadow-black/20">
            <h2 className="text-2xl font-bold text-white">
              Suggested Questions
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              Click any question to test the chatbot.
            </p>

            <div className="mt-5 space-y-3">
              {suggestedQuestions.map((question) => (
                <button
                  key={question}
                  type="button"
                  onClick={() => handleSendMessage(question)}
                  className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-left text-sm text-slate-300 transition hover:border-cyan-400 hover:text-cyan-300"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
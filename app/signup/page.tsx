import Link from "next/link";

export default function SignupPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-6 py-12">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl">
        <div className="mb-8 text-center">
          <Link href="/" className="text-sm font-semibold text-cyan-600">
            ← Back to Home
          </Link>

          <h1 className="mt-6 text-3xl font-bold text-slate-950">
            Create Workspace
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Start managing architecture projects with AI
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Full Name
            </label>
            <input
              type="text"
              placeholder="Enter your full name"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Email Address
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Role
            </label>
            <select className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100">
              <option>Architect</option>
              <option>Interior Designer</option>
              <option>Project Manager</option>
              <option>Construction Supervisor</option>
              <option>Client</option>
              <option>Admin</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Password
            </label>
            <input
              type="password"
              placeholder="Create a password"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
            />
          </div>

          <Link
            href="/dashboard"
            className="block w-full rounded-xl bg-cyan-500 px-4 py-3 text-center font-semibold text-white transition hover:bg-cyan-600"
          >
            Create Account
          </Link>
        </div>

        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-cyan-600">
            Login
          </Link>
        </p>
      </div>
    </main>
  );
}

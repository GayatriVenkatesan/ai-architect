import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-6 py-12">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl">
        <div className="mb-8 text-center">
          <Link href="/" className="text-sm font-semibold text-cyan-600">
            ← Back to Home
          </Link>

          <h1 className="mt-6 text-3xl font-bold text-slate-950">
            Welcome Back
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Login to your ArchiFlow AI workspace
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Email Address
            </label>
            <input
              type="email"
              placeholder="architect@example.com"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-slate-600">
              <input type="checkbox" className="h-4 w-4 rounded" />
              Remember me
            </label>

            <a href="#" className="font-medium text-cyan-600">
              Forgot password?
            </a>
          </div>

          <Link
            href="/dashboard"
            className="block w-full rounded-xl bg-slate-950 px-4 py-3 text-center font-semibold text-white transition hover:bg-slate-800"
          >
            Login
          </Link>
        </div>

        <p className="mt-6 text-center text-sm text-slate-500">
          New to ArchiFlow AI?{" "}
          <Link href="/signup" className="font-semibold text-cyan-600">
            Create account
          </Link>
        </p>
      </div>
    </main>
  );
}
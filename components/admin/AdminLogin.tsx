"use client";

import { useState } from "react";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(result.error || "Unable to sign in.");
      window.location.href = window.location.hostname.startsWith("admin.") ? "/" : "/admin";
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to sign in.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0a0a0a] px-5 text-white">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#151515] p-8 shadow-2xl sm:p-10">
        <div className="mb-10">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-[#f5c400]">Be An Athlete</p>
          <h1 className="font-display text-4xl">Admin sign in</h1>
          <p className="mt-3 text-sm leading-relaxed text-white/55">Use the single administrator user ID and password.</p>
        </div>
        <form onSubmit={submit} className="space-y-5">
          <label className="block">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-white/55">User ID</span>
            <input
              autoFocus
              autoComplete="username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className="w-full rounded-lg border border-white/10 bg-black/30 px-4 py-3 outline-none transition focus:border-[#f5c400]"
              required
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-white/55">Password</span>
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-lg border border-white/10 bg-black/30 px-4 py-3 outline-none transition focus:border-[#f5c400]"
              required
            />
          </label>
          {error && <p role="alert" className="rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</p>}
          <button
            disabled={loading}
            className="w-full rounded-lg bg-[#f5c400] px-5 py-3 font-bold uppercase tracking-wider text-black transition hover:bg-[#ffd633] disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </main>
  );
}

"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password === "OPS123") {
      sessionStorage.setItem("auth", "true");
      router.push("/upload");
    } else {
      setError("Incorrect password. Please try again.");
      setPassword("");
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-full max-w-md px-4">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Meridian Health
          </h1>
          <p className="mt-2 text-xs text-white/40 tracking-widest uppercase">
            Sales Intelligence
          </p>
        </div>

        <div className="bg-[#00e5cc] rounded-2xl p-8">
          <h2 className="text-black text-xl font-semibold mb-6">
            Enter Access Password
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(""); }}
              placeholder="Password"
              className="w-full bg-black text-white placeholder-white/40 border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-white/30"
              autoFocus
            />
            {error && (
              <p className="text-red-800 text-sm font-medium">{error}</p>
            )}
            <button
              type="submit"
              className="w-full bg-black text-white font-semibold py-3 rounded-lg hover:bg-white hover:text-black transition-colors duration-200 cursor-pointer"
            >
              Access Dashboard
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

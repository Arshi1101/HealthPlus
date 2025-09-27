"use client";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import ThemeToggle from "../../../components/ThemeToggle";

export default function SignupPage() {
  const { signUpEmail } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user"); // default role
  const [showPassword, setShowPassword] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    try {
      // Pass role to auth context function
      await signUpEmail(email, password, role);
      router.replace("/setup");
    } catch (error: any) {
      setErr(error?.message ?? "Signup failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="w-screen h-screen flex justify-center items-center bg-[url('/bg.png')] bg-cover bg-center bg-no-repeat px-4">
      <div className="w-full max-w-md sm:w-1/2 h-auto bg-white/70 border rounded-2xl shadow-xl flex flex-col justify-center px-6 py-6">
        <h1 className="text-3xl font-bold text-center text-black mb-4">
          Health<span className="text-indigo-600">Plus</span>🍃
        </h1>
        <h3 className="text-xl font-bold text-center text-black mb-6">
          Create Account
        </h3>

        <form onSubmit={handleSignup} className="flex flex-col gap-4">
          <input
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div className="relative w-full">
            <input
              className="w-full rounded-xl border border-gray-300 px-4 py-3 pr-12 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Password (min 6 chars)"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-indigo-600 hover:text-indigo-400"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {/* New Role Selector */}
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="user">User</option>
            <option value="admin">Admin / Family / Trainer</option>
          </select>

          {err && <p className="text-sm text-red-500">{err}</p>}

          <div className="flex justify-center">
            <button
              disabled={busy}
              className="w-1/2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-3 transition disabled:opacity-50"
            >
              {busy ? "Please wait..." : "Sign Up"}
            </button>
          </div>
        </form>

        <div className="mt-6 flex flex-col sm:flex-row sm:justify-between sm:items-center text-lg text-black gap-3 sm:gap-0">
          <button
            type="button"
            onClick={() => router.push("/")}
            className="underline text-indigo-600 hover:text-indigo-400 flex items-center justify-center"
          >
            <span className="mr-1">👈</span> Go Back
          </button>

          <p className="text-center sm:text-right">
            Already have an account?{" "}
            <a
              className="underline text-indigo-600 hover:text-indigo-400"
              href="/auth/login"
            >
              Log in
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";

export default function LoginPage() {
  const { signInEmail, signInWithGoogle } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const { user } = useAuth();
  const [role, setRole] = useState("user");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
  let mounted = true;

  const timer = setTimeout(() => {
    if (mounted) setShowLoader(false);
  }, 3000);

  return () => {
    mounted = false;
    clearTimeout(timer);
  };
}, []);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    try {
      await signInEmail(email, password);
      if (user.role === "admin") {
  router.replace("/dashboard-choice"); // same dashboard, but will show connected users
} else {
  router.replace("/dashboard-choice"); // normal user view
}

    } catch (error: any) {
      setErr(error?.message ?? "Login failed");
    } finally {
      setBusy(false);
    }
  };

  const handleGoogle = async () => {
    setBusy(true);
    setErr(null);
    try {
      await signInWithGoogle();
      if (user.role === "admin") {
  router.replace("/dashboard-choice"); // same dashboard, but will show connected users
} else {
  router.replace("/dashboard-choice"); // normal user view
}

    } catch (error: any) {
      setErr(error?.message ?? "Google sign-in failed");
    } finally {
      setBusy(false);
    }
  };

  if (showLoader) {
    return (
     <div className="flex fixed inset-0 items-center justify-center  w-screen h-screen"> 
     <div className="loader-container">
       <div className="loader">
  <span className="item"></span>
  <span className="item"></span>
  <span className="item"></span>
  <span className="item"></span>
</div>
    </div>
    </div>
  );
  }

  
  return (
    

    <main className="relative  w-screen h-screen flex items-center justify-center bg-[url('/bgg.png')] bg-cover bg-center bg-no-repeat px-4">
  
  <div className="w-full max-w-md sm:w-1/2 h-auto bg-white/20 border border-xl border-black rounded-2xl shadow-xl border  flex flex-col justify-center px-6 py-6">
    <h1 className="text-3xl font-bold text-center bg-clip-text  mb-4">
      Health<span className="text-indigo-600 ">Plus</span>🍃
    </h1>
    <h3 className="text-xl font-bold text-center text-black mb-6">
      Welcome Back!
    </h3>

    <form onSubmit={handleEmailLogin} className="flex flex-col gap-4">
      <input
        className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        placeholder="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      {/* Password with toggle */}
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

      {err && <p className="text-sm text-red-500">{err}</p>}

      <div className="flex justify-center">
        <button
          disabled={busy}
          className="w-2/5 rounded-xl bg-indigo-600 hover:bg-indigo-900 text-white font-medium px-4 py-3 transition border border-black disabled:opacity-50"
        >
          {busy ? "Please wait..." : "Login"}
        </button>
      </div>
    </form>

    {/* Bottom links */}
    <div className="mt-6 flex flex-col sm:flex-row sm:justify-between sm:items-center text-lg text-black gap-3 sm:gap-0">
      

      {/* Already have an account */}
      <p className="text-center sm:text-right">
        Dont have an account?{" "}
        <a
          className="underline text-purple-800  hover:text-blue-500"
          href="/auth/signup"
        >
          Sign in
        </a>
      </p>
    </div>
      </div>
      
    </main>
    
  );
}
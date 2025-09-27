"use client";

import { useState } from "react";
import { db } from "@/lib/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import ThemeToggle from "../../components/ThemeToggle";

export default function CreateGroup() {
  const { user } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);

  const handleCreate = async () => {
    if (!name.trim()) {
      alert("Please enter a group name");
      return;
    }

    setBusy(true);
    try {
      const docRef = await addDoc(collection(db, "groups"), {
        name,
        adminId: user?.uid,
        members: [user?.uid],
        createdAt: serverTimestamp(),
      });

      router.push(`/groups/${docRef.id}`);
    } catch (err) {
      console.error("Error creating group:", err);
      alert("Failed to create group. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-black via-indigo-400 dark:from-cyan-200 dark:to-cyan-200 dark:via-purple-100  to-black px-4 relative">
      <div className="absolute top-4 left-4">
        <ThemeToggle />
      </div>

      <div className="bg-black/70 backdrop-blur-md border border-white/50 dark:border-xl dark:border-black dark:bg-black/30  rounded-2xl shadow-lg w-full max-w-4xl flex overflow-hidden">
        {/* Left side - Image */}
        <div className="w-1/2 hidden sm:block">
          <img
            src="/people.png"
            alt="People"
            className="h-full w-full object-cover"
          />
        </div>

        {/* Right side - Form */}
        <div className="w-full sm:w-1/2 p-8 flex flex-col justify-center">
          <h1 className="text-3xl font-bold text-white dark:text-white text-center mb-6">
            Create Your Group💟
          </h1>

          <input
            type="text"
            placeholder="Enter Group Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-green-500 text-black"
          />

          <button
            onClick={handleCreate}
            disabled={busy}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl transition disabled:opacity-50"
          >
            {busy ? "Creating..." : "Create Group"}
          </button>
        </div>
      </div>
    </main>
  );
}
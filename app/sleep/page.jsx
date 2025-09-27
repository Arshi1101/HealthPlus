"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { doc, collection, addDoc } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import TopMenuButton from "../../components/TopMenuButton";

export default function SleepLogPage() {
  const [bedtime, setBedtime] = useState("");
  const [wakeup, setWakeup] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  const today = new Date().toISOString().split("T")[0]; // 📅 current date

  const calculateDuration = (bed, wake) => {
    const [bh, bm] = bed.split(":").map(Number);
    const [wh, wm] = wake.split(":").map(Number);

    let start = new Date();
    start.setHours(bh, bm, 0, 0);

    let end = new Date();
    end.setHours(wh, wm, 0, 0);

    if (end <= start) {
      // wake up is next day
      end.setDate(end.getDate() + 1);
    }

    const diff = (end - start) / (1000 * 60 * 60); // in hours
    return diff.toFixed(1); // round to 1 decimal
  };

  const logSleep = async () => {
    if (!user) {
      alert("⚠️ Please log in to track sleep.");
      return;
    }
    if (!bedtime || !wakeup) {
      alert("⚠️ Please enter both bedtime and wake-up time.");
      return;
    }

    setLoading(true);
    try {
      const duration = calculateDuration(bedtime, wakeup);

      const userDoc = doc(db, "sleepLogs", user.uid);
      const dayCollection = collection(userDoc, today);

      await addDoc(dayCollection, {
        bedtime,
        wakeup,
        duration: Number(duration),
        date: today,
        userId: user.uid, // store user ID as well
        loggedAt: new Date(),
      });

      alert(`✅ Sleep logged! Duration: ${duration} hrs`);
      setBedtime("");
      setWakeup("");
    } catch (err) {
      console.error("Error logging sleep:", err);
      alert("❌ Failed to log sleep. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6">
      <TopMenuButton /> 
      <h1 className="text-4xl font-bold text-white mb-6">Sleep Tracker</h1>

      {/* Show date + user ID */}
      {user && (
        <div className="mb-6 text-center text-white">
          <p>Date: <span className="font-semibold">{today}</span></p>
          <p>User ID: <span className="font-mono">{user?.email ?? user?.displayName}</span></p>
        </div>
      )}

      <div className=" border border-white rounded-lg backdrop-blur-lg p-6 rounded-xl shadow-lg w-full max-w-md text-black">
        <label className="block mb-4">
          <span className="text-white">🛏 Bedtime</span>
          <input
            type="time"
            value={bedtime}
            onChange={(e) => setBedtime(e.target.value)}
            className="w-full p-2 rounded mt-1"
          />
        </label>

        <label className="block mb-4">
          <span className="text-white">⏰ Wake-up Time</span>
          <input
            type="time"
            value={wakeup}
            onChange={(e) => setWakeup(e.target.value)}
            className="w-full p-2 rounded mt-1"
          />
        </label>

        <button
          onClick={logSleep}
          disabled={loading}
          className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition"
        >
          {loading ? "⏳ Logging..." : "Log Sleep"}
        </button>
      </div>

      <button
        onClick={() => router.push("/dashboard")}
        className="mt-6 px-4 py-2 bg-red-600 rounded-lg hover:bg-red-500 transition"
      >
        ⬅ Go Back
      </button>
    </main>
  );
}
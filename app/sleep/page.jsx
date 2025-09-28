"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { doc, collection, addDoc, getDocs } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import TopMenuButton from "../../components/TopMenuButton";
import ThemeToggle from "../../components/ThemeToggle";

export default function SleepLogPage() {
  const [bedtime, setBedtime] = useState("");
  const [wakeup, setWakeup] = useState("");
  const [quality, setQuality] = useState(5);
  const [isNap, setIsNap] = useState(false);
  const [goal, setGoal] = useState(8);
  const [logs, setLogs] = useState([]);
  const [weeklyAvg, setWeeklyAvg] = useState(null);
  const [sleepDebt, setSleepDebt] = useState(null);
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(false);
  const [todayProgress, setTodayProgress] = useState(0);
  const [weeklyProgress, setWeeklyProgress] = useState(0);
  const [badges, setBadges] = useState([]);

  const router = useRouter();
  const { user } = useAuth();

  const calculateDuration = (bed, wake) => {
    const [bh, bm] = bed.split(":").map(Number);
    const [wh, wm] = wake.split(":").map(Number);

    let start = new Date();
    start.setHours(bh, bm, 0, 0);

    let end = new Date();
    end.setHours(wh, wm, 0, 0);

    if (end <= start) end.setDate(end.getDate() + 1);

    const diff = (end - start) / (1000 * 60 * 60);
    return diff.toFixed(1);
  };

  const logSleep = async () => {
    if (!user) return alert("⚠️ Please log in to track sleep.");
    if (!bedtime || !wakeup) return alert("⚠️ Please enter both times.");

    setLoading(true);
    try {
      const today = new Date().toISOString().split("T")[0];
      const duration = calculateDuration(bedtime, wakeup);

      const dayCollection = collection(db, "sleepLogs", user.uid, today);

      await addDoc(dayCollection, {
        bedtime,
        wakeup,
        duration: Number(duration),
        quality,
        isNap,
        loggedAt: new Date(),
      });

      alert(`✅ Sleep logged! Duration: ${duration} hrs`);
      setBedtime("");
      setWakeup("");
      setQuality(5);
      setIsNap(false);
      fetchLogs();
    } catch (err) {
      console.error("Error logging sleep:", err);
      alert("❌ Failed to log sleep. Try again.");
    } finally {
      setLoading(false);
    }
  };
  
  const fetchLogs = async () => {
    if (!user) return;
    let past7days = [];

    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateKey = d.toISOString().split("T")[0];
      const dayCollection = collection(db, "sleepLogs", user.uid, dateKey);
      const snap = await getDocs(dayCollection);
      snap.forEach((doc) => past7days.push(doc.data()));
    }

    setLogs(past7days);

    if (past7days.length > 0) {
      const avg = past7days.reduce((acc, l) => acc + l.duration, 0) / past7days.length;
      setWeeklyAvg(avg.toFixed(1));

      const debt = past7days.reduce((acc, l) => acc + (goal - l.duration), 0);
      setSleepDebt(debt.toFixed(1));

      let count = 0;
      for (let i = 0; i < past7days.length; i++) {
        if (past7days[i].duration >= goal) count++;
        else break;
      }
      setStreak(count);

      const todayLog = past7days[0];
      if (todayLog) {
        setTodayProgress(Math.min((todayLog.duration / goal) * 100, 100));
      }
      setWeeklyProgress(Math.min((avg / goal) * 100, 100));

      const earned = [];
      if (count >= 7) earned.push("🏆 7-Day Streak");
      if (count >= 30) earned.push("🥇 30-Day Streak");
      if (avg >= goal) earned.push("💤 Weekly Goal Master");
      setBadges(earned);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [user]);

  useEffect(() => {
    const reminder = setInterval(() => {
      const now = new Date();
      if (now.getHours() === 22 && now.getMinutes() === 0) {
        alert("🌙 Reminder: Time to start winding down for bed!");
      }
    }, 60000);
    return () => clearInterval(reminder);
  }, []);

  return (
    <main className="min-h-screen flex flex-col items-center p-6 bg-gradient-to-tr from-black via-gray-900 to-gray-800 text-white">
      <TopMenuButton /> 
      <div className="absolute -top-20 -left-20 w-96 h-96 bg-purple-700 rounded-full blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute -bottom-20 -right-20 w-[28rem] h-[28rem] bg-indigo-700 rounded-full blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute  -bottom-1 -left-22 w-40 h-40 bg-indigo-700 rounded-full blur-3xl opacity-30 animate-pulse"></div>

      <h1 className="text-4xl font-bold text-purple-200 mb-6">😴 Sleep Tracker</h1>

      {/* Log Form */}
      <div className="bg-gradient-to-tr from-gray-950 to-gray-900 border-2 border-purple-300 rounded-2xl p-8 shadow-md w-full max-w-2xl min-h-[80vh] flex flex-col justify-center">
        <label className="block mb-6">
          <span className="text-purple-200 text-lg">🛏 Bedtime</span>
          <input
            type="time"
            value={bedtime}
            onChange={(e) => setBedtime(e.target.value)}
            className="w-full p-3 rounded mt-2 text-black"
          />
        </label>

        <label className="block mb-6">
          <span className="text-purple-200 text-lg">⏰ Wake-up Time</span>
          <input
            type="time"
            value={wakeup}
            onChange={(e) => setWakeup(e.target.value)}
            className="w-full p-3 rounded mt-2 text-black"
          />
        </label>

        <label className="block mb-6">
          <span className="text-purple-200 text-lg">⭐ Sleep Quality</span>
          <input
            type="range"
            min="1"
            max="10"
            value={quality}
            onChange={(e) => setQuality(Number(e.target.value))}
            className="w-full"
          />
          <p className="text-white mt-2">{quality} / 10</p>
        </label>

        <label className="flex items-center gap-2 mb-6 text-purple-200">
          <input
            type="checkbox"
            checked={isNap}
            onChange={(e) => setIsNap(e.target.checked)}
          />
          ☀ Log as Nap
        </label>

        <button
          onClick={logSleep}
          disabled={loading}
          className="w-full px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-500 transition"
        >
          {loading ? "⏳ Logging..." : "Log Sleep"}
        </button>
      </div>

      {/* Insights Section */}
      <div className="bg-gradient-to-tr from-gray-950 to-gray-900 border-2 border-purple-300 mt-10 p-8 rounded-2xl w-full max-w-2xl min-h-[80vh] shadow-md flex flex-col justify-center">
        <h2 className="text-2xl font-bold text-purple-200 mb-4">📊 Weekly Insights</h2>
        <p>Average: {weeklyAvg ?? "-"} hrs</p>
        <p>Sleep Debt: {sleepDebt ?? "-"} hrs (vs {goal}h goal)</p>
        <p>Streak: 🔥 {streak} days meeting goal</p>

        {/* Progress Bars */}
        <div className="mt-6">
          <p className="mb-2 text-purple-200">Today’s Progress</p>
          <div className="w-full bg-gray-700 rounded-full h-5">
            <div
              className="bg-purple-500 h-5 rounded-full"
              style={{ width: `${todayProgress}%` }}
            ></div>
          </div>
          <p className="text-sm mt-1">{todayProgress.toFixed(0)}% of goal</p>
        </div>

        <div className="mt-6">
          <p className="mb-2 text-purple-200">Weekly Progress</p>
          <div className="w-full bg-gray-700 rounded-full h-5">
            <div
              className="bg-purple-400 h-5 rounded-full"
              style={{ width: `${weeklyProgress}%` }}
            ></div>
          </div>
          <p className="text-sm mt-1">{weeklyProgress.toFixed(0)}% of goal</p>
        </div>

        {/* Achievements */}
        <div className="mt-6">
          <h3 className="font-bold text-purple-200 mb-2">🏅 Achievements</h3>
          {badges.length > 0 ? (
            <ul className="list-disc pl-5">
              {badges.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
          ) : (
            <p>No badges earned yet. Keep going! 💪</p>
          )}
        </div>

        <label className="block mt-6">
          <span className="text-purple-200 text-lg">🎯 Set Daily Goal (hrs)</span>
          <input
            type="number"
            value={goal}
            onChange={(e) => setGoal(Number(e.target.value))}
            className="w-full p-3 rounded mt-2 text-black"
          />
        </label>
      </div>

      <button
        onClick={() => router.push("/dashboard")}
        className="mt-10 px-6 py-3 bg-purple-600 rounded-lg hover:bg-purple-500 transition"
      >
        ⬅ Go Back
      </button>
    </main>
  );
}

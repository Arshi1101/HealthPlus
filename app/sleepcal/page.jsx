"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { collection, getDocs, doc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import TopMenuButton from "../../components/TopMenuButton"; 
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

export default function SleepCalendarPage() {
  const { user } = useAuth();
  const [logs, setLogs] = useState({});
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (user) fetchSleepLogs();
  }, [user]);

  const fetchSleepLogs = async () => {
    try {
      setLoading(true);
      const userDoc = doc(db, "sleepLogs", user.uid);
      const today = new Date();
      const currentMonth = today.getMonth();
      const currentYear = today.getFullYear();
      let logsMap = {};

      for (let d = 1; d <= 31; d++) {
        const dateObj = new Date(currentYear, currentMonth, d);
        if (dateObj.getMonth() !== currentMonth) break;

        const dateKey = dateObj.toISOString().split("T")[0];
        const dayCollection = collection(userDoc, dateKey);
        const snap = await getDocs(dayCollection);

        if (!snap.empty) {
          let totalDuration = 0;
          snap.forEach((doc) => {
            totalDuration += doc.data().duration || 0;
          });
          logsMap[dateKey] = totalDuration;
        } else {
          logsMap[dateKey] = null;
        }
      }

      setLogs(logsMap);
    } catch (err) {
      console.error("Error fetching sleep logs:", err);
    } finally {
      setLoading(false);
    }
  };

  const getColor = (hours) => {
    if (hours === null) return "bg-white/10 border border-white/20";
    if (hours < 6) return "bg-red-500 border border-white/20";
    if (hours <= 8) return "bg-yellow-400 border border-white/20";
    return "bg-green-600 border border-white/20";
  };

  const today = new Date();
  const currentMonth = today.toLocaleString("default", { month: "long" });
  const currentYear = today.getFullYear();
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Chart data
  const chartData = Object.keys(logs).map((date) => ({
    date: date.split("-")[2], // day of month
    hours: logs[date] ?? 0,
  }));

  const totalSleep = Object.values(logs).reduce((sum, val) => sum + (val ?? 0), 0);
  const avgSleep = logs ? (totalSleep / Object.keys(logs).length).toFixed(1) : 0;

  const pieData = [
    { name: "Sleep Achieved", value: avgSleep },
    { name: "Remaining", value: 8 - avgSleep > 0 ? 8 - avgSleep : 0 },
  ];
  const COLORS = ["#FACC15", "#1F2937"];

  return (
    <main className="min-h-screen bg-gradient-to-t from-yellow-600 via-black to-black flex flex-col items-center justify-start p-4 sm:p-6 text-white">
      <TopMenuButton /> 

      <h1 className="text-4xl mb-5"> Your <span className="text-yellow-700">Sleep Insights</span> This Month <span className="text-yellow-700 font-extrabold">.</span> </h1>
      <h2 className="text-lg sm:text-xl mb-4 text-center">
        {currentMonth} {currentYear}
      </h2>

      {/* Calendar */}
      {loading ? (
        <p className="mt-6">⏳ Loading...</p>
      ) : (
        <div className="backdrop-blur-lg bg-black/50 border border-yellow-700 mt-7 mb-7 p-3 sm:p-5 rounded-2xl shadow-2xl border border-white/20 w-full max-w-4xl">
          {/* Weekday Header */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2 text-xs sm:text-sm">
            {weekdays.map((day) => (
              <div key={day} className="text-center font-semibold text-gray-300">{day}</div>
            ))}
          </div>

          {/* Days */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {[...Array(daysInMonth)].map((_, i) => {
              const day = i + 1;
              const dateKey = new Date(today.getFullYear(), today.getMonth(), day)
                .toISOString()
                .split("T")[0];
              const hours = logs[dateKey] ?? null;

              return (
                <div
                  key={day}
                  className={`aspectRatio: 1 / 0.8 flex flex-col justify-center items-center rounded-lg text-center text-xs sm:text-sm ${getColor(hours)}`}
                >
                  <span className="font-bold">{day}</span>
                  <span className="text-[10px] sm:text-xs">{hours ? `${hours}h` : "-"}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Visual Insights */}
      <h1 className="text-4xl mb-5">  <span className="text-yellow-700">Visual</span> Insights<span className="text-yellow-700 font-extrabold">.</span> </h1>
      
      <div className="mt-6 flex flex-col  sm:flex-row gap-6 w-full max-w-3xl">
        {/* Bar Chart */}
        <div className="bg-black/50 rounded-2xl border border-yellow-700 p-4 flex-1 shadow-lg">
          <h3 className="text-white font-semibold mb-2 text-center">Daily Sleep Hours</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData}>
              <XAxis dataKey="date" stroke="#FACC15" />
              <YAxis stroke="#FACC15" />
              <Tooltip contentStyle={{ backgroundColor: "#1F2937", borderRadius: "8px" }} />
              <Bar dataKey="hours" fill="#FACC15" radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <p className="items-center text-center font-bold">dates➡️</p>
        </div>

        {/* Radial / Pie Chart */}
        <div className="bg-black/50 rounded-2xl border border-yellow-700 p-4 flex-1 shadow-lg flex flex-col items-center justify-center">
          <h3 className="text-white font-semibold mb-2 text-center">Average Sleep</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart >
              <Pie
                data={pieData}
                innerRadius={50}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <p className="mt-2 text-yellow-400 font-bold text-lg">{avgSleep} h/day</p>
        </div>
      </div>

      {/* Go Back */}
      <button
        onClick={() => router.push("/dashboard")}
        className="mt-6 px-4 py-2 text-sm sm:text-base bg-black rounded-lg hover:bg-red-500 transition"
      >
        ⬅ Go Back
      </button>
    </main>
  );
}
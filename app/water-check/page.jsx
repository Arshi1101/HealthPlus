"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase"; 
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext"; 
import { useRouter } from "next/navigation";
import TopMenuButton from "../../components/TopMenuButton";  

export default function WaterCheckPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [weight, setWeight] = useState("");
  const [glasses, setGlasses] = useState(0);
  const [loading, setLoading] = useState(true);
  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

  const waterPerKg = 35; // ml per kg
  const glassSize = 250; // ml
  const recommended = weight ? weight * waterPerKg : 0;
  const consumed = glasses * glassSize;
  const percentage = recommended ? Math.min((consumed / recommended) * 100, 100) : 0;


  useEffect(() => {
    alert("💧 Reminder: Your water tracker resets every midnight!");
  }, []);

  
  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      setLoading(true);
      const ref = doc(db, "users", user.uid, "waterIntake", today);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        const data = snap.data();
        setWeight(data.weight || "");
        setGlasses(data.glasses || 0);
      }
      setLoading(false);
    };

    fetchData();
  }, [user, today]);

  
  useEffect(() => {
    if (!user || !weight) return;

    const saveData = async () => {
      const ref = doc(db, "users", user.uid, "waterIntake", today);
      await setDoc(ref, {
        weight,
        glasses,
        consumed,
        recommended,
        date: today,
      });
    };

    saveData();
  }, [user, weight, glasses]);

  if (!user) {
    return <p className="text-center text-white mt-20 text-lg">Please log in to track water intake.<br></br>
    <a
          className="underline text-indigo-600 hover:text-blue-500"
          href="/auth/login"
        >
          Login
        </a></p>;
  }

  if (loading) return <p className="text-center mt-20">Loading...</p>;

  return (
    <main className="min-h-screen firstpageanim text-white flex flex-col items-center py-12 px-6">
      
      <TopMenuButton /> <h1 className="text-3xl mt-4 hover:text-green-100 font-bold mb-2">
        💧 Water Intake Tracker
      </h1>
      <p className="mb-6 text-gray-300">
        Welcome, {user.email ?? user.displayName}👋
      </p>

      

      {/* Input for weight */}
      <div className="bg-gradient-to-r from-indigo-500 via-blue-500 to-indigo-400 border p-6 rounded-2xl shadow-lg w-full max-w-md">
        <label className="block text-lg mb-2">Enter your weight (kg):</label>
        <input
          type="number"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          className="w-full px-4 py-2 rounded-lg text-black outline-none"
          placeholder="e.g. 60"
        />

        {weight && (
          <p className="mt-3 text-sm text-white">
            Recommended:{" "}
            <span className="font-semibold text-blue-300">
              {(recommended / 1000).toFixed(1)} L
            </span>{" "}
            per day
          </p>
        )}
      </div>

      {/* Progress Tracker */}
      {weight && (
        <div className="mt-5 w-full max-w-md bg-gradient-to-r from-indigo-400 via-purple-400 to-purple-500 border p-6 rounded-2xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Your Progress</h2>

          <div className="w-full bg-gray-700 rounded-full h-4 mb-4">
            <div
              className="bg-green-400 h-4 rounded-full transition-all duration-300"
              style={{ width: `${percentage}%` }}
            ></div>
          </div>

          <p className="text-gray-300 mb-4">
            {glasses} glasses ({(consumed / 1000).toFixed(2)} L) /{" "}
            {(recommended / 1000).toFixed(2)} L
          </p>

          {/* 🎉 Celebration message */}
          {consumed >= recommended && (
            <p className="text-green-300 font-bold text-lg mb-4 animate-bounce">
              🎉 Yay! You reached your daily goal!
            </p>
          )}

          <div className="flex gap-4 flex-wrap">
            <button
              onClick={() => setGlasses((g) => g + 1)}
              className="px-3 py-1 border rounded-lg bg-green-600 border-black hover:bg-green-500 transition"
            >
              + Add Glass
            </button>
            <button
              onClick={() => setGlasses((g) => Math.max(0, g - 1))}
              className="px-3 py-1 border rounded-lg border-black bg-red-600 hover:bg-red-500 transition"
            >
              - Remove
            </button>
            <button
              onClick={() => setGlasses(0)}
              className="px-3 py-1 rounded-lg border border-black bg-gray-500 hover:bg-gray-400 transition"
            >
              Reset
            </button>
          </div>
          
        </div>
        
      )}
      {/* Go Back Button */}
      
      <button
        onClick={() => router.push("/dashboard")}
        className="mb-6 mt-3 px-2 py-1 bg-blue-600 rounded-lg  border hover:bg-red-500 transition"
      >
        ⬅ Go Back
      </button>
    </main>
  );
}
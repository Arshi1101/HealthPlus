"use client";

import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import TopMenuButton from "../../components/TopMenuButton";  

export default function NutritionCalendar() {
  const [date, setDate] = useState(new Date());
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  const handleDateChange = (selectedDate) => {
    const dateObj = Array.isArray(selectedDate) ? selectedDate[0] : selectedDate;
    setDate(dateObj);
  };

  const fetchSummary = async (dateObj) => {
    if (!user) return;
    setLoading(true);
    try {
      const formattedDate = dateObj.toISOString().split("T")[0];
      const res = await fetch(`/api/nut?uid=${user.uid}&date=${formattedDate}`);
      const data = await res.json();
      setSummary(data);
    } catch (err) {
      console.error("Failed to fetch summary:", err);
      setSummary(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  if (user) {
    fetch(`/api/nut?uid=${user.uid}&date=${date.toISOString().split("T")[0]}`)
      .then(res => res.json())
      .then(setSummary)
      .catch(console.error);
  }
}, [date, user]);


  return (
    <main className="min-h-screen p-6 flex flex-col items-center">
      <TopMenuButton /> 
      <h1 className="text-4xl font-bold text-white mb-6">📅 Nutrition Calendar</h1>

      <div className="bg-white rounded-lg shadow-md p-4">
        <Calendar onChange={handleDateChange} value={date} selectRange={false} />
      </div>

      <div className="mt-6 w-full md:w-2/3 lg:w-1/2 bg-gradient-to-r border from-blue-400 via-indigo-600 to-yellow-400 p-6 rounded-lg shadow-lg text-white">
        <h2 className="text-2xl font-semibold mb-4">{date.toDateString()} Summary</h2>

        {loading && <p>Loading...</p>}

        {!loading && summary ? (
          <>
            
            <p>🔥 Calories: {summary.calories || 0} kcal</p>
            <p>🍗 Protein: {summary.protein_g || 0} g</p>
            <p>🍞 Carbs: {summary.carbohydrates_total_g || 0} g</p>
            <p>🥑 Fat: {summary.fat_total_g || 0} g</p>
            <p>🍬 Sugar: {summary.sugar_g || 0} g</p>
            <p>🧂 Cholesterol: {summary.cholesterol_mg || 0} mg</p>
            <p>🧂 Sodium: {summary.sodium_mg || 0} mg</p>
            <p>🥔 Potassium: {summary.potassium_mg || 0} mg</p>
          </>
        ) : (
          !loading && <p>No data for this day.</p>
        )}
      </div>

      <button
        onClick={() => router.push("/dashboard")}
        className="mb-6 mt-6 px-2 py-1 bg-red-600 rounded-lg border hover:bg-red-500 transition"
      >
        ⬅ Go Back
      </button>
    </main>
  );
}
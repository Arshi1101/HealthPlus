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
      console.log("📅 Fetching nutrition for:", formattedDate);

      const res = await fetch(`/api/nut?uid=${user.uid}&date=${formattedDate}`);
      const raw = await res.json();

      console.log("📦 Raw API response:", raw);

      // Normalize logs to a flat array
      let items = [];
      if (!raw) {
        items = [];
      } else if (Array.isArray(raw)) {
        items = raw;
      } else if (Array.isArray(raw.items)) {
        items = raw.items;
      } else if (Array.isArray(raw.logs)) {
        items = raw.logs;
      } else {
        items = [raw];
      }

      console.log("📊 Normalized items:", items);

      // Sum up values
      const totals = items.reduce(
        (acc, it) => {
          acc.protein_g += Number(it.protein_g || 0);
          acc.carbohydrates_total_g += Number(it.carbohydrates_total_g || 0);
          acc.fat_total_g += Number(it.fat_total_g || 0);
          acc.sugar_g += Number(it.sugar_g || 0);
          acc.cholesterol_mg += Number(it.cholesterol_mg || 0);
          acc.sodium_mg += Number(it.sodium_mg || 0);
          acc.potassium_mg += Number(it.potassium_mg || 0);
          return acc;
        },
        {
          protein_g: 0,
          carbohydrates_total_g: 0,
          fat_total_g: 0,
          sugar_g: 0,
          cholesterol_mg: 0,
          sodium_mg: 0,
          potassium_mg: 0,
        }
      );

      console.log("✅ Summed totals:", totals);

      // Recalculate calories
      const calories =
        totals.protein_g * 4 +
        totals.carbohydrates_total_g * 4 +
        totals.fat_total_g * 9;

      console.log("🔥 Recalculated calories:", calories);

      setSummary({
        ...totals,
        calories: Math.round(calories),
      });
    } catch (err) {
      console.error("❌ Failed to fetch summary:", err);
      setSummary(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchSummary(date);
    }
  }, [date, user]);

  return (
    <>
      <style jsx global>{`
        .react-calendar {
          background: white;
          color: black;
          border: none;
          border-radius: 8px;
          padding: 8px;
        }
        .react-calendar__tile {
          color: black !important;
        }
        .react-calendar__month-view__weekdays__weekday abbr {
          color: black !important;
          text-decoration: none;
          font-weight: 600;
        }
        .react-calendar__navigation button {
          color: black !important;
        }
        .react-calendar__tile--now {
          color: black !important;
          font-weight: 700;
        }
        .react-calendar__tile--active {
          background: #cdb4db !important;
          color: white !important;
          border-radius: 6px !important;
        }
      `}</style>

      <main className="min-h-screen flex flex-col items-center p-6 bg-gradient-to-tr from-black via-gray-900 to-gray-800 text-white">
        <TopMenuButton />
        <h1 className="text-4xl font-bold text-purple-200 mb-6">
          📅 Nutrition Calendar
        </h1>

        {/* Calendar Box */}
        <div className="bg-white border-2 border-purple-300 rounded-2xl shadow-md p-4">
          <Calendar
            onChange={handleDateChange}
            value={date}
            selectRange={false}
            className="rounded-lg p-2"
          />
        </div>

        {/* Daily Summary */}
        <div className="mt-6 w-full md:w-2/3 lg:w-1/2 bg-gradient-to-tr from-gray-950 to-gray-900 border-2 border-purple-300 p-6 rounded-2xl shadow-md">
          <h2 className="text-2xl font-semibold text-purple-200 mb-4">
            Nutrition Summary for {date.toDateString()}
          </h2>

          {loading && <p className="text-gray-400">Loading...</p>}

          {!loading && summary ? (
            <div className="space-y-2 text-lg">
              <p>🔥 <span className="text-purple-200">Calories:</span> {summary.calories || 0} kcal</p>
              <p>🍗 <span className="text-purple-200">Protein:</span> {summary.protein_g || 0} g</p>
              <p>🍞 <span className="text-purple-200">Carbs:</span> {summary.carbohydrates_total_g || 0} g</p>
              <p>🥑 <span className="text-purple-200">Fat:</span> {summary.fat_total_g || 0} g</p>
              <p>🍬 <span className="text-purple-200">Sugar:</span> {summary.sugar_g || 0} g</p>
              <p>🧂 <span className="text-purple-200">Cholesterol:</span> {summary.cholesterol_mg || 0} mg</p>
              <p>🧂 <span className="text-purple-200">Sodium:</span> {summary.sodium_mg || 0} mg</p>
              <p>🥔 <span className="text-purple-200">Potassium:</span> {summary.potassium_mg || 0} mg</p>
            </div>
          ) : (
            !loading && <p className="text-gray-400">No data for this day.</p>
          )}
          
        </div>
        {/* Go Back Button */}
        <button
          onClick={() => router.back()}
          className="mt-6 px-4 py-2 rounded-lg font-bold"
          style={{ backgroundColor: "#cdb4db", color: "#000" }}
        >
          🔙 Go Back
        </button>
      </main>
    </>
  );
}

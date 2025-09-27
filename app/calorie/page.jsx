"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { doc, collection, addDoc } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import TopMenuButton from "../../components/TopMenuButton"; 
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend, BarChart, Bar, XAxis, YAxis } from "recharts";

export default function KnowYourFoodComparison() {
  const [food1, setFood1] = useState("");
  const [food2, setFood2] = useState("");
  const [result1, setResult1] = useState(null);
  const [result2, setResult2] = useState(null);
  const [error1, setError1] = useState("");
  const [error2, setError2] = useState("");
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [showCompareOption, setShowCompareOption] = useState(false);
  const [showFood2Input, setShowFood2Input] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  const COLORS = ["#FACC15", "#10B981", "#3B82F6", "#EF4444"];

  const fetchNutrition = async (food, setResult, setError, setLoading, isFood1 = true) => {
    if (!food) return;
    setError("");
    setResult(null);
    setLoading(true);

    try {
      const res = await fetch(
        `https://api.calorieninjas.com/v1/nutrition?query=${food}`,
        {
          headers: { "X-Api-Key": process.env.NEXT_PUBLIC_CALORIE_API_KEY },
        }
      );

      if (!res.ok) throw new Error("API request failed");
      const data = await res.json();

      if (data.items && data.items.length > 0) {
        const formatted = { ...data.items[0] };
        // Round nutrient data to 2 decimal places
        ["calories","protein_g","carbohydrates_total_g","fat_total_g","sugar_g","fiber_g","cholesterol_mg","sodium_mg","potassium_mg"].forEach(key => {
          formatted[key] = formatted[key] ? Number(formatted[key].toFixed(2)) : 0;
        });
        setResult(formatted);

        if (isFood1) setShowCompareOption(true);
      } else {
        setError("Food not found 😔");
      }
    } catch (err) {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const logToCalendar = async (result) => {
    if (!user || !result) return alert("⚠️ Please log in to save items.");

    try {
      const today = new Date().toISOString().split("T")[0];
      const userDoc = doc(db, "nutritionLogs", user.uid);
      const dayCollection = collection(userDoc, today);

      await addDoc(dayCollection, {
        ...result,
        loggedAt: new Date(),
      });

      alert(`✅ ${result.name} logged to today's consumption!`);
    } catch (err) {
      console.error(err);
      alert("❌ Failed to log item. Try again.");
    }
  };

  const getPieData = (result) => {
    if (!result) return [];
    return [
      { name: "Protein", value: result.protein_g },
      { name: "Carbs", value: result.carbohydrates_total_g },
      { name: "Fat", value: result.fat_total_g },
      { name: "Other Calories", value: Math.max(result.calories - (result.protein_g*4 + result.carbohydrates_total_g*4 + result.fat_total_g*9), 0) },
    ];
  };

  const getComparisonData = () => {
    if (!result1 || !result2) return [];
    return [
      { nutrient: "Protein", Food1: result1.protein_g, Food2: result2.protein_g },
      { nutrient: "Carbs", Food1: result1.carbohydrates_total_g, Food2: result2.carbohydrates_total_g },
      { nutrient: "Fat", Food1: result1.fat_total_g, Food2: result2.fat_total_g },
      { nutrient: "Calories", Food1: result1.calories, Food2: result2.calories },
    ];
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-between p-6">
      <TopMenuButton /> 

      <div className="flex flex-col md:flex-row items-center justify-center w-full">
        {/* Left Food Input */}
        <div className="w-full md:w-1/3 flex flex-col items-center mb-6 md:mb-0">
          <h2 className="text-3xl text-white font-bold mb-4">🥗 First Choice</h2>
          <input
            type="text"
            value={food1}
            onChange={(e) => setFood1(e.target.value)}
            placeholder="Enter food item"
            className="mb-2 w-64 p-2 rounded-md bg-gray-200 text-black"
          />
          <button
            onClick={() => fetchNutrition(food1, setResult1, setError1, setLoading1, true)}
            className="px-6 py-2 bg-green-200 rounded-lg hover:bg-white/30 transition mb-4"
          >
            {loading1 ? "⏳ Checking..." : "Check Nutrition"}
          </button>
          {result1 && (
            <>
            <div className="border bg-gradient-to-r from-indigo-400 via-purple-400 to-yellow-200 p-4 rounded-lg hover:scale-105 text-left w-64">
              <h3 className="text-xl font-semibold capitalize">{result1.name}</h3>
              <p>Calories: {result1.calories}</p>
              <p>Protein: {result1.protein_g} g</p>
              <p>Carbs: {result1.carbohydrates_total_g} g</p>
              <p>Fat: {result1.fat_total_g} g</p>
              <button
                onClick={() => logToCalendar(result1)}
                className="mt-2 px-4 py-2 bg-indigo-900 text-white rounded-lg hover:bg-purple-600 w-full"
              >
                ✅ Log this item
              </button>

              {/* Pie chart */}
              <div className="mt-4 w-full h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={getPieData(result1)}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={60}
                      fill="#8884d8"
                      label
                    >
                      {getPieData(result1).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: "#1F2937", borderRadius: "8px" }} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Option to compare */}
            {showCompareOption && !showFood2Input && (
              <button
                onClick={() => setShowFood2Input(true)}
                className="mt-4 px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-400 transition"
              >
                Compare with another food?
              </button>
            )}
            </>
          )}
          {error1 && <p className="text-red-300 mt-2">{error1}</p>}
        </div>

        {/* Second Food Input */}
        {showFood2Input && (
          <div className="w-full md:w-1/3 flex flex-col items-center mb-6 md:mb-0">
            <h2 className="text-3xl text-white font-bold mb-4">🍛 Second Choice</h2>
            <input
              type="text"
              value={food2}
              onChange={(e) => setFood2(e.target.value)}
              placeholder="Enter food item"
              className="mb-2 w-64 p-2 rounded-md bg-gray-200 text-black"
            />
            <button
              onClick={() => fetchNutrition(food2, setResult2, setError2, setLoading2, false)}
              className="px-6 py-2 bg-green-200 rounded-lg hover:bg-white/30 transition mb-4"
            >
              {loading2 ? "⏳ Checking..." : "Check Nutrition"}
            </button>

            {result2 && (
              <>
              <div className="border bg-gradient-to-r from-indigo-400 via-purple-400 to-yellow-200 p-4 rounded-lg hover:scale-105 text-left w-64 mb-6">
                <h3 className="text-xl font-semibold capitalize">{result2.name}</h3>
                <p>Calories: {result2.calories}</p>
                <p>Protein: {result2.protein_g} g</p>
                <p>Carbs: {result2.carbohydrates_total_g} g</p>
                <p>Fat: {result2.fat_total_g} g</p>
                <button
                  onClick={() => logToCalendar(result2)}
                  className="mt-2 px-4 py-2 bg-indigo-900 text-white rounded-lg hover:bg-purple-600 w-full"
                >
                  ✅ Log this item
                </button>

                {/* Pie chart */}
                <div className="mt-4 w-full h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={getPieData(result2)}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={60}
                        fill="#8884d8"
                        label
                      >
                        {getPieData(result2).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: "#1F2937", borderRadius: "8px" }} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Comparative Bar Chart */}
              <div className="w-full max-w-md h-64 mb-6">
                <h3 className="text-center text-white font-semibold mb-2">Comparison</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={getComparisonData()}>
                    <XAxis dataKey="nutrient" stroke="#FACC15" />
                    <YAxis stroke="#FACC15" />
                    <Tooltip contentStyle={{ backgroundColor: "#1F2937", borderRadius: "8px" }} />
                    <Legend />
                    <Bar dataKey="Food1" fill="#3B82F6" />
                    <Bar dataKey="Food2" fill="#EF4444" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              </>
            )}
            {error2 && <p className="text-red-300 mt-2">{error2}</p>}
          </div>
        )}
      </div>

      {/* Go Back Button */}
      <div className="w-full flex justify-center mt-10">
        <button
          onClick={() => router.push("/dashboard")}
          className="px-4 py-2 bg-red-600 rounded-lg hover:bg-red-500 transition"
        >
          ⬅ Go Back
        </button>
      </div>
    </main>
  );
}
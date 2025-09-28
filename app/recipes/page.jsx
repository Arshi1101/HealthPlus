"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import TopMenuButton from "../../components/TopMenuButton";

export default function RecipesPage() {
  const [query, setQuery] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState({}); 
  const [filters, setFilters] = useState({ cuisine: "", course: "", diet: "" });
  const router = useRouter();

  const fetchRecipes = async () => {
    if (!query && !filters.cuisine && !filters.course && !filters.diet) return;

    setError("");
    setRecipes([]);
    setLoading(true);

    try {
      const params = new URLSearchParams({
        q: query,
        cuisine: filters.cuisine,
        course: filters.course,
        diet: filters.diet,
      });

      const res = await fetch(`/api/recipes?${params}`);
      if (!res.ok) throw new Error("Failed to fetch recipes");

      const data = await res.json();
      if (!data || data.length === 0) {
        setError("❌ No recipes found. Try another search.");
      } else {
        setRecipes(data);
      }
    } catch (err) {
      setError("⚠️ Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-white relative overflow-hidden">
      <TopMenuButton /> 
      <div className="absolute -top-20 -left-20 w-96 h-96 bg-purple-700 rounded-full blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute -bottom-20 -right-20 w-[28rem] h-[28rem] bg-indigo-700 rounded-full blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute  -bottom-1 -left-22 w-40 h-40 bg-indigo-700 rounded-full blur-3xl opacity-30 animate-pulse"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full md:w-3/4 lg:w-2/3 bg-white/10 backdrop-blur-xl p-10 rounded-2xl shadow-2xl border"
      >
        <h1 className="text-4xl font-extrabold mb-6 text-center bg-gradient-to-r from-yellow-300 to-pink-400 bg-clip-text text-transparent">
          🍲 Explore Recipes
        </h1>

        {/* Search & Filters */}
        <div className="flex flex-col gap-4 mb-6">
          {/* Search bar */}
          <div className="flex w-full gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter a dish name (e.g., pasta, biryani)"
              className="px-4 py-3 w-full rounded-lg text-black shadow-inner focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={fetchRecipes}
              className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg font-semibold shadow-lg"
            >
              Search
            </motion.button>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            <select
              value={filters.cuisine}
              onChange={(e) => setFilters({ ...filters, cuisine: e.target.value })}
              className="px-3 py-2 rounded-lg text-black"
            >
              <option value="">All Cuisines</option>
              <option value="Indian">Indian</option>
              <option value="Italian Recipes">Italian Recipies</option>
              <option value="Chinese">Chinese</option>
              <option value="Fusion">Fusion</option>
              <option value="Continental">Continental</option> 
            </select>

            <select
              value={filters.course}
              onChange={(e) => setFilters({ ...filters, course: e.target.value })}
              className="px-3 py-2 rounded-lg text-black"
            >
              <option value="">All Courses</option>
              <option value="Starter">Starter</option>
              <option value="Main">Main</option>
              <option value="Dessert">Dessert</option>
              <option value="Lunch">Lunch</option>
              <option value="Appetizer">Appetizer</option>
              <option value="Dinner">Dinner</option>
              <option value="Side dish">Side dish</option>
            </select>

            <select
              value={filters.diet}
              onChange={(e) => setFilters({ ...filters, diet: e.target.value })}
              className="px-3 py-2 rounded-lg text-black"
            >
              <option value="">All Diets</option>
              <option value="Vegetarian">Vegetarian</option>
              <option value="Vegan">Vegan</option>
              <option value="Non Vegeterian">Non Vegeterian</option>
            </select>
          </div>
        </div>

        {/* Error */}
        {error && <p className="text-red-300 mb-4">{error}</p>}

        {/* Loading */}
        

        {/* Results */}
<div className="space-y-6">
  {recipes.map((meal, idx) => (
    <motion.div
      key={idx}
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="p-6 bg-white/20 rounded-xl shadow-md"
    >
      <h2 className="text-2xl font-bold mb-2">{meal.name}</h2>

      

      <p className="text-sm mb-1">
        <strong>Cuisine:</strong> {meal.cuisine || "N/A"}
      </p>
      <p className="text-sm mb-1">
        <strong>Course:</strong> {meal.course || "N/A"}
      </p>
      <p className="text-sm mb-3">
        <strong>Diet:</strong> {meal.diet || "N/A"}
      </p>

      {/* Show More button */}
      <button
        onClick={() =>
          setExpanded((prev) => ({
            ...prev,
            [idx]: !prev[idx],
          }))
        }
        className="mt-2 px-3 py-1 bg-blue-500 rounded-lg hover:bg-blue-400 transition"
      >
        {expanded[idx] ? "Hide Details" : "Show More"}
      </button>

      {/* Expanded Content (Ingredients + Instructions) */}
      {expanded[idx] && (
        <div className="mt-4">
          {/* Ingredients */}
          <div className="mb-3">
            <h3 className="font-semibold mb-1">🛒 Ingredients:</h3>
            <ul className="list-disc list-inside text-sm space-y-1">
              {meal.ingredients_name?.split(",").map((ing, i) => (
                <li key={i}>
                  {ing} - {meal.ingredients_quantity?.split(",")[i] || ""}
                </li>
              ))}
            </ul>
          </div>

          {/* Instructions */}
          <p className="text-sm whitespace-pre-line">{meal.instructions}</p>

          {/* Prep & Cook Time */}
          <p className="text-sm mt-3">
            ⏱ Prep Time: {meal.prep_time} mins | Cook Time: {meal.cook_time} mins
          </p>
        </div>
      )}
    </motion.div>
  ))}
</div>


        {/* Back Button */}
        <button
          onClick={() => router.push("/dashboard")}
          className="mt-10 px-4 py-2 bg-red-600 rounded-lg border hover:bg-red-500 transition"
        >
          ⬅ Go Back
        </button>
      </motion.div>
    </main>
  );
}
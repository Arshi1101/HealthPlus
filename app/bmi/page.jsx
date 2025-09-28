"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import TopMenuButton from "../../components/TopMenuButton";

export default function BMICalculatorPage() {
  const [weight, setWeight] = useState(""); 
  const [height, setHeight] = useState(""); 
  const [bmi, setBmi] = useState(null);
  const [error, setError] = useState("");
  const [category, setCategory] = useState("");
  const router = useRouter();

  
  const calculateBMI = () => {
    if (!weight || !height) return;

    if (!weight || !height) {
      setError("⚠️ Please enter both weight and height.");
      return;
    }
    if (weight <= 0 || height <= 0) {
      setError("❌ Weight and height must be positive numbers.");
      return;
    }

    setError(""); 

    const heightInMeters = height / 100;
    const bmiValue = (weight / (heightInMeters * heightInMeters)).toFixed(2);
    setBmi(bmiValue);
    if (bmiValue < 18.5) setCategory("Underweight 🥦");
    else if (bmiValue >= 18.5 && bmiValue < 24.9) setCategory("Normal ✅");
    else if (bmiValue >= 25 && bmiValue < 29.9) setCategory("Overweight ⚠️");
    else setCategory("Obese 🚨");
  };

  return (
    <main className="min-h-screen flex flex-row  items-center justify-center 
      bg-gradient-to-r from-cyan  to-cyan text-white p-6 relative overflow-hidden">

      <TopMenuButton /> 
      <div className="absolute -top-10 -left-10 w-80 h-80 bg-purple-800 rounded-full blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute -bottom-20 -right-10 w-96 h-96 bg-indigo-800 rounded-full blur-3xl opacity-30 animate-pulse"></div>

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full md:w-1/2 flex flex-col items-center bg-white/10 hover:scale-105 backdrop-blur-lg p-10 rounded-2xl border  shadow-2xl"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6 bg-gradient-to-r from-purple-400 to-cyan-300 bg-clip-text text-transparent">
          ⚖️ BMI Calculator
        </h1>

        {/* Inputs */}
        <input
          type="number"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          placeholder="Enter weight (kg)"
          className="px-4 py-3 rounded-xl text-black w-80 mb-4 shadow-inner
          focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
        />

        <input
          type="number"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
          placeholder="Enter height (cm)"
          className="px-4 py-3 rounded-xl text-black w-80 mb-6 shadow-inner
          focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
        />

        {error && (
        <p className="mb-4 text-red-400 font-semibold">{error}</p>
        )}
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={calculateBMI}
          className="px-6 py-3 w-80 bg-gradient-to-r from-cyan-400 to-purple-500
          rounded-xl font-semibold shadow-lg hover:shadow-cyan-400/50
          transition text-lg"
        >
          🚀 Calculate BMI
        </motion.button>

        {/* Result */}
        {bmi && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-8 w-80 bg-gradient-to-r from-purple-600/60 to-cyan-600/60
            p-6 rounded-xl shadow-lg text-center border border-white/20"
          >
            <p className="text-lg">
              <span className="font-bold">Your BMI:</span>{" "}
              <span className="text-yellow-300 text-xl">{bmi}</span>
            </p>
            <p className="mt-3 text-lg font-semibold">{category}</p>
          </motion.div>
        )}
        <button
          onClick={() => router.push("/dashboard")}
          className="mb-1 mt-10 px-2 py-1 bg-purple-600 rounded-lg  border hover:bg-purple-500 transition"
        >
          ⬅ Go Back
        </button>
      </motion.div>
      
    </main>
  );
}
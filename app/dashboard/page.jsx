"use client";

import { useState } from "react";
import Link from "next/link";
import { Apple, Dumbbell, Brain } from "lucide-react"; // Lucide icons
import TopMenuButton from "../../components/TopMenuButton"; 
import ThemeToggle from "components/ThemeToggle";
export default function DashboardPage() {
  const [openTab, setOpenTab] = useState(null);

  const categories = [
    {
      name: "Nutrition & Diet",
      icon: <Apple className="w-8 h-8" />,
      items: [
        { label: "Food Insights", href: "/calorie" },
        { label: "Nutrition Calendar", href: "/nut" },
        { label: "Healthy Recipes", href: "/recipes" },
        { label: "HealthBot", href: "/chatbot" },
      ],
    },
    {
      name: "Physical Wellness",
      icon: <Dumbbell className="w-8 h-8" />,
      items: [
        { label: "Water Check", href: "/water-check" },
        { label: "BMI Calculator", href: "/bmi" },
        { label: "Sleep Tracker", href: "/sleep" },
        { label: "Sleep Calendar", href: "/sleepcal" },
      ],
    },
    {
      name: "Mind & Mood",
      icon: <Brain className="w-8 h-8" />,
      items: [
        { label: "Journaling", href: "/diary" },
        { label: "Self-Assessment Tests", href: "/tests" },
      ],
    },
  ];

  return (
    <main className="min-h-screen w-full bg-gradient-to-b from-[#0a0f1c] to-black flex flex-col items-center px-6 py-16">
      <h1 className="text-4xl md:text-5xl font-bold mb-12 text-center bg-gradient-to-r from-[#8a58ce] via-[#00CAFF] to-[#4fff85] bg-clip-text text-transparent ">
        Explore Your Health Dashboard
      </h1>
<div className="absolute top-4 right-4 p-3 z-50">
        <ThemeToggle />
      </div>
      <TopMenuButton />
      <div className="flex flex-col md:flex-row gap-10">
        {categories.map((category, i) => (
          <div
            key={i}
            className="relative group w-full md:w-72 p-8 rounded-2xl 
              bg-white/10 
              border border-cyan-400/40 
              shadow-[0_0_5px_#00CAFF]
              hover:shadow-[0_0_30px_#8a58ce]
              hover:scale-104 transition-all duration-300 ease-out
              flex flex-col items-center justify-center text-center cursor-pointer"
            onClick={() => setOpenTab(openTab === i ? null : i)}
          >
            {/* Icon */}
            <div
              className="w-16 h-16 mb-4 flex items-center justify-center 
              rounded-full bg-gradient-to-r from-[#8a58ce] to-[#00CAFF] 
              text-white shadow-[0_0_20px_#00CAFF]"
            >
              {category.icon}
            </div>

            {/* Title */}
            <h3 className="text-2xl font-bold bg-gradient-to-r from-[#8a58ce] to-[#00CAFF] bg-clip-text text-transparent">
              {category.name}
            </h3>

            {/* Dropdown */}
            {openTab === i && (
              <div className="absolute top-full mt-4 w-64 bg-black/60  border border-cyan-400/30 rounded-xl p-4 shadow-[0_0_5px_#00CAFF]">
                {category.items.map((item, j) => (
                  <Link
                    key={j}
                    href={item.href}
                    className="block px-4 py-2 rounded-lg text-white hover:bg-white/10 hover:text-cyan-300 transition"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}